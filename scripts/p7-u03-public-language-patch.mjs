import fs from 'node:fs';

function replaceOnce(file, before, after) {
  let source = fs.readFileSync(file, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado encontrado ${count} vez(es).`);
  source = source.replace(before, after);
  fs.writeFileSync(file, source);
}

replaceOnce('app/js/ui/classic-renderer.js',
`  ['word', 'Palavra'], ['words', 'Palavras'], ['segments', 'Partes'], ['tiles', 'Fichas'],
  ['examples', 'Exemplos'], ['explanation', 'Explicação'], ['stages', 'Etapas'],
  ['display', 'Forma'], ['description', 'Descrição'], ['knownPartSources', 'Partes já conhecidas'],
  ['nonVisualMeaning', 'Significado'], ['contrast', 'Comparação'], ['contrasts', 'Comparações']
`,
`  ['word', 'Palavra'], ['words', 'Palavras'], ['segments', 'Partes'], ['tiles', 'Fichas'],
  ['example', 'Exemplo'], ['examples', 'Exemplos'], ['possibleResponses', 'Exemplos possíveis'],
  ['explanation', 'Explicação'], ['stages', 'Etapas'], ['stage', 'Etapa'],
  ['display', 'Forma'], ['description', 'Descrição'], ['knownPartSources', 'Partes já conhecidas'],
  ['nonVisualMeaning', 'Significado'], ['contrast', 'Comparação'], ['contrasts', 'Comparações'],
  ['goal', 'Objetivo da mensagem'], ['candidate', 'Frase para revisar'], ['questions', 'Perguntas'],
  ['text', 'Pergunta'], ['options', 'Opções'], ['firstDraft', 'Primeira versão'],
  ['selfCheck', 'Autochecagem'], ['revisedDraft', 'Versão revisada'],
  ['reviewPrompts', 'Perguntas para revisar'], ['starter', 'Início sugerido'],
  ['optionalWordBank', 'Palavras de apoio'], ['wordBank', 'Palavras de apoio'],
  ['optionalScaffold', 'Apoio opcional'], ['note', 'Observação']
`);

replaceOnce('app/js/ui/classic-renderer.js',
`    'responseMode', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices', 'starter', 'wordBank'
`,
`    'responseMode', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices',
    'purpose', 'revealPolicy'
`);

replaceOnce('scripts/capture-p7-u03-visuals.sh',
`if grep -Eiq 'correctIndexes|acceptedSequences|acceptedResult|correctFunction|correctGroup|correctAnswer|answerKey|schemaVersion|evidenceRole|notAutomaticallyJudged|automaticObservations' <<<"$UNIT_DOM$L03_DOM$L10_DOM$V01_DOM"; then
  echo 'P7 U03: metadado técnico vazou para a interface do aluno.' >&2
  exit 1
fi
`,
`if grep -Eiq 'correctIndexes|acceptedSequences|acceptedResult|correctFunction|correctGroup|correctAnswer|answerKey|schemaVersion|evidenceRole|notAutomaticallyJudged|automaticObservations' <<<"$UNIT_DOM$L03_DOM$L10_DOM$V01_DOM"; then
  echo 'P7 U03: metadado técnico vazou para a interface do aluno.' >&2
  exit 1
fi

if grep -Eiq '>(example|goal|candidate|questions|purpose|first draft|self check|revised draft|optional word bank)<' <<<"$L10_DOM$V01_DOM"; then
  echo 'P7 U03: chave autoral crua em inglês vazou para a linguagem pública.' >&2
  exit 1
fi
`);

console.log('P7/U03: linguagem pública do fallback autoral corrigida e protegida pelo smoke.');
