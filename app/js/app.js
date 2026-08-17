import { initRouter } from './core/router.js';
import { initNarration } from './services/narration-service.js';
import { initSettings } from './services/settings-service.js';
import { createContentService } from './services/content-service.js';
import { mountSettingsMenu } from './ui/settings-menu.js';
import { bindClassicRenderer, documentHtml, homeHtml, unitHtml } from './ui/classic-renderer.js';

const app = document.getElementById('app');
const settingsRoot = document.getElementById('settings-root');
const contentService = createContentService({ basePath: './content' });

let course = null;
let routeRevision = 0;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function statePage({ eyebrow, title, copy, detail = '' }) {
  return `
    <section class="state-page reading-content">
      <span class="eyebrow">${escapeHtml(eyebrow)}</span>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(copy)}</p>
      ${detail ? `<div class="status-card">${escapeHtml(detail)}</div>` : ''}
      <a class="secondary-button inline-link" href="#/">Voltar ao curso</a>
    </section>`;
}

function loadingPage(label = 'Carregando conteúdo') {
  app.innerHTML = statePage({ eyebrow: 'Modo Clássico', title: label, copy: 'Preparando o conteúdo real do curso.' });
}

async function ensureCourse() {
  if (!course) course = await contentService.loadCatalog();
  return course;
}

async function loadManifest(unitId) {
  const catalog = await ensureCourse();
  const unit = await contentService.loadUnitManifest(unitId, { catalog });
  return unit.manifest;
}

async function renderHome(revision) {
  const catalog = await ensureCourse();
  const manifests = await Promise.all(catalog.units.map(unit => loadManifest(unit.id).catch(() => null)));
  if (revision !== routeRevision) return;
  app.innerHTML = homeHtml(catalog, manifests.filter(Boolean));
  bindClassicRenderer(app);
}

async function renderUnit(route, revision) {
  const manifest = await loadManifest(route.unitId);
  if (revision !== routeRevision) return;
  app.innerHTML = unitHtml(manifest);
  bindClassicRenderer(app);
}

async function renderLesson(route, revision) {
  const manifest = await loadManifest(route.unitId);
  const loaded = await contentService.loadLesson(route.unitId, route.lessonId);
  if (revision !== routeRevision) return;
  app.innerHTML = documentHtml(loaded.runtime, { unitId: manifest.id, unitTitle: manifest.title });
  bindClassicRenderer(app, loaded.runtime);
}

async function renderVerification(route, revision) {
  const manifest = await loadManifest(route.unitId);
  const loaded = await contentService.loadVerification(route.unitId);
  if (revision !== routeRevision) return;
  app.innerHTML = documentHtml(loaded.runtime, { unitId: manifest.id, unitTitle: manifest.title, verification: true });
  bindClassicRenderer(app, loaded.runtime);
}

async function renderRoute(route) {
  const revision = ++routeRevision;
  loadingPage(route.name === 'home' ? 'Abrindo o curso' : 'Abrindo conteúdo');
  try {
    if (route.name === 'home') return await renderHome(revision);
    if (route.name === 'unit') return await renderUnit(route, revision);
    if (route.name === 'lesson') return await renderLesson(route, revision);
    if (route.name === 'verification') return await renderVerification(route, revision);
    if (revision !== routeRevision) return;
    app.innerHTML = statePage({ eyebrow: '404', title: 'Página não encontrada', copy: 'Esta rota não existe no Português Completo.' });
  } catch (error) {
    if (revision !== routeRevision) return;
    console.error('Falha ao renderizar rota.', error);
    const isMissing = /não está|não declara|não encontrada|não pertence|HTTP 404/i.test(error.message || '');
    app.innerHTML = statePage({
      eyebrow: isMissing ? 'Conteúdo indisponível' : 'Erro de carregamento',
      title: isMissing ? 'Este conteúdo não está no catálogo atual' : 'Não foi possível abrir esta etapa',
      copy: isMissing ? 'O catálogo clássico é publicado progressivamente. Conteúdo fora dele não é tratado como uma tela quebrada.' : 'Seu progresso não é alterado por uma falha de carregamento. Tente abrir novamente.',
      detail: error.message || 'Erro desconhecido'
    });
  }
}

function bootstrap() {
  initSettings();
  initNarration();
  mountSettingsMenu(settingsRoot);
  initRouter(renderRoute);
}

bootstrap();
