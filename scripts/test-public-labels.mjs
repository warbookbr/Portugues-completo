import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml } from '../app/js/ui/classic-renderer.js';

// R1.3b: nenhum rótulo interno (chave de autoria em inglês ou camelCase) pode aparecer
// como título de campo para o aluno em conteúdo publicado no catálogo.
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const course = readJson('content/course.json');
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const forbiddenAnswerLabels = /^(answer|acceptable|strong ?clue|meaning|evidence ?parts|refers ?to|correct)/i;
let documents = 0;
const problems = [];

for (const unit of course.units) {
  const manifestPath = path.join('content', unit.manifest);
  const manifest = readJson(manifestPath);
  const dir = path.dirname(manifestPath);
  const files = manifest.lessons.map(lesson => path.join(dir, lesson.path));
  if (manifest.verification?.path) files.push(path.join(dir, manifest.verification.path));
  for (const file of files) {
    const runtime = service.normalize(readJson(file));
    const html = documentHtml(runtime, { unitId: unit.id, unitTitle: unit.title, verification: runtime.kind !== 'LESSON' });
    documents += 1;
    const labels = [
      ...[...html.matchAll(/<dt>([^<]*)<\/dt>/g)].map(match => match[1]),
      ...[...html.matchAll(/<div class="content-detail"><strong>([^<]*)<\/strong>/g)].map(match => match[1])
    ];
    for (const label of labels) {
      const looksInternal = /[a-z][A-Z]/.test(label) || /^[a-z]+( [a-z]+)*$/.test(label) || forbiddenAnswerLabels.test(label);
      if (looksInternal) problems.push(`${runtime.id}: rótulo interno exposto "${label}"`);
    }
  }
}

assert.deepEqual(problems, [], problems.slice(0, 20).join('\n'));
console.log(`Rótulos públicos: ${documents} documentos publicados sem chaves internas expostas.`);
