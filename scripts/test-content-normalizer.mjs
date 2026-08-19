import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ContentService } from '../app/js/services/content-service.js';
import { SAFE_LESSON_INTRO_V1 } from '../app/js/services/content-presentation-normalizer-v1.js';
import {
  ContentNormalizationError,
  normalizeLessonV1,
  normalizeVerificationV1
} from '../app/js/services/content-normalizer-v1.js';
import { validateValue } from './validate-contracts.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const readJson = relativePath => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const block = (document, id) => document.blocks.find(item => item.id === id);

const lessonSchema = readJson('schemas/lesson.schema.json');
const verificationSchema = readJson('schemas/verification.schema.json');

function assertSchema(schema, document, label) {
  const errors = validateValue(schema, document, label);
  assert.deepEqual(errors, [], `${label} não validou contra o schema:\n${errors.join('\n')}`);
}

const n0Unit = readJson('schemas/fixtures/p1/unit-n0-u01.json');
const n4Unit = readJson('schemas/fixtures/p1/unit-n4-u09.json');
const n0CompetencyIds = n0Unit.competencies.map(item => item.id);
const n4CompetencyIds = n4Unit.competencies.map(item => item.id);

const n0LessonSource = readJson('content/units/001-fala-sons-escrita/legacy/lessons/001-fala-e-escrita.json');
const n0LessonAnchor = readJson('schemas/fixtures/p1/lesson-n0-u01-l01.normalized.json');
const n0Lesson = normalizeLessonV1(n0LessonSource, { competencyIds: n0CompetencyIds });
assertSchema(lessonSchema, n0Lesson, 'N0-U01-L01 runtime');
assert.equal(n0Lesson.blocks.length, n0LessonSource.sequence.length);
assert.deepEqual(n0Lesson.completion, n0LessonAnchor.completion);
assert.equal(block(n0Lesson, 'L01-A01').activity.interaction, block(n0LessonAnchor, 'L01-A01').activity.interaction);
assert.equal(block(n0Lesson, 'L01-A01').activity.evaluation.threshold, 0.75);
assert.equal(block(n0Lesson, 'L01-C03').activity.evaluation.mode, 'DETERMINISTIC');
assert.ok(block(n0Lesson, 'L01-A01').activity.stimuli.some(item => item.type === 'TTS'));

const presentationService = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const legacyPresentationRuntime = presentationService.normalize(n0LessonSource, { competencyIds: n0CompetencyIds });
assertSchema(lessonSchema, legacyPresentationRuntime, 'N0-U01-L01 runtime com apresentação segura');
assert.deepEqual(legacyPresentationRuntime.presentation, {
  intro: SAFE_LESSON_INTRO_V1,
  introSource: 'SAFE_FALLBACK'
});
assert.notEqual(legacyPresentationRuntime.presentation.intro, legacyPresentationRuntime.objective, 'fallback público não pode reutilizar objective técnico');

const authoredPresentationSource = structuredClone(n0LessonSource);
authoredPresentationSource.studentObjective = 'Entender a diferença entre o que falamos e o que escrevemos.';
const authoredPresentationRuntime = presentationService.normalize(authoredPresentationSource, { competencyIds: n0CompetencyIds });
assertSchema(lessonSchema, authoredPresentationRuntime, 'N0-U01-L01 runtime com studentObjective');
assert.deepEqual(authoredPresentationRuntime.presentation, {
  intro: 'Entender a diferença entre o que falamos e o que escrevemos.',
  introSource: 'AUTHORED'
});
assert.equal(authoredPresentationRuntime.objective, n0LessonSource.objective, 'objective técnico deve permanecer intacto');

const whitespacePresentationSource = structuredClone(n0LessonSource);
whitespacePresentationSource.studentObjective = '   ';
const whitespacePresentationRuntime = presentationService.normalize(whitespacePresentationSource, { competencyIds: n0CompetencyIds });
assert.equal(whitespacePresentationRuntime.presentation.introSource, 'SAFE_FALLBACK');
assert.equal(whitespacePresentationRuntime.presentation.intro, SAFE_LESSON_INTRO_V1);

const n0VerificationSource = readJson('content/units/001-fala-sons-escrita/integrated-verification.json');
const n0VerificationAnchor = readJson('schemas/fixtures/p1/verification-n0-u01.normalized.json');
const n0Verification = normalizeVerificationV1(n0VerificationSource, { competencyIds: n0CompetencyIds });
assertSchema(verificationSchema, n0Verification, 'N0-U01-V01 runtime');
assert.equal(n0Verification.blocks.length, n0VerificationSource.items.length);
assert.equal(n0Verification.completion.clusters.length, 4);
const soundWritingCluster = n0Verification.completion.clusters.find(item => item.id === 'soundWritingRelations');
assert.equal(soundWritingCluster.minimumEvidence, 4);
assert.deepEqual(soundWritingCluster.requiredAnyOf, [['V01-Q10', 'V01-Q11']]);
assert.equal(block(n0Verification, 'V01-Q02').activity.evaluation.threshold, 0.5);
assert.equal(block(n0Verification, 'V01-Q07').activity.interaction, block(n0VerificationAnchor, 'V01-Q07').activity.interaction);
assert.ok(block(n0Verification, 'V01-Q02').activity.stimuli.some(item => item.type === 'CONTROLLED_AUDIO'));
assert.equal(presentationService.normalize(n0VerificationSource, { competencyIds: n0CompetencyIds }).presentation, undefined, 'T1.5 não deve transformar verificação em lição');

const n4LessonSource = readJson('content/units/409-literatura-multimodalidade-autoria-intermedial-digital/lessons/001-interpretacao-literaria-autonoma-evidencia.json');
const n4LessonAnchor = readJson('schemas/fixtures/p1/lesson-n4-u09-l01.normalized.json');
const n4Lesson = normalizeLessonV1(n4LessonSource, { competencyIds: n4CompetencyIds });
assertSchema(lessonSchema, n4Lesson, 'N4-U09-L01 runtime');
assert.equal(block(n4Lesson, 'L01-A01').activity.evaluation.mode, block(n4LessonAnchor, 'L01-A01').activity.evaluation.mode);
assert.equal(n4Lesson.completion.clusters[0].satisfaction, 'PENDING_ALLOWED');
assert.equal(block(n4Lesson, 'L01-A01').activity.evidence.recordResponse, true);

const n4LegacyPresentationRuntime = presentationService.normalize(n4LessonSource, { competencyIds: n4CompetencyIds });
assertSchema(lessonSchema, n4LegacyPresentationRuntime, 'N4-U09-L01 runtime com fallback público');
assert.equal(n4LegacyPresentationRuntime.presentation.introSource, 'SAFE_FALLBACK');
assert.notEqual(n4LegacyPresentationRuntime.presentation.intro, n4LegacyPresentationRuntime.objective);

const n4VerificationSource = readJson('content/units/409-literatura-multimodalidade-autoria-intermedial-digital/integrated-verification.json');
const n4VerificationAnchor = readJson('schemas/fixtures/p1/verification-n4-u09.normalized.json');
const n4Verification = normalizeVerificationV1(n4VerificationSource, { competencyIds: n4CompetencyIds });
assertSchema(verificationSchema, n4Verification, 'N4-U09-V01 runtime');
assert.equal(n4Verification.blocks.length, n4VerificationSource.tasks.length);
assert.equal(n4Verification.completion.clusters.length, Object.keys(n4VerificationSource.completionEvidence.clusters).length);
assert.equal(block(n4Verification, 'V01-A01').activity.evaluation.mode, block(n4VerificationAnchor, 'V01-A01').activity.evaluation.mode);
assert.equal(block(n4Verification, 'V01-C01').activity.evaluation.mode, 'DETERMINISTIC');
assert.ok(n4Verification.completion.clusters.every(item => ['PENDING_ALLOWED', 'DEMONSTRATED_REQUIRED'].includes(item.satisfaction)));

const exitSource = readJson('content/levels/004-dominio/exit-verification.json');
const exitVerification = normalizeVerificationV1(exitSource);
assertSchema(verificationSchema, exitVerification, 'N4-EXIT-V01 runtime');
assert.equal(exitVerification.kind, 'LEVEL_VERIFICATION');
assert.equal(exitVerification.blocks.length, 8);
assert.equal(exitVerification.completion.clusters.length, 8);
assert.ok(exitVerification.completion.clusters.every(item => item.satisfaction === 'PENDING_ALLOWED'));
assert.equal(block(exitVerification, 'N4-EXIT-Q07').activity.interaction, 'ORAL_RESPONSE');
assert.equal(block(exitVerification, 'N4-EXIT-Q07').activity.evaluation.mode, 'RELIABLE_EVALUATOR');

const unsupported = structuredClone(n0LessonSource);
unsupported.id = 'N0-U99-L99';
assert.throws(
  () => normalizeLessonV1(unsupported, { competencyIds: ['N0-U99-C01'] }),
  error => error instanceof ContentNormalizationError && error.code === 'UNNORMALIZABLE_COMPLETION'
);

let requestedUrl = null;
const contentService = new ContentService({
  basePath: './content',
  fetchImpl: async url => {
    requestedUrl = url;
    return { ok: true, json: async () => structuredClone(n0LessonSource) };
  }
});
const loaded = await contentService.loadNormalized('units/001-fala-sons-escrita/lessons/001-fala-e-escrita.json', { competencyIds: n0CompetencyIds });
assert.equal(requestedUrl, './content/units/001-fala-sons-escrita/lessons/001-fala-e-escrita.json');
assert.equal(loaded.id, 'N0-U01-L01');
assert.equal(loaded.presentation.introSource, 'SAFE_FALLBACK');
assert.equal(loaded.presentation.intro, SAFE_LESSON_INTRO_V1);

console.log('ContentService/normalizador: conteúdo pedagógico e apresentação pública de lição validados contra os contratos.');
