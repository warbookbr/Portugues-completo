from pathlib import Path

# Audit: só follow-ups com ação explícita de marcar/selecionar/indicar evidência são requisitos.
audit = Path('scripts/audit-p7-n0-u04.mjs')
text = audit.read_text()
old = "/evid[eê]ncia|parte|trecho|texto/i.test(block.followUp)"
new = "/(?:marque|selecione|indique|aponte|volte)[^.!?]*(?:evid[eê]ncia|parte|trecho|texto)/i.test(block.followUp)"
if text.count(old) != 1:
    raise RuntimeError(f'audit regex esperado encontrado {text.count(old)} vez(es)')
audit.write_text(text.replace(old, new, 1))

# V01: explicita que os dois itens do agrupamento são necessários; a evidência de Q03 já faz parte da correção da atividade.
rules = Path('app/js/services/content-normalization-rules-v1.js')
text = rules.read_text()
old = "{ id: 'explicitAndIntegration', required: true, evidenceIds: ['V01-Q03', 'V01-Q04'], satisfaction: 'DEMONSTRATED_REQUIRED' }"
new = "{ id: 'explicitAndIntegration', required: true, evidenceIds: ['V01-Q03', 'V01-Q04'], minimumEvidence: 2, satisfaction: 'DEMONSTRATED_REQUIRED' }"
if text.count(old) != 1:
    raise RuntimeError(f'cluster explicitAndIntegration esperado encontrado {text.count(old)} vez(es)')
rules.write_text(text.replace(old, new, 1))

print('P7/U04 refinamento v3 aplicado.')
