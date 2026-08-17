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
  "$CHROME" --headless --no-sandbox --disable-gpu --virtual-time-budget=2200 --dump-dom "http://127.0.0.1:${PORT}/${route}" 2>/dev/null
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

HOME_DOM="$(assert_page '#/' 'Português Completo')"
UNIT_DOM="$(assert_page '#/unidade/N0-U01' 'Fala, sons e escrita')"
LESSON_DOM="$(assert_page '#/unidade/N0-U01/licao/N0-U01-L01' 'Duas maneiras de encontrar uma mensagem')"
N4_DOM="$(assert_page '#/unidade/N4-U09/licao/N4-U09-L01' 'Interpretação literária autônoma e evidência')"

grep -Fq '2 unidades disponíveis nesta versão do curso.' <<<"$HOME_DOM" || { echo 'Smoke DOM: home ainda expõe estado técnico do catálogo.' >&2; exit 1; }
grep -Fq 'Seu progresso' <<<"$HOME_DOM" || { echo 'Smoke DOM P5: painel de progresso não foi montado na home.' >&2; exit 1; }
grep -Fq 'data-settings-section="progress"' <<<"$HOME_DOM" || { echo 'Smoke DOM P5: acesso às configurações de progresso ausente.' >&2; exit 1; }
if grep -Eq '>BLOCKED<|N0-U01-C0[1-8]|Catálogo real conectado|TTStext|>OBJECTIVE<|>DEMONSTRATION<' <<<"$UNIT_DOM$LESSON_DOM"; then
  echo 'Smoke DOM: metadado interno ainda aparece na interface pública.' >&2
  exit 1
fi
grep -Fq 'Ouvir exemplo' <<<"$LESSON_DOM" || { echo 'Smoke DOM: ttsText não virou controle de TTS.' >&2; exit 1; }
grep -Fq 'avaliação pendente' <<<"$N4_DOM" || { echo 'Smoke DOM: estado pending N4 ausente.' >&2; exit 1; }

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --virtual-time-budget=2200 --window-size="${width},${height}" \
    --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture home-desktop 1440 900 '#/'
capture unit-n0-desktop 1440 900 '#/unidade/N0-U01'
capture lesson-n0-desktop 1440 1800 '#/unidade/N0-U01/licao/N0-U01-L01'
capture lesson-n4-desktop 1440 1800 '#/unidade/N4-U09/licao/N4-U09-L01'
capture unit-n0-tablet 768 1024 '#/unidade/N0-U01'
capture home-mobile 390 844 '#/'
capture lesson-n0-mobile 390 1100 '#/unidade/N0-U01/licao/N0-U01-L01'

printf 'Smoke DOM + screenshots clássicos/P5: %s\n' "$OUT"
