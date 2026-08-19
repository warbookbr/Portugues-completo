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

seed_lesson_page() {
  local name="$1" document_id="$2" step="$3" route="$4"
  cat >"$OUT/$name.html" <<EOF
<!doctype html>
<meta charset="utf-8">
<title>Seed visual T1.7</title>
<script>
localStorage.setItem('portugues-completo:lesson-ui:v1:${document_id}', JSON.stringify({version:1, started:true, step:${step}}));
location.replace('/${route}');
</script>
EOF
}

seed_lesson_page resume-n0-step0 N0-U01-L03 0 '#/unidade/N0-U01/licao/N0-U01-L03'
seed_lesson_page resume-n0-step2 N0-U01-L03 2 '#/unidade/N0-U01/licao/N0-U01-L03'
seed_lesson_page tts-u2-step2 N0-U02-L07 2 '#/unidade/N0-U02/licao/N0-U02-L07'
seed_lesson_page resume-n4-step2 N4-U09-L01 2 '#/unidade/N4-U09/licao/N4-U09-L01'

HOME_DOM="$(assert_page '#/' 'Unidades do curso')"
PLAN_DOM="$(assert_page '#/plano' 'Seu caminho pelo curso')"
UNITS_DOM="$(assert_page '#/unidades' 'Unidades do curso')"
REVIEWS_DOM="$(assert_page '#/revisoes' 'Revisões recomendadas')"
PERFORMANCE_DOM="$(assert_page '#/desempenho' 'Seu progresso de aprendizagem')"
HELP_DOM="$(assert_page '#/ajuda' 'Como podemos orientar você?')"
METHODOLOGY_DOM="$(assert_page '#/metodologia' 'Como o Português Completo ensina')"
UNIT_DOM="$(assert_page '#/unidade/N0-U01' 'Letras e primeiros sons')"
LESSON_DOM="$(assert_page '#/unidade/N0-U01/licao/N0-U01-L03' 'Começar lição')"
LEGACY_L01_DOM="$(assert_page '#/unidade/N0-U01/licao/N0-U01-L01' 'Falar e escrever: duas formas de comunicar')"
LEGACY_L08_DOM="$(assert_page '#/unidade/N0-U01/licao/N0-U01-L08' 'Letras e sons podem variar')"
RESUME_N0_DOM="$(assert_page 'artifacts/classic-visuals/resume-n0-step0.html' 'Etapa 1 de')"
RESUME_N0_ACTIVITY_DOM="$(assert_page 'artifacts/classic-visuals/resume-n0-step2.html' 'Voltar para a unidade')"
TTS_U2_DOM="$(assert_page 'artifacts/classic-visuals/tts-u2-step2.html' 'Ouvir A')"
N4_DOM="$(assert_page '#/unidade/N4-U09/licao/N4-U09-L01' 'Começar lição')"
N4_ACTIVITY_DOM="$(assert_page 'artifacts/classic-visuals/resume-n4-step2.html' 'Interpretação literária autônoma e evidência')"

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
grep -Fq 'href="#/ajuda"' <<<"$HOME_DOM" || { echo 'Smoke DOM UI: Ajuda não está disponível como utilitário discreto.' >&2; exit 1; }
if grep -Eq '>BLOCKED<|N0-U01-C0[1-8]|Catálogo real conectado|TTStext|>OBJECTIVE<|>DEMONSTRATION<' <<<"$UNIT_DOM$LESSON_DOM$RESUME_N0_DOM"; then
  echo 'Smoke DOM: metadado interno ainda aparece na interface pública.' >&2
  exit 1
fi

# T1.8 — metodologia sai da navegação persistente e permanece acessível por Ajuda.
if grep -Fq 'class="app-footer"' <<<"$HOME_DOM$UNIT_DOM$LESSON_DOM"; then
  echo 'Smoke DOM T1.8: rodapé persistente ainda existe no caminho de estudo.' >&2
  exit 1
fi
if grep -Fq 'href="#/metodologia"' <<<"$HOME_DOM$UNIT_DOM$LESSON_DOM"; then
  echo 'Smoke DOM T1.8: Metodologia ainda aparece persistentemente fora de Ajuda.' >&2
  exit 1
fi
grep -Fq 'Como o curso funciona' <<<"$HELP_DOM" || { echo 'Smoke DOM T1.8: entrada Como o curso funciona ausente em Ajuda.' >&2; exit 1; }
grep -Fq 'href="#/metodologia"' <<<"$HELP_DOM" || { echo 'Smoke DOM T1.8: Ajuda não aponta para a metodologia.' >&2; exit 1; }
grep -Fq 'href="#/ajuda"' <<<"$METHODOLOGY_DOM" || { echo 'Smoke DOM T1.8: metodologia não oferece retorno claro para Ajuda.' >&2; exit 1; }

# T1.7 — primeira entrada: só apresentação pública + ação; fluxo existe, mas permanece oculto.
grep -Fq 'Voltar para a unidade' <<<"$LESSON_DOM" || { echo 'Smoke DOM T1.7: retorno direto para unidade ausente na abertura.' >&2; exit 1; }
grep -Fq 'Entender o que é uma letra e conhecer as letras do alfabeto, seus nomes e sua ordem.' <<<"$LESSON_DOM" || { echo 'Smoke DOM T1.9: abertura pública autorada da nova primeira lição ausente.' >&2; exit 1; }
grep -Fq 'href="#/unidade/N0-U02"' <<<"$LEGACY_L01_DOM$LEGACY_L08_DOM" || { echo 'Smoke DOM T1.9: alias histórico não aponta de volta para a unidade canônica.' >&2; exit 1; }
grep -Fq 'data-lesson-start' <<<"$LESSON_DOM" || { echo 'Smoke DOM T1.7: botão Começar lição ausente.' >&2; exit 1; }
grep -Fq 'data-lesson-step="0"' <<<"$LESSON_DOM" || { echo 'Smoke DOM T1.7: fluxo guiado não foi montado sob a abertura.' >&2; exit 1; }
if ! grep -Eq '<section class="lesson-stream"[^>]*hidden' <<<"$LESSON_DOM"; then
  echo 'Smoke DOM T1.7: conteúdo/stepper não ficou oculto na primeira entrada.' >&2
  exit 1
fi
if grep -Eq '<header class="lesson-hero lesson-intro"[^>]*hidden' <<<"$LESSON_DOM"; then
  echo 'Smoke DOM T1.7: abertura foi ocultada indevidamente no primeiro acesso.' >&2
  exit 1
fi

# T1.7 — retomada: intro oculta, fluxo restaurado e navegável sem declarar domínio.
if grep -Eq '<section class="lesson-stream"[^>]*hidden' <<<"$RESUME_N0_DOM"; then
  echo 'Smoke DOM T1.7: fluxo permaneceu oculto ao retomar lição iniciada.' >&2
  exit 1
fi
if ! grep -Eq '<header class="lesson-hero lesson-intro"[^>]*hidden' <<<"$RESUME_N0_DOM"; then
  echo 'Smoke DOM T1.7: intro não foi dispensada na retomada.' >&2
  exit 1
fi
grep -Fq 'Avançar' <<<"$RESUME_N0_DOM" || { echo 'Smoke DOM T1.7: controle Avançar ausente após iniciar.' >&2; exit 1; }
if grep -Fq 'class="breadcrumbs"' <<<"$RESUME_N0_DOM"; then
  echo 'Smoke DOM UI: breadcrumb longo ainda aparece dentro da lição.' >&2
  exit 1
fi
if grep -Fq 'correção objetiva' <<<"$RESUME_N0_ACTIVITY_DOM"; then
  echo 'Smoke DOM UI: rótulo técnico/redundante de correção ainda aparece na lição.' >&2
  exit 1
fi

grep -Fq 'data-tts=' <<<"$TTS_U2_DOM" || { echo 'Smoke DOM T1.9: opções de áudio da U2 não viraram controles TTS após a tentativa.' >&2; exit 1; }
if grep -Eiq 'N0-U01-L03-AUD|initialsupportlevel|feedbacktts|supportbuttonlabel|mediaId' <<<"$RESUME_N0_ACTIVITY_DOM$TTS_U2_DOM"; then
  echo 'Smoke DOM T1.9: metadado técnico vazou para a interface do aluno.' >&2
  exit 1
fi
grep -Fq 'Registrar resposta' <<<"$N4_ACTIVITY_DOM" || { echo 'Smoke DOM: atividade aberta N4 ausente na retomada.' >&2; exit 1; }

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
capture home-narrow 680 900 '#/'
capture home-mobile 390 844 '#/'
capture plan-desktop 1440 900 '#/plano'
capture unit-n0-desktop 1440 900 '#/unidade/N0-U01'
capture help-desktop 1440 900 '#/ajuda'
capture help-mobile 390 900 '#/ajuda'
capture methodology-desktop 1440 900 '#/metodologia'

# T1.7: primeira entrada em quatro larguras relevantes.
capture lesson-n0-intro-desktop 1440 900 '#/unidade/N0-U01/licao/N0-U01-L03'
capture lesson-n0-intro-tablet 900 900 '#/unidade/N0-U01/licao/N0-U01-L03'
capture lesson-n0-intro-narrow 680 900 '#/unidade/N0-U01/licao/N0-U01-L03'
capture lesson-n0-intro-mobile 390 844 '#/unidade/N0-U01/licao/N0-U01-L03'

# T1.7: retomada/etapas posteriores usando estado visual local, sem alterar progresso acadêmico.
capture lesson-n0-resume-desktop 1440 1100 'artifacts/classic-visuals/resume-n0-step0.html'
capture lesson-n0-activity-desktop 1440 1100 'artifacts/classic-visuals/resume-n0-step2.html'
capture lesson-u2-tts-desktop 1440 1100 'artifacts/classic-visuals/tts-u2-step2.html'
capture lesson-n0-resume-mobile 390 900 'artifacts/classic-visuals/resume-n0-step0.html'
capture lesson-n4-activity-desktop 1440 1200 'artifacts/classic-visuals/resume-n4-step2.html'

printf 'Smoke DOM + screenshots clássicos/UI T1.7–T1.8: %s\n' "$OUT"
