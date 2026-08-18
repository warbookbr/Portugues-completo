import { levelLabel, lessonStatusLabel } from './classic-ui-copy.js';

const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function pageIntro(kicker, title, copy) {
  return `<header class="overview-hero"><span class="eyebrow">${esc(kicker)}</span><h1>${esc(title)}</h1><p>${esc(copy)}</p></header>`;
}

function lessonIds(manifest) {
  return manifest.lessons.map(item => item.id);
}

function completedIn(progress, manifest) {
  return lessonIds(manifest).filter(id => progress?.curriculum?.lessons?.[id]?.status === 'CONCLUIDA').length;
}

function unitState(progress, manifest) {
  const ids = lessonIds(manifest);
  const done = completedIn(progress, manifest);
  if (done === ids.length && ids.length) return 'Concluída';
  if (ids.some(id => progress?.curriculum?.lessons?.[id])) return 'Em andamento';
  return 'Não iniciada';
}

export function unitsPageHtml(manifests = [], progress = {}) {
  return `<div class="course-view reading-content overview-page">
    ${pageIntro('Unidades', 'Unidades do curso', 'Explore o conteúdo disponível e retome qualquer unidade quando quiser.')}
    <section class="overview-list">${manifests.map(manifest => {
      const done = completedIn(progress, manifest);
      const total = manifest.lessons.length;
      const percent = total ? Math.round((done / total) * 100) : 0;
      return `<a class="overview-unit-card" href="#/unidade/${esc(manifest.id)}">
        <div><span class="block-kicker">${esc(levelLabel(manifest.levelId))} · Unidade ${manifest.order}</span><h2>${esc(manifest.title)}</h2><p>${esc(manifest.objective)}</p></div>
        <div class="overview-unit-meta"><span>${esc(unitState(progress, manifest))}</span><span>${done} de ${total} lições</span><span>${percent}%</span></div>
      </a>`;
    }).join('')}</section>
  </div>`;
}

export function planPageHtml(manifests = [], progress = {}) {
  const currentUnitId = progress?.curriculum?.current?.unitId;
  return `<div class="course-view reading-content overview-page">
    ${pageIntro('Plano de estudos', 'Seu caminho pelo curso', 'Veja a sequência disponível, seu ponto atual e o que vem depois.')}
    <section class="study-plan" aria-label="Sequência de estudos">${manifests.map((manifest, index) => {
      const state = unitState(progress, manifest);
      const current = manifest.id === currentUnitId;
      return `<article class="plan-step ${current ? 'is-current' : ''}">
        <div class="plan-step-index">${index + 1}</div>
        <div><span class="block-kicker">${esc(levelLabel(manifest.levelId))} · Unidade ${manifest.order}</span><h2>${esc(manifest.title)}</h2><p>${esc(manifest.objective)}</p><div class="plan-step-status">${current ? 'Você está aqui · ' : ''}${esc(state)}</div></div>
        <a class="secondary-button inline-action" href="#/unidade/${esc(manifest.id)}">${state === 'Não iniciada' ? 'Começar' : 'Abrir'} <span aria-hidden="true">→</span></a>
      </article>`;
    }).join('')}</section>
  </div>`;
}

function findLesson(manifests, documentId) {
  for (const manifest of manifests) {
    const lesson = manifest.lessons.find(item => item.id === documentId);
    if (lesson) return { manifest, lesson };
  }
  return null;
}

export function reviewsPageHtml(manifests = [], progress = {}) {
  const queue = progress?.review?.queue || [];
  return `<div class="course-view reading-content overview-page">
    ${pageIntro('Revisões', 'Revisões recomendadas', 'Revisões aparecem quando uma nova tentativa pode fortalecer uma habilidade.')}
    <section class="overview-panel">${queue.length ? queue.map(item => {
      const documentId = String(item.sourceEvidenceRef || '').split('/')[0];
      const found = findLesson(manifests, documentId);
      const title = found?.lesson?.title || 'Conteúdo estudado recentemente';
      const href = found ? `#/unidade/${esc(found.manifest.id)}/licao/${esc(found.lesson.id)}` : '#/unidades';
      return `<article class="review-row"><div><span class="block-kicker">Revisão recomendada</span><h2>${esc(title)}</h2><p>Vale refazer a atividade relacionada e observar o feedback da nova tentativa.</p></div><a class="secondary-button inline-action" href="${href}">Revisar <span aria-hidden="true">→</span></a></article>`;
    }).join('') : '<div class="empty-state"><h2>Nenhuma revisão pendente</h2><p>Quando alguma habilidade precisar de uma nova tentativa, ela aparecerá aqui.</p></div>'}</section>
  </div>`;
}

export function performancePageHtml(manifests = [], progress = {}) {
  const lessons = Object.values(progress?.curriculum?.lessons || {});
  const total = manifests.reduce((sum, manifest) => sum + manifest.lessons.length, 0);
  const completed = lessons.filter(item => item.status === 'CONCLUIDA').length;
  const studying = lessons.filter(item => item.status === 'EM_ESTUDO').length;
  const pending = Object.values(progress?.evidence || {}).filter(item => item.status === 'VALIDACAO_PENDENTE').length;
  const demonstrated = Object.values(progress?.competencies || {}).filter(item => ['DEMONSTRADA', 'CONSOLIDADA'].includes(item.status)).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return `<div class="course-view reading-content overview-page">
    ${pageIntro('Desempenho', 'Seu progresso de aprendizagem', 'Acompanhe percurso, evidências e pontos que ainda merecem atenção.')}
    <section class="performance-grid">
      <article><strong>${percent}%</strong><span>do curso disponível concluído</span></article>
      <article><strong>${completed}</strong><span>lições concluídas</span></article>
      <article><strong>${studying}</strong><span>lições em estudo</span></article>
      <article><strong>${pending}</strong><span>evidências aguardando avaliação</span></article>
      <article><strong>${demonstrated}</strong><span>competências demonstradas ou consolidadas</span></article>
      <article><strong>${progress?.review?.queue?.length || 0}</strong><span>revisões recomendadas</span></article>
    </section>
    <p class="overview-note">Conclusão de lição, demonstração de competência e revisão são informações diferentes. O curso mantém esses estados separados para representar seu aprendizado com mais precisão.</p>
  </div>`;
}

export function methodologyPageHtml() {
  return `<div class="course-view reading-content overview-page informational-page">
    ${pageIntro('Sobre o curso', 'Como o Português Completo ensina', 'O curso combina explicação clara, prática, evidências de aprendizagem e revisão orientada por necessidade.')}
    <section class="overview-panel prose-panel">
      <h2>Aprender, praticar e demonstrar</h2><p>Você pode percorrer uma lição, praticar uma habilidade e demonstrar domínio em momentos diferentes. Por isso, o curso não trata simplesmente “terminar uma tela” como prova automática de aprendizagem.</p>
      <h2>Feedback e revisão</h2><p>Atividades objetivas podem oferecer correção imediata. Produções abertas podem permanecer aguardando avaliação. Quando uma dificuldade merece nova tentativa, o curso recomenda revisão sem apagar progresso válido.</p>
      <h2>Modo Clássico</h2><p>O Modo Clássico prioriza conteúdo, clareza e continuidade. Não usa XP, missões ou recompensas de jogo para representar domínio pedagógico.</p>
    </section>
    <a class="secondary-button inline-action" href="#/ajuda"><span aria-hidden="true">←</span> Voltar para Ajuda</a>
  </div>`;
}

export function helpPageHtml() {
  return `<div class="course-view reading-content overview-page informational-page">
    ${pageIntro('Ajuda', 'Como podemos orientar você?', 'Encontre rapidamente os caminhos principais da aplicação.')}
    <section class="help-grid">
      <a href="#/" class="help-card"><h2>Continuar estudando</h2><p>Volte ao início para retomar do ponto em que parou.</p></a>
      <a href="#/plano" class="help-card"><h2>Plano de estudos</h2><p>Veja sua posição no percurso e as unidades disponíveis.</p></a>
      <a href="#/revisoes" class="help-card"><h2>Revisões</h2><p>Consulte atividades recomendadas para uma nova tentativa.</p></a>
      <a href="#/metodologia" class="help-card"><h2>Como o curso funciona</h2><p>Entenda como explicações, prática, evidências de aprendizagem e revisões se organizam.</p></a>
      <div class="help-card"><h2>Configurações</h2><p>Use o botão de configurações no topo para ajustar áudio, aparência e sincronização de progresso.</p></div>
    </section>
  </div>`;
}
