import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';
import { validateValue } from './validate-contracts.mjs';

const unitDir = 'content/units/101-lendo-textos-mais-autonomia';
const lessonsDir = path.join(unitDir, 'lessons');
const lessonFiles = fs.readdirSync(lessonsDir).filter(file => file.endsWith('.json')).sort();
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const lessonSchema = readJson('schemas/lesson.schema.json');
const verificationSchema = readJson('schemas/verification.schema.json');
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });

const issues = [];
const interactions = new Map();
const lessonSummary = [];
const evidenceRequirements = [];
const sourceRequirements = [];
const openProductions = [];
const multimodal = [];
const sourceMetadataActivities = [];
const runtimes = new Map();
const media = { controlledAudio: new Set(), images: new Set(), video: new Set(), ttsDocuments: 0 };

const issue = message => issues.push(message);
const count = key => interactions.set(key, (interactions.get(key) || 0) + 1);

function authoredBlocks(source) {
  if (Array.isArray(source.sequence)) return source.sequence.filter(item => item?.id);
  if (Array.isArray(source.items)) return source.items.filter(item => item?.id);
  return [];
}

function collectMedia(source) {
  const spec = source.media || {};
  if (spec.tts && !/^nao|não/i.test(String(spec.tts))) media.ttsDocuments += 1;
  for (const [key, target] of [['controlledAudio', media.controlledAudio], ['images', media.images], ['video', media.video]]) {
    const raw = spec[key];
    const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
    for (const value of values) if (!/^nao|não|nenhuma/i.test(String(value))) target.add(String(value));
  }
}

function isOpen(block) {
  return String(block?.responseMode || '').startsWith('free-text')
    || /quick-open-summary|assessment-open/i.test(String(block?.type || ''));
}

function evidenceSelectionNeeded(block) {
  return Boolean(
    block?.requiredEvidence
    || block?.requiredEvidenceParts
    || block?.acceptableEvidence
  );
}

function hasSourceRequirement(block) {
  return Array.isArray(block?.evidenceSourcesRequired) && block.evidenceSourcesRequired.length > 0;
}

function hasAccessibleVisual(block) {
  const visual = block?.visual;
  return Boolean(visual && typeof visual === 'object' && typeof visual.accessibleEquivalent === 'string' && visual.accessibleEquivalent.trim());
}

function inspectAuthoredBlock(source, block) {
  if (isOpen(block)) openProductions.push(`${source.id}/${block.id}`);
  if (evidenceSelectionNeeded(block)) evidenceRequirements.push(`${source.id}/${block.id}`);
  if (hasSourceRequirement(block)) sourceRequirements.push(`${source.id}/${block.id}`);
  if (block.visual || block.visualBadge || /multimodal/i.test(String(block.type || ''))) multimodal.push(`${source.id}/${block.id}`);
  if (block.sourceMetadata) sourceMetadataActivities.push(`${source.id}/${block.id}`);

  if (block.visual && !hasAccessibleVisual(block)) {
    issue(`${source.id}/${block.id}: visual necessário sem accessibleEquivalent textual.`);
  }
  if (block.visualBadge && typeof block.visualBadge.accessibleEquivalent !== 'string') {
    issue(`${source.id}/${block.id}: visualBadge sem accessibleEquivalent textual.`);
  }
  if (Array.isArray(block.items)) {
    block.items.forEach((item, index) => {
      if (evidenceSelectionNeeded(item)) evidenceRequirements.push(`${source.id}/${block.id}/item-${index}`);
      if (hasSourceRequirement(item)) sourceRequirements.push(`${source.id}/${block.id}/item-${index}`);
      if (isOpen(item)) openProductions.push(`${source.id}/${block.id}/item-${index}`);
    });
  }
}

function auditSourceAvailability(source, authored, html) {
  if (!hasSourceRequirement(authored)) return;
  for (const requirement of authored.evidenceSourcesRequired) {
    if (requirement === 'bodyText') {
      if (typeof authored.bodyText !== 'string' || !authored.bodyText.trim()) {
        issue(`${source.id}/${authored.id}: exige bodyText, mas a autoria não fornece corpo textual.`);
      } else if (!html.includes(authored.bodyText)) {
        issue(`${source.id}/${authored.id}: bodyText necessário não aparece na apresentação pública.`);
      }
    }
    if (requirement === 'visual-or-accessible-equivalent') {
      const equivalent = authored.visual?.accessibleEquivalent;
      if (typeof equivalent !== 'string' || !equivalent.trim()) {
        issue(`${source.id}/${authored.id}: exige visual/equivalente acessível, mas accessibleEquivalent está ausente.`);
      } else if (!html.includes(equivalent)) {
        issue(`${source.id}/${authored.id}: equivalente acessível necessário não aparece na apresentação pública.`);
      }
    }
  }
}

function auditRuntime(source, schema, renderContext) {
  for (const block of authoredBlocks(source)) inspectAuthoredBlock(source, block);

  let runtime;
  try {
    runtime = service.normalize(source);
  } catch (error) {
    issue(`${source.id}: normalização falhou [${error.code || error.name}] ${error.message}`);
    return null;
  }

  runtimes.set(source.id, runtime);
  const schemaErrors = validateValue(schema, runtime, `${source.id} runtime`);
  if (schemaErrors.length) issue(`${source.id}: runtime inválido -> ${schemaErrors.join(' | ')}`);

  let html = '';
  try {
    html = documentHtml(runtime, renderContext);
    if (/Interação ainda não suportada/i.test(html)) issue(`${source.id}: renderer encontrou interação não suportada.`);
    if (/\b(?:schemaVersion|answerKey|correctIndex|requiredEvidence|evidenceSourcesRequired|automaticObservations|notAutomaticallyJudged|humanOrExternalReview|completionEvidence|designPrinciples)\b/i.test(html)) {
      issue(`${source.id}: metadado técnico/autoral vazou no HTML público.`);
    }
  } catch (error) {
    issue(`${source.id}: renderização falhou -> ${error.message}`);
  }

  const byId = new Map((runtime.blocks || []).map(block => [block.id, block]));
  for (const authored of authoredBlocks(source)) {
    const normalized = byId.get(authored.id);
    const relevant = authored.correctIndex !== undefined || Array.isArray(authored.items) || isOpen(authored) || evidenceSelectionNeeded(authored) || hasSourceRequirement(authored) || authored.visual || authored.sourceMetadata;
    if (relevant && !normalized) {
      issue(`${source.id}/${authored.id}: bloco relevante desapareceu do runtime.`);
      continue;
    }

    if (isOpen(authored)) {
      if (normalized?.activity?.evaluation?.mode !== 'RELIABLE_EVALUATOR') {
        issue(`${source.id}/${authored.id}: resumo/produção aberta deve permanecer RELIABLE_EVALUATOR.`);
      }
      if (normalized?.activity?.evidence?.recordResponse !== true) {
        issue(`${source.id}/${authored.id}: produção aberta precisa persistir resposta.`);
      }
      for (const model of authored.modelExamplesAfterSubmission || []) {
        if (typeof model === 'string' && model.trim() && html.includes(model)) {
          issue(`${source.id}/${authored.id}: modelo pós-envio vazou antes da tentativa.`);
        }
      }
    }

    if (evidenceSelectionNeeded(authored)) {
      const hasEvidenceControl = /data-evidence-(?:selection|response|choice)/i.test(html)
        || /name=["'][^"']*evidence/i.test(html)
        || normalized?.activity?.interaction === 'STRUCTURED_RESPONSE';
      if (!hasEvidenceControl) issue(`${source.id}/${authored.id}: autoria exige seleção de evidência, mas runtime/renderer não oferece controle específico.`);
    }

    if (Array.isArray(authored.items) && Array.isArray(normalized?.content?.items)) {
      authored.items.forEach((item, index) => {
        if (!evidenceSelectionNeeded(item)) return;
        const runtimeItem = normalized.content.items[index];
        if (!Array.isArray(runtimeItem?.evidenceOptions) || !runtimeItem.evidenceOptions.length) {
          issue(`${source.id}/${authored.id}/item-${index}: evidência aninhada não foi materializada.`);
        }
      });
    }

    auditSourceAvailability(source, authored, html);

    if (authored.visual) {
      const equivalent = authored.visual.accessibleEquivalent;
      if (typeof equivalent === 'string' && equivalent.trim() && !html.includes(equivalent)) {
        issue(`${source.id}/${authored.id}: equivalente acessível do visual não aparece na apresentação pública.`);
      }
    }
  }

  for (const block of runtime.blocks || []) if (block.kind === 'ACTIVITY') count(block.activity?.interaction || 'NONE');
  return runtime;
}

function cluster(runtime, id) {
  return runtime?.completion?.clusters?.find(item => item.id === id);
}

assert.equal(lessonFiles.length, 9, 'N1-U01 deve conter 9 lições autoradas.');

const prior = new Set();
for (const file of lessonFiles) {
  const source = readJson(path.join(lessonsDir, file));
  if (!/^N1-U01-L\d{2}$/.test(source.id)) issue(`${file}: ID fora do padrão N1-U01 -> ${source.id}`);
  if (prior.has(source.id)) issue(`${source.id}: ID duplicado.`);
  for (const prerequisite of source.prerequisites || []) {
    if (/^N1-U01-L\d{2}$/.test(prerequisite) && !prior.has(prerequisite)) issue(`${source.id}: pré-requisito interno invertido -> ${prerequisite}.`);
  }

  const runtime = auditRuntime(source, lessonSchema, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia' });
  collectMedia(source);
  prior.add(source.id);
  lessonSummary.push({ id: source.id, title: source.title, activities: runtime?.blocks?.filter(block => block.kind === 'ACTIVITY').length ?? 0, blocks: runtime?.blocks?.length ?? 0 });
}

const verificationSource = readJson(path.join(unitDir, 'integrated-verification.json'));
if (verificationSource.id !== 'N1-U01-V01') issue(`Verificação esperada N1-U01-V01, encontrada ${verificationSource.id}.`);
if (JSON.stringify(verificationSource.prerequisites) !== JSON.stringify([...prior])) issue('N1-U01-V01: prerequisites não correspondem exatamente às 9 lições em ordem.');
const verificationRuntime = auditRuntime(verificationSource, verificationSchema, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia', verification: true });
collectMedia(verificationSource);

// Fronteiras pedagógicas irredutíveis do lote.
const l05Runtime = runtimes.get('N1-U01-L05');
if (l05Runtime) {
  const relations = cluster(l05Runtime, 'relations');
  const hasFourOfFiveRule = (relations?.criteria || []).some(item => item?.type === 'TOTAL_ITEM_HITS_AT_LEAST' && item.minimum === 4);
  if (!hasFourOfFiveRule) issue('N1-U01-L05: regra autoral de pelo menos 4/5 relações precisa permanecer estrutural no runtime.');
}

const l09Runtime = runtimes.get('N1-U01-L09');
if (l09Runtime) {
  if (cluster(l09Runtime, 'ownSummary')?.satisfaction !== 'PENDING_ALLOWED') issue('N1-U01-L09: ownSummary precisa permitir VALIDACAO_PENDENTE sem alegar resumo validado.');
  if (cluster(l09Runtime, 'selectionOfEssential')?.satisfaction !== 'PENDING_ALLOWED') issue('N1-U01-L09: seleção ligada à produção aberta precisa preservar VALIDACAO_PENDENTE.');
}

const vById = new Map((verificationRuntime?.blocks || []).map(block => [block.id, block]));
const q07 = vById.get('V01-Q07');
if (!q07) issue('N1-U01-V01/V01-Q07: resumo próprio obrigatório desapareceu do runtime.');
else {
  if (q07.activity?.evaluation?.mode !== 'RELIABLE_EVALUATOR') issue('N1-U01-V01/V01-Q07: resumo próprio não pode virar avaliação determinística.');
  if (q07.activity?.evidence?.recordResponse !== true) issue('N1-U01-V01/V01-Q07: resumo próprio precisa ser persistido.');
}
if (verificationRuntime && cluster(verificationRuntime, 'ownSummary')?.satisfaction !== 'PENDING_ALLOWED') {
  issue('N1-U01-V01: ownSummary precisa permitir percurso concluído com resumo produzido/autorrevisado ainda VALIDACAO_PENDENTE.');
}
if (verificationRuntime?.completion?.nonCompensable !== true) issue('N1-U01-V01: os sete agrupamentos precisam permanecer não compensáveis no runtime.');

if (!verificationSource.completionEvidence?.clusters?.ownSummary) issue('N1-U01-V01: cluster ownSummary ausente na autoria.');
const completionText = JSON.stringify(verificationSource.completionEvidence || {});
if (!/todos os sete agrupamentos são obrigatórios/i.test(completionText)) issue('N1-U01-V01: contrato não compensável dos sete agrupamentos não foi encontrado.');
if (!/tarefas fechadas não compensam ausência/i.test(JSON.stringify(verificationSource.designPrinciples || []))) issue('N1-U01-V01: ausência de resumo precisa permanecer não compensável.');

if (media.controlledAudio.size) issue(`N1-U01 introduziu áudio humano obrigatório sem blocker explícito: ${[...media.controlledAudio].join(', ')}`);
if (media.video.size) issue(`N1-U01 introduziu vídeo obrigatório sem blocker explícito: ${[...media.video].join(', ')}`);
if (media.images.size) issue(`N1-U01 introduziu imagem humana/externa obrigatória sem blocker explícito: ${[...media.images].join(', ')}`);

console.log('P7 inventário N1-U01:');
for (const item of lessonSummary) console.log(`- ${item.id}: ${item.title} — ${item.activities} atividade(s), ${item.blocks} bloco(s)`);
console.log(`- N1-U01-V01: ${verificationRuntime?.blocks?.filter(block => block.kind === 'ACTIVITY').length ?? 0} atividade(s), ${verificationRuntime?.blocks?.length ?? 0} bloco(s)`);
console.log(`Interações normalizadas: ${[...interactions.entries()].sort().map(([key, value]) => `${key}=${value}`).join(', ') || 'nenhuma'}`);
console.log(`Seleções de evidência: ${evidenceRequirements.length} -> ${evidenceRequirements.join(', ') || 'nenhuma'}`);
console.log(`Fontes multimodais obrigatórias: ${sourceRequirements.length} -> ${sourceRequirements.join(', ') || 'nenhuma'}`);
console.log(`Produções abertas: ${openProductions.length} -> ${openProductions.join(', ') || 'nenhuma'}`);
console.log(`Blocos multimodais: ${multimodal.length} -> ${multimodal.join(', ') || 'nenhum'}`);
console.log(`Blocos com fonte/autoria explícita: ${sourceMetadataActivities.length} -> ${sourceMetadataActivities.join(', ') || 'nenhum'}`);
console.log(`Mídia: controlledAudio=${media.controlledAudio.size}, images=${media.images.size}, video=${media.video.size}, TTS-em-documentos=${media.ttsDocuments}`);

if (issues.length) {
  console.error(`\nN1-U01 ainda NÃO está pronta para publicação. ${issues.length} incompatibilidade(s):`);
  issues.forEach((item, index) => console.error(`${index + 1}. ${item}`));
  process.exitCode = 1;
} else {
  console.log('Resultado: N1-U01 preserva leitura consultável, evidência textual, multimodalidade acessível, fonte/opinião/razão introdutórias e resumo aberto sem falsa validação automática.');
}
