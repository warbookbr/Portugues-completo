import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const normalize = file => service.normalize(readJson(file));
const context = { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia' };

const l07 = normalize('content/units/101-lendo-textos-mais-autonomia/lessons/007-titulo-imagem-legenda-apoios.json');
const l07Html = documentHtml(l07, context);
assert.match(l07Html, />Texto</);
assert.match(l07Html, /Legenda:/);
assert.match(l07Html, /Apoio visual/);
assert.match(l07Html, /O diagrama mostra a rota Entrada principal → Recepção → Sala de inscrição/);
assert.match(l07Html, /A rota mostrada é Entrada → Balcão de crachás → Corredor B → Sala 6/);
assert.match(l07Html, /Entrada gratuita/);
assert.doesNotMatch(l07Html, /body text|accessible equivalent|simple route diagram|visual badge|\bnodes\b|\bconnections\b/i);

const l08 = normalize('content/units/101-lendo-textos-mais-autonomia/lessons/008-quem-escreveu-fonte-opiniao-razao.json');
const l08Html = documentHtml(l08, context);
assert.match(l08Html, /Fonte do texto/);
assert.match(l08Html, /Biblioteca Comunitária do Bairro/);
assert.match(l08Html, /Secretaria Municipal de Saúde/);
assert.match(l08Html, /Opinião/);
assert.match(l08Html, /Razão/);
assert.doesNotMatch(l08Html, /source metadata|author or institution|authorOrInstitution|\banalysis\b|acceptedCore|acceptedResult/i);

const v01 = normalize('content/units/101-lendo-textos-mais-autonomia/integrated-verification.json');
const vHtml = documentHtml(v01, { ...context, verification: true });
assert.match(vHtml, /Oficina de consertos amplia vagas/);
assert.match(vHtml, /Mudança no ponto de coleta/);
assert.match(vHtml, /A rota indicada é Entrada → Balcão → Corredor A → Sala 12/);
assert.match(vHtml, /Fonte do texto/);
assert.doesNotMatch(vHtml, /evidenceSourcesRequired|accessibleEquivalent|sourceMetadata|bodyText|textRef|humanOrExternalReview|automaticObservations|notAutomaticallyJudged/);
assert.doesNotMatch(vHtml, /Interação ainda não suportada/i);

console.log('P7 N1-U01 public UI: leitura, legenda, multimodalidade e fonte/opinião/razão aparecem em linguagem pública sem metadados autorais crus.');
