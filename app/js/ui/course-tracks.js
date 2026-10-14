import { levelLabel } from './classic-ui-copy.js';

// R1.8: a alfabetização inicial é uma trilha separada e opcional. O caminho principal
// começa em "Palavras, frases e sentido". A trilha é declarada no catálogo (`tracks` +
// `trackId` por unidade) e os IDs históricos das unidades são preservados.
export const LITERACY_TRACK_ID = 'alfabetizacao';

export function annotateManifest(catalog, manifest) {
  if (!manifest) return manifest;
  const units = Array.isArray(catalog?.units) ? catalog.units : [];
  const ref = units.find(unit => unit.id === manifest.id);
  const trackId = ref?.trackId || null;
  const track = (Array.isArray(catalog?.tracks) ? catalog.tracks : []).find(item => item.id === trackId);
  const levelId = ref?.levelId ?? manifest.levelId;
  const order = ref?.order ?? manifest.order;
  let displayOrder = order;
  if (trackId) {
    // Dentro de uma trilha, a numeração é a posição na própria trilha.
    const siblings = units.filter(unit => unit.trackId === trackId).sort((a, b) => a.order - b.order);
    displayOrder = siblings.findIndex(unit => unit.id === manifest.id) + 1;
  } else {
    // No caminho principal, descontam-se apenas as unidades do mesmo nível que saíram para uma trilha.
    displayOrder = order - units.filter(unit => unit.trackId && unit.levelId === levelId && unit.order < order).length;
  }
  return {
    ...manifest,
    trackId,
    trackTitle: track?.title || null,
    displayOrder
  };
}

export function annotateManifests(catalog, manifests = []) {
  return manifests.map(manifest => annotateManifest(catalog, manifest));
}

export function isLiteracyUnit(manifest) {
  return manifest?.trackId === LITERACY_TRACK_ID;
}

export function mainPath(manifests = []) {
  return manifests.filter(manifest => !isLiteracyUnit(manifest));
}

export function literacyTrack(manifests = []) {
  return manifests.filter(isLiteracyUnit);
}

export function unitLabel(manifest) {
  const prefix = manifest?.trackTitle || levelLabel(manifest?.levelId);
  return `${prefix} · Unidade ${manifest?.displayOrder ?? manifest?.order}`;
}

export function hasStartedAny(progress, manifests = []) {
  const currentUnitId = progress?.curriculum?.current?.unitId;
  return manifests.some(manifest => manifest.id === currentUnitId
    || manifest.lessons.some(lesson => progress?.curriculum?.lessons?.[lesson.id]));
}

// Unidades que contam para o aluno: o caminho principal e, se ele usa a trilha, a trilha.
export function studentPath(manifests = [], progress = {}) {
  const literacy = literacyTrack(manifests);
  const main = mainPath(manifests);
  return hasStartedAny(progress, literacy) ? [...literacy, ...main] : main;
}
