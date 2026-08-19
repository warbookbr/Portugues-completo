import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const fail = message => { throw new Error(message); };

const course = json('content/course.json');
const u1 = json('content/units/001-fala-sons-escrita/unit.json');
const u2 = json('content/units/002-das-silabas-as-palavras/unit.json');
const app = read('app/js/app.js');
const fixture = json('schemas/fixtures/p1/manifest.json');

const catalogU1 = course.units.find(item => item.id === 'N0-U01');
const catalogU2 = course.units.find(item => item.id === 'N0-U02');
if (catalogU1?.title !== 'Letras e primeiros sons') fail('Catálogo não publicou a nova N0-U01.');
if (catalogU2?.title !== 'Sílabas e primeiras palavras') fail('Catálogo não publicou a N0-U02 T1.');
if (u1.verification?.id !== 'N0-U01-V02') fail('N0-U01 não aponta para V02.');
if (u2.verification?.id !== 'N0-U02-V02') fail('N0-U02 não aponta para V02.');
if (u1.lessons.some(item => ['N0-U01-L01','N0-U01-L08'].includes(item.id))) fail('Lições movidas ainda estão ativas em U1.');
if (!u2.lessons.some(item => item.id === 'N0-U02-L09') || !u2.lessons.some(item => item.id === 'N0-U02-L10')) fail('Lições movidas não foram materializadas em U2.');
if (!app.includes('createMigratingProgressStorage({ storage: baseProgressStorage, migrateProgress: migrateProgressToT1N0 })')) fail('Migração local não está ativa.');
if (!app.includes('createProgressSyncService({ progressService, migrateProgress: migrateProgressToT1N0 })')) fail('Migração do sync/Gist não está ativa.');
if (!app.includes("'N0-U01/N0-U01-L01', { unitId: 'N0-U02', lessonId: 'N0-U02-L10' }")) fail('Alias histórico L01 ausente.');
if (!app.includes("'N0-U01/N0-U01-L08', { unitId: 'N0-U02', lessonId: 'N0-U02-L09' }")) fail('Alias histórico L08 ausente.');
const historical = fixture.cases.find(item => item.id === 'P1-LESSON-N0-U01-L01');
if (historical?.sources?.[0] !== 'content/units/001-fala-sons-escrita/legacy/lessons/001-fala-e-escrita.json') fail('Fixture histórica P1 não foi redirecionada para legacy.');
if (!fs.existsSync(path.join(root, historical.sources[0]))) fail('Fonte histórica legacy não existe.');
console.log('T1.9 promoção atômica: catálogo + V02 + migração + aliases + legacy OK.');
