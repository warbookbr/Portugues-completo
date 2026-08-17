export const PROGRESS_GIST_FILENAME = 'portugues-completo-progress.json';
const API_VERSION = '2026-03-10';

export class GitHubServiceError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'GitHubServiceError';
    this.code = code;
    this.details = details;
  }
}

function authHeaders(token, extra = {}) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': API_VERSION,
    ...extra
  };
}

function validatedRawGistUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'gist.githubusercontent.com') throw new Error('host não permitido');
    return url.toString();
  } catch (error) {
    throw new GitHubServiceError('RAW_FILE_URL_INVALID', 'O GitHub retornou uma URL de conteúdo bruto inesperada para o Gist.', { cause: error.message });
  }
}

async function responseJson(response) {
  try { return await response.json(); } catch { return null; }
}

export class GitHubService {
  constructor({ token = '', fetchImpl = (...args) => globalThis.fetch(...args), apiBase = 'https://api.github.com' } = {}) {
    this.token = token;
    this.fetchImpl = fetchImpl;
    this.apiBase = apiBase.replace(/\/$/, '');
  }

  setToken(token) { this.token = String(token || '').trim(); }

  async request(path, { method = 'GET', body = null } = {}) {
    if (!this.token) throw new GitHubServiceError('TOKEN_REQUIRED', 'Informe uma credencial GitHub para sincronizar o progresso.');
    const response = await this.fetchImpl(`${this.apiBase}${path}`, {
      method,
      headers: authHeaders(this.token, body ? { 'Content-Type': 'application/json' } : {}),
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store'
    });
    if (!response.ok) {
      const payload = await responseJson(response);
      const message = payload?.message || `GitHub respondeu HTTP ${response.status}.`;
      const code = response.status === 401 ? 'UNAUTHORIZED' : response.status === 403 ? 'FORBIDDEN' : response.status === 404 ? 'NOT_FOUND' : 'HTTP_ERROR';
      throw new GitHubServiceError(code, message, { status: response.status, payload });
    }
    return response;
  }

  async identifyUser() {
    const response = await this.request('/user');
    const user = await responseJson(response);
    return { login: user?.login || null, id: user?.id || null };
  }

  async getGist(gistId) {
    const response = await this.request(`/gists/${encodeURIComponent(gistId)}`);
    return responseJson(response);
  }

  async listOwnGists() {
    const all = [];
    for (let page = 1; page <= 20; page += 1) {
      const response = await this.request(`/gists?per_page=100&page=${page}`);
      const batch = await responseJson(response);
      if (!Array.isArray(batch)) break;
      all.push(...batch);
      if (batch.length < 100) break;
    }
    return all;
  }

  async findProgressGist() {
    const gists = await this.listOwnGists();
    return gists.find(gist => gist?.files && Object.prototype.hasOwnProperty.call(gist.files, PROGRESS_GIST_FILENAME)) || null;
  }

  async readProgressFile(gist) {
    const file = gist?.files?.[PROGRESS_GIST_FILENAME];
    if (!file) throw new GitHubServiceError('PROGRESS_FILE_MISSING', `O Gist não contém ${PROGRESS_GIST_FILENAME}.`);
    let content = file.content;
    if (file.truncated && file.raw_url) {
      const rawUrl = validatedRawGistUrl(file.raw_url);
      const response = await this.fetchImpl(rawUrl, { cache: 'no-store' });
      if (!response.ok) throw new GitHubServiceError('RAW_FILE_ERROR', `Não foi possível carregar o arquivo completo do Gist (HTTP ${response.status}).`);
      content = await response.text();
    }
    try {
      const progress = JSON.parse(content || '');
      if (progress?.schemaVersion !== 1 || progress?.courseId !== 'portugues-completo') throw new Error('schema incompatível');
      return progress;
    } catch (error) {
      throw new GitHubServiceError('INVALID_PROGRESS', 'O arquivo de progresso do Gist não contém um progress v1 válido.', { cause: error.message });
    }
  }

  async loadProgress({ gistId = null } = {}) {
    let gist = null;
    if (gistId) {
      try { gist = await this.getGist(gistId); } catch (error) {
        if (error.code !== 'NOT_FOUND') throw error;
      }
    }
    if (!gist) gist = await this.findProgressGist();
    if (!gist) return null;
    return {
      gistId: gist.id,
      gistUpdatedAt: gist.updated_at || null,
      progress: await this.readProgressFile(gist)
    };
  }

  async createProgress(progress) {
    const response = await this.request('/gists', {
      method: 'POST',
      body: {
        description: 'Progresso do curso Português Completo',
        public: false,
        files: { [PROGRESS_GIST_FILENAME]: { content: `${JSON.stringify(progress, null, 2)}\n` } }
      }
    });
    const gist = await responseJson(response);
    return { gistId: gist?.id, gistUpdatedAt: gist?.updated_at || null };
  }

  async updateProgress(gistId, progress) {
    const response = await this.request(`/gists/${encodeURIComponent(gistId)}`, {
      method: 'PATCH',
      body: { files: { [PROGRESS_GIST_FILENAME]: { content: `${JSON.stringify(progress, null, 2)}\n` } } }
    });
    const gist = await responseJson(response);
    return { gistId: gist?.id || gistId, gistUpdatedAt: gist?.updated_at || null };
  }
}

export function createGitHubService(options = {}) { return new GitHubService(options); }
