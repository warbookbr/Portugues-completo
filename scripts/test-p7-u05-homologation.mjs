import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = file => fs.readFileSync(file, 'utf8');
const readJson = file => JSON.parse(read(file));

const course = readJson('content/course.json');
const unit = readJson('content/units/005-escrevendo-organizando-mensagens/unit.json');
const state = read('docs/estado-implementacao-classico.md');
const roadmap = read('docs/roadmap-produto.md');
const index = read('PROJECT_INDEX.md');
const homologation = read('docs/homologacao-p7-n0-u05.md');
const renderer = read('app/js/ui/classic-renderer.js');
const progress = read('app/js/services/progress-service.js');

assert.equal(unit.id, 'N0-U05');
assert.equal(unit.publication.status, 'READY');
assert.deepEqual(unit.publication.blockers, []);
assert.equal(unit.lessons.length, 10);
assert.equal(unit.competencies.length, 10);
assert.equal(unit.verification.id, 'N0-U05-V01');
assert.deepEqual(unit.prerequisites, ['N0-U04-V01']);

const catalogRef = course.units.find(item => item.id === 'N0-U05');
assert.ok(catalogRef, 'N0-U05 precisa permanecer publicada no course.json.');
assert.equal(catalogRef.order, 5);
assert.equal(catalogRef.manifest, 'units/005-escrevendo-organizando-mensagens/unit.json');

assert.match(state, /Lote P7 N0-U05 — Escrevendo e organizando mensagens: HOMOLOGADO \(PR #136\)/);
assert.match(state, /Próximo passo exato: iniciar o lote N0-U06 — Usando a língua no cotidiano/);
assert.match(state, /N0-U05: HOMOLOGADA — docs\/homologacao-p7-n0-u05\.md/);
assert.doesNotMatch(state, /Ativo agora: N0-U05/);

assert.match(roadmap, /N0-U05 — Escrevendo e organizando mensagens — PR #136/);
assert.match(roadmap, /Próximo lote: N0-U06 — Usando a língua no cotidiano/);
assert.match(index, /docs\/homologacao-p7-n0-u05\.md/);
assert.match(homologation, /P7 \/ lote N0-U05: HOMOLOGADO/);
assert.match(homologation, /Resultado: \*\*APROVADO\*\*/);
assert.match(homologation, /run 32287331767/);

// Guard rails que não podem ser perdidos em refactors posteriores.
assert.match(renderer, /Ver apoio opcional/);
assert.match(renderer, /\['before', 'Antes'\]/);
assert.match(renderer, /'planningPrompt', 'essentialInformation'/);
assert.match(renderer, /renderEvidenceSelector\(entry, `round-evidence:/, 'Renderer U04 por subitem precisa permanecer preservado.');
assert.match(progress, /MIN_EVIDENCE_WITHOUT_HINT/);

assert.equal(fs.existsSync('.github/workflows/p7-u05-runtime-patch.yml'), false, 'workflow temporário P7/U05 não pode retornar.');
const temporaryScripts = fs.readdirSync('scripts').filter(name => /^p7-u05-.*\.py$/.test(name));
assert.deepEqual(temporaryScripts, [], `tooling temporário P7/U05 ainda presente: ${temporaryScripts.join(', ')}`);

console.log('P7 U05 homologation gate: READY, escrita/pending/apoio protegidos, U04 preservada, estado canônico em U06 e branch sem tooling temporário validados.');
