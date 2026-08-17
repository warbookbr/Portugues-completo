import assert from 'node:assert/strict';
import { ProgressService } from '../app/js/services/progress-service.js';
import { ProgressSyncService } from '../app/js/services/progress-sync-service.js';

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

class FakeGitHub {
  constructor() { this.token = ''; this.remote = null; this.failUpdate = false; this.updateCount = 0; }
  setToken(token) { this.token = token; }
  async identifyUser() { if (!this.token) throw new Error('sem token'); return { login: 'aluna', id: 1 }; }
  async loadProgress() { return this.remote ? structuredClone(this.remote) : null; }
  async createProgress(progress) {
    this.remote = { gistId: 'g1', gistUpdatedAt: '2026-08-17T12:01:00Z', progress: structuredClone(progress) };
    return { gistId: 'g1', gistUpdatedAt: this.remote.gistUpdatedAt };
  }
  async updateProgress(gistId, progress) {
    if (this.failUpdate) throw new Error('falha remota simulada');
    this.updateCount += 1;
    this.remote = { gistId, gistUpdatedAt: `2026-08-17T12:0${this.updateCount + 1}:00Z`, progress: structuredClone(progress) };
    return { gistId, gistUpdatedAt: this.remote.gistUpdatedAt };
  }
}

const localStorage = new MemoryStorage();
const sessionStorage = new MemoryStorage();
let tick = 0;
const progress = new ProgressService({
  storage: localStorage,
  clock: () => new Date(`2026-08-17T12:${String(tick++).padStart(2, '0')}:00.000Z`)
});
const github = new FakeGitHub();
const sync = new ProgressSyncService({ progressService: progress, githubService: github, localStorage, sessionStorage });

await sync.connect('token-teste');
assert.equal(sync.getState().status, 'SYNCED');
assert.equal(sync.getState().gistId, 'g1');
assert.equal(sessionStorage.getItem('portugues-completo:github-token:v1'), 'token-teste');

progress.addVoluntaryReview('N0-U01-C01');
assert.equal(sync.getState().status, 'LOCAL_CHANGES');
await sync.sync();
assert.equal(sync.getState().status, 'SYNCED');
assert.equal(github.remote.progress.review.queue[0].competencyId, 'N0-U01-C01');

const baselineLocal = progress.getProgress();
const localVersion = structuredClone(baselineLocal);
localVersion.responses['N4-U09-L01/L01-A01'] = { type: 'LONG_TEXT', value: 'local', updatedAt: '2026-08-17T12:20:00Z', revision: 1 };
localVersion.meta.updatedAt = '2026-08-17T12:20:00Z';
progress.replaceProgress(localVersion);

const remoteVersion = structuredClone(baselineLocal);
remoteVersion.responses['N4-U09-L01/L01-A01'] = { type: 'LONG_TEXT', value: 'remota', updatedAt: '2026-08-17T12:21:00Z', revision: 1 };
remoteVersion.meta.updatedAt = '2026-08-17T12:21:00Z';
github.remote.progress = remoteVersion;

const conflictResult = await sync.sync();
assert.equal(conflictResult.conflicts.length, 1);
assert.equal(sync.getState().status, 'CONFLICT_PRESERVED');
const values = Object.values(progress.getProgress().responses).map(item => item.value);
assert.ok(values.includes('local'));
assert.ok(values.includes('remota'));
assert.ok(Object.keys(github.remote.progress.responses).some(key => key.includes('#conflict-')));

const beforeFailure = progress.getProgress();
progress.addVoluntaryReview('N4-U09-C01');
const localBeforeSyncFailure = progress.getProgress();
github.failUpdate = true;
await assert.rejects(() => sync.sync(), /falha remota simulada/);
assert.equal(sync.getState().status, 'ERROR');
assert.deepEqual(progress.getProgress(), localBeforeSyncFailure);
assert.notDeepEqual(progress.getProgress(), beforeFailure);

sync.disconnect();
assert.equal(sessionStorage.getItem('portugues-completo:github-token:v1'), null);
assert.equal(sync.getState().status, 'LOCAL_ONLY');

console.log('ProgressSyncService P5: baseline, alterações locais, conflito preservado e falha remota sem perda validados.');
