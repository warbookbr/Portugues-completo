import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ContentService } from '../app/js/services/content-service.js';
import { ProgressService } from '../app/js/services/progress-service.js';
import { validateValue } from './validate-contracts.mjs';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const source = readJson('content/units/003-palavras-frases-sentido/integrated-verification.json');
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const runtime = service.normalize(source);
const byId = new Map(runtime.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));

const memoryStorage = () => {
  let value = null;
  return { getItem: () => value, setItem: (_key, next) => { value = next; } };
};
const progressService = () => new ProgressService({ storage: memoryStorage(), clock: () => new Date('2026-08-19T12:00:00-03:00') });

function record(progress, id, result, response) {
  const block = byId.get(id);
  assert.ok(block, `${id}: bloco não encontrado.`);
  return progress.recordActivity(runtime, block, { complete: true, ...result }, { response });
}

assert.equal(runtime.id, 'N0-U03-V01');
assert.equal(runtime.completion.clusters.length, 3);
assert.deepEqual(runtime.completion.clusters.map(item => item.id), ['meaningAndContext', 'constructionAndManipulation', 'messageComprehensionAndProduction']);
assert.deepEqual(runtime.completion.clusters[0].criteria, [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q01', 'V01-Q02', 'V01-Q03'], minimum: 5 }]);
assert.equal(byId.get('V01-Q03').activity.evaluation.threshold, 1, 'Os dois contextos de MANGA são obrigatórios.');
assert.equal(byId.get('V01-Q09').activity.evaluation.criteria[0].type, 'REQUIRED_ITEMS_CORRECT');
assert.deepEqual(byId.get('V01-Q09').activity.evaluation.criteria[0].itemIds, ['1'], 'A reconstrução Rosa/Ivo é obrigatória.');
assert.equal(byId.get('V01-Q10').activity.evaluation.mode, 'RELIABLE_EVALUATOR');
assert.equal(byId.get('V01-Q10').activity.evidence.recordResponse, true);

// 4/6 não satisfaz o primeiro agrupamento mesmo quando cada atividade atinge seu limiar local.
{
  const progress = progressService();
  record(progress, 'V01-Q01', { correct: true, score: 0.5, itemResults: { 0: true, 1: false } });
  record(progress, 'V01-Q02', { correct: true, score: 0.5, itemResults: { 0: true, 1: false } });
  const snapshot = record(progress, 'V01-Q03', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
  assert.equal(snapshot.curriculum.verifications[runtime.id].clusterStates.meaningAndContext, 'PRATICADA');
}

// 5/6, com os dois itens de MANGA, satisfaz exatamente a regra autoral.
{
  const progress = progressService();
  record(progress, 'V01-Q01', { correct: true, score: 0.5, itemResults: { 0: true, 1: false } });
  record(progress, 'V01-Q02', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
  const snapshot = record(progress, 'V01-Q03', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
  assert.equal(snapshot.curriculum.verifications[runtime.id].clusterStates.meaningAndContext, 'DEMONSTRADA');
  assert.deepEqual(snapshot.evidence['N0-U03-V01/V01-Q01'].itemResults, { 0: true, 1: false });
  assert.equal(snapshot.evidence['N0-U03-V01/V01-Q01'].score, 0.5);
}

// Construção: Q05 obrigatório + 3/4 entre Q06/Q09, com a reconstrução de Q09 obrigatória.
{
  const progress = progressService();
  record(progress, 'V01-Q05', { correct: true });
  record(progress, 'V01-Q06', { correct: true, score: 0.5, itemResults: { 0: true, 1: false } });
  const snapshot = record(progress, 'V01-Q09', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
  assert.equal(snapshot.curriculum.verifications[runtime.id].clusterStates.constructionAndManipulation, 'DEMONSTRADA');
}

{
  const progress = progressService();
  record(progress, 'V01-Q05', { correct: true });
  record(progress, 'V01-Q06', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
  const snapshot = record(progress, 'V01-Q09', { correct: false, score: 0.5, itemResults: { 0: true, 1: false } });
  assert.equal(snapshot.curriculum.verifications[runtime.id].clusterStates.constructionAndManipulation, 'REVISAO_RECOMENDADA');
}

// A produção aberta pode concluir o percurso da verificação sem virar domínio automático.
{
  const progress = progressService();
  record(progress, 'V01-Q01', { correct: true, score: 0.5, itemResults: { 0: true, 1: false } });
  record(progress, 'V01-Q02', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
  record(progress, 'V01-Q03', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
  record(progress, 'V01-Q05', { correct: true });
  record(progress, 'V01-Q06', { correct: true, score: 0.5, itemResults: { 0: true, 1: false } });
  record(progress, 'V01-Q09', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
  record(progress, 'V01-Q04', { correct: true, score: 2 / 3, itemResults: { 0: true, 1: true, 2: false } });
  record(progress, 'V01-Q07', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
  record(progress, 'V01-Q08', { correct: true, score: 0.8, itemResults: { 0: true, 1: true, 2: true, 3: true, 4: false } });
  const snapshot = record(progress, 'V01-Q10', { pending: true }, { openResponse: 'Pode esperar um pouco, por favor?', 'selfReview:0': 'done', 'selfReview:1': 'done', 'selfReview:2': 'done', 'selfReview:3': 'done' });
  assert.equal(snapshot.curriculum.verifications[runtime.id].clusterStates.messageComprehensionAndProduction, 'VALIDACAO_PENDENTE');
  assert.equal(snapshot.curriculum.verifications[runtime.id].status, 'CONCLUIDA', 'Percurso pode concluir sem confundir pending com domínio validado.');
  assert.equal(snapshot.evidence['N0-U03-V01/V01-Q10'].status, 'VALIDACAO_PENDENTE');
}

const progressSchema = readJson('schemas/progress.schema.json');
const completed = progressService();
record(completed, 'V01-Q01', { correct: true, score: 1, itemResults: { 0: true, 1: true } });
const schemaErrors = validateValue(progressSchema, completed.getProgress(), 'P7 U03 progress');
assert.deepEqual(schemaErrors, [], `Progresso com score/itemResults inválido:\n${schemaErrors.join('\n')}`);

console.log('P7 U03 evidence: thresholds locais + critérios agregados + pending aberto preservam exatamente a V01 sem promover domínio automático.');
