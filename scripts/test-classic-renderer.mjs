import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml, unitHtml } from '../app/js/ui/classic-renderer.js';
import { homeHtml } from '../app/js/ui/classic-home.js';
import { buildLessonStepGroups, lessonHasStudyHistory } from '../app/js/ui/classic-lesson-flow.js';
import { createEmptyProgress } from '../app/js/services/progress-service.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function fileFetch(url) {
  const projectPath = String(url).replace(/^\.\//, '');
  const filePath = path.resolve(root, projectPath);
  if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filePath)) {
    return { ok: false, status: 404, async json() { return null; } };
  }
  return { ok: true, status: 200, async json() { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } };
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const service = new ContentService({ basePath: './content', fetchImpl: fileFetch });
const catalog = await service.loadCatalog();
const units = [];
let lessonCount = 0;
let verificationCount = 0;

for (const unitRef of catalog.units) {
  const loadedUnit = await service.loadUnitManifest(unitRef.id, { catalog });
  const manifest = loadedUnit.manifest;
  units.push(manifest);
  const unitMarkup = unitHtml(manifest);
  assert.match(unitMarkup, new RegExp(manifest.id));
  assert.doesNotMatch(unitMarkup, /Unidade ainda não publicada/i);

  for (const lessonRef of manifest.lessons) {
    const loaded = await service.loadLesson(manifest.id, lessonRef.id);
    const html = documentHtml(loaded.runtime, { unitId: manifest.id, unitTitle: manifest.title });
    assert.match(html, new RegExp(escapeRegex(lessonRef.title)));
    assert.doesNotMatch(html, /Interação ainda não suportada/i, `${lessonRef.id} possui interação sem renderer`);
    assert.doesNotMatch(html, /Lição ainda não publicada/i);
    assert.equal(typeof loaded.runtime.presentation?.intro, 'string', `${lessonRef.id} precisa de apresentação pública no runtime`);
    assert.ok(loaded.runtime.presentation.intro.trim().length > 0, `${lessonRef.id} precisa de apresentação pública não vazia`);
    assert.notEqual(loaded.runtime.presentation.intro, loaded.runtime.objective, `${lessonRef.id} não pode reutilizar objective técnico como intro pública`);
    lessonCount += 1;
  }

  const verification = await service.loadVerification(manifest.id);
  const verificationHtml = documentHtml(verification.runtime, { unitId: manifest.id, unitTitle: manifest.title, verification: true });
  assert.doesNotMatch(verificationHtml, /Interação ainda não suportada/i, `${verification.runtime.id} possui interação sem renderer`);
  assert.match(verificationHtml, /Verificação da unidade/);
  verificationCount += 1;
}

const publishedUnits = units.filter(unit => unit.publication.status === 'READY');
const homeMarkup = homeHtml({ catalog, units: publishedUnits, progress: createEmptyProgress() });
assert.match(homeMarkup, /Português Completo/);
assert.match(homeMarkup, /Continue estudando|Comece por aqui/);
assert.doesNotMatch(homeMarkup, /Unidade ainda não publicada/i);

const u01 = await service.loadLesson('N0-U01', 'N0-U01-L03');
const u01Groups = buildLessonStepGroups(u01.runtime);
assert.equal(u01Groups.length > 0, true);
assert.equal(lessonHasStudyHistory(createEmptyProgress(), u01.runtime), false);

const u03Open = await service.loadLesson('N0-U03', 'N0-U03-L10');
const u03OpenHtml = documentHtml(u03Open.runtime, { unitId: 'N0-U03', unitTitle: 'Palavras, frases e sentido' });
assert.match(u03OpenHtml, /Registrar resposta/);
assert.doesNotMatch(u03OpenHtml, /Interação ainda não suportada/i);

const u04Evidence = await service.loadLesson('N0-U04', 'N0-U04-L04');
const u04EvidenceHtml = documentHtml(u04Evidence.runtime, { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos' });
assert.match(u04EvidenceHtml, /Evidência/);
assert.doesNotMatch(u04EvidenceHtml, /Interação ainda não suportada/i);

const u05Open = await service.loadLesson('N0-U05', 'N0-U05-L02');
const u05OpenHtml = documentHtml(u05Open.runtime, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens' });
assert.match(u05OpenHtml, /Registrar resposta/);
assert.match(u05OpenHtml, /Ver apoio opcional/);
assert.doesNotMatch(u05OpenHtml, /Interação ainda não suportada/i);

const u05Controlled = await service.loadLesson('N0-U05', 'N0-U05-L08');
const u05ControlledHtml = documentHtml(u05Controlled.runtime, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens' });
assert.doesNotMatch(u05ControlledHtml, /Interação ainda não suportada/i);

const u06AudioLesson = await service.loadLesson('N0-U06', 'N0-U06-L06');
const u06AudioHtml = documentHtml(u06AudioLesson.runtime, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano' });
assert.match(u06AudioHtml, /data-delayed-transcript-control/);
assert.match(u06AudioHtml, /Mostrar transcrição depois de ouvir/);
for (const block of u06AudioLesson.runtime.blocks) {
  if (typeof block.content?.transcriptAfterAttempt === 'string') assert.equal(u06AudioHtml.includes(block.content.transcriptAfterAttempt), false);
  for (const item of block.content?.items || []) if (typeof item.transcriptAfterAttempt === 'string') assert.equal(u06AudioHtml.includes(item.transcriptAfterAttempt), false);
}

const u06RepairLesson = await service.loadLesson('N0-U06', 'N0-U06-L10');
const u06RepairHtml = documentHtml(u06RepairLesson.runtime, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano' });
assert.match(u06RepairHtml, /Ensaio oral/);
assert.match(u06RepairHtml, /Este ensaio é opcional nesta etapa escrita/);
assert.match(u06RepairHtml, /Registrar resposta/);

const u06Verification = await service.loadVerification('N0-U06');
const u06VerificationHtml = documentHtml(u06Verification.runtime, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano', verification: true });
assert.match(u06VerificationHtml, /Ensaio oral/);
assert.match(u06VerificationHtml, /Concluí o ensaio oral/);
assert.match(u06VerificationHtml, /não avalia pronúncia, sotaque ou compreensibilidade da fala/i);
assert.doesNotMatch(u06VerificationHtml, /transcriptAfterAttempt|requiredForClaimOfValidatedOralComprehensibility|externalReview/);

const n1ReadingLesson = await service.loadLesson('N1-U01', 'N1-U01-L07');
const n1ReadingHtml = documentHtml(n1ReadingLesson.runtime, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia' });
assert.doesNotMatch(n1ReadingHtml, /Interação ainda não suportada/i);

const n1SummaryLesson = await service.loadLesson('N1-U01', 'N1-U01-L09');
const n1SummaryHtml = documentHtml(n1SummaryLesson.runtime, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia' });
assert.match(n1SummaryHtml, /Registrar resposta/);
assert.doesNotMatch(n1SummaryHtml, /Interação ainda não suportada/i);

const n1Verification = await service.loadVerification('N1-U01');
const n1VerificationHtml = documentHtml(n1Verification.runtime, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia', verification: true });
assert.doesNotMatch(n1VerificationHtml, /Interação ainda não suportada/i);
assert.match(n1VerificationHtml, /Registrar resposta/);

const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
const n4Html = documentHtml(n4Lesson.runtime, { unitId: 'N4-U09', unitTitle: 'Literatura, multimodalidade, autoria intermedial e digital' });
assert.match(n4Html, /avaliação pendente/i);
assert.match(n4Html, /Registrar resposta/i);
assert.equal(typeof n4Lesson.runtime.presentation?.intro, 'string');
assert.notEqual(n4Lesson.runtime.presentation.intro, n4Lesson.runtime.objective);

assert.equal(lessonCount, 77);
assert.equal(verificationCount, 8);
console.log(`Renderer clássico P7: ${lessonCount} lições + ${verificationCount} verificações, N0 completo + N1-U01 e caso-âncora N4 preservados.`);
