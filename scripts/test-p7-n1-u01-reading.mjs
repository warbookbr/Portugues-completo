import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ContentService } from '../app/js/services/content-service.js';
import { ProgressService } from '../app/js/services/progress-service.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const normalize = file => service.normalize(readJson(file));
const activityMap = runtime => new Map(runtime.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));

const memoryStorage = () => {
  let value = null;
  return { getItem: () => value, setItem: (_key, next) => { value = next; } };
};
const newProgress = () => new ProgressService({ storage: memoryStorage(), clock: () => new Date('2026-08-20T22:30:00-03:00') });

function record(progress, runtime, byId, id, result, { response, support } = {}) {
  const block = byId.get(id);
  assert.ok(block, `${runtime.id}/${id}: atividade não encontrada.`);
  return progress.recordActivity(runtime, block, { complete: true, ...result }, { response, support });
}

// 1. Guard-rail binário da L05 precisa ser atividade real, não conteúdo decorativo.
const l05 = normalize('content/units/101-lendo-textos-mais-autonomia/lessons/005-relacoes-tempo-causa-contraste-explicacao.json');
const l05ById = activityMap(l05);
const b03 = l05ById.get('L05-B03');
assert.ok(b03, 'L05-B03 precisa permanecer como evidência da distinção sequência x causa.');
assert.equal(b03.activity.interaction, 'SINGLE_CHOICE');
assert.equal(b03.activity.evaluation.mode, 'DETERMINISTIC');
assert.deepEqual(b03.content.options, ['sim', 'não']);
assert.equal(b03.activity.evaluation.answerKey.correctIndex, 1);
const relations = l05.completion.clusters.find(item => item.id === 'relations');
assert.ok(relations.criteria.some(item => item.type === 'TOTAL_ITEM_HITS_AT_LEAST' && item.minimum === 4));

// 2. Fonte/origem: resposta curta dentro de atividade composta deve ser renderizável.
const l08 = normalize('content/units/101-lendo-textos-mais-autonomia/lessons/008-quem-escreveu-fonte-opiniao-razao.json');
const l08ById = activityMap(l08);
const a01 = l08ById.get('L08-A01');
assert.equal(a01.activity.interaction, 'COMPOSITE');
assert.equal(a01.activity.evaluation.mode, 'DETERMINISTIC');
assert.equal(a01.activity.evaluation.answerKey.items['1'].acceptedResult, 'Secretaria Municipal de Saúde');
const l08Html = documentHtml(l08, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia' });
assert.doesNotMatch(l08Html, /Interação ainda não suportada/i);
assert.match(l08Html, /round-text:1/);
assert.doesNotMatch(l08Html, /acceptedCore|acceptedResult|answerKey/i);

// 3. TextRef da V01 precisa materializar texto consultável e evidência textual.
const v01Source = readJson('content/units/101-lendo-textos-mais-autonomia/integrated-verification.json');
const v01 = service.normalize(v01Source);
const vById = activityMap(v01);
const vHtml = documentHtml(v01, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia', verification: true });
for (const id of ['V01-Q02', 'V01-Q03']) {
  const block = vById.get(id);
  assert.ok(Array.isArray(block.content.evidenceOptions) && block.content.evidenceOptions.length >= 1, `${id}: evidência textual precisa ser materializada.`);
}
const q04 = vById.get('V01-Q04');
assert.ok(Array.isArray(q04.content.items[0].evidenceOptions) && q04.content.items[0].evidenceOptions.length >= 1, 'Q04 item inferencial precisa manter evidência aninhada.');
assert.match(vHtml, /Oficina de consertos amplia vagas/);
assert.match(vHtml, /Mudança no ponto de coleta/);
assert.match(vHtml, /As inscrições para a nova turma começam na segunda-feira/);
assert.match(vHtml, /O horário permanece das 8h às 13h/);

// 4. Multimodalidade: texto e equivalente acessível são fontes disponíveis, não um falso seletor de evidência.
const q05 = vById.get('V01-Q05');
assert.equal(q05.activity.interaction, 'SINGLE_CHOICE');
assert.match(vHtml, /A rota indicada é Entrada → Balcão → Corredor A → Sala 12/);
assert.match(vHtml, /Depois de entregar a ficha no balcão/);
assert.doesNotMatch(vHtml, /evidenceSourcesRequired|visual-or-accessible-equivalent/);

// 5. Resumos próprios permanecem pendentes, nunca heurística determinística.
const l09 = normalize('content/units/101-lendo-textos-mais-autonomia/lessons/009-resumindo-ideia-principal-palavras-proprias.json');
const l09ById = activityMap(l09);
for (const id of ['L09-C01', 'L09-A01']) {
  const block = l09ById.get(id);
  assert.equal(block.activity.evaluation.mode, 'RELIABLE_EVALUATOR');
  assert.equal(block.activity.evidence.recordResponse, true);
}
assert.equal(l09.completion.clusters.find(item => item.id === 'ownSummary').satisfaction, 'PENDING_ALLOWED');
assert.equal(l09.completion.clusters.find(item => item.id === 'selectionOfEssential').satisfaction, 'PENDING_ALLOWED');

const q07 = vById.get('V01-Q07');
assert.equal(q07.activity.evaluation.mode, 'RELIABLE_EVALUATOR');
assert.equal(q07.activity.evidence.recordResponse, true);
assert.equal(v01.completion.nonCompensable, true);
assert.deepEqual(v01.completion.clusters.map(item => item.id), [
  'globalComprehension',
  'locationAndIntegration',
  'referenceAndRelations',
  'inferenceAndInsufficiency',
  'multimodality',
  'sourceOpinionReason',
  'ownSummary'
]);
assert.equal(v01.completion.clusters.find(item => item.id === 'ownSummary').satisfaction, 'PENDING_ALLOWED');
assert.doesNotMatch(vHtml, /humanOrExternalReview|notAutomaticallyJudged|automaticObservations|completionEvidence|designPrinciples/);
for (const model of v01Source.items.find(item => item.id === 'V01-Q07').modelExamplesAfterSubmission || []) {
  assert.equal(vHtml.includes(model), false, 'Modelo de resumo não pode aparecer antes da tentativa.');
}

// 6. Não compensação: Q01-Q06 corretas não concluem sem o resumo próprio.
{
  const progress = newProgress();
  let snapshot = null;
  for (const id of ['V01-Q01', 'V01-Q02', 'V01-Q03', 'V01-Q04', 'V01-Q05', 'V01-Q06']) {
    snapshot = record(progress, v01, vById, id, { correct: true, score: 1, itemResults: { 0: true, 1: true, 2: true } });
  }
  assert.equal(snapshot.curriculum.verifications[v01.id].status, 'EM_ESTUDO', 'Tarefas fechadas não podem compensar ausência do resumo próprio.');
}

// 7. Resumo produzido/autorrevisado conclui o percurso, mas continua VALIDACAO_PENDENTE.
{
  const progress = newProgress();
  for (const id of ['V01-Q01', 'V01-Q02', 'V01-Q03', 'V01-Q04', 'V01-Q05', 'V01-Q06']) {
    record(progress, v01, vById, id, { correct: true, score: 1, itemResults: { 0: true, 1: true, 2: true } });
  }
  const snapshot = record(progress, v01, vById, 'V01-Q07', { pending: true }, {
    response: {
      openResponse: 'O ponto de coleta muda para a Rua do Mercado a partir de sábado e mantém o mesmo horário.',
      'selfReview:0': 'done',
      'selfReview:1': 'done',
      'selfReview:2': 'done',
      'selfReview:3': 'done'
    }
  });
  assert.equal(snapshot.curriculum.verifications[v01.id].status, 'CONCLUIDA');
  assert.equal(snapshot.curriculum.verifications[v01.id].clusterStates.ownSummary, 'VALIDACAO_PENDENTE');
  assert.equal(snapshot.evidence['N1-U01-V01/V01-Q07'].status, 'VALIDACAO_PENDENTE');
}

console.log('P7 N1-U01 reading: textRef consultável, evidência textual, relação 4/5, multimodalidade acessível, fonte/origem e resumo pending não compensável preservados.');
