import assert from 'node:assert/strict';
import fs from 'node:fs';

import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });

const l08 = service.normalize(readJson('content/units/005-escrevendo-organizando-mensagens/lessons/008-organizando-a-escrita-espacos-maiuscula-limites.json'));
const l08Html = documentHtml(l08, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens' });
assert.match(l08Html, /<strong>Antes<\/strong>/, 'before autoral precisa virar rótulo público em português.');
assert.doesNotMatch(l08Html, />\s*before\s*</i, 'before cru não pode aparecer na UI.');
assert.doesNotMatch(l08Html, />\s*after\s*</i, 'after cru não pode aparecer na UI.');

const v01 = service.normalize(readJson('content/units/005-escrevendo-organizando-mensagens/integrated-verification.json'));
const v01Html = documentHtml(v01, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens', verification: true });
assert.match(v01Html, /Nesta verificação, você vai usar o que estudou nesta unidade/i);
assert.match(v01Html, /Antes de escrever, selecione as informações essenciais\./i);
assert.match(v01Html, /Autochecagem/i);
assert.doesNotMatch(v01Html, />\s*planning prompt\s*</i, 'planningPrompt autoral não pode duplicar o componente público.');
assert.doesNotMatch(v01Html, />\s*essential information\s*</i, 'essentialInformation autoral não pode duplicar o checklist público.');
assert.doesNotMatch(v01Html, /planningPrompt|essentialInformation|modelExamplesAfterSubmission|notAutomaticallyJudged|humanOrExternalReview|automaticObservations/);

const planningPromptMatches = v01Html.match(/Antes de escrever, selecione as informações essenciais\./gi) || [];
assert.equal(planningPromptMatches.length, 1, 'O prompt de planejamento deve aparecer uma única vez no componente próprio.');

console.log('P7 U05 public UI: rótulos de edição traduzidos, planejamento sem duplicação autoral e abertura segura da V01 validados.');
