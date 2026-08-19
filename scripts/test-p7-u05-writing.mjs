import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ContentService } from '../app/js/services/content-service.js';
import { ProgressService } from '../app/js/services/progress-service.js';
import { evaluateDeterministic } from '../app/js/ui/classic-deterministic-evaluator.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const normalize = file => service.normalize(readJson(file));
const activities = runtime => new Map(runtime.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));

function fakeForm({ radios = {}, checks = {}, sequences = {}, texts = {} } = {}) {
  const sequenceInputs = Object.entries(sequences).map(([name, value]) => ({ name, value: JSON.stringify(value), dataset: { sequenceValue: '' } }));
  const named = name => Object.prototype.hasOwnProperty.call(texts, name) ? { name, value: texts[name] } : null;
  return {
    querySelector(selector) {
      const match = selector.match(/^input\[name="([^"]+)"\]:checked$/);
      if (!match || !Object.prototype.hasOwnProperty.call(radios, match[1])) return null;
      return { name: match[1], value: String(radios[match[1]]), checked: true };
    },
    querySelectorAll(selector) {
      if (selector === '[data-sequence-value]') return sequenceInputs;
      const match = selector.match(/^input\[name="([^"]+)"\]:checked$/);
      if (match) return (checks[match[1]] || []).map(value => ({ name: match[1], value: String(value), checked: true }));
      if (selector.startsWith('select[')) return [];
      return [];
    },
    elements: { namedItem: named }
  };
}

const memoryStorage = () => {
  let value = null;
  return { getItem: () => value, setItem: (_key, next) => { value = next; } };
};
const newProgress = () => new ProgressService({ storage: memoryStorage(), clock: () => new Date('2026-08-19T15:30:00-03:00') });

function record(progress, runtime, byId, id, result, { response, support } = {}) {
  const block = byId.get(id);
  assert.ok(block, `${runtime.id}/${id}: atividade não encontrada.`);
  return progress.recordActivity(runtime, block, { complete: true, ...result }, { response, support });
}

// ---------------------------------------------------------------------------
// 1. Planejamento: múltiplas informações essenciais continuam múltiplas.
// ---------------------------------------------------------------------------
const l01Source = readJson('content/units/005-escrevendo-organizando-mensagens/lessons/001-da-ideia-a-mensagem.json');
const l01 = service.normalize(l01Source);
const l01ById = activities(l01);
const l01Authored = new Map(l01Source.sequence.map(item => [item.id, item]));
for (const id of ['L01-C01', 'L01-A01']) {
  const source = l01Authored.get(id);
  const block = l01ById.get(id);
  const expected = source.correctEssentialIndexes || source.correctIndexes;
  assert.equal(block.activity.interaction, 'MULTIPLE_CHOICE', `${id}: planejamento precisa ser múltipla escolha.`);
  assert.deepEqual(block.activity.evaluation.answerKey.correctIndexes, expected, `${id}: índices essenciais precisam ser preservados.`);
  assert.deepEqual(block.content.options, source.informationCards.map(item => typeof item === 'string' ? item : item.text));

  let result = evaluateDeterministic(fakeForm({ checks: { choice: expected } }), block);
  assert.equal(result.correct, true, `${id}: conjunto autorado completo deve ser aceito.`);
  result = evaluateDeterministic(fakeForm({ checks: { choice: expected.slice(0, -1) } }), block);
  assert.equal(result.correct, false, `${id}: omitir informação essencial não pode ser aceito.`);
}

// ---------------------------------------------------------------------------
// 2. Produção aberta: apoio é opcional/rastreado, modelo só depois e domínio fica pendente.
// ---------------------------------------------------------------------------
const l02Source = readJson('content/units/005-escrevendo-organizando-mensagens/lessons/002-escrevendo-frases-com-mais-autonomia.json');
const l02 = service.normalize(l02Source);
const l02ById = activities(l02);
const l02Authored = new Map(l02Source.sequence.map(item => [item.id, item]));
for (const id of ['L02-C01', 'L02-A01', 'L02-A02']) {
  const block = l02ById.get(id);
  assert.equal(block.activity.evaluation.mode, 'RELIABLE_EVALUATOR', `${id}: produção própria não pode virar heurística determinística.`);
  assert.equal(block.activity.evidence.recordResponse, true, `${id}: resposta aberta precisa ser persistida.`);
  assert.ok(['LONG_TEXT', 'COMPOSITE'].includes(block.activity.interaction));
  assert.ok(Array.isArray(block.content.selfReviewQuestions) && block.content.selfReviewQuestions.length > 0, `${id}: autochecagem precisa sobreviver ao runtime.`);
}

const l02Html = documentHtml(l02, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens' });
assert.match(l02Html, /Ver apoio opcional/);
assert.match(l02Html, /Autochecagem/);
for (const id of ['L02-C01', 'L02-A01', 'L02-A02']) {
  for (const model of l02Authored.get(id).modelExamplesAfterSubmission || []) {
    assert.doesNotMatch(l02Html, new RegExp(model.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${id}: modelo pós-envio não pode aparecer antes da tentativa.`);
  }
}
assert.doesNotMatch(l02Html, /modelExamplesAfterSubmission|notAutomaticallyJudged|automaticObservations/);

// As duas produções são exigidas e pelo menos uma precisa ocorrer sem abrir apoio.
{
  const progress = newProgress();
  record(progress, l02, l02ById, 'L02-A01', { pending: true }, { response: { openResponse: 'Marta chega às seis.' }, support: { hintUsed: true } });
  let snapshot = record(progress, l02, l02ById, 'L02-A02', { pending: true }, { response: { openResponse: 'Onde fica o banheiro?' }, support: { hintUsed: true } });
  assert.equal(snapshot.curriculum.lessons[l02.id].status, 'EM_ESTUDO', 'Duas produções com apoio não satisfazem a regra de pelo menos uma sem apoio.');
  assert.equal(snapshot.evidence['N0-U05-L02/L02-A01'].status, 'VALIDACAO_PENDENTE');
  assert.equal(snapshot.evidence['N0-U05-L02/L02-A02'].status, 'VALIDACAO_PENDENTE');
}
{
  const progress = newProgress();
  record(progress, l02, l02ById, 'L02-A01', { pending: true }, { response: { openResponse: 'Marta chega às seis.' }, support: { hintUsed: true } });
  const snapshot = record(progress, l02, l02ById, 'L02-A02', { pending: true }, { response: { openResponse: 'Onde fica o banheiro?' }, support: { hintUsed: false } });
  assert.equal(snapshot.curriculum.lessons[l02.id].status, 'CONCLUIDA', 'Produzir e autorrevisar as duas frases, sendo uma sem apoio, conclui o percurso autônomo.');
  assert.equal(snapshot.responses['N0-U05-L02/L02-A02'].value.openResponse, 'Onde fica o banheiro?');
}

// ---------------------------------------------------------------------------
// 3. Edição controlada pode ser exata sem contaminar produção própria.
// ---------------------------------------------------------------------------
const l08Source = readJson('content/units/005-escrevendo-organizando-mensagens/lessons/008-organizando-a-escrita-espacos-maiuscula-limites.json');
const l08 = service.normalize(l08Source);
const l08ById = activities(l08);
const l08Authored = new Map(l08Source.sequence.map(item => [item.id, item]));
for (const id of ['L08-A01', 'L08-A02']) {
  const source = l08Authored.get(id);
  const block = l08ById.get(id);
  assert.equal(block.activity.interaction, 'SHORT_TEXT');
  assert.equal(block.activity.evaluation.mode, 'DETERMINISTIC');
  assert.equal(block.activity.evaluation.answerKey.expected, source.expected);

  let result = evaluateDeterministic(fakeForm({ texts: { openResponse: source.expected } }), block);
  assert.equal(result.correct, true, `${id}: edição exata autorada deve ser aceita.`);
  result = evaluateDeterministic(fakeForm({ texts: { openResponse: source.expected.toLocaleLowerCase('pt-BR') } }), block);
  if (source.expected !== source.expected.toLocaleLowerCase('pt-BR')) assert.equal(result.correct, false, `${id}: maiúscula relevante não pode ser descartada na edição controlada.`);
}

// ---------------------------------------------------------------------------
// 4. V01: múltiplas ordens válidas, edição+princípio e produção aberta não compensável.
// ---------------------------------------------------------------------------
const v01Source = readJson('content/units/005-escrevendo-organizando-mensagens/integrated-verification.json');
const v01 = service.normalize(v01Source);
const v01ById = activities(v01);
const sourceById = new Map(v01Source.items.map(item => [item.id, item]));

const q01 = v01ById.get('V01-Q01');
assert.equal(q01.activity.interaction, 'MULTIPLE_CHOICE');
assert.deepEqual(q01.activity.evaluation.answerKey.correctIndexes, sourceById.get('V01-Q01').correctIndexes);

const q03 = v01ById.get('V01-Q03');
assert.equal(q03.activity.interaction, 'SEQUENCE');
assert.deepEqual(q03.activity.evaluation.answerKey.acceptedSequences, sourceById.get('V01-Q03').acceptableOrders);
for (const accepted of sourceById.get('V01-Q03').acceptableOrders) {
  const result = evaluateDeterministic(fakeForm({ sequences: { sequence: accepted } }), q03);
  assert.equal(result.correct, true, 'Toda ordem explicitamente autorada precisa ser aceita.');
}
const invalidOrder = [...sourceById.get('V01-Q03').acceptableOrders[0]].reverse();
if (!sourceById.get('V01-Q03').acceptableOrders.some(item => JSON.stringify(item) === JSON.stringify(invalidOrder))) {
  assert.equal(evaluateDeterministic(fakeForm({ sequences: { sequence: invalidOrder } }), q03).correct, false);
}

const q10 = v01ById.get('V01-Q10');
const q10Source = sourceById.get('V01-Q10');
assert.equal(q10.activity.interaction, 'COMPOSITE');
assert.equal(q10.activity.evaluation.mode, 'DETERMINISTIC');
assert.equal(q10.activity.evaluation.answerKey.items.edit.acceptedResult, q10Source.expected);
assert.equal(q10.activity.evaluation.answerKey.items.principle.correctIndex, q10Source.principleCorrectIndex);
let q10Result = evaluateDeterministic(fakeForm({ texts: { 'round-text:edit': q10Source.expected }, radios: { 'round:principle': q10Source.principleCorrectIndex } }), q10);
assert.equal(q10Result.correct, true, 'Q10 exige edição e princípio corretos.');
q10Result = evaluateDeterministic(fakeForm({ texts: { 'round-text:edit': q10Source.expected }, radios: { 'round:principle': (q10Source.principleCorrectIndex + 1) % q10Source.principleOptions.length } }), q10);
assert.equal(q10Result.correct, false, 'Edição certa não compensa princípio errado.');

const q08 = v01ById.get('V01-Q08');
const q08Source = sourceById.get('V01-Q08');
assert.equal(q08.activity.evaluation.mode, 'RELIABLE_EVALUATOR');
assert.equal(q08.activity.evidence.recordResponse, true);
assert.deepEqual(q08.content.planningChecklist, q08Source.essentialInformation);
assert.deepEqual(q08.content.selfReviewQuestions, q08Source.selfReview);
const v01Html = documentHtml(v01, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens', verification: true });
assert.match(v01Html, /Antes de escrever|informações essenciais/i);
assert.match(v01Html, /Autochecagem/);
assert.doesNotMatch(v01Html, /notAutomaticallyJudged|humanOrExternalReview|automaticObservations|correctIndexes|acceptableOrders/);

assert.deepEqual(v01.completion.clusters.map(item => item.id), [
  'planningAndPurpose', 'organizationAndSufficiency', 'revision', 'graphicConventions', 'ownProduction'
]);
assert.equal(v01.completion.clusters.find(item => item.id === 'ownProduction').satisfaction, 'PENDING_ALLOWED');
assert.deepEqual(v01.completion.clusters.find(item => item.id === 'graphicConventions').criteria, [
  { type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q09'], minimum: 2 }
]);
assert.equal(v01ById.get('V01-Q09').activity.evaluation.threshold, 2 / 3);

// O percurso da V01 pode ser concluído autonomamente com a produção própria ainda pendente de validação confiável.
{
  const progress = newProgress();
  const simple = id => record(progress, v01, v01ById, id, { correct: true, score: 1, itemResults: { 0: true } });
  simple('V01-Q01');
  simple('V01-Q02');
  simple('V01-Q03');
  simple('V01-Q04');
  simple('V01-Q05');
  simple('V01-Q06');
  simple('V01-Q07');
  record(progress, v01, v01ById, 'V01-Q09', { correct: true, score: 2 / 3, itemResults: { 0: true, 1: true, 2: false } });
  simple('V01-Q10');
  const snapshot = record(progress, v01, v01ById, 'V01-Q08', { pending: true }, {
    response: {
      openResponse: 'Carlos, a chave está na gaveta da cozinha.',
      'planning:0': 'done', 'planning:1': 'done',
      'selfReview:0': 'done', 'selfReview:1': 'done'
    }
  });
  assert.equal(snapshot.curriculum.verifications[v01.id].clusterStates.ownProduction, 'VALIDACAO_PENDENTE');
  assert.equal(snapshot.curriculum.verifications[v01.id].status, 'CONCLUIDA', 'Percurso autônomo conclui sem fingir validação linguística da produção própria.');
  assert.equal(snapshot.evidence['N0-U05-V01/V01-Q08'].status, 'VALIDACAO_PENDENTE');
  assert.equal(snapshot.responses['N0-U05-V01/V01-Q08'].value.openResponse, 'Carlos, a chave está na gaveta da cozinha.');
}

console.log('P7 U05 writing: planejamento múltiplo, apoio sem penalidade, produção pendente, edição controlada, ordens alternativas e V01 não compensável preservados.');
