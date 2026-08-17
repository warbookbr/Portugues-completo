import assert from 'node:assert/strict';
import { createEmptyProgress, mergeProgress } from '../app/js/services/progress-service.js';

const base = createEmptyProgress({ clock: () => new Date('2026-08-17T14:00:00.000Z') });
base.curriculum.verifications.V1 = {
  status: 'EM_ESTUDO', attemptCount: 1,
  clusterStates: { leitura: 'PRATICADA' },
  lastAttemptAt: '2026-08-17T14:01:00.000Z'
};
base.review.queue = [{
  id: 'review:C1', competencyId: 'C1', reason: 'RECENT_DIFFICULTY',
  sourceEvidenceRef: 'V1/A1', priority: 'NORMAL',
  createdAt: '2026-08-17T14:01:00.000Z', lastReviewedAt: null
}];
base.meta.updatedAt = '2026-08-17T14:01:00.000Z';

const local = structuredClone(base);
local.responses['L1/A1'] = { type: 'LONG_TEXT', value: 'mudança local não relacionada', updatedAt: '2026-08-17T14:05:00.000Z', revision: 1 };
local.meta.updatedAt = '2026-08-17T14:05:00.000Z';

const remote = structuredClone(base);
remote.curriculum.verifications.V1.clusterStates.producao = 'DEMONSTRADA';
remote.curriculum.verifications.V1.lastAttemptAt = '2026-08-17T14:06:00.000Z';
remote.review.queue = [];
remote.meta.updatedAt = '2026-08-17T14:06:00.000Z';

const result = mergeProgress(local, remote, base).progress;
assert.equal(result.curriculum.verifications.V1.clusterStates.leitura, 'PRATICADA', 'cluster existente só no lado local/base não pode desaparecer');
assert.equal(result.curriculum.verifications.V1.clusterStates.producao, 'DEMONSTRADA', 'cluster novo remoto deve ser preservado');
assert.deepEqual(result.review.queue, [], 'revisão resolvida remotamente não pode ser ressuscitada por lado local inalterado');
assert.equal(result.responses['L1/A1'].value, 'mudança local não relacionada');

const localRemoved = structuredClone(base);
localRemoved.review.queue = [];
localRemoved.meta.updatedAt = '2026-08-17T14:07:00.000Z';
const remoteChanged = structuredClone(base);
remoteChanged.review.queue[0].priority = 'HIGH';
remoteChanged.meta.updatedAt = '2026-08-17T14:08:00.000Z';
const changedWins = mergeProgress(localRemoved, remoteChanged, base).progress;
assert.equal(changedWins.review.queue.length, 1, 'alteração remota real não deve ser apagada por remoção concorrente');
assert.equal(changedWins.review.queue[0].priority, 'HIGH');

console.log('Merge P5 edge cases: clusters parciais e remoção/alteração concorrente da fila de revisão validados.');
