export const T1_N0_CONTENT_REVISION = 't1-n0-entry-v2';
export const T1_N0_LEGACY_REF_PREFIX = 'legacy:t1-n0-v1:';

export class ProgressMigrationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ProgressMigrationError';
    this.code = code;
    this.details = details;
  }
}

const clone = value => structuredClone(value);
const DEMONSTRATED = 'DEMONSTRADA';
const REVIEW = 'REVISAO_RECOMENDADA';
const DEVELOPMENT = new Set(['PRATICADA', 'VALIDACAO_PENDENTE', REVIEW]);

const U1_V02_CLUSTERS = Object.freeze({
  alphabetAndForms: ['V02-Q01', 'V02-Q02'],
  letterCategories: ['V02-Q03', 'V02-Q04'],
  visualOrganization: ['V02-Q05', 'V02-Q06'],
  soundAndLetter: ['V02-Q07', 'V02-Q08', 'V02-Q09']
});

const U2_V02_CLUSTERS = Object.freeze({
  syllableAwareness: ['V02-Q01', 'V02-Q02', 'V02-Q03'],
  syllableWriting: ['V02-Q04', 'V02-Q05', 'V02-Q06', 'V02-Q07'],
  wordReadingAndMeaning: ['V02-Q08', 'V02-Q09'],
  soundWritingRelations: ['V02-Q10', 'V02-Q11'],
  speechAndWriting: ['V02-Q12']
});

function assertProgress(progress) {
  if (!progress || progress.schemaVersion !== 1 || progress.courseId !== 'portugues-completo') {
    throw new ProgressMigrationError('INVALID_PROGRESS', 'Progresso incompatível com a migração T1.9.');
  }
  if (!progress.meta || !Object.prototype.hasOwnProperty.call(progress.meta, 'contentRevision')) {
    throw new ProgressMigrationError('INVALID_PROGRESS_META', 'Progresso sem meta.contentRevision.');
  }
}

function emptySupport() {
  return { hintUsed: false, replayCount: 0, rereadUsed: false, consultationUsed: false };
}

function migrationFeedbackRef(sourceRef) {
  return `migration:${T1_N0_CONTENT_REVISION}:${sourceRef}`;
}

function legacyRef(ref) {
  return `${T1_N0_LEGACY_REF_PREFIX}${ref}`;
}

function originalRef(ref) {
  return String(ref || '').startsWith(T1_N0_LEGACY_REF_PREFIX)
    ? String(ref).slice(T1_N0_LEGACY_REF_PREFIX.length)
    : String(ref || '');
}

function evidenceRef(documentId, activityId) {
  return `${documentId}/${activityId}`;
}

function evidence(progress, ref) {
  return progress.evidence?.[ref] || null;
}

function demonstrated(progress, ref) {
  return evidence(progress, ref)?.status === DEMONSTRATED;
}

function anyEvidence(progress, refs) {
  return refs.some(ref => Boolean(evidence(progress, ref)));
}

function maxDate(...values) {
  return values.filter(Boolean).sort().at(-1) || null;
}

function minDate(...values) {
  return values.filter(Boolean).sort().at(0) || null;
}

function archiveRef(progress, ref, report) {
  const archived = legacyRef(ref);
  let changed = false;

  if (progress.evidence?.[ref]) {
    if (!progress.evidence[archived]) progress.evidence[archived] = clone(progress.evidence[ref]);
    delete progress.evidence[ref];
    report.archivedEvidenceRefs.push(ref);
    changed = true;
  }

  if (progress.responses?.[ref]) {
    if (!progress.responses[archived]) progress.responses[archived] = clone(progress.responses[ref]);
    delete progress.responses[ref];
    report.archivedResponseRefs.push(ref);
    changed = true;
  }

  if (changed) {
    for (const competency of Object.values(progress.competencies || {})) {
      if (!Array.isArray(competency.evidenceRefs)) continue;
      competency.evidenceRefs = [...new Set(competency.evidenceRefs.map(item => item === ref ? archived : item))];
    }
    for (const item of progress.review?.queue || []) {
      if (item.sourceEvidenceRef === ref) item.sourceEvidenceRef = archived;
    }
  }

  return progress.evidence?.[archived] ? archived : ref;
}

function syntheticEvidence(source, sourceRef) {
  const attemptCount = Math.max(1, source?.attemptCount || 1);
  return {
    status: DEMONSTRATED,
    attemptCount,
    lastAttemptAt: source?.lastAttemptAt || source?.completedAt || source?.lastVisitedAt || null,
    support: emptySupport(),
    feedbackRef: migrationFeedbackRef(sourceRef)
  };
}

function copyEvidence(progress, sourceRef, targetRef, report) {
  if (progress.evidence[targetRef]) return false;
  const source = progress.evidence[sourceRef];
  if (!source) return false;
  progress.evidence[targetRef] = {
    ...clone(source),
    support: { ...emptySupport(), ...(source.support || {}) },
    feedbackRef: migrationFeedbackRef(sourceRef)
  };
  report.mappedEvidenceRefs.push({ from: sourceRef, to: targetRef });
  return true;
}

function synthesizeEvidence(progress, sourceRecord, sourceLabel, targetRefs, report) {
  for (const targetRef of targetRefs) {
    if (progress.evidence[targetRef]) continue;
    progress.evidence[targetRef] = syntheticEvidence(sourceRecord, sourceLabel);
    report.syntheticEvidenceRefs.push({ from: sourceLabel, to: targetRef });
  }
}

function lessonRecordFrom(progress, targetId, sourceRecord, requiredRefs, now) {
  const current = progress.curriculum.lessons[targetId] || null;
  const complete = requiredRefs.length > 0 && requiredRefs.every(ref => demonstrated(progress, ref));
  const hasStudy = complete || anyEvidence(progress, requiredRefs) || Boolean(current) || Boolean(sourceRecord);
  if (!hasStudy) return null;
  const startedAt = minDate(current?.startedAt, sourceRecord?.startedAt, ...requiredRefs.map(ref => evidence(progress, ref)?.lastAttemptAt)) || now;
  const completedAt = complete ? (current?.completedAt || sourceRecord?.completedAt || maxDate(...requiredRefs.map(ref => evidence(progress, ref)?.lastAttemptAt)) || now) : null;
  const lastVisitedAt = maxDate(current?.lastVisitedAt, sourceRecord?.lastVisitedAt, ...requiredRefs.map(ref => evidence(progress, ref)?.lastAttemptAt)) || now;
  return { status: complete ? 'CONCLUIDA' : 'EM_ESTUDO', startedAt, completedAt, lastVisitedAt };
}

function verificationRecordFrom(progress, documentId, sourceRecord, clusters, now) {
  const current = progress.curriculum.verifications[documentId] || null;
  const clusterStates = {};
  let hasEvidence = false;
  let complete = true;

  for (const [clusterId, activityIds] of Object.entries(clusters)) {
    const refs = activityIds.map(id => evidenceRef(documentId, id));
    const records = refs.map(ref => evidence(progress, ref)).filter(Boolean);
    if (records.length) hasEvidence = true;
    const clusterComplete = refs.every(ref => demonstrated(progress, ref));
    complete = complete && clusterComplete;
    if (clusterComplete) clusterStates[clusterId] = DEMONSTRATED;
    else if (records.some(item => item.status === REVIEW)) clusterStates[clusterId] = REVIEW;
    else if (records.some(item => item.status === 'VALIDACAO_PENDENTE')) clusterStates[clusterId] = 'VALIDACAO_PENDENTE';
    else if (records.length) clusterStates[clusterId] = 'PRATICADA';
  }

  if (!hasEvidence && !current && !sourceRecord) return null;
  return {
    status: complete ? 'CONCLUIDA' : 'EM_ESTUDO',
    attemptCount: Math.max(1, current?.attemptCount || sourceRecord?.attemptCount || 1),
    clusterStates,
    lastAttemptAt: maxDate(current?.lastAttemptAt, sourceRecord?.lastAttemptAt) || now
  };
}

function competencyFromRefs(progress, competencyId, refs, now) {
  const activeRefs = refs.filter(ref => Boolean(evidence(progress, ref)));
  if (!activeRefs.length) return null;
  const statuses = activeRefs.map(ref => evidence(progress, ref).status);
  const reviewRecommended = statuses.includes(REVIEW);
  let status = 'EM_DESENVOLVIMENTO';
  if (!reviewRecommended && statuses.some(item => item === DEMONSTRATED)) status = DEMONSTRATED;
  return { status, evidenceRefs: [...new Set(activeRefs)], reviewRecommended, updatedAt: now };
}

function remapReviews(progress) {
  const mapped = [];
  for (const item of progress.review?.queue || []) {
    const next = clone(item);
    const source = originalRef(next.sourceEvidenceRef);

    if (next.competencyId === 'N0-U01-C01') next.competencyId = 'N0-U02-C11';
    if (next.competencyId === 'N0-U01-C08') next.competencyId = 'N0-U02-C10';

    if (next.competencyId === 'N0-U01-C05') {
      if (/^N0-U01-L05\/(L05-A02|L05-C02|L05-C03)$/.test(source)) next.competencyId = 'N0-U01-C09';
    }

    const sourceMap = {
      'N0-U01-L01/L01-C01': 'N0-U02-L10/L10-C01',
      'N0-U01-L01/L01-A01': 'N0-U02-L10/L10-A01',
      'N0-U01-L01/L01-C03': 'N0-U02-L10/L10-C02',
      'N0-U01-L08/L08-C01': 'N0-U02-L09/L09-C01',
      'N0-U01-L08/L08-C02': 'N0-U02-L09/L09-C02',
      'N0-U01-L08/L08-A01': 'N0-U02-L09/L09-A01',
      'N0-U01-L08/L08-C03': 'N0-U02-L09/L09-C03',
      'N0-U01-L05/L05-C02': 'N0-U01-L09/L09-C01',
      'N0-U01-L05/L05-A02': 'N0-U01-L09/L09-A01',
      'N0-U01-L05/L05-C03': 'N0-U01-L09/L09-C02'
    };
    if (sourceMap[source]) next.sourceEvidenceRef = sourceMap[source];
    next.id = `review:${next.competencyId}`;
    mapped.push(next);
  }

  const byId = new Map();
  for (const item of mapped) {
    const existing = byId.get(item.id);
    if (!existing) { byId.set(item.id, item); continue; }
    const priorityRank = { LOW: 0, NORMAL: 1, HIGH: 2 };
    if (priorityRank[item.priority] > priorityRank[existing.priority]) existing.priority = item.priority;
    existing.sourceEvidenceRef = item.sourceEvidenceRef || existing.sourceEvidenceRef;
    existing.createdAt = minDate(existing.createdAt, item.createdAt) || existing.createdAt;
    existing.lastReviewedAt = maxDate(existing.lastReviewedAt, item.lastReviewedAt);
  }
  progress.review.queue = [...byId.values()];
}

function migrateL05Split(progress, now, report) {
  const oldLesson = progress.curriculum.lessons['N0-U01-L05'] || null;
  const oldRefs = {
    a01: evidenceRef('N0-U01-L05', 'L05-A01'),
    c02: evidenceRef('N0-U01-L05', 'L05-C02'),
    a02: evidenceRef('N0-U01-L05', 'L05-A02'),
    c03: evidenceRef('N0-U01-L05', 'L05-C03')
  };
  const archived = {
    c02: archiveRef(progress, oldRefs.c02, report),
    a02: archiveRef(progress, oldRefs.a02, report),
    c03: archiveRef(progress, oldRefs.c03, report)
  };

  const newL05A02 = evidenceRef('N0-U01-L05', 'L05-A02');
  const newL05C03 = evidenceRef('N0-U01-L05', 'L05-C03');
  if (demonstrated(progress, oldRefs.a01)) {
    copyEvidence(progress, oldRefs.a01, newL05A02, report);
    copyEvidence(progress, oldRefs.a01, newL05C03, report);
  }
  if (oldLesson?.status === 'CONCLUIDA') {
    synthesizeEvidence(progress, oldLesson, 'N0-U01-L05@pre-t1', [oldRefs.a01, newL05A02, newL05C03], report);
  }

  const l05Record = lessonRecordFrom(progress, 'N0-U01-L05', oldLesson, [oldRefs.a01, newL05A02, newL05C03], now);
  if (l05Record) progress.curriculum.lessons['N0-U01-L05'] = l05Record;

  const l09Refs = {
    c01: evidenceRef('N0-U01-L09', 'L09-C01'),
    a01: evidenceRef('N0-U01-L09', 'L09-A01'),
    c02: evidenceRef('N0-U01-L09', 'L09-C02')
  };
  copyEvidence(progress, archived.c02, l09Refs.c01, report);
  copyEvidence(progress, archived.a02, l09Refs.a01, report);
  copyEvidence(progress, archived.c03, l09Refs.c02, report);
  if (oldLesson?.status === 'CONCLUIDA') {
    synthesizeEvidence(progress, oldLesson, 'N0-U01-L05@pre-t1', [l09Refs.a01, l09Refs.c02], report);
  }
  const l09Record = lessonRecordFrom(progress, 'N0-U01-L09', null, [l09Refs.a01, l09Refs.c02], now);
  if (l09Record) progress.curriculum.lessons['N0-U01-L09'] = l09Record;

  const c09 = competencyFromRefs(progress, 'N0-U01-C09', [l09Refs.a01, l09Refs.c02], now);
  if (c09) progress.competencies['N0-U01-C09'] = c09;
}

function migrateMovedLesson(progress, config, now, report) {
  const sourceRecord = progress.curriculum.lessons[config.fromLesson] || null;
  for (const mapping of config.evidence) {
    for (const targetId of mapping.to) {
      copyEvidence(progress, evidenceRef(config.fromLesson, mapping.from), evidenceRef(config.toLesson, targetId), report);
    }
  }
  if (sourceRecord?.status === 'CONCLUIDA') {
    synthesizeEvidence(
      progress,
      sourceRecord,
      `${config.fromLesson}@pre-t1`,
      config.required.map(id => evidenceRef(config.toLesson, id)),
      report
    );
  }
  const requiredRefs = config.required.map(id => evidenceRef(config.toLesson, id));
  const targetRecord = lessonRecordFrom(progress, config.toLesson, sourceRecord, requiredRefs, now);
  if (targetRecord) progress.curriculum.lessons[config.toLesson] = targetRecord;
  if (sourceRecord) delete progress.curriculum.lessons[config.fromLesson];

  if (progress.curriculum.current?.lessonId === config.fromLesson) {
    progress.curriculum.current.unitId = config.toUnit;
    progress.curriculum.current.lessonId = config.toLesson;
    report.currentRedirect = { from: config.fromLesson, to: config.toLesson };
  }
}

function migrateU1Verification(progress, now, report) {
  const oldId = 'N0-U01-V01';
  const newId = 'N0-U01-V02';
  const oldRecord = progress.curriculum.verifications[oldId] || null;
  const direct = {
    'V01-Q02': ['V02-Q07'],
    'V01-Q04': ['V02-Q02'],
    'V01-Q05': ['V02-Q03', 'V02-Q04'],
    'V01-Q06': ['V02-Q05'],
    'V01-Q07': ['V02-Q06'],
    'V01-Q08': ['V02-Q08'],
    'V01-Q09': ['V02-Q09']
  };
  for (const [from, targets] of Object.entries(direct)) {
    for (const target of targets) copyEvidence(progress, evidenceRef(oldId, from), evidenceRef(newId, target), report);
  }

  if (oldRecord?.status === 'CONCLUIDA') {
    const allTargets = Object.values(U1_V02_CLUSTERS).flat().map(id => evidenceRef(newId, id));
    synthesizeEvidence(progress, oldRecord, `${oldId}@equivalent`, allTargets, report);
  }

  const record = verificationRecordFrom(progress, newId, oldRecord, U1_V02_CLUSTERS, now);
  if (record) progress.curriculum.verifications[newId] = record;
}

function migrateU2Verification(progress, now, report) {
  const oldId = 'N0-U02-V01';
  const newId = 'N0-U02-V02';
  const oldRecord = progress.curriculum.verifications[oldId] || null;
  for (let index = 1; index <= 9; index += 1) {
    const from = `V01-Q${String(index).padStart(2, '0')}`;
    const to = `V02-Q${String(index).padStart(2, '0')}`;
    copyEvidence(progress, evidenceRef(oldId, from), evidenceRef(newId, to), report);
  }

  const variationSource = evidenceRef('N0-U01-L08', 'L08-A01');
  copyEvidence(progress, variationSource, evidenceRef(newId, 'V02-Q10'), report);
  copyEvidence(progress, variationSource, evidenceRef(newId, 'V02-Q11'), report);
  copyEvidence(progress, evidenceRef('N0-U01-V01', 'V01-Q10'), evidenceRef(newId, 'V02-Q10'), report);
  copyEvidence(progress, evidenceRef('N0-U01-V01', 'V01-Q11'), evidenceRef(newId, 'V02-Q11'), report);
  copyEvidence(progress, evidenceRef('N0-U01-L01', 'L01-A01'), evidenceRef(newId, 'V02-Q12'), report);

  const l08Complete = progress.curriculum.lessons['N0-U02-L09']?.status === 'CONCLUIDA';
  const l01Complete = progress.curriculum.lessons['N0-U02-L10']?.status === 'CONCLUIDA';
  if (oldRecord?.status === 'CONCLUIDA' && l08Complete && l01Complete) {
    const allTargets = Object.values(U2_V02_CLUSTERS).flat().map(id => evidenceRef(newId, id));
    synthesizeEvidence(progress, oldRecord, 'N0-U02-V01+U1-L08+U1-L01@equivalent', allTargets, report);
  }

  const record = verificationRecordFrom(progress, newId, oldRecord, U2_V02_CLUSTERS, now);
  if (record) progress.curriculum.verifications[newId] = record;
}

function rebuildMovedCompetencies(progress, now) {
  const c10Refs = [
    evidenceRef('N0-U02-L09', 'L09-A01'),
    evidenceRef('N0-U02-L09', 'L09-A02'),
    evidenceRef('N0-U02-L09', 'L09-C03'),
    evidenceRef('N0-U02-V02', 'V02-Q10'),
    evidenceRef('N0-U02-V02', 'V02-Q11')
  ];
  const c11Refs = [
    evidenceRef('N0-U02-L10', 'L10-A01'),
    evidenceRef('N0-U02-L10', 'L10-C01'),
    evidenceRef('N0-U02-L10', 'L10-C02'),
    evidenceRef('N0-U02-V02', 'V02-Q12')
  ];

  const c10 = competencyFromRefs(progress, 'N0-U02-C10', c10Refs, now);
  const c11 = competencyFromRefs(progress, 'N0-U02-C11', c11Refs, now);
  if (c10) progress.competencies['N0-U02-C10'] = c10;
  if (c11) progress.competencies['N0-U02-C11'] = c11;
  delete progress.competencies['N0-U01-C08'];
  delete progress.competencies['N0-U01-C01'];
}

export function migrateProgressToT1N0(progress, { now = new Date().toISOString() } = {}) {
  assertProgress(progress);
  if (progress.meta.contentRevision === T1_N0_CONTENT_REVISION) {
    return { progress: clone(progress), changed: false, report: { fromRevision: T1_N0_CONTENT_REVISION, toRevision: T1_N0_CONTENT_REVISION, alreadyApplied: true } };
  }
  if (progress.meta.contentRevision !== null) {
    throw new ProgressMigrationError(
      'UNSUPPORTED_CONTENT_REVISION',
      `Revisão de conteúdo não suportada pela migração T1.9: ${progress.meta.contentRevision}`,
      { contentRevision: progress.meta.contentRevision }
    );
  }

  const next = clone(progress);
  const report = {
    fromRevision: progress.meta.contentRevision,
    toRevision: T1_N0_CONTENT_REVISION,
    archivedEvidenceRefs: [],
    archivedResponseRefs: [],
    mappedEvidenceRefs: [],
    syntheticEvidenceRefs: [],
    currentRedirect: null
  };

  migrateL05Split(next, now, report);

  migrateMovedLesson(next, {
    fromLesson: 'N0-U01-L01',
    toLesson: 'N0-U02-L10',
    toUnit: 'N0-U02',
    evidence: [
      { from: 'L01-C01', to: ['L10-C01'] },
      { from: 'L01-A01', to: ['L10-A01', 'L10-C01'] },
      { from: 'L01-C03', to: ['L10-C02'] }
    ],
    required: ['L10-A01', 'L10-C01', 'L10-C02']
  }, now, report);

  migrateMovedLesson(next, {
    fromLesson: 'N0-U01-L08',
    toLesson: 'N0-U02-L09',
    toUnit: 'N0-U02',
    evidence: [
      { from: 'L08-C01', to: ['L09-C01'] },
      { from: 'L08-C02', to: ['L09-C02'] },
      { from: 'L08-A01', to: ['L09-A01', 'L09-A02'] },
      { from: 'L08-C03', to: ['L09-C03'] }
    ],
    required: ['L09-A01', 'L09-A02', 'L09-C03']
  }, now, report);

  migrateU1Verification(next, now, report);
  migrateU2Verification(next, now, report);
  rebuildMovedCompetencies(next, now);
  remapReviews(next);

  next.meta.contentRevision = T1_N0_CONTENT_REVISION;
  next.meta.updatedAt = now;

  return { progress: next, changed: true, report };
}
