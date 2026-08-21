#!/usr/bin/env bash
set -euo pipefail

# Gate visual canônico do lote P7 N1-U01: leitura multimodal, fonte/opinião e resumo aberto.
PORT=4179
OUT="artifacts/p7-n1-u01-visuals"
mkdir -p "$OUT"

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
if [[ -z "$CHROME" ]]; then
  echo "Chrome/Chromium não encontrado no runner." >&2
  exit 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/portugues-completo-p7-n1-u01-http.log 2>&1 &
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

L07_STEP="$(step_for content/units/101-lendo-textos-mais-autonomia/lessons/007-titulo-imagem-legenda-apoios.json L07-A01)"
L08_STEP="$(step_for content/units/101-lendo-textos-mais-autonomia/lessons/008-quem-escreveu-fonte-opiniao-razao.json L08-B02)"
L09_STEP="$(step_for content/units/101-lendo-textos-mais-autonomia/lessons/009-resumindo-ideia-principal-palavras-proprias.json L09-A01)"
V01_MULTI_STEP="$(step_for content/units/101-lendo-textos-mais-autonomia/integrated-verification.json V01-Q05)"
V01_SUMMARY_STEP="$(step_for content/units/101-lendo-textos-mais-autonomia/integrated-verification.json V01-Q07)"

seed_lesson() {
  local name="$1" document_id="$2" step="$3" route="$4"
  cat >"$OUT/$name.html" <<EOF
<!doctype html>
<meta charset="utf-8">
<title>Seed visual P7 N1-U01</title>
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
<title>Seed visual P7 N1-U01 verificação</title>
<script>
sessionStorage.setItem('portugues-completo:lesson-step:${document_id}', String(${step}));
location.replace('/${route}');
</script>
EOF
}

seed_lesson n1-u01-l07-multimodal N1-U01-L07 "$L07_STEP" '#/unidade/N1-U01/licao/N1-U01-L07'
seed_lesson n1-u01-l08-source N1-U01-L08 "$L08_STEP" '#/unidade/N1-U01/licao/N1-U01-L08'
seed_lesson n1-u01-l09-summary N1-U01-L09 "$L09_STEP" '#/unidade/N1-U01/licao/N1-U01-L09'
seed_verification n1-u01-v01-multimodal N1-U01-V01 "$V01_MULTI_STEP" '#/unidade/N1-U01/verificacao'
seed_verification n1-u01-v01-summary N1-U01-V01 "$V01_SUMMARY_STEP" '#/unidade/N1-U01/verificacao'

page_dom() {
  local route="$1"
  "$CHROME" --headless --no-sandbox --disable-gpu --virtual-time-budget=3500 --dump-dom "http://127.0.0.1:${PORT}/${route}" 2>/dev/null
}

assert_page() {
  local route="$1" expected="$2"
  local dom
  dom="$(page_dom "$route")"
  grep -Fq "$expected" <<<"$dom" || { echo "P7 N1-U01 smoke: conteúdo esperado ausente em $route -> $expected" >&2; exit 1; }
  if grep -Eq 'Erro de carregamento|Não foi possível abrir esta etapa|Interação ainda não suportada|Illegal invocation|Maximum call stack' <<<"$dom"; then
    echo "P7 N1-U01 smoke: estado de erro/unsupported em $route" >&2
    exit 1
  fi
  printf '%s' "$dom"
}

UNIT_DOM="$(assert_page '#/unidade/N1-U01' 'Lendo textos com mais autonomia')"
L07_DOM="$(assert_page 'artifacts/p7-n1-u01-visuals/n1-u01-l07-multimodal.html' 'Apoio visual')"
L08_DOM="$(assert_page 'artifacts/p7-n1-u01-visuals/n1-u01-l08-source.html' 'Fonte do texto')"
L09_DOM="$(assert_page 'artifacts/p7-n1-u01-visuals/n1-u01-l09-summary.html' 'Registrar resposta')"
V01_MULTI_DOM="$(assert_page 'artifacts/p7-n1-u01-visuals/n1-u01-v01-multimodal.html' 'A rota indicada é Entrada → Balcão → Corredor A → Sala 12')"
V01_SUMMARY_DOM="$(assert_page 'artifacts/p7-n1-u01-visuals/n1-u01-v01-summary.html' 'Registrar resposta')"

grep -Fq '9 lições' <<<"$UNIT_DOM" || { echo 'P7 N1-U01: unidade deve expor 9 lições.' >&2; exit 1; }
grep -Fq 'Verificação integrada' <<<"$UNIT_DOM" || { echo 'P7 N1-U01: acesso à verificação integrada ausente.' >&2; exit 1; }

grep -Fq 'Texto' <<<"$L07_DOM" || { echo 'P7 N1-U01: corpo textual multimodal não está explicitado.' >&2; exit 1; }
grep -Fq 'A rota mostrada é Entrada → Balcão de crachás → Corredor B → Sala 6.' <<<"$L07_DOM" || { echo 'P7 N1-U01: equivalente acessível multimodal ausente.' >&2; exit 1; }
grep -Fq 'Apoio visual' <<<"$L07_DOM" || { echo 'P7 N1-U01: componente multimodal público ausente.' >&2; exit 1; }

grep -Fq 'Biblioteca Comunitária do Bairro' <<<"$L08_DOM" || { echo 'P7 N1-U01: autoria/instituição não aparece na fonte demonstrativa.' >&2; exit 1; }
grep -Fq 'Autoria / instituição' <<<"$L08_DOM" || { echo 'P7 N1-U01: rótulo público de autoria/instituição ausente.' >&2; exit 1; }

grep -Fq 'Autochecagem' <<<"$L09_DOM" || { echo 'P7 N1-U01: resumo próprio precisa de autochecagem pública.' >&2; exit 1; }
grep -Fq 'Registrar resposta' <<<"$L09_DOM" || { echo 'P7 N1-U01: resumo próprio não está registrável.' >&2; exit 1; }
if grep -Fq 'O comunicado informa que o atendimento mudou para a sala 4 e que a entrada agora é pela lateral do prédio.' <<<"$L09_DOM"; then
  echo 'P7 N1-U01: modelo de resumo vazou antes da tentativa.' >&2
  exit 1
fi

grep -Fq 'Depois de entregar a ficha no balcão' <<<"$V01_MULTI_DOM" || { echo 'P7 N1-U01: componente textual da tarefa multimodal V01 ausente.' >&2; exit 1; }
grep -Fq 'A rota indicada é Entrada → Balcão → Corredor A → Sala 12.' <<<"$V01_MULTI_DOM" || { echo 'P7 N1-U01: equivalente acessível V01 ausente.' >&2; exit 1; }

grep -Fq 'Autochecagem' <<<"$V01_SUMMARY_DOM" || { echo 'P7 N1-U01: resumo V01 precisa de autochecagem.' >&2; exit 1; }
grep -Fq 'Registrar resposta' <<<"$V01_SUMMARY_DOM" || { echo 'P7 N1-U01: resumo V01 precisa permanecer registrável/pending.' >&2; exit 1; }

if grep -Eiq 'bodyText|accessibleEquivalent|sourceMetadata|evidenceSourcesRequired|acceptedCore|acceptedResult|textRef|humanOrExternalReview|notAutomaticallyJudged|automaticObservations|completionEvidence|activityPolicies|answerKey|schemaVersion|\bnodes\b|\bconnections\b' <<<"$UNIT_DOM$L07_DOM$L08_DOM$L09_DOM$V01_MULTI_DOM$V01_SUMMARY_DOM"; then
  echo 'P7 N1-U01: metadado técnico/autoral vazou para a interface do aluno.' >&2
  exit 1
fi

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --virtual-time-budget=3500 --window-size="${width},${height}" \
    --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture unit-n1-u01-desktop 1440 1150 '#/unidade/N1-U01'
capture unit-n1-u01-mobile 390 980 '#/unidade/N1-U01'
capture lesson-n1-u01-l07-multimodal-desktop 1440 1250 'artifacts/p7-n1-u01-visuals/n1-u01-l07-multimodal.html'
capture lesson-n1-u01-l07-multimodal-mobile 390 1150 'artifacts/p7-n1-u01-visuals/n1-u01-l07-multimodal.html'
capture lesson-n1-u01-l08-source-desktop 1440 1200 'artifacts/p7-n1-u01-visuals/n1-u01-l08-source.html'
capture lesson-n1-u01-l09-summary-desktop 1440 1250 'artifacts/p7-n1-u01-visuals/n1-u01-l09-summary.html'
capture lesson-n1-u01-l09-summary-mobile 390 1150 'artifacts/p7-n1-u01-visuals/n1-u01-l09-summary.html'
capture verification-n1-u01-v01-multimodal-desktop 1440 1250 'artifacts/p7-n1-u01-visuals/n1-u01-v01-multimodal.html'
capture verification-n1-u01-v01-summary-desktop 1440 1250 'artifacts/p7-n1-u01-visuals/n1-u01-v01-summary.html'
capture verification-n1-u01-v01-summary-mobile 390 1150 'artifacts/p7-n1-u01-visuals/n1-u01-v01-summary.html'

printf 'P7 N1-U01 smoke DOM + screenshots: %s (L07 %s, L08 %s, L09 %s, V01 multi %s, V01 summary %s)\n' "$OUT" "$L07_STEP" "$L08_STEP" "$L09_STEP" "$V01_MULTI_STEP" "$V01_SUMMARY_STEP"
