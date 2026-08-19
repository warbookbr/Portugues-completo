import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentCatalogError, ContentService } from '../app/js/services/content-service.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function fileFetch(url) {
  const projectPath = String(url).replace(/^\.\//, '');
  const filePath = path.resolve(root, projectPath);
  if (!filePath.startsWith(root + path.sep) || !fs.existsSync(filePath)) {
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
assert.deepEqual(catalog.units.map(unit => unit.id), ['N0-U01', 'N0-U02', 'N0-U03', 'N0-U04', 'N4-U09']);
assert.deepEqual(catalog.units.filter(unit => unit.levelId === 'N0').map(unit => unit.order), [1, 2, 3, 4]);

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

const n0u3 = await service.loadUnitManifest('N0-U03', { catalog });
assert.equal(n0u3.manifest.title, 'Palavras, frases e sentido');
assert.equal(n0u3.manifest.order, 3);
assert.deepEqual(n0u3.manifest.prerequisites, ['N0-U02-V02']);
assert.equal(n0u3.manifest.lessons.length, 10);
assert.equal(n0u3.manifest.competencies.length, 10);
assert.deepEqual(n0u3.manifest.competencies.map(item => item.id), Array.from({ length: 10 }, (_, index) => `N0-U03-C${String(index + 1).padStart(2, '0')}`));
assert.equal(n0u3.manifest.verification.id, 'N0-U03-V01');
assert.deepEqual(n0u3.manifest.verification.competencyIds, n0u3.manifest.competencies.map(item => item.id));
assert.equal(n0u3.manifest.publication.status, 'READY');
assert.deepEqual(n0u3.manifest.publication.blockers, []);

for (const lessonRef of n0u3.manifest.lessons) {
  const loaded = await service.loadLesson('N0-U03', lessonRef.id);
  assert.equal(loaded.runtime.id, lessonRef.id);
  assert.deepEqual(loaded.runtime.competencyIds, lessonRef.competencyIds);
  assert.ok(loaded.runtime.blocks.length > 0, `${lessonRef.id}: runtime vazio.`);
  assert.ok(loaded.runtime.completion.clusters.length > 0, `${lessonRef.id}: sem clusters de conclusão.`);
}

const n0u4 = await service.loadUnitManifest('N0-U04', { catalog });
assert.equal(n0u4.manifest.title, 'Lendo e compreendendo pequenos textos');
assert.equal(n0u4.manifest.order, 4);
assert.deepEqual(n0u4.manifest.prerequisites, ['N0-U03-V01']);
assert.equal(n0u4.manifest.lessons.length, 9);
assert.equal(n0u4.manifest.competencies.length, 9);
assert.deepEqual(n0u4.manifest.competencies.map(item => item.id), Array.from({ length: 9 }, (_, index) => `N0-U04-C${String(index + 1).padStart(2, '0')}`));
assert.equal(n0u4.manifest.verification.id, 'N0-U04-V01');
assert.deepEqual(n0u4.manifest.verification.competencyIds, n0u4.manifest.competencies.map(item => item.id));
assert.equal(n0u4.manifest.publication.status, 'READY');
assert.deepEqual(n0u4.manifest.publication.blockers, []);

for (const lessonRef of n0u4.manifest.lessons) {
  const loaded = await service.loadLesson('N0-U04', lessonRef.id);
  assert.equal(loaded.runtime.id, lessonRef.id);
  assert.deepEqual(loaded.runtime.competencyIds, lessonRef.competencyIds);
  assert.ok(loaded.runtime.blocks.length > 0, `${lessonRef.id}: runtime vazio.`);
  assert.ok(loaded.runtime.completion.clusters.length > 0, `${lessonRef.id}: sem clusters de conclusão.`);
}

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

const n0u3OpenLesson = await service.loadLesson('N0-U03', 'N0-U03-L10');
assert.equal(n0u3OpenLesson.runtime.id, 'N0-U03-L10');
assert.deepEqual(n0u3OpenLesson.runtime.competencyIds, ['N0-U03-C10']);
assert.ok(n0u3OpenLesson.runtime.blocks.some(block => block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR'));

const n0u4EvidenceLesson = await service.loadLesson('N0-U04', 'N0-U04-L04');
assert.equal(n0u4EvidenceLesson.runtime.id, 'N0-U04-L04');
assert.deepEqual(n0u4EvidenceLesson.runtime.competencyIds, ['N0-U04-C04']);
assert.ok(n0u4EvidenceLesson.runtime.blocks.some(block => block.activity?.evaluation?.answerKey?.evidence), 'U04 precisa preservar seleção de evidência no runtime.');

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

const n0u3Verification = await service.loadVerification('N0-U03');
assert.equal(n0u3Verification.runtime.id, 'N0-U03-V01');
assert.equal(n0u3Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n0u3Verification.runtime.competencyIds.length, 10);
assert.deepEqual(n0u3Verification.runtime.completion.clusters.map(cluster => cluster.id), ['meaningAndContext', 'constructionAndManipulation', 'messageComprehensionAndProduction']);
assert.ok(n0u3Verification.runtime.blocks.some(block => block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR'));

const n0u4Verification = await service.loadVerification('N0-U04');
assert.equal(n0u4Verification.runtime.id, 'N0-U04-V01');
assert.equal(n0u4Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n0u4Verification.runtime.competencyIds.length, 9);
assert.deepEqual(n0u4Verification.runtime.completion.clusters.map(cluster => cluster.id), ['globalComprehension', 'explicitAndIntegration', 'reference', 'sequenceAndRelations', 'inferenceDiscipline', 'rereadingAndRevision']);
assert.equal(n0u4Verification.runtime.blocks.find(block => block.id === 'V01-Q07')?.activity?.interaction, 'SEQUENCE');

const n4Verification = await service.loadVerification('N4-U09');
assert.equal(n4Verification.runtime.id, 'N4-U09-V01');
assert.equal(n4Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n4Verification.runtime.competencyIds.length, 12);
assert.ok(n4Verification.runtime.blocks.some(block => block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR'));

await assert.rejects(
  service.loadUnitManifest('N2-U99', { catalog }),
  error => error instanceof ContentCatalogError && error.code === 'UNIT_NOT_FOUND'
);

console.log('Catálogo/ContentService P7: U1–U4 publicadas em ordem, N0-U03/U04 READY descobertas ponta a ponta e N4-U09 preservada.');
