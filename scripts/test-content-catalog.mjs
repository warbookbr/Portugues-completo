import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentCatalogError, ContentService } from '../app/js/services/content-service.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function fileFetch(url) {
  const projectPath = String(url).replace(/^\.\//, '');
  const filePath = path.resolve(root, projectPath);
  if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filePath)) {
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
assert.deepEqual(catalog.units.map(unit => unit.id), ['N0-U01', 'N4-U09']);

const n0 = await service.loadUnitManifest('N0-U01', { catalog });
assert.equal(n0.manifest.lessons.length, 8);
assert.equal(n0.manifest.competencies.length, 8);
assert.equal(n0.manifest.publication.status, 'BLOCKED');
assert.equal(n0.manifest.publication.blockers.length, 1);
assert.match(n0.manifest.publication.blockers[0], /MIDIA_OBRIGATORIA_PARA_ATIVIDADE/);

const n4 = await service.loadUnitManifest('N4-U09', { catalog });
assert.equal(n4.manifest.lessons.length, 12);
assert.equal(n4.manifest.competencies.length, 12);
assert.equal(n4.manifest.publication.status, 'READY');
assert.deepEqual(n4.manifest.publication.blockers, []);

const n0Lesson = await service.loadLesson('N0-U01', 'N0-U01-L01');
assert.equal(n0Lesson.sourcePath, 'units/001-fala-sons-escrita/lessons/001-fala-e-escrita.json');
assert.equal(n0Lesson.runtime.id, 'N0-U01-L01');
assert.deepEqual(n0Lesson.runtime.competencyIds, ['N0-U01-C01']);

const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
assert.equal(n4Lesson.runtime.id, 'N4-U09-L01');
assert.deepEqual(n4Lesson.runtime.competencyIds, ['N4-U09-C01']);

const n0Verification = await service.loadVerification('N0-U01');
assert.equal(n0Verification.runtime.id, 'N0-U01-V01');
assert.equal(n0Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n0Verification.runtime.competencyIds.length, 8);
assert.ok(n0Verification.runtime.blocks.some(block => block.activity?.stimuli?.some(stimulus => stimulus.type === 'CONTROLLED_AUDIO')));

const n4Verification = await service.loadVerification('N4-U09');
assert.equal(n4Verification.runtime.id, 'N4-U09-V01');
assert.equal(n4Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n4Verification.runtime.competencyIds.length, 12);
assert.ok(n4Verification.runtime.blocks.some(block => block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR'));

await assert.rejects(
  service.loadUnitManifest('N2-U99', { catalog }),
  error => error instanceof ContentCatalogError && error.code === 'UNIT_NOT_FOUND'
);

console.log('Catálogo/ContentService: N0-U01 bloqueado apenas por mídia e N4-U09 READY após P4; descoberta e carregamento continuam válidos.');
