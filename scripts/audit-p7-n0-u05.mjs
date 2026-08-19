import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { ContentService } from '../app/js/services/content-service.js';
import {
  INTERACTION_BY_LEGACY_INTERACTION_V1,
  LEGACY_COMPLETION_RULES_V1
} from '../app/js/services/content-normalization-rules-v1.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';
import { validateValue } from './validate-contracts.mjs';

const unitDir = 'content/units/005-escrevendo-organizando-mensagens';
const lessonsDir = path.join(unitDir, 'lessons');
const lessonFiles = fs.readdirSync(lessonsDir).filter(file => file.endsWith('.json')).sort();
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const lessonSchema = readJson('schemas/lesson.schema.json');
const verificationSchema = readJson('schemas/verification.schema.json');
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });

const issues = [];
const interactionCounts = new Map();
const authoredInteractionCounts = new Map();
const lessonSummary = [];
const openProductions = [];
const controlledEdits = [];
const multiAnswerPlanning = [];
const alternativeOrders = [];
const selfReviewRequirements = [];
const media = { controlledAudio: new Set(), images: new Set(), video: new Set(), ttsDocuments: 0 };

function issue(message) { issues.push(message); }
function count(map, key) { map.set(key, (map.get(key) || 0) + 1); }

function authoredBlocks(source) {
  if (Array.isArray(source.sequence)) return source.sequence.filter(block => block?.id);
  if (Array.isArray(source.items)) return source.items.filter(block => block?.id);
  if (Array.isArray(source.tasks)) return source.tasks.filter(block => block?.id);
  return [];
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

function isOpenProduction(block) {
  return block?.responseMode === 'free-text'
    || String(block?.interaction || '').includes('free-text')
    || /open-production|assessment-open|required-open-production/i.test(String(block?.type || ''));
}

const CONTROLLED_EDIT_INTERACTIONS = new Set([
  'insert-spaces',
  'edit-capitalization-and-boundary',
  'edit-controlled-text',
  'insert-commas'
]);

function isControlledEdit(block) {
  return CONTROLLED_EDIT_INTERACTIONS.has(String(block?.interaction || ''))
    && typeof block?.expected === 'string';
}

function requiresSelfReview(block) {
  return block?.selfReviewRequired === true
    || (Array.isArray(block?.selfReview) && block.selfReview.length > 0);
}

function staticAuthoringAudit(source) {
  for (const block of authoredBlocks(source)) {
    if (block.interaction) count(authoredInteractionCounts, String(block.interaction));

    if (isOpenProduction(block)) openProductions.push(`${source.id}/${block.id}`);
    if (isControlledEdit(block)) controlledEdits.push(`${source.id}/${block.id}:${block.interaction}`);
    if (Array.isArray(block.correctEssentialIndexes) || (Array.isArray(block.informationCards) && Array.isArray(block.correctIndexes))) {
      multiAnswerPlanning.push(`${source.id}/${block.id}`);
    }
    if (Array.isArray(block.acceptableOrders) && block.acceptableOrders.length) alternativeOrders.push(`${source.id}/${block.id}`);
    if (requiresSelfReview(block)) selfReviewRequirements.push(`${source.id}/${block.id}`);

    if (block.interaction && !CONTROLLED_EDIT_INTERACTIONS.has(block.interaction) && !INTERACTION_BY_LEGACY_INTERACTION_V1[block.interaction]) {
      issue(`${source.id}/${block.id}: interação autoral ${JSON.stringify(block.interaction)} não possui mapeamento legado explícito.`);
    }
  }
}

function exactTextLeaked(html, values = []) {
  return values.filter(value => typeof value === 'string' && value.trim().length >= 8).some(value => html.includes(value));
}

function auditOpenProduction(source, authored, runtimeBlock, html) {
  if (!isOpenProduction(authored)) return;
  if (!runtimeBlock) {
    issue(`${source.id}/${authored.id}: produção aberta não chegou ao runtime.`);
    return;
  }
  if (runtimeBlock.activity?.evaluation?.mode !== 'RELIABLE_EVALUATOR') {
    issue(`${source.id}/${authored.id}: produção aberta deve permanecer RELIABLE_EVALUATOR/pendente, não ${runtimeBlock.activity?.evaluation?.mode || 'NONE'}.`);
  }
  if (runtimeBlock.activity?.evidence?.recordResponse !== true) {
    issue(`${source.id}/${authored.id}: produção aberta precisa persistir a resposta autoral.`);
  }
  if (!['SHORT_TEXT', 'STRUCTURED_RESPONSE', 'LONG_TEXT', 'COMPOSITE'].includes(runtimeBlock.activity?.interaction)) {
    issue(`${source.id}/${authored.id}: produção aberta resultou em interação inadequada ${runtimeBlock.activity?.interaction || 'NONE'}.`);
  }
  if (!/textarea|type=["']text["']/i.test(html)) {
    issue(`${source.id}/${authored.id}: renderer não oferece campo livre visível.`);
  }
  if (requiresSelfReview(authored)) {
    const selfReview = runtimeBlock.content?.selfReviewQuestions;
    if (!Array.isArray(selfReview) || selfReview.length === 0) {
      issue(`${source.id}/${authored.id}: autochecagem obrigatória/autorada desapareceu no runtime.`);
    }
  }
  if (Array.isArray(authored.modelExamplesAfterSubmission) && exactTextLeaked(html, authored.modelExamplesAfterSubmission)) {
    issue(`${source.id}/${authored.id}: modelo pós-envio aparece no HTML inicial e pode ditar a resposta antes da tentativa.`);
  }
}

function auditControlledEdit(source, authored, runtimeBlock, html) {
  if (!isControlledEdit(authored)) return;
  if (!runtimeBlock) {
    issue(`${source.id}/${authored.id}: edição controlada não chegou ao runtime.`);
    return;
  }
  if (runtimeBlock.activity?.evaluation?.mode !== 'DETERMINISTIC') {
    issue(`${source.id}/${authored.id}: edição controlada ${authored.interaction} possui alvo exato e deve ser DETERMINISTIC, mas ficou ${runtimeBlock.activity?.evaluation?.mode || 'NONE'}.`);
  }
  const answerKey = runtimeBlock.activity?.evaluation?.answerKey || {};
  const expected = answerKey.expected ?? answerKey.correct ?? answerKey.acceptedResult;
  if (expected !== authored.expected) {
    issue(`${source.id}/${authored.id}: alvo controlado ${JSON.stringify(authored.expected)} não foi preservado no answerKey.`);
  }
  if (!/textarea|type=["']text["']/i.test(html)) {
    issue(`${source.id}/${authored.id}: renderer não oferece editor textual para ${authored.interaction}.`);
  }
}

function auditPlanningSelection(source, authored, runtimeBlock) {
  const expected = Array.isArray(authored.correctEssentialIndexes)
    ? authored.correctEssentialIndexes
    : Array.isArray(authored.informationCards) && Array.isArray(authored.correctIndexes)
      ? authored.correctIndexes
      : null;
  if (!expected) return;
  if (!runtimeBlock) {
    issue(`${source.id}/${authored.id}: seleção de informações não chegou ao runtime.`);
    return;
  }
  if (runtimeBlock.activity?.interaction !== 'MULTIPLE_CHOICE') {
    issue(`${source.id}/${authored.id}: seleção de múltiplas informações deveria ser MULTIPLE_CHOICE, mas ficou ${runtimeBlock.activity?.interaction || 'NONE'}.`);
  }
  const actual = runtimeBlock.activity?.evaluation?.answerKey?.correctIndexes;
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    issue(`${source.id}/${authored.id}: índices essenciais não foram preservados (${JSON.stringify(expected)} -> ${JSON.stringify(actual)}).`);
  }
}

function auditAlternativeOrder(source, authored, runtimeBlock) {
  if (!Array.isArray(authored.acceptableOrders) || !authored.acceptableOrders.length) return;
  if (!runtimeBlock) {
    issue(`${source.id}/${authored.id}: ordenação com múltiplas respostas válidas não chegou ao runtime.`);
    return;
  }
  if (runtimeBlock.activity?.interaction !== 'SEQUENCE') {
    issue(`${source.id}/${authored.id}: acceptableOrders deveria normalizar para SEQUENCE, mas ficou ${runtimeBlock.activity?.interaction || 'NONE'}.`);
  }
  const accepted = runtimeBlock.activity?.evaluation?.answerKey?.acceptedSequences;
  if (JSON.stringify(accepted) !== JSON.stringify(authored.acceptableOrders)) {
    issue(`${source.id}/${authored.id}: múltiplas ordens válidas foram perdidas no answerKey.`);
  }
}

function completionRuleNeedsStructure(rule = '') {
  return /pelo menos|incluindo|sem abrir apoio|autochecagem|nenhuma quantidade|não compensa|não usar média|dois dos tr[eê]s/i.test(String(rule));
}

function runtimeClusterStructured(cluster) {
  return Boolean(
    Number.isInteger(cluster?.minimumEvidence)
    || (Array.isArray(cluster?.requiredAnyOf) && cluster.requiredAnyOf.length)
    || (Array.isArray(cluster?.criteria) && cluster.criteria.length)
    || cluster?.satisfaction === 'PENDING_ALLOWED'
  );
}

function auditCompletion(source, runtime) {
  const authoredClusters = source.completionEvidence?.clusters;
  if (!authoredClusters || typeof authoredClusters !== 'object') return;
  const runtimeById = new Map((runtime?.completion?.clusters || []).map(cluster => [cluster.id, cluster]));
  const authoredById = new Map(authoredBlocks(source).map(block => [block.id, block]));

  for (const [id, authoredCluster] of Object.entries(authoredClusters)) {
    const runtimeCluster = runtimeById.get(id);
    if (!runtimeCluster) {
      issue(`${source.id}: cluster obrigatório ${id} desapareceu no runtime.`);
      continue;
    }
    if (completionRuleNeedsStructure(authoredCluster?.rule) && !runtimeClusterStructured(runtimeCluster)) {
      issue(`${source.id}: cluster ${id} possui regra não trivial ${JSON.stringify(authoredCluster.rule)}, mas runtime não registrou minimumEvidence/requiredAnyOf/criteria/PENDING_ALLOWED.`);
    }

    const hasOpenEvidence = (authoredCluster.evidence || []).some(evidenceId => isOpenProduction(authoredById.get(evidenceId)));
    if (hasOpenEvidence && runtimeCluster.satisfaction !== 'PENDING_ALLOWED') {
      issue(`${source.id}: cluster ${id} depende de produção aberta e deve permitir VALIDACAO_PENDENTE sem promovê-la a domínio automático.`);
    }
  }
}

function auditRuntime(source, schema, renderContext) {
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
    if (/\b(?:schemaVersion|answerKey|competencyIds|correctEssentialIndexes|acceptableOrders|automaticCheck|notAutomaticallyJudged|humanOrExternalReview)\b/i.test(html)) {
      issue(`${source.id}: metadado técnico/autoral vazou no HTML público.`);
    }
  } catch (error) {
    issue(`${source.id}: renderização falhou -> ${error.message}`);
  }

  const byId = new Map((runtime.blocks || []).map(block => [block.id, block]));
  for (const authored of authoredBlocks(source)) {
    const runtimeBlock = byId.get(authored.id);
    auditOpenProduction(source, authored, runtimeBlock, html);
    auditControlledEdit(source, authored, runtimeBlock, html);
    auditPlanningSelection(source, authored, runtimeBlock);
    auditAlternativeOrder(source, authored, runtimeBlock);
  }
  auditCompletion(source, runtime);

  for (const block of runtime.blocks || []) {
    if (block.kind === 'ACTIVITY') count(interactionCounts, block.activity?.interaction || 'NONE');
  }
  return runtime;
}

assert.equal(lessonFiles.length, 10, 'N0-U05 deve conter 10 lições autoradas antes da publicação P7.');

const allLessonIds = new Set();
for (const file of lessonFiles) {
  const source = readJson(path.join(lessonsDir, file));
  if (!/^N0-U05-L\d{2}$/.test(source.id)) issue(`${file}: ID fora do padrão N0-U05 -> ${source.id}`);
  if (allLessonIds.has(source.id)) issue(`${source.id}: ID duplicado.`);

  for (const prerequisite of source.prerequisites || []) {
    if (/^N0-U05-L\d{2}$/.test(prerequisite) && !allLessonIds.has(prerequisite)) {
      issue(`${source.id}: pré-requisito interno invertido -> ${prerequisite}.`);
    }
  }

  staticAuthoringAudit(source);
  const runtime = auditRuntime(source, lessonSchema, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens' });
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
if (verificationSource.id !== 'N0-U05-V01') issue(`Verificação esperada N0-U05-V01, encontrada ${verificationSource.id}.`);
if (JSON.stringify(verificationSource.prerequisites) !== JSON.stringify([...allLessonIds])) {
  issue('N0-U05-V01: prerequisites não correspondem exatamente às 10 lições em ordem.');
}
if (verificationSource.coverage?.length !== 6) issue(`N0-U05-V01: coverage esperada 6, encontrada ${verificationSource.coverage?.length ?? 0}.`);

staticAuthoringAudit(verificationSource);
const verificationRuntime = auditRuntime(
  verificationSource,
  verificationSchema,
  { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens', verification: true }
);
collectMedia(verificationSource);

// Invariantes pedagógicos irredutíveis da V01.
const q08Source = verificationSource.items?.find(item => item.id === 'V01-Q08');
const q08Runtime = verificationRuntime?.blocks?.find(block => block.id === 'V01-Q08');
if (!q08Source || q08Source.responseMode !== 'free-text') {
  issue('N0-U05-V01/V01-Q08: produção própria obrigatória em campo livre desapareceu da autoria.');
} else if (q08Runtime) {
  if (q08Runtime.activity?.evaluation?.mode !== 'RELIABLE_EVALUATOR') {
    issue('N0-U05-V01/V01-Q08: produção própria jamais pode virar correção linguística automática por heurística superficial.');
  }
  if (q08Runtime.activity?.evidence?.recordResponse !== true) {
    issue('N0-U05-V01/V01-Q08: produção própria precisa ser persistida para revisão confiável posterior.');
  }
}

const ownProductionCluster = verificationRuntime?.completion?.clusters?.find(cluster => cluster.id === 'ownProduction');
if (ownProductionCluster && ownProductionCluster.satisfaction !== 'PENDING_ALLOWED') {
  issue('N0-U05-V01: ownProduction precisa permitir VALIDACAO_PENDENTE e continuar não compensável.');
}

if (!LEGACY_COMPLETION_RULES_V1['N0-U05-V01']) {
  issue('N0-U05-V01: regras de conclusão ainda não estão explicitadas no adapter legado; não inferir domínio a partir de texto livre da autoria.');
}

if (media.controlledAudio.size) issue(`N0-U05 introduziu áudio humano obrigatório sem blocker explícito: ${[...media.controlledAudio].join(', ')}`);
if (media.video.size) issue(`N0-U05 introduziu vídeo obrigatório sem blocker explícito: ${[...media.video].join(', ')}`);
if (media.images.size) issue(`N0-U05 introduziu imagem obrigatória sem blocker explícito: ${[...media.images].join(', ')}`);

console.log('P7 inventário N0-U05:');
for (const item of lessonSummary) console.log(`- ${item.id}: ${item.title} — ${item.activities} atividade(s), ${item.blocks} bloco(s)`);
console.log(`- N0-U05-V01: ${verificationRuntime?.blocks?.filter(block => block.kind === 'ACTIVITY').length ?? 0} atividade(s), ${verificationRuntime?.blocks?.length ?? 0} bloco(s)`);
console.log(`Interações autorais explícitas: ${[...authoredInteractionCounts.entries()].sort().map(([key, value]) => `${key}=${value}`).join(', ') || 'nenhuma'}`);
console.log(`Interações normalizadas: ${[...interactionCounts.entries()].sort().map(([key, value]) => `${key}=${value}`).join(', ') || 'nenhuma'}`);
console.log(`Produções abertas: ${openProductions.length} -> ${openProductions.join(', ') || 'nenhuma'}`);
console.log(`Autochecagens obrigatórias/autoradas: ${selfReviewRequirements.length} -> ${selfReviewRequirements.join(', ') || 'nenhuma'}`);
console.log(`Edições controladas: ${controlledEdits.length} -> ${controlledEdits.join(', ') || 'nenhuma'}`);
console.log(`Seleções de planejamento multi-resposta: ${multiAnswerPlanning.length} -> ${multiAnswerPlanning.join(', ') || 'nenhuma'}`);
console.log(`Ordenações com múltiplas respostas válidas: ${alternativeOrders.length} -> ${alternativeOrders.join(', ') || 'nenhuma'}`);
console.log(`Mídia: controlledAudio=${media.controlledAudio.size}, images=${media.images.size}, video=${media.video.size}, TTS-em-documentos=${media.ttsDocuments}`);

if (issues.length) {
  console.error(`\nN0-U05 ainda NÃO está pronta para publicação. ${issues.length} incompatibilidade(s):`);
  issues.forEach((item, index) => console.error(`${index + 1}. ${item}`));
  process.exitCode = 1;
} else {
  console.log('Resultado: U05 normalizável sem promover produção aberta a domínio automático, com revisão/autochecagem e convenções controladas preservadas.');
}
