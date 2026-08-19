import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ContentService } from '../app/js/services/content-service.js';
import { ProgressService } from '../app/js/services/progress-service.js';
import { evaluateDeterministic } from '../app/js/ui/classic-deterministic-evaluator.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const normalize = file => service.normalize(readJson(file));
const activityMap = runtime => new Map(runtime.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));

function fakeForm({ radios = {}, checks = {}, sequences = {} } = {}) {
  const checkedInputs = name => (checks[name] || []).map(value => ({ name, value: String(value), checked: true }));
  const radioInput = name => Object.prototype.hasOwnProperty.call(radios, name)
    ? { name, value: String(radios[name]), checked: true }
    : null;
  const sequenceInputs = Object.entries(sequences).map(([name, value]) => ({ name, value: JSON.stringify(value), dataset: { sequenceValue: '' } }));

  return {
    querySelector(selector) {
      const match = selector.match(/^input\[name="([^"]+)"\]:checked$/);
      return match ? radioInput(match[1]) : null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-sequence-value]') return sequenceInputs;
      const inputMatch = selector.match(/^input\[name="([^"]+)"\]:checked$/);
      if (inputMatch) return checkedInputs(inputMatch[1]);
      if (selector.startsWith('select[')) return [];
      return [];
    },
    elements: { namedItem: () => null }
  };
}

const memoryStorage = () => {
  let value = null;
  return { getItem: () => value, setItem: (_key, next) => { value = next; } };
};
const newProgress = () => new ProgressService({ storage: memoryStorage(), clock: () => new Date('2026-08-19T12:30:00-03:00') });

function record(progress, runtime, byId, id, result) {
  const block = byId.get(id);
  assert.ok(block, `${runtime.id}/${id}: atividade não encontrada.`);
  return progress.recordActivity(runtime, block, { complete: true, ...result });
}

// ---------------------------------------------------------------------------
// 1. Evidência textual faz parte da correção; não é decoração nem gabarito visível.
// ---------------------------------------------------------------------------
const l01 = normalize('content/units/004-lendo-compreendendo-pequenos-textos/lessons/001-ler-e-construir-sentido.json');
const l01ById = activityMap(l01);
const l01a02 = l01ById.get('L01-A02');
assert.equal(l01a02.activity.evaluation.mode, 'DETERMINISTIC');
assert.deepEqual(l01a02.activity.evaluation.answerKey.evidence, { correctIndexes: [0, 1, 2], match: 'ANY' });
assert.equal(l01a02.content.evidenceSelectionMode, 'SINGLE');
assert.deepEqual(l01a02.content.evidenceOptions, [
  'Marta lavou a roupa pela manhã.',
  'À tarde, as roupas já estavam secas.',
  'Marta então as guardou.'
]);
assert.equal(Object.prototype.hasOwnProperty.call(l01a02.content, 'acceptableEvidence'), false);

let result = evaluateDeterministic(fakeForm({ radios: { choice: 0 } }), l01a02);
assert.equal(result.complete, false, 'Resposta correta sem evidência exigida ainda está incompleta.');

result = evaluateDeterministic(fakeForm({ radios: { choice: 0 }, checks: { evidence: [1] } }), l01a02);
assert.equal(result.complete, true);
assert.equal(result.correct, true, 'Qualquer um dos três trechos autorados é evidência válida em L01-A02.');

result = evaluateDeterministic(fakeForm({ radios: { choice: 0 }, checks: { evidence: [99] } }), l01a02);
assert.equal(result.complete, true);
assert.equal(result.correct, false, 'Escolha conceitual correta não compensa evidência inválida.');

const l01Html = documentHtml(l01, { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos' });
assert.match(l01Html, /data-evidence-selection/);
assert.match(l01Html, /Volte ao texto e marque uma parte que confirma sua escolha/);
assert.doesNotMatch(l01Html, /acceptableEvidence|requiredEvidence|evidenceCorrectIndexes|answerKey/);

// Evidência múltipla: todos os trechos requeridos são necessários.
const l04 = normalize('content/units/004-lendo-compreendendo-pequenos-textos/lessons/004-ligando-informacoes-entre-frases.json');
const l04ById = activityMap(l04);
const l04a02 = l04ById.get('L04-A02');
assert.deepEqual(l04a02.activity.evaluation.answerKey.evidence, { correctIndexes: [0, 1], match: 'ALL' });
assert.equal(l04a02.content.evidenceSelectionMode, 'MULTIPLE');

result = evaluateDeterministic(fakeForm({ radios: { choice: 0 }, checks: { evidence: [0] } }), l04a02);
assert.equal(result.correct, false, 'Um de dois trechos não satisfaz evidência múltipla.');
result = evaluateDeterministic(fakeForm({ radios: { choice: 0 }, checks: { evidence: [0, 1] } }), l04a02);
assert.equal(result.correct, true, 'Os dois trechos corretos satisfazem a evidência múltipla.');

// Evidência aninhada por subitem é preservada e recebe controle próprio no renderer.
const l03 = normalize('content/units/004-lendo-compreendendo-pequenos-textos/lessons/003-encontrando-informacoes-no-texto.json');
const l03ById = activityMap(l03);
const l03a01 = l03ById.get('L03-A01');
assert.ok(l03a01.activity.evaluation.answerKey.items['0'].evidence?.correctIndexes?.length >= 1);
assert.ok(l03a01.activity.evaluation.answerKey.items['1'].evidence?.correctIndexes?.length >= 1);
assert.ok(Array.isArray(l03a01.content.items[0].evidenceOptions) && l03a01.content.items[0].evidenceOptions.length >= 2);
const l03Html = documentHtml(l03, { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos' });
assert.match(l03Html, /name="round-evidence:0"/);
assert.match(l03Html, /name="round-evidence:1"/);
assert.doesNotMatch(l03Html, /requiredEvidence|requiredEvidenceParts|evidenceCorrectIndexes/);

// ---------------------------------------------------------------------------
// 2. correctOrder virou ordenação determinística canônica.
// ---------------------------------------------------------------------------
const l06 = normalize('content/units/004-lendo-compreendendo-pequenos-textos/lessons/006-ordem-dos-acontecimentos-e-instrucoes.json');
const l06ById = activityMap(l06);
for (const id of ['L06-C01', 'L06-A01']) {
  const block = l06ById.get(id);
  assert.equal(block.activity.interaction, 'SEQUENCE', `${id}: deve ser SEQUENCE.`);
  assert.equal(block.activity.evaluation.mode, 'DETERMINISTIC', `${id}: deve ser determinístico.`);
  assert.ok(Array.isArray(block.activity.evaluation.answerKey.correctSequence));
  assert.deepEqual(block.activity.evaluation.answerKey.correctSequence, block.content.availableTiles.map((_item, index) => index), `${id}: ordem canônica deve corresponder à autoria.`);
}

const v01Source = readJson('content/units/004-lendo-compreendendo-pequenos-textos/integrated-verification.json');
const v01 = service.normalize(v01Source);
const v01ById = activityMap(v01);
const q07 = v01ById.get('V01-Q07');
assert.equal(q07.activity.interaction, 'SEQUENCE');
assert.equal(q07.activity.evaluation.mode, 'DETERMINISTIC');
assert.deepEqual(q07.activity.evaluation.answerKey.correctSequence, v01Source.items.find(item => item.id === 'V01-Q07').correctOrder);

result = evaluateDeterministic(fakeForm({ sequences: { sequence: q07.activity.evaluation.answerKey.correctSequence } }), q07);
assert.equal(result.correct, true);
result = evaluateDeterministic(fakeForm({ sequences: { sequence: [...q07.activity.evaluation.answerKey.correctSequence].reverse() } }), q07);
assert.equal(result.correct, false);

// ---------------------------------------------------------------------------
// 3. Clusters agregados mantêm exatamente as condições autorais.
// ---------------------------------------------------------------------------
assert.deepEqual(v01.completion.clusters.map(cluster => cluster.id), [
  'globalComprehension', 'explicitAndIntegration', 'reference', 'sequenceAndRelations', 'inferenceDiscipline', 'rereadingAndRevision'
]);
const explicit = v01.completion.clusters.find(cluster => cluster.id === 'explicitAndIntegration');
assert.equal(explicit.minimumEvidence, 2);
const reference = v01.completion.clusters.find(cluster => cluster.id === 'reference');
assert.equal(reference.minimumEvidence, 1);
const sequenceRelations = v01.completion.clusters.find(cluster => cluster.id === 'sequenceAndRelations');
assert.equal(sequenceRelations.minimumEvidence, 2);
assert.deepEqual(sequenceRelations.requiredAnyOf, [['V01-Q08', 'V01-Q09']]);

// Q05 sozinho satisfaz o agrupamento de referência (1 de 2).
{
  const progress = newProgress();
  const snapshot = record(progress, v01, v01ById, 'V01-Q05', { correct: true, score: 1, itemResults: { 0: true } });
  assert.equal(snapshot.curriculum.verifications[v01.id].clusterStates.reference, 'DEMONSTRADA');
}

// Q03 sozinho não satisfaz o agrupamento que exige Q03 + Q04.
{
  const progress = newProgress();
  let snapshot = record(progress, v01, v01ById, 'V01-Q03', { correct: true, score: 1, itemResults: { 0: true } });
  assert.notEqual(snapshot.curriculum.verifications[v01.id].clusterStates.explicitAndIntegration, 'DEMONSTRADA');
  snapshot = record(progress, v01, v01ById, 'V01-Q04', { correct: true, score: 1, itemResults: { 0: true } });
  assert.equal(snapshot.curriculum.verifications[v01.id].clusterStates.explicitAndIntegration, 'DEMONSTRADA');
}

// Sequência + uma relação basta; sequência isolada não.
for (const relationId of ['V01-Q08', 'V01-Q09']) {
  const progress = newProgress();
  let snapshot = record(progress, v01, v01ById, 'V01-Q07', { correct: true, score: 1, itemResults: { 0: true } });
  assert.notEqual(snapshot.curriculum.verifications[v01.id].clusterStates.sequenceAndRelations, 'DEMONSTRADA');
  snapshot = record(progress, v01, v01ById, relationId, { correct: true, score: 1, itemResults: { 0: true } });
  assert.equal(snapshot.curriculum.verifications[v01.id].clusterStates.sequenceAndRelations, 'DEMONSTRADA', `Q07 + ${relationId} deve satisfazer 2-de-3 com relação obrigatória.`);
}

// Dois resultados que não incluem Q08/Q09 não podem satisfazer o grupo de relações.
{
  const progress = newProgress();
  record(progress, v01, v01ById, 'V01-Q07', { correct: true, score: 1, itemResults: { 0: true } });
  const snapshot = record(progress, v01, v01ById, 'V01-Q08', { correct: false, score: 0, itemResults: { 0: false } });
  assert.notEqual(snapshot.curriculum.verifications[v01.id].clusterStates.sequenceAndRelations, 'DEMONSTRADA');
}

// L04: 2 de 3, incluindo uma atividade com múltiplas evidências.
{
  const progress = newProgress();
  let snapshot = record(progress, l04, l04ById, 'L04-C01', { correct: true, score: 1, itemResults: { 0: true } });
  assert.notEqual(snapshot.curriculum.lessons[l04.id].clusterStates.integration, 'DEMONSTRADA');
  snapshot = record(progress, l04, l04ById, 'L04-A01', { correct: true, score: 1, itemResults: { 0: true } });
  assert.equal(snapshot.curriculum.lessons[l04.id].clusterStates.integration, 'DEMONSTRADA');
}

// L05: pessoa + lugar e pelo menos três acertos agregados.
const l05 = normalize('content/units/004-lendo-compreendendo-pequenos-textos/lessons/005-a-quem-ou-a-que-isso-se-refere.json');
const l05ById = activityMap(l05);
{
  const progress = newProgress();
  record(progress, l05, l05ById, 'L05-C01', { correct: true, score: 1, itemResults: { 0: true } });
  record(progress, l05, l05ById, 'L05-A01', { correct: true, score: 1, itemResults: { 0: true } });
  const snapshot = record(progress, l05, l05ById, 'L05-A02', { correct: true, score: 1, itemResults: { 0: true } });
  assert.equal(snapshot.curriculum.lessons[l05.id].clusterStates.personPlaceReference, 'DEMONSTRADA');
}

// L07: causa/efeito exige três acertos agregados; A02 também preserva o item temporal obrigatório.
const l07 = normalize('content/units/004-lendo-compreendendo-pequenos-textos/lessons/007-tempo-causa-consequencia.json');
const l07ById = activityMap(l07);
assert.equal(l07ById.get('L07-A02').activity.evaluation.threshold, 0.5);
assert.deepEqual(l07ById.get('L07-A02').activity.evaluation.criteria, [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['0'] }]);
{
  const progress = newProgress();
  record(progress, l07, l07ById, 'L07-C01', { correct: true, score: 1, itemResults: { 0: true } });
  record(progress, l07, l07ById, 'L07-A01', { correct: true, score: 1, itemResults: { 0: true } });
  const snapshot = record(progress, l07, l07ById, 'L07-A02', { correct: true, score: 0.5, itemResults: { 0: true, 1: false } });
  assert.equal(snapshot.curriculum.lessons[l07.id].clusterStates.causeAndEffect, 'DEMONSTRADA');
}

console.log('P7 U04 evidence: seleção textual participa da correção, correctOrder é determinístico e regras agregadas 1-de-2/2-de-3 são preservadas.');
