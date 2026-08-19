import fs from 'node:fs';

const file = 'scripts/capture-classic-visuals.sh';
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(before, after) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado ${count === 0 ? 'não encontrado' : `encontrado ${count} vezes`}.`);
  source = source.replace(before, after);
}

replaceOnce(
  "seed_lesson_page resume-n0-step2 N0-U01-L03 2 '#/unidade/N0-U01/licao/N0-U01-L03'\nseed_lesson_page resume-n4-step2 N4-U09-L01 2 '#/unidade/N4-U09/licao/N4-U09-L01'",
  "seed_lesson_page resume-n0-step2 N0-U01-L03 2 '#/unidade/N0-U01/licao/N0-U01-L03'\nseed_lesson_page tts-u2-step2 N0-U02-L07 2 '#/unidade/N0-U02/licao/N0-U02-L07'\nseed_lesson_page resume-n4-step2 N4-U09-L01 2 '#/unidade/N4-U09/licao/N4-U09-L01'"
);

replaceOnce(
  "RESUME_N0_ACTIVITY_DOM=\"$(assert_page 'artifacts/classic-visuals/resume-n0-step2.html' 'Voltar para a unidade')\"\nN4_DOM=\"$(assert_page '#/unidade/N4-U09/licao/N4-U09-L01' 'Começar lição')\"",
  "RESUME_N0_ACTIVITY_DOM=\"$(assert_page 'artifacts/classic-visuals/resume-n0-step2.html' 'Voltar para a unidade')\"\nTTS_U2_DOM=\"$(assert_page 'artifacts/classic-visuals/tts-u2-step2.html' 'Ouvir A')\"\nN4_DOM=\"$(assert_page '#/unidade/N4-U09/licao/N4-U09-L01' 'Começar lição')\""
);

replaceOnce(
  "grep -Fq 'Ouvir exemplo' <<<\"$RESUME_N0_ACTIVITY_DOM\" || { echo 'Smoke DOM: ttsText não virou controle de TTS no fluxo iniciado.' >&2; exit 1; }",
  "grep -Fq 'data-tts=' <<<\"$TTS_U2_DOM\" || { echo 'Smoke DOM T1.9: opções de áudio da U2 não viraram controles TTS após a tentativa.' >&2; exit 1; }\nif grep -Eiq 'N0-U01-L03-AUD|initialsupportlevel|feedbacktts|supportbuttonlabel|mediaId' <<<\"$RESUME_N0_ACTIVITY_DOM$TTS_U2_DOM\"; then\n  echo 'Smoke DOM T1.9: metadado técnico vazou para a interface do aluno.' >&2\n  exit 1\nfi"
);

replaceOnce(
  "capture lesson-n0-activity-desktop 1440 1100 'artifacts/classic-visuals/resume-n0-step2.html'\ncapture lesson-n0-resume-mobile 390 900 'artifacts/classic-visuals/resume-n0-step0.html'",
  "capture lesson-n0-activity-desktop 1440 1100 'artifacts/classic-visuals/resume-n0-step2.html'\ncapture lesson-u2-tts-desktop 1440 1100 'artifacts/classic-visuals/tts-u2-step2.html'\ncapture lesson-n0-resume-mobile 390 900 'artifacts/classic-visuals/resume-n0-step0.html'"
);

fs.writeFileSync(file, source);
