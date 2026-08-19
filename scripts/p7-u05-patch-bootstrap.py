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
path.write_text(text.replace(obsolete, '', 1))
print('Bootstrap U05: removida reaplicação redundante de directKeys já suportada pelo runtime.')
