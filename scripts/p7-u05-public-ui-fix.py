from pathlib import Path


def replace_once(file, before, after):
    path = Path(file)
    text = path.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es)')
    path.write_text(text.replace(before, after, 1))

replace_once(
    'app/js/ui/classic-renderer.js',
    """  ['situation', 'Situação'], ['central', 'Ideia central'], ['detail', 'Detalhe'],
  ['text', 'Pergunta'], ['options', 'Opções'], ['firstDraft', 'Primeira versão'],
""",
    """  ['situation', 'Situação'], ['central', 'Ideia central'], ['detail', 'Detalhe'],
  ['before', 'Antes'], ['after', 'Depois'],
  ['text', 'Pergunta'], ['options', 'Opções'], ['firstDraft', 'Primeira versão'],
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """    'cards', 'optionalScaffold', 'planningChecklist', 'principleQuestion', 'principleOptions', 'automaticCheck',
""",
    """    'cards', 'optionalScaffold', 'planningChecklist', 'planningPrompt', 'essentialInformation',
    'principleQuestion', 'principleOptions', 'automaticCheck',
"""
)

print('P7/U05: correção pública mínima aplicada sobre o renderer restaurado.')
