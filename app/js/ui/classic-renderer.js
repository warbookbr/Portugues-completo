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
  ['before', 'Antes'], ['after', 'Depois'],
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
    'cards', 'optionalScaffold', 'planningChecklist', 'planningPrompt', 'essentialInformation',
    'principleQuestion', 'principleOptions', 'automaticCheck',
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
  if (Array.isArray(segments)) {
    lead.push(`<div class="segmented-word" aria-label="Partes da palavra">${segments.map(item => `<span>${esc(item)}</span>`).join('<b>·</b>')}</div>`);
  }

  for (const [key, value] of Object.entries(content)) {
    if (hiddenKeys.has(key) || ['title', 'text', 'prompt', 'instruction', 'model', 'letter'].includes(key) || value === undefined || value === null || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'boolean') continue;
    details.push(`<div class="content-detail"><strong>${esc(pretty(key))}</strong><div>${valueText(value)}</div></div>`);
  }

  return `${lead.join('')}${details.length ? `<div class="content-details">${details.join('')}</div>` : ''}`;
}

function evidenceBadge(activity) {
  const evidence = activity?.evidence;
  if (!evidence?.required) return '';
  return '<span class="evidence-badge">Necessária para concluir</span>';
}

function optionMarkup(options = [], name = 'choice', multiple = false) {
  return options.map((option, index) => {
    const input = multiple ? 'checkbox' : 'radio';
    return `<label class="choice-option"><input type="${input}" name="${esc(name)}" value="${index}" required><span>${valueText(option)}</span></label>`;
  }).join('');
}

function ttsAudioOptionMarkup(options = [], name = 'choice', attemptGateRequired = false) {
  return options.map((cue, index) => `<label class="choice-option audio-option"><input type="radio" name="${esc(name)}" value="${index}" required><span><button type="button" class="audio-choice-button" data-tts="${esc(cue)}">Ouvir opção ${index + 1}</button>${attemptGateRequired ? '<small>Ouça antes de decidir.</small>' : ''}</span></label>`).join('');
}

function audioOptionMarkup(options = [], name = 'choice') {
  return options.map((option, index) => `<label class="choice-option"><input type="radio" name="${esc(name)}" value="${index}" required><span>${valueText(option)}</span></label>`).join('');
}

function renderItemStimuli(activity, itemId) {
  const stimuli = activity?.stimuli?.filter(stimulus => stimulus.itemId === itemId) || [];
  return stimuli.map(renderStimulus).join('');
}

function renderStimulus(stimulus) {
  if (stimulus.type === 'CONTROLLED_AUDIO') return `<div class="stimulus unavailable"><strong>Áudio ainda não disponível</strong><p>Este estímulo controlado está rastreado como pendência local de mídia.</p></div>`;
  if (stimulus.type === 'TTS') return `<button type="button" class="secondary-button stimulus-button" data-tts="${esc(stimulus.source)}">Ouvir</button>`;
  if (stimulus.type === 'IMAGE') return `<figure class="stimulus unavailable"><strong>Imagem ainda não disponível</strong><figcaption>Pendência local de mídia.</figcaption></figure>`;
  return '';
}

function renderStimuli(activity) {
  const shared = activity?.stimuli?.filter(stimulus => !stimulus.itemId) || [];
  return shared.map(renderStimulus).join('');
}

function renderEvidenceSelector(content = {}, name = 'evidence') {
  const options = content.evidenceOptions;
  if (!Array.isArray(options) || !options.length) return '';
  const multiple = content.evidenceSelectionMode === 'MULTIPLE';
  const instruction = multiple ? 'Marque os trechos do texto que sustentam sua resposta.' : 'Marque um trecho do texto que sustenta sua resposta.';
  return `<fieldset class="evidence-selector" data-evidence-selection><legend>${instruction}</legend>${optionMarkup(options, name, multiple)}</fieldset>`;
}

function sharedCompositeOptions(block) {
  const content = block.content || {};
  if (Array.isArray(content.options)) return content.options;
  if (Array.isArray(content.functions)) return content.functions;
  if (Array.isArray(content.availableFunctions)) return content.availableFunctions;
  return [];
}

function renderClassify(block) {
  const content = block.content || {};
  const categories = content.categories || [];
  const items = content.items || [];
  return `<div class="classify-grid">${items.map((item, index) => {
    const key = String(item.id ?? index);
    const label = item.displayLabel || item.claim || item.question || item.text || item.stimulus || `Item ${index + 1}`;
    return `<label class="classify-row"><span>${valueText(label)}</span><select name="classify:${esc(key)}" required><option value="">Escolha</option>${categories.map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join('')}</select></label>`;
  }).join('')}</div>`;
}

function renderSequenceBuilder(tokens, name) {
  const safe = Array.isArray(tokens) ? tokens : [];
  return `<div class="sequence-builder" data-sequence-builder data-name="${esc(name)}"><div class="sequence-pool">${safe.map((item, index) => `<button type="button" class="sequence-token" data-sequence-token data-index="${index}">${valueText(item)}</button>`).join('')}</div><div class="sequence-result" data-sequence-result>Sua sequência aparecerá aqui.</div><input type="hidden" name="${esc(name)}" value="[]" data-sequence-value required><button type="button" class="secondary-button compact-button" data-sequence-reset>Limpar</button></div>`;
}

function renderSequence(block) {
  const content = block.content || {};
  const tokens = content.availableTiles || content.tiles || content.tokens || [];
  return renderSequenceBuilder(tokens, 'sequence');
}

function renderOpenInput(block, label = 'Sua resposta') {
  const interaction = block.activity?.interaction;
  const rows = interaction === 'SHORT_TEXT' ? 2 : interaction === 'LONG_TEXT' ? 9 : 6;
  return `<label class="response-field"><span>${esc(label)}</span><textarea name="openResponse" rows="${rows}" required></textarea></label>`;
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
    return `<fieldset class="composite-round"><legend>${esc(label)}</legend>${localStimuli}${optionMarkup(entry.options, `round:${key}`, multiple)}</fieldset>`;
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
      <div class="composite-stage"><strong>2. Relação observada</strong>${optionMarkup(content.relationOptions, 'relation')}</div>`;
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

function unsupported(label) {
  return `<div class="unsupported-interaction"><strong>Interação ainda não suportada</strong><p>${esc(label)}</p></div>`;
}

function resultMessage(result, pending) {
  if (!result.complete) return { state: 'incomplete', text: 'Complete a atividade antes de registrar.' };
  if (result.pending || pending) return { state: 'pending', text: 'Resposta registrada. Esta produção ainda precisa de validação confiável para virar evidência de domínio.' };
  if (result.correct) return { state: 'correct', text: 'Boa! Sua resposta atende ao critério desta atividade.' };
  return { state: 'incorrect', text: 'Ainda não. Revise a resposta e tente novamente.' };
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
    const evaluation = block.activity?.evaluation || {};
    const pending = evaluation.mode === 'RELIABLE_EVALUATOR';
    let result = pending
      ? { complete: form.checkValidity(), pending: true }
      : evaluateDeterministicActivity(form, block);
    if (!pending && !form.checkValidity()) result = { complete: false };
    const message = resultMessage(result, pending);
    form.dataset.activityResult = JSON.stringify(result);
    const feedback = form.querySelector('[data-activity-feedback]');
    feedback.dataset.state = message.state;
    feedback.textContent = message.text;
    revealPostSubmissionExamples(form, block);
  });
}

function bindSequence(root) {
  root.querySelectorAll('[data-sequence-builder]').forEach(builder => {
    const result = builder.querySelector('[data-sequence-result]');
    const hidden = builder.querySelector('[data-sequence-value]');
    const tokens = [];
    const redraw = () => {
      result.textContent = tokens.length ? tokens.join(' · ') : 'Sua sequência aparecerá aqui.';
      hidden.value = JSON.stringify(tokens);
    };
    builder.querySelectorAll('[data-sequence-token]').forEach(button => button.addEventListener('click', () => {
      tokens.push(button.textContent.trim());
      button.disabled = true;
      redraw();
    }));
    builder.querySelector('[data-sequence-reset]')?.addEventListener('click', () => {
      tokens.length = 0;
      builder.querySelectorAll('[data-sequence-token]').forEach(button => { button.disabled = false; });
      redraw();
    });
  });
}

function bindProgressive(root) {
  root.querySelectorAll('[data-progressive-round]').forEach(round => {
    const button = round.querySelector('[data-progressive-reveal]');
    const stage2 = round.querySelector('[data-progressive-stage2]');
    if (!button || !stage2) return;
    button.addEventListener('click', () => {
      stage2.hidden = false;
      button.hidden = true;
    });
  });
}

export function bindDocumentInteractions(root) {
  if (!root) return;
  bindSequence(root);
  bindProgressive(root);
  root.querySelectorAll('[data-tts]').forEach(button => button.addEventListener('click', () => speak(button.dataset.tts)));
  root.querySelectorAll('[data-activity-form]').forEach(form => {
    const card = form.closest('[data-activity-id]');
    const block = card?.dataset.activityId ? root.__documentRuntime?.blocks?.find(item => item.id === card.dataset.activityId) : null;
    if (block) bindActivity(form, block);
  });
}
