import assert from 'node:assert/strict';

import { ProgressService, createEmptyProgress } from '../app/js/services/progress-service.js';
import { ProgressSyncService } from '../app/js/services/progress-sync-service.js';
import { SafeProgressStorage } from '../app/js/services/progress-storage-service.js';
import { MigratingProgressStorage, CONTENT_MIGRATION_BACKUP_REASON, CONTENT_MIGRATION_QUARANTINE_REASON } from '../app/js/services/progress-migration-storage.js';
import { migrateProgressToT1N0, T1_N0_CONTENT_REVISION } from '../app/js/services/progress-migration-t1-n0.js';

const CACHE_KEY = 'portugues-completo:progress-cache:v1';
const BASELINE_KEY = 'portugues-completo:progress-baseline:v1';
const OLD = '2026-08-17T12:00:00.000Z';

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
  keys() { return [...this.map.keys()]; }
}

class FakeGitHub {
  constructor(remote = null) { this.token = ''; this.remote = remote ? structuredClone(remote) : null; this.updateCount = 0; }
  setToken(token) { this.token = token; }
  async identifyUser() { if (!this.token) throw new Error('sem token'); return { login: 'aluna', id: 1 }; }
  async loadProgress() { return this.remote ? structuredClone(this.remote) : null; }
  async createProgress(progress) {
    this.remote = { gistId: 'g1', gistUpdatedAt: '2026-08-18T18:31:00Z', progress: structuredClone(progress) };
    return { gistId: 'g1', gistUpdatedAt: this.remote.gistUpdatedAt };
  }
  async updateProgress(gistId, progress) {
    this.updateCount += 1;
    this.remote = { gistId, gistUpdatedAt: `2026-08-18T18:3${this.updateCount + 1}:00Z`, progress: structuredClone(progress) };
    return { gistId, gistUpdatedAt: this.remote.gistUpdatedAt };
  }
}

function oldProgress() {
  const progress = createEmptyProgress({ clock: () => new Date(OLD) });
  progress.curriculum.lessons['N0-U01-L01'] = { status: 'CONCLUIDA', startedAt: OLD, completedAt: OLD, lastVisitedAt: OLD };
  return progress;
}

function newProgressFrom(old) {
  return migrateProgressToT1N0(old, { now: '2026-08-18T18:30:00.000Z' }).progress;
}

// 1. Cache local válido pré-T1 recebe backup antes de ser substituído pelo snapshot migrado.
{
  const rawStorage = new MemoryStorage();
  const backups = [];
  const safe = new SafeProgressStorage({ storage: rawStorage, onBackup: event => backups.push(event) });
  const migrating = new MigratingProgressStorage({ storage: safe, migrateProgress: migrateProgressToT1N0 });
  const source = oldProgress();
  const rawSource = JSON.stringify(source);
  rawStorage.setItem(CACHE_KEY, rawSource);

  const service = new ProgressService({
    storage: migrating,
    contentRevision: T1_N0_CONTENT_REVISION,
    clock: () => new Date('2026-08-18T18:30:00.000Z')
  });
  const migrated = service.getProgress();

  assert.equal(migrated.meta.contentRevision, T1_N0_CONTENT_REVISION);
  assert.equal(migrated.curriculum.lessons['N0-U01-L01'], undefined);
  assert.equal(migrated.curriculum.lessons['N0-U02-L10'].status, 'CONCLUIDA');
  assert.equal(backups.length, 1);
  assert.equal(backups[0].reason, CONTENT_MIGRATION_BACKUP_REASON);
  assert.equal(rawStorage.getItem(backups[0].backupKey), rawSource);
  assert.equal(JSON.parse(rawStorage.getItem(CACHE_KEY)).meta.contentRevision, T1_N0_CONTENT_REVISION);
}

// 2. Revisão futura é quarentenada em backup e nunca rebaixada para a revisão T1.
{
  const rawStorage = new MemoryStorage();
  const backups = [];
  const safe = new SafeProgressStorage({ storage: rawStorage, onBackup: event => backups.push(event) });
  const migrating = new MigratingProgressStorage({ storage: safe, migrateProgress: migrateProgressToT1N0 });
  const future = oldProgress();
  future.meta.contentRevision = 'future-v99';
  const rawFuture = JSON.stringify(future);
  rawStorage.setItem(CACHE_KEY, rawFuture);

  const service = new ProgressService({
    storage: migrating,
    contentRevision: T1_N0_CONTENT_REVISION,
    clock: () => new Date('2026-08-18T18:30:00.000Z')
  });

  assert.equal(backups.length, 1);
  assert.equal(backups[0].reason, CONTENT_MIGRATION_QUARANTINE_REASON);
  assert.equal(rawStorage.getItem(backups[0].backupKey), rawFuture);
  assert.equal(rawStorage.getItem(CACHE_KEY), null);
  assert.equal(service.getProgress().meta.contentRevision, T1_N0_CONTENT_REVISION);
  assert.deepEqual(service.getProgress().curriculum.lessons, {});
}

// 3. Gist pré-T1 é migrado antes de virar estado ativo e atualizado remotamente para não reintroduzir refs antigas.
{
  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  const local = new ProgressService({
    storage: localStorage,
    contentRevision: T1_N0_CONTENT_REVISION,
    clock: () => new Date('2026-08-18T18:30:00.000Z')
  });
  const github = new FakeGitHub({ gistId: 'g1', gistUpdatedAt: OLD, progress: oldProgress() });
  const sync = new ProgressSyncService({
    progressService: local,
    githubService: github,
    localStorage,
    sessionStorage,
    migrateProgress: migrateProgressToT1N0
  });

  const result = await sync.connect('token-teste');
  assert.equal(result.progress.meta.contentRevision, T1_N0_CONTENT_REVISION);
  assert.equal(local.getProgress().curriculum.lessons['N0-U02-L10'].status, 'CONCLUIDA');
  assert.equal(github.updateCount, 1, 'Gist antigo deve ser regravado na revisão nova mesmo quando adotado integralmente');
  assert.equal(github.remote.progress.meta.contentRevision, T1_N0_CONTENT_REVISION);
  assert.equal(github.remote.progress.curriculum.lessons['N0-U01-L01'], undefined);
  assert.equal(JSON.parse(localStorage.getItem(BASELINE_KEY)).meta.contentRevision, T1_N0_CONTENT_REVISION);
  assert.equal(sync.getState().status, 'SYNCED');
}

// 4. Baseline antiga é normalizada antes das comparações; remoto antigo equivalente ainda é atualizado de forma canônica.
{
  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  const old = oldProgress();
  const migrated = newProgressFrom(old);
  localStorage.setItem(CACHE_KEY, JSON.stringify(migrated));
  localStorage.setItem(BASELINE_KEY, JSON.stringify(old));

  const local = new ProgressService({ storage: localStorage, contentRevision: T1_N0_CONTENT_REVISION });
  const github = new FakeGitHub({ gistId: 'g1', gistUpdatedAt: OLD, progress: old });
  const sync = new ProgressSyncService({
    progressService: local,
    githubService: github,
    localStorage,
    sessionStorage,
    migrateProgress: migrateProgressToT1N0
  });

  await sync.connect('token-teste');
  assert.equal(JSON.parse(localStorage.getItem(BASELINE_KEY)).meta.contentRevision, T1_N0_CONTENT_REVISION);
  assert.equal(github.updateCount, 1);
  assert.deepEqual(github.remote.progress, local.getProgress());
}

// 5. Gist de revisão futura falha fechado: não altera local nem remoto.
{
  const localStorage = new MemoryStorage();
  const sessionStorage = new MemoryStorage();
  const local = new ProgressService({ storage: localStorage, contentRevision: T1_N0_CONTENT_REVISION });
  const before = local.getProgress();
  const future = oldProgress();
  future.meta.contentRevision = 'future-v99';
  const remoteBefore = structuredClone(future);
  const github = new FakeGitHub({ gistId: 'g1', gistUpdatedAt: OLD, progress: future });
  const sync = new ProgressSyncService({
    progressService: local,
    githubService: github,
    localStorage,
    sessionStorage,
    migrateProgress: migrateProgressToT1N0
  });

  await assert.rejects(() => sync.connect('token-teste'), error => error?.code === 'UNSUPPORTED_CONTENT_REVISION');
  assert.equal(sync.getState().status, 'ERROR');
  assert.deepEqual(local.getProgress(), before);
  assert.deepEqual(github.remote.progress, remoteBefore);
  assert.equal(github.updateCount, 0);
}

console.log('T1.9 wiring: backup local, quarentena, baseline e Gist migrados antes de ativação validados.');
