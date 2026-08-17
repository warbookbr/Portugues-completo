import assert from 'node:assert/strict';
import { ProgressService } from '../app/js/services/progress-service.js';
import { SafeProgressStorage } from '../app/js/services/progress-storage-service.js';

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
  keys() { return [...this.map.keys()]; }
}

const memory = new MemoryStorage();
const backupEvents = [];
const unsafeKey = 'portugues-completo:progress-cache:v1';
memory.setItem(unsafeKey, JSON.stringify({ schemaVersion: 2, courseId: 'portugues-completo', future: true }));
const safeStorage = new SafeProgressStorage({ storage: memory, onBackup: event => backupEvents.push(event) });
const service = new ProgressService({ storage: safeStorage, clock: () => new Date('2026-08-17T13:00:00.000Z') });
assert.equal(backupEvents.length, 1);
assert.equal(memory.getItem(unsafeKey), null);
const backupKey = memory.keys().find(key => key.startsWith('portugues-completo:progress-cache:backup:'));
assert.ok(backupKey, 'cache de versão desconhecida deve ser preservado em backup');
assert.match(memory.getItem(backupKey), /"schemaVersion":2/);
assert.equal(service.getProgress().schemaVersion, 1);

function deterministicBlock(id, { required = true, competencyId = 'C1' } = {}) {
  return {
    id,
    kind: 'ACTIVITY',
    activity: {
      interaction: 'SINGLE_CHOICE',
      evaluation: { mode: 'DETERMINISTIC' },
      evidence: { role: required ? 'REQUIRED' : 'PRACTICE', requiredForCompletion: required, competencyIds: [competencyId], recordResponse: false }
    }
  };
}

const thresholdDocument = {
  id: 'TEST-V01',
  kind: 'UNIT_VERIFICATION',
  completion: {
    clusters: [{
      id: 'cluster', required: true, evidenceIds: ['A', 'B', 'C'],
      satisfaction: 'DEMONSTRATED_REQUIRED', minimumEvidence: 2, requiredAnyOf: [['B', 'C']]
    }]
  }
};
const A = deterministicBlock('A');
const B = deterministicBlock('B');
const C = deterministicBlock('C');
service.recordActivity(thresholdDocument, A, { complete: true, correct: true });
assert.equal(service.getProgress().curriculum.verifications['TEST-V01'].status, 'EM_ESTUDO');
service.recordActivity(thresholdDocument, B, { complete: true, correct: true });
assert.equal(service.getProgress().curriculum.verifications['TEST-V01'].status, 'CONCLUIDA');
assert.equal(service.getProgress().curriculum.verifications['TEST-V01'].clusterStates.cluster, 'DEMONSTRADA');

const attemptDocument = {
  id: 'TEST-L02', kind: 'LESSON', completion: {
    clusters: [{ id: 'reflection', required: true, evidenceIds: ['R1'], satisfaction: 'ATTEMPT_REQUIRED' }]
  }
};
const reflection = {
  id: 'R1', kind: 'ACTIVITY', activity: {
    interaction: 'LONG_TEXT', evaluation: { mode: 'CRITERIA' },
    evidence: { role: 'REQUIRED', requiredForCompletion: true, competencyIds: ['C2'], recordResponse: true }
  }
};
service.recordActivity(attemptDocument, reflection, { complete: true, pending: true }, { response: 'registro reflexivo' });
const attemptProgress = service.getProgress();
assert.equal(attemptProgress.evidence['TEST-L02/R1'].status, 'VALIDACAO_PENDENTE');
assert.equal(attemptProgress.curriculum.lessons['TEST-L02'].status, 'CONCLUIDA');
assert.equal(attemptProgress.responses['TEST-L02/R1'].value, 'registro reflexivo');

console.log('Políticas P5: backup de schema desconhecido, minimumEvidence, requiredAnyOf e ATTEMPT_REQUIRED validados.');
