function selectedRadio(form, name) {
  return form.querySelector(`input[name="${name}"]:checked`);
}

function normalizeComparable(value) {
  return typeof value === 'string' ? value.trim().toLocaleLowerCase('pt-BR') : value;
}

function parseSequence(form, name) {
  const input = [...form.querySelectorAll('[data-sequence-value]')].find(item => item.name === name);
  try { return JSON.parse(input?.value || '[]'); } catch { return []; }
}

function entryKey(entry, index) { return String(entry?.id ?? index); }

function evaluateChoice(form, block) {
  const key = block.activity.evaluation.answerKey || {};
  const selected = selectedRadio(form, 'choice');
  if (!selected) return { complete: false };
  const index = Number(selected.value);
  const option = block.content?.options?.[index];
  if (Object.prototype.hasOwnProperty.call(key, 'correctIndex')) return { complete: true, correct: index === key.correctIndex };
  if (Object.prototype.hasOwnProperty.call(key, 'correct')) return { complete: true, correct: normalizeComparable(option) === normalizeComparable(key.correct) };
  return { complete: true, pending: true };
}

function evaluateClassify(form, block) {
  const evaluation = block.activity.evaluation || {};
  const expected = evaluation.answerKey?.items || evaluation.answerKey || {};
  const entries = [...form.querySelectorAll('select[name^="classify:"]')];
  if (!entries.length || entries.some(select => !select.value)) return { complete: false };
  let hits = 0;
  for (const select of entries) {
    const itemKey = select.name.slice('classify:'.length);
    if (normalizeComparable(select.value) === normalizeComparable(expected[itemKey])) hits += 1;
  }
  const score = hits / entries.length;
  return { complete: true, correct: score >= (evaluation.threshold ?? 1), score };
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
  const multidimensional = Object.values(expectedItems).some(value => value && typeof value === 'object' && !Array.isArray(value) && ('auditoryCorrect' in value || 'relationCorrectIndex' in value));

  if (multidimensional) {
    let auditoryHits = 0;
    let relationHits = 0;
    for (let index = 0; index < entries.length; index += 1) {
      const key = entryKey(entries[index], index);
      const expected = expectedItems[key] || {};
      const auditory = selectedRadio(form, `round:${key}:auditory`);
      const relation = selectedRadio(form, `round:${key}:relation`);
      if (!auditory || !relation) return { complete: false };
      const auditoryValue = content.auditoryOptions?.[Number(auditory.value)];
      if (normalizeComparable(auditoryValue) === normalizeComparable(expected.auditoryCorrect)) auditoryHits += 1;
      if (Number(relation.value) === expected.relationCorrectIndex) relationHits += 1;
    }
    const auditoryScore = auditoryHits / entries.length;
    const relationScore = relationHits / entries.length;
    return { complete: true, correct: auditoryScore >= threshold && relationScore >= threshold, score: Math.min(auditoryScore, relationScore) };
  }

  let hits = 0;
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const key = entryKey(entry, index);
    const expected = expectedItems[key];
    if (Array.isArray(expected)) {
      const value = parseSequence(form, `round-sequence:${key}`);
      if (!value.length) return { complete: false };
      if (JSON.stringify(value) === JSON.stringify(expected)) hits += 1;
      continue;
    }
    const selected = selectedRadio(form, `round:${key}`);
    if (!selected) return { complete: false };
    const option = entry.options?.[Number(selected.value)];
    const expectedValue = expected && typeof expected === 'object' ? expected.correct ?? expected.expected : expected;
    if (normalizeComparable(option) === normalizeComparable(expectedValue)) hits += 1;
  }
  const score = hits / entries.length;
  return { complete: true, correct: score >= threshold, score };
}

function evaluateDeterministic(form, block) {
  const evaluation = block.activity.evaluation || {};
  const key = evaluation.answerKey || {};
  const interaction = block.activity.interaction;
  if (interaction === 'SINGLE_CHOICE') return evaluateChoice(form, block);
  if (interaction === 'MULTIPLE_CHOICE') {
    const selected = [...form.querySelectorAll('input[name="choice"]:checked')].map(input => Number(input.value));
    if (!selected.length) return { complete: false };
    const expected = Array.isArray(key.correct) ? key.correct : [];
    return { complete: true, correct: JSON.stringify([...selected].sort()) === JSON.stringify([...expected].sort()) };
  }
  if (interaction === 'CLASSIFY' || interaction === 'MATCH') return evaluateClassify(form, block);
  if (interaction === 'SEQUENCE' || interaction === 'ORDER') {
    const value = parseSequence(form, 'sequence');
    if (!value.length) return { complete: false };
    return { complete: true, correct: JSON.stringify(value) === JSON.stringify(key.correctSequence || key.correct || []) };
  }
  if (interaction === 'COMPOSITE') return evaluateComposite(form, block);
  return { complete: true, pending: true };
}

function collectResponse(form, block) {
  if (!block.activity?.evidence?.recordResponse) return undefined;
  const open = form.elements.namedItem('openResponse');
  if (open && typeof open.value === 'string') return open.value;
  const values = {};
  for (const [key, value] of new FormData(form).entries()) {
    if (key in values) values[key] = Array.isArray(values[key]) ? [...values[key], value] : [values[key], value];
    else values[key] = value;
  }
  return values;
}

function restoreResponse(form, block, documentRuntime, progress) {
  if (!block.activity?.evidence?.recordResponse) return;
  const ref = `${documentRuntime.id}/${block.id}`;
  const saved = progress?.responses?.[ref];
  const open = form.elements.namedItem('openResponse');
  if (saved && open && typeof saved.value === 'string') open.value = saved.value;
}

export function bindClassicProgress(root, documentRuntime, { progressService, onProgress = null } = {}) {
  if (!documentRuntime || !progressService) return;
  const byId = new Map(documentRuntime.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));
  const replayCounts = new Map();

  root.querySelectorAll('[data-activity-id]').forEach(card => {
    const block = byId.get(card.dataset.activityId);
    const form = card.querySelector('[data-activity-form]');
    if (!block || !form) return;
    restoreResponse(form, block, documentRuntime, progressService.getProgress());
    card.querySelectorAll('[data-tts]').forEach(button => button.addEventListener('click', () => {
      replayCounts.set(block.id, (replayCounts.get(block.id) || 0) + 1);
    }));

    form.addEventListener('submit', () => {
      const feedback = form.querySelector('[data-activity-feedback]');
      const state = feedback?.dataset.state;
      if (!state || state === 'missing') return;
      let result;
      if (state === 'correct') result = { complete: true, correct: true };
      else if (state === 'retry') result = { complete: true, correct: false };
      else if (state === 'pending') result = { complete: true, pending: true };
      else result = block.activity.evaluation.mode === 'DETERMINISTIC' ? evaluateDeterministic(form, block) : { complete: true, pending: true };
      if (!result.complete) return;
      const snapshot = progressService.recordActivity(documentRuntime, block, result, {
        response: collectResponse(form, block),
        support: { replayCount: replayCounts.get(block.id) || 0 }
      });
      replayCounts.set(block.id, 0);
      onProgress?.(snapshot);
    });
  });
}
