import assert from 'node:assert/strict';
import fs from 'node:fs';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const read = file => fs.readFileSync(file, 'utf8');

const unit = readJson('content/units/006-usando-lingua-cotidiano/unit.json');
const course = readJson('content/course.json');
const state = read('docs/estado-implementacao-classico.md');
const roadmap = read('docs/roadmap-produto.md');
const homologation = read('docs/homologacao-p7-n0-u06.md');
const index = read('PROJECT_INDEX.md');

assert.equal(unit.id, 'N0-U06');
assert.equal(unit.title, 'Usando a língua no cotidiano');
assert.equal(unit.publication?.status, 'READY');
assert.deepEqual(unit.publication?.blockers || [], []);
assert.equal(unit.lessons?.length, 10);
assert.equal(unit.competencies?.length, 10);
assert.equal(unit.verification?.id, 'N0-U06-V01');
assert.deepEqual(unit.prerequisites, ['N0-U05-V01']);

const courseUnit = course.units.find(item => item.id === 'N0-U06');
assert.ok(courseUnit, 'N0-U06 precisa permanecer no catálogo publicado.');
assert.equal(courseUnit.manifest, 'units/006-usando-lingua-cotidiano/unit.json');

assert.match(homologation, /P7 \/ lote N0-U06: HOMOLOGADO/);
assert.match(homologation, /Próximo lote: N1-U01 — Lendo textos com mais autonomia/);
assert.match(state, /P7 — Ampliação do catálogo Clássico N0→N4: ATIVO/);
assert.match(state, /N0-U06[^\n]*HOMOLOGADO/);
assert.doesNotMatch(state, /Próximo passo exato: iniciar o lote N0-U06/);
assert.match(roadmap, /N0-U06[^\n]*homologad/i);
assert.doesNotMatch(roadmap, /Próximo lote: N0-U06/);
assert.match(index, /docs\/homologacao-p7-n0-u06\.md/);

for (const temporary of [
  '.github/workflows/p7-u06-publish-clean.yml',
  'scripts/p7-u06-publish-current.py',
  '.github/workflows/fix-p7-u06-public-ui.yml',
  'scripts/fix-p7-u06-public-ui.py'
]) {
  assert.equal(fs.existsSync(temporary), false, `tooling temporário não pode permanecer: ${temporary}`);
}

for (const permanent of [
  'scripts/audit-p7-n0-u06.mjs',
  'scripts/test-p7-u06-communication.mjs',
  'scripts/capture-p7-u06-visuals.sh'
]) {
  assert.equal(fs.existsSync(permanent), true, `gate permanente ausente: ${permanent}`);
}

console.log('P7 N0-U06 homologation: manifesto READY, catálogo N0 completo, provas permanentes e cursor fora da U06 preservados.');
