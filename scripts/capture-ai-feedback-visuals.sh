#!/usr/bin/env bash
set -euo pipefail

PORT=4174
OUT="artifacts/classic-visuals"
mkdir -p "$OUT"

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
if [[ -z "$CHROME" ]]; then
  echo "Chrome/Chromium não encontrado no runner." >&2
  exit 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/portugues-completo-ai-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in {1..20}; do
  if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null; then break; fi
  sleep 0.2
done

page_dom() {
  local route="$1"
  "$CHROME" --headless --no-sandbox --disable-gpu --virtual-time-budget=2600 --dump-dom "http://127.0.0.1:${PORT}/${route}" 2>/dev/null
}

HOME_DOM="$(page_dom '#/')"
N4_DOM="$(page_dom '#/unidade/N4-U09/licao/N4-U09-L01')"
SETTINGS_DOM="$(page_dom 'scripts/fixtures/p6-ai-settings.html')"
SUCCESS_DOM="$(page_dom 'scripts/fixtures/p6-ai-success.html')"
FAILURE_DOM="$(page_dom 'scripts/fixtures/p6-ai-failure.html')"

grep -Fq 'data-settings-section="ai"' <<<"$HOME_DOM" || { echo 'Smoke P6.2: Feedback por IA ausente das Configurações.' >&2; exit 1; }
grep -Fq 'data-ai-feedback-panel' <<<"$N4_DOM" || { echo 'Smoke P6.2: piloto N4-U09 não recebeu painel de IA.' >&2; exit 1; }
if ! grep -Eq 'data-ai-feedback-panel[^>]*hidden' <<<"$N4_DOM"; then
  echo 'Smoke P6.2: painel de IA deve ficar oculto por padrão com IA desligada.' >&2
  exit 1
fi
if grep -Eiq 'materialBlockIds|policyVersion|mayPromoteEvidence|n4-u09-l01-a01-formative-v1' <<<"$N4_DOM"; then
  echo 'Smoke P6.2: contrato interno de IA vazou no DOM real da lição.' >&2
  exit 1
fi

grep -Fq 'Entendi que cada chamada pode ter custo' <<<"$SETTINGS_DOM" || { echo 'Smoke P6.2: consentimento explícito ausente.' >&2; exit 1; }
grep -Fq 'ela não entra nesta página' <<<"$SETTINGS_DOM" || { echo 'Smoke P6.2: explicação de segurança da API key ausente.' >&2; exit 1; }
grep -Fq 'data-visible-leak="false"' <<<"$SETTINGS_DOM" || { echo 'Smoke P6.2: Configurações exibem metadado interno.' >&2; exit 1; }

grep -Fq 'A interpretação está bem encaminhada' <<<"$SUCCESS_DOM" || { echo 'Smoke P6.2: feedback estruturado de sucesso não foi renderizado.' >&2; exit 1; }
grep -Fq 'Parcialmente atendido' <<<"$SUCCESS_DOM" || { echo 'Smoke P6.2: status público por critério ausente.' >&2; exit 1; }
grep -Fq 'continua aguardando validação confiável' <<<"$SUCCESS_DOM" || { echo 'Smoke P6.2: fronteira de autoridade da IA ausente no sucesso.' >&2; exit 1; }
grep -Fq 'data-visible-leak="false"' <<<"$SUCCESS_DOM" || { echo 'Smoke P6.2: sucesso exibe metadado interno.' >&2; exit 1; }

grep -Fq 'Feedback não disponível' <<<"$FAILURE_DOM" || { echo 'Smoke P6.2: falha segura não foi renderizada.' >&2; exit 1; }
grep -Fq 'Sua resposta continua salva' <<<"$FAILURE_DOM" || { echo 'Smoke P6.2: falha não deixa claro que a resposta foi preservada.' >&2; exit 1; }
grep -Fq 'data-visible-leak="false"' <<<"$FAILURE_DOM" || { echo 'Smoke P6.2: falha exibe código interno.' >&2; exit 1; }

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=2600 --window-size="${width},${height}" --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture p6-ai-settings-desktop 1440 1000 'scripts/fixtures/p6-ai-settings.html'
capture p6-ai-settings-mobile 390 900 'scripts/fixtures/p6-ai-settings.html'
capture p6-ai-success-desktop 1440 1100 'scripts/fixtures/p6-ai-success.html'
capture p6-ai-success-mobile 390 1000 'scripts/fixtures/p6-ai-success.html'
capture p6-ai-failure-desktop 1440 900 'scripts/fixtures/p6-ai-failure.html'

printf 'Smoke P6.2 + screenshots de IA: %s\n' "$OUT"
