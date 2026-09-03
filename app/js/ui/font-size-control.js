import { getSettings, subscribeSettings, updateSettings } from '../services/settings-service.js';

export const SIMPLE_FONT_SIZES = [
  { value: 'normal', label: 'Padrão' },
  { value: 'large', label: 'Grande' },
  { value: 'xlarge', label: 'Extra grande' }
];

export function fontSizeLabel(value) {
  return SIMPLE_FONT_SIZES.find(option => option.value === value)?.label || 'Padrão';
}

export function mountFontSizeControl(root) {
  if (!root) return () => {};

  root.innerHTML = `
    <div class="font-size-control">
      <button class="font-size-trigger" id="fontSizeButton" type="button" aria-expanded="false" aria-controls="fontSizePanel">Tamanho das letras</button>
      <div class="font-size-panel" id="fontSizePanel" role="group" aria-labelledby="fontSizeButton" hidden>
        ${SIMPLE_FONT_SIZES.map(option => `<button class="font-size-option" type="button" data-font-size-option="${option.value}">${option.label}</button>`).join('')}
      </div>
    </div>
  `;

  const button = root.querySelector('#fontSizeButton');
  const panel = root.querySelector('#fontSizePanel');

  function syncSelection(settings = getSettings()) {
    root.querySelectorAll('[data-font-size-option]').forEach(option => {
      const selected = option.dataset.fontSizeOption === settings.fontSize;
      option.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  function close() {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  }

  function onDocumentClick(event) {
    if (!panel.hidden && !root.contains(event.target)) close();
  }

  function onKeydown(event) {
    if (event.key === 'Escape' && !panel.hidden) {
      close();
      button.focus();
    }
  }

  button.addEventListener('click', () => {
    const opening = panel.hidden;
    panel.hidden = !opening;
    button.setAttribute('aria-expanded', opening ? 'true' : 'false');
  });

  panel.addEventListener('click', event => {
    const option = event.target.closest('[data-font-size-option]');
    if (!option) return;
    updateSettings({ fontSize: option.dataset.fontSizeOption });
    close();
    button.focus();
  });

  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeydown);
  const unsubscribe = subscribeSettings(syncSelection);
  syncSelection();

  return () => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeydown);
    unsubscribe();
  };
}
