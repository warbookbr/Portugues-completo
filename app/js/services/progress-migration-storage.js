export const CONTENT_MIGRATION_BACKUP_REASON = 'CONTENT_MIGRATION_T1_N0';
export const CONTENT_MIGRATION_QUARANTINE_REASON = 'UNSUPPORTED_CONTENT_REVISION';

export class MigratingProgressStorage {
  constructor({ storage, migrateProgress, backupReason = CONTENT_MIGRATION_BACKUP_REASON } = {}) {
    if (!storage) throw new TypeError('MigratingProgressStorage exige storage.');
    if (typeof migrateProgress !== 'function') throw new TypeError('MigratingProgressStorage exige migrateProgress.');
    this.storage = storage;
    this.migrateProgress = migrateProgress;
    this.backupReason = backupReason;
  }

  getItem(key) {
    const raw = this.storage.getItem(key);
    if (!raw) return raw;

    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { return raw; }

    try {
      const result = this.migrateProgress(parsed);
      if (!result?.changed) return raw;
      this.storage.backupItem?.(key, raw, this.backupReason);
      const migratedRaw = JSON.stringify(result.progress);
      this.storage.setItem(key, migratedRaw);
      return migratedRaw;
    } catch (error) {
      if (error?.code !== 'UNSUPPORTED_CONTENT_REVISION') throw error;
      this.storage.backupItem?.(key, raw, CONTENT_MIGRATION_QUARANTINE_REASON);
      this.storage.removeItem(key);
      return null;
    }
  }

  setItem(key, value) { this.storage.setItem(key, value); }
  removeItem(key) { this.storage.removeItem(key); }
  backupItem(key, raw, reason) { return this.storage.backupItem?.(key, raw, reason) ?? null; }
}

export function createMigratingProgressStorage(options = {}) {
  return new MigratingProgressStorage(options);
}
