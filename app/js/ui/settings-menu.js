import { renderAudioSettings } from './audio-settings.js';
import { renderAppearanceSettings } from './appearance-settings.js';
import { renderProgressSettings } from './progress-settings.js';
import { renderAiSettings } from './ai-settings.js';

export function mountSettingsMenu(root, { progressSyncService = null, aiFeedbackCredentialService = null } = {}) {
  root.innerHTML = `
    <button class="icon-button settings-trigger" id="settingsButton" type="button" aria-label="Abrir configurações" aria-expanded="false" aria-controls="settingsPanel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"></path>
      </svg>
    </button>
    <aside class="settings-panel" id="settingsPanel" hidden></aside>
  `;

  const button = root.querySelector('#settingsButton');
  const panel = root.querySelector('#settingsPanel');
  let cleanupDetail = null;

  function cleanup() {
    cleanupDetail?.();
    cleanupDetail = null;
  }

  function renderMainMenu() {
    cleanup();
    panel.innerHTML = `
      <div class="settings-header">
        <div>
          <h2>Configurações</h2>
          <p class="settings-subtitle">Personalize sua experiência.</p>
        </div>
      </div>
      <button class="menu-button" type="button" data-settings-section="audio">
        <span>Áudio</span><span aria-hidden="true">›</span>
      </button>
      <button class="menu-button" type="button" data-settings-section="appearance">
        <span>Aa Aparência</span><span aria-hidden="true">›</span>
      </button>
      <button class="menu-button" type="button" data-settings-section="progress">
        <span>Progresso</span><span aria-hidden="true">›</span>
      </button>
      <button class="menu-button" type="button" data-settings-section="ai">
        <span>Feedback por IA</span><span aria-hidden="true">›</span>
      </button>
    `;
  }

  function openSection(section) {
    cleanup();
    if (section === 'audio') cleanupDetail = renderAudioSettings(panel);
    if (section === 'appearance') renderAppearanceSettings(panel);
    if (section === 'progress') cleanupDetail = renderProgressSettings(panel, { progressSyncService });
    if (section === 'ai') renderAiSettings(panel, { credentialService: aiFeedbackCredentialService });
  }

  button.addEventListener('click', () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    button.setAttribute('aria-expanded', String(opening));
    if (opening) renderMainMenu();
    else cleanup();
  });

  panel.addEventListener('click', event => {
    const sectionButton = event.target.closest('[data-settings-section]');
    if (sectionButton) openSection(sectionButton.dataset.settingsSection);
    if (event.target.closest('[data-settings-back]')) renderMainMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      cleanup();
      button.focus();
    }
  });

  renderMainMenu();
}
