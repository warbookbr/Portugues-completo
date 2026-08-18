#!/usr/bin/env bash
set -euo pipefail

PORT=4173
OUT="artifacts/classic-visuals"
mkdir -p "$OUT"

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
if [[ -z "$CHROME" ]]; then
  echo "Chrome/Chromium não encontrado no runner." >&2
  exit 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/portugues-completo-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in {1..20}; do
  if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null; then break; fi
  sleep 0.2
done

page_dom() {
  local route="$1"
  "$CHROME" --headless --no-sandbox --disable-gpu --virtual-time-budget=2400 --dump-dom "http://127.0.0.1:${PORT}/${route}" 2>/dev/null
}

assert_page() {
  local route="$1" expected="$2"
  local dom
  dom="$(page_dom "$route")"
  grep -Fq "$expected" <<<"$dom" || { echo "Smoke DOM: conteúdo esperado ausente em $route -> $expected" >&2; exit 1; }
  if grep -Eq 'Erro de carregamento|Não foi possível abrir esta etapa|Interação ainda não suportada|Illegal invocation' <<<"$dom"; then
    echo "Smoke DOM: estado de erro/unsupported encontrado em $route" >&2
    exit 1
  fi
  printf '%s' "$dom"
}

HOME_DOM="$(assert_page '#/' 'Unidades do curso')"
PLAN_DOM="$(assert_page '#/plano' 'Seu caminho pelo curso')"
UNITS_DOM="$(assert_page '#/unidades' 'Unidades do curso')"
REVIEWS_DOM="$(assert_page '#/revisoes' 'Revisões recomendadas')"
PERFORMANCE_DOM="$(assert_page '#/desempenho' 'Seu progresso de aprendizagem')"
HELP_DOM="$(assert_page '#/ajuda' 'Como podemos orientar você?')"
METHODOLOGY_DOM="$(assert_page '#/metodologia' 'Como o Português Completo ensina')"
UNIT_DOM="$(assert_page '#/unidade/N0-U01' 'Fala, sons e escrita')"
LESSON_DOM="$(assert_page '#/unidade/N0-U01/licao/N0-U01-L01' 'Duas maneiras de encontrar uma mensagem')"
N4_DOM="$(assert_page '#/unidade/N4-U09/licao/N4-U09-L01' 'Interpretação literária autônoma e evidência')"

grep -Fq 'Plano de estudos' <<<"$HOME_DOM" || { echo 'Smoke DOM UI: Plano de estudos ausente da navegação superior.' >&2; exit 1; }
if [[ "$(grep -o 'Começar a estudar' <<<"$HOME_DOM" | wc -l | tr -d ' ')" != "1" ]]; then
  echo 'Smoke DOM UI: a home deve expor um único CTA de início/retomada.' >&2
  exit 1
fi
if grep -Fq 'Continuar lição' <<<"$HOME_DOM"; then
  echo 'Smoke DOM UI: CTA concorrente de continuar lição ainda existe na home.' >&2
  exit 1
fi
if grep -Fq 'Ver plano de estudos' <<<"$HOME_DOM"; then
  echo 'Smoke DOM UI: Plano de estudos ainda está duplicado no hero.' >&2
  exit 1
fi
if grep -Eq '>\s*N[0-4]\s*[·•]' <<<"$HOME_DOM$UNIT_DOM"; then
  echo 'Smoke DOM UI: código interno de nível ainda aparece como rótulo público.' >&2
  exit 1
fi
grep -Fq 'data-settings-section="progress"' <<<"$HOME_DOM" || { echo 'Smoke DOM P5: acesso às configurações de progresso ausente.' >&2; exit 1; }
grep -Fq 'href="#/metodologia"' <<<"$HOME_DOM" || { echo 'Smoke DOM UI: Metodologia não foi realocada para o rodapé.' >&2; exit 1; }
grep -Fq 'href="#/ajuda"' <<<"$HOME_DOM" || { echo 'Smoke DOM UI: Ajuda não foi realocada para utilitário discreto.' >&2; exit 1; }
if grep -Eq '>BLOCKED<|N0-U01-C0[1-8]|Catálogo real conectado|TTStext|>OBJECTIVE<|>DEMONSTRATION<' <<<"$UNIT_DOM$LESSON_DOM"; then
  echo 'Smoke DOM: metadado interno ainda aparece na interface pública.' >&2
  exit 1
fi

grep -Fq 'Voltar para a unidade' <<<"$LESSON_DOM" || { echo 'Smoke DOM UI: retorno direto para unidade ausente na lição.' >&2; exit 1; }
grep -Fq 'data-lesson-step="0"' <<<"$LESSON_DOM" || { echo 'Smoke DOM UI: fluxo guiado não foi montado na lição.' >&2; exit 1; }
grep -Fq 'Avançar' <<<"$LESSON_DOM" || { echo 'Smoke DOM UI: controle Avançar ausente no fluxo guiado.' >&2; exit 1; }
if grep -Fq 'class="breadcrumbs"' <<<"$LESSON_DOM"; then
  echo 'Smoke DOM UI: breadcrumb longo ainda aparece dentro da lição.' >&2
  exit 1
fi
if grep -Fq 'correção objetiva' <<<"$LESSON_DOM"; then
  echo 'Smoke DOM UI: rótulo técnico/redundante de correção ainda aparece na lição.' >&2
  exit 1
fi

grep -Fq 'Ouvir exemplo' <<<"$LESSON_DOM" || { echo 'Smoke DOM: ttsText não virou controle de TTS.' >&2; exit 1; }
grep -Fq 'Registrar resposta' <<<"$N4_DOM" || { echo 'Smoke DOM: atividade aberta N4 ausente.' >&2; exit 1; }

grep -Fq 'Plano de estudos' <<<"$PLAN_DOM" || exit 1
grep -Fq 'Nenhuma revisão pendente' <<<"$REVIEWS_DOM" || true
grep -Fq 'Configurações' <<<"$HELP_DOM" || exit 1
grep -Fq 'Modo Clássico' <<<"$METHODOLOGY_DOM" || exit 1

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --virtual-time-budget=2400 --window-size="${width},${height}" \
    --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture home-desktop 1440 900 '#/'
capture home-tablet 768 1024 '#/'
capture home-mobile 390 844 '#/'
capture plan-desktop 1440 900 '#/plano'
capture unit-n0-desktop 1440 900 '#/unidade/N0-U01'
capture lesson-n0-desktop 1440 1200 '#/unidade/N0-U01/licao/N0-U01-L01'
capture lesson-n4-desktop 1440 1200 '#/unidade/N4-U09/licao/N4-U09-L01'
capture lesson-n0-mobile 390 900 '#/unidade/N0-U01/licao/N0-U01-L01'

printf 'Smoke DOM + screenshots clássicos/UI: %s\n' "$OUT"
