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

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --virtual-time-budget=1800 --window-size="${width},${height}" \
    --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture home-desktop 1440 900 '#/'
capture unit-n0-desktop 1440 900 '#/unidade/N0-U01'
capture lesson-n0-desktop 1440 1800 '#/unidade/N0-U01/licao/N0-U01-L01'
capture lesson-n4-desktop 1440 1800 '#/unidade/N4-U09/licao/N4-U09-L01'
capture unit-n0-tablet 768 1024 '#/unidade/N0-U01'
capture home-mobile 390 844 '#/'
capture lesson-n0-mobile 390 1100 '#/unidade/N0-U01/licao/N0-U01-L01'

printf 'Screenshots clássicos: %s\n' "$OUT"
