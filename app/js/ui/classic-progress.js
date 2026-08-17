const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const evidenceLabel = status => ({
  PRATICADA: 'Praticada',
  DEMONSTRADA: 'Demonstrada',
  VALIDACAO_PENDENTE: 'Validação pendente',
  REVISAO_RECOMENDADA: 'Revisão recomendada'
}[status] || '');

function summary(progress) {
  const lessons = Object.values(progress?.curriculum?.lessons || {});
  const evidence = Object.values(progress?.evidence || {});
  return {
    completed: lessons.filter(item => item.status === 'CONCLUIDA').length,
    studying: lessons.filter(item => item.status === 'EM_ESTUDO').length,
    pending: evidence.filter(item => item.status === 'VALIDACAO_PENDENTE').length,
    review: progress?.review?.queue?.length || 0
  };
}

function currentHref(progress) {
  const current = progress?.curriculum?.current || {};
  if (current.unitId && current.lessonId) return `#/unidade/${encodeURIComponent(current.unitId)}/licao/${encodeURIComponent(current.lessonId)}`;
  if (current.unitId) return `#/unidade/${encodeURIComponent(current.unitId)}`;
  return null;
}

function decorateHome(root, progress) {
  const hero = root.querySelector('.home-hero');
  if (!hero) return;
  root.querySelector('.progress-overview')?.remove();
  const data = summary(progress);
  const href = currentHref(progress);
  const panel = document.createElement('section');
  panel.className = 'progress-overview';
  panel.innerHTML = `
    <div><span class="block-kicker">Seu progresso</span><h2>${data.completed ? `${data.completed} ${data.completed === 1 ? 'lição concluída' : 'lições concluídas'}` : 'Seu percurso começa aqui'}</h2>
    <p>${data.pending ? `${data.pending} evidência(s) aguardando validação. ` : ''}${data.review ? `${data.review} revisão(ões) recomendada(s).` : 'Você pode estudar sem metas de jogo ou XP.'}</p></div>
    ${href ? `<a class="primary-button inline-link" href="${esc(href)}">Continuar estudando</a>` : ''}`;
  hero.insertAdjacentElement('afterend', panel);
}

function decorateUnit(root, progress) {
  root.querySelectorAll('.lesson-link').forEach(link => {
    const match = link.getAttribute('href')?.match(/\/licao\/([^#/?]+)/);
    const id = match ? decodeURIComponent(match[1]) : null;
    const status = id ? progress?.curriculum?.lessons?.[id]?.status : null;
    link.querySelector('.lesson-progress-label')?.remove();
    if (!status) return;
    const label = document.createElement('small');
    label.className = `lesson-progress-label status-${status.toLowerCase()}`;
    label.textContent = status === 'CONCLUIDA' ? 'Concluída' : status === 'EM_ESTUDO' ? 'Em estudo' : 'Não iniciada';
    link.querySelector('span:nth-child(2)')?.append(label);
  });

  const verification = root.querySelector('.verification-link');
  const unitId = root.querySelector('[data-unit-id]')?.dataset.unitId;
  if (verification && unitId) {
    const verificationId = Object.keys(progress?.curriculum?.verifications || {}).find(id => id.startsWith(`${unitId}-V`));
    const state = verificationId ? progress.curriculum.verifications[verificationId] : null;
    if (state) {
      verification.querySelector('.lesson-progress-label')?.remove();
      const label = document.createElement('small');
      label.className = 'lesson-progress-label';
      label.textContent = state.status === 'CONCLUIDA' ? 'Concluída' : 'Em estudo';
      verification.querySelector('span:first-child')?.append(label);
    }
  }
}

function decorateDocument(root, progress, documentRuntime) {
  if (!documentRuntime) return;
  const hero = root.querySelector('.lesson-hero');
  const state = documentRuntime.kind === 'LESSON'
    ? progress?.curriculum?.lessons?.[documentRuntime.id]
    : progress?.curriculum?.verifications?.[documentRuntime.id];
  hero?.querySelector('.document-progress-state')?.remove();
  if (hero && state) {
    const badge = document.createElement('div');
    badge.className = 'document-progress-state';
    badge.textContent = state.status === 'CONCLUIDA' ? 'Etapa concluída' : 'Em estudo';
    hero.append(badge);
  }

  root.querySelectorAll('[data-activity-id]').forEach(card => {
    const ref = `${documentRuntime.id}/${card.dataset.activityId}`;
    const evidence = progress?.evidence?.[ref];
    card.querySelector('.activity-progress-state')?.remove();
    if (!evidence) return;
    const status = document.createElement('div');
    status.className = `activity-progress-state evidence-${evidence.status.toLowerCase()}`;
    status.textContent = `${evidenceLabel(evidence.status)} · ${evidence.attemptCount} ${evidence.attemptCount === 1 ? 'tentativa' : 'tentativas'}`;
    card.querySelector('.activity-actions')?.insertAdjacentElement('beforebegin', status);
  });

  const completion = root.querySelector('.completion-card');
  if (completion && state) {
    const pending = Object.entries(progress?.evidence || {}).filter(([ref, item]) => ref.startsWith(`${documentRuntime.id}/`) && item.status === 'VALIDACAO_PENDENTE').length;
    completion.innerHTML = state.status === 'CONCLUIDA'
      ? `<h2>Etapa concluída</h2><p>Os requisitos de percurso desta etapa foram registrados.${pending ? ` ${pending} evidência(s) continuam aguardando validação; isso não foi convertido em domínio automático.` : ''}</p>`
      : '<h2>Conclusão desta etapa</h2><p>Continue pelas atividades marcadas como evidência necessária. Erros podem gerar revisão e nova tentativa sem apagar progresso válido.</p>';
  }
}

export function decorateClassicProgress(root, progress, { documentRuntime = null } = {}) {
  decorateHome(root, progress);
  decorateUnit(root, progress);
  decorateDocument(root, progress, documentRuntime);
}
