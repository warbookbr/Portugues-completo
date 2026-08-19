from pathlib import Path

patch = Path('scripts/p7-u06-runtime-patch.py')
text = patch.read_text()
old = """    if count != 1:\n        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es): {before[:180]!r}')\n"""
new = """    if count != 1:\n        Path('scripts/p7-u06-anchor-error.txt').write_text(f'arquivo: {file}\\ncontagem: {count}\\ntrecho:\\n{before}\\n')\n        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es): {before[:180]!r}')\n"""
if old not in text:
    raise RuntimeError('Definição de replace_once esperada não encontrada no patch U06.')
patch.write_text(text.replace(old, new, 1))
print('Patch U06 instrumentado para diagnóstico de âncora.')
