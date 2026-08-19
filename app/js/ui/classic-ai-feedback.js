import { AiFeedbackError } from '../services/ai-feedback-service.js';
import { getSettings, subscribeSettings } from '../services/settings-service.js';

const STATUS_COPY = {
  MET: 'Atendido',
  PARTIAL: 'Parcialmente atendido',
  NOT_MET: 'Ainda não atendido',
  UNCERTAIN: 'Não foi possível confirmar',
  NOT_APPLICABLE: 'Não se aplica'
};

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function responseRef(documentId, blockId) {
  return `${documentId}/${blockId}`;
}

function savedResponse(progressService, documentId, blockId) {
  return progressService?.getProgress?.().responses?.[responseRef(documentId, blockId)]?.value;
}

function isEmptyResponse(value) {
  return value === undefined || value === null || (typeof value === 'string' && !value.trim());
}

function errorCopy(error) {
  if (!(error instanceof AiFeedbackError)) return 'Não foi possível pedir feedback agora. Sua resposta continua salva.';
  if (error.code === 'MISSING_CREDENTIAL') return 'Configure o token efêmero do auxiliar local em Configurações → Feedback por IA.';
  if (error.code === 'AI_DISABLED') return 'Ative o feedback por IA nas Configurações antes de pedir uma análise.';
  if (error.code === 'UNSAFE_ENDPOINT' || error.code === 'INVALID_ENDPOINT') return 'O endereço do auxiliar local não é seguro ou válido. Revise a configuração.';
  if (error.code === 'PROVIDER_NOT_CONFIGURED') return 'O provider selecionado ainda não está disponível nesta versão.';
  if (error.code === 'EMPTY_RESPONSE') return 'Registre sua resposta antes de pedir feedback por IA.';
  return 'Não foi possível pedir feedback agora. Sua resposta continua salva.';
}

function criteriaHtml(block, result) {
  const definitions = new Map((block.content?.aiFeedback?.criteria || []).map(item => [item.id, item.description]));
  if (!result.criterionResults?.length) return '';
  return `
    <div class="ai-feedback-criteria">
      <h4>Critérios observados</h4>
      <ul>${result.criterionResults.map(item => `
        <li>
          <div><strong>${esc(definitions.get(item.criterionId) || 'Critério da atividade')}</strong><span class="ai-criterion-status">${esc(STATUS_COPY[item.status] || 'Observado')}</span></div>
          ${item.feedback ? `<p>${esc(item.feedback)}</p>` : ''}
          ${item.evidence ? `<small>Na sua resposta: ${esc(item.evidence)}</small>` : ''}
        </li>`).join('')}</ul>
    </div>`;
}

function listHtml(title, items) {
  if (!Array.isArray(items) || !items.length) return '';
  return `<div class="ai-feedback-list"><h4>${esc(title)}</h4><ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul></div>`;
}

function renderResult(panel, block, result) {
  const body = panel.querySelector('[data-ai-feedback-result]');
  const pending = block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR';
  if (!body) return;

  if (result.result !== 'OK') {
    body.innerHTML = `
      <div class="ai-feedback-message" data-state="unavailable">
        <strong>Feedback não disponível</strong>
        <p>${esc(result.feedback?.summary || 'Não foi possível analisar esta resposta agora.')}</p>
        <p>Sua resposta continua salva e você pode tentar novamente.</p>
      </div>`;
    return;
  }

  body.innerHTML = `
    <div class="ai-feedback-message" data-state="ready">
      <h4>Resumo</h4>
      <p>${esc(result.feedback.summary)}</p>
    </div>
    ${listHtml('Pontos fortes', result.feedback.strengths)}
    ${listHtml('O que pode melhorar', result.feedback.improvements)}
    ${criteriaHtml(block, result)}
    ${result.feedback.nextStep ? `<div class="ai-feedback-next"><strong>Próximo passo</strong><p>${esc(result.feedback.nextStep)}</p></div>` : ''}
    ${pending ? '<p class="ai-feedback-boundary"><strong>Importante:</strong> este comentário é formativo. A atividade continua aguardando validação confiável e o feedback da IA não concede domínio.</p>' : '<p class="ai-feedback-boundary">Este comentário é formativo e não altera automaticamente seu domínio.</p>'}
  `;
}

function panelHtml(block) {
  const pending = block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR';
  return `
    <section class="ai-feedback-panel" data-ai-feedback-panel hidden>
      <div class="ai-feedback-heading">
        <div>
          <span class="block-kicker">Feedback opcional</span>
          <h3>Revisar com IA</h3>
        </div>
        <span class="ai-feedback-badge">formativo</span>
      </div>
      <p>A IA usa os critérios desta atividade para comentar a resposta que você já registrou.</p>
      ${pending ? '<p class="ai-feedback-boundary">Sua resposta continua em validação pendente mesmo depois do feedback.</p>' : ''}
      <div class="ai-feedback-actions">
        <button class="secondary-button" type="button" data-request-ai-feedback disabled>Pedir feedback com IA</button>
        <span class="ai-feedback-status" data-ai-feedback-status aria-live="polite">Registre a resposta antes de pedir feedback.</span>
      </div>
      <div data-ai-feedback-result></div>
    </section>`;
}

export function bindClassicAiFeedback(root, documentRuntime, { progressService, aiFeedbackService } = {}) {
  if (!documentRuntime?.blocks || !aiFeedbackService || !progressService) return () => {};

  const bindings = [];
  for (const block of documentRuntime.blocks) {
    if (block.kind !== 'ACTIVITY' || block.content?.aiFeedback?.enabled !== true) continue;
    const article = [...root.querySelectorAll('[data-activity-id]')].find(item => item.dataset.activityId === block.id);
    const form = article?.querySelector('[data-activity-form]');
    if (!article || !form) continue;

    article.insertAdjacentHTML('beforeend', panelHtml(block));
    const panel = article.querySelector('[data-ai-feedback-panel]');
    const button = panel.querySelector('[data-request-ai-feedback]');
    const status = panel.querySelector('[data-ai-feedback-status]');
    let dirty = false;
    let busy = false;

    const sync = () => {
      const settings = getSettings();
      const enabled = settings.aiFeedbackEnabled === true;
      panel.hidden = !enabled;
      if (!enabled) return;
      const saved = savedResponse(progressService, documentRuntime.id, block.id);
      button.disabled = busy || dirty || isEmptyResponse(saved);
      if (busy) status.textContent = 'Analisando sua resposta…';
      else if (dirty) status.textContent = 'Registre novamente a resposta atual antes de pedir feedback.';
      else if (isEmptyResponse(saved)) status.textContent = 'Registre a resposta antes de pedir feedback.';
      else status.textContent = 'Resposta registrada. O feedback só será pedido quando você clicar no botão.';
    };

    form.addEventListener('input', () => {
      dirty = true;
      sync();
    });
    form.addEventListener('submit', () => {
      dirty = false;
      queueMicrotask(sync);
    });

    button.addEventListener('click', async () => {
      if (busy) return;
      const response = savedResponse(progressService, documentRuntime.id, block.id);
      if (isEmptyResponse(response)) { sync(); return; }
      busy = true;
      panel.querySelector('[data-ai-feedback-result]').innerHTML = '';
      sync();
      try {
        const progress = progressService.getProgress();
        const result = await aiFeedbackService.requestFeedback({
          document: documentRuntime,
          block,
          response,
          context: {
            levelId: progress.curriculum?.current?.levelId || null,
            unitId: progress.curriculum?.current?.unitId || null
          }
        });
        renderResult(panel, block, result);
        status.textContent = result.result === 'OK' ? 'Feedback recebido.' : 'O provider não conseguiu concluir o feedback.';
      } catch (error) {
        panel.querySelector('[data-ai-feedback-result]').innerHTML = `<div class="ai-feedback-message" data-state="unavailable"><strong>Feedback não disponível</strong><p>${esc(errorCopy(error))}</p></div>`;
        status.textContent = 'Sua resposta continua salva.';
      } finally {
        busy = false;
        sync();
      }
    });

    const unsubscribeSettings = subscribeSettings(sync);
    const unsubscribeProgress = progressService.subscribe(() => sync());
    sync();
    bindings.push(() => { unsubscribeSettings(); unsubscribeProgress(); });
  }

  return () => bindings.forEach(cleanup => cleanup());
}
