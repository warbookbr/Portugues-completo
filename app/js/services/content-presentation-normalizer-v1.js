export const SAFE_LESSON_INTRO_V1 = 'Nesta lição, você vai estudar o conteúdo passo a passo.';

function authoredStudentObjective(source) {
  if (typeof source?.studentObjective !== 'string') return null;
  const value = source.studentObjective.trim();
  return value || null;
}

export function normalizeStudentPresentationV1(source, runtime) {
  if (!runtime || runtime.kind !== 'LESSON') return runtime;

  const authoredIntro = authoredStudentObjective(source);
  return {
    ...runtime,
    presentation: {
      intro: authoredIntro || SAFE_LESSON_INTRO_V1,
      introSource: authoredIntro ? 'AUTHORED' : 'SAFE_FALLBACK'
    }
  };
}
