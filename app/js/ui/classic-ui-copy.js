const LEVEL_LABELS = Object.freeze({
  N0: 'Fundamentos',
  N1: 'Básico',
  N2: 'Intermediário',
  N3: 'Avançado',
  N4: 'Domínio'
});

export function levelLabel(levelId) {
  return LEVEL_LABELS[levelId] || 'Percurso';
}

export function lessonStatusLabel(status) {
  if (status === 'CONCLUIDA') return 'Concluída';
  if (status === 'EM_ESTUDO') return 'Em estudo';
  return 'Não iniciada';
}
