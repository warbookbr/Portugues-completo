import fs from 'node:fs';

function replaceOnce(file, before, after) {
  const source = fs.readFileSync(file, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado ${count === 0 ? 'não encontrado' : `encontrado ${count} vezes`}.`);
  fs.writeFileSync(file, source.replace(before, after));
}

replaceOnce(
  'scripts/test-content-normalizer.mjs',
  "const n0LessonSource = readJson('content/units/001-fala-sons-escrita/lessons/001-fala-e-escrita.json');",
  "const n0LessonSource = readJson('content/units/001-fala-sons-escrita/legacy/lessons/001-fala-e-escrita.json');"
);

fs.writeFileSync('scripts/test-content-catalog.mjs', `import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentCatalogError, ContentService } from '../app/js/services/content-service.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function fileFetch(url) {
  const projectPath = String(url).replace(/^\\.\\//, '');
  const filePath = path.resolve(root, projectPath);
  if (!filePath.startsWith(\`${root}${path.sep}\`) || !fs.existsSync(filePath)) {
    return { ok: false, status: 404, async json() { return null; } };
  }
  return {
    ok: true,
    status: 200,
    async json() { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  };
}

const service = new ContentService({ basePath: './content', fetchImpl: fileFetch });
const catalog = await service.loadCatalog();
assert.equal(catalog.schemaVersion, 2);
assert.deepEqual(catalog.units.map(unit => unit.id), ['N0-U01', 'N0-U02', 'N4-U09']);

const n0u1 = await service.loadUnitManifest('N0-U01', { catalog });
assert.equal(n0u1.manifest.title, 'Letras e primeiros sons');
assert.equal(n0u1.manifest.lessons.length, 7);
assert.equal(n0u1.manifest.competencies.length, 7);
assert.equal(n0u1.manifest.verification.id, 'N0-U01-V02');
assert.equal(n0u1.manifest.publication.status, 'BLOCKED');
assert.ok(n0u1.manifest.publication.blockers.length >= 1);

const n0u2 = await service.loadUnitManifest('N0-U02', { catalog });
assert.equal(n0u2.manifest.title, 'Sílabas e primeiras palavras');
assert.equal(n0u2.manifest.lessons.length, 10);
assert.equal(n0u2.manifest.competencies.length, 11);
assert.equal(n0u2.manifest.verification.id, 'N0-U02-V02');
assert.equal(n0u2.manifest.publication.status, 'BLOCKED');
assert.ok(n0u2.manifest.publication.blockers.length >= 1);

const n4 = await service.loadUnitManifest('N4-U09', { catalog });
assert.equal(n4.manifest.lessons.length, 12);
assert.equal(n4.manifest.competencies.length, 12);
assert.equal(n4.manifest.publication.status, 'READY');
assert.deepEqual(n4.manifest.publication.blockers, []);

const firstLesson = await service.loadLesson('N0-U01', 'N0-U01-L03');
assert.equal(firstLesson.sourcePath, 'units/001-fala-sons-escrita/lessons/003-conhecendo-o-alfabeto.json');
assert.equal(firstLesson.runtime.id, 'N0-U01-L03');
assert.deepEqual(firstLesson.runtime.competencyIds, ['N0-U01-C03']);
assert.equal(firstLesson.runtime.presentation.introSource, 'AUTHORED');

const movedLesson = await service.loadLesson('N0-U02', 'N0-U02-L10');
assert.equal(movedLesson.runtime.id, 'N0-U02-L10');
assert.deepEqual(movedLesson.runtime.competencyIds, ['N0-U02-C11']);

const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
assert.equal(n4Lesson.runtime.id, 'N4-U09-L01');
assert.deepEqual(n4Lesson.runtime.competencyIds, ['N4-U09-C01']);

const n0u1Verification = await service.loadVerification('N0-U01');
assert.equal(n0u1Verification.runtime.id, 'N0-U01-V02');
assert.equal(n0u1Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n0u1Verification.runtime.competencyIds.length, 7);
assert.ok(n0u1Verification.runtime.blocks.some(block => block.activity?.stimuli?.some(stimulus => stimulus.type === 'CONTROLLED_AUDIO')));

const n0u2Verification = await service.loadVerification('N0-U02');
assert.equal(n0u2Verification.runtime.id, 'N0-U02-V02');
assert.equal(n0u2Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n0u2Verification.runtime.competencyIds.length, 11);

const n4Verification = await service.loadVerification('N4-U09');
assert.equal(n4Verification.runtime.id, 'N4-U09-V01');
assert.equal(n4Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n4Verification.runtime.competencyIds.length, 12);
assert.ok(n4Verification.runtime.blocks.some(block => block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR'));

await assert.rejects(
  service.loadUnitManifest('N2-U99', { catalog }),
  error => error instanceof ContentCatalogError && error.code === 'UNIT_NOT_FOUND'
);

console.log('Catálogo/ContentService T1.9: U1/U2 publicadas com V02, N4-U09 preservada e descoberta consistente.');
`);
