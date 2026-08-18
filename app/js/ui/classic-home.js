import { levelLabel } from './classic-ui-copy.js';

const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function completedLessons(progress, lessonIds) {
  return lessonIds.filter(id => progress?.curriculum?.lessons?.[id]?.status === 'CONCLUIDA').length;
}

function currentStudyCard(manifests, progress) {
  const current = progress?.curriculum?.current || {};
  const manifest = manifests.find(item => item.id === current.unitId) || manifests[0];
  if (!manifest) return '';
  const lessonIds = manifest.lessons.map(item => item.id);
  const done = completedLessons(progress, lessonIds);
  const total = lessonIds.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const lesson = manifest.lessons.find(item => item.id === current.lessonId);
  const hasCurrent = Boolean(current.unitId);
  const href = lesson ? `#/unidade/${encodeURIComponent(manifest.id)}/licao/${encodeURIComponent(lesson.id)}` : `#/unidade/${encodeURIComponent(manifest.id)}`;
  const position = lesson ? `Lição ${lesson.order} de ${total}` : `${done} de ${total} lições concluídas`;
  const action = hasCurrent ? 'Continuar de onde parou' : 'Começar a estudar';

  return `<section class="dashboard-card continue-card" data-current-study data-unit-id="${esc(manifest.id)}" data-lesson-ids="${esc(lessonIds.join(','))}">
    <div class="dashboard-section-heading"><h2>${hasCurrent ? 'Continue estudando' : 'Comece por aqui'}</h2></div>
    <div class="course-context"><span class="context-pill">${esc(levelLabel(manifest.levelId))}</span><span aria-hidden="true">•</span><span>Unidade ${manifest.order}</span></div>
    <h3>${esc(manifest.title)}</h3>
    <p class="continue-position">${esc(position)}</p>
    <div class="progress-line" aria-label="${percent}% desta unidade concluída"><span style="width:${percent}%"></span></div>
    <div class="continue-footer"><span data-current-unit-progress>${percent}%</span><a class="primary-button inline-action" data-continue-link href="${esc(href)}">${action} <span aria-hidden="true">→</span></a></div>
  </section>`;
}

function progressCard(manifests, progress) {
  const total = manifests.reduce((sum, manifest) => sum + manifest.lessons.length, 0);
  const allLessonIds = manifests.flatMap(manifest => manifest.lessons.map(item => item.id));
  const completed = completedLessons(progress, allLessonIds);
  const review = progress?.review?.queue?.length || 0;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return `<section class="dashboard-card progress-summary" aria-labelledby="progress-title">
    <div class="dashboard-section-heading"><h2 id="progress-title">Seu progresso</h2></div>
    <div class="progress-metrics">
      <article><div class="progress-ring" style="--progress-value:${percent}" aria-hidden="true"></div><strong data-progress-percent>${percent}%</strong><span>do curso disponível</span></article>
      <article><div class="metric-icon metric-success" aria-hidden="true">✓</div><strong data-progress-completed>${completed}</strong><span>lições concluídas</span></article>
      <article><div class="metric-icon metric-review" aria-hidden="true">↻</div><strong data-progress-review>${review}</strong><span>revisões recomendadas</span></article>
    </div>
  </section>`;
}

function unitsPreview(manifests, progress) {
  const rows = manifests.slice(0, 3).map(manifest => {
    const lessonIds = manifest.lessons.map(item => item.id);
    const done = completedLessons(progress, lessonIds);
    const total = lessonIds.length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return `<a class="dashboard-unit-row" data-dashboard-unit data-unit-id="${esc(manifest.id)}" data-lesson-ids="${esc(lessonIds.join(','))}" href="#/unidade/${esc(manifest.id)}">
      <span class="unit-index" aria-hidden="true">${manifest.order}</span>
      <span class="unit-copy"><strong>${esc(manifest.title)}</strong><small>${esc(levelLabel(manifest.levelId))} · Unidade ${manifest.order}</small></span>
      <span class="unit-progress"><span class="progress-line"><span data-unit-progress-bar style="width:${percent}%"></span></span><small data-unit-progress-copy>${done} de ${total} lições</small></span>
      <span class="row-arrow" aria-hidden="true">›</span>
    </a>`;
  }).join('');

  return `<section class="dashboard-card units-preview">
    <div class="dashboard-section-heading"><h2>Unidades do curso</h2></div>
    <div class="dashboard-unit-list">${rows}</div>
    <a class="text-link units-all-link" href="#/unidades">Ver todas as unidades <span aria-hidden="true">→</span></a>
  </section>`;
}

export function homeHtml(_course, manifests = [], progress = {}) {
  const totalLessons = manifests.reduce((sum, manifest) => sum + manifest.lessons.length, 0);

  return `<div class="dashboard-home reading-content" data-home-total-lessons="${totalLessons}">
    <div class="dashboard-grid">
      ${currentStudyCard(manifests, progress)}
      ${progressCard(manifests, progress)}
    </div>
    ${unitsPreview(manifests, progress)}
  </div>`;
}
