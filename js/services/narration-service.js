import { getSettings } from './settings-service.js';

const synth = window.speechSynthesis;
let voices = [];
const listeners = new Set();

function refreshVoices() {
  voices = synth?.getVoices?.() || [];
  listeners.forEach(listener => listener(getVoices()));
}

export function getVoices() {
  const portuguese = voices.filter(voice => voice.lang.toLowerCase().startsWith('pt'));
  return portuguese.length ? portuguese : [...voices];
}

export function onVoicesChanged(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function speak(text) {
  const settings = getSettings();
  if (!synth || !settings.audioEnabled || !text) return false;

  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = Number(settings.rate);
  utterance.pitch = Number(settings.pitch);
  utterance.volume = Number(settings.volume);

  const selectedVoice = voices.find(voice => voice.voiceURI === settings.voiceURI);
  if (selectedVoice) utterance.voice = selectedVoice;

  synth.speak(utterance);
  return true;
}

export function stop() {
  synth?.cancel?.();
}

export function testVoice() {
  return speak('Olá. Esta é uma demonstração da voz escolhida para o curso Português Completo.');
}

export function initNarration() {
  if (!synth) return;
  refreshVoices();
  synth.addEventListener?.('voiceschanged', refreshVoices);
}
