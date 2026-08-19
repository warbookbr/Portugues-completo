#!/usr/bin/env bash
set -euo pipefail

# Gate visual canônico do lote P7 N0-U05: unidade, escrita aberta, edição controlada e V01.
PORT=4177
OUT="artifacts/p7-u05-visuals"
mkdir -p "$OUT"

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
if [[ -z "$CHROME" ]]; then
  echo "Chrome/Chromium não encontrado no runner." >&2
  exit 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/portugues-completo-p7-u05-http.log 2>&1 &
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

L02_STEP="$(step_for content/units/005-escrevendo-organizando-mensagens/lessons/002-escrevendo-frases-com-mais-autonomia.json L02-C01)"
L08_STEP="$(step_for content/units/005-escrevendo-organizando-mensagens/lessons/008-organizando-a-escrita-espacos-maiuscula-limites.json L08-A01)"
V01_STEP="$(step_for content/units/005-escrevendo-organizando-mensagens/integrated-verification.json V01-Q08)"

seed_lesson() {
  local name="$1" document_id="$2" step="$3" route="$4"
  cat >"$OUT/$name.html" <<EOF
<!doctype html>
<meta charset="utf-8">
<title>Seed visual P7 U05</title>
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
<title>Seed visual P7 U05 verificação</title>
<script>
sessionStorage.setItem('portugues-completo:lesson-step:${document_id}', String(${step}));
location.replace('/${route}');
</script>
EOF
}

seed_lesson u05-l02-open N0-U05-L02 "$L02_STEP" '#/unidade/N0-U05/licao/N0-U05-L02'
seed_lesson u05-l08-controlled N0-U05-L08 "$L08_STEP" '#/unidade/N0-U05/licao/N0-U05-L08'
seed_verification u05-v01-own-production N0-U05-V01 "$V01_STEP" '#/unidade/N0-U05/verificacao'

page_dom() {
  local route="$1"
  "$CHROME" --headless --no-sandbox --disable-gpu --virtual-time-budget=3000 --dump-dom "http://127.0.0.1:${PORT}/${route}" 2>/dev/null
}

assert_page() {
  local route="$1" expected="$2"
  local dom
  dom="$(page_dom "$route")"
  grep -Fq "$expected" <<<"$dom" || { echo "P7 U05 smoke: conteúdo esperado ausente em $route -> $expected" >&2; exit 1; }
  if grep -Eq 'Erro de carregamento|Não foi possível abrir esta etapa|Interação ainda não suportada|Illegal invocation' <<<"$dom"; then
    echo "P7 U05 smoke: estado de erro/unsupported em $route" >&2
    exit 1
  fi
  printf '%s' "$dom"
}

UNIT_DOM="$(assert_page '#/unidade/N0-U05' 'Escrevendo e organizando mensagens')"
L02_DOM="$(assert_page 'artifacts/p7-u05-visuals/u05-l02-open.html' 'Registrar resposta')"
L08_DOM="$(assert_page 'artifacts/p7-u05-visuals/u05-l08-controlled.html' 'Verificar resposta')"
V01_DOM="$(assert_page 'artifacts/p7-u05-visuals/u05-v01-own-production.html' 'Verificação da unidade')"

grep -Fq '10 lições' <<<"$UNIT_DOM" || { echo 'P7 U05: unidade deve expor 10 lições.' >&2; exit 1; }
grep -Fq 'data-optional-scaffold' <<<"$L02_DOM" || { echo 'P7 U05: apoio opcional sob demanda ausente na escrita aberta.' >&2; exit 1; }
grep -Fq '<summary>Ver apoio opcional</summary>' <<<"$L02_DOM" || { echo 'P7 U05: apoio opcional precisa de rótulo público claro.' >&2; exit 1; }
if grep -Eq '<details[^>]*data-optional-scaffold[^>]*\sopen(?:[= >])' <<<"$L02_DOM"; then
  echo 'P7 U05: apoio opcional não pode iniciar aberto.' >&2
  exit 1
fi
grep -Fq 'Autochecagem' <<<"$L02_DOM" || { echo 'P7 U05: autochecagem ausente na produção aberta.' >&2; exit 1; }
grep -Fq '<textarea' <<<"$L02_DOM" || { echo 'P7 U05: campo aberto de escrita ausente.' >&2; exit 1; }
if grep -Fq 'A biblioteca está fechada hoje.' <<<"$L02_DOM"; then
  echo 'P7 U05: modelo pós-envio vazou antes da tentativa.' >&2
  exit 1
fi

grep -Fq '<textarea' <<<"$L08_DOM" || { echo 'P7 U05: editor controlado ausente na L08.' >&2; exit 1; }
grep -Fq 'Verificar resposta' <<<"$L08_DOM" || { echo 'P7 U05: edição controlada não aparece como atividade verificável.' >&2; exit 1; }

grep -Eq 'Antes de escrever|informações essenciais' <<<"$V01_DOM" || { echo 'P7 U05: planejamento da produção própria ausente na V01.' >&2; exit 1; }
grep -Fq 'Autochecagem' <<<"$V01_DOM" || { echo 'P7 U05: autochecagem da produção própria ausente na V01.' >&2; exit 1; }
grep -Fq 'Registrar resposta' <<<"$V01_DOM" || { echo 'P7 U05: produção própria da V01 não está pendente/registrável.' >&2; exit 1; }

if grep -Eiq 'modelExamplesAfterSubmission|notAutomaticallyJudged|humanOrExternalReview|automaticObservations|correctEssentialIndexes|acceptableOrders|principleCorrectIndex|answerKey|schemaVersion|completionEvidence|activityPolicies|MIN_EVIDENCE_WITHOUT_HINT' <<<"$UNIT_DOM$L02_DOM$L08_DOM$V01_DOM"; then
  echo 'P7 U05: metadado técnico/autoral vazou para a interface do aluno.' >&2
  exit 1
fi

if grep -Eiq '>(before|after|planning prompt|essential information|quick open production|assessment open|function choice|revision choice|format choice|edit choice|multi edit|boundary choice|punctuation choice|enumeration principle|purpose choice|sequence choice)<' <<<"$L02_DOM$L08_DOM$V01_DOM"; then
  echo 'P7 U05: rótulo pedagógico/autoral cru em inglês vazou para a interface.' >&2
  exit 1
fi

if grep -Fq 'Verificar se o aluno' <<<"$V01_DOM"; then
  echo 'P7 U05: objective técnico da verificação vazou para a abertura pública.' >&2
  exit 1
fi

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --virtual-time-budget=3000 --window-size="${width},${height}" \
    --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture unit-u05-desktop 1440 1100 '#/unidade/N0-U05'
capture unit-u05-mobile 390 920 '#/unidade/N0-U05'
capture lesson-u05-l02-open-desktop 1440 1200 'artifacts/p7-u05-visuals/u05-l02-open.html'
capture lesson-u05-l02-open-mobile 390 1050 'artifacts/p7-u05-visuals/u05-l02-open.html'
capture lesson-u05-l08-controlled-desktop 1440 1150 'artifacts/p7-u05-visuals/u05-l08-controlled.html'
capture verification-u05-v01-own-production-desktop 1440 1250 'artifacts/p7-u05-visuals/u05-v01-own-production.html'

printf 'P7 U05 smoke DOM + screenshots: %s (L02 step %s, L08 step %s, V01 step %s)\n' "$OUT" "$L02_STEP" "$L08_STEP" "$V01_STEP"
