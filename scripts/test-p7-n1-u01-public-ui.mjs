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
assert.match(l07Html, /data-semantic-route/);
assert.match(l07Html, />Entrada principal</);
assert.match(l07Html, />Recepção</);
assert.match(l07Html, />Sala de inscrição</);
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

const l09 = normalize('content/units/101-lendo-textos-mais-autonomia/lessons/009-resumindo-ideia-principal-palavras-proprias.json');
const l09Html = documentHtml(l09, context);
assert.match(l09Html, /Texto de referência/);
assert.match(l09Html, /O posto passará a atender aos sábados pela manhã/);
assert.match(l09Html, /Versão 1/);
assert.match(l09Html, /Classificação/);
assert.match(l09Html, /resumo fiel/);
assert.doesNotMatch(l09Html, /SOURCE TEXT|source text/i);
assert.doesNotMatch(l09Html, /<strong>Pergunta<\/strong><div>O posto terá atendimento de vacinação também aos sábados pela manhã/);

const v01 = normalize('content/units/101-lendo-textos-mais-autonomia/integrated-verification.json');
const vHtml = documentHtml(v01, { ...context, verification: true });
assert.match(vHtml, /Oficina de consertos amplia vagas/);
assert.match(vHtml, /Mudança no ponto de coleta/);
assert.match(vHtml, /data-semantic-route/);
assert.match(vHtml, /A rota indicada é Entrada → Balcão → Corredor A → Sala 12/);
assert.match(vHtml, /Fonte do texto/);
assert.doesNotMatch(vHtml, /evidenceSourcesRequired|accessibleEquivalent|sourceMetadata|bodyText|textRef|humanOrExternalReview|automaticObservations|notAutomaticallyJudged/);
assert.doesNotMatch(vHtml, /Interação ainda não suportada/i);

console.log('P7 N1-U01 public UI: leitura, diagrama acessível, legenda, fonte/opinião/razão e versões de resumo aparecem sem metadados autorais crus.');
