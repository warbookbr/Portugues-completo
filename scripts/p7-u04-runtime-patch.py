from pathlib import Path


def replace_once(file, before, after):
    path = Path(file)
    text = path.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es)')
    path.write_text(text.replace(before, after, 1))

# 1. Normalizer: evidence selection from visible text + cards/correctOrder.
replace_once(
    'app/js/services/content-normalizer-v1.js',
    """function isOpenAuthoredActivity(block) {
  return block?.responseMode === 'free-text'
    || String(block?.interaction || '').includes('free-text')
    || String(block?.type || '').includes('open-production')
    || block?.type === 'required-open-production';
}

function materializeCommonLegacyActivity(block, sourceDocument) {
  let materialized = clone(block);
""",
    """function isOpenAuthoredActivity(block) {
  return block?.responseMode === 'free-text'
    || String(block?.interaction || '').includes('free-text')
    || String(block?.type || '').includes('open-production')
    || block?.type === 'required-open-production';
}

function normalizeEvidenceText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[“”\"'`´]/g, '')
    .replace(/[^a-z0-9áéíóúâêôãõç]+/gi, ' ')
    .trim()
    .replace(/\\s+/g, ' ');
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

function materializeCommonLegacyActivity(block, sourceDocument) {
  const sourceText = evidenceSourceText(block, sourceDocument);
  let materialized = materializeEvidenceSelection(block, sourceText);
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """  if (Array.isArray(materialized.items)) {
    materialized.items = materialized.items.map(item => {
      if (!item || Array.isArray(item.options) || !Array.isArray(item.cases) || !Object.prototype.hasOwnProperty.call(item, 'correctIndex')) return item;
      return { ...clone(item), options: clone(item.cases) };
    });
  }

  if (!Array.isArray(materialized.items) && materialized.stage1 && materialized.stage2) {
""",
    """  if (Array.isArray(materialized.items)) {
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
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """function answerFromEntry(entry) {
  if (entry?.stage1 && entry?.stage2 && Object.prototype.hasOwnProperty.call(entry.stage1, 'correctIndex') && Object.prototype.hasOwnProperty.call(entry.stage2, 'correctIndex')) {
    return { stage1CorrectIndex: entry.stage1.correctIndex, stage2CorrectIndex: entry.stage2.correctIndex };
  }
  const scalarKeys = ['correct', 'expected', 'correctFunction', 'correctGroup', 'correctAnswer'];
  const scalarPresent = scalarKeys.filter(key => Object.prototype.hasOwnProperty.call(entry, key));
  const structuredKeys = ['correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'acceptedResult', 'acceptedResults', 'auditoryCorrect', 'relationCorrectIndex'];
  const structuredPresent = structuredKeys.filter(key => Object.prototype.hasOwnProperty.call(entry, key));
  if (!scalarPresent.length && !structuredPresent.length) return undefined;
  if (scalarPresent.length === 1 && !structuredPresent.length) return clone(entry[scalarPresent[0]]);
  const answer = {};
  for (const key of [...scalarPresent, ...structuredPresent]) answer[key] = clone(entry[key]);
  return answer;
}
""",
    """function evidenceAnswer(entry) {
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
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """function normalizeAnswerKey(block) {
  const answerKey = {};
  const topLevelKeys = ['correct', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
  for (const key of topLevelKeys) if (Object.prototype.hasOwnProperty.call(block, key)) answerKey[key] = clone(block[key]);
""",
    """function normalizeAnswerKey(block) {
  const answerKey = {};
  const topLevelKeys = ['correct', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
  for (const key of topLevelKeys) if (Object.prototype.hasOwnProperty.call(block, key)) answerKey[key] = clone(block[key]);
  const blockEvidence = evidenceAnswer(block);
  if (blockEvidence) answerKey.evidence = blockEvidence;
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """const PRESENTATION_SECRET_KEYS = new Set(['correct', 'expected', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'acceptedResult', 'acceptedResults', 'correctFunction', 'correctGroup', 'correctAnswer', 'auditoryCorrect', 'relationCorrectIndex']);
""",
    """const PRESENTATION_SECRET_KEYS = new Set([
  'correct', 'expected', 'correctIndex', 'correctIndexes', 'correctSequence', 'correctOrder',
  'acceptedSequences', 'acceptedResult', 'acceptedResults', 'correctFunction', 'correctGroup', 'correctAnswer',
  'auditoryCorrect', 'relationCorrectIndex', 'requiredEvidence', 'requiredEvidenceParts', 'acceptableEvidence',
  'supportingParts', 'evidenceCorrectIndexes', 'evidenceMatchMode', 'revisedAnswer'
]);
"""
)

# 2. Shared deterministic evaluator: evidence is part of correctness; single choice stores itemResults.
replace_once(
    'app/js/ui/classic-deterministic-evaluator.js',
    """function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function expectedScalar(expected) {
""",
    """function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function evaluateEvidenceSelection(form, name, expected) {
  if (!expected || !Array.isArray(expected.correctIndexes) || !expected.correctIndexes.length) return { complete: true, correct: true };
  const selected = selectedIndexes(form, name);
  if (!selected.length) return { complete: false, correct: false };
  const correctIndexes = [...expected.correctIndexes].sort((a, b) => a - b);
  if (expected.match === 'ANY') {
    return { complete: true, correct: selected.length === 1 && correctIndexes.includes(selected[0]) };
  }
  return { complete: true, correct: arraysEqual(selected, correctIndexes) };
}

function applyEvidenceResult(form, name, expected, result) {
  if (!result.complete || result.pending || !expected) return result;
  const evidence = evaluateEvidenceSelection(form, name, expected);
  if (!evidence.complete) return { complete: false };
  return { ...result, correct: result.correct === true && evidence.correct === true };
}

function expectedScalar(expected) {
"""
)

replace_once(
    'app/js/ui/classic-deterministic-evaluator.js',
    """function evaluateChoice(form, block) {
  const evaluation = block.activity.evaluation || {};
  const key = evaluation.answerKey || {};
  const selected = selectedRadio(form, 'choice');
  if (!selected) return { complete: false };
  const index = Number(selected.value);
  const option = optionValue(block.content || {}, block.content || {}, index) ?? block.content?.options?.[index];
  if (Object.prototype.hasOwnProperty.call(key, 'correctIndex')) return { complete: true, correct: index === key.correctIndex };
  if (Object.prototype.hasOwnProperty.call(key, 'correctIndexes')) return { complete: true, correct: key.correctIndexes.length === 1 && index === key.correctIndexes[0] };
  if (Object.prototype.hasOwnProperty.call(key, 'correct')) return { complete: true, correct: normalizeComparable(option) === normalizeComparable(key.correct) };
  return { complete: true, pending: true };
}
""",
    """function evaluateChoice(form, block) {
  const evaluation = block.activity.evaluation || {};
  const key = evaluation.answerKey || {};
  const selected = selectedRadio(form, 'choice');
  if (!selected) return { complete: false };
  const index = Number(selected.value);
  const option = optionValue(block.content || {}, block.content || {}, index) ?? block.content?.options?.[index];
  let correct;
  if (Object.prototype.hasOwnProperty.call(key, 'correctIndex')) correct = index === key.correctIndex;
  else if (Object.prototype.hasOwnProperty.call(key, 'correctIndexes')) correct = key.correctIndexes.length === 1 && index === key.correctIndexes[0];
  else if (Object.prototype.hasOwnProperty.call(key, 'correct')) correct = normalizeComparable(option) === normalizeComparable(key.correct);
  else return { complete: true, pending: true };
  return { complete: true, correct, score: correct ? 1 : 0, itemResults: { 0: correct } };
}
"""
)

replace_once(
    'app/js/ui/classic-deterministic-evaluator.js',
    """    const result = evaluateCompositeEntry(form, block, entry, index, expectedItems[key]);
    if (!result.complete) return result;
    if (result.pending) return { complete: true, pending: true };
    itemResults[key] = result.correct === true;
""",
    """    let result = evaluateCompositeEntry(form, block, entry, index, expectedItems[key]);
    if (!result.complete) return result;
    if (result.pending) return { complete: true, pending: true };
    result = applyEvidenceResult(form, `round-evidence:${key}`, expectedItems[key]?.evidence, result);
    if (!result.complete) return result;
    itemResults[key] = result.correct === true;
"""
)

replace_once(
    'app/js/ui/classic-deterministic-evaluator.js',
    """export function evaluateDeterministic(form, block) {
  const interaction = block.activity?.interaction;
  if (interaction === 'SINGLE_CHOICE') return evaluateChoice(form, block);
  if (interaction === 'MULTIPLE_CHOICE') return evaluateMultipleChoice(form, block);
  if (interaction === 'CLASSIFY' || interaction === 'MATCH') return evaluateClassify(form, block);
  if (interaction === 'SEQUENCE' || interaction === 'ORDER') return evaluateSequence(form, block);
  if (interaction === 'COMPOSITE') return evaluateComposite(form, block);
  return { complete: true, pending: true };
}
""",
    """export function evaluateDeterministic(form, block) {
  const interaction = block.activity?.interaction;
  let result;
  if (interaction === 'SINGLE_CHOICE') result = evaluateChoice(form, block);
  else if (interaction === 'MULTIPLE_CHOICE') result = evaluateMultipleChoice(form, block);
  else if (interaction === 'CLASSIFY' || interaction === 'MATCH') result = evaluateClassify(form, block);
  else if (interaction === 'SEQUENCE' || interaction === 'ORDER') result = evaluateSequence(form, block);
  else if (interaction === 'COMPOSITE') result = evaluateComposite(form, block);
  else result = { complete: true, pending: true };
  return applyEvidenceResult(form, 'evidence', block.activity?.evaluation?.answerKey?.evidence, result);
}
"""
)

# 3. Renderer: explicit evidence selector, never generic answer metadata.
replace_once(
    'app/js/ui/classic-renderer.js',
    """    'responseMode', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices',
    'purpose', 'revealPolicy'
""",
    """    'responseMode', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices',
    'purpose', 'revealPolicy', 'followUp', 'evidenceOptions', 'evidenceSelectionMode'
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """function renderOpenInput(block, label = 'Sua resposta') {
  const interaction = block.activity?.interaction;
  const rows = interaction === 'SHORT_TEXT' ? 2 : interaction === 'LONG_TEXT' ? 9 : 6;
  return `<label class=\"response-field\"><span>${esc(label)}</span><textarea name=\"openResponse\" rows=\"${rows}\" required></textarea></label>`;
}

function entryKey(entry, index) {
""",
    """function renderOpenInput(block, label = 'Sua resposta') {
  const interaction = block.activity?.interaction;
  const rows = interaction === 'SHORT_TEXT' ? 2 : interaction === 'LONG_TEXT' ? 9 : 6;
  return `<label class=\"response-field\"><span>${esc(label)}</span><textarea name=\"openResponse\" rows=\"${rows}\" required></textarea></label>`;
}

function renderEvidenceSelector(content = {}, name = 'evidence') {
  const options = content.evidenceOptions;
  if (!Array.isArray(options) || !options.length) return '';
  const multiple = content.evidenceSelectionMode === 'MULTIPLE';
  const prompt = content.followUp || (multiple ? 'Marque os trechos do texto que sustentam sua resposta.' : 'Marque um trecho do texto que sustenta sua resposta.');
  return `<fieldset class=\"choice-group evidence-selector\" data-evidence-selection><legend>${esc(prompt)}</legend>${optionMarkup(options, name, multiple)}</fieldset>`;
}

function entryKey(entry, index) {
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """  if (Array.isArray(entry.options)) {
    const multiple = Boolean(expected && typeof expected === 'object' && Array.isArray(expected.correctIndexes) && expected.correctIndexes.length > 1);
    return `<fieldset class=\"composite-round\"><legend>${esc(label)}</legend>${localStimuli}${optionMarkup(entry.options, `round:${key}`, multiple)}</fieldset>`;
  }
""",
    """  if (Array.isArray(entry.options)) {
    const multiple = Boolean(expected && typeof expected === 'object' && Array.isArray(expected.correctIndexes) && expected.correctIndexes.length > 1);
    return `<fieldset class=\"composite-round\"><legend>${esc(label)}</legend>${localStimuli}${optionMarkup(entry.options, `round:${key}`, multiple)}${renderEvidenceSelector(entry, `round-evidence:${key}`)}</fieldset>`;
  }
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """        ${renderInteraction(block)}
        ${renderSelfReview(block)}
""",
    """        ${renderInteraction(block)}
        ${renderEvidenceSelector(block.content)}
        ${renderSelfReview(block)}
"""
)

# 4. Explicit completion semantics for U04 rules that are not simple all-required.
replace_once(
    'app/js/services/content-normalization-rules-v1.js',
    """  'N0-U03-V01': {
    clusters: [
      {
        id: 'meaningAndContext', required: true, evidenceIds: ['V01-Q01', 'V01-Q02', 'V01-Q03'], satisfaction: 'DEMONSTRATED_REQUIRED',
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q01', 'V01-Q02', 'V01-Q03'], minimum: 5 }]
      },
      {
        id: 'constructionAndManipulation', required: true, evidenceIds: ['V01-Q05', 'V01-Q06', 'V01-Q09'], satisfaction: 'DEMONSTRATED_REQUIRED',
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q06', 'V01-Q09'], minimum: 3 }]
      },
      { id: 'messageComprehensionAndProduction', required: true, evidenceIds: ['V01-Q04', 'V01-Q07', 'V01-Q08', 'V01-Q10'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'V01-Q01': { threshold: 0.5 },
      'V01-Q02': { threshold: 0.5 },
      'V01-Q03': { threshold: 1 },
      'V01-Q04': { threshold: 2 / 3 },
      'V01-Q05': { threshold: 1 },
      'V01-Q06': { threshold: 0.5 },
      'V01-Q07': { threshold: 1 },
      'V01-Q08': { threshold: 4 / 5 },
      'V01-Q09': { threshold: 0.5, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['1'] }] }
    }
  }
});
""",
    """  'N0-U03-V01': {
    clusters: [
      {
        id: 'meaningAndContext', required: true, evidenceIds: ['V01-Q01', 'V01-Q02', 'V01-Q03'], satisfaction: 'DEMONSTRATED_REQUIRED',
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q01', 'V01-Q02', 'V01-Q03'], minimum: 5 }]
      },
      {
        id: 'constructionAndManipulation', required: true, evidenceIds: ['V01-Q05', 'V01-Q06', 'V01-Q09'], satisfaction: 'DEMONSTRATED_REQUIRED',
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q06', 'V01-Q09'], minimum: 3 }]
      },
      { id: 'messageComprehensionAndProduction', required: true, evidenceIds: ['V01-Q04', 'V01-Q07', 'V01-Q08', 'V01-Q10'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'V01-Q01': { threshold: 0.5 },
      'V01-Q02': { threshold: 0.5 },
      'V01-Q03': { threshold: 1 },
      'V01-Q04': { threshold: 2 / 3 },
      'V01-Q05': { threshold: 1 },
      'V01-Q06': { threshold: 0.5 },
      'V01-Q07': { threshold: 1 },
      'V01-Q08': { threshold: 4 / 5 },
      'V01-Q09': { threshold: 0.5, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['1'] }] }
    }
  },
  'N0-U04-L04': {
    clusters: [
      { id: 'integration', required: true, evidenceIds: ['L04-C01', 'L04-A01', 'L04-A02'], minimumEvidence: 2, requiredAnyOf: [['L04-A01', 'L04-A02']], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'relationDiscipline', required: true, evidenceIds: ['L04-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N0-U04-L05': {
    clusters: [
      {
        id: 'personPlaceReference', required: true, evidenceIds: ['L05-C01', 'L05-A01', 'L05-A02'], minimumEvidence: 1,
        requiredAnyOf: [['L05-A01'], ['L05-C01', 'L05-A02']],
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['L05-C01', 'L05-A01', 'L05-A02'], minimum: 3 }],
        satisfaction: 'DEMONSTRATED_REQUIRED'
      },
      { id: 'contextUse', required: true, evidenceIds: ['L05-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N0-U04-L07': {
    clusters: [
      { id: 'timeAndSequence', required: true, evidenceIds: ['L07-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      {
        id: 'causeAndEffect', required: true, evidenceIds: ['L07-C01', 'L07-A01', 'L07-A02'], minimumEvidence: 1,
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['L07-C01', 'L07-A01', 'L07-A02'], minimum: 3 }],
        satisfaction: 'DEMONSTRATED_REQUIRED'
      }
    ],
    nonCompensable: true,
    activityPolicies: { 'L07-A02': { threshold: 0.5, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['0'] }] } }
  },
  'N0-U04-V01': {
    clusters: [
      { id: 'globalComprehension', required: true, evidenceIds: ['V01-Q01', 'V01-Q02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'explicitAndIntegration', required: true, evidenceIds: ['V01-Q03', 'V01-Q04'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'reference', required: true, evidenceIds: ['V01-Q05', 'V01-Q06'], minimumEvidence: 1, satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'sequenceAndRelations', required: true, evidenceIds: ['V01-Q07', 'V01-Q08', 'V01-Q09'], minimumEvidence: 2, requiredAnyOf: [['V01-Q08', 'V01-Q09']], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'inferenceDiscipline', required: true, evidenceIds: ['V01-Q10', 'V01-Q11'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'rereadingAndRevision', required: true, evidenceIds: ['V01-Q12'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  }
});
"""
)

# 5. Audit: include nested/multi evidence and stop treating visible source text as an answer leak.
replace_once(
    'scripts/audit-p7-n0-u04.mjs',
    """function hasEvidenceRequirement(block) {
  return Boolean(
    block && (
      block.requiredEvidence !== undefined
      || block.acceptableEvidence !== undefined
      || (typeof block.followUp === 'string' && /evid[eê]ncia|parte|trecho|texto/i.test(block.followUp))
    )
  );
}

function evidenceStrings(block) {
  const values = [];
  for (const value of [block?.requiredEvidence, block?.acceptableEvidence]) {
    if (typeof value === 'string') values.push(value);
    else if (Array.isArray(value)) values.push(...value.filter(item => typeof item === 'string'));
  }
  return values;
}
""",
    """function hasEvidenceRequirement(block) {
  return Boolean(
    block && (
      block.requiredEvidence !== undefined
      || block.requiredEvidenceParts !== undefined
      || block.acceptableEvidence !== undefined
      || (typeof block.followUp === 'string' && /evid[eê]ncia|parte|trecho|texto/i.test(block.followUp))
    )
  );
}
"""
)

replace_once(
    'scripts/audit-p7-n0-u04.mjs',
    """  for (const answer of evidenceStrings(authored)) {
    if (answer && html.includes(answer)) {
      issue(`${sourceId}/${authored.id}: evidência-gabarito aparece no HTML público antes da resposta -> ${JSON.stringify(answer.slice(0, 80))}.`);
      break;
    }
  }
}
""",
    """  if (!Array.isArray(runtimeBlock.content?.evidenceOptions) || !runtimeBlock.content.evidenceOptions.length) {
    issue(`${sourceId}/${authored.id}: requisito de evidência não foi materializado como opções derivadas do texto visível.`);
  }
}
"""
)

replace_once(
    'scripts/audit-p7-n0-u04.mjs',
    """  for (const authored of authoredActivities(source)) {
    auditEvidenceRequirement(source.id, authored, byId.get(authored.id), html);
  }
""",
    """  for (const authored of authoredActivities(source)) {
    const runtimeBlock = byId.get(authored.id);
    auditEvidenceRequirement(source.id, authored, runtimeBlock, html);
    if (Array.isArray(authored.items) && Array.isArray(runtimeBlock?.content?.items)) {
      authored.items.forEach((item, index) => {
        if (!hasEvidenceRequirement(item)) return;
        const runtimeItem = runtimeBlock.content.items[index];
        evidenceRequirements.push(`${source.id}/${authored.id}/item-${index}`);
        if (!Array.isArray(runtimeItem?.evidenceOptions) || !runtimeItem.evidenceOptions.length) {
          issue(`${source.id}/${authored.id}/item-${index}: evidência aninhada não foi materializada.`);
        }
        if (!new RegExp(`name=[\\\"']round-evidence:${runtimeItem?.id ?? index}`, 'i').test(html)) {
          issue(`${source.id}/${authored.id}/item-${index}: renderer não oferece controle de evidência por subitem.`);
        }
      });
    }
  }
"""
)

print('P7/U04 runtime patch aplicado.')
