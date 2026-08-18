import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createEmptyProgress } from '../app/js/services/progress-service.js';
import {
  migrateProgressToT1N0,
  ProgressMigrationError,
  T1_N0_CONTENT_REVISION,
  T1_N0_LEGACY_REF_PREFIX
} from '../app/js/services/progress-migration-t1-n0.js';
import { validateValue } from './validate-contracts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const progressSchema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/progress.schema.json'), 'utf8'));
const NOW = '2026-08-18T18:30:00.000Z';
const OLD = '2026-08-17T12:00:00.000Z';

const support = () => ({ hintUsed: false, replayCount: 0, rereadUsed: false, consultationUsed: false });
const demonstratedEvidence = (at = OLD) => ({ status: 'DEMONSTRADA', attemptCount: 1, lastAttemptAt: at, support: support(), feedbackRef: null });
const practicedEvidence = (at = OLD) => ({ status: 'PRATICADA', attemptCount: 1, lastAttemptAt: at, support: support(), feedbackRef: null });
const completedLesson = () => ({ status: 'CONCLUIDA', startedAt: OLD, completedAt: OLD, lastVisitedAt: OLD });
const studyingLesson = () => ({ status: 'EM_ESTUDO', startedAt: OLD, completedAt: null, lastVisitedAt: OLD });
const completedVerification = () => ({ status: 'CONCLUIDA', attemptCount: 1, clusterStates: {}, lastAttemptAt: OLD });

function fresh() {
  return createEmptyProgress({ clock: () => new Date(OLD) });
}

function assertSchema(progress, label) {
  const errors = validateValue(progressSchema, progress, label);
  assert.deepEqual(errors, [], `${label} não validou contra progress.schema.json:\n${errors.join('\n')}`);
}

function migrate(progress) {
  const result = migrateProgressToT1N0(progress, { now: NOW });
  assertSchema(result.progress, 'progresso migrado T1.9');
  return result;
}

// 1. Progresso vazio recebe a revisão, sem inventar aprendizagem.
{
  const source = fresh();
  const result = migrate(source);
  assert.equal(result.changed, true);
  assert.equal(result.progress.meta.contentRevision, T1_N0_CONTENT_REVISION);
  assert.deepEqual(result.progress.curriculum.lessons, {});
  assert.deepEqual(result.progress.curriculum.verifications, {});
  assert.deepEqual(result.progress.evidence, {});
  assert.deepEqual(result.progress.competencies, {});
}

// 2. Migração é idempotente.
{
  const first = migrate(fresh()).progress;
  const second = migrateProgressToT1N0(first, { now: '2026-08-19T00:00:00.000Z' });
  assert.equal(second.changed, false);
  assert.equal(second.report.alreadyApplied, true);
  assert.deepEqual(second.progress, first);
}

// 3. Revisão futura/desconhecida nunca é rebaixada silenciosamente.
{
  const source = fresh();
  source.meta.contentRevision = 'future-v99';
  assert.throws(
    () => migrateProgressToT1N0(source, { now: NOW }),
    error => error instanceof ProgressMigrationError && error.code === 'UNSUPPORTED_CONTENT_REVISION'
  );
}

// 4. Split da antiga L05: refs conflitantes são arquivados e cada novo escopo recebe somente evidência semanticamente válida.
{
  const source = fresh();
  source.curriculum.lessons['N0-U01-L05'] = completedLesson();
  source.evidence['N0-U01-L05/L05-A01'] = demonstratedEvidence();
  source.evidence['N0-U01-L05/L05-C02'] = demonstratedEvidence();
  source.evidence['N0-U01-L05/L05-A02'] = demonstratedEvidence();
  source.evidence['N0-U01-L05/L05-C03'] = demonstratedEvidence();
  source.competencies['N0-U01-C05'] = {
    status: 'DEMONSTRADA',
    evidenceRefs: ['N0-U01-L05/L05-A01', 'N0-U01-L05/L05-A02', 'N0-U01-L05/L05-C03'],
    reviewRecommended: true,
    updatedAt: OLD
  };
  source.review.queue.push({
    id: 'review:N0-U01-C05', competencyId: 'N0-U01-C05', reason: 'RECENT_DIFFICULTY',
    sourceEvidenceRef: 'N0-U01-L05/L05-A02', priority: 'NORMAL', createdAt: OLD, lastReviewedAt: null
  });

  const { progress } = migrate(source);
  for (const oldRef of ['N0-U01-L05/L05-C02', 'N0-U01-L05/L05-A02', 'N0-U01-L05/L05-C03']) {
    assert.ok(progress.evidence[`${T1_N0_LEGACY_REF_PREFIX}${oldRef}`], `${oldRef} deve ficar preservado como legado`);
  }
  assert.equal(progress.curriculum.lessons['N0-U01-L05'].status, 'CONCLUIDA');
  assert.equal(progress.curriculum.lessons['N0-U01-L09'].status, 'CONCLUIDA');
  assert.equal(progress.evidence['N0-U01-L05/L05-A02'].status, 'DEMONSTRADA');
  assert.match(progress.evidence['N0-U01-L05/L05-A02'].feedbackRef, /N0-U01-L05\/L05-A01|N0-U01-L05@pre-t1/);
  assert.equal(progress.evidence['N0-U01-L09/L09-A01'].status, 'DEMONSTRADA');
  assert.equal(progress.evidence['N0-U01-L09/L09-C02'].status, 'DEMONSTRADA');
  assert.equal(progress.competencies['N0-U01-C09'].status, 'DEMONSTRADA');
  assert.ok(progress.competencies['N0-U01-C05'].evidenceRefs.every(ref => !ref.startsWith(T1_N0_LEGACY_REF_PREFIX)));
  assert.equal(progress.review.queue[0].competencyId, 'N0-U01-C09');
  assert.equal(progress.review.queue[0].sourceEvidenceRef, 'N0-U01-L09/L09-A01');
}

// 5. Evidência parcial do escopo de outros sinais não conclui falsamente a nova L09.
{
  const source = fresh();
  source.curriculum.lessons['N0-U01-L05'] = studyingLesson();
  source.evidence['N0-U01-L05/L05-A02'] = demonstratedEvidence();
  const { progress } = migrate(source);
  assert.equal(progress.curriculum.lessons['N0-U01-L09'].status, 'EM_ESTUDO');
  assert.ok(progress.evidence['N0-U01-L09/L09-A01']);
  assert.equal(progress.evidence['N0-U01-L09/L09-C02'], undefined);
}

// 6. Conteúdos movidos L01/L08 preservam conclusão sem contar duas lições e redirecionam current.
{
  const source = fresh();
  source.curriculum.lessons['N0-U01-L01'] = completedLesson();
  source.curriculum.lessons['N0-U01-L08'] = completedLesson();
  source.curriculum.current = { levelId: 'N0', unitId: 'N0-U01', lessonId: 'N0-U01-L01' };
  source.competencies['N0-U01-C01'] = { status: 'DEMONSTRADA', evidenceRefs: [], reviewRecommended: false, updatedAt: OLD };
  source.competencies['N0-U01-C08'] = { status: 'DEMONSTRADA', evidenceRefs: [], reviewRecommended: true, updatedAt: OLD };
  source.review.queue.push({
    id: 'review:N0-U01-C08', competencyId: 'N0-U01-C08', reason: 'RECENT_DIFFICULTY',
    sourceEvidenceRef: 'N0-U01-L08/L08-A01', priority: 'HIGH', createdAt: OLD, lastReviewedAt: null
  });

  const { progress } = migrate(source);
  assert.equal(progress.curriculum.lessons['N0-U01-L01'], undefined);
  assert.equal(progress.curriculum.lessons['N0-U01-L08'], undefined);
  assert.equal(progress.curriculum.lessons['N0-U02-L10'].status, 'CONCLUIDA');
  assert.equal(progress.curriculum.lessons['N0-U02-L09'].status, 'CONCLUIDA');
  assert.deepEqual(progress.curriculum.current, { levelId: 'N0', unitId: 'N0-U02', lessonId: 'N0-U02-L10' });
  assert.equal(progress.competencies['N0-U01-C01'], undefined);
  assert.equal(progress.competencies['N0-U01-C08'], undefined);
  assert.equal(progress.competencies['N0-U02-C10'].status, 'DEMONSTRADA');
  assert.equal(progress.competencies['N0-U02-C11'].status, 'DEMONSTRADA');
  assert.equal(progress.review.queue[0].competencyId, 'N0-U02-C10');
  assert.equal(progress.review.queue[0].sourceEvidenceRef, 'N0-U02-L09/L09-A01');
}

// 7. U1-V01 concluída é checkpoint-equivalente à nova U1-V02, como congelado em T1.2.
{
  const source = fresh();
  source.curriculum.verifications['N0-U01-V01'] = completedVerification();
  const { progress } = migrate(source);
  assert.equal(progress.curriculum.verifications['N0-U01-V02'].status, 'CONCLUIDA');
  assert.deepEqual(progress.curriculum.verifications['N0-U01-V02'].clusterStates, {
    alphabetAndForms: 'DEMONSTRADA', letterCategories: 'DEMONSTRADA', visualOrganization: 'DEMONSTRADA', soundAndLetter: 'DEMONSTRADA'
  });
  for (let index = 1; index <= 9; index += 1) {
    assert.equal(progress.evidence[`N0-U01-V02/V02-Q${String(index).padStart(2, '0')}`].status, 'DEMONSTRADA');
  }
}

// 8. U2-V01 concluída sozinha preserva o núcleo silábico, mas NÃO conclui a nova V02 sem os escopos movidos.
{
  const source = fresh();
  source.curriculum.verifications['N0-U02-V01'] = completedVerification();
  const { progress } = migrate(source);
  const verification = progress.curriculum.verifications['N0-U02-V02'];
  assert.equal(verification.status, 'EM_ESTUDO');
  assert.equal(verification.clusterStates.syllableAwareness, 'DEMONSTRADA');
  assert.equal(verification.clusterStates.syllableWriting, 'DEMONSTRADA');
  assert.equal(verification.clusterStates.wordReadingAndMeaning, 'DEMONSTRADA');
  assert.equal(verification.clusterStates.soundWritingRelations, undefined);
  assert.equal(verification.clusterStates.speechAndWriting, undefined);
  for (let index = 1; index <= 9; index += 1) assert.ok(progress.evidence[`N0-U02-V02/V02-Q${String(index).padStart(2, '0')}`]);
  for (let index = 10; index <= 12; index += 1) assert.equal(progress.evidence[`N0-U02-V02/V02-Q${index}`], undefined);
}

// 9. U2-V01 + antigos L08 e L01 concluídos satisfazem a nova U2-V02 integralmente.
{
  const source = fresh();
  source.curriculum.verifications['N0-U02-V01'] = completedVerification();
  source.curriculum.lessons['N0-U01-L08'] = completedLesson();
  source.curriculum.lessons['N0-U01-L01'] = completedLesson();
  const { progress } = migrate(source);
  const verification = progress.curriculum.verifications['N0-U02-V02'];
  assert.equal(verification.status, 'CONCLUIDA');
  assert.deepEqual(verification.clusterStates, {
    syllableAwareness: 'DEMONSTRADA', syllableWriting: 'DEMONSTRADA', wordReadingAndMeaning: 'DEMONSTRADA',
    soundWritingRelations: 'DEMONSTRADA', speechAndWriting: 'DEMONSTRADA'
  });
  for (let index = 1; index <= 12; index += 1) assert.equal(progress.evidence[`N0-U02-V02/V02-Q${String(index).padStart(2, '0')}`].status, 'DEMONSTRADA');
}

// 10. Progresso misto com target já existente não é sobrescrito pela migração.
{
  const source = fresh();
  source.curriculum.lessons['N0-U01-L08'] = studyingLesson();
  source.evidence['N0-U01-L08/L08-A01'] = demonstratedEvidence();
  source.evidence['N0-U02-L09/L09-A01'] = practicedEvidence('2026-08-18T10:00:00.000Z');
  const { progress } = migrate(source);
  assert.equal(progress.evidence['N0-U02-L09/L09-A01'].status, 'PRATICADA');
  assert.equal(progress.evidence['N0-U02-L09/L09-A01'].lastAttemptAt, '2026-08-18T10:00:00.000Z');
}

console.log('T1.9 migração de progresso: identidade, refs de atividade, V01→V02, current, reviews, idempotência e schema validados.');
