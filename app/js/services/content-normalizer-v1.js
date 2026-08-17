import {
  INTERACTION_BY_LEGACY_INTERACTION_V1,
  INTERACTION_BY_PEDAGOGICAL_TYPE_V1,
  LEGACY_COMPLETION_RULES_V1
} from './content-normalization-rules-v1.js';

export class ContentNormalizationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ContentNormalizationError';
    this.code = code;
    this.details = details;
  }
}

const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

function ensureV1(source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    throw new ContentNormalizationError('INVALID_SOURCE', 'Conteúdo autoral deve ser um objeto JSON.');
  }
  if (source.schemaVersion !== 1) {
    throw new ContentNormalizationError('UNSUPPORTED_SCHEMA_VERSION', `schemaVersion autoral não suportada: ${source.schemaVersion}`, { id: source.id, schemaVersion: source.schemaVersion });
  }
  if (!source.id || !source.title || !source.objective) {
    throw new ContentNormalizationError('MISSING_IDENTITY', 'Conteúdo autoral sem id, title ou objective.', { id: source.id });
  }
}

function normalizeInteraction(block) {
  const fromInteraction = INTERACTION_BY_LEGACY_INTERACTION_V1[block.interaction];
  if (fromInteraction) return fromInteraction;
  const fromType = INTERACTION_BY_PEDAGOGICAL_TYPE_V1[block.type];
  if (fromType) return fromType;
  if (block.correctSequence) return 'SEQUENCE';
  if (Array.isArray(block.categories) && Array.isArray(block.items)) return 'CLASSIFY';
  if (Array.isArray(block.options)) return 'SINGLE_CHOICE';
  if (block.recordResponse === true) return 'LONG_TEXT';
  throw new ContentNormalizationError('UNSUPPORTED_INTERACTION', `Não foi possível normalizar a interação de ${block.id || block.type}.`, { id: block.id, pedagogicalType: block.type, interaction: block.interaction });
}

function hasDeterministicKey(block) {
  return block.automaticValidation === true ||
    Object.prototype.hasOwnProperty.call(block, 'correct') ||
    Object.prototype.hasOwnProperty.call(block, 'correctIndex') ||
    Object.prototype.hasOwnProperty.call(block, 'correctSequence') ||
    Object.prototype.hasOwnProperty.call(block, 'auditoryCorrect') ||
    Object.prototype.hasOwnProperty.call(block, 'relationCorrectIndex') ||
    (Array.isArray(block.items) && block.items.some(item => item && typeof item === 'object' && (Object.prototype.hasOwnProperty.call(item, 'correct') || Object.prototype.hasOwnProperty.call(item, 'expected'))));
}

function normalizeEvaluationMode(block) {
  if (block.automaticValidation === false) return 'RELIABLE_EVALUATOR';
  if (hasDeterministicKey(block)) return 'DETERMINISTIC';
  if (block.recordResponse === true) return 'RELIABLE_EVALUATOR';
  return 'NONE';
}

function normalizeAnswerKey(block) {
  const answerKey = {};
  for (const key of ['correct', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex']) {
    if (Object.prototype.hasOwnProperty.call(block, key)) answerKey[key] = clone(block[key]);
  }
  if (Array.isArray(block.items)) {
    const itemAnswers = {};
    block.items.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      const key = item.id || String(index);
      if (Object.prototype.hasOwnProperty.call(item, 'correct')) itemAnswers[key] = clone(item.correct);
      else if (Object.prototype.hasOwnProperty.call(item, 'expected')) itemAnswers[key] = clone(item.expected);
    });
    if (Object.keys(itemAnswers).length) answerKey.items = itemAnswers;
  }
  return Object.keys(answerKey).length ? answerKey : undefined;
}

function stimulusFromObject(stimulus) {
  if (!stimulus || typeof stimulus !== 'object' || Array.isArray(stimulus)) return null;
  const type = String(stimulus.type || stimulus.mode || '').toLowerCase();
  if (type === 'tts') return { type: 'TTS', payload: { text: stimulus.text ?? stimulus.content ?? '' } };
  if (type === 'visible-text' || type === 'text') return { type: 'SEMANTIC_UI', payload: { visibleText: stimulus.text ?? stimulus.content ?? '' } };
  return { type: 'DATA_SET', payload: clone(stimulus) };
}

function stimulusFromPrimitive(stimulus, itemId = null) {
  if (typeof stimulus !== 'string') return null;
  if (stimulus.includes('AUD-')) return { type: 'CONTROLLED_AUDIO', mediaId: stimulus, ...(itemId ? { payload: { itemId } } : {}) };
  return { type: 'TEXT', payload: { content: stimulus, ...(itemId ? { itemId } : {}) } };
}

function normalizeStimuli(block) {
  const stimuli = [];
  if (block.stimulus && typeof block.stimulus === 'object') {
    const normalized = stimulusFromObject(block.stimulus);
    if (normalized) stimuli.push(normalized);
  } else if (typeof block.stimulus === 'string') {
    const normalized = stimulusFromPrimitive(block.stimulus);
    if (normalized) stimuli.push(normalized);
  }
  if (Array.isArray(block.stimuli)) {
    for (const stimulus of block.stimuli) {
      const normalized = typeof stimulus === 'string' ? stimulusFromPrimitive(stimulus) : stimulusFromObject(stimulus);
      if (normalized) stimuli.push(normalized);
    }
  }
  if (Array.isArray(block.items)) {
    for (const item of block.items) {
      if (!item || typeof item !== 'object') continue;
      if (Array.isArray(item.stimuli)) {
        for (const nestedStimulus of item.stimuli) {
          const normalized = typeof nestedStimulus === 'string'
            ? stimulusFromPrimitive(nestedStimulus, item.id || null)
            : stimulusFromObject(nestedStimulus);
          if (normalized) {
            if (typeof nestedStimulus !== 'string') normalized.payload = { ...(normalized.payload || {}), itemId: item.id || null };
            stimuli.push(normalized);
          }
        }
      }
      if (!item.stimulus) continue;
      const normalized = typeof item.stimulus === 'object'
        ? stimulusFromObject(item.stimulus)
        : { type: 'SEMANTIC_UI', payload: { content: item.stimulus } };
      if (normalized) {
        normalized.payload = { ...(normalized.payload || {}), itemId: item.id || null };
        stimuli.push(normalized);
      }
    }
  }
  if (block.source && typeof block.source === 'string') stimuli.push({ type: 'DATA_SET', payload: { source: block.source } });
  if (block.model !== undefined && !stimuli.some(item => item.type === 'SEMANTIC_UI')) stimuli.push({ type: 'SEMANTIC_UI', payload: { model: clone(block.model) } });
  return stimuli;
}

function activityIdsByCluster(completion) {
  const map = new Map();
  for (const cluster of completion.clusters) for (const evidenceId of cluster.evidenceIds) map.set(evidenceId, cluster.id);
  return map;
}

function normalizeStructuralCompletion(source, activitySources) {
  const legacy = LEGACY_COMPLETION_RULES_V1[source.id];
  if (legacy) {
    return {
      completion: { clusters: clone(legacy.clusters), nonCompensable: Boolean(legacy.nonCompensable) },
      activityPolicies: clone(legacy.activityPolicies || {})
    };
  }
  const authored = source.completionEvidence;
  if (!authored || !authored.clusters || typeof authored.clusters !== 'object') {
    throw new ContentNormalizationError('UNNORMALIZABLE_COMPLETION', `A regra de conclusão de ${source.id} não possui estrutura normalizável nem regra legada explícita.`, { id: source.id });
  }
  const reliableEvaluatorDeclared = Array.isArray(authored.requiresReliableEvaluatorFor) && authored.requiresReliableEvaluatorFor.length > 0;
  const activityById = new Map(activitySources.map(activity => [activity.id, activity]));
  const clusters = Object.entries(authored.clusters).map(([id, cluster]) => {
    const evidenceIds = Array.isArray(cluster.evidence) ? cluster.evidence : [];
    if (!evidenceIds.length) throw new ContentNormalizationError('EMPTY_COMPLETION_CLUSTER', `Cluster ${id} de ${source.id} não possui evidências.`, { id, sourceId: source.id });
    const containsOpenEvidence = evidenceIds.some(evidenceId => {
      const activity = activityById.get(evidenceId);
      return activity && (activity.recordResponse === true || activity.automaticValidation === false || typeof activity.automaticValidation === 'string');
    });
    return {
      id,
      required: cluster.required !== false,
      evidenceIds: clone(evidenceIds),
      satisfaction: reliableEvaluatorDeclared && containsOpenEvidence ? 'PENDING_ALLOWED' : 'DEMONSTRATED_REQUIRED'
    };
  });
  return {
    completion: {
      clusters,
      nonCompensable: authored.nonCompensable === true || (Array.isArray(authored.nonCompensable) && authored.nonCompensable.length > 0)
    },
    activityPolicies: {}
  };
}

function normalizeContentPayload(block) {
  const payload = clone(block);
  for (const key of ['id', 'type', 'focus', 'interaction', 'automaticValidation', 'recordResponse', 'correct', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex', 'stimulus', 'stimuli']) delete payload[key];
  return payload;
}

function normalizeActivity(block, context) {
  const { completion, activityPolicies, documentCompetencyIds, parentKind } = context;
  const clusterByActivity = activityIdsByCluster(completion);
  const required = clusterByActivity.has(block.id);
  const evaluationMode = normalizeEvaluationMode(block);
  const answerKey = normalizeAnswerKey(block);
  const policy = activityPolicies[block.id] || {};
  const evaluation = {
    mode: evaluationMode,
    feedbackTiming: parentKind === 'LESSON' ? (block.type === 'quick-check' || String(block.feedbackRule || '').toLowerCase().includes('imediat') ? 'IMMEDIATE' : 'AFTER_ACTIVITY') : 'AFTER_VERIFICATION',
    allowRetry: true,
    penalizeSupport: false,
    criteria: [],
    threshold: Object.prototype.hasOwnProperty.call(policy, 'threshold') ? policy.threshold : null
  };
  if (answerKey) evaluation.answerKey = answerKey;
  const role = parentKind === 'LESSON'
    ? (required ? (block.recordResponse === true ? 'PRODUCTION' : 'EVIDENCE') : (block.type === 'quick-check' ? 'CHECK' : 'PRACTICE'))
    : (block.recordResponse === true ? 'PRODUCTION' : 'VERIFICATION');
  return {
    id: block.id,
    kind: 'ACTIVITY',
    pedagogicalType: block.type || 'legacy-activity',
    ...(block.focus ? { focus: block.focus } : {}),
    content: normalizeContentPayload(block),
    activity: {
      role,
      interaction: normalizeInteraction(block),
      evaluation,
      evidence: {
        role: required ? (parentKind === 'LESSON' ? 'REQUIRED' : 'CHECKPOINT') : 'PRACTICE',
        competencyIds: clone(documentCompetencyIds),
        clusterId: clusterByActivity.get(block.id) || null,
        recordResponse: block.recordResponse === true,
        requiredForCompletion: required
      },
      stimuli: normalizeStimuli(block)
    }
  };
}

function isLessonActivity(block, requiredIds) {
  if (!block || typeof block !== 'object') return false;
  if (requiredIds.has(block.id)) return true;
  if (block.interaction || block.recordResponse !== undefined || block.automaticValidation !== undefined) return true;
  if (Object.prototype.hasOwnProperty.call(block, 'correct') || Object.prototype.hasOwnProperty.call(block, 'correctIndex')) return true;
  return false;
}

function normalizeLessonBlock(block, context, requiredIds) {
  if (isLessonActivity(block, requiredIds)) return normalizeActivity(block, context);
  return {
    id: block.id,
    kind: 'CONTENT',
    pedagogicalType: block.type || 'content',
    ...(block.focus ? { focus: block.focus } : {}),
    content: normalizeContentPayload(block)
  };
}

function competencyIdsFromContext(context) {
  if (Array.isArray(context.competencyIds)) return clone(context.competencyIds);
  if (Array.isArray(context.competencies)) return context.competencies.map(item => typeof item === 'string' ? item : item.id).filter(Boolean);
  return [];
}

export function normalizeLessonV1(source, context = {}) {
  ensureV1(source);
  const sequence = Array.isArray(source.sequence) ? source.sequence : [];
  const { completion, activityPolicies } = normalizeStructuralCompletion(source, sequence);
  const requiredIds = new Set(completion.clusters.flatMap(cluster => cluster.evidenceIds));
  const documentCompetencyIds = competencyIdsFromContext(context);
  const blockContext = { completion, activityPolicies, documentCompetencyIds, parentKind: 'LESSON' };
  return {
    schemaVersion: 1,
    id: source.id,
    kind: 'LESSON',
    title: source.title,
    objective: source.objective,
    competencyIds: documentCompetencyIds,
    prerequisites: clone(source.prerequisites || []),
    limits: clone(source.limits || []),
    blocks: sequence.map(block => normalizeLessonBlock(block, blockContext, requiredIds)),
    completion
  };
}

function verificationActivities(source) {
  if (Array.isArray(source.tasks)) return source.tasks;
  if (Array.isArray(source.items)) return source.items;
  throw new ContentNormalizationError('MISSING_VERIFICATION_ACTIVITIES', `Verificação ${source.id} não possui tasks/items.`, { id: source.id });
}

export function normalizeVerificationV1(source, context = {}) {
  ensureV1(source);
  const activities = verificationActivities(source);
  const { completion, activityPolicies } = normalizeStructuralCompletion(source, activities);
  const documentCompetencyIds = competencyIdsFromContext(context);
  const blockContext = { completion, activityPolicies, documentCompetencyIds, parentKind: 'VERIFICATION' };
  return {
    schemaVersion: 1,
    id: source.id,
    kind: source.type === 'level-exit-verification' || source.id.includes('-EXIT-') ? 'LEVEL_VERIFICATION' : 'UNIT_VERIFICATION',
    title: source.title,
    objective: source.objective,
    competencyIds: documentCompetencyIds,
    prerequisites: clone(source.prerequisites || []),
    blocks: activities.map(block => normalizeActivity(block, blockContext)),
    completion
  };
}

export function normalizeAuthoredContentV1(source, context = {}) {
  ensureV1(source);
  if (source.type === 'integrated-unit-verification' || source.type === 'level-exit-verification' || source.id.includes('-EXIT-')) return normalizeVerificationV1(source, context);
  if (Array.isArray(source.sequence)) return normalizeLessonV1(source, context);
  throw new ContentNormalizationError('UNSUPPORTED_CONTENT_KIND', `Formato autoral v1 não reconhecido para ${source.id}.`, { id: source.id, type: source.type });
}
