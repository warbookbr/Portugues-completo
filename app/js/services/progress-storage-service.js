const BACKUP_PREFIX = 'portugues-completo:progress-cache:backup:';

function timestampKey() {
  return new Date().toISOString().replace(/[^0-9A-Za-z]/g, '');
}

export class SafeProgressStorage {
  constructor({ storage = globalThis.localStorage, onBackup = null } = {}) {
    this.storage = storage;
    this.onBackup = onBackup;
  }

  getItem(key) {
    const raw = this.storage?.getItem?.(key);
    if (!raw) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.schemaVersion === 1 && parsed?.courseId === 'portugues-completo') return raw;
      const backupKey = `${BACKUP_PREFIX}${timestampKey()}`;
      this.storage?.setItem?.(backupKey, raw);
      this.storage?.removeItem?.(key);
      this.onBackup?.({ key, backupKey, reason: 'UNSUPPORTED_PROGRESS_SCHEMA' });
      return null;
    } catch {
      const backupKey = `${BACKUP_PREFIX}${timestampKey()}`;
      this.storage?.setItem?.(backupKey, raw);
      this.storage?.removeItem?.(key);
      this.onBackup?.({ key, backupKey, reason: 'INVALID_PROGRESS_JSON' });
      return null;
    }
  }

  setItem(key, value) { this.storage?.setItem?.(key, value); }
  removeItem(key) { this.storage?.removeItem?.(key); }
}

export function createSafeProgressStorage(options = {}) { return new SafeProgressStorage(options); }
