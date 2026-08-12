import { getSettings, resetSettings, updateSettings } from '../services/settings-service.js';

export function renderAppearanceSettings(container) {
  const settings = getSettings();

  container.innerHTML = `
    <div class="settings-header">
      <div>
        <button class="settings-back" type="button" data-settings-back>← Configurações</button>
        <h2>Aparência</h2>
        <p class="settings-subtitle">Tema e leitura no dispositivo atual.</p>
      </div>
    </div>

    <div class="settings-inline">
      <label for="darkTheme">Tema escuro</label>
      <input id="darkTheme" type="checkbox" ${settings.theme === 'dark' ? 'checked' : ''}>
    </div>

    <div class="settings-row">
      <label for="fontSize">Tamanho da fonte</label>
      <select id="fontSize">
        <option value="small">Pequena</option>
        <option value="normal">Normal</option>
        <option value="large">Grande</option>
        <option value="xlarge">Muito grande</option>
      </select>
    </div>

    <div class="settings-row">
      <label for="fontFamily">Fonte</label>
      <select id="fontFamily">
        <option value="system">Sistema</option>
        <option value="arial">Arial</option>
        <option value="verdana">Verdana</option>
        <option value="georgia">Georgia</option>
        <option value="times">Times New Roman</option>
        <option value="trebuchet">Trebuchet MS</option>
      </select>
    </div>

    <div class="settings-row">
      <div class="settings-inline">
        <label for="autoTextColor">Cor automática do tema</label>
        <input id="autoTextColor" type="checkbox" ${settings.textColorMode === 'auto' ? 'checked' : ''}>
      </div>
      <div class="color-control">
        <span class="settings-value">Cor personalizada</span>
        <input id="textColor" type="color" value="${settings.textColor}" ${settings.textColorMode === 'auto' ? 'disabled' : ''}>
      </div>
    </div>

    <div class="settings-actions">
      <button class="secondary-button" id="resetAppearance" type="button">Restaurar padrões</button>
    </div>
  `;

  const fontSize = container.querySelector('#fontSize');
  const fontFamily = container.querySelector('#fontFamily');
  const autoTextColor = container.querySelector('#autoTextColor');
  const textColor = container.querySelector('#textColor');

  fontSize.value = settings.fontSize;
  fontFamily.value = settings.fontFamily;

  container.querySelector('#darkTheme').addEventListener('change', event => {
    updateSettings({ theme: event.target.checked ? 'dark' : 'light' });
  });

  fontSize.addEventListener('change', event => {
    updateSettings({ fontSize: event.target.value });
  });

  fontFamily.addEventListener('change', event => {
    updateSettings({ fontFamily: event.target.value });
  });

  autoTextColor.addEventListener('change', event => {
    textColor.disabled = event.target.checked;
    updateSettings({ textColorMode: event.target.checked ? 'auto' : 'custom' });
  });

  textColor.addEventListener('input', event => {
    updateSettings({ textColorMode: 'custom', textColor: event.target.value });
  });

  container.querySelector('#resetAppearance').addEventListener('click', () => {
    const currentAudio = getSettings();
    const reset = resetSettings();
    updateSettings({
      audioEnabled: currentAudio.audioEnabled,
      voiceURI: currentAudio.voiceURI,
      rate: currentAudio.rate,
      pitch: currentAudio.pitch,
      volume: currentAudio.volume
    });
    renderAppearanceSettings(container);
  });
}
