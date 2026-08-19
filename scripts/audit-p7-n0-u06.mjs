import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { ContentService } from '../app/js/services/content-service.js';
import { LEGACY_COMPLETION_RULES_V1 } from '../app/js/services/content-normalization-rules-v1.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';
import { validateValue } from './validate-contracts.mjs';

const unitDir = 'content/units/006-usando-lingua-cotidiano';
const lessonsDir = path.join(unitDir, 'lessons');
const lessonFiles = fs.readdirSync(lessonsDir).filter(file => file.endsWith('.json')).sort();
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const lessonSchema = readJson('schemas/lesson.schema.json');
const verificationSchema = readJson('schemas/verification.schema.json');
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });

const issues = [];
const lessonSummary = [];
const interactions = new Map();
const audioFirst = [];
const openProductions = [];
const oralPractice = [];
const antiStigmaDocuments = [];
const media = { controlledAudio: new Set(), images: new Set(), video: new Set(), ttsDocuments: 0 };

const issue = message => issues.push(message);
const count = key => interactions.set(key, (interactions.get(key) || 0) + 1);

function authoredBlocks(source) {
  if (Array.isArray(source.sequence)) return source.sequence.filter(item => item?.id);
  if (Array.isArray(source.items)) return source.items.filter(item => item?.id);
  return [];
}

function isOpen(block) {
  return String(block?.responseMode || '').startsWith('free-text')
    || /assessment-open|open-production|open-reformulation/i.test(String(block?.type || ''));
}

function hasOralPractice(block) {
  return block?.oralRehearsal === true
    || (block?.oralRehearsal && typeof block.oralRehearsal === 'object');
}

function collectMedia(source) {
  const spec = source.media || {};
  if (spec.tts && !/^nao|não/i.test(String(spec.tts))) media.ttsDocuments += 1;
  for (const [key, target] of [['controlledAudio', media.controlledAudio], ['images', media.images], ['video', media.video]]) {
    const raw = spec[key];
    const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
    for (const value of values) if (!/^nao|não/i.test(String(value))) target.add(String(value));
  }
}

function sourceHasAntiStigmaRule(source) {
  const text = JSON.stringify([source.objective, source.limits, source.designPrinciples, source.sequence, source.items]).toLocaleLowerCase('pt-BR');
  return /informal.*(não|nao).*err|formal.*(não|nao).*melhor|diferença.*(não|nao).*erro|varia|sotaque|variedade|preconceito/.test(text);
}

function auditSource(source, schema, renderContext) {
  const authored = authoredBlocks(source);
  authored.forEach(block => {
    if (block.transcriptHiddenUntilAttempt === true) audioFirst.push(`${source.id}/${block.id}`);
    if (isOpen(block)) openProductions.push(`${source.id}/${block.id}`);
    if (hasOralPractice(block)) oralPractice.push(`${source.id}/${block.id}`);
  });
  if (sourceHasAntiStigmaRule(source)) antiStigmaDocuments.push(source.id);

  let runtime;
  try {
    runtime = service.normalize(source);
  } catch (error) {
    issue(`${source.id}: normalização falhou [${error.code || error.name}] ${error.message}`);
    return null;
  }

  const schemaErrors = validateValue(schema, runtime, `${source.id} runtime`);
  if (schemaErrors.length) issue(`${source.id}: runtime inválido -> ${schemaErrors.join(' | ')}`);

  let html = '';
  try {
    html = documentHtml(runtime, renderContext);
    if (/Interação ainda não suportada/i.test(html)) issue(`${source.id}: renderer encontrou interação não suportada.`);
  } catch (error) {
    issue(`${source.id}: renderização falhou -> ${error.message}`);
  }

  const byId = new Map((runtime.blocks || []).map(block => [block.id, block]));
  for (const block of authored) {
    const normalized = byId.get(block.id);
    if (!normalized && (block.correctIndex !== undefined || Array.isArray(block.items) || isOpen(block) || hasOralPractice(block))) {
      issue(`${source.id}/${block.id}: bloco avaliativo relevante desapareceu do runtime.`);
      continue;
    }

    if (block.transcriptHiddenUntilAttempt === true) {
      const transcript = block.transcriptAfterAttempt;
      if (typeof transcript === 'string' && transcript.trim() && html.includes(transcript)) {
        issue(`${source.id}/${block.id}: transcrição pós-tentativa aparece no HTML inicial e invalida a evidência de compreensão oral.`);
      }
      if (!normalized?.content?.ttsText) issue(`${source.id}/${block.id}: estímulo TTS oral desapareceu do runtime.`);
    }

    if (block.replayAllowed === true && normalized?.activity?.evidence?.supportAffectsMastery === true) {
      issue(`${source.id}/${block.id}: replay autorizado não pode reduzir domínio automaticamente.`);
    }

    if (isOpen(block)) {
      if (normalized?.activity?.evaluation?.mode !== 'RELIABLE_EVALUATOR') {
        issue(`${source.id}/${block.id}: produção aberta deve permanecer RELIABLE_EVALUATOR.`);
      }
      if (normalized?.activity?.evidence?.recordResponse !== true) {
        issue(`${source.id}/${block.id}: produção aberta precisa persistir a resposta.`);
      }
      for (const model of block.modelExamplesAfterSubmission || []) {
        if (typeof model === 'string' && model.trim() && html.includes(model)) issue(`${source.id}/${block.id}: modelo pós-envio vazou antes da tentativa.`);
      }
    }

    if (hasOralPractice(block)) {
      if (!normalized?.content?.oralRehearsal) issue(`${source.id}/${block.id}: ensaio oral autorado desapareceu do runtime.`);
      if (!/data-oral-rehearsal|oral-rehearsal/i.test(html)) issue(`${source.id}/${block.id}: ensaio oral não possui controle explícito no renderer.`);
      if (block.automaticValidation === false && normalized?.activity?.evaluation?.mode === 'DETERMINISTIC') {
        issue(`${source.id}/${block.id}: ensaio oral explicitamente não validável virou avaliação determinística.`);
      }
    }
  }

  if (sourceHasAntiStigmaRule(source)) {
    if (/linguagem informal é sempre errada|mais formal é automaticamente melhor|sotaque.*erro|variedade.*inferior/i.test(html)) {
      issue(`${source.id}: linguagem pública contradiz a proteção contra estigmatização/false hierarchy.`);
    }
  }

  if (/transcriptAfterAttempt|transcriptHiddenUntilAttempt|externalReview|requiredForClaimOfValidatedOralComprehensibility|notAutomaticallyJudged|automaticObservations|designPrinciples|completionEvidence/i.test(html)) {
    issue(`${source.id}: metadado técnico/autoral sensível vazou no HTML público.`);
  }

  for (const block of runtime.blocks || []) if (block.kind === 'ACTIVITY') count(block.activity?.interaction || 'NONE');
  return runtime;
}

assert.equal(lessonFiles.length, 10, 'N0-U06 deve conter 10 lições autoradas.');
const prior = new Set();
for (const file of lessonFiles) {
  const source = readJson(path.join(lessonsDir, file));
  if (!/^N0-U06-L\d{2}$/.test(source.id)) issue(`${file}: ID fora do padrão N0-U06 -> ${source.id}`);
  for (const prerequisite of source.prerequisites || []) {
    if (/^N0-U06-L\d{2}$/.test(prerequisite) && !prior.has(prerequisite)) issue(`${source.id}: pré-requisito interno invertido -> ${prerequisite}.`);
  }
  const runtime = auditSource(source, lessonSchema, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano' });
  collectMedia(source);
  prior.add(source.id);
  lessonSummary.push({ id: source.id, title: source.title, blocks: runtime?.blocks?.length ?? 0, activities: runtime?.blocks?.filter(block => block.kind === 'ACTIVITY').length ?? 0 });
}

const verificationSource = readJson(path.join(unitDir, 'integrated-verification.json'));
if (verificationSource.id !== 'N0-U06-V01') issue(`Verificação esperada N0-U06-V01, encontrada ${verificationSource.id}.`);
if (JSON.stringify(verificationSource.prerequisites) !== JSON.stringify([...prior])) issue('N0-U06-V01: prerequisites não correspondem exatamente às 10 lições em ordem.');
const verificationRuntime = auditSource(verificationSource, verificationSchema, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano', verification: true });
collectMedia(verificationSource);

// Limites de autoridade irredutíveis da V01.
const vById = new Map((verificationRuntime?.blocks || []).map(block => [block.id, block]));
for (const id of ['V01-Q02', 'V01-Q11']) {
  const block = vById.get(id);
  if (block?.activity?.evaluation?.mode !== 'RELIABLE_EVALUATOR') issue(`N0-U06-V01/${id}: produção escrita própria não pode virar heurística determinística.`);
}
const q12 = vById.get('V01-Q12');
if (!q12) issue('N0-U06-V01/V01-Q12: prática oral obrigatória desapareceu do runtime.');
else {
  if (q12.activity?.evaluation?.mode === 'DETERMINISTIC') issue('N0-U06-V01/V01-Q12: marcar ensaio oral não pode validar compreensibilidade automaticamente.');
  if (q12.activity?.evidence?.recordResponse !== true) issue('N0-U06-V01/V01-Q12: prática/autochecagem oral precisa ser registrável.');
}

const rules = LEGACY_COMPLETION_RULES_V1['N0-U06-V01'];
if (!rules) issue('N0-U06-V01: regras de conclusão ainda não estão explicitadas no adapter legado.');
else {
  const oral = rules.clusters?.find(cluster => cluster.id === 'oralProductionPractice');
  if (!oral || oral.satisfaction !== 'PENDING_ALLOWED') issue('N0-U06-V01: oralProductionPractice precisa permitir prática pendente sem alegar oralidade validada.');
  const functional = rules.clusters?.find(cluster => cluster.id === 'functionalUseAndProduction');
  if (!functional || functional.satisfaction !== 'PENDING_ALLOWED') issue('N0-U06-V01: cluster com Q02/Q11 abertos precisa preservar VALIDACAO_PENDENTE.');
}

if (media.controlledAudio.size) issue(`N0-U06 introduziu áudio humano obrigatório sem blocker explícito: ${[...media.controlledAudio].join(', ')}`);
if (media.images.size) issue(`N0-U06 introduziu imagem obrigatória sem blocker explícito: ${[...media.images].join(', ')}`);
if (media.video.size) issue(`N0-U06 introduziu vídeo obrigatório sem blocker explícito: ${[...media.video].join(', ')}`);

console.log('P7 inventário N0-U06:');
for (const item of lessonSummary) console.log(`- ${item.id}: ${item.title} — ${item.activities} atividade(s), ${item.blocks} bloco(s)`);
console.log(`- N0-U06-V01: ${verificationRuntime?.blocks?.filter(block => block.kind === 'ACTIVITY').length ?? 0} atividade(s), ${verificationRuntime?.blocks?.length ?? 0} bloco(s)`);
console.log(`Interações normalizadas: ${[...interactions.entries()].sort().map(([key, value]) => `${key}=${value}`).join(', ') || 'nenhuma'}`);
console.log(`Audio-first: ${audioFirst.length} -> ${audioFirst.join(', ') || 'nenhum'}`);
console.log(`Produções abertas: ${openProductions.length} -> ${openProductions.join(', ') || 'nenhuma'}`);
console.log(`Práticas/ensaios orais: ${oralPractice.length} -> ${oralPractice.join(', ') || 'nenhuma'}`);
console.log(`Documentos com proteção antiestigma/adequação: ${antiStigmaDocuments.length} -> ${antiStigmaDocuments.join(', ')}`);
console.log(`Mídia: controlledAudio=${media.controlledAudio.size}, images=${media.images.size}, video=${media.video.size}, TTS-em-documentos=${media.ttsDocuments}`);

if (issues.length) {
  console.error(`\nN0-U06 ainda NÃO está pronta para publicação. ${issues.length} incompatibilidade(s):`);
  issues.forEach((item, index) => console.error(`${index + 1}. ${item}`));
  process.exitCode = 1;
} else {
  console.log('Resultado: U06 preserva compreensão oral audio-first, replay sem penalidade, adequação/variação sem estigma e prática oral sem validação automática falsa.');
}
