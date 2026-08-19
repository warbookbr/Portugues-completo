import { speak } from '../services/narration-service.js';
import { evaluateDeterministic as evaluateDeterministicActivity } from './classic-deterministic-evaluator.js';

const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const PUBLIC_LABELS = new Map([
  ['word', 'Palavra'], ['words', 'Palavras'], ['segments', 'Partes'], ['tiles', 'Fichas'],
  ['example', 'Exemplo'], ['examples', 'Exemplos'], ['possibleResponses', 'Exemplos possíveis'],
  ['explanation', 'Explicação'], ['stages', 'Etapas'], ['stage', 'Etapa'],
  ['display', 'Forma'], ['description', 'Descrição'], ['knownPartSources', 'Partes já conhecidas'],
  ['nonVisualMeaning', 'Significado'], ['contrast', 'Comparação'], ['contrasts', 'Comparações'],
  ['goal', 'Objetivo da mensagem'], ['candidate', 'Frase para revisar'], ['questions', 'Perguntas'],
  ['question', 'Pergunta'], ['wrongConclusion', 'Conclusão incorreta'],
  ['orderedEvents', 'Ordem dos acontecimentos'], ['firstInterpretation', 'Primeira interpretação'],
  ['revisedInterpretation', 'Interpretação revisada'], ['firstAnswer', 'Primeira resposta'],
  ['situation', 'Situação'], ['central', 'Ideia central'], ['detail', 'Detalhe'],
  ['text', 'Pergunta'], ['options', 'Opções'], ['firstDraft', 'Primeira versão'],
  ['selfCheck', 'Autochecagem'], ['revisedDraft', 'Versão revisada'],
  ['reviewPrompts', 'Perguntas para revisar'], ['starter', 'Início sugerido'],
  ['optionalWordBank', 'Palavras de apoio'], ['wordBank', 'Palavras de apoio'],
  ['optionalScaffold', 'Apoio opcional'], ['note', 'Observação']
]);

const pretty = value => {
  const raw = String(value ?? '');
  if (PUBLIC_LABELS.has(raw)) return PUBLIC_LABELS.get(raw);
  return raw
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .toLowerCase();
};

function valueText(value) {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number') return esc(value);
  if (typeof value === 'boolean') return value ? 'sim' : 'não';
  if (Array.isArray(value)) return value.map(item => `<span class="token">${valueText(item)}</span>`).join(' ');
  if (typeof value === 'object') {
    if (Array.isArray(value.tokens)) {
      const spacer = value.spaces === false ? '' : ' ';
      return esc(value.tokens.join(spacer));
    }
    return `<dl class="data-list">${Object.entries(value).map(([key, item]) => `<div><dt>${esc(pretty(key))}</dt><dd>${valueText(item)}</dd></div>`).join('')}</dl>`;
  }
  return esc(value);
}

function renderKnownContent(content = {}) {
  const lead = [];
  const details = [];
  const hiddenKeys = new Set([
    'options', 'categories', 'items', 'rounds', 'itemIds', 'claims',
    'availableTokens', 'availableAudioTokens', 'availableWrittenChunks', 'availableTiles',
    'auditoryOptions', 'relationOptions', 'pulseOptions', 'wholeWordOptions', 'audioOptions',
    'visualOptions', 'nonVisualOptions', 'word', 'wordDisplay', 'canonicalWord', 'segments', 'segmentsForRescue',
    'ttsCue', 'ttsText', 'feedbackTts', 'feedbackTtsAfterSecondAttempt', 'feedbackRule',
    'initialSupportLevel', 'supportLevel', 'initialDisplay', 'supportButtonLabel', 'supportInitiallyHidden',
    'supportAvailableAfterFirstAttempt', 'supportAvailableBeforeAudioChoices', 'syllableSupportAvailable',
    'supportUseIsError', 'syllableSupportUseIsError', 'trackSupportUseSeparatelyFromAccuracy',
    'trackFirstAttemptWithoutSupport', 'attemptGateRequired', 'audioOptionTextVisible',
    'audioOptionsVisibleBeforeAttemptGate', 'ttsAvailableBeforeAttempt', 'ttsAvailableBeforeBothAttempts',
    'targetTtsAvailableBeforeResponse', 'targetTtsBeforeResponse', 'targetTtsAvailableBeforeReading',
    'ttsBeforeResponse', 'allowReplayWithoutPenalty', 'repeatAudio', 'requiredTileCount', 'optionOrderShouldVaryAcrossAttempts',
    'imageId', 'imageRevealAfterAttempt', 'modelExamplesAfterSubmission', 'preResponseModel',
    'automaticObservations', 'notAutomaticallyJudged', 'humanReview', 'humanOrExternalReview',
    'responseMode', 'selfReview', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices',
    'purpose', 'revealPolicy', 'followUp', 'evidenceOptions', 'evidenceSelectionMode', 'evidenceMatchMode',
    'cards', 'optionalScaffold', 'planningChecklist', 'principleQuestion', 'principleOptions', 'automaticCheck',
    'textRemainsVisible', 'textRef', 'competency'
  ]);

  if (content.title) lead.push(`<h3>${esc(content.title)}</h3>`);
  if (content.text) lead.push(`<p>${esc(content.text)}</p>`);
  if (content.prompt) lead.push(`<p class="activity-prompt">${esc(content.prompt)}</p>`);
  if (content.instruction) lead.push(`<p class="activity-instruction">${esc(content.instruction)}</p>`);
  if (content.model !== undefined) lead.push(`<div class="model-box"><span>Modelo</span><strong>${valueText(content.model)}</strong></div>`);
  if (content.letter) lead.push(`<div class="model-box"><span>Letra</span><strong>${esc(content.letter)}</strong></div>`);

  const word = content.wordDisplay ?? content.word ?? content.canonicalWord;
  if (word) lead.push(`<div class="model-box"><span>Palavra</span><strong>${esc(word)}</strong></div>`);

  if (content.ttsCue) {
    lead.push(`<button type="button" class="secondary-button stimulus-button" data-tts="${esc(content.ttsCue)}">Ouvir palavra</button>`);
  }
  if (content.ttsText) {
    lead.push(`<button type="button" class="secondary-button stimulus-button" data-tts="${esc(content.ttsText)}">Ouvir exemplo</button>`);
  }

  const segments = content.segments ?? content.segmentsForRescue;
  if (Array.isArray(segments) && segments.length) {
    const onDemand = Boolean(content.supportButtonLabel || content.supportInitiallyHidden || content.initialSupportLevel === 'apoio-sob-demanda');
    if (onDemand) {
      const label = content.supportButtonLabel || 'Mostrar partes';
      lead.push(`<details class="support-disclosure"><summary>${esc(label)}</summary><div class="model-box"><span>Partes</span><strong>${valueText(segments)}</strong></div></details>`);
    } else {
      lead.push(`<div class="model-box"><span>Partes</span><strong>${valueText(segments)}</strong></div>`);
    }
  }

  if (content.nonVisualMeaning) {
    lead.push(`<div class="meaning-support"><strong>Significado</strong><p>${esc(content.nonVisualMeaning)}</p></div>`);
  }

  for (const [key, value] of Object.entries(content)) {
    if (['title', 'text', 'prompt', 'instruction', 'model', 'letter', 'nonVisualMeaning'].includes(key) || hiddenKeys.has(key)) continue;
    const lower = key.toLowerCase();
    if (lower.includes('guard') || lower.includes('correct') || lower.includes('feedback') || lower.includes('available') || lower.includes('support') || lower.includes('tts') || lower.includes('media') || lower.includes('audio') || key === 'feedback') continue;
    if (value === null || value === undefined || value === false || value === '') continue;
    details.push(`<div class="content-detail"><strong>${esc(pretty(key))}</strong><div>${valueText(value)}</div></div>`);
  }

  return `${lead.join('')}${details.length ? `<div class="content-details">${details.join('')}</div>` : ''}`;
}

function renderStimulus(stimulus, index) {
  const id = `stimulus-${index}`;
  if (stimulus.type === 'TTS') {
    const text = stimulus.payload?.text || stimulus.payload?.content || '';
    return `<button type="button" class="secondary-button stimulus-button" data-tts="${esc(text)}">Ouvir com TTS</button>`;
  }
  if (stimulus.type === 'CONTROLLED_AUDIO') {
    return `<div class="media-placeholder" role="status"><strong>Áudio ainda não disponível</strong><span>Este exercício precisa de um áudio específico que ainda está em preparação.</span></div>`;
  }
  if (stimulus.type === 'SEMANTIC_UI') {
    const payload = stimulus.payload || {};
    return `<div class="semantic-stimulus">${valueText(payload.visibleText ?? payload.content ?? payload.model ?? payload)}</div>`;
  }
  if (stimulus.type === 'TEXT') {
    const payload = stimulus.payload || {};
    if (payload.sourceBlockId) return `<div class="stimulus-reference">Use como referência o trecho ${esc(payload.sourceBlockId)} acima.</div>`;
    return `<div class="semantic-stimulus">${valueText(payload.content ?? payload)}</div>`;
  }
  return `<details class="stimulus-data"><summary>Material de apoio da atividade</summary>${valueText(stimulus.payload || {})}</details>`;
}

function renderStimulusList(stimuli) {
  return stimuli.length ? `<div class="stimuli">${stimuli.map(renderStimulus).join('')}</div>` : '';
}

function renderStimuli(activity) {
  return renderStimulusList((activity?.stimuli || []).filter(stimulus => stimulus.payload?.itemId === undefined || stimulus.payload?.itemId === null));
}

function renderItemStimuli(activity, key) {
  const match = String(key);
  return renderStimulusList((activity?.stimuli || []).filter(stimulus => String(stimulus.payload?.itemId) === match));
}

function evidenceBadge(activity) {
  const evidence = activity.evidence || {};
  const label = evidence.requiredForCompletion ? 'Evidência necessária' : evidence.role === 'PRACTICE' ? 'Prática' : pretty(evidence.role || 'atividade');
  return `<span class="activity-badge ${evidence.requiredForCompletion ? 'is-required' : ''}">${esc(label)}</span>`;
}

function optionMarkup(options = [], name, multiple = false) {
  return options.map((option, index) => `
    <label class="choice-option">
      <input type="${multiple ? 'checkbox' : 'radio'}" name="${esc(name)}" value="${index}">
      <span>${valueText(option)}</span>
    </label>`).join('');
}

function audioOptionMarkup(options = [], name) {
  return options.map((mediaId, index) => `
    <label class="choice-option audio-choice-option">
      <input type="radio" name="${esc(name)}" value="${index}">
      <span><strong>Opção ${index + 1}</strong><small>áudio controlado pendente</small></span>
    </label>`).join('');
}

function ttsAudioOptionMarkup(options = [], name, gated = false) {
  const controls = options.map((option, index) => {
    const label = option?.label || `Opção ${index + 1}`;
    const ttsText = option?.ttsText || '';
    const disabled = gated ? ' disabled data-gated-control' : '';
    return `
      <div class="choice-option audio-choice-option">
        <label><input type="radio" name="${esc(name)}" value="${index}"${disabled}><span>${esc(label)}</span></label>
        <button type="button" class="secondary-button compact-button" data-tts="${esc(ttsText)}"${disabled}>Ouvir ${esc(label)}</button>
      </div>`;
  }).join('');
  if (!gated) return controls;
  return `<div class="gated-choice-set" data-gated-choice-set>
    <button type="button" class="secondary-button compact-button" data-attempt-gate>Marcar que tentei ler</button>
    <div class="gated-choice-options">${controls}</div>
  </div>`;
}

function sharedCompositeOptions(block) {
  const values = Object.values(block.activity?.evaluation?.answerKey?.items || {})
    .map(value => value && typeof value === 'object' && !Array.isArray(value) ? value.correct ?? value.expected : value)
    .filter(value => ['string', 'number', 'boolean'].includes(typeof value));
  const uniqueValues = [...new Set(values)];
  return uniqueValues.length >= 2 && uniqueValues.length <= 6 ? uniqueValues : [];
}

function unsupported(label) {
  return `<div class="unsupported-state" role="alert"><strong>Interação ainda não suportada</strong><span>${esc(label)}</span></div>`;
}

function classifyItems(block) {
  const content = block.content || {};
  if (Array.isArray(content.items) && content.items.length) return content.items.map((item, index) => ({
    key: item.id || String(index),
    label: item.displayLabel ?? item.stimulus ?? item.text ?? item.claim ?? `Item ${index + 1}`
  }));
  if (Array.isArray(content.claims)) return content.claims.map((claim, index) => ({ key: String(index), label: claim }));
  if (Array.isArray(content.itemIds)) return content.itemIds.map((key, index) => ({ key: String(key), label: `Item ${index + 1}` }));
  const answerItems = block.activity?.evaluation?.answerKey?.items || {};
  return Object.keys(answerItems).map((key, index) => ({ key, label: `Item ${index + 1}` }));
}

function classifyCategories(block) {
  const content = block.content || {};
  if (Array.isArray(content.categories)) return content.categories;
  const key = block.activity?.evaluation?.answerKey?.items || {};
  return [...new Set(Object.values(key).filter(value => typeof value === 'string'))];
}

function renderClassify(block) {
  const items = classifyItems(block);
  const categories = classifyCategories(block);
  if (!items.length || !categories.length) return unsupported(`${block.id}: classificação sem itens/categorias suficientes`);
  return `<div class="classify-grid">${items.map(item => `
    <div class="classify-row">
      <div class="classify-stimulus"><span>${valueText(item.label)}</span>${renderItemStimuli(block.activity, item.key)}</div>
      <label><span class="sr-only">Classificação de ${esc(item.label)}</span><select name="classify:${esc(item.key)}" required>
        <option value="">Selecione</option>
        ${categories.map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join('')}
      </select></label>
    </div>`).join('')}</div>`;
}

function renderSequenceBuilder(tokens, name = 'sequence') {
  if (!Array.isArray(tokens) || !tokens.length) return unsupported(`sequência ${name} sem peças`);
  return `<div class="sequence-builder" data-sequence-builder>
    <div class="token-bank" aria-label="Itens disponíveis">${tokens.map((token, index) => {
      const audioToken = typeof token === 'string' && token.includes('AUD-');
      const label = audioToken ? `<span>Ficha ${index + 1}</span><small>áudio pendente</small>` : valueText(token === 'SPACE' ? 'espaço' : token);
      return `<button type="button" class="token-button" data-sequence-token="${index}" data-value="${esc(typeof token === 'string' ? token : JSON.stringify(token))}">${label}</button>`;
    }).join('')}</div>
    <input type="hidden" name="${esc(name)}" data-sequence-value value="[]">
    <div class="sequence-answer" data-sequence-answer aria-live="polite">Sua sequência aparecerá aqui.</div>
    <button type="button" class="secondary-button compact-button" data-sequence-clear>Limpar sequência</button>
  </div>`;
}

function renderSequence(block) {
  const tokens = block.content?.availableTokens || block.content?.availableAudioTokens || block.content?.availableWrittenChunks || block.content?.availableTiles || block.content?.options || block.content?.model || [];
  return renderSequenceBuilder(tokens, 'sequence');
}

function renderOpenInput(block, label = 'Sua resposta') {
  const interaction = block.activity?.interaction;
  const rows = interaction === 'SHORT_TEXT' ? 2 : interaction === 'LONG_TEXT' ? 9 : 6;
  return `<label class="response-field"><span>${esc(label)}</span><textarea name="openResponse" rows="${rows}" required></textarea></label>`;
}

function renderEvidenceSelector(content = {}, name = 'evidence') {
  const options = content.evidenceOptions;
  if (!Array.isArray(options) || !options.length) return '';
  const multiple = content.evidenceSelectionMode === 'MULTIPLE';
  const prompt = content.followUp || (multiple ? 'Marque os trechos do texto que sustentam sua resposta.' : 'Marque um trecho do texto que sustenta sua resposta.');
  return `<fieldset class="choice-group evidence-selector" data-evidence-selection><legend>${esc(prompt)}</legend>${optionMarkup(options, name, multiple)}</fieldset>`;
}

function entryKey(entry, index) {
  return String(entry?.id ?? index);
}

function entryLabel(entry, index) {
  if (entry?.prompt) return entry.prompt;
  if (entry?.letter) return `Letra ${entry.letter}`;
  if (entry?.model !== undefined) return `Modelo: ${Array.isArray(entry.model) ? entry.model.join(' ') : entry.model}`;
  if (entry?.sequence) return `Complete: ${Array.isArray(entry.sequence) ? entry.sequence.join(' ') : entry.sequence}`;
  if (typeof entry?.stimulus === 'string' && !entry.stimulus.includes('AUD-')) return entry.stimulus;
  return `Rodada ${index + 1}`;
}

function renderCompositeRound(entry, index, block) {
  const key = entryKey(entry, index);
  const localStimuli = renderItemStimuli(block.activity, key);
  const label = entryLabel(entry, index);
  const expected = block.activity?.evaluation?.answerKey?.items?.[key];

  if (entry.stage1 && entry.stage2) {
    return `<fieldset class="composite-round progressive-round" data-progressive-round><legend>${esc(label)}</legend>${localStimuli}
      <div class="composite-stage"><strong>1. Primeira decisão</strong><p>${esc(entry.stage1.context || entry.stage1.question || '')}</p>${optionMarkup(entry.stage1.options || [], `round:${key}:stage1`)}</div>
      <button type="button" class="secondary-button compact-button" data-progressive-reveal>Ver nova pista</button>
      <div class="composite-stage" data-progressive-stage2 hidden><strong>2. Com a nova pista</strong><p>${esc(entry.stage2.additionalClue || entry.stage2.question || '')}</p>${optionMarkup(entry.stage2.options || [], `round:${key}:stage2`)}</div>
    </fieldset>`;
  }

  if (Array.isArray(entry.pieces) || Array.isArray(entry.tokens) || Array.isArray(entry.tiles) || Array.isArray(entry.availableAudioTokens) || Array.isArray(entry.availableWrittenChunks) || Array.isArray(entry.availableTiles)) {
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}${renderSequenceBuilder(entry.pieces || entry.tokens || entry.tiles || entry.availableAudioTokens || entry.availableWrittenChunks || entry.availableTiles, `round-sequence:${key}`)}</fieldset>`;
  }

  if (expected && typeof expected === 'object' && (Object.prototype.hasOwnProperty.call(expected, 'acceptedResult') || Array.isArray(expected.acceptedResults))) {
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}<label class="response-field"><span>Sua transformação</span><input name="round-text:${esc(key)}" type="text" required></label></fieldset>`;
  }

  if (Array.isArray(entry.options)) {
    const multiple = Boolean(expected && typeof expected === 'object' && Array.isArray(expected.correctIndexes) && expected.correctIndexes.length > 1);
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}${optionMarkup(entry.options, `round:${key}`, multiple)}${renderEvidenceSelector(entry, `round-evidence:${key}`)}</fieldset>`;
  }

  if (Array.isArray(entry.nonVisualOptions)) {
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}${optionMarkup(entry.nonVisualOptions, `round:${key}`)}</fieldset>`;
  }

  if (Array.isArray(entry.audioOptions)) {
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}${ttsAudioOptionMarkup(entry.audioOptions, `round:${key}`, Boolean(block.content?.attemptGateRequired || entry.attemptGateRequired))}</fieldset>`;
  }

  if (Array.isArray(entry.wholeWordOptions)) {
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}${audioOptionMarkup(entry.wholeWordOptions, `round:${key}`)}</fieldset>`;
  }

  if (Array.isArray(block.content?.pulseOptions)) {
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}${optionMarkup(block.content.pulseOptions, `round:${key}`)}</fieldset>`;
  }

  const sharedOptions = sharedCompositeOptions(block);
  if (sharedOptions.length) {
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}${optionMarkup(sharedOptions, `round:${key}`)}</fieldset>`;
  }

  if (block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR') {
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}<label class="response-field"><span>Sua resposta</span><textarea name="round-text:${esc(key)}" rows="4" required></textarea></label></fieldset>`;
  }

  return `<div class="composite-round">${localStimuli}${unsupported(`${block.id}: rodada ${key} sem controle determinístico`)}</div>`;
}

function renderComposite(block) {
  const content = block.content || {};
  const entries = Array.isArray(content.items) && content.items.length ? content.items : Array.isArray(content.rounds) ? content.rounds : [];

  if (entries.length && Array.isArray(content.auditoryOptions) && Array.isArray(content.relationOptions)) {
    return `<div class="composite-rounds">${entries.map((entry, index) => {
      const key = entryKey(entry, index);
      return `<fieldset class="composite-round"><legend>${esc(`Rodada ${index + 1}`)}</legend>${renderItemStimuli(block.activity, key)}
        <div class="composite-stage"><strong>1. Julgamento auditivo</strong>${optionMarkup(content.auditoryOptions, `round:${key}:auditory`)}</div>
        <div class="reveal-note">Depois de registrar a percepção auditiva, compare a relação indicada pela escrita.</div>
        <div class="composite-stage"><strong>2. Relação observada</strong>${optionMarkup(content.relationOptions, `round:${key}:relation`)}</div>
      </fieldset>`;
    }).join('')}</div>`;
  }

  if (entries.length) return `<div class="composite-rounds">${entries.map((entry, index) => renderCompositeRound(entry, index, block)).join('')}</div>`;

  if (Array.isArray(content.auditoryOptions) && Array.isArray(content.relationOptions)) {
    return `
      <fieldset class="choice-group"><legend>${esc(content.prompt || 'Primeira etapa')}</legend>${optionMarkup(content.auditoryOptions, 'auditory')}</fieldset>
      <div class="reveal-note">A relação escrita pode ser observada após registrar sua percepção auditiva.</div>
      <fieldset class="choice-group"><legend>${esc(content.relationPrompt || 'Segunda etapa')}</legend>${optionMarkup(content.relationOptions, 'relation')}</fieldset>`;
  }

  if (block.activity?.evaluation?.mode === 'DETERMINISTIC') return unsupported(`${block.id}: atividade composta determinística sem estrutura renderizável`);
  return renderOpenInput(block, 'Registre sua resposta para esta atividade composta');
}

function renderOptionalScaffold(block) {
  const scaffold = block.content?.optionalScaffold;
  if (!scaffold || scaffold.availableOnDemand === false) return '';
  const starter = typeof scaffold.starter === 'string' && scaffold.starter.trim()
    ? `<div class="content-detail"><strong>Início sugerido</strong><div>${esc(scaffold.starter)}</div></div>`
    : '';
  const words = Array.isArray(scaffold.wordBank) && scaffold.wordBank.length
    ? `<div class="content-detail"><strong>Palavras de apoio</strong><div>${scaffold.wordBank.map(item => `<span class="token">${esc(item)}</span>`).join(' ')}</div></div>`
    : '';
  if (!starter && !words) return '';
  return `<details class="support-disclosure optional-scaffold" data-optional-scaffold><summary>Ver apoio opcional</summary><div class="content-details">${starter}${words}</div></details>`;
}

function renderPlanningChecklist(block) {
  const items = block.content?.planningChecklist;
  if (!Array.isArray(items) || !items.length) return '';
  const prompt = block.content?.planningPrompt || 'Antes de escrever, confirme as informações essenciais.';
  return `<fieldset class="self-review planning-checklist"><legend>${esc(prompt)}</legend>${items.map((item, index) => `<label class="choice-option"><input type="checkbox" name="planning:${index}" value="done" required><span>${esc(item)}</span></label>`).join('')}</fieldset>`;
}

function renderSelfReview(block) {
  const questions = block.content?.selfReviewQuestions;
  if (!Array.isArray(questions) || !questions.length) return '';
  return `<fieldset class="self-review"><legend>Autochecagem</legend>${questions.map((question, index) => `<label class="choice-option"><input type="checkbox" name="selfReview:${index}" value="done" required><span>${esc(question)}</span></label>`).join('')}</fieldset>`;
}

function renderInteraction(block) {
  const content = block.content || {};
  switch (block.activity?.interaction) {
    case 'SINGLE_CHOICE': {
      if (Array.isArray(content.audioOptions)) {
        return `<fieldset class="choice-group"><legend class="sr-only">Escolha uma opção de áudio</legend>${ttsAudioOptionMarkup(content.audioOptions, 'choice', Boolean(content.attemptGateRequired))}</fieldset>`;
      }
      const choices = content.nonVisualOptions || content.wholeWordOptions || content.options || content.availableTiles || [];
      return `<fieldset class="choice-group"><legend class="sr-only">Escolha uma opção</legend>${Array.isArray(content.wholeWordOptions) && !content.nonVisualOptions ? audioOptionMarkup(choices, 'choice') : optionMarkup(choices, 'choice')}</fieldset>`;
    }
    case 'MULTIPLE_CHOICE': return `<fieldset class="choice-group"><legend class="sr-only">Escolha uma ou mais opções</legend>${optionMarkup(content.options || [], 'choice', true)}</fieldset>`;
    case 'CLASSIFY': return renderClassify(block);
    case 'SEQUENCE':
    case 'ORDER': return renderSequence(block);
    case 'MATCH': return renderClassify(block);
    case 'SHORT_TEXT':
    case 'STRUCTURED_RESPONSE':
    case 'LONG_TEXT': {
      const promptChoice = Array.isArray(content.promptChoices) && content.promptChoices.length
        ? `<fieldset class="choice-group"><legend>Escolha a intenção</legend>${optionMarkup(content.promptChoices.map(item => item.instruction || item.id), 'openPromptChoice')}</fieldset>`
        : '';
      const revision = content.revisionFlow ? '<label class="response-field"><span>Revisão opcional</span><textarea name="revisedResponse" rows="4"></textarea></label>' : '';
      return `${promptChoice}${renderOpenInput(block, 'Sua resposta')}${revision}`;
    }
    case 'ORAL_RESPONSE': return renderOpenInput(block, 'Rascunho/registro da resposta oral nesta etapa técnica');
    case 'COMPOSITE': return renderComposite(block);
    default: return unsupported(block.activity?.interaction || 'desconhecida');
  }
}

export function renderActivity(block) {
  const evaluation = block.activity?.evaluation || {};
  const pending = evaluation.mode === 'RELIABLE_EVALUATOR';
  return `
    <article class="lesson-block activity-card" id="${esc(block.id)}" data-activity-id="${esc(block.id)}" data-evaluation-mode="${esc(evaluation.mode || 'NONE')}" data-feedback-timing="${esc(evaluation.feedbackTiming || 'AFTER_ACTIVITY')}">
      <header class="block-header">
        <div><span class="block-kicker">${esc(pretty(block.pedagogicalType || 'atividade'))}</span>${evidenceBadge(block.activity)}</div>
        <span class="activity-mode">${pending ? 'avaliação pendente' : evaluation.mode === 'DETERMINISTIC' ? 'correção objetiva' : 'atividade'}</span>
      </header>
      ${renderKnownContent(block.content)}
      ${renderStimuli(block.activity)}
      <form class="activity-form" data-activity-form novalidate>
        ${renderOptionalScaffold(block)}
        ${renderPlanningChecklist(block)}
        ${renderInteraction(block)}
        ${renderEvidenceSelector(block.content)}
        ${renderSelfReview(block)}
        <div class="activity-actions"><button class="primary-button" type="submit">${pending ? 'Registrar resposta' : 'Verificar resposta'}</button></div>
        <div class="activity-feedback" data-activity-feedback aria-live="polite"></div>
      </form>
    </article>`;
}

export function renderContentBlock(block) {
  return `<article class="lesson-block content-card" id="${esc(block.id)}"><span class="block-kicker">${esc(pretty(block.pedagogicalType || 'conteúdo'))}</span>${renderKnownContent(block.content)}</article>`;
}

function completionSummary(document) {
  const clusters = document.completion?.clusters || [];
  if (!clusters.length) return '';
  return `<aside class="completion-card"><h2>Como esta etapa é concluída</h2><p>Conclusão não significa automaticamente domínio consolidado. As evidências abaixo serão conectadas ao progresso no P5.</p><ul>${clusters.map(cluster => `<li><strong>${esc(pretty(cluster.id))}</strong> · ${esc(pretty(cluster.satisfaction))}${cluster.minimumEvidence ? ` · mínimo ${cluster.minimumEvidence}` : ''}</li>`).join('')}</ul></aside>`;
}

const SAFE_VERIFICATION_INTRO = 'Nesta verificação, você vai usar o que estudou nesta unidade em novas atividades. Leia com atenção e volte ao texto sempre que precisar.';
const SAFE_LESSON_INTRO = 'Nesta lição, você vai estudar o conteúdo passo a passo.';

function publicDocumentIntro(document, verification) {
  if (verification) return document.presentation?.intro || SAFE_VERIFICATION_INTRO;
  return document.presentation?.intro || SAFE_LESSON_INTRO;
}

export function documentHtml(document, { unitId, unitTitle, verification = false } = {}) {
  const kindLabel = verification ? 'Verificação da unidade' : 'Lição';
  return `
    <div class="course-view reading-content" data-document-id="${esc(document.id)}">
      <nav class="breadcrumbs" aria-label="Navegação estrutural"><a href="#/">Curso</a><span>›</span><a href="#/unidade/${esc(unitId)}">${esc(unitTitle || unitId)}</a><span>›</span><span aria-current="page">${esc(document.title)}</span></nav>
      <header class="lesson-hero">
        <span class="eyebrow">${kindLabel}</span>
        <h1>${esc(document.title)}</h1>
        <p>${esc(publicDocumentIntro(document, verification))}</p>
        ${document.competencyIds?.length ? `<div class="competency-chips">${document.competencyIds.map(id => `<span>${esc(id)}</span>`).join('')}</div>` : ''}
      </header>
      <section class="lesson-stream">${document.blocks.map(block => block.kind === 'ACTIVITY' ? renderActivity(block) : renderContentBlock(block)).join('')}</section>
      ${completionSummary(document)}
    </div>`;
}

export function unitHtml(manifest) {
  return `
    <div class="course-view reading-content" data-unit-id="${esc(manifest.id)}">
      <nav class="breadcrumbs" aria-label="Navegação estrutural"><a href="#/">Curso</a><span>›</span><span aria-current="page">${esc(manifest.title)}</span></nav>
      <header class="unit-hero">
        <div><span class="eyebrow">${esc(manifest.levelId)} · Unidade ${manifest.order}</span><h1>${esc(manifest.title)}</h1><p>${esc(manifest.objective)}</p></div>
        <div class="publication-state"><strong>${esc(manifest.publication.status)}</strong><span>${manifest.publication.blockers.length ? `${manifest.publication.blockers.length} pendência(s) rastreada(s)` : 'sem blockers registrados'}</span></div>
      </header>
      <section class="competency-panel"><h2>Competências desta unidade</h2><div class="competency-list">${manifest.competencies.map(item => `<article><span>${esc(item.id)}</span><p>${esc(item.label)}</p></article>`).join('')}</div></section>
      <section class="lesson-list"><div class="section-heading"><div><span class="block-kicker">Percurso</span><h2>Lições</h2></div><span>${manifest.lessons.length} lições</span></div>${manifest.lessons.map(lesson => `<a class="lesson-link" href="#/unidade/${esc(manifest.id)}/licao/${esc(lesson.id)}"><span class="lesson-number">${String(lesson.order).padStart(2, '0')}</span><span><strong>${esc(lesson.title)}</strong><small>${esc((lesson.competencyIds || []).join(' · '))}</small></span><span aria-hidden="true">→</span></a>`).join('')}</section>
      ${manifest.verification ? `<a class="verification-link" href="#/unidade/${esc(manifest.id)}/verificacao"><span><strong>Verificação integrada</strong><small>${esc(manifest.verification.id)}</small></span><span aria-hidden="true">→</span></a>` : ''}
      ${manifest.publication.blockers.length ? `<aside class="blocker-card"><strong>Pendências de publicação registradas</strong><ul>${manifest.publication.blockers.map(item => `<li>${esc(item)}</li>`).join('')}</ul><p>Essas pendências bloqueiam apenas o escopo que realmente depende delas; o restante do desenvolvimento continua.</p></aside>` : ''}
    </div>`;
}

export function homeHtml(course, manifests = []) {
  return `
    <div class="course-view reading-content">
      <header class="home-hero"><span class="eyebrow">Modo Clássico</span><h1>${esc(course.title)}</h1><p>${esc(course.description)}</p><div class="home-status">Catálogo real conectado · ${course.units.length} unidades no slice atual · sem gamificação</div></header>
      <section class="catalog-grid">${course.units.map(unit => {
        const manifest = manifests.find(item => item.id === unit.id);
        return `<a class="unit-card" href="#/unidade/${esc(unit.id)}"><span class="block-kicker">${esc(unit.levelId)} · Unidade ${unit.order}</span><h2>${esc(unit.title)}</h2><p>${manifest ? esc(manifest.objective) : 'Carregar unidade'}</p><footer><span>${manifest ? `${manifest.lessons.length} lições` : 'manifesto'}</span><strong>Estudar →</strong></footer></a>`;
      }).join('')}</section>
    </div>`;
}

function selectedRadio(form, name) {
  return form.querySelector(`input[name="${name}"]:checked`);
}

function normalizeComparable(value) {
  if (typeof value === 'string') return value.trim().toLocaleLowerCase('pt-BR');
  return value;
}

function evaluateChoice(form, block) {
  const key = block.activity.evaluation.answerKey || {};
  const selected = selectedRadio(form, 'choice');
  if (!selected) return { complete: false };
  const index = Number(selected.value);
  const option = block.content?.options?.[index] ?? block.content?.nonVisualOptions?.[index] ?? block.content?.audioOptions?.[index] ?? block.content?.wholeWordOptions?.[index] ?? block.content?.availableTiles?.[index];
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
  const threshold = evaluation.threshold ?? 1;
  return { complete: true, correct: score >= threshold, score };
}

function parseSequence(form, name) {
  const input = [...form.querySelectorAll('[data-sequence-value]')].find(item => item.name === name);
  try { return JSON.parse(input?.value || '[]'); } catch { return []; }
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
    const selectedIndex = Number(selected.value);
    if (Number.isInteger(expected)) {
      if (selectedIndex === expected) hits += 1;
      continue;
    }
    if (expected && typeof expected === 'object' && Number.isInteger(expected.correctIndex)) {
      if (selectedIndex === expected.correctIndex) hits += 1;
      continue;
    }
    const sharedOptions = sharedCompositeOptions(block);
    const option = entry.options?.[selectedIndex] ?? entry.nonVisualOptions?.[selectedIndex] ?? entry.audioOptions?.[selectedIndex] ?? entry.wholeWordOptions?.[selectedIndex] ?? entry.availableTiles?.[selectedIndex] ?? content.pulseOptions?.[selectedIndex] ?? sharedOptions[selectedIndex];
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

function feedbackMessage(block, result) {
  const evaluation = block.activity.evaluation || {};
  if (evaluation.mode === 'RELIABLE_EVALUATOR') return { state: 'pending', text: 'Resposta registrada nesta sessão. A validação permanece pendente e não declara domínio.' };
  if (evaluation.mode !== 'DETERMINISTIC' || result.pending) return { state: 'pending', text: 'Resposta registrada nesta sessão. A avaliação completa será ligada ao motor de progresso.' };
  if (evaluation.feedbackTiming === 'AFTER_VERIFICATION') return { state: 'recorded', text: 'Resposta registrada. A verificação evita revelar a correção detalhada antes do fim.' };
  if (result.correct) return { state: 'correct', text: result.score !== undefined ? `Resposta suficiente para este critério (${Math.round(result.score * 100)}%).` : 'Resposta correta.' };
  return { state: 'retry', text: 'Ainda não. Revise o conteúdo e tente novamente; não há penalidade por nova tentativa.' };
}

function revealPostSubmissionExamples(form, block) {
  const examples = block.content?.modelExamplesAfterSubmission;
  if (!Array.isArray(examples) || !examples.length || form.querySelector('[data-post-submission-examples]')) return;
  const box = document.createElement('div');
  box.className = 'content-detail post-submission-examples';
  box.dataset.postSubmissionExamples = 'true';
  const title = document.createElement('strong');
  title.textContent = 'Exemplos possíveis depois da sua tentativa';
  const body = document.createElement('div');
  examples.forEach(example => {
    const item = document.createElement('p');
    item.textContent = example;
    body.appendChild(item);
  });
  box.append(title, body);
  form.appendChild(box);
}

function bindActivity(form, block) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const result = block.activity.evaluation.mode === 'DETERMINISTIC' ? evaluateDeterministicActivity(form, block) : { complete: true, pending: true };
    const feedback = form.querySelector('[data-activity-feedback]');
    if (!result.complete) {
      feedback.dataset.state = 'missing';
      feedback.textContent = 'Complete a resposta antes de verificar.';
      return;
    }
    const message = feedbackMessage(block, result);
    feedback.dataset.state = message.state;
    feedback.textContent = message.text;
    revealPostSubmissionExamples(form, block);
  });
}

function bindSequence(builder) {
  const input = builder.querySelector('[data-sequence-value]');
  const answer = builder.querySelector('[data-sequence-answer]');
  let sequence = [];
  const sync = () => {
    input.value = JSON.stringify(sequence);
    answer.innerHTML = sequence.length ? sequence.map(item => `<span class="token">${esc(item === 'SPACE' ? 'espaço' : item)}</span>`).join(' ') : 'Sua sequência aparecerá aqui.';
  };
  builder.querySelectorAll('[data-sequence-token]').forEach(button => button.addEventListener('click', () => {
    sequence.push(button.dataset.value);
    sync();
  }));
  builder.querySelector('[data-sequence-clear]')?.addEventListener('click', () => { sequence = []; sync(); });
}

export function bindClassicRenderer(root, document = null) {
  root.querySelectorAll('[data-tts]').forEach(button => button.addEventListener('click', () => speak(button.dataset.tts || '')));
  root.querySelectorAll('[data-attempt-gate]').forEach(button => button.addEventListener('click', () => {
    const group = button.closest('[data-gated-choice-set]');
    group?.querySelectorAll('[data-gated-control]').forEach(control => { control.disabled = false; });
    button.disabled = true;
    button.textContent = 'Tentativa registrada';
  }));
  root.querySelectorAll('[data-sequence-builder]').forEach(bindSequence);
  root.querySelectorAll('[data-progressive-reveal]').forEach(button => button.addEventListener('click', () => {
    const round = button.closest('[data-progressive-round]');
    const stage1 = round?.querySelector('input[name$=":stage1"]:checked');
    if (!stage1) return;
    const stage2 = round.querySelector('[data-progressive-stage2]');
    if (stage2) stage2.hidden = false;
    button.disabled = true;
    button.textContent = 'Nova pista aberta';
  }));
  if (!document) return;
  const byId = new Map(document.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));
  root.querySelectorAll('[data-activity-id]').forEach(card => {
    const block = byId.get(card.dataset.activityId);
    const form = card.querySelector('[data-activity-form]');
    if (block && form) bindActivity(form, block);
  });
}
