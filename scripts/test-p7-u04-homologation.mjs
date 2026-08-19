import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = file => fs.readFileSync(file, 'utf8');
const readJson = file => JSON.parse(read(file));

const course = readJson('content/course.json');
const unit = readJson('content/units/004-lendo-compreendendo-pequenos-textos/unit.json');
const state = read('docs/estado-implementacao-classico.md');
const roadmap = read('docs/roadmap-produto.md');
const index = read('PROJECT_INDEX.md');
const homologation = read('docs/homologacao-p7-n0-u04.md');
const html = read('index.html');
const responsive = read('app/css/header-responsive.css');

assert.equal(unit.id, 'N0-U04');
assert.equal(unit.publication.status, 'READY');
assert.deepEqual(unit.publication.blockers, []);
assert.equal(unit.lessons.length, 9);
assert.equal(unit.competencies.length, 9);
assert.equal(unit.verification.id, 'N0-U04-V01');
assert.deepEqual(unit.prerequisites, ['N0-U03-V01']);

const catalogRef = course.units.find(item => item.id === 'N0-U04');
assert.ok(catalogRef, 'N0-U04 precisa permanecer publicada no course.json.');
assert.equal(catalogRef.order, 4);
assert.equal(catalogRef.manifest, 'units/004-lendo-compreendendo-pequenos-textos/unit.json');

assert.match(state, /Lote P7 N0-U04 — Lendo e compreendendo pequenos textos: HOMOLOGADO \(PR #135\)/);
assert.match(state, /Próximo passo exato: iniciar o lote N0-U05 — Escrevendo e organizando mensagens/);
assert.match(state, /N0-U04: HOMOLOGADA — docs\/homologacao-p7-n0-u04\.md/);
assert.doesNotMatch(state, /Ativo agora: N0-U04/);

assert.match(roadmap, /N0-U04 — Lendo e compreendendo pequenos textos — PR #135/);
assert.match(roadmap, /Próximo lote: N0-U05 — Escrevendo e organizando mensagens/);
assert.match(index, /docs\/homologacao-p7-n0-u04\.md/);
assert.match(homologation, /P7 \/ lote N0-U04: HOMOLOGADO/);
assert.match(homologation, /Resultado final: \*\*APROVADO\*\*/);

assert.match(html, /header-responsive\.css/);
assert.match(html, /aria-label="Plano de estudos"/);
assert.match(html, /nav-label-short[^>]*aria-hidden="true">Plano</);
assert.match(responsive, /@media \(max-width: 700px\)/);
assert.match(responsive, /\.nav-label-full/);
assert.match(responsive, /\.nav-label-short/);

assert.equal(fs.existsSync('.github/workflows/p7-u04-runtime-patch.yml'), false, 'workflow temporário P7/U04 não pode retornar.');
const temporaryScripts = fs.readdirSync('scripts').filter(name => /^p7-u04-.*\.py$/.test(name));
assert.deepEqual(temporaryScripts, [], `tooling temporário P7/U04 ainda presente: ${temporaryScripts.join(', ')}`);

console.log('P7 U04 homologation gate: publicação READY, estado canônico em U05, responsividade final e branch sem tooling temporário validados.');
