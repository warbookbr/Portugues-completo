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
  if (!source || typeof source !== 'object' || Array.isArray(source)) throw new ContentNormalizationError('INVALID_SOURCE', 'Conteúdo autoral deve ser um objeto JSON.');
  if (source.schemaVersion !== 1) throw new ContentNormalizationError('UNSUPPORTED_SCHEMA_VERSION', `schemaVersion autoral não suportada: ${source.schemaVersion}`, { id: source.id, schemaVersion: source.schemaVersion });
  if (!source.id || !source.title || !source.objective) throw new ContentNormalizationError('MISSING_IDENTITY', 'Conteúdo autoral sem id, title ou objective.', { id: source.id });
}

function materializeExpectedItems(block) {
  if (!Array.isArray(block.items) || !block.items.length) return block;
  const expectedItems = block.items.filter(item => item && Object.prototype.hasOwnProperty.call(item, 'expected'));
  if (expectedItems.length !== block.items.length) return block;

  const allBoolean = expectedItems.every(item => typeof item.expected === 'boolean');
  const categories = allBoolean
    ? ['verdadeiro', 'falso']
    : [...new Set(expectedItems.map(item => item.expected).filter(value => typeof value === 'string'))];
  if (!categories.length) return block;

  return {
    ...clone(block),
    categories,
    items: block.items.map((item, index) => ({
      ...clone(item),
      id: item.id || String(index),
      displayLabel: item.displayLabel || item.claim || item.question || `Item ${index + 1}`,
      expected: allBoolean ? (item.expected ? 'verdadeiro' : 'falso') : item.expected
    }))
  };
}

const LEGACY_PUBLIC_ANSWER_LABELS = Object.freeze({
  'esta-funcionando-como-mensagem-na-situacao': 'está funcionando como mensagem nesta situação',
  'nao-esta-funcionando-como-mensagem-na-situacao': 'não está funcionando como mensagem nesta situação'
});

function publicLegacyAnswer(value) {
  return LEGACY_PUBLIC_ANSWER_LABELS[value] || value;
}

function isOpenAuthoredActivity(block) {
  return String(block?.responseMode || '').startsWith('free-text')
    || String(block?.interaction || '').includes('free-text')
    || String(block?.type || '').includes('open-production')
    || block?.type === 'required-open-production';
}

function normalizeEvidenceText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[“”"'`´]/g, '')
    .replace(/[^a-z0-9áéíóúâêôãõç]+/gi, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function evidenceSourceText(block, sourceDocument) {
  if (typeof block?.text === 'string') return block.text;
  if (typeof block?.standaloneText === 'string') return block.standaloneText;
  if (block?.textRef && Array.isArray(sourceDocument?.texts)) {
    const referenced = sourceDocument.texts.find(item => item?.id === block.textRef);
    if (typeof referenced?.text === 'string') return referenced.text;
  }
  return '';
}

function splitEvidenceOptions(text) {
  const matches = String(text || '').match(/[^.!?]+[.!?]?/g) || [];
  return matches.map(item => item.trim()).filter(Boolean);
}

function evidenceRequirement(entry) {
  if (!entry || typeof entry !== 'object') return null;
  if (Array.isArray(entry.acceptableEvidence) && entry.acceptableEvidence.length) {
    return { expected: entry.acceptableEvidence, match: 'ANY' };
  }
  if (Array.isArray(entry.requiredEvidenceParts) && entry.requiredEvidenceParts.length) {
    return { expected: entry.requiredEvidenceParts, match: 'ALL' };
  }
  if (Array.isArray(entry.requiredEvidence) && entry.requiredEvidence.length) {
    return { expected: entry.requiredEvidence, match: 'ALL' };
  }
  if (typeof entry.requiredEvidence === 'string' && entry.requiredEvidence.trim()) {
    return { expected: [entry.requiredEvidence], match: 'ALL' };
  }
  return null;
}

function evidenceIndexes(options, expected) {
  const normalizedOptions = options.map(normalizeEvidenceText);
  const indexes = [];
  for (const expectedValue of expected) {
    const normalizedExpected = normalizeEvidenceText(expectedValue);
    const index = normalizedOptions.findIndex(option => option.includes(normalizedExpected) || normalizedExpected.includes(option));
    if (index >= 0 && !indexes.includes(index)) indexes.push(index);
  }
  return indexes.sort((a, b) => a - b);
}

function materializeEvidenceSelection(entry, sourceText) {
  const requirement = evidenceRequirement(entry);
  if (!requirement) return clone(entry);
  const options = splitEvidenceOptions(sourceText);
  const correctIndexes = evidenceIndexes(options, requirement.expected);
  if (!options.length || !correctIndexes.length) return clone(entry);
  return {
    ...clone(entry),
    evidenceOptions: options,
    evidenceSelectionMode: requirement.match === 'ANY' || correctIndexes.length === 1 ? 'SINGLE' : 'MULTIPLE',
    evidenceMatchMode: requirement.match,
    evidenceCorrectIndexes: correctIndexes
  };
}

const CONTROLLED_TEXT_INTERACTIONS = new Set(['insert-spaces', 'edit-capitalization-and-boundary', 'edit-controlled-text', 'insert-commas']);
const GENERIC_SELF_REVIEW = Object.freeze([
  'Minha resposta comunica o objetivo apresentado?',
  'Reli minha resposta antes de enviar?'
]);

function hasOralRehearsal(block) {
  return block?.oralRehearsal === true
    || (block?.oralRehearsal && typeof block.oralRehearsal === 'object' && block.oralRehearsal.enabled !== false);
}

function materializeCommonLegacyActivity(block, sourceDocument) {
  const sourceText = evidenceSourceText(block, sourceDocument);
  let materialized = materializeEvidenceSelection(block, sourceText);

  // Planejamento por seleção: transforma cartões autorais em múltipla escolha sem expor flags essential.
  const planningIndexes = Array.isArray(materialized.correctEssentialIndexes)
    ? materialized.correctEssentialIndexes
    : Array.isArray(materialized.informationCards) && Array.isArray(materialized.correctIndexes)
      ? materialized.correctIndexes
      : null;
  if (Array.isArray(materialized.informationCards) && planningIndexes) {
    const { informationCards, correctEssentialIndexes, ...rest } = materialized;
    materialized = {
      ...clone(rest),
      options: informationCards.map(item => typeof item === 'string' ? item : item?.text ?? String(item)),
      correctIndexes: clone(planningIndexes),
      interaction: 'multiple-choice'
    };
  }

  // Algumas atividades históricas chamam as alternativas de versions.
  if (!Array.isArray(materialized.options) && Array.isArray(materialized.versions) && Object.prototype.hasOwnProperty.call(materialized, 'correctIndex')) {
    const { versions, ...rest } = materialized;
    materialized = { ...clone(rest), options: clone(versions) };
  }

  // Ordenação pode aceitar mais de uma sequência correta.
  if (Array.isArray(materialized.cards) && Array.isArray(materialized.acceptableOrders) && materialized.acceptableOrders.length) {
    materialized.availableTiles = clone(materialized.cards);
    materialized.acceptedSequences = clone(materialized.acceptableOrders);
  }

  // Edições controladas têm um alvo exato e podem ser verificadas deterministicamente.
  if (CONTROLLED_TEXT_INTERACTIONS.has(String(materialized.interaction || '')) && typeof materialized.expected === 'string') {
    if (Array.isArray(materialized.principleOptions) && Number.isInteger(materialized.principleCorrectIndex)) {
      materialized.items = [
        { id: 'edit', acceptedResult: materialized.expected },
        { id: 'principle', prompt: materialized.principleQuestion || 'Qual princípio explica esta edição?', options: clone(materialized.principleOptions), correctIndex: materialized.principleCorrectIndex }
      ];
      materialized.interaction = 'composite';
    } else {
      materialized.interaction = 'short-text';
    }
    materialized.automaticValidation = true;
  }

  if (!Array.isArray(materialized.items) && Array.isArray(materialized.contexts)) {
    materialized.items = materialized.contexts.map((item, index) => ({ ...clone(item), id: item.id || String(index) }));
  }

  if (Array.isArray(materialized.items)) {
    materialized.items = materialized.items.map(item => {
      const evidenceReady = materializeEvidenceSelection(item, sourceText);
      if (!evidenceReady || Array.isArray(evidenceReady.options) || !Array.isArray(evidenceReady.cases) || !Object.prototype.hasOwnProperty.call(evidenceReady, 'correctIndex')) return evidenceReady;
      return { ...clone(evidenceReady), options: clone(evidenceReady.cases) };
    });
  }

  if (Array.isArray(materialized.cards) && Array.isArray(materialized.correctOrder)) {
    materialized.availableTiles = clone(materialized.cards);
    materialized.correctSequence = clone(materialized.correctOrder);
  }

  if (!Array.isArray(materialized.items) && materialized.stage1 && materialized.stage2) {
    materialized.items = [{ id: '0', stage1: clone(materialized.stage1), stage2: clone(materialized.stage2) }];
    materialized.interaction = 'composite';
  }

  if (Array.isArray(materialized.tiles) && Array.isArray(materialized.acceptedSequences)) {
    materialized.availableTiles = clone(materialized.tiles);
  }

  if (Array.isArray(materialized.groups) && Array.isArray(materialized.items)) {
    const labelsById = new Map(materialized.groups.map(group => [group.id, group.label || group.id]));
    const options = materialized.groups.map(group => group.label || group.id);
    materialized.items = materialized.items.map(item => {
      if (!item || !Object.prototype.hasOwnProperty.call(item, 'correctGroup')) return item;
      const { correctGroup, ...rest } = item;
      return { ...clone(rest), options: clone(options), correct: labelsById.get(correctGroup) || correctGroup };
    });
  }

  const functions = Array.isArray(materialized.availableFunctions) ? materialized.availableFunctions : Array.isArray(materialized.functions) ? materialized.functions : null;
  if (functions && Array.isArray(materialized.items)) {
    materialized.items = materialized.items.map(item => {
      if (!item || !Object.prototype.hasOwnProperty.call(item, 'correctFunction')) return item;
      const { correctFunction, ...rest } = item;
      return { ...clone(rest), options: clone(functions), correct: correctFunction };
    });
  }

  if (Array.isArray(materialized.items) && materialized.items.some(item => item && Object.prototype.hasOwnProperty.call(item, 'correctAnswer'))) {
    const rawAnswers = [...new Set(materialized.items.map(item => item?.correctAnswer).filter(Boolean))];
    const options = rawAnswers.map(publicLegacyAnswer);
    materialized.items = materialized.items.map(item => {
      if (!item || !Object.prototype.hasOwnProperty.call(item, 'correctAnswer')) return item;
      const { correctAnswer, ...rest } = item;
      return { ...clone(rest), options: clone(options), correct: publicLegacyAnswer(correctAnswer) };
    });
  }

  if (hasOralRehearsal(materialized)) {
    const authoredRehearsal = materialized.oralRehearsal;
    const rehearsal = authoredRehearsal === true
      ? { enabled: true, required: true, instruction: materialized.instruction || 'Faça um ensaio oral curto e marque quando concluir.' }
      : {
          enabled: authoredRehearsal.enabled !== false,
          required: authoredRehearsal.required === true,
          instruction: authoredRehearsal.instruction || materialized.instruction || 'Faça um ensaio oral curto.'
        };
    materialized.oralRehearsal = rehearsal;
    if (!Array.isArray(materialized.selfReviewQuestions) && Array.isArray(materialized.selfCheck)) materialized.selfReviewQuestions = clone(materialized.selfCheck);
    if (!Array.isArray(materialized.selfReviewQuestions) && Array.isArray(materialized.selfReview)) materialized.selfReviewQuestions = clone(materialized.selfReview);
    if (!isOpenAuthoredActivity(materialized)) {
      materialized.automaticValidation = false;
      materialized.recordResponse = true;
      materialized.interaction = 'oral-response';
    }
  }

  if (isOpenAuthoredActivity(materialized)) {
    const selfReviewQuestions = Array.isArray(materialized.selfReviewQuestions) && materialized.selfReviewQuestions.length
      ? materialized.selfReviewQuestions
      : Array.isArray(materialized.selfReview) && materialized.selfReview.length
        ? materialized.selfReview
        : Array.isArray(sourceDocument?.assessmentBehavior?.selfReview?.questions) && sourceDocument.assessmentBehavior.selfReview.questions.length
          ? sourceDocument.assessmentBehavior.selfReview.questions
          : materialized.selfReviewRequired === true
            ? GENERIC_SELF_REVIEW
            : [];
    materialized = {
      ...materialized,
      automaticValidation: false,
      recordResponse: true,
      interaction: Array.isArray(materialized.items) && materialized.items.length ? 'composite' : 'long-text',
      ...(selfReviewQuestions.length ? { selfReviewQuestions: clone(selfReviewQuestions) } : {}),
      ...(Array.isArray(materialized.essentialInformation) && materialized.essentialInformation.length
        ? { planningChecklist: clone(materialized.essentialInformation) }
        : {})
    };
  }

  return materialized;
}

function materializeLegacyActivity(block, sourceDocument) {
  let materialized = materializeExpectedItems(materializeCommonLegacyActivity(block, sourceDocument));
  if (!sourceDocument || !block?.id) return materialized;

  if (block.id === 'L03-A01' && Array.isArray(sourceDocument.letterSet)) {
    const letters = sourceDocument.letterSet.filter(item => item?.letter && item?.mediaId);
    return {
      ...clone(block),
      interaction: 'classify',
      categories: letters.map(item => item.letter),
      items: letters.map((item, index) => ({ id: `letter-${String(index + 1).padStart(2, '0')}`, displayLabel: `Áudio ${index + 1}`, stimulus: item.mediaId, correct: item.letter }))
    };
  }

  if (block.id === 'L04-A02' && Array.isArray(sourceDocument.letterPairs)) {
    const pairs = sourceDocument.letterPairs.filter(item => item?.upper && item?.lower);
    return {
      ...clone(block),
      interaction: 'classify',
      categories: pairs.map(item => item.lower),
      items: pairs.map((item, index) => ({ id: `pair-${String(index + 1).padStart(2, '0')}`, stimulus: item.upper, correct: item.lower }))
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

  return materialized;
}

function entryHasAnswer(entry) {
  if (!entry || typeof entry !== 'object') return false;
  const directKeys = ['correct', 'expected', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'acceptedResult', 'acceptedResults', 'correctFunction', 'correctGroup', 'correctAnswer', 'auditoryCorrect', 'relationCorrectIndex'];
  if (directKeys.some(key => Object.prototype.hasOwnProperty.call(entry, key))) return true;
  return Boolean(entry.stage1 && entry.stage2 && Object.prototype.hasOwnProperty.call(entry.stage1, 'correctIndex') && Object.prototype.hasOwnProperty.call(entry.stage2, 'correctIndex'));
}

function collectionHasAnswer(collection) {
  return Array.isArray(collection) && collection.some(entryHasAnswer);
}

function hasDeterministicKey(block) {
  const directKeys = ['correct', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
  return block.automaticValidation === true
    || directKeys.some(key => Object.prototype.hasOwnProperty.call(block, key))
    || collectionHasAnswer(block.items)
    || collectionHasAnswer(block.rounds)
    || collectionHasAnswer(block.contexts);
}

function normalizeInteraction(block) {
  if (block.interaction === 'audio-to-letter' && Array.isArray(block.options)) return 'SINGLE_CHOICE';
  if (block.interaction === 'initial-sound-to-letter' && Array.isArray(block.items)) return 'COMPOSITE';
  const fromInteraction = INTERACTION_BY_LEGACY_INTERACTION_V1[block.interaction];
  if (fromInteraction) return fromInteraction;
  const fromType = INTERACTION_BY_PEDAGOGICAL_TYPE_V1[block.type];
  if (fromType) return fromType;
  if (block.recordResponse === true && Array.isArray(block.items) && block.items.length) return 'COMPOSITE';
  if (block.recordResponse === true) return 'LONG_TEXT';
  if (block.correctIndexes && Array.isArray(block.options)) return 'MULTIPLE_CHOICE';
  if (block.correctSequence || block.acceptedSequences || (Array.isArray(block.availableTiles) && block.acceptedSequences)) return 'SEQUENCE';
  if (Array.isArray(block.categories) && Array.isArray(block.items)) return 'CLASSIFY';
  if (Array.isArray(block.items) && collectionHasAnswer(block.items)) return 'COMPOSITE';
  if (Array.isArray(block.options)) return 'SINGLE_CHOICE';
  throw new ContentNormalizationError('UNSUPPORTED_INTERACTION', `Não foi possível normalizar a interação de ${block.id || block.type}.`, { id: block.id, pedagogicalType: block.type, interaction: block.interaction });
}

function normalizeEvaluationMode(block) {
  if (block.automaticValidation === false) return 'RELIABLE_EVALUATOR';
  if (hasDeterministicKey(block)) return 'DETERMINISTIC';
  if (block.recordResponse === true) return 'RELIABLE_EVALUATOR';
  return 'NONE';
}

function evidenceAnswer(entry) {
  if (!Array.isArray(entry?.evidenceCorrectIndexes) || !entry.evidenceCorrectIndexes.length) return null;
  return { correctIndexes: clone(entry.evidenceCorrectIndexes), match: entry.evidenceMatchMode === 'ANY' ? 'ANY' : 'ALL' };
}

function answerFromEntry(entry) {
  const evidence = evidenceAnswer(entry);
  if (entry?.stage1 && entry?.stage2 && Object.prototype.hasOwnProperty.call(entry.stage1, 'correctIndex') && Object.prototype.hasOwnProperty.call(entry.stage2, 'correctIndex')) {
    return { stage1CorrectIndex: entry.stage1.correctIndex, stage2CorrectIndex: entry.stage2.correctIndex, ...(evidence ? { evidence } : {}) };
  }
  const scalarKeys = ['correct', 'expected', 'correctFunction', 'correctGroup', 'correctAnswer'];
  const scalarPresent = scalarKeys.filter(key => Object.prototype.hasOwnProperty.call(entry, key));
  const structuredKeys = ['correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'acceptedResult', 'acceptedResults', 'auditoryCorrect', 'relationCorrectIndex'];
  const structuredPresent = structuredKeys.filter(key => Object.prototype.hasOwnProperty.call(entry, key));
  if (!scalarPresent.length && !structuredPresent.length) return evidence ? { evidence } : undefined;
  if (scalarPresent.length === 1 && !structuredPresent.length && !evidence) return clone(entry[scalarPresent[0]]);
  const answer = {};
  if (scalarPresent.length === 1) answer[scalarPresent[0]] = clone(entry[scalarPresent[0]]);
  else for (const key of scalarPresent) answer[key] = clone(entry[key]);
  for (const key of structuredPresent) answer[key] = clone(entry[key]);
  if (evidence) answer.evidence = evidence;
  return answer;
}

function normalizeAnswerKey(block) {
  const answerKey = {};
  const topLevelKeys = ['correct', 'expected', 'acceptedResult', 'acceptedResults', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
  for (const key of topLevelKeys) if (Object.prototype.hasOwnProperty.call(block, key)) answerKey[key] = clone(block[key]);
  const blockEvidence = evidenceAnswer(block);
  if (blockEvidence) answerKey.evidence = blockEvidence;
  const itemAnswers = {};
  for (const collection of [block.items, block.rounds, block.contexts]) {
    if (!Array.isArray(collection)) continue;
    collection.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      const answer = answerFromEntry(item);
      if (answer === undefined) return;
      itemAnswers[item.id || String(index)] = answer;
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
  if (stimulus.includes('AUD-')) return { type: 'CONTROLLED_AUDIO', mediaId: stimulus, ...(itemId !== null ? { payload: { itemId } } : {}) };
  return { type: 'TEXT', payload: { content: stimulus, ...(itemId !== null ? { itemId } : {}) } };
}

function appendEntryStimuli(stimuli, entries) {
  if (!Array.isArray(entries)) return;
  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') return;
    const itemId = entry.id || String(index);
    if (Array.isArray(entry.stimuli)) {
      for (const nestedStimulus of entry.stimuli) {
        const normalized = typeof nestedStimulus === 'string' ? stimulusFromPrimitive(nestedStimulus, itemId) : stimulusFromObject(nestedStimulus);
        if (normalized) {
          if (typeof nestedStimulus !== 'string') normalized.payload = { ...(normalized.payload || {}), itemId };
          stimuli.push(normalized);
        }
      }
    }
    if (!entry.stimulus) return;
    const normalized = typeof entry.stimulus === 'object' ? stimulusFromObject(entry.stimulus) : stimulusFromPrimitive(entry.stimulus, itemId);
    if (normalized) {
      normalized.payload = { ...(normalized.payload || {}), itemId };
      stimuli.push(normalized);
    }
  });
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
  if (Array.isArray(block.stimuli)) for (const stimulus of block.stimuli) {
    const normalized = typeof stimulus === 'string' ? stimulusFromPrimitive(stimulus) : stimulusFromObject(stimulus);
    if (normalized) stimuli.push(normalized);
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
  if (legacy) return { completion: { clusters: clone(legacy.clusters), nonCompensable: Boolean(legacy.nonCompensable) }, activityPolicies: clone(legacy.activityPolicies || {}) };
  const authored = source.completionEvidence;
  if (!authored || !authored.clusters || typeof authored.clusters !== 'object') throw new ContentNormalizationError('UNNORMALIZABLE_COMPLETION', `A regra de conclusão de ${source.id} não possui estrutura normalizável nem regra legada explícita.`, { id: source.id });
  const reliableEvaluatorDeclared = Array.isArray(authored.requiresReliableEvaluatorFor) && authored.requiresReliableEvaluatorFor.length > 0;
  const activityById = new Map(activitySources.map(activity => [activity.id, activity]));
  const clusters = Object.entries(authored.clusters).map(([id, cluster]) => {
    const evidenceIds = Array.isArray(cluster.evidence) ? cluster.evidence : [];
    if (!evidenceIds.length) throw new ContentNormalizationError('EMPTY_COMPLETION_CLUSTER', `Cluster ${id} de ${source.id} não possui evidências.`, { id, sourceId: source.id });
    const containsOpenEvidence = evidenceIds.some(evidenceId => {
      const activity = activityById.get(evidenceId);
      return activity && (activity.recordResponse === true || activity.automaticValidation === false || typeof activity.automaticValidation === 'string');
    });
    return { id, required: cluster.required !== false, evidenceIds: clone(evidenceIds), satisfaction: reliableEvaluatorDeclared && containsOpenEvidence ? 'PENDING_ALLOWED' : 'DEMONSTRATED_REQUIRED' };
  });
  return { completion: { clusters, nonCompensable: authored.nonCompensable === true || (Array.isArray(authored.nonCompensable) && authored.nonCompensable.length > 0) }, activityPolicies: {} };
}

const PRESENTATION_SECRET_KEYS = new Set([
  'correct', 'expected', 'correctIndex', 'correctIndexes', 'correctSequence', 'correctOrder',
  'acceptedSequences', 'acceptableOrders', 'acceptedResult', 'acceptedResults', 'correctFunction', 'correctGroup', 'correctAnswer',
  'auditoryCorrect', 'relationCorrectIndex', 'correctEssentialIndexes', 'principleCorrectIndex', 'requiredEvidence', 'requiredEvidenceParts', 'acceptableEvidence',
  'supportingParts', 'evidenceCorrectIndexes', 'evidenceMatchMode', 'revisedAnswer'
]);

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
    criteria: clone(policy.criteria || []),
    threshold: Object.prototype.hasOwnProperty.call(policy, 'threshold') ? policy.threshold : null
  };
  if (answerKey) evaluation.answerKey = answerKey;
  const role = parentKind === 'LESSON' ? (required ? (normalizedBlock.recordResponse === true ? 'PRODUCTION' : 'EVIDENCE') : (normalizedBlock.type === 'quick-check' ? 'CHECK' : 'PRACTICE')) : (normalizedBlock.recordResponse === true ? 'PRODUCTION' : 'VERIFICATION');
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
      evidence: { role: required ? (parentKind === 'LESSON' ? 'REQUIRED' : 'CHECKPOINT') : 'PRACTICE', competencyIds: clone(documentCompetencyIds), clusterId: clusterByActivity.get(normalizedBlock.id) || null, recordResponse: normalizedBlock.recordResponse === true, requiredForCompletion: required },
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
  if (isOpenAuthoredActivity(block) || hasOralRehearsal(block)) return true;
  if (block.recordResponse === true || block.automaticValidation === true) return true;
  if (hasDeterministicKey(block)) return true;
  if (recognizedInteraction(block)) return true;
  return false;
}

function normalizeLessonBlock(block, context, requiredIds) {
  if (isLessonActivity(block, requiredIds)) return normalizeActivity(block, context);
  return { id: block.id, kind: 'CONTENT', pedagogicalType: block.type || 'content', ...(block.focus ? { focus: block.focus } : {}), content: normalizeContentPayload(block) };
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
  return { schemaVersion: 1, id: source.id, kind: 'LESSON', title: source.title, objective: source.objective, competencyIds: documentCompetencyIds, prerequisites: clone(source.prerequisites || []), limits: clone(source.limits || []), blocks: sequence.map(block => normalizeLessonBlock(block, blockContext, requiredIds)), completion };
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
  return { schemaVersion: 1, id: source.id, kind: source.type === 'level-exit-verification' || source.id.includes('-EXIT-') ? 'LEVEL_VERIFICATION' : 'UNIT_VERIFICATION', title: source.title, objective: source.objective, competencyIds: documentCompetencyIds, prerequisites: clone(source.prerequisites || []), blocks: activities.map(block => normalizeActivity(block, blockContext)), completion };
}

export function normalizeAuthoredContentV1(source, context = {}) {
  ensureV1(source);
  if (source.type === 'integrated-unit-verification' || source.type === 'level-exit-verification' || source.id.includes('-EXIT-')) return normalizeVerificationV1(source, context);
  if (Array.isArray(source.sequence)) return normalizeLessonV1(source, context);
  throw new ContentNormalizationError('UNSUPPORTED_CONTENT_KIND', `Formato autoral v1 não reconhecido para ${source.id}.`, { id: source.id, type: source.type });
}
