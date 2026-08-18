import { createGitHubService } from './github-service.js';
import { isProgressEmpty, mergeProgress } from './progress-service.js';

const TOKEN_KEY = 'portugues-completo:github-token:v1';
const SYNC_KEY = 'portugues-completo:progress-sync:v1';
const BASELINE_KEY = 'portugues-completo:progress-baseline:v1';

const clone = value => structuredClone(value);

function safeParse(storage, key, fallback = null) {
  try {
    const raw = storage?.getItem?.(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export class ProgressSyncService {
  constructor({
    progressService,
    githubService = null,
    localStorage = globalThis.localStorage,
    sessionStorage = globalThis.sessionStorage,
    migrateProgress = null
  } = {}) {
    if (!progressService) throw new TypeError('ProgressSyncService exige ProgressService.');
    if (migrateProgress !== null && typeof migrateProgress !== 'function') throw new TypeError('migrateProgress deve ser função ou null.');
    this.progressService = progressService;
    this.localStorage = localStorage;
    this.sessionStorage = sessionStorage;
    this.migrateProgress = migrateProgress;
    this.state = safeParse(localStorage, SYNC_KEY, {
      gistId: null,
      login: null,
      lastSyncedAt: null,
      lastRemoteUpdatedAt: null,
      status: 'LOCAL_ONLY',
      conflicts: []
    });
    this.token = sessionStorage?.getItem?.(TOKEN_KEY) || '';
    this.github = githubService || createGitHubService({ token: this.token });
    if (this.token) this.github.setToken(this.token);
    this.listeners = new Set();
    this.suppressProgressWatch = false;
    this.progressService.subscribe(progress => {
      if (this.suppressProgressWatch) return;
      const baseline = this.baseline();
      if (!baseline || JSON.stringify(progress) !== JSON.stringify(baseline)) {
        this.state.status = this.token ? 'LOCAL_CHANGES' : 'LOCAL_ONLY';
        this.state.conflicts = [];
        this.persistState();
      }
    });
  }

  prepareProgress(progress) {
    if (!progress) return { progress: null, changed: false, report: null };
    if (!this.migrateProgress) return { progress: clone(progress), changed: false, report: null };
    const result = this.migrateProgress(progress);
    if (!result?.progress) throw new Error('Migração de progresso não retornou snapshot válido.');
    return { progress: clone(result.progress), changed: Boolean(result.changed), report: clone(result.report || null) };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const snapshot = this.getState();
    this.listeners.forEach(listener => listener(snapshot));
  }

  persistState() {
    this.localStorage?.setItem?.(SYNC_KEY, JSON.stringify(this.state));
    this.notify();
  }

  getState() { return clone({ ...this.state, connected: Boolean(this.token) }); }

  getToken() { return this.token; }

  setToken(token) {
    this.token = String(token || '').trim();
    this.github.setToken(this.token);
    if (this.token) this.sessionStorage?.setItem?.(TOKEN_KEY, this.token);
    else this.sessionStorage?.removeItem?.(TOKEN_KEY);
    this.notify();
  }

  disconnect() {
    this.setToken('');
    this.state.status = 'LOCAL_ONLY';
    this.persistState();
  }

  baseline() {
    const baseline = safeParse(this.localStorage, BASELINE_KEY, null);
    if (!baseline) return null;
    const prepared = this.prepareProgress(baseline);
    if (prepared.changed) this.saveBaseline(prepared.progress);
    return prepared.progress;
  }

  saveBaseline(progress) {
    const prepared = this.prepareProgress(progress);
    this.localStorage?.setItem?.(BASELINE_KEY, JSON.stringify(prepared.progress));
  }

  replaceFromSync(progress) {
    this.suppressProgressWatch = true;
    try { return this.progressService.replaceProgress(progress); }
    finally { this.suppressProgressWatch = false; }
  }

  async connect(token) {
    this.setToken(token);
    try {
      const user = await this.github.identifyUser();
      this.state.login = user.login;
      this.state.status = 'SYNCING';
      this.persistState();
      return await this.sync();
    } catch (error) {
      this.state.status = 'ERROR';
      this.state.lastError = error.message;
      this.persistState();
      throw error;
    }
  }

  async sync() {
    if (!this.token) throw new Error('Conecte uma credencial GitHub antes de sincronizar.');
    this.state.status = 'SYNCING';
    delete this.state.lastError;
    this.persistState();

    try {
      const localSource = this.progressService.getProgress();
      const preparedLocal = this.prepareProgress(localSource);
      let local = preparedLocal.progress;
      if (preparedLocal.changed) local = this.replaceFromSync(local);

      const baseline = this.baseline();
      const loadedRemote = await this.github.loadProgress({ gistId: this.state.gistId });
      let remote = loadedRemote;
      let remoteNeedsMigration = false;
      if (loadedRemote) {
        const preparedRemote = this.prepareProgress(loadedRemote.progress);
        remoteNeedsMigration = preparedRemote.changed;
        remote = { ...loadedRemote, progress: preparedRemote.progress };
      }

      let resolved = local;
      let conflicts = [];
      let remoteMeta = null;

      if (!remote) {
        remoteMeta = await this.github.createProgress(local);
        this.state.gistId = remoteMeta.gistId;
      } else {
        this.state.gistId = remote.gistId;
        const localChanged = !baseline || JSON.stringify(local) !== JSON.stringify(baseline);
        const remoteChanged = !baseline || JSON.stringify(remote.progress) !== JSON.stringify(baseline);

        if (baseline && !localChanged && remoteChanged) {
          resolved = this.replaceFromSync(remote.progress);
        } else if (baseline && localChanged && !remoteChanged) {
          remoteMeta = await this.github.updateProgress(remote.gistId, local);
        } else if (!baseline && isProgressEmpty(local)) {
          resolved = this.replaceFromSync(remote.progress);
        } else if (!baseline && isProgressEmpty(remote.progress)) {
          remoteMeta = await this.github.updateProgress(remote.gistId, local);
        } else if (JSON.stringify(local) !== JSON.stringify(remote.progress)) {
          const merged = mergeProgress(local, remote.progress, baseline);
          resolved = this.replaceFromSync(merged.progress);
          conflicts = merged.conflicts;
          remoteMeta = await this.github.updateProgress(remote.gistId, resolved);
        } else {
          resolved = local;
        }

        if (remoteNeedsMigration && !remoteMeta) {
          remoteMeta = await this.github.updateProgress(remote.gistId, resolved);
        }
        this.state.lastRemoteUpdatedAt = remoteMeta?.gistUpdatedAt || remote.gistUpdatedAt || null;
      }

      if (remoteMeta?.gistUpdatedAt) this.state.lastRemoteUpdatedAt = remoteMeta.gistUpdatedAt;
      this.state.lastSyncedAt = new Date().toISOString();
      this.state.status = conflicts.length ? 'CONFLICT_PRESERVED' : 'SYNCED';
      this.state.conflicts = conflicts;
      this.saveBaseline(resolved);
      this.persistState();
      return { progress: clone(resolved), state: this.getState(), conflicts: clone(conflicts) };
    } catch (error) {
      this.state.status = 'ERROR';
      this.state.lastError = error.message;
      this.persistState();
      throw error;
    }
  }
}

export function createProgressSyncService(options = {}) { return new ProgressSyncService(options); }
