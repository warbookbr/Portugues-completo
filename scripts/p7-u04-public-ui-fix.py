from pathlib import Path


def replace_once(file, before, after):
    path = Path(file)
    text = path.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es)')
    path.write_text(text.replace(before, after, 1))

# 1. Traduz campos pedagógicos legítimos e evita exibir metadados autorais/técnicos.
replace_once(
    'app/js/ui/classic-renderer.js',
    """  ['goal', 'Objetivo da mensagem'], ['candidate', 'Frase para revisar'], ['questions', 'Perguntas'],
  ['text', 'Pergunta'], ['options', 'Opções'], ['firstDraft', 'Primeira versão'],
""",
    """  ['goal', 'Objetivo da mensagem'], ['candidate', 'Frase para revisar'], ['questions', 'Perguntas'],
  ['question', 'Pergunta'], ['wrongConclusion', 'Conclusão incorreta'],
  ['orderedEvents', 'Ordem dos acontecimentos'], ['firstInterpretation', 'Primeira interpretação'],
  ['revisedInterpretation', 'Interpretação revisada'], ['firstAnswer', 'Primeira resposta'],
  ['situation', 'Situação'], ['central', 'Ideia central'], ['detail', 'Detalhe'],
  ['text', 'Pergunta'], ['options', 'Opções'], ['firstDraft', 'Primeira versão'],
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """    'responseMode', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices',
    'purpose', 'revealPolicy', 'followUp', 'evidenceOptions', 'evidenceSelectionMode'
""",
    """    'responseMode', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices',
    'purpose', 'revealPolicy', 'followUp', 'evidenceOptions', 'evidenceSelectionMode', 'evidenceMatchMode',
    'cards', 'textRemainsVisible', 'textRef', 'competency'
"""
)

# 2. Nunca usar objective técnico como copy pública de uma verificação.
replace_once(
    'app/js/ui/classic-renderer.js',
    """export function documentHtml(document, { unitId, unitTitle, verification = false } = {}) {
  const kindLabel = verification ? 'Verificação da unidade' : 'Lição';
""",
    """const SAFE_VERIFICATION_INTRO = 'Nesta verificação, você vai usar o que estudou nesta unidade em novas atividades. Leia com atenção e volte ao texto sempre que precisar.';
const SAFE_LESSON_INTRO = 'Nesta lição, você vai estudar o conteúdo passo a passo.';

function publicDocumentIntro(document, verification) {
  if (verification) return document.presentation?.intro || SAFE_VERIFICATION_INTRO;
  return document.presentation?.intro || SAFE_LESSON_INTRO;
}

export function documentHtml(document, { unitId, unitTitle, verification = false } = {}) {
  const kindLabel = verification ? 'Verificação da unidade' : 'Lição';
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """        <p>${esc(document.objective)}</p>
""",
    """        <p>${esc(publicDocumentIntro(document, verification))}</p>
"""
)

# 3. Gate do renderer prova copy pública segura na V01 e ausência das chaves que vazaram visualmente.
replace_once(
    'scripts/test-classic-renderer.mjs',
    """const u04SequenceLesson = await service.loadLesson('N0-U04', 'N0-U04-L06');
const u04SequenceHtml = documentHtml(u04SequenceLesson.runtime, { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos' });
assert.match(u04SequenceHtml, /data-sequence-builder/);
assert.doesNotMatch(u04SequenceHtml, /Interação ainda não suportada/i);

const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
""",
    """const u04SequenceLesson = await service.loadLesson('N0-U04', 'N0-U04-L06');
const u04SequenceHtml = documentHtml(u04SequenceLesson.runtime, { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos' });
assert.match(u04SequenceHtml, /data-sequence-builder/);
assert.doesNotMatch(u04SequenceHtml, /Interação ainda não suportada/i);

const u04Verification = await service.loadVerification('N0-U04');
const u04VerificationHtml = documentHtml(u04Verification.runtime, { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos', verification: true });
assert.match(u04VerificationHtml, /Nesta verificação, você vai usar o que estudou nesta unidade/i);
assert.doesNotMatch(u04VerificationHtml, /Verificar se o aluno/i);
assert.doesNotMatch(u04VerificationHtml, />\\s*(WRONG CONCLUSION|QUESTION|ORDERED EVENTS|CARDS|TEXT REMAINS VISIBLE|TEXT REF|COMPETENCY)\\s*</i);

const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
"""
)

# 4. Smoke visual passa a impedir explicitamente regressão das chaves cruas e do objective técnico.
replace_once(
    'scripts/capture-p7-u04-visuals.sh',
    """if grep -Eiq 'requiredEvidence|requiredEvidenceParts|acceptableEvidence|evidenceCorrectIndexes|correctOrder|answerKey|schemaVersion|completionEvidence|activityPolicies' <<<\"$UNIT_DOM$L04_DOM$L06_DOM$V01_DOM\"; then
  echo 'P7 U04: metadado técnico/autoral vazou para a interface do aluno.' >&2
  exit 1
fi

capture() {
""",
    """if grep -Eiq 'requiredEvidence|requiredEvidenceParts|acceptableEvidence|evidenceCorrectIndexes|correctOrder|answerKey|schemaVersion|completionEvidence|activityPolicies' <<<\"$UNIT_DOM$L04_DOM$L06_DOM$V01_DOM\"; then
  echo 'P7 U04: metadado técnico/autoral vazou para a interface do aluno.' >&2
  exit 1
fi

if grep -Eiq '>(wrong conclusion|question|ordered events|cards|text remains visible|text ref|competency)<' <<<\"$L04_DOM$L06_DOM$V01_DOM\"; then
  echo 'P7 U04: chave autoral crua em inglês vazou para a linguagem pública.' >&2
  exit 1
fi

if grep -Fq 'Verificar se o aluno' <<<\"$V01_DOM\"; then
  echo 'P7 U04: objective técnico da verificação vazou para a abertura pública.' >&2
  exit 1
fi

capture() {
"""
)

print('P7/U04 correção de linguagem pública e abertura segura aplicada.')
