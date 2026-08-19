import { AI_FEEDBACK_CONSENT_VERSION, getSettings, updateSettings } from '../services/settings-service.js';
import { isOpenAiCompanionEndpointSafe } from '../services/ai-providers/openai-companion.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function renderAiSettings(root, { credentialService } = {}) {
  const settings = getSettings();
  const tokenConfigured = Boolean(credentialService?.get?.('openai-companion'));
  const consented = settings.aiFeedbackConsentVersion === AI_FEEDBACK_CONSENT_VERSION;

  root.innerHTML = `
    <div class="settings-header">
      <div>
        <button class="settings-back" type="button" data-settings-back>← Voltar</button>
        <h2>Feedback por IA</h2>
        <p class="settings-subtitle">Opcional. A IA comenta sua resposta, mas não aprova a atividade nem substitui validação confiável.</p>
      </div>
    </div>

    <form data-ai-settings>
      <div class="settings-note ai-privacy-note">
        <strong>Como funciona</strong>
        <p>O curso envia apenas a resposta e o contexto necessário da atividade. Para OpenAI, sua API key fica no auxiliar local iniciado por você; ela não entra nesta página. O provedor pode cobrar pelo uso e o feedback pode conter erros.</p>
      </div>

      <label class="settings-consent">
        <input type="checkbox" name="enabled" ${settings.aiFeedbackEnabled ? 'checked' : ''}>
        <span>Ativar feedback por IA neste dispositivo.</span>
      </label>

      <label class="settings-consent">
        <input type="checkbox" name="consent" ${consented ? 'checked' : ''}>
        <span>Entendi que cada chamada pode ter custo, envia dados ao provedor e não muda automaticamente meu domínio ou aprovação.</span>
      </label>

      <div class="settings-row">
        <label for="aiProvider">Provider</label>
        <select id="aiProvider" name="provider">
          <option value="openai-companion" selected>OpenAI via auxiliar local</option>
        </select>
      </div>

      <div class="settings-row">
        <label for="aiModel">Modelo</label>
        <input id="aiModel" name="model" type="text" autocomplete="off" spellcheck="false" value="${escapeHtml(settings.aiModel || 'gpt-5.6-terra')}">
        <small class="settings-help">Configurável porque modelos, preço e disponibilidade podem mudar.</small>
      </div>

      <div class="settings-row">
        <label for="aiEndpoint">Auxiliar local</label>
        <input id="aiEndpoint" name="endpoint" type="url" autocomplete="off" spellcheck="false" value="${escapeHtml(settings.aiEndpoint || 'http://127.0.0.1:43117/feedback')}">
        <small class="settings-help">Por segurança, o adapter aceita apenas localhost/127.0.0.1/::1.</small>
      </div>

      <div class="settings-row">
        <label for="aiCompanionToken">Token efêmero do auxiliar</label>
        <input id="aiCompanionToken" name="token" type="password" autocomplete="off" spellcheck="false" placeholder="${tokenConfigured ? 'Token de sessão já configurado' : 'Cole o token mostrado pelo auxiliar local'}">
        <small class="settings-help">O token fica somente nesta sessão do navegador. Ele não é sua API key da OpenAI.</small>
      </div>

      <div class="sync-status" data-ai-settings-status data-state="${tokenConfigured ? 'SYNCED' : 'LOCAL_ONLY'}">
        ${tokenConfigured ? 'Token do auxiliar configurado nesta sessão.' : 'Nenhum token do auxiliar configurado nesta sessão.'}
      </div>

      <div class="settings-actions">
        <button class="primary-button" type="submit">Salvar configuração</button>
        ${tokenConfigured ? '<button class="secondary-button" type="button" data-clear-ai-token>Remover token desta sessão</button>' : ''}
      </div>
    </form>
  `;

  const form = root.querySelector('[data-ai-settings]');
  const status = root.querySelector('[data-ai-settings-status]');

  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const enabled = data.get('enabled') === 'on';
    const consent = data.get('consent') === 'on';
    const provider = 'openai-companion';
    const model = String(data.get('model') || '').trim();
    const endpoint = String(data.get('endpoint') || '').trim();
    const token = String(data.get('token') || '').trim();
    const existingToken = credentialService?.get?.(provider);

    if (!model) {
      status.dataset.state = 'ERROR';
      status.textContent = 'Informe um modelo para o provider.';
      return;
    }
    if (!isOpenAiCompanionEndpointSafe(endpoint)) {
      status.dataset.state = 'ERROR';
      status.textContent = 'Use um endereço local seguro para o auxiliar de IA.';
      return;
    }
    if (enabled && !consent) {
      status.dataset.state = 'ERROR';
      status.textContent = 'Confirme o consentimento antes de ativar feedback por IA.';
      return;
    }
    if (enabled && !token && !existingToken) {
      status.dataset.state = 'ERROR';
      status.textContent = 'Informe o token efêmero mostrado pelo auxiliar local antes de ativar.';
      return;
    }

    if (token) credentialService?.set?.(provider, token);
    updateSettings({
      aiFeedbackEnabled: enabled,
      aiProvider: provider,
      aiModel: model,
      aiEndpoint: endpoint,
      aiFeedbackConsentVersion: enabled && consent ? AI_FEEDBACK_CONSENT_VERSION : null
    });

    status.dataset.state = 'SYNCED';
    status.textContent = enabled
      ? 'Feedback por IA ativado. As chamadas só acontecem em atividades elegíveis e por ação explícita.'
      : 'Feedback por IA desativado. Nenhuma atividade fará chamadas ao provider.';
  });

  root.querySelector('[data-clear-ai-token]')?.addEventListener('click', () => {
    credentialService?.clear?.('openai-companion');
    updateSettings({ aiFeedbackEnabled: false, aiFeedbackConsentVersion: null });
    renderAiSettings(root, { credentialService });
  });
}
