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

cat >"$OUT/p6-ai-settings.html" <<'EOF'
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/app/css/base.css"><link rel="stylesheet" href="/app/css/components.css"><link rel="stylesheet" href="/app/css/settings.css"><link rel="stylesheet" href="/app/css/progress.css">
<title>P6 AI Settings</title>
</head>
<body>
<main><aside class="settings-panel" id="panel"></aside></main>
<script type="module">
  localStorage.clear(); sessionStorage.clear();
  const { renderAiSettings } = await import('/app/js/ui/ai-settings.js');
  const token = { value: null };
  const credentialService = { get: () => token.value, set: (_p,v) => { token.value=v; }, clear: () => { token.value=null; } };
  renderAiSettings(document.querySelector('#panel'), { credentialService });
  document.documentElement.dataset.smokeReady = 'true';
</script>
</body></html>
EOF

cat >"$OUT/p6-ai-success.html" <<'EOF'
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/app/css/base.css"><link rel="stylesheet" href="/app/css/components.css"><link rel="stylesheet" href="/app/css/classic.css"><link rel="stylesheet" href="/app/css/classic-activities.css"><link rel="stylesheet" href="/app/css/ai-feedback.css">
<title>P6 AI Success</title>
</head>
<body>
<main class="app-shell"><div class="course-view reading-content"><article class="lesson-block activity-card" data-activity-id="L01-A01"><header class="block-header"><div><span class="block-kicker">Interpretação aberta</span></div><span class="activity-mode">avaliação pendente</span></header><p>Apresente uma interpretação própria, três evidências, uma alternativa plausível e um elemento que limita sua certeza.</p><form class="activity-form" data-activity-form><label>Sua resposta<textarea name="response">Resposta previamente registrada.</textarea></label><div class="activity-actions"><button class="primary-button" type="submit">Registrar resposta</button></div></form></article></div></main>
<script type="module">
  localStorage.setItem('portugues-completo:settings:v1', JSON.stringify({aiFeedbackEnabled:true,aiFeedbackConsentVersion:'p6-ai-feedback-consent-v1'}));
  const { bindClassicAiFeedback } = await import('/app/js/ui/classic-ai-feedback.js');
  const runtime = {id:'N4-U09-L01',kind:'LESSON',blocks:[{id:'L01-A01',kind:'ACTIVITY',content:{aiFeedback:{enabled:true,criteria:[{id:'C1',description:'formula uma interpretação própria do texto',required:true},{id:'C2',description:'usa evidências internas pertinentes para sustentar a interpretação',required:true}]}},activity:{evaluation:{mode:'RELIABLE_EVALUATOR'}}}]};
  const progress = {curriculum:{current:{levelId:'N4',unitId:'N4-U09',lessonId:'N4-U09-L01'}},responses:{'N4-U09-L01/L01-A01':{value:'Resposta previamente registrada.'}}};
  const progressService = {getProgress:()=>structuredClone(progress),subscribe:()=>()=>{}};
  const aiFeedbackService = {requestFeedback:async()=>({schemaVersion:1,result:'OK',criterionResults:[{criterionId:'C1',status:'MET',evidence:'Há uma interpretação explícita.',feedback:'A leitura está clara.'},{criterionId:'C2',status:'PARTIAL',evidence:'Uma evidência foi relacionada.',feedback:'Explique melhor o vínculo com uma segunda evidência.'}],feedback:{summary:'A interpretação está bem encaminhada e pode ganhar mais sustentação.',strengths:['hipótese própria clara'],improvements:['explicar melhor o vínculo entre evidência e leitura'],nextStep:'Acrescente uma segunda evidência e diga como ela sustenta sua interpretação.'},confidence:'MEDIUM',recommendation:'REVISE',flags:[]})};
  bindClassicAiFeedback(document, runtime, {progressService,aiFeedbackService});
  document.querySelector('[data-request-ai-feedback]').click();
  await new Promise(resolve=>setTimeout(resolve,50));
  document.documentElement.dataset.smokeReady='true';
</script>
</body></html>
EOF

cat >"$OUT/p6-ai-failure.html" <<'EOF'
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/app/css/base.css"><link rel="stylesheet" href="/app/css/components.css"><link rel="stylesheet" href="/app/css/classic.css"><link rel="stylesheet" href="/app/css/classic-activities.css"><link rel="stylesheet" href="/app/css/ai-feedback.css">
<title>P6 AI Failure</title>
</head>
<body>
<main class="app-shell"><div class="course-view reading-content"><article class="lesson-block activity-card" data-activity-id="L01-A01"><header class="block-header"><div><span class="block-kicker">Interpretação aberta</span></div><span class="activity-mode">avaliação pendente</span></header><p>Resposta já registrada antes da chamada.</p><form class="activity-form" data-activity-form><textarea name="response">Resposta previamente registrada.</textarea></form></article></div></main>
<script type="module">
  localStorage.setItem('portugues-completo:settings:v1', JSON.stringify({aiFeedbackEnabled:true,aiFeedbackConsentVersion:'p6-ai-feedback-consent-v1'}));
  const { bindClassicAiFeedback } = await import('/app/js/ui/classic-ai-feedback.js');
  const runtime={id:'N4-U09-L01',kind:'LESSON',blocks:[{id:'L01-A01',kind:'ACTIVITY',content:{aiFeedback:{enabled:true,criteria:[{id:'C1',description:'formula uma interpretação própria do texto',required:true}]}},activity:{evaluation:{mode:'RELIABLE_EVALUATOR'}}}]};
  const progress={curriculum:{current:{levelId:'N4',unitId:'N4-U09',lessonId:'N4-U09-L01'}},responses:{'N4-U09-L01/L01-A01':{value:'Resposta previamente registrada.'}}};
  const progressService={getProgress:()=>structuredClone(progress),subscribe:()=>()=>{}};
  const aiFeedbackService={requestFeedback:async()=>({schemaVersion:1,result:'PROVIDER_ERROR',criterionResults:[],feedback:{summary:'O feedback por IA está indisponível agora. Sua resposta continua registrada.',strengths:[],improvements:[],nextStep:''},confidence:'LOW',recommendation:'CANNOT_EVALUATE',flags:['PROVIDER_REQUEST_FAILED']})};
  bindClassicAiFeedback(document,runtime,{progressService,aiFeedbackService});
  document.querySelector('[data-request-ai-feedback]').click();
  await new Promise(resolve=>setTimeout(resolve,50));
  document.documentElement.dataset.smokeReady='true';
</script>
</body></html>
EOF

page_dom() {
  local route="$1"
  "$CHROME" --headless --no-sandbox --disable-gpu --virtual-time-budget=2600 --dump-dom "http://127.0.0.1:${PORT}/${route}" 2>/dev/null
}

HOME_DOM="$(page_dom '#/')"
N4_DOM="$(page_dom '#/unidade/N4-U09/licao/N4-U09-L01')"
SETTINGS_DOM="$(page_dom 'artifacts/classic-visuals/p6-ai-settings.html')"
SUCCESS_DOM="$(page_dom 'artifacts/classic-visuals/p6-ai-success.html')"
FAILURE_DOM="$(page_dom 'artifacts/classic-visuals/p6-ai-failure.html')"

grep -Fq 'data-settings-section="ai"' <<<"$HOME_DOM" || { echo 'Smoke P6.2: Feedback por IA ausente das Configurações.' >&2; exit 1; }
grep -Fq 'data-ai-feedback-panel' <<<"$N4_DOM" || { echo 'Smoke P6.2: piloto N4-U09 não recebeu painel de IA.' >&2; exit 1; }
if ! grep -Eq 'data-ai-feedback-panel[^>]*hidden' <<<"$N4_DOM"; then
  echo 'Smoke P6.2: painel de IA deve ficar oculto por padrão com IA desligada.' >&2
  exit 1
fi
grep -Fq 'Entendi que cada chamada pode ter custo' <<<"$SETTINGS_DOM" || { echo 'Smoke P6.2: consentimento explícito ausente.' >&2; exit 1; }
grep -Fq 'ela não entra nesta página' <<<"$SETTINGS_DOM" || { echo 'Smoke P6.2: explicação de segurança da API key ausente.' >&2; exit 1; }
grep -Fq 'A interpretação está bem encaminhada' <<<"$SUCCESS_DOM" || { echo 'Smoke P6.2: feedback estruturado de sucesso não foi renderizado.' >&2; exit 1; }
grep -Fq 'Parcialmente atendido' <<<"$SUCCESS_DOM" || { echo 'Smoke P6.2: status público por critério ausente.' >&2; exit 1; }
grep -Fq 'continua aguardando validação confiável' <<<"$SUCCESS_DOM" || { echo 'Smoke P6.2: fronteira de autoridade da IA ausente no sucesso.' >&2; exit 1; }
grep -Fq 'Feedback não disponível' <<<"$FAILURE_DOM" || { echo 'Smoke P6.2: falha segura não foi renderizada.' >&2; exit 1; }
grep -Fq 'Sua resposta continua salva' <<<"$FAILURE_DOM" || { echo 'Smoke P6.2: falha não deixa claro que a resposta foi preservada.' >&2; exit 1; }
if grep -Eiq 'PROVIDER_REQUEST_FAILED|criterionId|mayPromoteEvidence|p6-ai-feedback-consent-v1' <<<"$SUCCESS_DOM$FAILURE_DOM"; then
  echo 'Smoke P6.2: código/metadado interno vazou para a interface pública.' >&2
  exit 1
fi

capture() {
  local name="$1" width="$2" height="$3" route="$4"
  "$CHROME" --headless --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=2600 --window-size="${width},${height}" --screenshot="$OUT/$name.png" "http://127.0.0.1:${PORT}/${route}"
}

capture p6-ai-settings-desktop 1440 1000 'artifacts/classic-visuals/p6-ai-settings.html'
capture p6-ai-settings-mobile 390 900 'artifacts/classic-visuals/p6-ai-settings.html'
capture p6-ai-success-desktop 1440 1100 'artifacts/classic-visuals/p6-ai-success.html'
capture p6-ai-success-mobile 390 1000 'artifacts/classic-visuals/p6-ai-success.html'
capture p6-ai-failure-desktop 1440 900 'artifacts/classic-visuals/p6-ai-failure.html'

printf 'Smoke P6.2 + screenshots de IA: %s\n' "$OUT"
