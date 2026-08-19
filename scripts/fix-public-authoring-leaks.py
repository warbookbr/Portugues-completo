from pathlib import Path


def replace_once(path, before, after):
    p = Path(path)
    text = p.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{path}: esperado 1 match, encontrado {count}: {before[:120]!r}')
    p.write_text(text.replace(before, after, 1))

replace_once(
    'app/js/ui/classic-renderer.js',
    "  ['optionalScaffold', 'Apoio opcional'], ['note', 'Observação']\n]);",
    "  ['optionalScaffold', 'Apoio opcional'], ['note', 'Observação'],\n  ['groups', 'Grupos'], ['important', 'Importante']\n]);"
)

replace_once(
    'app/js/ui/classic-renderer.js',
    "    'principleQuestion', 'principleOptions', 'automaticCheck',\n    'textRemainsVisible', 'textRef', 'competency'\n",
    "    'principleQuestion', 'principleOptions', 'automaticCheck',\n    'source', 'presentation', 'coverageRule',\n    'textRemainsVisible', 'textRef', 'competency'\n"
)

replace_once(
    'app/js/ui/classic-renderer.js',
    "  if (stimulus.type === 'TEXT') {\n    const payload = stimulus.payload || {};\n    if (payload.sourceBlockId) return `<div class=\"stimulus-reference\">Use como referência o trecho ${esc(payload.sourceBlockId)} acima.</div>`;\n    return `<div class=\"semantic-stimulus\">${valueText(payload.content ?? payload)}</div>`;\n  }\n  return `<details class=\"stimulus-data\"><summary>Material de apoio da atividade</summary>${valueText(stimulus.payload || {})}</details>`;",
    "  if (stimulus.type === 'TEXT') {\n    const payload = stimulus.payload || {};\n    if (payload.sourceBlockId) return `<div class=\"stimulus-reference\">Use como referência o trecho ${esc(payload.sourceBlockId)} acima.</div>`;\n    return `<div class=\"semantic-stimulus\">${valueText(payload.content ?? payload)}</div>`;\n  }\n  if (stimulus.type === 'DATA_SET') return '';\n  return `<details class=\"stimulus-data\"><summary>Material de apoio da atividade</summary>${valueText(stimulus.payload || {})}</details>`;"
)

replace_once(
    'scripts/test-classic-renderer.mjs',
    "assert.notEqual(n0Lesson.runtime.presentation.intro, n0Lesson.runtime.objective);\n\nassert.equal(lessonHasStudyHistory(emptyProgress, n0Lesson.runtime.id), false, 'abrir rota sem evidência não deve contar como lição já iniciada');",
    "assert.notEqual(n0Lesson.runtime.presentation.intro, n0Lesson.runtime.objective);\n\nconst n0LessonHtml = documentHtml(n0Lesson.runtime, { unitId: 'N0-U01', unitTitle: 'Letras e primeiros sons' });\nassert.match(n0LessonHtml, /Grupos/i, 'groups deve receber rótulo público em português');\nassert.match(n0LessonHtml, /Importante/i, 'important deve receber rótulo público em português');\nassert.match(n0LessonHtml, /o audio diz o nome da letra/i, 'aviso pedagógico importante deve permanecer visível');\nassert.doesNotMatch(n0LessonHtml, /\\bSOURCE\\b|\\bletterSet\\b|\\bPRESENTATION\\b|\\bCOVERAGE RULE\\b|\\bcoverageRule\\b/i, 'metadados de autoria não podem vazar para o aluno');\n\nassert.equal(lessonHasStudyHistory(emptyProgress, n0Lesson.runtime.id), false, 'abrir rota sem evidência não deve contar como lição já iniciada');"
)

print('Patch de linguagem pública aplicado.')
