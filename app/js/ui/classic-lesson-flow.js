const MAX_CONTENT_BLOCKS_BEFORE_ACTIVITY = 2;
const LESSON_UI_STATE_VERSION = 1;

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

function legacyStepStorageKey(documentId) {
  return `portugues-completo:lesson-step:${documentId}`;
}

function lessonUiStorageKey(documentId) {
  return `portugues-completo:lesson-ui:v${LESSON_UI_STATE_VERSION}:${documentId}`;
}

function clampStep(value, total) {
  const numeric = Number(value);
  if (!Number.isInteger(numeric)) return 0;
  return Math.min(Math.max(numeric, 0), Math.max(total - 1, 0));
}

function rememberedLegacyStep(documentId, total) {
  try {
    return clampStep(sessionStorage.getItem(legacyStepStorageKey(documentId)) || 0, total);
  } catch {
    return 0;
  }
}

function rememberLegacyStep(documentId, index) {
  try { sessionStorage.setItem(legacyStepStorageKey(documentId), String(index)); } catch { /* estado visual opcional */ }
}

function readLessonUiState(documentId, total) {
  try {
    const raw = localStorage.getItem(lessonUiStorageKey(documentId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== LESSON_UI_STATE_VERSION || parsed.started !== true) return null;
    return { started: true, step: clampStep(parsed.step, total) };
  } catch {
    return null;
  }
}

function writeLessonUiState(documentId, step) {
  try {
    localStorage.setItem(lessonUiStorageKey(documentId), JSON.stringify({
      version: LESSON_UI_STATE_VERSION,
      started: true,
      step
    }));
  } catch { /* estado visual opcional; progresso pedagógico não depende disto */ }
}

export function lessonHasStudyHistory(progress, documentId) {
  if (!progress || !documentId) return false;
  if (progress.curriculum?.lessons?.[documentId]) return true;
  const prefix = `${documentId}/`;
  if (Object.keys(progress.evidence || {}).some(ref => ref.startsWith(prefix))) return true;
  if (Object.keys(progress.responses || {}).some(ref => ref.startsWith(prefix))) return true;
  return false;
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

function ensureLessonIntro(root, documentRuntime) {
  if (documentRuntime?.kind !== 'LESSON') return null;
  const hero = root.querySelector('.lesson-hero');
  if (!hero) return null;

  hero.classList.add('lesson-intro');
  hero.dataset.lessonIntro = '';
  const heading = hero.querySelector('h1');
  if (heading) heading.tabIndex = -1;

  let actions = hero.querySelector('.lesson-intro-actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'lesson-intro-actions';
    actions.innerHTML = '<button class="primary-button" type="button" data-lesson-start>Começar lição</button>';
    hero.append(actions);
  }

  return { hero, heading, startButton: actions.querySelector('[data-lesson-start]') };
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

export function mountGuidedLesson(root, documentRuntime = null, { progress = null } = {}) {
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
  flow.setAttribute('aria-label', documentRuntime.kind === 'LESSON' ? `Conteúdo da lição ${documentRuntime.title}` : `Conteúdo da verificação ${documentRuntime.title}`);
  stream.dataset.guidedLesson = 'true';

  const verification = documentRuntime.kind !== 'LESSON';
  groups.forEach((group, index) => flow.append(makeStep(group, index, groups.length, verification)));
  stream.replaceChildren(flow);

  // Defensive guard: if a future renderer changes ids, restore any unmatched rendered block rather than losing content.
  const consumedIds = new Set(groups.flat().map(block => block.id));
  for (const [id, node] of originalNodes) {
    if (!consumedIds.has(id)) flow.append(node);
  }

  const steps = [...flow.querySelectorAll('[data-lesson-step]')];
  const completion = root.querySelector('.completion-card');
  const intro = ensureLessonIntro(root, documentRuntime);
  const storedUiState = documentRuntime.kind === 'LESSON' ? readLessonUiState(documentRuntime.id, steps.length) : null;
  let started = documentRuntime.kind !== 'LESSON' || Boolean(storedUiState?.started) || lessonHasStudyHistory(progress, documentRuntime.id);
  let current = started
    ? (storedUiState?.step ?? rememberedLegacyStep(documentRuntime.id, steps.length))
    : 0;
  const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function rememberCurrentStep() {
    rememberLegacyStep(documentRuntime.id, current);
    if (documentRuntime.kind === 'LESSON' && started) writeLessonUiState(documentRuntime.id, current);
  }

  function show(index, { focus = true } = {}) {
    current = clampStep(index, steps.length);
    stream.hidden = false;
    if (intro?.hero) intro.hero.hidden = true;
    steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== current; });
    if (completion) completion.hidden = current !== steps.length - 1;
    rememberCurrentStep();

    const active = steps[current];
    if (!active || !focus) return;
    active.classList.remove('is-entering');
    void active.offsetWidth;
    active.classList.add('is-entering');
    active.querySelector('.lesson-step-header h2')?.focus({ preventScroll: true });
    active.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function showIntro({ focus = true } = {}) {
    stream.hidden = true;
    if (completion) completion.hidden = true;
    if (intro?.hero) intro.hero.hidden = false;
    if (focus) intro?.heading?.focus({ preventScroll: true });
  }

  flow.addEventListener('click', event => {
    if (event.target.closest('[data-lesson-step-next]')) show(current + 1);
    if (event.target.closest('[data-lesson-step-back]')) show(current - 1);
  });

  intro?.startButton?.addEventListener('click', () => {
    started = true;
    current = 0;
    show(0);
  });

  if (started) show(current, { focus: false });
  else showIntro({ focus: true });
}
