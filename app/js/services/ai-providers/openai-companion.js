import { AiFeedbackError } from '../ai-feedback-service.js';

function loopbackUrl(endpoint) {
  let url;
  try {
    url = new URL(endpoint);
  } catch {
    throw new AiFeedbackError('INVALID_ENDPOINT', 'Endpoint do auxiliar local é inválido.');
  }
  const host = url.hostname.toLowerCase();
  if (!['127.0.0.1', 'localhost', '::1', '[::1]'].includes(host)) {
    throw new AiFeedbackError('UNSAFE_ENDPOINT', 'O adapter openai-companion aceita somente endpoint local (loopback).');
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new AiFeedbackError('UNSAFE_ENDPOINT', 'O endpoint do auxiliar precisa usar HTTP(S).');
  return url;
}

export function createOpenAiCompanionAdapter({ fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl obrigatório para openai-companion.');

  return {
    id: 'openai-companion',
    requiresCredential: true,
    async request({ envelope, model, endpoint, credential }) {
      const url = loopbackUrl(endpoint || 'http://127.0.0.1:43117/feedback');
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${credential}`
        },
        body: JSON.stringify({ schemaVersion: 1, model, envelope })
      });

      if (!response.ok) {
        let code = `HTTP_${response.status}`;
        try {
          const payload = await response.json();
          if (payload?.error?.code) code = String(payload.error.code);
        } catch {}
        throw new AiFeedbackError('PROVIDER_REQUEST_FAILED', 'O auxiliar local recusou a solicitação.', { status: response.status, code });
      }

      return response.json();
    }
  };
}

export function isOpenAiCompanionEndpointSafe(endpoint) {
  try {
    loopbackUrl(endpoint);
    return true;
  } catch {
    return false;
  }
}
