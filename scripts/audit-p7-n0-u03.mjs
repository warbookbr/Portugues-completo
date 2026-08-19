import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';
import { validateValue } from './validate-contracts.mjs';

const unitDir = 'content/units/003-palavras-frases-sentido';
const lessonsDir = path.join(unitDir, 'lessons');
const lessonFiles = fs.readdirSync(lessonsDir).filter(file => file.endsWith('.json')).sort();
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const lessonSchema = readJson('schemas/lesson.schema.json');
const verificationSchema = readJson('schemas/verification.schema.json');
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });

assert.equal(lessonFiles.length, 10, 'N0-U03 deve conter 10 lições autoradas antes da publicação P7.');

const interactionCounts = new Map();
const media = { controlledAudio: new Set(), images: new Set(), video: new Set(), ttsDocuments: 0 };
const lessonSummary = [];

function countInteraction(runtime) {
  for (const block of runtime.blocks || []) {
    if (block.kind !== 'ACTIVITY') continue;
    const interaction = block.activity?.interaction || 'NONE';
    interactionCounts.set(interaction, (interactionCounts.get(interaction) || 0) + 1);
  }
}

function collectMedia(source) {
  const spec = source.media || {};
  if (spec.tts && !/^nao|não/i.test(String(spec.tts))) media.ttsDocuments += 1;
  const controlled = Array.isArray(spec.controlledAudio) ? spec.controlledAudio : spec.controlledAudio ? [spec.controlledAudio] : [];
  for (const item of controlled) if (!/^nao|não/i.test(String(item))) media.controlledAudio.add(String(item));
  const images = Array.isArray(spec.images) ? spec.images : spec.images ? [spec.images] : [];
  for (const item of images) if (!/^nao|não/i.test(String(item))) media.images.add(String(item));
  const videos = Array.isArray(spec.video) ? spec.video : spec.video ? [spec.video] : [];
  for (const item of videos) if (!/^nao|não/i.test(String(item))) media.video.add(String(item));
}

const allLessonIds = new Set();
for (const file of lessonFiles) {
  const sourcePath = path.join(lessonsDir, file);
  const source = readJson(sourcePath);
  assert.match(source.id, /^N0-U03-L\d{2}$/, `${file}: ID fora do padrão N0-U03.`);
  assert.ok(!allLessonIds.has(source.id), `${source.id}: ID duplicado.`);
  allLessonIds.add(source.id);

  const runtime = service.normalize(source);
  const schemaErrors = validateValue(lessonSchema, runtime, `${source.id} runtime`);
  assert.deepEqual(schemaErrors, [], `${source.id}: runtime inválido:\n${schemaErrors.join('\n')}`);

  const html = documentHtml(runtime, { unitId: 'N0-U03', unitTitle: 'Palavras, frases e sentido' });
  assert.doesNotMatch(html, /Interação ainda não suportada/i, `${source.id}: renderer encontrou interação não suportada.`);
  assert.doesNotMatch(html, /\b(?:schemaVersion|answerKey|competencyIds|evidenceRole|acceptedSequences|correctIndexes|correctFunction|correctGroup|notAutomaticallyJudged|automaticObservations)\b/i, `${source.id}: metadado técnico vazou no HTML.`);

  for (const prerequisite of source.prerequisites || []) {
    if (/^N0-U03-L\d{2}$/.test(prerequisite)) {
      assert.ok(allLessonIds.has(prerequisite), `${source.id}: pré-requisito interno invertido -> ${prerequisite}.`);
    }
  }

  countInteraction(runtime);
  collectMedia(source);
  lessonSummary.push({ id: source.id, title: source.title, blocks: runtime.blocks.length, activities: runtime.blocks.filter(block => block.kind === 'ACTIVITY').length });
}

const verificationSource = readJson(path.join(unitDir, 'integrated-verification.json'));
assert.equal(verificationSource.id, 'N0-U03-V01');
assert.deepEqual(verificationSource.prerequisites, [...allLessonIds], 'V01 deve depender das 10 lições da U03 em ordem.');
const verificationRuntime = service.normalize(verificationSource);
const verificationErrors = validateValue(verificationSchema, verificationRuntime, 'N0-U03-V01 runtime');
assert.deepEqual(verificationErrors, [], `N0-U03-V01: runtime inválido:\n${verificationErrors.join('\n')}`);
const verificationHtml = documentHtml(verificationRuntime, { unitId: 'N0-U03', unitTitle: 'Palavras, frases e sentido', verification: true });
assert.doesNotMatch(verificationHtml, /Interação ainda não suportada/i, 'N0-U03-V01: renderer encontrou interação não suportada.');
countInteraction(verificationRuntime);
collectMedia(verificationSource);

assert.equal(verificationSource.coverage?.length, 10, 'N0-U03-V01 deve preservar 10 responsabilidades de cobertura.');
assert.equal(media.controlledAudio.size, 0, 'N0-U03 não deve introduzir áudio humano obrigatório sem blocker explícito.');
assert.equal(media.video.size, 0, 'N0-U03 não deve introduzir vídeo obrigatório sem blocker explícito.');
assert.equal(media.images.size, 0, 'N0-U03 não deve introduzir imagem obrigatória sem blocker explícito.');

console.log('P7 inventário N0-U03:');
for (const item of lessonSummary) console.log(`- ${item.id}: ${item.title} — ${item.activities} atividade(s), ${item.blocks} bloco(s)`);
console.log(`- N0-U03-V01: ${verificationRuntime.blocks.filter(block => block.kind === 'ACTIVITY').length} atividade(s), ${verificationRuntime.blocks.length} bloco(s)`);
console.log(`Interações: ${[...interactionCounts.entries()].sort().map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Mídia: controlledAudio=${media.controlledAudio.size}, images=${media.images.size}, video=${media.video.size}, TTS-em-documentos=${media.ttsDocuments}`);
console.log('Resultado: autoria U03 normalizável, schema válida, renderer atual cobre todas as interações e não há mídia humana obrigatória detectada.');
