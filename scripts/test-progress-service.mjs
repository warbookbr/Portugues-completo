import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ContentService } from '../app/js/services/content-service.js';
import { ProgressService, createEmptyProgress, mergeProgress } from '../app/js/services/progress-service.js';
import { validateValue } from './validate-contracts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

async function fileFetch(url) {
  const filePath = path.resolve(root, String(url).replace(/^\.\//, ''));
  if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filePath)) return { ok: false, status: 404, async json() { return null; } };
  return { ok: true, status: 200, async json() { return readJson(path.relative(root, filePath)); } };
}

const moments = [
  '2026-08-17T10:00:00.000Z', '2026-08-17T10:01:00.000Z', '2026-08-17T10:02:00.000Z',
  '2026-08-17T10:03:00.000Z', '2026-08-17T10:04:00.000Z', '2026-08-17T10:05:00.000Z',
  '2026-08-17T10:06:00.000Z', '2026-08-17T10:07:00.000Z'
];
let clockIndex = 0;
const clock = () => new Date(moments[Math.min(clockIndex++, moments.length - 1)]);
const storage = new MemoryStorage();
const progress = new ProgressService({ storage, clock });
const content = new ContentService({ basePath: './content', fetchImpl: fileFetch });

const n0 = (await content.loadLesson('N0-U01', 'N0-U01-L01')).runtime;
const a01 = n0.blocks.find(block => block.id === 'L01-A01');
const c03 = n0.blocks.find(block => block.id === 'L01-C03');

progress.visitDocument(n0, { levelId: 'N0', unitId: 'N0-U01' });
progress.recordActivity(n0, a01, { complete: true, correct: false, score: 0.5 });
let snapshot = progress.getProgress();
assert.equal(snapshot.evidence['N0-U01-L01/L01-A01'].status, 'REVISAO_RECOMENDADA');
assert.equal(snapshot.curriculum.lessons['N0-U01-L01'].status, 'EM_ESTUDO');
assert.equal(snapshot.competencies['N0-U01-C01'].status, 'EM_DESENVOLVIMENTO');
assert.equal(snapshot.review.queue[0].competencyId, 'N0-U01-C01');

progress.recordActivity(n0, a01, { complete: true, correct: true, score: 1 });
snapshot = progress.getProgress();
assert.equal(snapshot.evidence['N0-U01-L01/L01-A01'].status, 'DEMONSTRADA');
assert.equal(snapshot.evidence['N0-U01-L01/L01-A01'].attemptCount, 2);
assert.equal(snapshot.review.queue.length, 0);
assert.equal(snapshot.curriculum.lessons['N0-U01-L01'].status, 'EM_ESTUDO');

progress.recordActivity(n0, c03, { complete: true, correct: true });
snapshot = progress.getProgress();
assert.equal(snapshot.curriculum.lessons['N0-U01-L01'].status, 'CONCLUIDA');
assert.equal(snapshot.competencies['N0-U01-C01'].status, 'DEMONSTRADA');

const n4 = (await content.loadLesson('N4-U09', 'N4-U09-L01')).runtime;
const n4Open = n4.blocks.find(block => block.id === 'L01-A01');
progress.visitDocument(n4, { levelId: 'N4', unitId: 'N4-U09' });
progress.recordActivity(n4, n4Open, { complete: true, pending: true }, { response: 'Minha interpretação sustentada por três evidências.' });
snapshot = progress.getProgress();
assert.equal(snapshot.evidence['N4-U09-L01/L01-A01'].status, 'VALIDACAO_PENDENTE');
assert.equal(snapshot.curriculum.lessons['N4-U09-L01'].status, 'CONCLUIDA');
assert.equal(snapshot.competencies['N4-U09-C01'].status, 'EM_DESENVOLVIMENTO');
assert.equal(snapshot.responses['N4-U09-L01/L01-A01'].revision, 1);
assert.match(snapshot.responses['N4-U09-L01/L01-A01'].value, /interpretação/);

const progressSchema = readJson('schemas/progress.schema.json');
assert.deepEqual(validateValue(progressSchema, snapshot, 'progress runtime'), []);

const base = createEmptyProgress({ clock: () => new Date('2026-08-17T12:00:00.000Z') });
const local = structuredClone(base);
const remote = structuredClone(base);
local.responses['N4-U09-L01/L01-A01'] = { type: 'LONG_TEXT', value: 'versão local', updatedAt: '2026-08-17T12:10:00.000Z', revision: 1 };
local.meta.updatedAt = '2026-08-17T12:10:00.000Z';
remote.responses['N4-U09-L01/L01-A01'] = { type: 'LONG_TEXT', value: 'versão remota', updatedAt: '2026-08-17T12:11:00.000Z', revision: 1 };
remote.meta.updatedAt = '2026-08-17T12:11:00.000Z';
local.curriculum.lessons['N0-U01-L01'] = { status: 'CONCLUIDA', startedAt: '2026-08-17T12:01:00.000Z', completedAt: '2026-08-17T12:09:00.000Z', lastVisitedAt: '2026-08-17T12:09:00.000Z' };
remote.curriculum.lessons['N4-U09-L01'] = { status: 'EM_ESTUDO', startedAt: '2026-08-17T12:02:00.000Z', completedAt: null, lastVisitedAt: '2026-08-17T12:11:00.000Z' };

const merged = mergeProgress(local, remote, base);
assert.equal(merged.progress.curriculum.lessons['N0-U01-L01'].status, 'CONCLUIDA');
assert.equal(merged.progress.curriculum.lessons['N4-U09-L01'].status, 'EM_ESTUDO');
assert.equal(merged.progress.responses['N4-U09-L01/L01-A01'].value, 'versão remota');
assert.equal(merged.conflicts.length, 1);
assert.ok(Object.keys(merged.progress.responses).some(key => key.includes('#conflict-')));
assert.ok(Object.values(merged.progress.responses).some(response => response.value === 'versão local'));
assert.deepEqual(validateValue(progressSchema, merged.progress, 'merged progress'), []);

console.log('ProgressService P5: N0 determinístico, recuperação/revisão, N4 pending, resposta persistida e merge sem perda validados.');
