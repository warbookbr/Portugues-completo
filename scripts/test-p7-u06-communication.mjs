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
const newProgress = () => new ProgressService({ storage: memoryStorage(), clock: () => new Date('2026-08-19T16:30:00-03:00') });

function record(progress, runtime, byId, id, result, { response, support } = {}) {
  const block = byId.get(id);
  assert.ok(block, `${runtime.id}/${id}: atividade não encontrada.`);
  return progress.recordActivity(runtime, block, { complete: true, ...result }, { response, support });
}

// ---------------------------------------------------------------------------
// 1. Compreensão oral audio-first: transcrição não existe no HTML inicial.
// ---------------------------------------------------------------------------
const l06Source = readJson('content/units/006-usando-lingua-cotidiano/lessons/006-ouvindo-mensagens-curtas.json');
const l06 = service.normalize(l06Source);
const l06ById = activityMap(l06);
const l06Html = documentHtml(l06, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano' });

const transcriptTexts = [];
for (const block of l06Source.sequence || []) {
  if (typeof block.transcriptAfterAttempt === 'string') transcriptTexts.push(block.transcriptAfterAttempt);
  for (const item of block.items || []) if (typeof item.transcriptAfterAttempt === 'string') transcriptTexts.push(item.transcriptAfterAttempt);
}
assert.ok(transcriptTexts.length >= 3, 'L06 deve manter vários casos audio-first com transcrição pós-tentativa.');
for (const transcript of transcriptTexts) {
  assert.equal(l06Html.includes(transcript), false, `Transcrição não pode estar no HTML inicial: ${transcript}`);
}
assert.match(l06Html, /data-delayed-transcript-control/, 'Demonstração oral precisa oferecer revelação posterior da transcrição.');
assert.match(l06Html, /data-transcript-reveal disabled/, 'Transcrição da demonstração precisa iniciar bloqueada até o áudio ser ouvido.');
assert.doesNotMatch(l06Html, /transcriptAfterAttempt|transcriptHiddenUntilAttempt/);

const c01 = l06ById.get('L06-C01');
assert.equal(c01.activity.evaluation.mode, 'DETERMINISTIC');
assert.ok(c01.content.ttsText, 'C01 precisa manter TTS como estímulo oral.');

// Replay é suporte de acesso/prática, não erro automático.
{
  const progress = newProgress();
  const snapshot = record(progress, l06, l06ById, 'L06-C01', { correct: true, score: 1, itemResults: { 0: true } }, { support: { replayCount: 3 } });
  const evidence = snapshot.evidence['N0-U06-L06/L06-C01'];
  assert.equal(evidence.status, 'DEMONSTRADA');
  assert.equal(evidence.support.replayCount, 3);
  assert.equal(evidence.support.hintUsed, false);
}

// ---------------------------------------------------------------------------
// 2. Adequação e variação: contexto sem hierarquia moral/linguística.
// ---------------------------------------------------------------------------
const l07Source = readJson('content/units/006-usando-lingua-cotidiano/lessons/007-mais-formal-ou-mais-informal.json');
const l08Source = readJson('content/units/006-usando-lingua-cotidiano/lessons/008-maneiras-diferentes-de-usar-o-portugues.json');
const l07 = service.normalize(l07Source);
const l08 = service.normalize(l08Source);
const l07Html = documentHtml(l07, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano' });
const l08Html = documentHtml(l08, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano' });

assert.match(JSON.stringify(l07Source.limits), /não tratar linguagem informal como errada|não apresentar linguagem mais formal como automaticamente melhor/i);
assert.match(JSON.stringify(l08Source.limits), /variedade|sotaque|preconceito|erro/i);
assert.doesNotMatch(l07Html + l08Html, /linguagem informal é sempre errada[.!]|mais formal é automaticamente melhor[.!]|sotaque[^.!?]{0,40}é erro[.!]|variedade[^.!?]{0,40}é inferior[.!]/i);

// ---------------------------------------------------------------------------
// 3. Reformulação própria + ensaio oral: escrita pendente, ensaio suplementar.
// ---------------------------------------------------------------------------
const l10 = normalize('content/units/006-usando-lingua-cotidiano/lessons/010-reformular-e-confirmar-comunicacao.json');
const l10ById = activityMap(l10);
const a02 = l10ById.get('L10-A02');
assert.equal(a02.activity.evaluation.mode, 'RELIABLE_EVALUATOR');
assert.equal(a02.activity.evidence.recordResponse, true);
assert.equal(a02.content.oralRehearsal?.enabled, true);
assert.equal(a02.content.oralRehearsal?.required, false, 'Ensaio oral da L10 complementa a escrita; não substitui a reformulação escrita.');
const l10Html = documentHtml(l10, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano' });
assert.match(l10Html, /Ensaio oral/);
assert.match(l10Html, /Este ensaio é opcional nesta etapa escrita/);
assert.match(l10Html, /não avalia pronúncia, sotaque ou compreensibilidade da fala/i);
assert.match(l10Html, /Registrar resposta/);

// ---------------------------------------------------------------------------
// 4. V01: open writing pending + oral practice pending + clusters não compensáveis.
// ---------------------------------------------------------------------------
const v01Source = readJson('content/units/006-usando-lingua-cotidiano/integrated-verification.json');
const v01 = service.normalize(v01Source);
const vById = activityMap(v01);
assert.deepEqual(v01.completion.clusters.map(item => item.id), [
  'comprehensionAndPurpose',
  'functionalUseAndProduction',
  'oralComprehension',
  'adequacyVariationAndRepair',
  'oralProductionPractice'
]);
assert.equal(v01.completion.nonCompensable, true);
assert.equal(v01.completion.clusters.find(item => item.id === 'functionalUseAndProduction').satisfaction, 'PENDING_ALLOWED');
assert.equal(v01.completion.clusters.find(item => item.id === 'oralProductionPractice').satisfaction, 'PENDING_ALLOWED');

for (const id of ['V01-Q02', 'V01-Q11']) {
  const block = vById.get(id);
  assert.equal(block.activity.evaluation.mode, 'RELIABLE_EVALUATOR', `${id}: produção própria escrita precisa ficar pendente.`);
  assert.equal(block.activity.evidence.recordResponse, true);
}

const q12 = vById.get('V01-Q12');
assert.equal(q12.activity.interaction, 'ORAL_RESPONSE');
assert.equal(q12.activity.evaluation.mode, 'RELIABLE_EVALUATOR');
assert.equal(q12.activity.evidence.recordResponse, true);
assert.equal(q12.content.oralRehearsal?.required, true);
assert.ok(Array.isArray(q12.content.selfReviewQuestions) && q12.content.selfReviewQuestions.length >= 1);

const v01Html = documentHtml(v01, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano', verification: true });
assert.match(v01Html, /Ensaio oral/);
assert.match(v01Html, /Concluí o ensaio oral/);
assert.match(v01Html, /não avalia pronúncia, sotaque ou compreensibilidade da fala/i);
assert.doesNotMatch(v01Html, /transcriptAfterAttempt|externalReview|requiredForClaimOfValidatedOralComprehensibility|notAutomaticallyJudged|automaticObservations/);
for (const item of v01Source.items || []) {
  if (typeof item.transcriptAfterAttempt === 'string') assert.equal(v01Html.includes(item.transcriptAfterAttempt), false, `${item.id}: transcrição não pode aparecer antes da tentativa.`);
}

// Sem Q12, todos os outros clusters podem estar satisfeitos e a verificação ainda NÃO conclui.
{
  const progress = newProgress();
  const correct = id => record(progress, v01, vById, id, { correct: true, score: 1, itemResults: { 0: true } });
  correct('V01-Q01');
  record(progress, v01, vById, 'V01-Q02', { pending: true }, { response: { openResponse: 'Você pode repetir, por favor?' } });
  correct('V01-Q03');
  correct('V01-Q04');
  correct('V01-Q05');
  correct('V01-Q06');
  correct('V01-Q07');
  correct('V01-Q08');
  correct('V01-Q09');
  correct('V01-Q10');
  const snapshot = record(progress, v01, vById, 'V01-Q11', { pending: true }, { response: { openResponse: 'Você quer confirmar se o encontro é às oito?' } });
  assert.equal(snapshot.curriculum.verifications[v01.id].status, 'EM_ESTUDO', 'Prática oral obrigatória não pode ser compensada pelo restante.');
  assert.equal(snapshot.curriculum.verifications[v01.id].clusterStates.functionalUseAndProduction, 'VALIDACAO_PENDENTE');
  assert.equal(snapshot.curriculum.verifications[v01.id].clusterStates.oralComprehension, 'DEMONSTRADA');
}

// Q12 registra participação/autochecagem como pending; isso conclui o percurso sem alegar oralidade validada.
{
  const progress = newProgress();
  const correct = id => record(progress, v01, vById, id, { correct: true, score: 1, itemResults: { 0: true } });
  correct('V01-Q01');
  record(progress, v01, vById, 'V01-Q02', { pending: true }, { response: { openResponse: 'Você pode repetir, por favor?' } });
  correct('V01-Q03');
  correct('V01-Q04');
  correct('V01-Q05');
  correct('V01-Q06');
  correct('V01-Q07');
  correct('V01-Q08');
  correct('V01-Q09');
  correct('V01-Q10');
  record(progress, v01, vById, 'V01-Q11', { pending: true }, { response: { openResponse: 'Você quer confirmar se o encontro é às oito?' } });
  const snapshot = record(progress, v01, vById, 'V01-Q12', { pending: true }, {
    response: { oralRehearsalDone: true, 'selfReview:0': 'done', 'selfReview:1': 'done' }
  });
  assert.equal(snapshot.curriculum.verifications[v01.id].status, 'CONCLUIDA');
  assert.equal(snapshot.curriculum.verifications[v01.id].clusterStates.oralProductionPractice, 'VALIDACAO_PENDENTE');
  assert.equal(snapshot.evidence['N0-U06-V01/V01-Q12'].status, 'VALIDACAO_PENDENTE');
  assert.equal(snapshot.responses['N0-U06-V01/V01-Q12'].value.oralRehearsalDone, true);
}

console.log('P7 U06 communication: audio-first sem transcript precoce, replay sem penalidade, adequação sem estigma, escrita/oral pending e V01 não compensável preservados.');
