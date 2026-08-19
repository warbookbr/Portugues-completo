from pathlib import Path

path = Path('scripts/test-p7-u04-evidence.mjs')
text = path.read_text()
replacements = {
    "assert.notEqual(snapshot.curriculum.lessons[l04.id].clusterStates.integration, 'DEMONSTRADA');": "assert.notEqual(snapshot.curriculum.lessons[l04.id].status, 'CONCLUIDA');",
    "assert.notEqual(snapshot.curriculum.lessons[l04.id]?.clusterStates?.integration, 'DEMONSTRADA');": "assert.notEqual(snapshot.curriculum.lessons[l04.id].status, 'CONCLUIDA');",
    "assert.equal(snapshot.curriculum.lessons[l04.id].clusterStates.integration, 'DEMONSTRADA');": "assert.equal(snapshot.curriculum.lessons[l04.id].status, 'CONCLUIDA');",
    "assert.equal(snapshot.curriculum.lessons[l05.id].clusterStates.personPlaceReference, 'DEMONSTRADA');": "assert.equal(snapshot.curriculum.lessons[l05.id].status, 'CONCLUIDA');",
    "assert.equal(snapshot.curriculum.lessons[l07.id].clusterStates.causeAndEffect, 'DEMONSTRADA');": "assert.equal(snapshot.curriculum.lessons[l07.id].status, 'CONCLUIDA');",
}
for old, new in replacements.items():
    if old in text:
        text = text.replace(old, new, 1)
path.write_text(text)
print('Gate U04 passa a observar status de lição, não clusterStates inexistente.')
