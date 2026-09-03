import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { homeHtml } from '../app/js/ui/classic-home.js';
import { SIMPLE_FONT_SIZES, fontSizeLabel } from '../app/js/ui/font-size-control.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

const manifests = [
  {
    id: 'N0-U01',
    levelId: 'N0',
    order: 1,
    title: 'Letras e primeiros sons',
    lessons: [
      { id: 'N0-U01-L01', order: 1, title: 'Lição 1' },
      { id: 'N0-U01-L02', order: 2, title: 'Lição 2' }
    ]
  }
];

const emptyProgress = { curriculum: { lessons: {}, current: {} }, review: { queue: [] } };
const withReviews = { curriculum: { lessons: {}, current: {} }, review: { queue: ['N0-U01-L01', 'N0-U01-L02'] } };

// O estilo Completo preserva o painel atual.
const complete = homeHtml({}, manifests, emptyProgress, { interfaceStyle: 'complete' });
assert.match(complete, /Seu progresso/, 'estilo Completo deve manter o card de progresso');
assert.match(complete, /Começar a estudar/, 'estilo Completo deve manter a ação principal');
assert.doesNotMatch(complete, /Comece por aqui/, 'o título é redundante com o botão Começar a estudar em qualquer estilo');
assert.match(complete, /Unidades do curso/);

// O estilo Simples esconde o painel de métricas sem esconder o caminho de estudo.
const simple = homeHtml({}, manifests, emptyProgress, { interfaceStyle: 'simple' });
assert.doesNotMatch(simple, /Seu progresso/, 'estilo Simples não deve exibir o card de métricas');
assert.match(simple, /Começar a estudar/, 'estilo Simples deve manter a ação principal');
assert.doesNotMatch(simple, /Comece por aqui/, 'o título é redundante com o botão Começar a estudar em qualquer estilo');
assert.match(simple, /Unidades do curso/, 'estilo Simples deve manter as unidades');
assert.doesNotMatch(simple, /revisões recomendadas/, 'sem revisões pendentes não existe card de revisão');

// No estado de retomada, o título 'Continue estudando' permanece: ele comunica
// algo que o botão sozinho não diz.
const withCurrent = { curriculum: { lessons: {}, current: { unitId: 'N0-U01', lessonId: 'N0-U01-L01' } }, review: { queue: [] } };
const resumed = homeHtml({}, manifests, withCurrent, { interfaceStyle: 'simple' });
assert.match(resumed, /Continue estudando/, 'ao retomar, o título de estado deve continuar visível');

// A revisão continua alcançável no Simples quando existe algo a revisar.
const simpleWithReviews = homeHtml({}, manifests, withReviews, { interfaceStyle: 'simple' });
assert.match(simpleWithReviews, /Você tem 2 revisões recomendadas\./);
assert.match(simpleWithReviews, /href="#\/revisoes"/, 'o card de revisão deve levar às revisões');

const singleReview = homeHtml({}, manifests, { review: { queue: ['N0-U01-L01'] } }, { interfaceStyle: 'simple' });
assert.match(singleReview, /Você tem 1 revisão recomendada\./, 'o texto público deve concordar em número');

// Sem opção declarada, a home mantém o comportamento anterior.
assert.match(homeHtml({}, manifests, emptyProgress), /Seu progresso/);

// O controle público reaproveita as escalas já existentes, sem inventar nível novo.
const themes = read('app/css/themes.css');
for (const option of SIMPLE_FONT_SIZES) {
  assert.match(themes, new RegExp(`html\\[data-font-size="${option.value}"\\]`), `escala ${option.value} precisa existir no tema`);
}
assert.equal(SIMPLE_FONT_SIZES.length, 3);
assert.equal(fontSizeLabel('xlarge'), 'Extra grande');
assert.equal(fontSizeLabel('small'), 'Padrão', 'escala fora do controle público cai no rótulo padrão');

// A preferência é local, tem o Simples como padrão e é aplicada na raiz do documento.
const settingsService = read('app/js/services/settings-service.js');
assert.match(settingsService, /interfaceStyle: 'simple'/, 'o estilo Simples deve vir ligado de fábrica');
assert.match(settingsService, /root\.dataset\.interfaceStyle = settings\.interfaceStyle;/);

// O estilo é apresentação: não pode virar dado de progresso nem de curso.
const progressSchema = JSON.parse(read('schemas/progress.schema.json'));
assert.ok(!JSON.stringify(progressSchema).includes('interfaceStyle'), 'estilo da interface não pertence ao progresso');

// O cabeçalho enxuto e o botão só existem no estilo Simples.

// Dentro de uma unidade, a trilha "Curso > ..." e a pílula de nível/ordem
// somem no Simples: já são redundantes com o cabeçalho e o título.
const interfaceCss = read('app/css/interface-style.css');
assert.match(interfaceCss, /html\[data-interface-style="simple"\] \.app-brand/);
assert.match(interfaceCss, /data-nav-route="plan"/);
assert.match(interfaceCss, /data-nav-route="performance"/);
assert.doesNotMatch(interfaceCss, /data-nav-route="units"\]\s*\{?\s*\n?\s*display: none/, 'Unidades deve continuar alcançável no Simples');
assert.match(interfaceCss, /\[data-unit-id\] > \.breadcrumbs/, 'a trilha da unidade deve ser escondida no Simples');
assert.match(interfaceCss, /\.unit-hero \.eyebrow/, 'a pílula de nível/ordem da unidade deve ser escondida no Simples');
assert.match(interfaceCss, /\.course-context\s*\{/, 'a pílula de nível/unidade na home deve ser escondida no Simples');
assert.match(interfaceCss, /\.utility-link\[href="#\/ajuda"\]/, 'o botão de Ajuda deve ser escondido no Simples');



const appJs = read('app/js/app.js');
assert.match(appJs, /mountFontSizeControl\(fontSizeRoot\)/);
assert.match(appJs, /style !== 'simple' && unmountFontSizeControl/, 'o botão só deve existir no estilo Simples');

const indexHtml = read('index.html');
assert.match(indexHtml, /id="font-size-root"/);
assert.match(indexHtml, /interface-style\.css/);

console.log('Estilo da interface: Simples/Completo, card de revisão e tamanhos públicos validados.');
