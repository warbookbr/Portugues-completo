import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { ContentService } from '../app/js/services/content-service.js';

const read = file => fs.readFileSync(file, 'utf8');
const readJson = file => JSON.parse(read(file));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

// 1. Segredo de provider não entra no frontend.
const appFiles = walk('app').filter(file => /\.(?:js|html|css|json)$/.test(file));
const appSource = appFiles.map(file => `${file}\n${read(file)}`).join('\n');
assert.doesNotMatch(appSource, /OPENAI_API_KEY/, 'Frontend não pode conhecer OPENAI_API_KEY.');
assert.doesNotMatch(appSource, /\brememberApiKey\b/, 'Preferência legada de lembrar API key não pode voltar ao frontend.');
assert.doesNotMatch(appSource, /\bapiKey\b/, 'Frontend não pode declarar campo/variável apiKey.');

const credentialSource = read('app/js/services/ai-feedback-credential-service.js');
assert.match(credentialSource, /sessionStorage/);
assert.doesNotMatch(credentialSource, /localStorage/);

const settingsSource = read('app/js/services/settings-service.js');
assert.match(settingsSource, /AI_FEEDBACK_CONSENT_VERSION/);
assert.match(settingsSource, /aiFeedbackEnabled:\s*false/);
assert.doesNotMatch(settingsSource, /companion-token|OPENAI_API_KEY|\bapiKey\b/);

// 2. Consentimento vigente é parte do gate de ativação do serviço.
const appWiring = read('app/js/app.js');
assert.match(appWiring, /aiFeedbackEnabled\s*===\s*true\s*&&\s*settings\.aiFeedbackConsentVersion\s*===\s*AI_FEEDBACK_CONSENT_VERSION/);
assert.match(appWiring, /getCredential:\s*provider\s*=>\s*aiFeedbackCredentialService\.get\(provider\)/);

// 3. Serviço neutro não pode promover evidência nem conhecer progresso.
const serviceSource = read('app/js/services/ai-feedback-service.js');
assert.match(serviceSource, /mayPromoteEvidence:\s*false/);
assert.doesNotMatch(serviceSource, /ProgressService|progressService|Gist|GitHubService/);
assert.match(serviceSource, /FORMATIVE_FEEDBACK/);
assert.match(serviceSource, /validateAiFeedbackResult/);

// 4. Companion mantém segredo no processo local e rejeita política insegura.
const companion = read('tools/ai-feedback-companion.mjs');
assert.match(companion, /OPENAI_API_KEY/);
assert.match(companion, /const host = '127\.0\.0\.1'/);
assert.match(companion, /store:\s*false/);
assert.match(companion, /mayPromoteEvidence\s*!==\s*false/);
assert.match(companion, /FORMATIVE_FEEDBACK/);
assert.match(companion, /json_schema/);
assert.match(companion, /strict:\s*true/);
assert.doesNotMatch(companion, /console\.log\([^\n]*(?:envelope|learnerResponse|apiKey)/i, 'Companion não deve logar payload/resposta/chave.');

// 5. Adapter do browser aceita somente loopback.
const adapter = read('app/js/services/ai-providers/openai-companion.js');
assert.match(adapter, /127\.0\.0\.1/);
assert.match(adapter, /localhost/);
assert.match(adapter, /UNSAFE_ENDPOINT/);

// 6. Piloto real é opt-in, mínimo e continua pendente.
const source = readJson('content/units/409-literatura-multimodalidade-autoria-intermedial-digital/lessons/001-interpretacao-literaria-autonoma-evidencia.json');
const contentService = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const runtime = contentService.normalize(source);
const pilot = runtime.blocks.find(block => block.id === 'L01-A01');
assert.ok(pilot, 'Piloto P6 não encontrado.');
assert.equal(pilot.activity.evaluation.mode, 'RELIABLE_EVALUATOR');
assert.equal(pilot.content.aiFeedback.enabled, true);
assert.deepEqual(pilot.content.aiFeedback.materialBlockIds, ['L01-B01']);
assert.equal(pilot.content.aiFeedback.criteria.length, 5);
assert.ok(pilot.content.aiFeedback.criteria.every(item => item.id && item.description && item.required !== false));

// 7. UI exige ação explícita e declara fronteira de autoridade.
const ui = read('app/js/ui/classic-ai-feedback.js');
assert.match(ui, /data-request-ai-feedback/);
assert.match(ui, /button\.addEventListener\('click'/);
assert.match(ui, /continua aguardando validação confiável/);
assert.match(ui, /não concede domínio/);
assert.match(ui, /Sua resposta continua salva/);
assert.doesNotMatch(ui, /criterionId\}\}|flags\}\}|policyVersion\}\}/, 'UI não deve imprimir metadados técnicos diretamente.');

// 8. Documentação canônica registra transporte seguro e o fechamento completo do P6.
const transport = read('docs/p6-transporte-ia.md');
assert.match(transport, /API key da OpenAI \*\*não entra no navegador\*\*/);
assert.match(transport, /store: false/);
assert.match(transport, /mayPromoteEvidence=false/);

const p62 = read('docs/homologacao-p6-2.md');
assert.match(p62, /P6\.2: HOMOLOGADO/);
assert.match(p62, /VALIDACAO_PENDENTE/);
assert.match(p62, /run 32260852054/);

const p6 = read('docs/homologacao-p6.md');
assert.match(p6, /P6: HOMOLOGADO/);
assert.match(p6, /P6\.3/);
assert.match(p6, /run 32261814336/);
assert.match(p6, /P7 — Ampliação do catálogo Clássico N0→N4/);

const state = read('docs/estado-implementacao-classico.md');
assert.match(state, /P6 — Feedback por IA: HOMOLOGADO/);
assert.match(state, /P6\.1[^\n]*HOMOLOGADO/);
assert.match(state, /P6\.2[^\n]*HOMOLOGADO/);
assert.match(state, /P6\.3[^\n]*HOMOLOGADO/);
assert.match(state, /P7 — Ampliação do catálogo Clássico N0→N4: ATIVO/);

const roadmap = read('docs/roadmap-produto.md');
assert.match(roadmap, /## P6 — Feedback por IA no Clássico\n\n\*\*Estado: HOMOLOGADO\.\*\*/);
assert.match(roadmap, /## P7 — Ampliação do catálogo Clássico N0→N4\n\n\*\*Estado: ATIVO\.\*\*/);

console.log('P6 homologation gate: segredo fora do frontend, consentimento, payload mínimo, companion seguro, structured output, falha segura, neutralidade curricular e cursor P7 preservados.');
