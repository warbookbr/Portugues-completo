import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml, unitHtml } from '../app/js/ui/classic-renderer.js';
import { homeHtml } from '../app/js/ui/classic-home.js';
import { buildLessonStepGroups } from '../app/js/ui/classic-lesson-flow.js';
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
    lessonCount += 1;
  }

  const verification = await service.loadVerification(manifest.id);
  const verificationHtml = documentHtml(verification.runtime, { unitId: manifest.id, unitTitle: manifest.title, verification: true });
  assert.doesNotMatch(verificationHtml, /Interação ainda não suportada/i, `${verification.runtime.id} possui interação sem renderer`);
  assert.match(verificationHtml, /Verificação da unidade/);
  verificationCount += 1;
}

const home = homeHtml(catalog, units, createEmptyProgress());
assert.match(home, /Fala, sons e escrita/);
assert.match(home, /Literatura, multimodalidade/);
assert.match(home, /Começar a estudar/);
assert.equal((home.match(/Começar a estudar/g) || []).length, 1, 'home deve ter um único CTA de início/retomada');
assert.doesNotMatch(home, /Continuar lição/i, 'home não deve manter CTA concorrente de continuar lição');
assert.doesNotMatch(home, /dashboard-hero/, 'home não deve manter hero introdutório acima da retomada');
assert.doesNotMatch(home, /Continue seu percurso de aprendizagem|Retome do ponto em que parou e avance no seu ritmo/i, 'home deve começar direto pela retomada/progresso');
assert.doesNotMatch(home, />\s*N[0-4]\s*[·•]/, 'home não deve expor código de nível ao aluno');
assert.doesNotMatch(home, /Ver plano de estudos/i, 'home não deve duplicar Plano de estudos');
assert.doesNotMatch(home, /<span class="eyebrow">Modo Clássico<\/span>/, 'home não deve repetir o modo já visível no cabeçalho');

const n0Lesson = await service.loadLesson('N0-U01', 'N0-U01-L01');
const guidedGroups = buildLessonStepGroups(n0Lesson.runtime.blocks);
assert.ok(guidedGroups.length >= 3 && guidedGroups.length <= 8, 'lição deve ser segmentada em poucas etapas significativas');
assert.ok(guidedGroups.length < n0Lesson.runtime.blocks.length, 'segmentação não deve criar uma tela por bloco');
assert.equal(guidedGroups.flat().length, n0Lesson.runtime.blocks.length, 'segmentação deve preservar todos os blocos');
assert.ok(guidedGroups.every(group => group.length <= 3), 'etapa não deve acumular conteúdo demais');

const n0Verification = await service.loadVerification('N0-U01');
const n0Html = documentHtml(n0Verification.runtime, { unitId: 'N0-U01', unitTitle: 'Fala, sons e escrita', verification: true });
assert.match(n0Html, /Áudio controlado pendente/);
assert.match(n0Html, /N0-U01-V01-AUD-/);

const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
const n4Html = documentHtml(n4Lesson.runtime, { unitId: 'N4-U09', unitTitle: 'Literatura, multimodalidade, autoria intermedial e digital' });
assert.match(n4Html, /avaliação pendente/i);
assert.match(n4Html, /Registrar resposta/i);

assert.equal(lessonCount, 20);
assert.equal(verificationCount, 2);
console.log(`Renderer clássico: ${lessonCount} lições + ${verificationCount} verificações, home sem hero e segmentação guiada validados.`);
