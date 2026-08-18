import { normalizeAuthoredContentV1 } from './content-normalizer-v1.js';
import { normalizeStudentPresentationV1 } from './content-presentation-normalizer-v1.js';

function joinUrl(basePath, relativePath) {
  const base = String(basePath || '').replace(/\/+$/, '');
  const relative = String(relativePath || '').replace(/^\/+/, '');
  return `${base}/${relative}`;
}

function relativeDirname(relativePath) {
  const normalized = String(relativePath || '').replace(/^\/+|\/+$/g, '');
  const parts = normalized.split('/');
  parts.pop();
  return parts.join('/');
}

function joinRelative(basePath, relativePath) {
  const base = String(basePath || '').replace(/^\/+|\/+$/g, '');
  const relative = String(relativePath || '').replace(/^\/+/, '');
  return base ? `${base}/${relative}` : relative;
}

export class ContentCatalogError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ContentCatalogError';
    this.code = code;
    this.details = details;
  }
}

export class ContentService {
  constructor({ basePath = './content', fetchImpl = globalThis.fetch } = {}) {
    if (typeof fetchImpl !== 'function') throw new TypeError('ContentService exige uma função fetch.');
    this.basePath = basePath;
    this.fetchImpl = fetchImpl.bind(globalThis);
  }

  async loadJson(relativePath) {
    const url = joinUrl(this.basePath, relativePath);
    const response = await this.fetchImpl(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Falha ao carregar ${url}: HTTP ${response.status}`);
    return response.json();
  }

  async loadCatalog() {
    const catalog = await this.loadJson('course.json');
    if (catalog?.schemaVersion !== 2 || !Array.isArray(catalog.units)) {
      throw new ContentCatalogError('INVALID_CATALOG', 'content/course.json não é um catálogo v2 válido para descoberta.', { schemaVersion: catalog?.schemaVersion });
    }
    return catalog;
  }

  findUnitRef(catalog, unitId) {
    const unitRef = catalog?.units?.find(unit => unit.id === unitId);
    if (!unitRef) throw new ContentCatalogError('UNIT_NOT_FOUND', `Unidade ${unitId} não está publicada no catálogo.`, { unitId });
    return unitRef;
  }

  async loadUnitManifest(unitId, { catalog = null } = {}) {
    const activeCatalog = catalog || await this.loadCatalog();
    const unitRef = this.findUnitRef(activeCatalog, unitId);
    const manifest = await this.loadJson(unitRef.manifest);
    if (manifest?.id !== unitRef.id || manifest?.levelId !== unitRef.levelId) {
      throw new ContentCatalogError('MANIFEST_IDENTITY_MISMATCH', `Manifesto de ${unitId} diverge da referência do catálogo.`, { unitRef, manifestId: manifest?.id, manifestLevelId: manifest?.levelId });
    }
    return { catalog: activeCatalog, unitRef, manifest, manifestPath: unitRef.manifest };
  }

  resolveManifestAsset(manifestPath, assetPath) {
    return joinRelative(relativeDirname(manifestPath), assetPath);
  }

  normalize(source, context = {}) {
    const runtime = normalizeAuthoredContentV1(source, context);
    return normalizeStudentPresentationV1(source, runtime);
  }

  async loadNormalized(relativePath, context = {}) {
    const source = await this.loadJson(relativePath);
    return this.normalize(source, context);
  }

  async loadLesson(unitId, lessonId) {
    const unit = await this.loadUnitManifest(unitId);
    const lessonRef = unit.manifest.lessons?.find(lesson => lesson.id === lessonId);
    if (!lessonRef) throw new ContentCatalogError('LESSON_NOT_FOUND', `Lição ${lessonId} não está no manifesto de ${unitId}.`, { unitId, lessonId });
    const sourcePath = this.resolveManifestAsset(unit.manifestPath, lessonRef.path);
    const runtime = await this.loadNormalized(sourcePath, { competencyIds: lessonRef.competencyIds || [] });
    return { ...unit, lessonRef, sourcePath, runtime };
  }

  async loadVerification(unitId) {
    const unit = await this.loadUnitManifest(unitId);
    const verificationRef = unit.manifest.verification;
    if (!verificationRef) throw new ContentCatalogError('VERIFICATION_NOT_FOUND', `Unidade ${unitId} não declara verificação.`, { unitId });
    const sourcePath = this.resolveManifestAsset(unit.manifestPath, verificationRef.path);
    const runtime = await this.loadNormalized(sourcePath, { competencyIds: verificationRef.competencyIds || [] });
    return { ...unit, verificationRef, sourcePath, runtime };
  }
}

export function createContentService(options = {}) {
  return new ContentService(options);
}
