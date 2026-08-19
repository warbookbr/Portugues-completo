import fs from 'node:fs';

const file = 'app/js/ui/classic-renderer.js';
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(before, after) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho do renderer ${count === 0 ? 'não encontrado' : `encontrado ${count} vezes`}.`);
  source = source.replace(before, after);
}

replaceOnce(
`function unsupported(label) {
  return \`<div class="unsupported-state" role="alert"><strong>Interação ainda não suportada</strong><span>\${esc(label)}</span></div>\`;
}`,
`function audioOptionMarkup(options = [], name) {
  return options.map((mediaId, index) => \`
    <label class="choice-option audio-choice-option">
      <input type="radio" name="\${esc(name)}" value="\${index}">
      <span><strong>Opção \${index + 1}</strong><small>áudio controlado pendente</small></span>
    </label>\`).join('');
}

function sharedCompositeOptions(block) {
  const values = Object.values(block.activity?.evaluation?.answerKey?.items || {})
    .map(value => value && typeof value === 'object' && !Array.isArray(value) ? value.correct ?? value.expected : value)
    .filter(value => ['string', 'number', 'boolean'].includes(typeof value));
  const uniqueValues = [...new Set(values)];
  return uniqueValues.length >= 2 && uniqueValues.length <= 6 ? uniqueValues : [];
}

function unsupported(label) {
  return \`<div class="unsupported-state" role="alert"><strong>Interação ainda não suportada</strong><span>\${esc(label)}</span></div>\`;
}`
);

replaceOnce(
`function renderSequenceBuilder(tokens, name = 'sequence') {
  if (!Array.isArray(tokens) || !tokens.length) return unsupported(\`sequência \${name} sem peças\`);
  return \`<div class="sequence-builder" data-sequence-builder>
    <div class="token-bank" aria-label="Itens disponíveis">\${tokens.map((token, index) => \`<button type="button" class="token-button" data-sequence-token="\${index}" data-value="\${esc(typeof token === 'string' ? token : JSON.stringify(token))}">\${valueText(token === 'SPACE' ? 'espaço' : token)}</button>\`).join('')}</div>
    <input type="hidden" name="\${esc(name)}" data-sequence-value value="[]">
    <div class="sequence-answer" data-sequence-answer aria-live="polite">Sua sequência aparecerá aqui.</div>
    <button type="button" class="secondary-button compact-button" data-sequence-clear>Limpar sequência</button>
  </div>\`;
}

function renderSequence(block) {
  const tokens = block.content?.availableTokens || block.content?.options || block.content?.model || [];
  return renderSequenceBuilder(tokens, 'sequence');
}`,
`function renderSequenceBuilder(tokens, name = 'sequence') {
  if (!Array.isArray(tokens) || !tokens.length) return unsupported(\`sequência \${name} sem peças\`);
  return \`<div class="sequence-builder" data-sequence-builder>
    <div class="token-bank" aria-label="Itens disponíveis">\${tokens.map((token, index) => {
      const audioToken = typeof token === 'string' && token.includes('AUD-');
      const label = audioToken ? \`<span>Ficha \${index + 1}</span><small>áudio pendente</small>\` : valueText(token === 'SPACE' ? 'espaço' : token);
      return \`<button type="button" class="token-button" data-sequence-token="\${index}" data-value="\${esc(typeof token === 'string' ? token : JSON.stringify(token))}">\${label}</button>\`;
    }).join('')}</div>
    <input type="hidden" name="\${esc(name)}" data-sequence-value value="[]">
    <div class="sequence-answer" data-sequence-answer aria-live="polite">Sua sequência aparecerá aqui.</div>
    <button type="button" class="secondary-button compact-button" data-sequence-clear>Limpar sequência</button>
  </div>\`;
}

function renderSequence(block) {
  const tokens = block.content?.availableTokens || block.content?.availableAudioTokens || block.content?.availableWrittenChunks || block.content?.options || block.content?.model || [];
  return renderSequenceBuilder(tokens, 'sequence');
}`
);

replaceOnce(
`  if (Array.isArray(entry.pieces) || Array.isArray(entry.tokens)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${renderSequenceBuilder(entry.pieces || entry.tokens, \`round-sequence:\${key}\`)}</fieldset>\`;
  }

  if (Array.isArray(entry.options)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${optionMarkup(entry.options, \`round:\${key}\`)}</fieldset>\`;
  }

  return \`<div class="composite-round">\${localStimuli}\${unsupported(\`\${block.id}: rodada \${key} sem controle determinístico\`)}</div>\`;`,
`  if (Array.isArray(entry.pieces) || Array.isArray(entry.tokens) || Array.isArray(entry.availableAudioTokens) || Array.isArray(entry.availableWrittenChunks)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${renderSequenceBuilder(entry.pieces || entry.tokens || entry.availableAudioTokens || entry.availableWrittenChunks, \`round-sequence:\${key}\`)}</fieldset>\`;
  }

  if (Array.isArray(entry.options)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${optionMarkup(entry.options, \`round:\${key}\`)}</fieldset>\`;
  }

  if (Array.isArray(entry.wholeWordOptions)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${audioOptionMarkup(entry.wholeWordOptions, \`round:\${key}\`)}</fieldset>\`;
  }

  if (Array.isArray(block.content?.pulseOptions)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${optionMarkup(block.content.pulseOptions, \`round:\${key}\`)}</fieldset>\`;
  }

  const sharedOptions = sharedCompositeOptions(block);
  if (sharedOptions.length) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${optionMarkup(sharedOptions, \`round:\${key}\`)}</fieldset>\`;
  }

  return \`<div class="composite-round">\${localStimuli}\${unsupported(\`\${block.id}: rodada \${key} sem controle determinístico\`)}</div>\`;`
);

replaceOnce(
`    case 'SINGLE_CHOICE': return \`<fieldset class="choice-group"><legend class="sr-only">Escolha uma opção</legend>\${optionMarkup(content.options || [], 'choice')}</fieldset>\`;`,
`    case 'SINGLE_CHOICE': return \`<fieldset class="choice-group"><legend class="sr-only">Escolha uma opção</legend>\${Array.isArray(content.wholeWordOptions) ? audioOptionMarkup(content.wholeWordOptions, 'choice') : optionMarkup(content.options || [], 'choice')}</fieldset>\`;`
);

replaceOnce(
`  const option = block.content?.options?.[index];`,
`  const option = block.content?.options?.[index] ?? block.content?.wholeWordOptions?.[index];`
);

replaceOnce(
`    const selected = selectedRadio(form, \`round:\${key}\`);
    if (!selected) return { complete: false };
    const option = entry.options?.[Number(selected.value)];
    const expectedValue = expected && typeof expected === 'object' ? expected.correct ?? expected.expected : expected;
    if (normalizeComparable(option) === normalizeComparable(expectedValue)) hits += 1;`,
`    const selected = selectedRadio(form, \`round:\${key}\`);
    if (!selected) return { complete: false };
    const selectedIndex = Number(selected.value);
    if (expected && typeof expected === 'object' && Number.isInteger(expected.correctIndex)) {
      if (selectedIndex === expected.correctIndex) hits += 1;
      continue;
    }
    const sharedOptions = sharedCompositeOptions(block);
    const option = entry.options?.[selectedIndex] ?? entry.wholeWordOptions?.[selectedIndex] ?? content.pulseOptions?.[selectedIndex] ?? sharedOptions[selectedIndex];
    const expectedValue = expected && typeof expected === 'object' ? expected.correct ?? expected.expected : expected;
    if (normalizeComparable(option) === normalizeComparable(expectedValue)) hits += 1;`
);

fs.writeFileSync(file, source);
