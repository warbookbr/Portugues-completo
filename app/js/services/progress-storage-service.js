const BACKUP_PREFIX = 'portugues-completo:progress-cache:backup:';

function timestampKey() {
  return new Date().toISOString().replace(/[^0-9A-Za-z]/g, '');
}

export class SafeProgressStorage {
  constructor({ storage = globalThis.localStorage, onBackup = null } = {}) {
    this.storage = storage;
    this.onBackup = onBackup;
  }

  backupItem(key, raw, reason = 'MANUAL_PROGRESS_BACKUP') {
    if (raw === null || raw === undefined) return null;
    const backupKey = `${BACKUP_PREFIX}${timestampKey()}`;
    this.storage?.setItem?.(backupKey, String(raw));
    this.onBackup?.({ key, backupKey, reason });
    return backupKey;
  }

  getItem(key) {
    const raw = this.storage?.getItem?.(key);
    if (!raw) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.schemaVersion === 1 && parsed?.courseId === 'portugues-completo') return raw;
      this.backupItem(key, raw, 'UNSUPPORTED_PROGRESS_SCHEMA');
      this.storage?.removeItem?.(key);
      return null;
    } catch {
      this.backupItem(key, raw, 'INVALID_PROGRESS_JSON');
      this.storage?.removeItem?.(key);
      return null;
    }
  }

  setItem(key, value) { this.storage?.setItem?.(key, value); }
  removeItem(key) { this.storage?.removeItem?.(key); }
}

export function createSafeProgressStorage(options = {}) { return new SafeProgressStorage(options); }
