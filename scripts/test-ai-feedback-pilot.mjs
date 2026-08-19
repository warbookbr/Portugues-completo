import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ContentService } from '../app/js/services/content-service.js';
import { AiFeedbackError, buildAiFeedbackEnvelope, createAiFeedbackService } from '../app/js/services/ai-feedback-service.js';
import { createProgressService } from '../app/js/services/progress-service.js';

const source = JSON.parse(fs.readFileSync('content/units/409-literatura-multimodalidade-autoria-intermedial-digital/lessons/001-interpretacao-literaria-autonoma-evidencia.json', 'utf8'));
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const runtime = service.normalize(source);
const block = runtime.blocks.find(item => item.id === 'L01-A01');

assert.ok(block, 'Piloto P6 precisa manter L01-A01 no runtime.');
assert.equal(block.activity.evaluation.mode, 'RELIABLE_EVALUATOR');
assert.equal(block.content.aiFeedback.enabled, true);
assert.equal(block.content.aiFeedback.policyVersion, 'n4-u09-l01-a01-formative-v1');
assert.deepEqual(block.content.aiFeedback.materialBlockIds, ['L01-B01']);
assert.equal(block.content.aiFeedback.criteria.length, 5);
assert.equal(new Set(block.content.aiFeedback.criteria.map(item => item.id)).size, 5);

const learnerResponse = 'Lia parece hesitar diante da partida. O painel apagado, o bilhete ainda inteiro e o fato de ela não se aproximar da plataforma sustentam essa leitura. Também é possível que esteja apenas esperando mais informação. O texto não permite afirmar com certeza se ela desistirá definitivamente da viagem.';
const envelope = buildAiFeedbackEnvelope({ document: runtime, block, response: learnerResponse, context: { levelId: 'N4', unitId: 'N4-U09' } });
assert.equal(envelope.policy.mayPromoteEvidence, false);
assert.equal(envelope.policy.requiresReliableEvaluator, true);
assert.equal(envelope.task.materials.length, 1);
assert.equal(envelope.task.materials[0].id, 'L01-B01');
assert.match(envelope.task.materials[0].content.text, /Na estação vazia/);
assert.equal(JSON.stringify(envelope).includes('L01-B02'), false, 'Mapa de evidências não declarado não pode ser enviado por conveniência.');
assert.equal(JSON.stringify(envelope).includes('L01-C01'), false, 'Quick-check não declarado não pode ser enviado por conveniência.');

const storage = new Map();
const storageAdapter = {
  getItem: key => storage.has(key) ? storage.get(key) : null,
  setItem: (key, value) => storage.set(key, value)
};
const progressService = createProgressService({ storage: storageAdapter, clock: () => new Date('2026-08-19T12:00:00.000Z') });
progressService.visitDocument(runtime, { levelId: 'N4', unitId: 'N4-U09' });
progressService.recordActivity(runtime, block, { complete: true, pending: true }, { response: learnerResponse });
const evidenceRef = `${runtime.id}/${block.id}`;
assert.equal(progressService.getProgress().evidence[evidenceRef].status, 'VALIDACAO_PENDENTE');
assert.equal(progressService.getProgress().responses[evidenceRef].value, learnerResponse);

const successfulResult = {
  schemaVersion: 1,
  result: 'OK',
  criterionResults: block.content.aiFeedback.criteria.map((criterion, index) => ({
    criterionId: criterion.id,
    status: index === 2 ? 'PARTIAL' : 'MET',
    evidence: `Trecho observado para ${criterion.id}`,
    feedback: index === 2 ? 'Explique com mais detalhe como uma das evidências sustenta a leitura.' : 'Critério observado na resposta.'
  })),
  feedback: {
    summary: 'A interpretação está sustentada e reconhece um limite de certeza.',
    strengths: ['usa evidências internas', 'considera uma alternativa plausível'],
    improvements: ['explicitar melhor um vínculo entre evidência e interpretação'],
    nextStep: 'Reescreva uma frase tornando esse vínculo mais explícito.'
  },
  confidence: 'MEDIUM',
  recommendation: 'REVISE',
  flags: []
};

const aiSuccess = createAiFeedbackService({
  adapters: { fake: { requiresCredential: false, async request() { return successfulResult; } } },
  getConfig: () => ({ enabled: true, provider: 'fake', model: 'test' })
});
const beforeSuccess = progressService.getProgress();
const success = await aiSuccess.requestFeedback({ document: runtime, block, response: learnerResponse, context: { levelId: 'N4', unitId: 'N4-U09' } });
assert.equal(success.result, 'OK');
assert.deepEqual(progressService.getProgress(), beforeSuccess, 'Feedback bem-sucedido não pode mutar progresso/domínio.');
assert.equal(progressService.getProgress().evidence[evidenceRef].status, 'VALIDACAO_PENDENTE');

const aiFailure = createAiFeedbackService({
  adapters: { fake: { requiresCredential: false, async request() { throw new AiFeedbackError('PROVIDER_REQUEST_FAILED', 'offline'); } } },
  getConfig: () => ({ enabled: true, provider: 'fake', model: 'test' })
});
const beforeFailure = progressService.getProgress();
const failure = await aiFailure.requestFeedback({ document: runtime, block, response: learnerResponse });
assert.equal(failure.result, 'PROVIDER_ERROR');
assert.deepEqual(progressService.getProgress(), beforeFailure, 'Falha de provider também não pode mutar progresso/domínio.');
assert.equal(progressService.getProgress().responses[evidenceRef].value, learnerResponse);
assert.equal(progressService.getProgress().evidence[evidenceRef].status, 'VALIDACAO_PENDENTE');

console.log('P6.2 piloto: N4-U09-L01 elegível, payload mínimo e sucesso/falha de IA sem mutação do progresso validados.');
