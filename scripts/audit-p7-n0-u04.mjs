import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';
import { validateValue } from './validate-contracts.mjs';

const unitDir = 'content/units/004-lendo-compreendendo-pequenos-textos';
const lessonsDir = path.join(unitDir, 'lessons');
const lessonFiles = fs.readdirSync(lessonsDir).filter(file => file.endsWith('.json')).sort();
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const lessonSchema = readJson('schemas/lesson.schema.json');
const verificationSchema = readJson('schemas/verification.schema.json');
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });

const issues = [];
const interactionCounts = new Map();
const media = { controlledAudio: new Set(), images: new Set(), video: new Set(), ttsDocuments: 0 };
const lessonSummary = [];
const evidenceRequirements = [];

function issue(message) {
  issues.push(message);
}

function countInteraction(runtime) {
  for (const block of runtime?.blocks || []) {
    if (block.kind !== 'ACTIVITY') continue;
    const interaction = block.activity?.interaction || 'NONE';
    interactionCounts.set(interaction, (interactionCounts.get(interaction) || 0) + 1);
  }
}

function collectMedia(source) {
  const spec = source.media || {};
  if (spec.tts && !/^nao|não/i.test(String(spec.tts))) media.ttsDocuments += 1;
  const controlled = Array.isArray(spec.controlledAudio) ? spec.controlledAudio : spec.controlledAudio ? [spec.controlledAudio] : [];
  for (const item of controlled) if (!/^nao|não/i.test(String(item))) media.controlledAudio.add(String(item));
  const images = Array.isArray(spec.images) ? spec.images : spec.images ? [spec.images] : [];
  for (const item of images) if (!/^nao|não/i.test(String(item))) media.images.add(String(item));
  const videos = Array.isArray(spec.video) ? spec.video : spec.video ? [spec.video] : [];
  for (const item of videos) if (!/^nao|não/i.test(String(item))) media.video.add(String(item));
}

function authoredActivities(source) {
  if (Array.isArray(source.sequence)) return source.sequence.filter(block => block?.id);
  if (Array.isArray(source.items)) return source.items.filter(block => block?.id);
  if (Array.isArray(source.tasks)) return source.tasks.filter(block => block?.id);
  return [];
}

function hasEvidenceRequirement(block) {
  return Boolean(
    block && (
      block.requiredEvidence !== undefined
      || block.acceptableEvidence !== undefined
      || (typeof block.followUp === 'string' && /evid[eê]ncia|parte|trecho|texto/i.test(block.followUp))
    )
  );
}

function evidenceStrings(block) {
  const values = [];
  for (const value of [block?.requiredEvidence, block?.acceptableEvidence]) {
    if (typeof value === 'string') values.push(value);
    else if (Array.isArray(value)) values.push(...value.filter(item => typeof item === 'string'));
  }
  return values;
}

function auditEvidenceRequirement(sourceId, authored, runtimeBlock, html) {
  if (!hasEvidenceRequirement(authored)) return;
  evidenceRequirements.push(`${sourceId}/${authored.id}`);
  if (!runtimeBlock) {
    issue(`${sourceId}/${authored.id}: requisito de evidência existe na autoria, mas o bloco não chegou ao runtime.`);
    return;
  }

  const hasEvidenceControl = /data-evidence-(?:selection|response|choice)/i.test(html)
    || /name=["'][^"']*evidence/i.test(html)
    || runtimeBlock.activity?.interaction === 'STRUCTURED_RESPONSE';
  if (!hasEvidenceControl) {
    issue(`${sourceId}/${authored.id}: autoria exige retorno/seleção de evidência, mas o renderer/runtime não oferece controle específico de evidência.`);
  }

  for (const answer of evidenceStrings(authored)) {
    if (answer && html.includes(answer)) {
      issue(`${sourceId}/${authored.id}: evidência-gabarito aparece no HTML público antes da resposta -> ${JSON.stringify(answer.slice(0, 80))}.`);
      break;
    }
  }
}

function ruleNeedsStructure(rule = '') {
  return /pelo menos|um dos dois|dois dos tr[eê]s|incluindo|não errar ambos|obrigat[oó]ri/i.test(String(rule));
}

function clusterHasStructuredRule(runtimeCluster) {
  return Boolean(
    Number.isInteger(runtimeCluster?.minimumEvidence)
    || (Array.isArray(runtimeCluster?.requiredAnyOf) && runtimeCluster.requiredAnyOf.length)
    || (Array.isArray(runtimeCluster?.criteria) && runtimeCluster.criteria.length)
  );
}

function auditCompletionRules(source, runtime) {
  const authoredClusters = source.completionEvidence?.clusters;
  if (!authoredClusters || typeof authoredClusters !== 'object') return;
  const runtimeById = new Map((runtime?.completion?.clusters || []).map(cluster => [cluster.id, cluster]));
  for (const [id, authoredCluster] of Object.entries(authoredClusters)) {
    if (!ruleNeedsStructure(authoredCluster?.rule)) continue;
    const runtimeCluster = runtimeById.get(id);
    if (!runtimeCluster) {
      issue(`${source.id}: cluster ${id} com regra agregada desapareceu no runtime.`);
      continue;
    }
    if (!clusterHasStructuredRule(runtimeCluster)) {
      issue(`${source.id}: cluster ${id} possui regra agregada na autoria (${JSON.stringify(authoredCluster.rule)}), mas runtime achatou para evidências todas-obrigatórias sem minimumEvidence/requiredAnyOf/criteria.`);
    }
  }
}

function auditRuntimeSource(source, schema, label, renderContext) {
  let runtime;
  try {
    runtime = service.normalize(source);
  } catch (error) {
    issue(`${label}: normalização falhou [${error.code || error.name}] ${error.message}`);
    return null;
  }

  const schemaErrors = validateValue(schema, runtime, `${label} runtime`);
  if (schemaErrors.length) issue(`${label}: runtime inválido -> ${schemaErrors.join(' | ')}`);

  let html = '';
  try {
    html = documentHtml(runtime, renderContext);
    if (/Interação ainda não suportada/i.test(html)) issue(`${label}: renderer encontrou interação não suportada.`);
    if (/\b(?:schemaVersion|answerKey|competencyIds|evidenceRole|correctOrder|correctIndex|requiredEvidence|acceptableEvidence)\b/i.test(html)) {
      issue(`${label}: metadado/gabarito técnico vazou no HTML público.`);
    }
  } catch (error) {
    issue(`${label}: renderização falhou -> ${error.message}`);
  }

  const byId = new Map((runtime.blocks || []).map(block => [block.id, block]));
  for (const authored of authoredActivities(source)) {
    auditEvidenceRequirement(source.id, authored, byId.get(authored.id), html);
  }
  auditCompletionRules(source, runtime);
  countInteraction(runtime);
  return runtime;
}

assert.equal(lessonFiles.length, 9, 'N0-U04 deve conter 9 lições autoradas antes da publicação P7.');

const allLessonIds = new Set();
for (const file of lessonFiles) {
  const sourcePath = path.join(lessonsDir, file);
  const source = readJson(sourcePath);
  if (!/^N0-U04-L\d{2}$/.test(source.id)) issue(`${file}: ID fora do padrão N0-U04 -> ${source.id}`);
  if (allLessonIds.has(source.id)) issue(`${source.id}: ID duplicado.`);

  for (const prerequisite of source.prerequisites || []) {
    if (/^N0-U04-L\d{2}$/.test(prerequisite) && !allLessonIds.has(prerequisite)) {
      issue(`${source.id}: pré-requisito interno invertido -> ${prerequisite}.`);
    }
  }

  const runtime = auditRuntimeSource(source, lessonSchema, source.id, { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos' });
  collectMedia(source);
  allLessonIds.add(source.id);
  lessonSummary.push({
    id: source.id,
    title: source.title,
    blocks: runtime?.blocks?.length ?? 0,
    activities: runtime?.blocks?.filter(block => block.kind === 'ACTIVITY').length ?? 0
  });
}

const verificationSource = readJson(path.join(unitDir, 'integrated-verification.json'));
if (verificationSource.id !== 'N0-U04-V01') issue(`Verificação esperada N0-U04-V01, encontrada ${verificationSource.id}.`);
if (JSON.stringify(verificationSource.prerequisites) !== JSON.stringify([...allLessonIds])) {
  issue('N0-U04-V01: prerequisites não correspondem exatamente às 9 lições em ordem.');
}
if (verificationSource.coverage?.length !== 8) issue(`N0-U04-V01: coverage esperada 8, encontrada ${verificationSource.coverage?.length ?? 0}.`);

const verificationRuntime = auditRuntimeSource(
  verificationSource,
  verificationSchema,
  'N0-U04-V01',
  { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos', verification: true }
);
collectMedia(verificationSource);

// Contrato específico: Q07 é uma ordenação determinística, não uma atividade genérica.
const q07Source = verificationSource.items?.find(item => item.id === 'V01-Q07');
const q07Runtime = verificationRuntime?.blocks?.find(block => block.id === 'V01-Q07');
if (!q07Source?.correctOrder || !Array.isArray(q07Source.cards)) {
  issue('N0-U04-V01/V01-Q07: autoria esperada cards + correctOrder não encontrada.');
} else if (!q07Runtime) {
  issue('N0-U04-V01/V01-Q07: atividade não chegou ao runtime.');
} else {
  if (!['SEQUENCE', 'ORDER'].includes(q07Runtime.activity?.interaction)) {
    issue(`N0-U04-V01/V01-Q07: correctOrder deveria normalizar para SEQUENCE/ORDER, mas resultou em ${q07Runtime.activity?.interaction || 'NONE'}.`);
  }
  if (q07Runtime.activity?.evaluation?.mode !== 'DETERMINISTIC') {
    issue(`N0-U04-V01/V01-Q07: ordenação deveria ser DETERMINISTIC, mas resultou em ${q07Runtime.activity?.evaluation?.mode || 'NONE'}.`);
  }
}

if (media.controlledAudio.size) issue(`N0-U04 introduziu áudio humano obrigatório sem blocker explícito: ${[...media.controlledAudio].join(', ')}`);
if (media.video.size) issue(`N0-U04 introduziu vídeo obrigatório sem blocker explícito: ${[...media.video].join(', ')}`);
if (media.images.size) issue(`N0-U04 introduziu imagem obrigatória sem blocker explícito: ${[...media.images].join(', ')}`);

console.log('P7 inventário N0-U04:');
for (const item of lessonSummary) console.log(`- ${item.id}: ${item.title} — ${item.activities} atividade(s), ${item.blocks} bloco(s)`);
console.log(`- N0-U04-V01: ${verificationRuntime?.blocks?.filter(block => block.kind === 'ACTIVITY').length ?? 0} atividade(s), ${verificationRuntime?.blocks?.length ?? 0} bloco(s)`);
console.log(`Interações normalizadas: ${[...interactionCounts.entries()].sort().map(([key, count]) => `${key}=${count}`).join(', ') || 'nenhuma'}`);
console.log(`Requisitos de evidência detectados: ${evidenceRequirements.length} -> ${evidenceRequirements.join(', ') || 'nenhum'}`);
console.log(`Mídia: controlledAudio=${media.controlledAudio.size}, images=${media.images.size}, video=${media.video.size}, TTS-em-documentos=${media.ttsDocuments}`);

if (issues.length) {
  console.error(`\nN0-U04 ainda NÃO está pronta para publicação. ${issues.length} incompatibilidade(s):`);
  issues.forEach((item, index) => console.error(`${index + 1}. ${item}`));
  process.exitCode = 1;
} else {
  console.log('Resultado: U04 normalizável com semântica de evidência/ordenação preservada, renderer coberto e sem mídia humana obrigatória.');
}
