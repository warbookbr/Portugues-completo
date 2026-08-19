import fs from 'node:fs';

const file = 'app/js/ui/classic-renderer.js';
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(before, after) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho do renderer ${count === 0 ? 'não encontrado' : `encontrado ${count} vezes`}.`);
  source = source.replace(before, after);
}

replaceOnce(
`  if (Array.isArray(entry.options)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${optionMarkup(entry.options, \`round:\${key}\`)}</fieldset>\`;
  }

  return \`<div class="composite-round">\${localStimuli}\${unsupported(\`\${block.id}: rodada \${key} sem controle determinístico\`)}</div>\`;`,
`  if (Array.isArray(entry.options)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${optionMarkup(entry.options, \`round:\${key}\`)}</fieldset>\`;
  }

  if (Array.isArray(block.content?.pulseOptions)) {
    return \`<fieldset class="composite-round"><legend>\${esc(label)}</legend>\${localStimuli}\${optionMarkup(block.content.pulseOptions, \`round:\${key}\`)}</fieldset>\`;
  }

  return \`<div class="composite-round">\${localStimuli}\${unsupported(\`\${block.id}: rodada \${key} sem controle determinístico\`)}</div>\`;`
);

replaceOnce(
`    const option = entry.options?.[Number(selected.value)];
    const expectedValue = expected && typeof expected === 'object' ? expected.correct ?? expected.expected : expected;`,
`    const option = entry.options?.[Number(selected.value)] ?? content.pulseOptions?.[Number(selected.value)];
    const expectedValue = expected && typeof expected === 'object' ? expected.correct ?? expected.expected : expected;`
);

fs.writeFileSync(file, source);
