function normalizeComparable(value) {
  if (typeof value === 'string') return value.trim().toLocaleLowerCase('pt-BR');
  return value;
}

function selectedRadio(form, name) {
  return form.querySelector(`input[name="${name}"]:checked`);
}

function selectedIndexes(form, name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(input => Number(input.value)).sort((a, b) => a - b);
}

function parseSequence(form, name) {
  const input = [...form.querySelectorAll('[data-sequence-value]')].find(item => item.name === name);
  try { return JSON.parse(input?.value || '[]'); } catch { return []; }
}

function entryKey(entry, index) {
  return String(entry?.id ?? index);
}

function optionValue(entry, content, index) {
  return entry?.options?.[index]
    ?? entry?.nonVisualOptions?.[index]
    ?? entry?.audioOptions?.[index]
    ?? entry?.wholeWordOptions?.[index]
    ?? entry?.availableTiles?.[index]
    ?? content?.pulseOptions?.[index];
}

function arraysEqual(a, b) {
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
  if (!expected || typeof expected !== 'object' || Array.isArray(expected)) return expected;
  if (Object.prototype.hasOwnProperty.call(expected, 'correct')) return expected.correct;
  if (Object.prototype.hasOwnProperty.call(expected, 'expected')) return expected.expected;
  if (Object.prototype.hasOwnProperty.call(expected, 'correctFunction')) return expected.correctFunction;
  if (Object.prototype.hasOwnProperty.call(expected, 'correctGroup')) return expected.correctGroup;
  if (Object.prototype.hasOwnProperty.call(expected, 'correctAnswer')) return expected.correctAnswer;
  return undefined;
}

function criteriaSatisfied(criteria = [], itemResults = {}) {
  for (const criterion of criteria) {
    if (!criterion || typeof criterion !== 'object') continue;
    if (criterion.type === 'REQUIRED_ITEMS_CORRECT') {
      if (!(criterion.itemIds || []).every(id => itemResults[String(id)] === true)) return false;
      continue;
    }
    if (criterion.type === 'REQUIRED_ANY_OF') {
      for (const group of criterion.groups || []) {
        if (!group.some(id => itemResults[String(id)] === true)) return false;
      }
      continue;
    }
    if (criterion.type === 'MIN_DISTINCT_GROUPS_CORRECT') {
      const hitGroups = (criterion.groups || []).filter(group => group.some(id => itemResults[String(id)] === true)).length;
      if (hitGroups < Number(criterion.minimum || 0)) return false;
    }
  }
  return true;
}

function withCriteria(evaluation, result) {
  if (!result.complete || result.pending || result.correct === false) return result;
  const correct = criteriaSatisfied(evaluation.criteria || [], result.itemResults || {});
  return { ...result, correct };
}

function evaluateChoice(form, block) {
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

function normalizeControlledText(value) {
  return String(value ?? '').replace(/\r\n/g, '\n').trim();
}

function evaluateControlledText(form, block) {
  const input = form.elements.namedItem('openResponse');
  const value = typeof input?.value === 'string' ? input.value : '';
  if (!value.trim()) return { complete: false };
  const key = block.activity.evaluation?.answerKey || {};
  const accepted = Array.isArray(key.acceptedResults) ? key.acceptedResults
    : Object.prototype.hasOwnProperty.call(key, 'acceptedResult') ? [key.acceptedResult]
      : Object.prototype.hasOwnProperty.call(key, 'expected') ? [key.expected]
        : Object.prototype.hasOwnProperty.call(key, 'correct') ? [key.correct]
          : [];
  if (!accepted.length) return { complete: true, pending: true };
  const correct = accepted.some(expected => normalizeControlledText(value) === normalizeControlledText(expected));
  return { complete: true, correct, score: correct ? 1 : 0, itemResults: { 0: correct } };
}

function evaluateMultipleChoice(form, block) {
  const key = block.activity.evaluation?.answerKey || {};
  const selected = selectedIndexes(form, 'choice');
  if (!selected.length) return { complete: false };
  const expected = Array.isArray(key.correctIndexes) ? [...key.correctIndexes].sort((a, b) => a - b)
    : Array.isArray(key.correct) ? [...key.correct].sort((a, b) => a - b)
      : [];
  return { complete: true, correct: arraysEqual(selected, expected) };
}

function evaluateClassify(form, block) {
  const evaluation = block.activity.evaluation || {};
  const expected = evaluation.answerKey?.items || evaluation.answerKey || {};
  const entries = [...form.querySelectorAll('select[name^="classify:"]')];
  if (!entries.length || entries.some(select => !select.value)) return { complete: false };
  let hits = 0;
  const itemResults = {};
  for (const select of entries) {
    const itemKey = select.name.slice('classify:'.length);
    const expectedValue = expectedScalar(expected[itemKey]);
    const hit = normalizeComparable(select.value) === normalizeComparable(expectedValue);
    itemResults[itemKey] = hit;
    if (hit) hits += 1;
  }
  const score = hits / entries.length;
  return withCriteria(evaluation, { complete: true, correct: score >= (evaluation.threshold ?? 1), score, itemResults });
}

function evaluateSequence(form, block) {
  const key = block.activity.evaluation?.answerKey || {};
  const value = parseSequence(form, 'sequence');
  if (!value.length) return { complete: false };
  const accepted = Array.isArray(key.acceptedSequences) ? key.acceptedSequences
    : key.correctSequence ? [key.correctSequence]
      : Array.isArray(key.correct) && Array.isArray(key.correct[0]) ? key.correct
        : [key.correct || []];
  return { complete: true, correct: accepted.some(sequence => arraysEqual(value, sequence)) };
}

function evaluateCompositeEntry(form, block, entry, index, expected) {
  const key = entryKey(entry, index);
  const content = block.content || {};

  if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
    if (Object.prototype.hasOwnProperty.call(expected, 'stage1CorrectIndex') || Object.prototype.hasOwnProperty.call(expected, 'stage2CorrectIndex')) {
      const stage1 = selectedRadio(form, `round:${key}:stage1`);
      const stage2 = selectedRadio(form, `round:${key}:stage2`);
      if (!stage1 || !stage2) return { complete: false };
      return { complete: true, correct: Number(stage1.value) === expected.stage1CorrectIndex && Number(stage2.value) === expected.stage2CorrectIndex };
    }

    if (Array.isArray(expected.correctIndexes)) {
      const selected = selectedIndexes(form, `round:${key}`);
      if (!selected.length) return { complete: false };
      return { complete: true, correct: arraysEqual(selected, [...expected.correctIndexes].sort((a, b) => a - b)) };
    }

    if (Object.prototype.hasOwnProperty.call(expected, 'correctIndex')) {
      const selected = selectedRadio(form, `round:${key}`);
      if (!selected) return { complete: false };
      return { complete: true, correct: Number(selected.value) === expected.correctIndex };
    }

    const acceptedSequences = expected.acceptedSequences || (expected.correctSequence ? [expected.correctSequence] : null);
    if (Array.isArray(acceptedSequences)) {
      const value = parseSequence(form, `round-sequence:${key}`);
      if (!value.length) return { complete: false };
      return { complete: true, correct: acceptedSequences.some(sequence => arraysEqual(value, sequence)) };
    }

    const acceptedResults = expected.acceptedResults || (Object.prototype.hasOwnProperty.call(expected, 'acceptedResult') ? [expected.acceptedResult] : null);
    if (Array.isArray(acceptedResults)) {
      const input = form.elements.namedItem(`round-text:${key}`);
      const value = typeof input?.value === 'string' ? input.value.trim() : '';
      if (!value) return { complete: false };
      return { complete: true, correct: acceptedResults.some(item => normalizeComparable(value) === normalizeComparable(item)) };
    }
  }

  const scalar = expectedScalar(expected);
  if (scalar !== undefined) {
    const selected = selectedRadio(form, `round:${key}`);
    if (!selected) return { complete: false };
    const option = optionValue(entry, content, Number(selected.value));
    return { complete: true, correct: normalizeComparable(option) === normalizeComparable(scalar) };
  }

  if (Array.isArray(expected)) {
    const value = parseSequence(form, `round-sequence:${key}`);
    if (!value.length) return { complete: false };
    return { complete: true, correct: arraysEqual(value, expected) };
  }

  return { complete: true, pending: true };
}

function evaluateComposite(form, block) {
  const content = block.content || {};
  const evaluation = block.activity.evaluation || {};
  const expectedItems = evaluation.answerKey?.items || {};
  const entries = Array.isArray(content.items) && content.items.length ? content.items : Array.isArray(content.rounds) ? content.rounds : [];
  const threshold = evaluation.threshold ?? 1;

  if (!entries.length && Object.prototype.hasOwnProperty.call(evaluation.answerKey || {}, 'auditoryCorrect')) {
    const auditory = selectedRadio(form, 'auditory');
    const relation = selectedRadio(form, 'relation');
    if (!auditory || !relation) return { complete: false };
    const auditoryValue = content.auditoryOptions?.[Number(auditory.value)];
    return { complete: true, correct: normalizeComparable(auditoryValue) === normalizeComparable(evaluation.answerKey.auditoryCorrect) && Number(relation.value) === evaluation.answerKey.relationCorrectIndex };
  }

  if (!entries.length) return { complete: true, pending: true };

  let hits = 0;
  const itemResults = {};
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const key = entryKey(entry, index);
    let result = evaluateCompositeEntry(form, block, entry, index, expectedItems[key]);
    if (!result.complete) return result;
    if (result.pending) return { complete: true, pending: true };
    result = applyEvidenceResult(form, `round-evidence:${key}`, expectedItems[key]?.evidence, result);
    if (!result.complete) return result;
    itemResults[key] = result.correct === true;
    if (result.correct) hits += 1;
  }

  const score = hits / entries.length;
  return withCriteria(evaluation, { complete: true, correct: score >= threshold, score, itemResults });
}

export function evaluateDeterministic(form, block) {
  const interaction = block.activity?.interaction;
  let result;
  if (interaction === 'SINGLE_CHOICE') result = evaluateChoice(form, block);
  else if (interaction === 'MULTIPLE_CHOICE') result = evaluateMultipleChoice(form, block);
  else if (interaction === 'CLASSIFY' || interaction === 'MATCH') result = evaluateClassify(form, block);
  else if (interaction === 'SEQUENCE' || interaction === 'ORDER') result = evaluateSequence(form, block);
  else if (interaction === 'SHORT_TEXT') result = evaluateControlledText(form, block);
  else if (interaction === 'COMPOSITE') result = evaluateComposite(form, block);
  else result = { complete: true, pending: true };
  return applyEvidenceResult(form, 'evidence', block.activity?.evaluation?.answerKey?.evidence, result);
}
