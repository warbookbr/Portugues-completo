from pathlib import Path

renderer = Path('app/js/ui/classic-renderer.js')
text = renderer.read_text()

old = """    'source', 'presentation', 'coverageRule',
    'textRemainsVisible', 'textRef', 'competency'
"""
new = """    'source', 'presentation', 'coverageRule', 'requiredIntent', 'meaning', 'selfCheck',
    'textRemainsVisible', 'textRef', 'competency'
"""
if text.count(old) != 1:
    raise RuntimeError(f'renderer hidden keys: esperado 1 match, encontrado {text.count(old)}')
text = text.replace(old, new, 1)

old = """  if (content.instruction) lead.push(`<p class="activity-instruction">${esc(content.instruction)}</p>`);
"""
new = """  if (content.instruction && !content.oralRehearsal?.enabled) lead.push(`<p class="activity-instruction">${esc(content.instruction)}</p>`);
"""
if text.count(old) != 1:
    raise RuntimeError(f'renderer instruction: esperado 1 match, encontrado {text.count(old)}')
text = text.replace(old, new, 1)
renderer.write_text(text)

semantic = Path('scripts/test-p7-u06-communication.mjs')
test = semantic.read_text()
anchor = """assert.doesNotMatch(v01Html, /transcriptAfterAttempt|externalReview|requiredForClaimOfValidatedOralComprehensibility|notAutomaticallyJudged|automaticObservations/);
"""
replacement = """assert.doesNotMatch(v01Html, /transcriptAfterAttempt|externalReview|requiredForClaimOfValidatedOralComprehensibility|notAutomaticallyJudged|automaticObservations/);
assert.doesNotMatch(v01Html, /REQUIRED INTENT|\\bMEANING\\b|requiredIntent/i, 'metadados de autoria não podem aparecer na UI pública da U06.');
assert.doesNotMatch(v01Html, /<strong>Autochecagem<\\/strong>/, 'selfCheck autoral não pode duplicar o componente público de autochecagem.');
"""
if anchor not in test:
    raise RuntimeError('teste U06: âncora de metadata ausente')
test = test.replace(anchor, replacement, 1)
semantic.write_text(test)

smoke = Path('scripts/capture-p7-u06-visuals.sh')
s = smoke.read_text()
old = """if grep -Eiq 'transcriptAfterAttempt|transcriptHiddenUntilAttempt|externalReview|requiredForClaimOfValidatedOralComprehensibility|statusWhenApproved|automaticValidation|completionEvidence|activityPolicies|answerKey|schemaVersion' <<<"$UNIT_DOM$L06_DOM$L10_DOM$V01_DOM"; then
"""
new = """if grep -Eiq 'transcriptAfterAttempt|transcriptHiddenUntilAttempt|externalReview|requiredForClaimOfValidatedOralComprehensibility|statusWhenApproved|automaticValidation|completionEvidence|activityPolicies|answerKey|schemaVersion|requiredIntent|>REQUIRED INTENT<|>MEANING<' <<<"$UNIT_DOM$L06_DOM$L10_DOM$V01_DOM"; then
"""
if s.count(old) != 1:
    raise RuntimeError(f'smoke metadata: esperado 1 match, encontrado {s.count(old)}')
s = s.replace(old, new, 1)
anchor = """grep -Fq 'não avalia pronúncia, sotaque ou compreensibilidade da fala' <<<"$V01_DOM" || { echo 'P7 U06: V01 precisa explicar o limite de validação oral.' >&2; exit 1; }
"""
addition = """grep -Fq 'não avalia pronúncia, sotaque ou compreensibilidade da fala' <<<"$V01_DOM" || { echo 'P7 U06: V01 precisa explicar o limite de validação oral.' >&2; exit 1; }
if grep -Fq '<strong>Autochecagem</strong>' <<<"$V01_DOM"; then
  echo 'P7 U06: selfCheck autoral duplicou a autochecagem pública.' >&2
  exit 1
fi
"""
if anchor not in s:
    raise RuntimeError('smoke: âncora de limite oral ausente')
s = s.replace(anchor, addition, 1)
smoke.write_text(s)

print('UI pública U06 corrigida: sem requiredIntent/meaning e sem duplicação genérica de autochecagem/instrução.')
