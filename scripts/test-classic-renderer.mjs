import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml, homeHtml, unitHtml } from '../app/js/ui/classic-renderer.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function fileFetch(url) {
  const projectPath = String(url).replace(/^\.\//, '');
  const filePath = path.resolve(root, projectPath);
  if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filePath)) {
    return { ok: false, status: 404, async json() { return null; } };
  }
  return { ok: true, status: 200, async json() { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } };
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
    assert.match(html, new RegExp(lessonRef.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
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

const home = homeHtml(catalog, units);
assert.match(home, /Modo Clássico/);
assert.match(home, /N0-U01|Fala, sons e escrita/);
assert.match(home, /N4-U09|Literatura, multimodalidade/);

const n0Verification = await service.loadVerification('N0-U01');
const n0Html = documentHtml(n0Verification.runtime, { unitId: 'N0-U01', unitTitle: 'Fala, sons e escrita', verification: true });
assert.match(n0Html, /Áudio controlado pendente/);
assert.match(n0Html, /N0-U01-V01-AUD-/);

const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
const n4Html = documentHtml(n4Lesson.runtime, { unitId: 'N4-U09', unitTitle: 'Literatura, multimodalidade, autoria intermedial e digital' });
assert.match(n4Html, /avaliação pendente/i);
assert.match(n4Html, /validação permanece pendente|Registrar resposta/i);

assert.equal(lessonCount, 20);
assert.equal(verificationCount, 2);
console.log(`Renderer clássico P4: ${lessonCount} lições + ${verificationCount} verificações do slice renderizadas sem estado unsupported.`);
