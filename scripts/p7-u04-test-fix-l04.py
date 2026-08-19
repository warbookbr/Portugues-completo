from pathlib import Path

path = Path('scripts/test-p7-u04-evidence.mjs')
text = path.read_text()
start = text.index('// L04: 2 de 3, incluindo uma atividade com múltiplas evidências.')
end = text.index('// L05: pessoa + lugar e pelo menos três acertos agregados.')
replacement = '''// L04: integração aceita 2 de 3, mas A02 também sustenta o cluster separado relationDiscipline.\n{\n  const progress = newProgress();\n  record(progress, l04, l04ById, 'L04-A01', { correct: true, score: 1, itemResults: { 0: true } });\n  const snapshot = record(progress, l04, l04ById, 'L04-A02', { correct: true, score: 1, itemResults: { 0: true } });\n  assert.equal(snapshot.curriculum.lessons[l04.id].status, 'CONCLUIDA', 'A01 + A02 satisfazem 2-de-3 e o requisito relacional de A02.');\n}\n{\n  const progress = newProgress();\n  record(progress, l04, l04ById, 'L04-C01', { correct: true, score: 1, itemResults: { 0: true } });\n  const snapshot = record(progress, l04, l04ById, 'L04-A02', { correct: true, score: 1, itemResults: { 0: true } });\n  assert.equal(snapshot.curriculum.lessons[l04.id].status, 'CONCLUIDA', 'C01 + A02 também satisfazem 2-de-3 sem exigir A01.');\n}\n{\n  const progress = newProgress();\n  record(progress, l04, l04ById, 'L04-C01', { correct: true, score: 1, itemResults: { 0: true } });\n  const snapshot = record(progress, l04, l04ById, 'L04-A01', { correct: true, score: 1, itemResults: { 0: true } });\n  assert.notEqual(snapshot.curriculum.lessons[l04.id].status, 'CONCLUIDA', 'Sem A02, relationDiscipline continua pendente mesmo com 2 evidências de integração.');\n}\n\n'''
path.write_text(text[:start] + replacement + text[end:])
print('Caso L04 refinado para 2-de-3 + relationDiscipline.')
