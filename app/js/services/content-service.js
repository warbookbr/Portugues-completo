import { normalizeAuthoredContentV1 } from './content-normalizer-v1.js';

function joinUrl(basePath, relativePath) {
  const base = String(basePath || '').replace(/\/+$/, '');
  const relative = String(relativePath || '').replace(/^\/+/, '');
  return `${base}/${relative}`;
}

export class ContentService {
  constructor({ basePath = './content', fetchImpl = globalThis.fetch } = {}) {
    if (typeof fetchImpl !== 'function') throw new TypeError('ContentService exige uma função fetch.');
    this.basePath = basePath;
    this.fetchImpl = fetchImpl;
  }

  async loadJson(relativePath) {
    const url = joinUrl(this.basePath, relativePath);
    const response = await this.fetchImpl(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Falha ao carregar ${url}: HTTP ${response.status}`);
    return response.json();
  }

  normalize(source, context = {}) {
    return normalizeAuthoredContentV1(source, context);
  }

  async loadNormalized(relativePath, context = {}) {
    const source = await this.loadJson(relativePath);
    return this.normalize(source, context);
  }
}

export function createContentService(options = {}) {
  return new ContentService(options);
}
