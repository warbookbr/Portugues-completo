const MAX_CONTENT_BLOCKS_BEFORE_ACTIVITY = 2;

function pedagogicalType(block) {
  return String(block?.pedagogicalType || '').toLocaleLowerCase('pt-BR');
}

function stepLabel(blocks, verification = false) {
  const types = blocks.map(pedagogicalType);
  const hasActivity = blocks.some(block => block?.kind === 'ACTIVITY');

  if (types.some(type => type === 'summary')) return verification ? 'Revise' : 'Consolide';
  if (hasActivity) return verification ? 'Responda' : 'Pratique';
  if (types.some(type => ['demonstration', 'paired-example', 'authored-literary-text', 'authored-poem', 'authored-prose'].includes(type))) return 'Observe';
  if (types.some(type => ['explanation', 'formal-reconfiguration', 'competing-interpretations', 'new-evidence'].includes(type))) return 'Entenda';
  if (types.some(type => type === 'objective')) return 'Comece';
  return verification ? 'Prepare-se' : 'Aprenda';
}

function pushContentChunks(groups, pending, keep = 0) {
  while (pending.length > keep) {
    const take = Math.min(MAX_CONTENT_BLOCKS_BEFORE_ACTIVITY, pending.length - keep);
    groups.push(pending.splice(0, take));
  }
}

export function buildLessonStepGroups(blocks = []) {
  const groups = [];
  const pending = [];

  for (const block of blocks) {
    if (block?.kind === 'ACTIVITY') {
      if (pending.length > MAX_CONTENT_BLOCKS_BEFORE_ACTIVITY) {
        pushContentChunks(groups, pending, MAX_CONTENT_BLOCKS_BEFORE_ACTIVITY);
      }
      groups.push([...pending.splice(0), block]);
      continue;
    }
    pending.push(block);
  }

  pushContentChunks(groups, pending, 0);
  return groups.filter(group => group.length);
}

function storageKey(documentId) {
  return `portugues-completo:lesson-step:${documentId}`;
}

function rememberedStep(documentId, total) {
  try {
    const value = Number(sessionStorage.getItem(storageKey(documentId)) || 0);
    return Number.isInteger(value) ? Math.min(Math.max(value, 0), Math.max(total - 1, 0)) : 0;
  } catch {
    return 0;
  }
}

function rememberStep(documentId, index) {
  try { sessionStorage.setItem(storageKey(documentId), String(index)); } catch { /* estado visual opcional */ }
}

function replaceBreadcrumb(root) {
  const breadcrumbs = root.querySelector('.breadcrumbs');
  const unitLink = breadcrumbs?.querySelector('a[href*="#/unidade/"]');
  if (!breadcrumbs || !unitLink) return;

  const back = document.createElement('a');
  back.className = 'lesson-back-link';
  back.href = unitLink.getAttribute('href');
  back.setAttribute('aria-label', `Voltar para ${unitLink.textContent?.trim() || 'a unidade'}`);
  back.innerHTML = '<span aria-hidden="true">←</span><span>Voltar para a unidade</span>';
  breadcrumbs.replaceWith(back);
}

function simplifyBlockChrome(step) {
  step.querySelectorAll('.content-card > .block-kicker').forEach(label => label.remove());
  step.querySelectorAll('.activity-mode').forEach(label => label.remove());
  step.querySelectorAll('.activity-badge:not(.is-required)').forEach(label => label.remove());
  step.querySelectorAll('.activity-badge.is-required').forEach(label => { label.textContent = 'Necessária para concluir'; });
  step.querySelectorAll('.activity-card .block-kicker').forEach(label => label.remove());
  step.querySelectorAll('.block-header').forEach(header => {
    if (!header.textContent?.trim()) header.remove();
  });
}

function makeStep(group, index, total, verification) {
  const step = document.createElement('section');
  step.className = 'lesson-step-panel';
  step.dataset.lessonStep = String(index);
  step.hidden = index !== 0;

  const headingId = `lesson-step-heading-${index + 1}`;
  step.setAttribute('aria-labelledby', headingId);

  const header = document.createElement('header');
  header.className = 'lesson-step-header';
  header.innerHTML = `
    <div class="lesson-step-heading-copy">
      <span class="lesson-step-counter">Etapa ${index + 1} de ${total}</span>
      <h2 id="${headingId}" tabindex="-1">${stepLabel(group, verification)}</h2>
    </div>
    <div class="lesson-step-progress" role="progressbar" aria-label="Progresso nesta lição" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${index + 1}">
      <span style="width:${Math.round(((index + 1) / total) * 100)}%"></span>
    </div>`;

  const body = document.createElement('div');
  body.className = 'lesson-step-body';
  for (const block of group) {
    const node = document.getElementById(block.id);
    if (node) body.append(node);
  }

  const nav = document.createElement('nav');
  nav.className = 'lesson-step-navigation';
  nav.setAttribute('aria-label', 'Navegação entre etapas da lição');
  if (index > 0) nav.insertAdjacentHTML('beforeend', '<button class="secondary-button" type="button" data-lesson-step-back><span aria-hidden="true">←</span> Voltar</button>');
  if (index < total - 1) nav.insertAdjacentHTML('beforeend', '<button class="primary-button" type="button" data-lesson-step-next>Avançar <span aria-hidden="true">→</span></button>');

  step.append(header, body, nav);
  simplifyBlockChrome(step);
  return step;
}

export function mountGuidedLesson(root, documentRuntime = null) {
  if (!documentRuntime) return;
  const stream = root.querySelector('.lesson-stream');
  if (!stream || stream.dataset.guidedLesson === 'true') return;

  replaceBreadcrumb(root);

  const groups = buildLessonStepGroups(documentRuntime.blocks || []);
  if (!groups.length) return;

  const originalNodes = new Map([...stream.querySelectorAll('.lesson-block[id]')].map(node => [node.id, node]));
  // makeStep resolves ids through document.getElementById; keep nodes attached until each step consumes them.
  const flow = document.createElement('div');
  flow.className = 'lesson-flow';
  flow.dataset.lessonFlow = '';
  flow.dataset.documentId = documentRuntime.id;
  stream.dataset.guidedLesson = 'true';

  const verification = documentRuntime.kind === 'VERIFICATION';
  groups.forEach((group, index) => flow.append(makeStep(group, index, groups.length, verification)));
  stream.replaceChildren(flow);

  // Defensive guard: if a future renderer changes ids, restore any unmatched rendered block rather than losing content.
  const consumedIds = new Set(groups.flat().map(block => block.id));
  for (const [id, node] of originalNodes) {
    if (!consumedIds.has(id)) flow.append(node);
  }

  const steps = [...flow.querySelectorAll('[data-lesson-step]')];
  const completion = root.querySelector('.completion-card');
  let current = rememberedStep(documentRuntime.id, steps.length);
  const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function show(index, { focus = true } = {}) {
    current = Math.min(Math.max(index, 0), steps.length - 1);
    steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== current; });
    if (completion) completion.hidden = current !== steps.length - 1;
    rememberStep(documentRuntime.id, current);

    const active = steps[current];
    if (!active || !focus) return;
    active.classList.remove('is-entering');
    void active.offsetWidth;
    active.classList.add('is-entering');
    active.querySelector('.lesson-step-header h2')?.focus({ preventScroll: true });
    active.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  flow.addEventListener('click', event => {
    if (event.target.closest('[data-lesson-step-next]')) show(current + 1);
    if (event.target.closest('[data-lesson-step-back]')) show(current - 1);
  });

  show(current, { focus: false });
}