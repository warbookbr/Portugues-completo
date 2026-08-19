const TOKEN_KEY = 'portugues-completo:ai-companion-token:v1';

export class AiFeedbackCredentialService {
  constructor({ sessionStorage = globalThis.sessionStorage } = {}) {
    this.sessionStorage = sessionStorage;
  }

  get(provider) {
    if (provider !== 'openai-companion') return null;
    try {
      return this.sessionStorage?.getItem?.(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  }

  set(provider, token) {
    if (provider !== 'openai-companion') throw new TypeError(`Provider não suportado pelo credential service: ${provider}.`);
    const value = String(token || '').trim();
    if (!value) return this.clear(provider);
    this.sessionStorage?.setItem?.(TOKEN_KEY, value);
    return true;
  }

  clear(provider) {
    if (provider !== 'openai-companion') return false;
    this.sessionStorage?.removeItem?.(TOKEN_KEY);
    return true;
  }
}

export function createAiFeedbackCredentialService(options = {}) {
  return new AiFeedbackCredentialService(options);
}
