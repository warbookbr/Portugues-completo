import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content); }
function replaceRequired(source, from, to, label) {
  if (source.includes(to)) return source;
  if (!source.includes(from)) throw new Error(`Patch T1.9 não encontrou: ${label}`);
  return source.replace(from, to);
}

// app.js — migration wiring + content revision + legacy route aliases.
{
  const path = 'app/js/app.js';
  let source = read(path);
  source = replaceRequired(
    source,
    "import { createSafeProgressStorage } from './services/progress-storage-service.js';",
    "import { createSafeProgressStorage } from './services/progress-storage-service.js';\nimport { createMigratingProgressStorage } from './services/progress-migration-storage.js';\nimport { migrateProgressToT1N0, T1_N0_CONTENT_REVISION } from './services/progress-migration-t1-n0.js';",
    'imports de migração no app'
  );
  source = replaceRequired(
    source,
    "const progressStorage = createSafeProgressStorage();\nconst progressService = createProgressService({ storage: progressStorage });\nconst progressSyncService = createProgressSyncService({ progressService });",
    "const baseProgressStorage = createSafeProgressStorage();\nconst progressStorage = createMigratingProgressStorage({ storage: baseProgressStorage, migrateProgress: migrateProgressToT1N0 });\nconst progressService = createProgressService({ storage: progressStorage, contentRevision: T1_N0_CONTENT_REVISION });\nconst progressSyncService = createProgressSyncService({ progressService, migrateProgress: migrateProgressToT1N0 });\n\nconst LEGACY_LESSON_HASH_ALIASES = new Map([\n  ['#/unidade/N0-U01/licao/N0-U01-L01', '#/unidade/N0-U02/licao/N0-U02-L10'],\n  ['#/unidade/N0-U01/licao/N0-U01-L08', '#/unidade/N0-U02/licao/N0-U02-L09']\n]);\n\nfunction normalizeLegacyLessonHash() {\n  const canonical = LEGACY_LESSON_HASH_ALIASES.get(globalThis.location?.hash || '');\n  if (!canonical) return;\n  globalThis.history?.replaceState?.(null, '', canonical);\n}\n\nnormalizeLegacyLessonHash();\nglobalThis.addEventListener?.('hashchange', normalizeLegacyLessonHash);",
    'ativação da revisão T1.9 no app'
  );
  write(path, source);
}

// Renderer test — new catalog/first lesson/public copy.
{
  const path = 'scripts/test-classic-renderer.mjs';
  let source = read(path);
  source = source.replace("assert.match(home, /Fala, sons e escrita/);", "assert.match(home, /Letras e primeiros sons/);\nassert.match(home, /Sílabas e primeiras palavras/);");
  source = source.replace("const n0Lesson = await service.loadLesson('N0-U01', 'N0-U01-L01');", "const n0Lesson = await service.loadLesson('N0-U01', 'N0-U01-L03');");
  source = source.replace(
    "assert.equal(n0Lesson.runtime.presentation.introSource, 'SAFE_FALLBACK', 'conteúdo legado deve usar fallback público seguro até a migração T1.9');\nassert.equal(n0Lesson.runtime.presentation.intro, 'Nesta lição, você vai estudar o conteúdo passo a passo.');",
    "assert.equal(n0Lesson.runtime.presentation.introSource, 'AUTHORED', 'primeira lição publicada T1.9 deve usar copy pública autoral');\nassert.equal(n0Lesson.runtime.presentation.intro, 'Entender o que é uma letra e conhecer as letras do alfabeto, seus nomes e sua ordem.');"
  );
  source = source.replace("assert.equal(lessonCount, 20);", "assert.equal(lessonCount, 29);");
  source = source.replace("assert.equal(verificationCount, 2);", "assert.equal(verificationCount, 3);");
  if (!source.includes("const u2FirstLesson = await service.loadLesson('N0-U02', 'N0-U02-L01');")) {
    source = source.replace(
      "const n0Verification = await service.loadVerification('N0-U01');",
      "const u2FirstLesson = await service.loadLesson('N0-U02', 'N0-U02-L01');\nassert.equal(u2FirstLesson.runtime.presentation.introSource, 'AUTHORED');\nassert.equal(u2FirstLesson.runtime.title, 'O que é uma sílaba?');\nassert.notEqual(u2FirstLesson.runtime.presentation.intro, u2FirstLesson.runtime.objective);\n\nconst n0Verification = await service.loadVerification('N0-U01');"
    );
  }
  write(path, source);
}

// Visual smoke — canonical T1.9 entry + legacy aliases.
{
  const path = 'scripts/capture-classic-visuals.sh';
  let source = read(path);
  source = source.replaceAll('N0-U01-L01', 'N0-U01-L03');
  source = source.replaceAll('Fala, sons e escrita', 'Letras e primeiros sons');
  source = source.replaceAll(
    'Nesta lição, você vai estudar o conteúdo passo a passo.',
    'Entender o que é uma letra e conhecer as letras do alfabeto, seus nomes e sua ordem.'
  );
  source = source.replace(
    "N4_ACTIVITY_DOM=\"$(assert_page 'artifacts/classic-visuals/resume-n4-step2.html' 'Interpretação literária autônoma e evidência')\"",
    "N4_ACTIVITY_DOM=\"$(assert_page 'artifacts/classic-visuals/resume-n4-step2.html' 'Interpretação literária autônoma e evidência')\"\nALIAS_L01_DOM=\"$(assert_page '#/unidade/N0-U01/licao/N0-U01-L01' 'Falar e escrever: duas formas de comunicar')\"\nALIAS_L08_DOM=\"$(assert_page '#/unidade/N0-U01/licao/N0-U01-L08' 'Letras e sons podem variar')\""
  );
  source = source.replace(
    "grep -Fq 'Ouvir exemplo' <<<\"$RESUME_N0_ACTIVITY_DOM\" || { echo 'Smoke DOM: ttsText não virou controle de TTS no fluxo iniciado.' >&2; exit 1; }",
    "grep -Fq 'Voltar para a unidade' <<<\"$RESUME_N0_ACTIVITY_DOM\" || { echo 'Smoke DOM T1.9: fluxo iniciado da nova primeira lição perdeu navegação.' >&2; exit 1; }"
  );
  if (!source.includes('Smoke DOM T1.9: alias histórico L01')) {
    source = source.replace(
      "grep -Fq 'Registrar resposta' <<<\"$N4_ACTIVITY_DOM\" || { echo 'Smoke DOM: atividade aberta N4 ausente na retomada.' >&2; exit 1; }",
      "grep -Fq 'Registrar resposta' <<<\"$N4_ACTIVITY_DOM\" || { echo 'Smoke DOM: atividade aberta N4 ausente na retomada.' >&2; exit 1; }\ngrep -Fq 'Falar e escrever: duas formas de comunicar' <<<\"$ALIAS_L01_DOM\" || { echo 'Smoke DOM T1.9: alias histórico L01 não resolveu para U2-L10.' >&2; exit 1; }\ngrep -Fq 'Letras e sons podem variar' <<<\"$ALIAS_L08_DOM\" || { echo 'Smoke DOM T1.9: alias histórico L08 não resolveu para U2-L09.' >&2; exit 1; }"
    );
  }
  write(path, source);
}

console.log('T1.9 wiring atômico aplicado: revisão de progresso, aliases e testes atualizados.');
