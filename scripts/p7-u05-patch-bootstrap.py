from pathlib import Path

path = Path('scripts/p7-u05-runtime-patch.py')
text = path.read_text()
obsolete = '''replace_once(
    'app/js/services/content-normalizer-v1.js',
    """  const directKeys = ['correct', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
""",
    """  const directKeys = ['correct', 'expected', 'acceptedResult', 'acceptedResults', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
"""
)

'''
if obsolete not in text:
    raise RuntimeError('Bloco redundante directKeys não encontrado no script temporário.')
text = text.replace(obsolete, '', 1)
text = text.replace(
    '"""    \'acceptedSequences\', \'acceptedResult\', \'acceptedResults\', \'correctFunction\', \'correctGroup\', \'correctAnswer\',\\n"""',
    '"""  \'acceptedSequences\', \'acceptedResult\', \'acceptedResults\', \'correctFunction\', \'correctGroup\', \'correctAnswer\',\\n"""',
    1
)
text = text.replace(
    '"""    \'acceptedSequences\', \'acceptableOrders\', \'acceptedResult\', \'acceptedResults\', \'correctFunction\', \'correctGroup\', \'correctAnswer\',\\n"""',
    '"""  \'acceptedSequences\', \'acceptableOrders\', \'acceptedResult\', \'acceptedResults\', \'correctFunction\', \'correctGroup\', \'correctAnswer\',\\n"""',
    1
)
text = text.replace(
    "raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es)')",
    "raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es): {before[:220]!r}')",
    1
)
path.write_text(text)
print('Bootstrap U05: directKeys redundante removido, âncora de segredo autoral alinhada e diagnóstico ampliado.')
