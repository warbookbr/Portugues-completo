import assert from 'node:assert/strict';

import {
  AiFeedbackError,
  buildAiFeedbackEnvelope,
  createAiFeedbackService,
  validateAiFeedbackResult
} from '../app/js/services/ai-feedback-service.js';

const documentRuntime = {
  schemaVersion: 1,
  id: 'N4-U09-L01',
  kind: 'LESSON',
  title: 'Interpretação literária autônoma e evidência',
  objective: 'Formular interpretação própria sustentada por evidências e reconhecer limites de certeza.',
  limits: ['gosto pessoal não substitui evidência', 'não exigir repertório externo secreto'],
  blocks: [
    {
      id: 'L01-B01',
      kind: 'CONTENT',
      pedagogicalType: 'authored-literary-text',
      content: {
        text: 'Na estação vazia, Lia conferiu três vezes o painel apagado.',
        task: 'formular uma leitura inicial',
        internalNote: 'não deve ser enviada'
      }
    },
    {
      id: 'L01-B99',
      kind: 'CONTENT',
      pedagogicalType: 'unrelated',
      content: { text: 'Material não necessário para esta atividade.' }
    },
    {
      id: 'L01-A01',
      kind: 'ACTIVITY',
      pedagogicalType: 'open-interpretation',
      content: {
        prompt: 'Apresente uma interpretação própria e sustente-a por evidências.',
        aiFeedback: {
          enabled: true,
          policyVersion: 'n4-u09-l01-a01-feedback-v1',
          materialBlockIds: ['L01-B01'],
          criteria: [
            { id: 'C1', description: 'formula uma interpretação própria', required: true },
            { id: 'C2', description: 'relaciona evidências à interpretação', required: true }
          ],
          limits: ['não exigir concordância com uma interpretação-modelo']
        }
      },
      activity: {
        role: 'PRODUCTION',
        interaction: 'LONG_TEXT',
        evaluation: { mode: 'RELIABLE_EVALUATOR', feedbackTiming: 'AFTER_ACTIVITY', allowRetry: true, penalizeSupport: false, criteria: [], threshold: null },
        evidence: { role: 'REQUIRED', competencyIds: ['N4-U09-C01'], clusterId: 'interpretationEvidence', recordResponse: true, requiredForCompletion: true },
        stimuli: []
      }
    }
  ],
  completion: { clusters: [], nonCompensable: false }
};

const activity = documentRuntime.blocks.find(item => item.id === 'L01-A01');
const response = 'A personagem parece hesitar porque o painel está apagado e ela permanece distante da plataforma.';
const envelope = buildAiFeedbackEnvelope({
  document: documentRuntime,
  block: activity,
  response,
  context: { levelId: 'N4', unitId: 'N4-U09' }
});

assert.equal(envelope.schemaVersion, 1);
assert.equal(envelope.context.courseId, 'portugues-completo');
assert.equal(envelope.context.levelId, 'N4');
assert.equal(envelope.context.unitId, 'N4-U09');
assert.equal(envelope.context.lessonId, 'N4-U09-L01');
assert.equal(envelope.context.activityId, 'L01-A01');
assert.equal(envelope.policy.purpose, 'FORMATIVE_FEEDBACK');
assert.equal(envelope.policy.mayPromoteEvidence, false);
assert.equal(envelope.policy.requiresReliableEvaluator, true);
assert.equal(envelope.task.materials.length, 1);
assert.equal(envelope.task.materials[0].id, 'L01-B01');
assert.equal(envelope.task.materials[0].content.text.includes('estação vazia'), true);
assert.equal('internalNote' in envelope.task.materials[0].content, false, 'payload mínimo não deve enviar metadado interno não autorizado.');
assert.equal(JSON.stringify(envelope).includes('L01-B99'), false, 'material não declarado não deve ser enviado.');
assert.equal(envelope.task.criteria.length, 2);
assert.ok(envelope.task.limits.includes('gosto pessoal não substitui evidência'));
assert.ok(envelope.task.limits.includes('não exigir concordância com uma interpretação-modelo'));

const validProviderResult = {
  schemaVersion: 1,
  result: 'OK',
  criterionResults: [
    { criterionId: 'C1', status: 'MET', evidence: 'Há uma hipótese interpretativa explícita.', feedback: 'A leitura está formulada de modo claro.' },
    { criterionId: 'C2', status: 'PARTIAL', evidence: 'O painel apagado sustenta parte da leitura.', feedback: 'Relacione também outra evidência do texto.' }
  ],
  feedback: {
    summary: 'A interpretação é plausível, mas precisa de mais sustentação.',
    strengths: ['hipótese clara'],
    improvements: ['ampliar o vínculo com evidências'],
    nextStep: 'Acrescente uma segunda evidência e explique o vínculo.'
  },
  confidence: 'MEDIUM',
  recommendation: 'REVISE',
  flags: []
};

assert.equal(validateAiFeedbackResult(validProviderResult, { criteria: envelope.task.criteria }).result, 'OK');
assert.throws(
  () => validateAiFeedbackResult({ ...validProviderResult, criterionResults: validProviderResult.criterionResults.slice(0, 1) }, { criteria: envelope.task.criteria }),
  error => error instanceof AiFeedbackError && error.code === 'INVALID_RESPONSE'
);

let capturedRequest = null;
const service = createAiFeedbackService({
  adapters: {
    'fake-provider': {
      requiresCredential: true,
      async request(request) {
        capturedRequest = request;
        return validProviderResult;
      }
    }
  },
  getConfig: () => ({ enabled: true, provider: 'fake-provider', model: 'fake-model', endpoint: 'http://127.0.0.1:9999/feedback' }),
  getCredential: provider => provider === 'fake-provider' ? 'ephemeral-token' : null
});

const result = await service.requestFeedback({ document: documentRuntime, block: activity, response, context: { levelId: 'N4', unitId: 'N4-U09' } });
assert.equal(result.result, 'OK');
assert.equal(capturedRequest.model, 'fake-model');
assert.equal(capturedRequest.credential, 'ephemeral-token');
assert.equal(capturedRequest.envelope.policy.mayPromoteEvidence, false);

const invalidService = createAiFeedbackService({
  adapters: { broken: { requiresCredential: false, async request() { return { schemaVersion: 1, result: 'OK' }; } } },
  getConfig: () => ({ enabled: true, provider: 'broken' })
});
const invalidResult = await invalidService.requestFeedback({ document: documentRuntime, block: activity, response });
assert.equal(invalidResult.result, 'INVALID_RESPONSE');

const failingService = createAiFeedbackService({
  adapters: { failing: { requiresCredential: false, async request() { throw new Error('network'); } } },
  getConfig: () => ({ enabled: true, provider: 'failing' })
});
const failed = await failingService.requestFeedback({ document: documentRuntime, block: activity, response });
assert.equal(failed.result, 'PROVIDER_ERROR');
assert.match(failed.feedback.summary, /indisponível/i);

const disabled = createAiFeedbackService({ getConfig: () => ({ enabled: false }) });
await assert.rejects(
  disabled.requestFeedback({ document: documentRuntime, block: activity, response }),
  error => error instanceof AiFeedbackError && error.code === 'AI_DISABLED'
);

console.log('P6 core: envelope mínimo, critérios explícitos, provider neutro, structured output e falha sem autoridade de domínio validados.');
