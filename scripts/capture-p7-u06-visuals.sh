#!/usr/bin/env bash
set -euo pipefail

# Gate visual canônico do lote P7 N0-U06: áudio-first, reformulação + ensaio oral e V01.
PORT=4178
OUT="artifacts/p7-u06-visuals"
mkdir -p "$OUT"

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
if [[ -z "$CHROME" ]]; then
  echo "Chrome/Chromium não encontrado no runner." >&2
  exit 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/portugues-completo-p7-u06-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in {1..20}; do
  if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null; then break; fi
  sleep 0.2
done

step_for() {
  local file="$1" block_id="$2"
  node --input-type=module - "$file" "$block_id" <<'NODE'
import fs from 'node:fs';
import { ContentService } from './app/js/services/content-service.js';
import { buildLessonStepGroups } from './app/js/ui/classic-lesson-flow.js';

const [, , file, blockId] = process.argv;
const source = JSON.parse(fs.readFileSync(file, 'utf8'));
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });
const runtime = service.normalize(source);
const groups = buildLessonStepGroups(runtime.blocks || []);
const index = groups.findIndex(group => group.some(block => block.id === blockId));
if (index < 0) throw new Error(`${blockId} não encontrado em ${file}`);
process.stdout.write(String(index));
NODE
}

L06_STEP="$(step_for content/units/006-usando-lingua-cotidiano/lessons/006-ouvindo-mensagens-curtas.json L06-B02)"
L10_STEP="$(step_for content/units/006-usando-lingua-cotidiano/lessons/010-reformular-e-confirmar-comunicacao.json L10-A02)"
V01_STEP="$(step_for content/units/006-usando-lingua-cotidiano/integrated-verification.json V01-Q12)"

seed_lesson() {
  local name="$1" document_id="$2" step="$3" route="$4"
  cat >"$OUT/$name.html" <<EOF
<!doctype html>
<meta charset="utf-8">
<title>Seed visual P7 U06</title>
<script>
localStorage.setItem('portugues-completo:lesson-ui:v1:${document_id}', JSON.stringify({version:1, started:true, step:${step}}));
location.replace('/${route}');
</script>
EOF
}

seed_verification() {
  local name="$1" document_id="$2" step="$3" route="$4"
  cat >"$OUT/$name.html" <<EOF
<!doctype html>
<meta charset="utf-8">
<title>Seed visual P7 U06 verificação</title>
<script>
sessionStorage.setItem('portugues-completo:lesson-step:${document_id}', String(${step}));
location.replace('/${route}');
</script>
EOF
}

seed_lesson u06-l06-audio N0-U06-L06 "$L06_STEP" '#/unidade/N0-U06/licao/N0-U06-L06'
seed_lesson u06-l10-repair N0-U06-L10 "$L10_STEP" '#/unidade/N0-U06/licao/N0-U06-L10'
seed_verification u06-v01-oral N0-U06-V01 "$V01_STEP" '#/unidade/N0-U06/verificacao'

page_dom() {
  local route="$1"
  "$CHROME" --headless --no-sandbox --disable-gpu --virtual-time-budget=3500 --dump-dom "http://127.0.0.1:${PORT}/${route}" 2>/dev/null
}

assert_page() {
  local route="$1" expected="$2"
  local dom
  dom="$(page_dom "$route")"
  grep -Fq "$expected" <<<"$dom" || { echo "P7 U06 smoke: conteúdo esperado ausente em $route -> $expected" >&2; exit 1; }
  if grep -Eq 'Erro de carregamento|Não foi possível abrir esta etapa|Interação ainda não suportada|Illegal invocation|Maximum call stack' <<<"$dom"; then
    echo "P7 U06 smoke: estado de erro/unsupported em $route" >&2
    exit 1
  fi
  printf '%s' "$dom"
}

UNIT_DOM="$(assert_page '#/unidade/N0-U06' 'Usando a língua no cotidiano')"
L06_DOM="$(assert_page 'artifacts/p7-u06-visuals/u06-l06-audio.html' 'Mostrar transcrição depois de ouvir')"
L10_DOM="$(assert_page 'artifacts/p7-u06-visuals/u06-l10-repair.html' 'Ensaio oral')"
V01_DOM="$(assert_page 'artifacts/p7-u06-visuals/u06-v01-oral.html' 'Verificação da unidade')"

grep -Fq '10 lições' <<<"$UNIT_DOM" || { echo 'P7 U06: unidade deve expor 10 lições.' >&2; exit 1; }

grep -Fq 'Ouvir exemplo' <<<"$L06_DOM" || { echo 'P7 U06: estímulo TTS audio-first ausente.' >&2; exit 1; }
grep -Fq 'data-delayed-transcript-control' <<<"$L06_DOM" || { echo 'P7 U06: controle de transcrição pós-tentativa ausente.' >&2; exit 1; }
grep -Fq 'data-transcript-reveal="" disabled' <<<"$L06_DOM" || grep -Fq 'data-transcript-reveal disabled' <<<"$L06_DOM" || { echo 'P7 U06: transcrição deve iniciar bloqueada.' >&2; exit 1; }
if grep -Fq 'A reunião começa às três na sala dois.' <<<"$L06_DOM"; then
  echo 'P7 U06: transcrição da demonstração vazou antes da tentativa.' >&2
  exit 1
fi

grep -Fq 'Registrar resposta' <<<"$L10_DOM" || { echo 'P7 U06: reformulação aberta não está registrável.' >&2; exit 1; }
grep -Fq 'Ensaio oral' <<<"$L10_DOM" || { echo 'P7 U06: ensaio oral opcional ausente na reformulação.' >&2; exit 1; }
grep -Fq 'Este ensaio é opcional nesta etapa escrita.' <<<"$L10_DOM" || { echo 'P7 U06: ensaio opcional não está explicado como complemento.' >&2; exit 1; }
grep -Fq 'não avalia pronúncia, sotaque ou compreensibilidade da fala' <<<"$L10_DOM" || { echo 'P7 U06: limite de autoridade oral não está visível.' >&2; exit 1; }
if grep -Fq 'Me encontre na porta da biblioteca às cinco.' <<<"$L10_DOM"; then
  echo 'P7 U06: modelo de reformulação vazou antes da tentativa.' >&2
  exit 1
fi

grep -Fq 'Ensaio oral' <<<"$V01_DOM" || { echo 'P7 U06: prática oral da V01 ausente.' >&2; exit 1; }
grep -Fq 'Concluí o ensaio oral.' <<<"$V01_DOM" || { echo 'P7 U06: registro explícito do ensaio oral ausente.' >&2; exit 1; }
grep -Fq 'não avalia pronúncia, sotaque ou compreensibilidade da fala' <<<"$V01_DOM" || { echo 'P7 U06: V01 precisa explicar o limite de validação oral.' >&2; exit 1; }
if grep -Fq '<strong>Autochecagem</strong>' <<<"$V01_DOM"; then
  echo 'P7 U06: selfCheck autoral duplicou a autochecagem pública.' >&2
  exit 1
fi
if grep -Eiq 'Rascunho/registro da resposta oral|oralidade-validada|produção oral compreensível' <<<"$V01_DOM"; then
  echo 'P7 U06: V01 sugere validação oral que o sistema não possui.' >&2
  exit 1
fi

if grep -Eiq 'transcriptAfterAttempt|transcriptHiddenUntilAttempt|externalReview|requiredForClaimOfValidatedOralComprehensibility|statusWhenApproved|automaticValidation|completionEvidence|activityPolicies|answerKey|schemaVersion|requiredIntent|>REQUIRED INTENT<|>MEANING<' <<<"$UNIT_DOM$L06_DOM$L10_DOM$V01_DOM"; then
  echo 'P7 U06: metadado técnico/autoral vazou para a interface do aluno.' >&2
  exit 1
fi

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --virtual-time-budget=3500 --window-size="${width},${height}" \
    --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture unit-u06-desktop 1440 1100 '#/unidade/N0-U06'
capture unit-u06-mobile 390 920 '#/unidade/N0-U06'
capture lesson-u06-l06-audio-desktop 1440 1150 'artifacts/p7-u06-visuals/u06-l06-audio.html'
capture lesson-u06-l06-audio-mobile 390 1050 'artifacts/p7-u06-visuals/u06-l06-audio.html'
capture lesson-u06-l10-repair-desktop 1440 1250 'artifacts/p7-u06-visuals/u06-l10-repair.html'
capture verification-u06-v01-oral-desktop 1440 1250 'artifacts/p7-u06-visuals/u06-v01-oral.html'
capture verification-u06-v01-oral-mobile 390 1100 'artifacts/p7-u06-visuals/u06-v01-oral.html'

printf 'P7 U06 smoke DOM + screenshots: %s (L06 step %s, L10 step %s, V01 step %s)\n' "$OUT" "$L06_STEP" "$L10_STEP" "$V01_STEP"
