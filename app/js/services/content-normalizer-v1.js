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

function materializeLegacyActivity(block, sourceDocument) {
  if (!sourceDocument || !block?.id) return block;

  if (block.id === 'L03-A01' && Array.isArray(sourceDocument.letterSet)) {
    const letters = sourceDocument.letterSet.filter(item => item?.letter && item?.mediaId);
    return {
      ...clone(block),
      interaction: 'classify',
      categories: letters.map(item => item.letter),
      items: letters.map((item, index) => ({
        id: `letter-${String(index + 1).padStart(2, '0')}`,
        displayLabel: `Áudio ${index + 1}`,
        stimulus: item.mediaId,
        correct: item.letter
      }))
    };
  }

  if (block.id === 'L04-A02' && Array.isArray(sourceDocument.letterPairs)) {
    const pairs = sourceDocument.letterPairs.filter(item => item?.upper && item?.lower);
    return {
      ...clone(block),
      interaction: 'classify',
      categories: pairs.map(item => item.lower),
      items: pairs.map((item, index) => ({
        id: `pair-${String(index + 1).padStart(2, '0')}`,
        stimulus: item.upper,
        correct: item.lower
      }))
    };
  }

  if (block.id === 'L05-A01' && sourceDocument.classification) {
    const vowels = Array.isArray(sourceDocument.classification.vowels) ? sourceDocument.classification.vowels : [];
    const consonants = Array.isArray(sourceDocument.classification.consonants) ? sourceDocument.classification.consonants : [];
    const items = [
      ...vowels.map((letter, index) => ({ id: `vowel-${index + 1}`, stimulus: letter, correct: 'vogal' })),
      ...consonants.map((letter, index) => ({ id: `consonant-${index + 1}`, stimulus: letter, correct: 'consoante' }))
    ];
    return { ...clone(block), interaction: 'classify', categories: ['vogal', 'consoante'], items };
  }

  return block;
}

function normalizeInteraction(block) {
  if (block.interaction === 'audio-to-letter' && Array.isArray(block.options)) return 'SINGLE_CHOICE';
  if (block.interaction === 'initial-sound-to-letter' && Array.isArray(block.items)) return 'COMPOSITE';

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

function collectionHasAnswer(collection) {
  return Array.isArray(collection) && collection.some(item => item && typeof item === 'object' && [
    'correct', 'expected', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex'
  ].some(key => Object.prototype.hasOwnProperty.call(item, key)));
}

function hasDeterministicKey(block) {
  return block.automaticValidation === true ||
    ['correct', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex'].some(key => Object.prototype.hasOwnProperty.call(block, key)) ||
    collectionHasAnswer(block.items) || collectionHasAnswer(block.rounds);
}

function normalizeEvaluationMode(block) {
  if (block.automaticValidation === false) return 'RELIABLE_EVALUATOR';
  if (hasDeterministicKey(block)) return 'DETERMINISTIC';
  if (block.recordResponse === true) return 'RELIABLE_EVALUATOR';
  return 'NONE';
}

function answerFromEntry(entry) {
  const keys = ['correct', 'expected', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex'];
  const present = keys.filter(key => Object.prototype.hasOwnProperty.call(entry, key));
  if (!present.length) return undefined;
  if (present.length === 1 && (present[0] === 'correct' || present[0] === 'expected')) return clone(entry[present[0]]);
  const answer = {};
  for (const key of present) answer[key] = clone(entry[key]);
  return answer;
}

function normalizeAnswerKey(block) {
  const answerKey = {};
  for (const key of ['correct', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex']) {
    if (Object.prototype.hasOwnProperty.call(block, key)) answerKey[key] = clone(block[key]);
  }

  const itemAnswers = {};
  for (const collection of [block.items, block.rounds]) {
    if (!Array.isArray(collection)) continue;
    collection.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      const answer = answerFromEntry(item);
      if (answer === undefined) return;
      const key = item.id || String(index);
      itemAnswers[key] = answer;
    });
  }
  if (Object.keys(itemAnswers).length) answerKey.items = itemAnswers;
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

function appendEntryStimuli(stimuli, entries) {
  if (!Array.isArray(entries)) return;
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    const itemId = entry.id || null;
    if (Array.isArray(entry.stimuli)) {
      for (const nestedStimulus of entry.stimuli) {
        const normalized = typeof nestedStimulus === 'string'
          ? stimulusFromPrimitive(nestedStimulus, itemId)
          : stimulusFromObject(nestedStimulus);
        if (normalized) {
          if (typeof nestedStimulus !== 'string') normalized.payload = { ...(normalized.payload || {}), itemId };
          stimuli.push(normalized);
        }
      }
    }
    if (!entry.stimulus) continue;
    const normalized = typeof entry.stimulus === 'object'
      ? stimulusFromObject(entry.stimulus)
      : stimulusFromPrimitive(entry.stimulus, itemId);
    if (normalized) {
      normalized.payload = { ...(normalized.payload || {}), itemId };
      stimuli.push(normalized);
    }
  }
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
  appendEntryStimuli(stimuli, block.items);
  appendEntryStimuli(stimuli, block.rounds);
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

const PRESENTATION_SECRET_KEYS = new Set(['correct', 'expected', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex']);

function sanitizePresentation(value) {
  if (Array.isArray(value)) return value.map(sanitizePresentation);
  if (!value || typeof value !== 'object') return clone(value);
  const result = {};
  for (const [key, item] of Object.entries(value)) {
    if (PRESENTATION_SECRET_KEYS.has(key)) continue;
    result[key] = sanitizePresentation(item);
  }
  return result;
}

function normalizeContentPayload(block) {
  const payload = sanitizePresentation(block);
  for (const key of ['id', 'type', 'focus', 'interaction', 'automaticValidation', 'recordResponse', 'stimulus', 'stimuli']) delete payload[key];
  return payload;
}

function normalizeActivity(block, context) {
  const normalizedBlock = materializeLegacyActivity(block, context.sourceDocument);
  const { completion, activityPolicies, documentCompetencyIds, parentKind } = context;
  const clusterByActivity = activityIdsByCluster(completion);
  const required = clusterByActivity.has(normalizedBlock.id);
  const evaluationMode = normalizeEvaluationMode(normalizedBlock);
  const answerKey = normalizeAnswerKey(normalizedBlock);
  const policy = activityPolicies[normalizedBlock.id] || {};
  const evaluation = {
    mode: evaluationMode,
    feedbackTiming: parentKind === 'LESSON' ? (normalizedBlock.type === 'quick-check' || String(normalizedBlock.feedbackRule || '').toLowerCase().includes('imediat') ? 'IMMEDIATE' : 'AFTER_ACTIVITY') : 'AFTER_VERIFICATION',
    allowRetry: true,
    penalizeSupport: false,
    criteria: [],
    threshold: Object.prototype.hasOwnProperty.call(policy, 'threshold') ? policy.threshold : null
  };
  if (answerKey) evaluation.answerKey = answerKey;
  const role = parentKind === 'LESSON'
    ? (required ? (normalizedBlock.recordResponse === true ? 'PRODUCTION' : 'EVIDENCE') : (normalizedBlock.type === 'quick-check' ? 'CHECK' : 'PRACTICE'))
    : (normalizedBlock.recordResponse === true ? 'PRODUCTION' : 'VERIFICATION');
  return {
    id: normalizedBlock.id,
    kind: 'ACTIVITY',
    pedagogicalType: normalizedBlock.type || 'legacy-activity',
    ...(normalizedBlock.focus ? { focus: normalizedBlock.focus } : {}),
    content: normalizeContentPayload(normalizedBlock),
    activity: {
      role,
      interaction: normalizeInteraction(normalizedBlock),
      evaluation,
      evidence: {
        role: required ? (parentKind === 'LESSON' ? 'REQUIRED' : 'CHECKPOINT') : 'PRACTICE',
        competencyIds: clone(documentCompetencyIds),
        clusterId: clusterByActivity.get(normalizedBlock.id) || null,
        recordResponse: normalizedBlock.recordResponse === true,
        requiredForCompletion: required
      },
      stimuli: normalizeStimuli(normalizedBlock)
    }
  };
}

function recognizedInteraction(block) {
  if (!block?.interaction) return false;
  if (INTERACTION_BY_LEGACY_INTERACTION_V1[block.interaction]) return true;
  return ['audio-to-letter', 'initial-sound-to-letter', 'randomized-pair-recognition', 'vowel-consonant-classify'].includes(block.interaction);
}

function isLessonActivity(block, requiredIds) {
  if (!block || typeof block !== 'object') return false;
  if (requiredIds.has(block.id)) return true;
  if (block.recordResponse !== undefined || block.automaticValidation !== undefined) return true;
  if (hasDeterministicKey(block)) return true;
  if (recognizedInteraction(block)) return true;
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
  const blockContext = { completion, activityPolicies, documentCompetencyIds, parentKind: 'LESSON', sourceDocument: source };
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
  const blockContext = { completion, activityPolicies, documentCompetencyIds, parentKind: 'VERIFICATION', sourceDocument: source };
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
