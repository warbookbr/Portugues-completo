import fs from 'node:fs';

function replaceOnce(file, before, after) {
  let source = fs.readFileSync(file, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado encontrado ${count} vez(es).`);
  source = source.replace(before, after);
  fs.writeFileSync(file, source);
}

// 1) Normalizador: materialização semântica comum para autoria histórica da U03.
replaceOnce('app/js/services/content-normalizer-v1.js',
`function materializeLegacyActivity(block, sourceDocument) {
  let materialized = materializeExpectedItems(block);
  if (!sourceDocument || !block?.id) return materialized;
`,
`const LEGACY_PUBLIC_ANSWER_LABELS = Object.freeze({
  'esta-funcionando-como-mensagem-na-situacao': 'está funcionando como mensagem nesta situação',
  'nao-esta-funcionando-como-mensagem-na-situacao': 'não está funcionando como mensagem nesta situação'
});

function publicLegacyAnswer(value) {
  return LEGACY_PUBLIC_ANSWER_LABELS[value] || value;
}

function isOpenAuthoredActivity(block) {
  return block?.responseMode === 'free-text'
    || String(block?.interaction || '').includes('free-text')
    || String(block?.type || '').includes('open-production')
    || block?.type === 'required-open-production';
}

function materializeCommonLegacyActivity(block, sourceDocument) {
  let materialized = clone(block);

  if (!Array.isArray(materialized.items) && Array.isArray(materialized.contexts)) {
    materialized.items = materialized.contexts.map((item, index) => ({ ...clone(item), id: item.id || String(index) }));
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

  if (isOpenAuthoredActivity(materialized)) {
    const selfReviewQuestions = Array.isArray(materialized.selfReviewQuestions)
      ? materialized.selfReviewQuestions
      : Array.isArray(sourceDocument?.assessmentBehavior?.selfReview?.questions)
        ? sourceDocument.assessmentBehavior.selfReview.questions
        : [];
    materialized = {
      ...materialized,
      automaticValidation: false,
      recordResponse: true,
      interaction: Array.isArray(materialized.items) && materialized.items.length ? 'composite' : 'long-text',
      ...(selfReviewQuestions.length ? { selfReviewQuestions: clone(selfReviewQuestions) } : {})
    };
  }

  return materialized;
}

function materializeLegacyActivity(block, sourceDocument) {
  let materialized = materializeExpectedItems(materializeCommonLegacyActivity(block, sourceDocument));
  if (!sourceDocument || !block?.id) return materialized;
`);

replaceOnce('app/js/services/content-normalizer-v1.js',
`function normalizeInteraction(block) {
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
  throw new ContentNormalizationError('UNSUPPORTED_INTERACTION', \`Não foi possível normalizar a interação de \${block.id || block.type}.\`, { id: block.id, pedagogicalType: block.type, interaction: block.interaction });
}

function collectionHasAnswer(collection) {
  return Array.isArray(collection) && collection.some(item => item && typeof item === 'object' && ['correct', 'expected', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex'].some(key => Object.prototype.hasOwnProperty.call(item, key)));
}

function hasDeterministicKey(block) {
  return block.automaticValidation === true || ['correct', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex'].some(key => Object.prototype.hasOwnProperty.call(block, key)) || collectionHasAnswer(block.items) || collectionHasAnswer(block.rounds);
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
  for (const key of ['correct', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex']) if (Object.prototype.hasOwnProperty.call(block, key)) answerKey[key] = clone(block[key]);
  const itemAnswers = {};
  for (const collection of [block.items, block.rounds]) {
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
`,
`function entryHasAnswer(entry) {
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
  throw new ContentNormalizationError('UNSUPPORTED_INTERACTION', \`Não foi possível normalizar a interação de \${block.id || block.type}.\`, { id: block.id, pedagogicalType: block.type, interaction: block.interaction });
}

function normalizeEvaluationMode(block) {
  if (block.automaticValidation === false) return 'RELIABLE_EVALUATOR';
  if (hasDeterministicKey(block)) return 'DETERMINISTIC';
  if (block.recordResponse === true) return 'RELIABLE_EVALUATOR';
  return 'NONE';
}

function answerFromEntry(entry) {
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

function normalizeAnswerKey(block) {
  const answerKey = {};
  const topLevelKeys = ['correct', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
  for (const key of topLevelKeys) if (Object.prototype.hasOwnProperty.call(block, key)) answerKey[key] = clone(block[key]);
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
`);

replaceOnce('app/js/services/content-normalizer-v1.js',
`    criteria: [],
    threshold: Object.prototype.hasOwnProperty.call(policy, 'threshold') ? policy.threshold : null
`,
`    criteria: clone(policy.criteria || []),
    threshold: Object.prototype.hasOwnProperty.call(policy, 'threshold') ? policy.threshold : null
`);

replaceOnce('app/js/services/content-normalizer-v1.js',
`const PRESENTATION_SECRET_KEYS = new Set(['correct', 'expected', 'correctIndex', 'correctSequence', 'auditoryCorrect', 'relationCorrectIndex']);`,
`const PRESENTATION_SECRET_KEYS = new Set(['correct', 'expected', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'acceptedResult', 'acceptedResults', 'correctFunction', 'correctGroup', 'correctAnswer', 'auditoryCorrect', 'relationCorrectIndex']);`);

// 2) Renderer: usa avaliador compartilhado e cobre sequências, múltiplas respostas, texto controlado e pistas progressivas.
replaceOnce('app/js/ui/classic-renderer.js',
`import { speak } from '../services/narration-service.js';`,
`import { speak } from '../services/narration-service.js';
import { evaluateDeterministic as evaluateDeterministicActivity } from './classic-deterministic-evaluator.js';`);

replaceOnce('app/js/ui/classic-renderer.js',
`    'imageId', 'imageRevealAfterAttempt'
`,
`    'imageId', 'imageRevealAfterAttempt', 'modelExamplesAfterSubmission', 'preResponseModel',
    'automaticObservations', 'notAutomaticallyJudged', 'humanReview', 'humanOrExternalReview',
    'responseMode', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices', 'starter', 'wordBank'
`);

replaceOnce('app/js/ui/classic-renderer.js',
`function renderCompositeRound(entry, index, block) {
  const key = entryKey(entry, index);
  const localStimuli = renderItemStimuli(block.activity, key);
  const label = entryLabel(entry, index);

  if (Array.isArray(entry.pieces) || Array.isArray(entry.tokens) || Array.isArray(entry.availableAudioTokens) || Array.isArray(entry.availableWrittenChunks) || Array.isArray(entry.availableTiles)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${renderSequenceBuilder(entry.pieces || entry.tokens || entry.availableAudioTokens || entry.availableWrittenChunks || entry.availableTiles, \`round-sequence:\${key}\`)}</fieldset>\`;
  }

  if (Array.isArray(entry.options)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${optionMarkup(entry.options, \`round:\${key}\`)}</fieldset>\`;
  }
`,
`function renderCompositeRound(entry, index, block) {
  const key = entryKey(entry, index);
  const localStimuli = renderItemStimuli(block.activity, key);
  const label = entryLabel(entry, index);
  const expected = block.activity?.evaluation?.answerKey?.items?.[key];

  if (entry.stage1 && entry.stage2) {
    return \`<fieldset class="composite-round progressive-round" data-progressive-round><legend>\${esc(label)}</legend>\${localStimuli}
      <div class="composite-stage"><strong>1. Primeira decisão</strong><p>\${esc(entry.stage1.context || entry.stage1.question || '')}</p>\${optionMarkup(entry.stage1.options || [], \`round:\${key}:stage1\`)}</div>
      <button type="button" class="secondary-button compact-button" data-progressive-reveal>Ver nova pista</button>
      <div class="composite-stage" data-progressive-stage2 hidden><strong>2. Com a nova pista</strong><p>\${esc(entry.stage2.additionalClue || entry.stage2.question || '')}</p>\${optionMarkup(entry.stage2.options || [], \`round:\${key}:stage2\`)}</div>
    </fieldset>\`;
  }

  if (Array.isArray(entry.pieces) || Array.isArray(entry.tokens) || Array.isArray(entry.tiles) || Array.isArray(entry.availableAudioTokens) || Array.isArray(entry.availableWrittenChunks) || Array.isArray(entry.availableTiles)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${renderSequenceBuilder(entry.pieces || entry.tokens || entry.tiles || entry.availableAudioTokens || entry.availableWrittenChunks || entry.availableTiles, \`round-sequence:\${key}\`)}</fieldset>\`;
  }

  if (expected && typeof expected === 'object' && (Object.prototype.hasOwnProperty.call(expected, 'acceptedResult') || Array.isArray(expected.acceptedResults))) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}<label class="response-field"><span>Sua transformação</span><input name="round-text:\${esc(key)}" type="text" required></label></fieldset>\`;
  }

  if (Array.isArray(entry.options)) {
    const multiple = Boolean(expected && typeof expected === 'object' && Array.isArray(expected.correctIndexes) && expected.correctIndexes.length > 1);
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${optionMarkup(entry.options, \`round:\${key}\`, multiple)}</fieldset>\`;
  }
`);

replaceOnce('app/js/ui/classic-renderer.js',
`  return \`<div class="composite-round">\${localStimuli}\${unsupported(\`\${block.id}: rodada \${key} sem controle determinístico\`)}</div>\`;
}`,
`  if (block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR') {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}<label class="response-field"><span>Sua resposta</span><textarea name="round-text:\${esc(key)}" rows="4" required></textarea></label></fieldset>\`;
  }

  return \`<div class="composite-round">\${localStimuli}\${unsupported(\`\${block.id}: rodada \${key} sem controle determinístico\`)}</div>\`;
}`);

replaceOnce('app/js/ui/classic-renderer.js',
`function renderInteraction(block) {
  const content = block.content || {};
`,
`function renderSelfReview(block) {
  const questions = block.content?.selfReviewQuestions;
  if (!Array.isArray(questions) || !questions.length) return '';
  return \`<fieldset class="self-review"><legend>Autochecagem</legend>\${questions.map((question, index) => \`<label class="choice-option"><input type="checkbox" name="selfReview:\${index}" value="done" required><span>\${esc(question)}</span></label>\`).join('')}</fieldset>\`;
}

function renderInteraction(block) {
  const content = block.content || {};
`);

replaceOnce('app/js/ui/classic-renderer.js',
`    case 'LONG_TEXT':
    case 'ORAL_RESPONSE': return renderOpenInput(block, block.activity.interaction === 'ORAL_RESPONSE' ? 'Rascunho/registro da resposta oral nesta etapa técnica' : 'Sua resposta');
`,
`    case 'LONG_TEXT': {
      const promptChoice = Array.isArray(content.promptChoices) && content.promptChoices.length
        ? \`<fieldset class="choice-group"><legend>Escolha a intenção</legend>\${optionMarkup(content.promptChoices.map(item => item.instruction || item.id), 'openPromptChoice')}</fieldset>\`
        : '';
      const revision = content.revisionFlow ? '<label class="response-field"><span>Revisão opcional</span><textarea name="revisedResponse" rows="4"></textarea></label>' : '';
      return \`\${promptChoice}\${renderOpenInput(block, 'Sua resposta')}\${revision}\`;
    }
    case 'ORAL_RESPONSE': return renderOpenInput(block, 'Rascunho/registro da resposta oral nesta etapa técnica');
`);

replaceOnce('app/js/ui/classic-renderer.js',
`        \${renderInteraction(block)}
        <div class="activity-actions"><button class="primary-button" type="submit">\${pending ? 'Registrar resposta' : 'Verificar resposta'}</button></div>
`,
`        \${renderInteraction(block)}
        \${renderSelfReview(block)}
        <div class="activity-actions"><button class="primary-button" type="submit">\${pending ? 'Registrar resposta' : 'Verificar resposta'}</button></div>
`);

replaceOnce('app/js/ui/classic-renderer.js',
`    const result = block.activity.evaluation.mode === 'DETERMINISTIC' ? evaluateDeterministic(form, block) : { complete: true, pending: true };`,
`    const result = block.activity.evaluation.mode === 'DETERMINISTIC' ? evaluateDeterministicActivity(form, block) : { complete: true, pending: true };`);

replaceOnce('app/js/ui/classic-renderer.js',
`  root.querySelectorAll('[data-sequence-builder]').forEach(bindSequence);
`,
`  root.querySelectorAll('[data-sequence-builder]').forEach(bindSequence);
  root.querySelectorAll('[data-progressive-reveal]').forEach(button => button.addEventListener('click', () => {
    const round = button.closest('[data-progressive-round]');
    const stage1 = round?.querySelector('input[name$=":stage1"]:checked');
    if (!stage1) return;
    const stage2 = round.querySelector('[data-progressive-stage2]');
    if (stage2) stage2.hidden = false;
    button.disabled = true;
    button.textContent = 'Nova pista aberta';
  }));
`);

// 3) Progress binding: a persistência usa exatamente o mesmo avaliador determinístico.
replaceOnce('app/js/ui/classic-progress-binding.js',
`function selectedRadio(form, name) {`,
`import { evaluateDeterministic as evaluateDeterministicActivity } from './classic-deterministic-evaluator.js';

function selectedRadio(form, name) {`);

replaceOnce('app/js/ui/classic-progress-binding.js',
`      else result = block.activity.evaluation.mode === 'DETERMINISTIC' ? evaluateDeterministic(form, block) : { complete: true, pending: true };`,
`      else result = block.activity.evaluation.mode === 'DETERMINISTIC' ? evaluateDeterministicActivity(form, block) : { complete: true, pending: true };`);

// 4) Auditoria P7 passa a impedir vazamento dos novos campos internos.
replaceOnce('scripts/audit-p7-n0-u03.mjs',
`  assert.doesNotMatch(html, /\\b(?:schemaVersion|answerKey|competencyIds|evidenceRole)\\b/i, \`${source.id}: metadado técnico vazou no HTML.\`);`,
`  assert.doesNotMatch(html, /\\b(?:schemaVersion|answerKey|competencyIds|evidenceRole|acceptedSequences|correctIndexes|correctFunction|correctGroup|notAutomaticallyJudged|automaticObservations)\\b/i, \`${source.id}: metadado técnico vazou no HTML.\`);`);

console.log('Patch runtime P7/U03 aplicado.');
