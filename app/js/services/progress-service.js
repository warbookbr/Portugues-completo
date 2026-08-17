const DEFAULT_STORAGE_KEY = 'portugues-completo:progress-cache:v1';

const LESSON_STATUS_RANK = { NAO_INICIADA: 0, EM_ESTUDO: 1, CONCLUIDA: 2 };
const EVIDENCE_STATUS_RANK = { PRATICADA: 1, VALIDACAO_PENDENTE: 2, DEMONSTRADA: 3, REVISAO_RECOMENDADA: 4 };
const COMPETENCY_STATUS_RANK = { NOVA: 0, EM_DESENVOLVIMENTO: 1, DEMONSTRADA: 2, CONSOLIDADA: 3 };

const clone = value => structuredClone(value);
const iso = clock => clock().toISOString();
const maxDate = (...values) => values.filter(Boolean).sort().at(-1) || null;
const minDate = (...values) => values.filter(Boolean).sort().at(0) || null;

function defaultSupport(support = {}) {
  return {
    hintUsed: Boolean(support.hintUsed),
    replayCount: Number.isInteger(support.replayCount) ? Math.max(0, support.replayCount) : 0,
    rereadUsed: Boolean(support.rereadUsed),
    consultationUsed: Boolean(support.consultationUsed)
  };
}

export function createEmptyProgress({ clock = () => new Date(), contentRevision = null } = {}) {
  const now = iso(clock);
  return {
    schemaVersion: 1,
    courseId: 'portugues-completo',
    curriculum: {
      current: { levelId: null, unitId: null, lessonId: null },
      lessons: {},
      verifications: {}
    },
    evidence: {},
    competencies: {},
    review: { queue: [] },
    responses: {},
    gamification: null,
    meta: { createdAt: now, updatedAt: now, contentRevision }
  };
}

export function isProgressEmpty(progress) {
  return !Object.keys(progress?.curriculum?.lessons || {}).length
    && !Object.keys(progress?.curriculum?.verifications || {}).length
    && !Object.keys(progress?.evidence || {}).length
    && !Object.keys(progress?.responses || {}).length;
}

function progressDocumentRef(documentId, activityId) {
  return `${documentId}/${activityId}`;
}

function determineEvidenceStatus(block, result) {
  const evaluation = block.activity?.evaluation || {};
  const evidence = block.activity?.evidence || {};
  if (evaluation.mode === 'RELIABLE_EVALUATOR' || result.pending) return 'VALIDACAO_PENDENTE';
  if (evaluation.mode !== 'DETERMINISTIC') return 'PRATICADA';
  if (!result.correct) return evidence.requiredForCompletion ? 'REVISAO_RECOMENDADA' : 'PRATICADA';
  if (evidence.requiredForCompletion || ['REQUIRED', 'CHECKPOINT'].includes(evidence.role)) return 'DEMONSTRADA';
  return 'PRATICADA';
}

function statusSatisfies(status, policy) {
  if (policy === 'DEMONSTRATED_REQUIRED') return status === 'DEMONSTRADA';
  if (policy === 'PENDING_ALLOWED') return status === 'DEMONSTRADA' || status === 'VALIDACAO_PENDENTE';
  if (policy === 'ATTEMPT_REQUIRED') return Boolean(status);
  return false;
}

function clusterSatisfied(progress, document, cluster) {
  const statuses = (cluster.evidenceIds || []).map(id => progress.evidence[progressDocumentRef(document.id, id)]?.status || null);
  const satisfiedCount = statuses.filter(status => statusSatisfies(status, cluster.satisfaction)).length;
  const minimum = Number.isInteger(cluster.minimumEvidence) ? cluster.minimumEvidence : (cluster.evidenceIds || []).length;
  if (satisfiedCount < minimum) return false;
  for (const group of cluster.requiredAnyOf || []) {
    const groupSatisfied = group.some(id => statusSatisfies(progress.evidence[progressDocumentRef(document.id, id)]?.status, cluster.satisfaction));
    if (!groupSatisfied) return false;
  }
  return true;
}

function clusterState(progress, document, cluster) {
  const statuses = (cluster.evidenceIds || []).map(id => progress.evidence[progressDocumentRef(document.id, id)]?.status).filter(Boolean);
  if (!statuses.length) return null;
  if (clusterSatisfied(progress, document, { ...cluster, satisfaction: 'DEMONSTRATED_REQUIRED' })) return 'DEMONSTRADA';
  if (statuses.includes('REVISAO_RECOMENDADA')) return 'REVISAO_RECOMENDADA';
  if (statuses.includes('VALIDACAO_PENDENTE')) return 'VALIDACAO_PENDENTE';
  return 'PRATICADA';
}

function recalcDocument(progress, document, now) {
  const required = (document.completion?.clusters || []).filter(cluster => cluster.required !== false);
  const complete = required.length ? required.every(cluster => clusterSatisfied(progress, document, cluster)) : false;
  if (document.kind === 'LESSON') {
    const previous = progress.curriculum.lessons[document.id] || {};
    progress.curriculum.lessons[document.id] = {
      status: complete ? 'CONCLUIDA' : 'EM_ESTUDO',
      startedAt: previous.startedAt || now,
      completedAt: complete ? (previous.completedAt || now) : null,
      lastVisitedAt: now
    };
  } else {
    const previous = progress.curriculum.verifications[document.id] || {};
    const states = {};
    for (const cluster of required) {
      const state = clusterState(progress, document, cluster);
      if (state) states[cluster.id] = state;
    }
    progress.curriculum.verifications[document.id] = {
      status: complete ? 'CONCLUIDA' : 'EM_ESTUDO',
      attemptCount: Math.max(1, previous.attemptCount || 0),
      clusterStates: states,
      lastAttemptAt: now
    };
  }
  return complete;
}

function queueReview(progress, competencyId, evidenceRef, now, priority = 'NORMAL') {
  const id = `review:${competencyId}`;
  const existing = progress.review.queue.find(item => item.id === id);
  if (existing) {
    existing.sourceEvidenceRef = evidenceRef;
    existing.priority = priority === 'HIGH' || existing.priority === 'HIGH' ? 'HIGH' : 'NORMAL';
    return;
  }
  progress.review.queue.push({
    id,
    competencyId,
    reason: 'RECENT_DIFFICULTY',
    sourceEvidenceRef: evidenceRef,
    priority,
    createdAt: now,
    lastReviewedAt: null
  });
}

function resolveReview(progress, competencyId) {
  progress.review.queue = progress.review.queue.filter(item => item.competencyId !== competencyId);
}

function updateCompetency(progress, competencyId, evidenceRef, evidenceStatus, now) {
  const previous = progress.competencies[competencyId] || {
    status: 'NOVA', evidenceRefs: [], reviewRecommended: false, updatedAt: null
  };
  const evidenceRefs = [...new Set([...previous.evidenceRefs, evidenceRef])];
  let status = previous.status;
  let reviewRecommended = previous.reviewRecommended;

  if (evidenceStatus === 'REVISAO_RECOMENDADA') {
    status = 'EM_DESENVOLVIMENTO';
    reviewRecommended = true;
    queueReview(progress, competencyId, evidenceRef, now);
  } else if (evidenceStatus === 'DEMONSTRADA') {
    const previousDemonstratedRefs = previous.evidenceRefs.filter(ref => progress.evidence[ref]?.status === 'DEMONSTRADA');
    const currentDocument = evidenceRef.split('/')[0];
    const hasOtherContext = previousDemonstratedRefs.some(ref => ref.split('/')[0] !== currentDocument);
    status = previous.status === 'CONSOLIDADA' || (previous.status === 'DEMONSTRADA' && hasOtherContext) ? 'CONSOLIDADA' : 'DEMONSTRADA';
    reviewRecommended = false;
    resolveReview(progress, competencyId);
  } else if (['PRATICADA', 'VALIDACAO_PENDENTE'].includes(evidenceStatus) && COMPETENCY_STATUS_RANK[status] < COMPETENCY_STATUS_RANK.DEMONSTRADA) {
    status = 'EM_DESENVOLVIMENTO';
  }

  progress.competencies[competencyId] = { status, evidenceRefs, reviewRecommended, updatedAt: now };
}

function responseValue(response) {
  if (response === undefined) return null;
  return clone(response);
}

function persistResponse(progress, document, block, response, now) {
  if (!block.activity?.evidence?.recordResponse || response === undefined) return;
  const ref = progressDocumentRef(document.id, block.id);
  const previous = progress.responses[ref];
  progress.responses[ref] = {
    type: block.activity.interaction,
    value: responseValue(response),
    updatedAt: now,
    revision: (previous?.revision || 0) + 1
  };
}

export class ProgressService {
  constructor({ storage = globalThis.localStorage, storageKey = DEFAULT_STORAGE_KEY, clock = () => new Date(), contentRevision = null } = {}) {
    this.storage = storage;
    this.storageKey = storageKey;
    this.clock = clock;
    this.contentRevision = contentRevision;
    this.listeners = new Set();
    this.progress = this.load();
  }

  load() {
    try {
      const value = this.storage?.getItem?.(this.storageKey);
      if (!value) return createEmptyProgress({ clock: this.clock, contentRevision: this.contentRevision });
      const parsed = JSON.parse(value);
      if (parsed?.schemaVersion !== 1 || parsed?.courseId !== 'portugues-completo') throw new Error('Progress cache incompatível.');
      return parsed;
    } catch {
      return createEmptyProgress({ clock: this.clock, contentRevision: this.contentRevision });
    }
  }

  getProgress() { return clone(this.progress); }

  replaceProgress(progress, { persist = true } = {}) {
    if (progress?.schemaVersion !== 1 || progress?.courseId !== 'portugues-completo') throw new TypeError('Progresso incompatível.');
    this.progress = clone(progress);
    if (persist) this.persist();
    this.notify();
    return this.getProgress();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const snapshot = this.getProgress();
    this.listeners.forEach(listener => listener(snapshot));
  }

  persist() {
    this.storage?.setItem?.(this.storageKey, JSON.stringify(this.progress));
  }

  touch(now) {
    this.progress.meta.updatedAt = now;
    if (this.contentRevision !== null) this.progress.meta.contentRevision = this.contentRevision;
    this.persist();
    this.notify();
  }

  visitDocument(document, { levelId = null, unitId = null } = {}) {
    this.progress.curriculum.current = {
      levelId,
      unitId,
      lessonId: document.kind === 'LESSON' ? document.id : null
    };
    const now = iso(this.clock);
    if (document.kind === 'LESSON' && this.progress.curriculum.lessons[document.id]) {
      this.progress.curriculum.lessons[document.id].lastVisitedAt = now;
    }
    this.touch(now);
    return this.getProgress();
  }

  recordActivity(document, block, result, { response, support } = {}) {
    if (!document?.id || !block?.id || block.kind !== 'ACTIVITY') throw new TypeError('Documento/atividade inválidos.');
    if (!result?.complete) return this.getProgress();
    const now = iso(this.clock);
    const ref = progressDocumentRef(document.id, block.id);
    const previous = this.progress.evidence[ref];
    const status = determineEvidenceStatus(block, result);
    const previousSupport = defaultSupport(previous?.support);
    const currentSupport = defaultSupport(support);
    this.progress.evidence[ref] = {
      status,
      attemptCount: (previous?.attemptCount || 0) + 1,
      lastAttemptAt: now,
      support: {
        hintUsed: previousSupport.hintUsed || currentSupport.hintUsed,
        replayCount: previousSupport.replayCount + currentSupport.replayCount,
        rereadUsed: previousSupport.rereadUsed || currentSupport.rereadUsed,
        consultationUsed: previousSupport.consultationUsed || currentSupport.consultationUsed
      },
      feedbackRef: previous?.feedbackRef || null
    };

    persistResponse(this.progress, document, block, response, now);
    for (const competencyId of block.activity?.evidence?.competencyIds || []) {
      updateCompetency(this.progress, competencyId, ref, status, now);
    }

    recalcDocument(this.progress, document, now);
    this.touch(now);
    return this.getProgress();
  }

  addVoluntaryReview(competencyId) {
    const now = iso(this.clock);
    const id = `review:${competencyId}`;
    if (!this.progress.review.queue.some(item => item.id === id)) {
      this.progress.review.queue.push({ id, competencyId, reason: 'VOLUNTARY', sourceEvidenceRef: null, priority: 'LOW', createdAt: now, lastReviewedAt: null });
    }
    const competency = this.progress.competencies[competencyId];
    if (competency) competency.reviewRecommended = true;
    this.touch(now);
    return this.getProgress();
  }
}

export function createProgressService(options = {}) {
  return new ProgressService(options);
}

export function mergeProgress(local, remote, base = null) {
  if (!local) return { progress: clone(remote), conflicts: [] };
  if (!remote) return { progress: clone(local), conflicts: [] };
  const merged = createEmptyProgress({ clock: () => new Date(maxDate(local.meta?.updatedAt, remote.meta?.updatedAt) || new Date().toISOString()) });
  merged.meta.createdAt = minDate(local.meta?.createdAt, remote.meta?.createdAt) || merged.meta.createdAt;
  merged.meta.updatedAt = maxDate(local.meta?.updatedAt, remote.meta?.updatedAt) || merged.meta.updatedAt;
  merged.meta.contentRevision = local.meta?.contentRevision || remote.meta?.contentRevision || null;
  merged.curriculum.current = clone((local.meta?.updatedAt || '') >= (remote.meta?.updatedAt || '') ? local.curriculum.current : remote.curriculum.current);

  for (const id of new Set([...Object.keys(local.curriculum.lessons || {}), ...Object.keys(remote.curriculum.lessons || {})])) {
    const a = local.curriculum.lessons[id]; const b = remote.curriculum.lessons[id];
    if (!a) { merged.curriculum.lessons[id] = clone(b); continue; }
    if (!b) { merged.curriculum.lessons[id] = clone(a); continue; }
    merged.curriculum.lessons[id] = {
      status: LESSON_STATUS_RANK[a.status] >= LESSON_STATUS_RANK[b.status] ? a.status : b.status,
      startedAt: minDate(a.startedAt, b.startedAt),
      completedAt: minDate(a.completedAt, b.completedAt),
      lastVisitedAt: maxDate(a.lastVisitedAt, b.lastVisitedAt)
    };
  }

  for (const id of new Set([...Object.keys(local.curriculum.verifications || {}), ...Object.keys(remote.curriculum.verifications || {})])) {
    const a = local.curriculum.verifications[id]; const b = remote.curriculum.verifications[id];
    if (!a) { merged.curriculum.verifications[id] = clone(b); continue; }
    if (!b) { merged.curriculum.verifications[id] = clone(a); continue; }
    const clusterStates = {};
    for (const key of new Set([...Object.keys(a.clusterStates || {}), ...Object.keys(b.clusterStates || {})])) {
      const av = a.clusterStates?.[key]; const bv = b.clusterStates?.[key];
      clusterStates[key] = EVIDENCE_STATUS_RANK[av] >= EVIDENCE_STATUS_RANK[bv] ? av : bv;
    }
    merged.curriculum.verifications[id] = {
      status: LESSON_STATUS_RANK[a.status] >= LESSON_STATUS_RANK[b.status] ? a.status : b.status,
      attemptCount: Math.max(a.attemptCount || 0, b.attemptCount || 0),
      clusterStates,
      lastAttemptAt: maxDate(a.lastAttemptAt, b.lastAttemptAt)
    };
  }

  for (const id of new Set([...Object.keys(local.evidence || {}), ...Object.keys(remote.evidence || {})])) {
    const a = local.evidence[id]; const b = remote.evidence[id];
    if (!a) { merged.evidence[id] = clone(b); continue; }
    if (!b) { merged.evidence[id] = clone(a); continue; }
    const newer = (a.lastAttemptAt || '') > (b.lastAttemptAt || '') ? a : (b.lastAttemptAt || '') > (a.lastAttemptAt || '') ? b : (EVIDENCE_STATUS_RANK[a.status] >= EVIDENCE_STATUS_RANK[b.status] ? a : b);
    merged.evidence[id] = clone(newer);
    merged.evidence[id].attemptCount = Math.max(a.attemptCount || 1, b.attemptCount || 1);
    merged.evidence[id].support = {
      hintUsed: Boolean(a.support?.hintUsed || b.support?.hintUsed),
      replayCount: Math.max(a.support?.replayCount || 0, b.support?.replayCount || 0),
      rereadUsed: Boolean(a.support?.rereadUsed || b.support?.rereadUsed),
      consultationUsed: Boolean(a.support?.consultationUsed || b.support?.consultationUsed)
    };
  }

  for (const id of new Set([...Object.keys(local.competencies || {}), ...Object.keys(remote.competencies || {})])) {
    const a = local.competencies[id]; const b = remote.competencies[id];
    if (!a) { merged.competencies[id] = clone(b); continue; }
    if (!b) { merged.competencies[id] = clone(a); continue; }
    const newer = (a.updatedAt || '') >= (b.updatedAt || '') ? a : b;
    merged.competencies[id] = {
      status: newer.reviewRecommended ? newer.status : (COMPETENCY_STATUS_RANK[a.status] >= COMPETENCY_STATUS_RANK[b.status] ? a.status : b.status),
      evidenceRefs: [...new Set([...(a.evidenceRefs || []), ...(b.evidenceRefs || [])])],
      reviewRecommended: newer.reviewRecommended,
      updatedAt: maxDate(a.updatedAt, b.updatedAt)
    };
  }

  const reviewById = new Map();
  for (const item of [...(remote.review?.queue || []), ...(local.review?.queue || [])]) reviewById.set(item.id, clone(item));
  merged.review.queue = [...reviewById.values()];

  const conflicts = [];
  for (const id of new Set([...Object.keys(local.responses || {}), ...Object.keys(remote.responses || {})])) {
    const a = local.responses[id]; const b = remote.responses[id]; const baseline = base?.responses?.[id];
    if (!a) { merged.responses[id] = clone(b); continue; }
    if (!b) { merged.responses[id] = clone(a); continue; }
    const same = JSON.stringify(a.value) === JSON.stringify(b.value);
    if (same) { merged.responses[id] = clone((a.revision || 0) >= (b.revision || 0) ? a : b); continue; }
    const aChanged = !baseline || JSON.stringify(a.value) !== JSON.stringify(baseline.value);
    const bChanged = !baseline || JSON.stringify(b.value) !== JSON.stringify(baseline.value);
    if (baseline && aChanged !== bChanged) {
      merged.responses[id] = clone(aChanged ? a : b);
      continue;
    }
    const preferred = (a.updatedAt || '') >= (b.updatedAt || '') ? a : b;
    const preserved = preferred === a ? b : a;
    merged.responses[id] = clone(preferred);
    const conflictKey = `${id}#conflict-${String(preserved.updatedAt || 'remote').replace(/[^0-9A-Za-z]/g, '')}`;
    merged.responses[conflictKey] = clone(preserved);
    conflicts.push({ responseRef: id, preservedAs: conflictKey });
  }

  merged.gamification = clone(local.gamification || remote.gamification || null);
  return { progress: merged, conflicts };
}
