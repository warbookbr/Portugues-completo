import { getSettings, updateSettings } from '../services/settings-service.js';
import { getVoices, onVoicesChanged, testVoice } from '../services/narration-service.js';

export function renderAudioSettings(container) {
  const settings = getSettings();

  container.innerHTML = `
    <div class="settings-header">
      <div>
        <button class="settings-back" type="button" data-settings-back>← Configurações</button>
        <h2>Áudio</h2>
        <p class="settings-subtitle">Narração pelo navegador ou dispositivo.</p>
      </div>
    </div>

    <div class="settings-inline">
      <label for="audioEnabled">Narração</label>
      <input id="audioEnabled" type="checkbox" ${settings.audioEnabled ? 'checked' : ''}>
    </div>

    <div class="settings-row">
      <label for="voiceSelect">Voz</label>
      <select id="voiceSelect"></select>
    </div>

    <div class="settings-row">
      <div class="settings-inline">
        <label for="rate">Velocidade</label>
        <span class="settings-value" id="rateValue">${Number(settings.rate).toFixed(1)}×</span>
      </div>
      <input id="rate" type="range" min="0.5" max="1.8" step="0.1" value="${settings.rate}">
    </div>

    <div class="settings-row">
      <div class="settings-inline">
        <label for="pitch">Tom</label>
        <span class="settings-value" id="pitchValue">${Number(settings.pitch).toFixed(1)}</span>
      </div>
      <input id="pitch" type="range" min="0" max="2" step="0.1" value="${settings.pitch}">
    </div>

    <div class="settings-row">
      <div class="settings-inline">
        <label for="volume">Volume</label>
        <span class="settings-value" id="volumeValue">${Math.round(Number(settings.volume) * 100)}%</span>
      </div>
      <input id="volume" type="range" min="0" max="1" step="0.05" value="${settings.volume}">
    </div>

    <div class="settings-actions">
      <button class="primary-button" id="testVoice" type="button">Testar voz</button>
    </div>
  `;

  const voiceSelect = container.querySelector('#voiceSelect');

  function populateVoices() {
    const current = getSettings().voiceURI;
    const voices = getVoices();
    voiceSelect.innerHTML = '<option value="">Voz padrão do dispositivo</option>';

    voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.voiceURI;
      option.textContent = `${voice.name} — ${voice.lang}${voice.localService ? ' (local)' : ''}`;
      voiceSelect.appendChild(option);
    });

    if ([...voiceSelect.options].some(option => option.value === current)) {
      voiceSelect.value = current;
    }
  }

  populateVoices();
  const unsubscribeVoices = onVoicesChanged(populateVoices);

  container.querySelector('#audioEnabled').addEventListener('change', event => {
    updateSettings({ audioEnabled: event.target.checked });
  });

  voiceSelect.addEventListener('change', event => {
    updateSettings({ voiceURI: event.target.value });
  });

  const rate = container.querySelector('#rate');
  const pitch = container.querySelector('#pitch');
  const volume = container.querySelector('#volume');

  rate.addEventListener('input', () => {
    container.querySelector('#rateValue').textContent = `${Number(rate.value).toFixed(1)}×`;
    updateSettings({ rate: Number(rate.value) });
  });

  pitch.addEventListener('input', () => {
    container.querySelector('#pitchValue').textContent = Number(pitch.value).toFixed(1);
    updateSettings({ pitch: Number(pitch.value) });
  });

  volume.addEventListener('input', () => {
    container.querySelector('#volumeValue').textContent = `${Math.round(Number(volume.value) * 100)}%`;
    updateSettings({ volume: Number(volume.value) });
  });

  container.querySelector('#testVoice').addEventListener('click', testVoice);

  return () => unsubscribeVoices();
}
