import assert from 'node:assert/strict';
import http from 'node:http';

import {
  createCompanionServer,
  createOpenAiRequestBody,
  feedbackOutputSchema,
  validateCompanionRequest
} from '../tools/ai-feedback-companion.mjs';

const envelope = {
  schemaVersion: 1,
  context: { courseId: 'portugues-completo', levelId: 'N4', unitId: 'N4-U09', lessonId: 'N4-U09-L01', verificationId: null, activityId: 'L01-A01', locale: 'pt-BR' },
  task: {
    objective: 'Formular interpretação sustentada.',
    prompt: 'Apresente uma interpretação própria.',
    materials: [{ id: 'L01-B01', pedagogicalType: 'authored-literary-text', content: { text: 'Trecho didático.' } }],
    criteria: [{ id: 'C1', description: 'formula interpretação sustentada', required: true }],
    limits: ['não exigir repertório externo']
  },
  learnerResponse: { type: 'LONG_TEXT', value: 'Minha interpretação usa o trecho como evidência.' },
  policy: { purpose: 'FORMATIVE_FEEDBACK', mayPromoteEvidence: false, requiresReliableEvaluator: true, policyVersion: 'p6-test-v1' }
};

assert.equal(feedbackOutputSchema().additionalProperties, false);
const requestBody = createOpenAiRequestBody({ envelope, model: 'gpt-5.6-terra' });
assert.equal(requestBody.model, 'gpt-5.6-terra');
assert.equal(requestBody.store, false, 'Responses API deve usar store:false no auxiliar.');
assert.equal(requestBody.text.format.type, 'json_schema');
assert.equal(requestBody.text.format.strict, true);
assert.equal(JSON.parse(requestBody.input).policy.mayPromoteEvidence, false);
assert.doesNotMatch(requestBody.instructions, /OPENAI_API_KEY/);

assert.equal(validateCompanionRequest({ schemaVersion: 1, model: 'gpt-5.6-terra', envelope }).envelope.policy.purpose, 'FORMATIVE_FEEDBACK');
assert.throws(() => validateCompanionRequest({ schemaVersion: 1, envelope: { ...envelope, policy: { ...envelope.policy, mayPromoteEvidence: true } } }), /UNSAFE_POLICY/);

const providerResult = {
  schemaVersion: 1,
  result: 'OK',
  criterionResults: [{ criterionId: 'C1', status: 'MET', evidence: 'A resposta relaciona interpretação e evidência.', feedback: 'Mantenha o vínculo explícito.' }],
  feedback: { summary: 'Resposta bem sustentada.', strengths: ['evidência explícita'], improvements: [], nextStep: 'Revise a formulação final.' },
  confidence: 'MEDIUM',
  recommendation: 'CONTINUE',
  flags: []
};

let upstreamAuthorization = null;
let upstreamBody = null;
const upstream = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  upstreamAuthorization = req.headers.authorization;
  upstreamBody = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  const payload = {
    id: 'resp_test',
    model: upstreamBody.model,
    output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: JSON.stringify(providerResult), annotations: [] }] }]
  };
  res.writeHead(200, { 'Content-Type': 'application/json', 'x-request-id': 'req_test_123' });
  res.end(JSON.stringify(payload));
});

await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve));
const upstreamPort = upstream.address().port;

const companion = createCompanionServer({
  apiKey: 'server-only-openai-secret',
  token: 'ephemeral-browser-token',
  allowedOrigins: new Set(['https://warbookbr.github.io']),
  openAiUrl: `http://127.0.0.1:${upstreamPort}/v1/responses`,
  defaultModel: 'gpt-5.6-terra'
});
await new Promise(resolve => companion.server.listen(0, '127.0.0.1', resolve));
const companionPort = companion.server.address().port;
const url = `http://127.0.0.1:${companionPort}/feedback`;

const wrongOrigin = await fetch(url, {
  method: 'POST',
  headers: { Origin: 'https://example.com', 'Content-Type': 'application/json', Authorization: 'Bearer ephemeral-browser-token' },
  body: JSON.stringify({ schemaVersion: 1, envelope })
});
assert.equal(wrongOrigin.status, 403);

const wrongToken = await fetch(url, {
  method: 'POST',
  headers: { Origin: 'https://warbookbr.github.io', 'Content-Type': 'application/json', Authorization: 'Bearer wrong' },
  body: JSON.stringify({ schemaVersion: 1, envelope })
});
assert.equal(wrongToken.status, 401);

const response = await fetch(url, {
  method: 'POST',
  headers: { Origin: 'https://warbookbr.github.io', 'Content-Type': 'application/json', Authorization: 'Bearer ephemeral-browser-token' },
  body: JSON.stringify({ schemaVersion: 1, model: 'gpt-5.6-terra', envelope })
});
assert.equal(response.status, 200);
const body = await response.json();
assert.equal(body.result, 'OK');
assert.equal(body.meta.provider, 'openai');
assert.equal(body.meta.requestId, 'req_test_123');
assert.equal(upstreamAuthorization, 'Bearer server-only-openai-secret');
assert.equal(upstreamBody.store, false);
assert.equal(upstreamBody.text.format.type, 'json_schema');
assert.equal(upstreamBody.text.format.strict, true);
assert.doesNotMatch(JSON.stringify(upstreamBody), /server-only-openai-secret/, 'A API key não pode entrar no prompt/body enviado ao provider.');

await new Promise(resolve => companion.server.close(resolve));
await new Promise(resolve => upstream.close(resolve));

console.log('P6 companion: loopback + origem + token efêmero + OpenAI server-side + store:false + structured output validados.');
