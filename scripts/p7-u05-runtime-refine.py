from pathlib import Path

path = Path('app/js/services/content-normalization-rules-v1.js')
text = path.read_text()
before = "      { id: 'graphicConventions', required: true, evidenceIds: ['V01-Q07', 'V01-Q09', 'V01-Q10'], satisfaction: 'DEMONSTRATED_REQUIRED' },"
after = "      { id: 'graphicConventions', required: true, evidenceIds: ['V01-Q07', 'V01-Q09', 'V01-Q10'], satisfaction: 'DEMONSTRATED_REQUIRED', criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q09'], minimum: 2 }] },"
count = text.count(before)
if count != 1:
    raise RuntimeError(f'graphicConventions esperado 1 vez, encontrado {count}.')
path.write_text(text.replace(before, after, 1))
print('U05/V01: critério explícito de 2/3 sinais finais registrado no cluster graphicConventions.')
