const STORAGE_KEY = 'portugues-completo:settings:v1';
export const AI_FEEDBACK_CONSENT_VERSION = 'p6-ai-feedback-consent-v1';

const defaults = {
  theme: 'light',
  fontSize: 'normal',
  fontFamily: 'system',
  textColorMode: 'auto',
  textColor: '#172033',
  audioEnabled: true,
  voiceURI: '',
  rate: 1,
  pitch: 1,
  volume: 1,
  aiFeedbackEnabled: false,
  aiProvider: 'openai-companion',
  aiModel: 'gpt-5.6-terra',
  aiEndpoint: 'http://127.0.0.1:43117/feedback',
  aiFeedbackConsentVersion: null
};

const knownSettingKeys = new Set(Object.keys(defaults));
let settings = load();
const listeners = new Set();

function sanitizeStoredSettings(stored) {
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
  return Object.fromEntries(Object.entries(stored).filter(([key]) => knownSettingKeys.has(key)));
}

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...defaults, ...sanitizeStoredSettings(stored) };
  } catch {
    return { ...defaults };
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function notify() {
  listeners.forEach(listener => listener(getSettings()));
}

export function getSettings() {
  return { ...settings };
}

export function updateSettings(patch) {
  settings = { ...settings, ...sanitizeStoredSettings(patch) };
  persist();
  applySettings();
  notify();
  return getSettings();
}

export function resetSettings() {
  settings = { ...defaults };
  persist();
  applySettings();
  notify();
  return getSettings();
}

export function subscribeSettings(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function applySettings() {
  const root = document.documentElement;
  root.dataset.theme = settings.theme;
  root.dataset.fontSize = settings.fontSize;

  const fonts = {
    system: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    arial: 'Arial, sans-serif',
    verdana: 'Verdana, sans-serif',
    georgia: 'Georgia, serif',
    times: '"Times New Roman", Times, serif',
    trebuchet: '"Trebuchet MS", sans-serif'
  };

  root.style.setProperty('--reading-font', fonts[settings.fontFamily] || fonts.system);

  if (settings.textColorMode === 'custom') {
    root.style.setProperty('--reading-text', settings.textColor);
  } else {
    root.style.removeProperty('--reading-text');
  }
}

export function initSettings() {
  applySettings();
  return getSettings();
}
