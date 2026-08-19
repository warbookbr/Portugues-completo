from pathlib import Path


def replace_once(file, before, after):
    path = Path(file)
    text = path.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es)')
    path.write_text(text.replace(before, after, 1))

replace_once(
    'scripts/audit-p7-n0-u04.mjs',
    """      block.acceptableEvidence !== undefined
      || (typeof block.followUp === 'string' && /evid[eê]ncia|parte|trecho|texto/i.test(block.followUp))
""",
    """      block.acceptableEvidence !== undefined
      || (typeof block.followUp === 'string' && /(?:marque|selecione|indique|aponte|volte)[^.!?]*(?:evid[eê]ncia|parte|trecho|texto)/i.test(block.followUp))
"""
)

replace_once(
    'app/js/services/content-normalization-rules-v1.js',
    """      { id: 'explicitAndIntegration', required: true, evidenceIds: ['V01-Q03', 'V01-Q04'], satisfaction: 'DEMONSTRATED_REQUIRED' },
""",
    """      { id: 'explicitAndIntegration', required: true, evidenceIds: ['V01-Q03', 'V01-Q04'], minimumEvidence: 2, satisfaction: 'DEMONSTRATED_REQUIRED' },
"""
)

print('P7/U04 refinamentos finais do audit/runtime aplicados.')
