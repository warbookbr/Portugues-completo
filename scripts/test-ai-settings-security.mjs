import assert from 'node:assert/strict';

const store = new Map([
  ['portugues-completo:settings:v1', JSON.stringify({
    theme: 'dark',
    aiFeedbackEnabled: true,
    aiFeedbackConsentVersion: 'p6-ai-feedback-consent-v1',
    apiKey: 'legacy-secret-must-not-survive',
    rememberApiKey: true,
    unknownFutureField: 'ignored'
  })]
]);

globalThis.localStorage = {
  getItem: key => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, value),
  removeItem: key => store.delete(key)
};

globalThis.document = {
  documentElement: {
    dataset: {},
    style: { setProperty() {}, removeProperty() {} }
  }
};

const settingsModule = await import(`../app/js/services/settings-service.js?test=${Date.now()}`);
const loaded = settingsModule.getSettings();
assert.equal(loaded.theme, 'dark');
assert.equal(loaded.aiFeedbackEnabled, true);
assert.equal(loaded.aiFeedbackConsentVersion, settingsModule.AI_FEEDBACK_CONSENT_VERSION);
assert.equal('apiKey' in loaded, false);
assert.equal('rememberApiKey' in loaded, false);
assert.equal('unknownFutureField' in loaded, false);

settingsModule.updateSettings({
  fontSize: 'large',
  apiKey: 'attempted-new-secret',
  rememberApiKey: true,
  arbitrary: 123
});

const persisted = JSON.parse(store.get('portugues-completo:settings:v1'));
assert.equal(persisted.fontSize, 'large');
assert.equal('apiKey' in persisted, false);
assert.equal('rememberApiKey' in persisted, false);
assert.equal('arbitrary' in persisted, false);
assert.equal(Object.keys(persisted).every(key => key in loaded), true, 'Persistência deve conter somente chaves oficiais de settings.');

console.log('P6 settings: campos desconhecidos/segredos legados são descartados e nunca repersistidos.');
