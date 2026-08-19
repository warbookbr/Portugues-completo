#!/usr/bin/env bash
set -euo pipefail

# Gate visual canônico do lote P7 N0-U04: unidade, evidência textual, ordenação e V01.
PORT=4176
OUT="artifacts/p7-u04-visuals"
mkdir -p "$OUT"

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
if [[ -z "$CHROME" ]]; then
  echo "Chrome/Chromium não encontrado no runner." >&2
  exit 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/portugues-completo-p7-u04-http.log 2>&1 &
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

L04_STEP="$(step_for content/units/004-lendo-compreendendo-pequenos-textos/lessons/004-ligando-informacoes-entre-frases.json L04-A01)"
L06_STEP="$(step_for content/units/004-lendo-compreendendo-pequenos-textos/lessons/006-ordem-dos-acontecimentos-e-instrucoes.json L06-C01)"
V01_STEP="$(step_for content/units/004-lendo-compreendendo-pequenos-textos/integrated-verification.json V01-Q03)"

seed_lesson() {
  local name="$1" document_id="$2" step="$3" route="$4"
  cat >"$OUT/$name.html" <<EOF
<!doctype html>
<meta charset="utf-8">
<title>Seed visual P7 U04</title>
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
<title>Seed visual P7 U04 verificação</title>
<script>
sessionStorage.setItem('portugues-completo:lesson-step:${document_id}', String(${step}));
location.replace('/${route}');
</script>
EOF
}

seed_lesson u04-l04-evidence N0-U04-L04 "$L04_STEP" '#/unidade/N0-U04/licao/N0-U04-L04'
seed_lesson u04-l06-sequence N0-U04-L06 "$L06_STEP" '#/unidade/N0-U04/licao/N0-U04-L06'
seed_verification u04-v01-evidence N0-U04-V01 "$V01_STEP" '#/unidade/N0-U04/verificacao'

page_dom() {
  local route="$1"
  "$CHROME" --headless --no-sandbox --disable-gpu --virtual-time-budget=2800 --dump-dom "http://127.0.0.1:${PORT}/${route}" 2>/dev/null
}

assert_page() {
  local route="$1" expected="$2"
  local dom
  dom="$(page_dom "$route")"
  grep -Fq "$expected" <<<"$dom" || { echo "P7 U04 smoke: conteúdo esperado ausente em $route -> $expected" >&2; exit 1; }
  if grep -Eq 'Erro de carregamento|Não foi possível abrir esta etapa|Interação ainda não suportada|Illegal invocation' <<<"$dom"; then
    echo "P7 U04 smoke: estado de erro/unsupported em $route" >&2
    exit 1
  fi
  printf '%s' "$dom"
}

UNIT_DOM="$(assert_page '#/unidade/N0-U04' 'Lendo e compreendendo pequenos textos')"
L04_DOM="$(assert_page 'artifacts/p7-u04-visuals/u04-l04-evidence.html' 'Verificar resposta')"
L06_DOM="$(assert_page 'artifacts/p7-u04-visuals/u04-l06-sequence.html' 'Sua sequência aparecerá aqui.')"
V01_DOM="$(assert_page 'artifacts/p7-u04-visuals/u04-v01-evidence.html' 'Verificação da unidade')"

grep -Fq '9 lições' <<<"$UNIT_DOM" || { echo 'P7 U04: unidade deve expor 9 lições.' >&2; exit 1; }
grep -Fq 'data-evidence-selection' <<<"$L04_DOM" || { echo 'P7 U04: seletor de evidência múltipla ausente na L04.' >&2; exit 1; }
grep -Fq 'type="checkbox"' <<<"$L04_DOM" || { echo 'P7 U04: L04 deveria permitir selecionar múltiplos trechos.' >&2; exit 1; }
grep -Fq 'data-sequence-builder' <<<"$L06_DOM" || { echo 'P7 U04: construtor de sequência ausente na L06.' >&2; exit 1; }
grep -Fq 'data-evidence-selection' <<<"$V01_DOM" || { echo 'P7 U04: seletor de evidência ausente na V01.' >&2; exit 1; }

if grep -Eiq 'requiredEvidence|requiredEvidenceParts|acceptableEvidence|evidenceCorrectIndexes|correctOrder|answerKey|schemaVersion|completionEvidence|activityPolicies' <<<"$UNIT_DOM$L04_DOM$L06_DOM$V01_DOM"; then
  echo 'P7 U04: metadado técnico/autoral vazou para a interface do aluno.' >&2
  exit 1
fi

if grep -Eiq '>(wrong conclusion|question|ordered events|cards|text remains visible|text ref|competency)<' <<<"$L04_DOM$L06_DOM$V01_DOM"; then
  echo 'P7 U04: chave autoral crua em inglês vazou para a linguagem pública.' >&2
  exit 1
fi

if grep -Fq 'Verificar se o aluno' <<<"$V01_DOM"; then
  echo 'P7 U04: objective técnico da verificação vazou para a abertura pública.' >&2
  exit 1
fi

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --virtual-time-budget=2800 --window-size="${width},${height}" \
    --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture unit-u04-desktop 1440 1050 '#/unidade/N0-U04'
capture unit-u04-mobile 390 900 '#/unidade/N0-U04'
capture lesson-u04-l04-evidence-desktop 1440 1200 'artifacts/p7-u04-visuals/u04-l04-evidence.html'
capture lesson-u04-l04-evidence-mobile 390 1000 'artifacts/p7-u04-visuals/u04-l04-evidence.html'
capture lesson-u04-l06-sequence-desktop 1440 1150 'artifacts/p7-u04-visuals/u04-l06-sequence.html'
capture verification-u04-v01-evidence-desktop 1440 1200 'artifacts/p7-u04-visuals/u04-v01-evidence.html'

printf 'P7 U04 smoke DOM + screenshots: %s (L04 step %s, L06 step %s, V01 step %s)\n' "$OUT" "$L04_STEP" "$L06_STEP" "$V01_STEP"
