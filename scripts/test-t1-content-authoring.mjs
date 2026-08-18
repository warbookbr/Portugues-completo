import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ContentService } from '../app/js/services/content-service.js';
import { normalizeVerificationV1 } from '../app/js/services/content-normalizer-v1.js';
import { validateValue } from './validate-contracts.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const readJson = relativePath => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const block = (document, id) => document.blocks.find(item => item.id === id);

const lessonSchema = readJson('schemas/lesson.schema.json');
const verificationSchema = readJson('schemas/verification.schema.json');
const n0Unit = readJson('schemas/fixtures/p1/unit-n0-u01.json');
const n0CompetencyIds = n0Unit.competencies.map(item => item.id);

function assertSchema(schema, document, label) {
  const errors = validateValue(schema, document, label);
  assert.deepEqual(errors, [], `${label} não validou contra o schema:\n${errors.join('\n')}`);
}

const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const stagedRoot = 'content/staging/t1/n0-u01';
const lessonPaths = [
  `${stagedRoot}/lessons/003-conhecendo-o-alfabeto.json`,
  `${stagedRoot}/lessons/004-mesma-letra-formas-diferentes.json`,
  `${stagedRoot}/lessons/005-vogais-consoantes-outros-sinais.json`,
  `${stagedRoot}/lessons/009-letras-numeros-outros-sinais.json`,
  `${stagedRoot}/lessons/006-como-a-escrita-se-organiza.json`,
  `${stagedRoot}/lessons/002-percebendo-os-sons-da-fala.json`,
  `${stagedRoot}/lessons/007-nome-da-letra-e-som.json`
];

for (const lessonPath of lessonPaths) {
  const source = readJson(lessonPath);
  assert.equal(typeof source.studentObjective, 'string', `${source.id} precisa declarar studentObjective`);
  assert.ok(source.studentObjective.trim().length > 0, `${source.id} precisa de studentObjective não vazio`);

  const runtime = service.normalize(source, { competencyIds: n0CompetencyIds });
  assertSchema(lessonSchema, runtime, `${source.id} runtime staged T1.6`);
  assert.equal(runtime.presentation.introSource, 'AUTHORED', `${source.id} não pode depender de fallback`);
  assert.equal(runtime.presentation.intro, source.studentObjective.trim());
  assert.equal(runtime.objective, source.objective, `${source.id} deve preservar objective interno`);
  assert.notEqual(runtime.presentation.intro, runtime.objective, `${source.id} deve separar objetivo público do técnico`);
}

const firstSource = readJson(`${stagedRoot}/lessons/003-conhecendo-o-alfabeto.json`);
const first = service.normalize(firstSource, { competencyIds: n0CompetencyIds });
assert.equal(first.title, 'Letras e alfabeto');
assert.equal(first.prerequisites.length, 0, 'a primeira lição T1 não pode depender de abstração anterior');
assert.equal(first.presentation.intro, 'Entender o que é uma letra e conhecer as letras do alfabeto, seus nomes e sua ordem.');
assert.match(block(first, 'L03-B01').content.text, /Uma letra é um sinal que usamos para escrever/);

const symbolsSource = readJson(`${stagedRoot}/lessons/009-letras-numeros-outros-sinais.json`);
const symbols = service.normalize(symbolsSource, { competencyIds: n0CompetencyIds });
assertSchema(lessonSchema, symbols, 'N0-U01-L09 staged runtime');
assert.equal(block(symbols, 'L09-A01').activity.interaction, 'CLASSIFY');
assert.equal(block(symbols, 'L09-A01').activity.evidence.requiredForCompletion, true);
assert.equal(symbols.completion.clusters.length, 1);
assert.equal(symbols.completion.clusters[0].id, 'graphicCategories');

const verificationSource = readJson(`${stagedRoot}/integrated-verification-v02.json`);
const verification = normalizeVerificationV1(verificationSource, { competencyIds: n0CompetencyIds });
assertSchema(verificationSchema, verification, 'N0-U01-V02 staged runtime');
assert.equal(verification.blocks.length, 9);
assert.equal(verification.completion.clusters.length, 4);
assert.equal(verification.completion.nonCompensable, true);
assert.deepEqual(verification.completion.clusters.map(item => item.id), ['alphabetAndForms', 'letterCategories', 'visualOrganization', 'soundAndLetter']);
assert.ok(verification.completion.clusters.every(item => item.required && item.satisfaction === 'DEMONSTRATED_REQUIRED'));
assert.equal(block(verification, 'V02-Q01').activity.interaction, 'SINGLE_CHOICE');
assert.equal(block(verification, 'V02-Q03').activity.interaction, 'CLASSIFY');
assert.equal(block(verification, 'V02-Q04').activity.interaction, 'CLASSIFY');
assert.equal(block(verification, 'V02-Q06').activity.interaction, 'SEQUENCE');
assert.equal(block(verification, 'V02-Q07').activity.interaction, 'CLASSIFY');
assert.equal(block(verification, 'V02-Q08').activity.interaction, 'SINGLE_CHOICE');
assert.equal(block(verification, 'V02-Q09').activity.interaction, 'SINGLE_CHOICE');
assert.ok(block(verification, 'V02-Q07').activity.stimuli.some(item => item.type === 'CONTROLLED_AUDIO'));
assert.ok(!verificationSource.coverage.some(item => /fala e escrita|mesma letra pode representar sons diferentes/i.test(item.competency)), 'V02 não pode reintroduzir conteúdos movidos para U2');

console.log('T1.6 staged: nova U1 e V02 normalizadas, separação de linguagem e escopo curricular validados.');
