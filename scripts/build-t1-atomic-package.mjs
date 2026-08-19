import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolve = value => path.join(root, value);

function read(file) { return fs.readFileSync(resolve(file), 'utf8'); }
function write(file, content) { fs.mkdirSync(path.dirname(resolve(file)), { recursive: true }); fs.writeFileSync(resolve(file), content); }
function readJson(file) { return JSON.parse(read(file)); }
function writeJson(file, value) { write(file, `${JSON.stringify(value, null, 2)}\n`); }

function replaceOnce(file, before, after) {
  const source = read(file);
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado ${count === 0 ? 'não encontrado' : `encontrado ${count} vezes`}.`);
  write(file, source.replace(before, after));
}

await import('./promote-t1-n0-content.mjs');

// P1 continua provando a fonte histórica sem recolocá-la no manifest ativo.
const fixtureManifest = readJson('schemas/fixtures/p1/manifest.json');
const legacyLessonFixture = fixtureManifest.cases.find(item => item.id === 'P1-LESSON-N0-U01-L01');
if (!legacyLessonFixture) throw new Error('Fixture P1-LESSON-N0-U01-L01 não encontrada.');
legacyLessonFixture.sources = ['content/units/001-fala-sons-escrita/legacy/lessons/001-fala-e-escrita.json'];
writeJson('schemas/fixtures/p1/manifest.json', fixtureManifest);

// Ativação atômica: o cache local e o Gist passam a usar o mesmo mapper no mesmo lote do catálogo novo.
replaceOnce(
  'app/js/app.js',
  "import { createSafeProgressStorage } from './services/progress-storage-service.js';",
  "import { createSafeProgressStorage } from './services/progress-storage-service.js';\nimport { createMigratingProgressStorage } from './services/progress-migration-storage.js';\nimport { migrateProgressToT1N0 } from './services/progress-migration-t1-n0.js';"
);
replaceOnce(
  'app/js/app.js',
  "const progressStorage = createSafeProgressStorage();\nconst progressService = createProgressService({ storage: progressStorage });\nconst progressSyncService = createProgressSyncService({ progressService });",
  "const baseProgressStorage = createSafeProgressStorage();\nconst progressStorage = createMigratingProgressStorage({ storage: baseProgressStorage, migrateProgress: migrateProgressToT1N0 });\nconst progressService = createProgressService({ storage: progressStorage });\nconst progressSyncService = createProgressSyncService({ progressService, migrateProgress: migrateProgressToT1N0 });"
);
replaceOnce(
  'app/js/app.js',
  "async function renderLesson(route, revision) {\n  const manifest = await loadManifest(route.unitId);\n  const loaded = await contentService.loadLesson(route.unitId, route.lessonId);",
  "const LESSON_ROUTE_ALIASES = new Map([\n  ['N0-U01/N0-U01-L01', { unitId: 'N0-U02', lessonId: 'N0-U02-L10' }],\n  ['N0-U01/N0-U01-L08', { unitId: 'N0-U02', lessonId: 'N0-U02-L09' }]\n]);\n\nfunction resolveLessonRoute(route) {\n  return LESSON_ROUTE_ALIASES.get(`${route.unitId}/${route.lessonId}`) || route;\n}\n\nasync function renderLesson(route, revision) {\n  const resolved = resolveLessonRoute(route);\n  const manifest = await loadManifest(resolved.unitId);\n  const loaded = await contentService.loadLesson(resolved.unitId, resolved.lessonId);"
);

// Smoke visual passa a usar a nova primeira lição e testa também os aliases históricos.
replaceOnce('scripts/capture-classic-visuals.sh',
  "seed_lesson_page resume-n0-step0 N0-U01-L01 0 '#/unidade/N0-U01/licao/N0-U01-L01'\nseed_lesson_page resume-n0-step2 N0-U01-L01 2 '#/unidade/N0-U01/licao/N0-U01-L01'",
  "seed_lesson_page resume-n0-step0 N0-U01-L03 0 '#/unidade/N0-U01/licao/N0-U01-L03'\nseed_lesson_page resume-n0-step2 N0-U01-L03 2 '#/unidade/N0-U01/licao/N0-U01-L03'"
);
replaceOnce('scripts/capture-classic-visuals.sh',
  "UNIT_DOM=\"$(assert_page '#/unidade/N0-U01' 'Fala, sons e escrita')\"\nLESSON_DOM=\"$(assert_page '#/unidade/N0-U01/licao/N0-U01-L01' 'Começar lição')\"",
  "UNIT_DOM=\"$(assert_page '#/unidade/N0-U01' 'Letras e primeiros sons')\"\nLESSON_DOM=\"$(assert_page '#/unidade/N0-U01/licao/N0-U01-L03' 'Começar lição')\"\nLEGACY_L01_DOM=\"$(assert_page '#/unidade/N0-U01/licao/N0-U01-L01' 'Falar e escrever: duas formas de comunicar')\"\nLEGACY_L08_DOM=\"$(assert_page '#/unidade/N0-U01/licao/N0-U01-L08' 'Letras e sons podem variar')\""
);
replaceOnce('scripts/capture-classic-visuals.sh',
  "grep -Fq 'Nesta lição, você vai estudar o conteúdo passo a passo.' <<<\"$LESSON_DOM\" || { echo 'Smoke DOM T1.7: fallback público seguro ausente.' >&2; exit 1; }",
  "grep -Fq 'Entender o que é uma letra e conhecer as letras do alfabeto, seus nomes e sua ordem.' <<<\"$LESSON_DOM\" || { echo 'Smoke DOM T1.9: abertura pública autorada da nova primeira lição ausente.' >&2; exit 1; }\ngrep -Fq 'href=\"#/unidade/N0-U02\"' <<<\"$LEGACY_L01_DOM$LEGACY_L08_DOM\" || { echo 'Smoke DOM T1.9: alias histórico não aponta de volta para a unidade canônica.' >&2; exit 1; }"
);
for (const [from, to] of [
  ["capture lesson-n0-intro-desktop 1440 900 '#/unidade/N0-U01/licao/N0-U01-L01'", "capture lesson-n0-intro-desktop 1440 900 '#/unidade/N0-U01/licao/N0-U01-L03'"],
  ["capture lesson-n0-intro-tablet 900 900 '#/unidade/N0-U01/licao/N0-U01-L01'", "capture lesson-n0-intro-tablet 900 900 '#/unidade/N0-U01/licao/N0-U01-L03'"],
  ["capture lesson-n0-intro-narrow 680 900 '#/unidade/N0-U01/licao/N0-U01-L01'", "capture lesson-n0-intro-narrow 680 900 '#/unidade/N0-U01/licao/N0-U01-L03'"],
  ["capture lesson-n0-intro-mobile 390 844 '#/unidade/N0-U01/licao/N0-U01-L01'", "capture lesson-n0-intro-mobile 390 844 '#/unidade/N0-U01/licao/N0-U01-L03'"]
]) replaceOnce('scripts/capture-classic-visuals.sh', from, to);

// Gate permanente da integração atômica T1.9.
write('scripts/test-t1-atomic-promotion.mjs', `import fs from 'node:fs';\nimport path from 'node:path';\nimport { fileURLToPath } from 'node:url';\n\nconst root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');\nconst read = file => fs.readFileSync(path.join(root, file), 'utf8');\nconst json = file => JSON.parse(read(file));\nconst fail = message => { throw new Error(message); };\n\nconst course = json('content/course.json');\nconst u1 = json('content/units/001-fala-sons-escrita/unit.json');\nconst u2 = json('content/units/002-das-silabas-as-palavras/unit.json');\nconst app = read('app/js/app.js');\nconst fixture = json('schemas/fixtures/p1/manifest.json');\n\nconst catalogU1 = course.units.find(item => item.id === 'N0-U01');\nconst catalogU2 = course.units.find(item => item.id === 'N0-U02');\nif (catalogU1?.title !== 'Letras e primeiros sons') fail('Catálogo não publicou a nova N0-U01.');\nif (catalogU2?.title !== 'Sílabas e primeiras palavras') fail('Catálogo não publicou a N0-U02 T1.');\nif (u1.verification?.id !== 'N0-U01-V02') fail('N0-U01 não aponta para V02.');\nif (u2.verification?.id !== 'N0-U02-V02') fail('N0-U02 não aponta para V02.');\nif (u1.lessons.some(item => ['N0-U01-L01','N0-U01-L08'].includes(item.id))) fail('Lições movidas ainda estão ativas em U1.');\nif (!u2.lessons.some(item => item.id === 'N0-U02-L09') || !u2.lessons.some(item => item.id === 'N0-U02-L10')) fail('Lições movidas não foram materializadas em U2.');\nif (!app.includes('createMigratingProgressStorage({ storage: baseProgressStorage, migrateProgress: migrateProgressToT1N0 })')) fail('Migração local não está ativa.');\nif (!app.includes('createProgressSyncService({ progressService, migrateProgress: migrateProgressToT1N0 })')) fail('Migração do sync/Gist não está ativa.');\nif (!app.includes("'N0-U01/N0-U01-L01', { unitId: 'N0-U02', lessonId: 'N0-U02-L10' }")) fail('Alias histórico L01 ausente.');\nif (!app.includes("'N0-U01/N0-U01-L08', { unitId: 'N0-U02', lessonId: 'N0-U02-L09' }")) fail('Alias histórico L08 ausente.');\nconst historical = fixture.cases.find(item => item.id === 'P1-LESSON-N0-U01-L01');\nif (historical?.sources?.[0] !== 'content/units/001-fala-sons-escrita/legacy/lessons/001-fala-e-escrita.json') fail('Fixture histórica P1 não foi redirecionada para legacy.');\nif (!fs.existsSync(path.join(root, historical.sources[0]))) fail('Fonte histórica legacy não existe.');\nconsole.log('T1.9 promoção atômica: catálogo + V02 + migração + aliases + legacy OK.');\n`);

replaceOnce(
  '.github/workflows/validate-project.yml',
  "      - name: Test T1 progress migration wiring\n        run: node scripts/test-progress-migration-wiring.mjs\n\n      - name: Test progress policies",
  "      - name: Test T1 progress migration wiring\n        run: node scripts/test-progress-migration-wiring.mjs\n\n      - name: Test T1 atomic promotion\n        run: node scripts/test-t1-atomic-promotion.mjs\n\n      - name: Test progress policies"
);

console.log('Pacote atômico T1.9 preparado.');
