import { initRouter } from './core/router.js';
import { initNarration } from './services/narration-service.js';
import { initSettings } from './services/settings-service.js';
import { mountSettingsMenu } from './ui/settings-menu.js';

const app = document.getElementById('app');
const settingsRoot = document.getElementById('settings-root');

let course = {
  title: 'Português Completo',
  description: 'Plataforma de ensino de português do nível zero ao domínio completo.',
  units: []
};

async function loadCourse() {
  try {
    const response = await fetch('./content/course.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    course = await response.json();
  } catch (error) {
    console.warn('Não foi possível carregar o catálogo do curso.', error);
  }
}

function pageCard({ eyebrow, title, copy, status }) {
  return `
    <section class="page-card reading-content">
      <span class="eyebrow">${eyebrow}</span>
      <h1>${title}</h1>
      <p class="hero-copy">${copy}</p>
      <div class="status-card">${status}</div>
    </section>
  `;
}

function renderRoute(route) {
  if (route.name === 'home') {
    app.innerHTML = pageCard({
      eyebrow: 'Base do projeto',
      title: course.title,
      copy: course.description,
      status: 'Estrutura modular ativa · configurações separadas · conteúdo carregado por JSON'
    });
    return;
  }

  if (route.name === 'unit') {
    app.innerHTML = pageCard({
      eyebrow: `Unidade ${route.unitId}`,
      title: 'Unidade ainda não publicada',
      copy: 'O roteamento já está funcionando. O conteúdo real das unidades será conectado nesta camada.',
      status: `Rota: #/unidade/${route.unitId}`
    });
    return;
  }

  if (route.name === 'lesson') {
    app.innerHTML = pageCard({
      eyebrow: `Unidade ${route.unitId} · Lição ${route.lessonId}`,
      title: 'Lição ainda não publicada',
      copy: 'A aplicação já consegue representar uma lição por URL sem depender de múltiplos arquivos HTML.',
      status: `Rota: #/unidade/${route.unitId}/licao/${route.lessonId}`
    });
    return;
  }

  app.innerHTML = pageCard({
    eyebrow: '404',
    title: 'Página não encontrada',
    copy: 'Esta rota não existe no Português Completo.',
    status: 'Use #/ para voltar ao início.'
  });
}

async function bootstrap() {
  initSettings();
  initNarration();
  mountSettingsMenu(settingsRoot);
  await loadCourse();
  initRouter(renderRoute);
}

bootstrap();
