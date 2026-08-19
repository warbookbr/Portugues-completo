import fs from 'node:fs';

const file = 'app/js/ui/classic-renderer.js';
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(before, after) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho público ${count === 0 ? 'não encontrado' : `encontrado ${count} vezes`}.`);
  source = source.replace(before, after);
}

replaceOnce(
  "const pretty = value => String(value ?? '').replaceAll('_', ' ').toLowerCase();",
  `const PUBLIC_LABELS = new Map([
  ['word', 'Palavra'], ['words', 'Palavras'], ['segments', 'Partes'], ['tiles', 'Fichas'],
  ['examples', 'Exemplos'], ['explanation', 'Explicação'], ['stages', 'Etapas'],
  ['display', 'Forma'], ['description', 'Descrição'], ['knownPartSources', 'Partes já conhecidas'],
  ['nonVisualMeaning', 'Significado'], ['contrast', 'Comparação'], ['contrasts', 'Comparações']
]);

const pretty = value => {
  const raw = String(value ?? '');
  if (PUBLIC_LABELS.has(raw)) return PUBLIC_LABELS.get(raw);
  return raw
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .toLowerCase();
};`
);

replaceOnce(
`function renderKnownContent(content = {}) {
  const lead = [];
  const details = [];
  const hiddenKeys = new Set(['options', 'categories', 'items', 'rounds', 'itemIds', 'claims', 'availableTokens', 'auditoryOptions', 'relationOptions']);

  if (content.title) lead.push(\`<h3>\${esc(content.title)}</h3>\`);
  if (content.text) lead.push(\`<p>\${esc(content.text)}</p>\`);
  if (content.prompt) lead.push(\`<p class="activity-prompt">\${esc(content.prompt)}</p>\`);
  if (content.instruction) lead.push(\`<p class="activity-instruction">\${esc(content.instruction)}</p>\`);
  if (content.model !== undefined) lead.push(\`<div class="model-box"><span>Modelo</span><strong>\${valueText(content.model)}</strong></div>\`);
  if (content.letter) lead.push(\`<div class="model-box"><span>Letra</span><strong>\${esc(content.letter)}</strong></div>\`);

  for (const [key, value] of Object.entries(content)) {
    if (['title', 'text', 'prompt', 'instruction', 'model', 'letter'].includes(key) || hiddenKeys.has(key)) continue;
    if (key.toLowerCase().includes('guard') || key.toLowerCase().includes('correct') || key === 'feedback') continue;
    if (value === null || value === undefined || value === false || value === '') continue;
    details.push(\`<div class="content-detail"><strong>\${esc(pretty(key))}</strong><div>\${valueText(value)}</div></div>\`);
  }

  return \`\${lead.join('')}\${details.length ? \`<div class="content-details">\${details.join('')}</div>\` : ''}\`;
}`,
`function renderKnownContent(content = {}) {
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
    'imageId', 'imageRevealAfterAttempt'
  ]);

  if (content.title) lead.push(\`<h3>\${esc(content.title)}</h3>\`);
  if (content.text) lead.push(\`<p>\${esc(content.text)}</p>\`);
  if (content.prompt) lead.push(\`<p class="activity-prompt">\${esc(content.prompt)}</p>\`);
  if (content.instruction) lead.push(\`<p class="activity-instruction">\${esc(content.instruction)}</p>\`);
  if (content.model !== undefined) lead.push(\`<div class="model-box"><span>Modelo</span><strong>\${valueText(content.model)}</strong></div>\`);
  if (content.letter) lead.push(\`<div class="model-box"><span>Letra</span><strong>\${esc(content.letter)}</strong></div>\`);

  const word = content.wordDisplay ?? content.word ?? content.canonicalWord;
  if (word) lead.push(\`<div class="model-box"><span>Palavra</span><strong>\${esc(word)}</strong></div>\`);

  if (content.ttsCue) {
    lead.push(\`<button type="button" class="secondary-button stimulus-button" data-tts="\${esc(content.ttsCue)}">Ouvir palavra</button>\`);
  }
  if (content.ttsText) {
    lead.push(\`<button type="button" class="secondary-button stimulus-button" data-tts="\${esc(content.ttsText)}">Ouvir exemplo</button>\`);
  }

  const segments = content.segments ?? content.segmentsForRescue;
  if (Array.isArray(segments) && segments.length) {
    const onDemand = Boolean(content.supportButtonLabel || content.supportInitiallyHidden || content.initialSupportLevel === 'apoio-sob-demanda');
    if (onDemand) {
      const label = content.supportButtonLabel || 'Mostrar partes';
      lead.push(\`<details class="support-disclosure"><summary>\${esc(label)}</summary><div class="model-box"><span>Partes</span><strong>\${valueText(segments)}</strong></div></details>\`);
    } else {
      lead.push(\`<div class="model-box"><span>Partes</span><strong>\${valueText(segments)}</strong></div>\`);
    }
  }

  if (content.nonVisualMeaning) {
    lead.push(\`<div class="meaning-support"><strong>Significado</strong><p>\${esc(content.nonVisualMeaning)}</p></div>\`);
  }

  for (const [key, value] of Object.entries(content)) {
    if (['title', 'text', 'prompt', 'instruction', 'model', 'letter', 'nonVisualMeaning'].includes(key) || hiddenKeys.has(key)) continue;
    const lower = key.toLowerCase();
    if (lower.includes('guard') || lower.includes('correct') || lower.includes('feedback') || lower.includes('available') || lower.includes('support') || lower.includes('tts') || lower.includes('media') || lower.includes('audio') || key === 'feedback') continue;
    if (value === null || value === undefined || value === false || value === '') continue;
    details.push(\`<div class="content-detail"><strong>\${esc(pretty(key))}</strong><div>\${valueText(value)}</div></div>\`);
  }

  return \`\${lead.join('')}\${details.length ? \`<div class="content-details">\${details.join('')}</div>\` : ''}\`;
}`
);

replaceOnce(
`  if (stimulus.type === 'CONTROLLED_AUDIO') {
    return \`<div class="media-placeholder" role="status"><strong>Áudio controlado pendente</strong><span>\${esc(stimulus.mediaId || id)}</span><small>O estímulo final ainda precisa ser ligado a este mediaId.</small></div>\`;
  }`,
`  if (stimulus.type === 'CONTROLLED_AUDIO') {
    return \`<div class="media-placeholder" role="status"><strong>Áudio ainda não disponível</strong><span>Este exercício precisa de um áudio específico que ainda está em preparação.</span></div>\`;
  }`
);

fs.writeFileSync(file, source);
