from pathlib import Path

renderer_path = Path('app/js/ui/classic-renderer.js')
text = renderer_path.read_text()
old = """function bindContentTranscriptControls(root, documentRuntime) {
  bindContentTranscriptControls(root, document);
  if (!documentRuntime) return;
"""
new = """function bindContentTranscriptControls(root, documentRuntime) {
  if (!documentRuntime) return;
"""
if text.count(old) != 1:
    raise RuntimeError(f'renderer: recursão esperada encontrada {text.count(old)} vez(es)')
text = text.replace(old, new, 1)
old = """  if (!document) return;
  const byId = new Map(document.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));
"""
new = """  if (!document) return;
  bindContentTranscriptControls(root, document);
  const byId = new Map(document.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));
"""
if text.count(old) != 1:
    raise RuntimeError(f'renderer: ponto de binding esperado encontrado {text.count(old)} vez(es)')
text = text.replace(old, new, 1)
renderer_path.write_text(text)

test_path = Path('scripts/test-p7-u06-communication.mjs')
test = test_path.read_text()
anchor = "const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });\n"
addition = """const rendererSource = fs.readFileSync('app/js/ui/classic-renderer.js', 'utf8');
assert.doesNotMatch(
  rendererSource,
  /function bindContentTranscriptControls\(root, documentRuntime\) \{\s*bindContentTranscriptControls\(root, document\);/,
  'binder de transcrição não pode chamar a si mesmo recursivamente.'
);
assert.match(
  rendererSource,
  /if \(!document\) return;\s*bindContentTranscriptControls\(root, document\);/,
  'bindClassicRenderer precisa ligar a transcrição pós-tentativa uma única vez com o runtime atual.'
);

"""
if addition not in test:
    if anchor not in test:
        raise RuntimeError('teste U06: âncora service ausente')
    test = test.replace(anchor, anchor + addition, 1)
test_path.write_text(test)

print('Binder U06 corrigido: sem recursão e com regressão permanente.')
