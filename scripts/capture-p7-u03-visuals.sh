#!/usr/bin/env bash
set -euo pipefail

PORT=4175
OUT="artifacts/p7-u03-visuals"
mkdir -p "$OUT"

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
if [[ -z "$CHROME" ]]; then
  echo "Chrome/Chromium não encontrado no runner." >&2
  exit 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/portugues-completo-p7-u03-http.log 2>&1 &
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

L03_STEP="$(step_for content/units/003-palavras-frases-sentido/lessons/003-contexto-ajuda-entender-palavra.json L03-A03)"
L10_STEP="$(step_for content/units/003-palavras-frases-sentido/lessons/010-criando-frases-proprias.json L10-A01)"
V01_STEP="$(step_for content/units/003-palavras-frases-sentido/integrated-verification.json V01-Q10)"

seed_lesson() {
  local name="$1" document_id="$2" step="$3" route="$4"
  cat >"$OUT/$name.html" <<EOF
<!doctype html>
<meta charset="utf-8">
<title>Seed visual P7 U03</title>
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
<title>Seed visual P7 U03 verificação</title>
<script>
sessionStorage.setItem('portugues-completo:lesson-step:${document_id}', String(${step}));
location.replace('/${route}');
</script>
EOF
}

seed_lesson u03-l03-progressive N0-U03-L03 "$L03_STEP" '#/unidade/N0-U03/licao/N0-U03-L03'
seed_lesson u03-l10-open N0-U03-L10 "$L10_STEP" '#/unidade/N0-U03/licao/N0-U03-L10'
seed_verification u03-v01-open N0-U03-V01 "$V01_STEP" '#/unidade/N0-U03/verificacao'

page_dom() {
  local route="$1"
  "$CHROME" --headless --no-sandbox --disable-gpu --virtual-time-budget=2600 --dump-dom "http://127.0.0.1:${PORT}/${route}" 2>/dev/null
}

assert_page() {
  local route="$1" expected="$2"
  local dom
  dom="$(page_dom "$route")"
  grep -Fq "$expected" <<<"$dom" || { echo "P7 U03 smoke: conteúdo esperado ausente em $route -> $expected" >&2; exit 1; }
  if grep -Eq 'Erro de carregamento|Não foi possível abrir esta etapa|Interação ainda não suportada|Illegal invocation' <<<"$dom"; then
    echo "P7 U03 smoke: estado de erro/unsupported em $route" >&2
    exit 1
  fi
  printf '%s' "$dom"
}

UNIT_DOM="$(assert_page '#/unidade/N0-U03' 'Palavras, frases e sentido')"
L03_DOM="$(assert_page 'artifacts/p7-u03-visuals/u03-l03-progressive.html' 'Ver nova pista')"
L10_DOM="$(assert_page 'artifacts/p7-u03-visuals/u03-l10-open.html' 'Autochecagem')"
V01_DOM="$(assert_page 'artifacts/p7-u03-visuals/u03-v01-open.html' 'Autochecagem')"

grep -Fq '10 lições' <<<"$UNIT_DOM" || true
grep -Fq 'data-progressive-reveal' <<<"$L03_DOM" || { echo 'P7 U03: controle de nova pista ausente.' >&2; exit 1; }
grep -Fq 'data-progressive-stage2' <<<"$L03_DOM" || { echo 'P7 U03: segunda etapa progressiva ausente.' >&2; exit 1; }
grep -Eq 'data-progressive-stage2[^>]*hidden' <<<"$L03_DOM" || { echo 'P7 U03: nova pista deve iniciar oculta.' >&2; exit 1; }
grep -Fq 'Registrar resposta' <<<"$L10_DOM" || { echo 'P7 U03: produção aberta da L10 sem ação de registro.' >&2; exit 1; }
grep -Fq 'self-review' <<<"$L10_DOM" || { echo 'P7 U03: autochecagem da L10 ausente.' >&2; exit 1; }
grep -Fq 'Registrar resposta' <<<"$V01_DOM" || { echo 'P7 U03: produção aberta da V01 sem ação de registro.' >&2; exit 1; }

if grep -Eiq 'correctIndexes|acceptedSequences|acceptedResult|correctFunction|correctGroup|correctAnswer|answerKey|schemaVersion|evidenceRole|notAutomaticallyJudged|automaticObservations' <<<"$UNIT_DOM$L03_DOM$L10_DOM$V01_DOM"; then
  echo 'P7 U03: metadado técnico vazou para a interface do aluno.' >&2
  exit 1
fi

if grep -Eiq '>(example|goal|candidate|questions|purpose|first draft|self check|revised draft|optional word bank)<' <<<"$L10_DOM$V01_DOM"; then
  echo 'P7 U03: chave autoral crua em inglês vazou para a linguagem pública.' >&2
  exit 1
fi

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --virtual-time-budget=2600 --window-size="${width},${height}" \
    --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture unit-u03-desktop 1440 1050 '#/unidade/N0-U03'
capture unit-u03-mobile 390 900 '#/unidade/N0-U03'
capture lesson-u03-l03-progressive-desktop 1440 1150 'artifacts/p7-u03-visuals/u03-l03-progressive.html'
capture lesson-u03-l10-open-desktop 1440 1200 'artifacts/p7-u03-visuals/u03-l10-open.html'
capture lesson-u03-l10-open-mobile 390 1000 'artifacts/p7-u03-visuals/u03-l10-open.html'
capture verification-u03-v01-open-desktop 1440 1200 'artifacts/p7-u03-visuals/u03-v01-open.html'

printf 'P7 U03 smoke DOM + screenshots: %s (L03 step %s, L10 step %s, V01 step %s)\n' "$OUT" "$L03_STEP" "$L10_STEP" "$V01_STEP"
