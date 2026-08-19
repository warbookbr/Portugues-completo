from pathlib import Path

path = Path('scripts/test-p7-u04-evidence.mjs')
text = path.read_text()
old = "assert.notEqual(snapshot.curriculum.lessons[l04.id].clusterStates.integration, 'DEMONSTRADA');"
new = "assert.notEqual(snapshot.curriculum.lessons[l04.id]?.clusterStates?.integration, 'DEMONSTRADA');"
if text.count(old) != 1:
    raise RuntimeError(f'asserção L04 esperada encontrada {text.count(old)} vez(es)')
path.write_text(text.replace(old, new, 1))
print('Gate U04 ajustado para estado curricular ainda não materializado.')
