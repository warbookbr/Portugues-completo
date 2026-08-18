import { initRouter } from './core/router.js';
import { initNarration } from './services/narration-service.js';
import { initSettings } from './services/settings-service.js';
import { createContentService } from './services/content-service.js';
import { createProgressService } from './services/progress-service.js';
import { createSafeProgressStorage } from './services/progress-storage-service.js';
import { createProgressSyncService } from './services/progress-sync-service.js';
import { mountSettingsMenu } from './ui/settings-menu.js';
import { bindClassicRenderer, documentHtml, unitHtml } from './ui/classic-renderer.js';
import { homeHtml } from './ui/classic-home.js';
import { helpPageHtml, methodologyPageHtml, performancePageHtml, planPageHtml, reviewsPageHtml, unitsPageHtml } from './ui/classic-pages.js';
import { bindClassicProgress } from './ui/classic-progress-binding.js';
import { polishClassicPresentation } from './ui/classic-presentation.js';
import { decorateClassicProgress } from './ui/classic-progress.js';
import { mountGuidedLesson } from './ui/classic-lesson-flow.js';

const app = document.getElementById('app');
const settingsRoot = document.getElementById('settings-root');
const contentService = createContentService({ basePath: './content' });
const progressStorage = createSafeProgressStorage();
const progressService = createProgressService({ storage: progressStorage });
const progressSyncService = createProgressSyncService({ progressService });

let course = null;
let routeRevision = 0;
let currentRuntime = null;

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

function refreshProgressPresentation(progress = progressService.getProgress()) {
  decorateClassicProgress(app, progress, { documentRuntime: currentRuntime });
}

function mountClassic(html, documentRuntime = null) {
  currentRuntime = documentRuntime;
  app.innerHTML = html;
  polishClassicPresentation(app, documentRuntime);
  mountGuidedLesson(app, documentRuntime, { progress: progressService.getProgress() });
  bindClassicRenderer(app, documentRuntime);
  bindClassicProgress(app, documentRuntime, { progressService, onProgress: refreshProgressPresentation });
  refreshProgressPresentation();
}

function updateNavigation(route) {
  const primary = ['home', 'plan', 'units', 'reviews', 'performance'];
  const active = ['unit', 'lesson', 'verification'].includes(route.name) ? 'units' : route.name;
  document.querySelectorAll('[data-nav-route]').forEach(link => {
    const selected = primary.includes(active) && link.dataset.navRoute === active;
    if (selected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
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

async function loadAllManifests() {
  const catalog = await ensureCourse();
  const manifests = await Promise.all(catalog.units.map(unit => loadManifest(unit.id).catch(() => null)));
  return manifests.filter(Boolean);
}

async function renderHome(revision) {
  const catalog = await ensureCourse();
  const manifests = await loadAllManifests();
  if (revision !== routeRevision) return;
  mountClassic(homeHtml(catalog, manifests, progressService.getProgress()));
}

async function renderUnitsPage(revision) {
  const manifests = await loadAllManifests();
  if (revision !== routeRevision) return;
  mountClassic(unitsPageHtml(manifests, progressService.getProgress()));
}

async function renderPlanPage(revision) {
  const manifests = await loadAllManifests();
  if (revision !== routeRevision) return;
  mountClassic(planPageHtml(manifests, progressService.getProgress()));
}

async function renderReviewsPage(revision) {
  const manifests = await loadAllManifests();
  if (revision !== routeRevision) return;
  mountClassic(reviewsPageHtml(manifests, progressService.getProgress()));
}

async function renderPerformancePage(revision) {
  const manifests = await loadAllManifests();
  if (revision !== routeRevision) return;
  mountClassic(performancePageHtml(manifests, progressService.getProgress()));
}

async function renderUnit(route, revision) {
  const manifest = await loadManifest(route.unitId);
  if (revision !== routeRevision) return;
  progressService.visitDocument({ id: manifest.id, kind: 'UNIT' }, { levelId: manifest.levelId, unitId: manifest.id });
  mountClassic(unitHtml(manifest));
}

async function renderLesson(route, revision) {
  const manifest = await loadManifest(route.unitId);
  const loaded = await contentService.loadLesson(route.unitId, route.lessonId);
  if (revision !== routeRevision) return;
  progressService.visitDocument(loaded.runtime, { levelId: manifest.levelId, unitId: manifest.id });
  mountClassic(documentHtml(loaded.runtime, { unitId: manifest.id, unitTitle: manifest.title }), loaded.runtime);
}

async function renderVerification(route, revision) {
  const manifest = await loadManifest(route.unitId);
  const loaded = await contentService.loadVerification(route.unitId);
  if (revision !== routeRevision) return;
  progressService.visitDocument(loaded.runtime, { levelId: manifest.levelId, unitId: manifest.id });
  mountClassic(documentHtml(loaded.runtime, { unitId: manifest.id, unitTitle: manifest.title, verification: true }), loaded.runtime);
}

async function renderRoute(route) {
  const revision = ++routeRevision;
  currentRuntime = null;
  updateNavigation(route);
  loadingPage(route.name === 'home' ? 'Abrindo o curso' : 'Abrindo conteúdo');
  try {
    if (route.name === 'home') return await renderHome(revision);
    if (route.name === 'plan') return await renderPlanPage(revision);
    if (route.name === 'units') return await renderUnitsPage(revision);
    if (route.name === 'reviews') return await renderReviewsPage(revision);
    if (route.name === 'performance') return await renderPerformancePage(revision);
    if (route.name === 'methodology') return mountClassic(methodologyPageHtml());
    if (route.name === 'help') return mountClassic(helpPageHtml());
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
      title: isMissing ? 'Este conteúdo não está disponível nesta versão' : 'Não foi possível abrir esta etapa',
      copy: isMissing ? 'O curso é disponibilizado progressivamente. Volte ao início para acessar as unidades disponíveis.' : 'Seu progresso não é alterado por uma falha de carregamento. Tente abrir novamente.',
      detail: error.message || 'Erro desconhecido'
    });
  }
}

function bootstrap() {
  initSettings();
  initNarration();
  progressService.subscribe(refreshProgressPresentation);
  mountSettingsMenu(settingsRoot, { progressSyncService });
  initRouter(renderRoute);
}

bootstrap();
