import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ContentService } from '../app/js/services/content-service.js';
import { normalizeVerificationV1 } from '../app/js/services/content-normalizer-v1.js';
import { materializeLesson, materializeVerification } from './t1-authoring-materializer.mjs';
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

// T1.6 — U1 staged
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
assert.ok(!verificationSource.coverage.some(item => /fala e escrita|mesma letra pode representar sons diferentes/i.test(item.competency)), 'V02 da U1 não pode reintroduzir conteúdos movidos para U2');

// T1.6 — U2 staged + materialização executável
const u2Authoring = readJson('content/staging/t1/n0-u02/authoring.json');
assert.equal(u2Authoring.id, 'N0-U02');
assert.equal(u2Authoring.title, 'Sílabas e primeiras palavras');
assert.equal(u2Authoring.lessons.length, 10);
assert.equal(u2Authoring.materialization, 'T1.9');

const materializedU2Lessons = new Map();
for (const definition of u2Authoring.lessons) {
  const source = readJson(definition.source);
  const materialized = materializeLesson(source, definition);
  const runtime = service.normalize(materialized);
  materializedU2Lessons.set(definition.id, { source: materialized, runtime });

  assertSchema(lessonSchema, runtime, `${definition.id} materializada T1.6`);
  assert.equal(runtime.id, definition.id);
  assert.equal(runtime.title, definition.title);
  assert.equal(runtime.presentation.introSource, 'AUTHORED', `${definition.id} precisa usar copy pública autoral`);
  assert.equal(runtime.presentation.intro, definition.studentObjective);
  assert.equal(runtime.objective, source.objective, `${definition.id} deve preservar objective técnico da fonte`);
  assert.notEqual(runtime.presentation.intro, runtime.objective, `${definition.id} deve separar objetivo público do técnico`);
}

const u2L01 = materializedU2Lessons.get('N0-U02-L01').runtime;
assert.equal(u2L01.title, 'O que é uma sílaba?');
assert.deepEqual(u2L01.prerequisites, ['N0-U01-V02']);
assert.equal(u2L01.presentation.intro, 'Perceber que podemos ouvir uma palavra em partes e aprender que essas partes são chamadas de sílabas.');

const u2L09 = materializedU2Lessons.get('N0-U02-L09').runtime;
assert.equal(u2L09.title, 'Letras e sons podem variar');
assert.equal(u2L09.completion.clusters.length, 2);
assert.equal(u2L09.completion.nonCompensable, true);
assert.equal(block(u2L09, 'L09-A01').activity.interaction, 'SINGLE_CHOICE');
assert.equal(block(u2L09, 'L09-A02').activity.interaction, 'SINGLE_CHOICE');
assert.ok(block(u2L09, 'L09-A01').activity.stimuli.some(item => item.type === 'CONTROLLED_AUDIO'));

const u2L10 = materializedU2Lessons.get('N0-U02-L10').runtime;
assert.equal(u2L10.title, 'Falar e escrever: duas formas de comunicar');
assert.equal(u2L10.presentation.intro, 'Entender a diferença entre o que falamos e o que escrevemos.');
assert.equal(u2L10.completion.clusters.length, 2);
assert.equal(u2L10.completion.nonCompensable, true);
assert.equal(block(u2L10, 'L10-A01').activity.interaction, 'CLASSIFY');
assert.ok(block(u2L10, 'L10-A01').activity.stimuli.some(item => item.type === 'TTS'));
assert.ok(block(u2L10, 'L10-A01').activity.stimuli.some(item => item.type === 'TEXT'));

const u2BaseVerification = readJson(u2Authoring.verification.baseSource);
const u2VerificationExtension = readJson(u2Authoring.verification.extensionSource);
const materializedU2VerificationSource = materializeVerification(u2BaseVerification, u2VerificationExtension, u2Authoring.verification);
const u2Verification = normalizeVerificationV1(materializedU2VerificationSource);
assertSchema(verificationSchema, u2Verification, 'N0-U02-V02 materializada T1.6');
assert.equal(materializedU2VerificationSource.id, 'N0-U02-V02');
assert.equal(materializedU2VerificationSource.title, 'Verificação — Sílabas e primeiras palavras');
assert.equal(u2Verification.blocks.length, 12);
assert.equal(u2Verification.completion.clusters.length, 5);
assert.equal(u2Verification.completion.nonCompensable, true);
assert.deepEqual(u2Verification.completion.clusters.map(item => item.id), [
  'syllableAwareness',
  'syllableWriting',
  'wordReadingAndMeaning',
  'soundWritingRelations',
  'speechAndWriting'
]);
assert.ok(u2Verification.completion.clusters.every(item => item.required && item.satisfaction === 'DEMONSTRATED_REQUIRED'));
assert.equal(block(u2Verification, 'V02-Q01').activity.interaction, 'SINGLE_CHOICE');
assert.equal(block(u2Verification, 'V02-Q04').activity.interaction, 'SINGLE_CHOICE');
assert.equal(block(u2Verification, 'V02-Q07').activity.interaction, 'COMPOSITE');
assert.equal(block(u2Verification, 'V02-Q09').activity.interaction, 'SINGLE_CHOICE');
assert.equal(block(u2Verification, 'V02-Q10').activity.interaction, 'SINGLE_CHOICE');
assert.equal(block(u2Verification, 'V02-Q11').activity.interaction, 'SINGLE_CHOICE');
assert.equal(block(u2Verification, 'V02-Q12').activity.interaction, 'CLASSIFY');
assert.deepEqual(materializedU2VerificationSource.prerequisites.slice(-2), ['N0-U02-L09', 'N0-U02-L10']);
assert.ok(materializedU2VerificationSource.media.controlledAudio.some(item => String(item).includes('N0-U02-V01-AUD')), 'V02 precisa preservar mídias silábicas históricas');
assert.ok(materializedU2VerificationSource.media.controlledAudio.includes('N0-U01-L08-AUD-001'), 'V02 precisa incluir áudio de variação letra-som');
assert.ok(JSON.stringify(materializedU2VerificationSource.supportMaterials).includes('V02-Q10'));
assert.ok(!JSON.stringify(materializedU2VerificationSource).includes('V01-Q'), 'materialização V02 não pode manter referências de evidência V01-Q');

console.log('T1.6 staged: novas U1/U2, linguagem pública e verificações V02 materializadas/validadas contra os contratos.');
