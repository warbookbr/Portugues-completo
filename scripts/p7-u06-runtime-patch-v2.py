from pathlib import Path
import re


def load(file):
    return Path(file).read_text()


def save(file, text):
    Path(file).write_text(text)


def sub_once(text, pattern, repl, label, flags=0):
    new, count = re.subn(pattern, repl, text, count=1, flags=flags)
    if count != 1:
        raise RuntimeError(f'{label}: padrão encontrado {count} vez(es)')
    return new

# ---------------------------------------------------------------------------
# 1. Normalizador: ensaio oral como atividade registrável/pending.
# ---------------------------------------------------------------------------
file = 'app/js/services/content-normalizer-v1.js'
text = load(file)

if 'function hasOralRehearsal(block)' not in text:
    marker = '\nfunction materializeCommonLegacyActivity(block, sourceDocument) {'
    helper = '''\nfunction hasOralRehearsal(block) {\n  return block?.oralRehearsal === true\n    || (block?.oralRehearsal && typeof block.oralRehearsal === 'object' && block.oralRehearsal.enabled !== false);\n}\n'''
    if marker not in text:
        raise RuntimeError('normalizer: marcador materializeCommonLegacyActivity ausente')
    text = text.replace(marker, helper + marker, 1)

if 'const authoredRehearsal = materialized.oralRehearsal;' not in text:
    marker = '  if (isOpenAuthoredActivity(materialized)) {'
    block = '''  if (hasOralRehearsal(materialized)) {\n    const authoredRehearsal = materialized.oralRehearsal;\n    const rehearsal = authoredRehearsal === true\n      ? { enabled: true, required: true, instruction: materialized.instruction || 'Faça um ensaio oral curto e marque quando concluir.' }\n      : {\n          enabled: authoredRehearsal.enabled !== false,\n          required: authoredRehearsal.required === true,\n          instruction: authoredRehearsal.instruction || materialized.instruction || 'Faça um ensaio oral curto.'\n        };\n    materialized.oralRehearsal = rehearsal;\n    if (!Array.isArray(materialized.selfReviewQuestions) && Array.isArray(materialized.selfCheck)) materialized.selfReviewQuestions = clone(materialized.selfCheck);\n    if (!Array.isArray(materialized.selfReviewQuestions) && Array.isArray(materialized.selfReview)) materialized.selfReviewQuestions = clone(materialized.selfReview);\n    if (!isOpenAuthoredActivity(materialized)) {\n      materialized.automaticValidation = false;\n      materialized.recordResponse = true;\n      materialized.interaction = 'oral-response';\n    }\n  }\n\n'''
    if marker not in text:
        raise RuntimeError('normalizer: marcador open authored ausente')
    text = text.replace(marker, block + marker, 1)

text = re.sub(
    r"if \(isOpenAuthoredActivity\(block\)\) return true;",
    "if (isOpenAuthoredActivity(block) || hasOralRehearsal(block)) return true;",
    text,
    count=1
)
if 'isOpenAuthoredActivity(block) || hasOralRehearsal(block)' not in text:
    raise RuntimeError('normalizer: isLessonActivity não incorporou oralRehearsal')
save(file, text)

# ---------------------------------------------------------------------------
# 2. Regras explícitas da U06.
# ---------------------------------------------------------------------------
file = 'app/js/services/content-normalization-rules-v1.js'
text = load(file)
if "'N0-U06-V01':" not in text:
    marker = '  // N0-U05 — escrita autoral: pending não equivale a domínio e apoio não é penalidade.\n'
    rules = '''  // N0-U06 — comunicação cotidiana: oralidade, adequação e reparo sem falsa autoridade automática.\n  'N0-U06-L09': {\n    clusters: [\n      { id: 'chooseRepair', required: true, evidenceIds: ['L09-C01', 'L09-A01', 'L09-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },\n      { id: 'ownRepairMessage', required: true, evidenceIds: ['L09-A03'], satisfaction: 'PENDING_ALLOWED' }\n    ],\n    nonCompensable: true,\n    activityPolicies: {}\n  },\n  'N0-U06-L10': {\n    clusters: [\n      { id: 'reformulation', required: true, evidenceIds: ['L10-C01', 'L10-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },\n      { id: 'ownReformulation', required: true, evidenceIds: ['L10-A02'], satisfaction: 'PENDING_ALLOWED' },\n      { id: 'strategyChoice', required: true, evidenceIds: ['L10-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' }\n    ],\n    nonCompensable: true,\n    activityPolicies: {}\n  },\n  'N0-U06-V01': {\n    clusters: [\n      { id: 'comprehensionAndPurpose', required: true, evidenceIds: ['V01-Q01', 'V01-Q05'], satisfaction: 'DEMONSTRATED_REQUIRED' },\n      { id: 'functionalUseAndProduction', required: true, evidenceIds: ['V01-Q02', 'V01-Q03', 'V01-Q04', 'V01-Q11'], satisfaction: 'PENDING_ALLOWED', requiredAnyOf: [['V01-Q02'], ['V01-Q03'], ['V01-Q04'], ['V01-Q11']] },\n      { id: 'oralComprehension', required: true, evidenceIds: ['V01-Q06', 'V01-Q07'], satisfaction: 'DEMONSTRATED_REQUIRED' },\n      { id: 'adequacyVariationAndRepair', required: true, evidenceIds: ['V01-Q08', 'V01-Q09', 'V01-Q10'], satisfaction: 'DEMONSTRATED_REQUIRED' },\n      { id: 'oralProductionPractice', required: true, evidenceIds: ['V01-Q12'], satisfaction: 'PENDING_ALLOWED' }\n    ],\n    nonCompensable: true,\n    activityPolicies: {}\n  },\n\n'''
    if marker not in text:
        raise RuntimeError('rules: marcador U05 ausente')
    text = text.replace(marker, rules + marker, 1)
save(file, text)

# ---------------------------------------------------------------------------
# 3. Renderer: segredos de transcript, ensaio oral e revelação pós-tentativa.
# ---------------------------------------------------------------------------
file = 'app/js/ui/classic-renderer.js'
text = load(file)

# Campos autorais ficam no runtime, mas não no render genérico.
if "'transcriptHiddenUntilAttempt'" not in text:
    text = sub_once(
        text,
        r"('planningPrompt', 'essentialInformation',\s*\n\s*'principleQuestion', 'principleOptions', 'automaticCheck'),",
        r"\1, 'oralRehearsal',\n    'transcriptHiddenUntilAttempt', 'transcriptAfterAttempt', 'replayAllowed', 'externalReview'",
        'renderer hiddenKeys U06'
    )

if 'function renderOralRehearsal(block)' not in text:
    marker = '\nfunction renderSelfReview(block) {'
    helper = '''\nfunction renderOralRehearsal(block) {\n  const rehearsal = block.content?.oralRehearsal;\n  if (!rehearsal || rehearsal.enabled === false) return '';\n  const instruction = rehearsal.instruction || 'Faça um ensaio oral curto.';\n  const required = rehearsal.required === true ? ' required' : '';\n  const optional = rehearsal.required === true ? '' : '<p class="reveal-note">Este ensaio é opcional nesta etapa escrita.</p>';\n  return `<fieldset class="self-review oral-rehearsal" data-oral-rehearsal><legend>Ensaio oral</legend><p>${esc(instruction)}</p>${optional}<label class="choice-option"><input type="checkbox" name="oralRehearsalDone" value="done"${required}><span>Concluí o ensaio oral.</span></label><p class="reveal-note">Este registro confirma a prática, não avalia pronúncia, sotaque ou compreensibilidade da fala.</p></fieldset>`;\n}\n\nfunction renderDelayedTranscriptControl(block) {\n  if (block.content?.transcriptHiddenUntilAttempt !== true || typeof block.content?.transcriptAfterAttempt !== 'string') return '';\n  return `<div class="delayed-transcript-control" data-delayed-transcript-control><button type="button" class="secondary-button compact-button" data-transcript-reveal disabled>Mostrar transcrição depois de ouvir</button><div class="content-detail" data-transcript-slot aria-live="polite"></div></div>`;\n}\n'''
    if marker not in text:
        raise RuntimeError('renderer: marcador renderSelfReview ausente')
    text = text.replace(marker, helper + marker, 1)

text = re.sub(
    r"case 'ORAL_RESPONSE': return renderOpenInput\(block, 'Rascunho/registro da resposta oral nesta etapa técnica'\);",
    "case 'ORAL_RESPONSE': return '';",
    text,
    count=1
)
if "case 'ORAL_RESPONSE': return '';" not in text:
    raise RuntimeError('renderer: ORAL_RESPONSE não convertido')

if '${renderOralRehearsal(block)}' not in text:
    marker = '        ${renderEvidenceSelector(block.content)}\n        ${renderSelfReview(block)}'
    if marker not in text:
        raise RuntimeError('renderer: marcador do form activity ausente')
    text = text.replace(marker, '        ${renderEvidenceSelector(block.content)}\n        ${renderOralRehearsal(block)}\n        ${renderSelfReview(block)}', 1)

if '${renderDelayedTranscriptControl(block)}' not in text:
    text = sub_once(
        text,
        r"export function renderContentBlock\(block\) \{\n\s*return `([^`]*?)\$\{renderKnownContent\(block\.content\)\}([^`]*?)`;\n\}",
        lambda m: "export function renderContentBlock(block) {\n  return `" + m.group(1) + "${renderKnownContent(block.content)}${renderDelayedTranscriptControl(block)}" + m.group(2) + "`;\n}",
        'renderer content transcript',
        flags=re.S
    )

if 'function revealPostAttemptTranscripts(form, block)' not in text:
    marker = '\nfunction revealPostSubmissionExamples(form, block) {'
    helper = '''\nfunction transcriptEntries(block) {\n  const entries = [];\n  if (block.content?.transcriptHiddenUntilAttempt === true && typeof block.content?.transcriptAfterAttempt === 'string') entries.push({ label: 'Transcrição', text: block.content.transcriptAfterAttempt });\n  const items = Array.isArray(block.content?.items) ? block.content.items : Array.isArray(block.content?.rounds) ? block.content.rounds : [];\n  items.forEach((item, index) => {\n    if (item?.transcriptHiddenUntilAttempt === true && typeof item?.transcriptAfterAttempt === 'string') entries.push({ label: `Transcrição ${index + 1}`, text: item.transcriptAfterAttempt });\n  });\n  return entries;\n}\n\nfunction revealPostAttemptTranscripts(form, block) {\n  const entries = transcriptEntries(block);\n  if (!entries.length || form.querySelector('[data-post-attempt-transcripts]')) return;\n  const box = document.createElement('div');\n  box.className = 'content-details post-attempt-transcripts';\n  box.dataset.postAttemptTranscripts = 'true';\n  entries.forEach(entry => {\n    const detail = document.createElement('div');\n    detail.className = 'content-detail';\n    const title = document.createElement('strong');\n    title.textContent = entry.label;\n    const body = document.createElement('div');\n    body.textContent = entry.text;\n    detail.append(title, body);\n    box.appendChild(detail);\n  });\n  form.appendChild(box);\n}\n'''
    if marker not in text:
        raise RuntimeError('renderer: marcador revealPostSubmissionExamples ausente')
    text = text.replace(marker, helper + marker, 1)

# Só revelar modelos/transcrições quando a tentativa estiver completa.
text = re.sub(
    r"(feedback\.dataset\.state = message\.state;\n\s*feedback\.textContent = message\.text;)\n\s*revealPostSubmissionExamples\(form, block\);",
    r"\1\n    if (result.complete) {\n      revealPostSubmissionExamples(form, block);\n      revealPostAttemptTranscripts(form, block);\n    }",
    text,
    count=1
)
if 'revealPostAttemptTranscripts(form, block);' not in text:
    raise RuntimeError('renderer: pós-tentativa não conectado ao submit')

if 'function bindContentTranscriptControls(root)' not in text:
    marker = '\nfunction bindProgressive(root) {'
    helper = '''\nfunction bindContentTranscriptControls(root) {\n  const runtime = root.__documentRuntime;\n  if (!runtime) return;\n  const byId = new Map((runtime.blocks || []).map(block => [block.id, block]));\n  root.querySelectorAll('[data-delayed-transcript-control]').forEach(control => {\n    const card = control.closest('[id]');\n    const block = card ? byId.get(card.id) : null;\n    const button = control.querySelector('[data-transcript-reveal]');\n    const slot = control.querySelector('[data-transcript-slot]');\n    const tts = card?.querySelector('[data-tts]');\n    if (!block || !button || !slot || typeof block.content?.transcriptAfterAttempt !== 'string') return;\n    if (tts) tts.addEventListener('click', () => { button.disabled = false; });\n    button.addEventListener('click', () => {\n      const title = document.createElement('strong');\n      title.textContent = 'Transcrição';\n      const body = document.createElement('div');\n      body.textContent = block.content.transcriptAfterAttempt;\n      slot.replaceChildren(title, body);\n      button.hidden = true;\n    });\n  });\n}\n'''
    if marker not in text:
        raise RuntimeError('renderer: marcador bindProgressive ausente')
    text = text.replace(marker, helper + marker, 1)

if 'bindContentTranscriptControls(root);' not in text:
    marker = '  bindProgressive(root);'
    if marker not in text:
        raise RuntimeError('renderer: chamada bindProgressive ausente')
    text = text.replace(marker, marker + '\n  bindContentTranscriptControls(root);', 1)

save(file, text)

# ---------------------------------------------------------------------------
# 4. Progress binding: persistir prática oral separadamente.
# ---------------------------------------------------------------------------
file = 'app/js/ui/classic-progress-binding.js'
text = load(file)

if "interaction === 'ORAL_RESPONSE'" in text and "oralRehearsalDone" not in text:
    text = sub_once(
        text,
        r"if \(interaction === 'SHORT_TEXT' \|\| interaction === 'STRUCTURED_RESPONSE' \|\| interaction === 'LONG_TEXT' \|\| interaction === 'ORAL_RESPONSE'\) \{\n\s*return \{ openResponse: form\.elements\.namedItem\('openResponse'\)\?\.value \|\| '', revisedResponse: form\.elements\.namedItem\('revisedResponse'\)\?\.value \|\| '' \};\n\s*\}",
        """if (interaction === 'SHORT_TEXT' || interaction === 'STRUCTURED_RESPONSE' || interaction === 'LONG_TEXT') {\n    return {\n      openResponse: form.elements.namedItem('openResponse')?.value || '',\n      revisedResponse: form.elements.namedItem('revisedResponse')?.value || '',\n      oralRehearsalDone: form.elements.namedItem('oralRehearsalDone')?.checked === true\n    };\n  }\n  if (interaction === 'ORAL_RESPONSE') {\n    const output = { oralRehearsalDone: form.elements.namedItem('oralRehearsalDone')?.checked === true };\n    for (const input of form.elements) {\n      if (input.name?.startsWith('selfReview:') && input.checked) output[input.name] = input.value;\n    }\n    return output;\n  }""",
        'progress binding oral response',
        flags=re.S
    )
if 'oralRehearsalDone' not in text:
    raise RuntimeError('progress binding: oralRehearsalDone ausente após patch')
save(file, text)

# ---------------------------------------------------------------------------
# 5. Audit: falso positivo só se houver afirmação estigmatizante, não pergunta/negação.
# ---------------------------------------------------------------------------
file = 'scripts/audit-p7-n0-u06.mjs'
text = load(file)
text = re.sub(
    r"if \(sourceHasAntiStigmaRule\(source\)\) \{\n\s*if \(/linguagem informal é sempre errada\|mais formal é automaticamente melhor\|sotaque\.\*erro\|variedade\.\*inferior/i\.test\(html\)\) \{\n\s*issue\(`\$\{source\.id\}: linguagem pública contradiz a proteção contra estigmatização/false hierarchy\.`\);\n\s*\}\n\s*\}",
    """if (sourceHasAntiStigmaRule(source)) {\n    const affirmedStigma = /linguagem informal é sempre errada[.!]|mais formal é automaticamente melhor[.!]|sotaque[^.!?]{0,40}é erro[.!]|variedade[^.!?]{0,40}é inferior[.!]/i;\n    if (affirmedStigma.test(html)) issue(`${source.id}: linguagem pública afirma hierarquia/estigma incompatível com a autoria.`);\n  }""",
    text,
    count=1,
    flags=re.S
)
save(file, text)

# ---------------------------------------------------------------------------
# Invariantes do patch.
# ---------------------------------------------------------------------------
checks = {
    'app/js/services/content-normalizer-v1.js': ['function hasOralRehearsal(block)', "materialized.interaction = 'oral-response'"],
    'app/js/services/content-normalization-rules-v1.js': ["'N0-U06-V01':", "id: 'oralProductionPractice'"],
    'app/js/ui/classic-renderer.js': ['function renderOralRehearsal(block)', 'function revealPostAttemptTranscripts(form, block)', 'function bindContentTranscriptControls(root)'],
    'app/js/ui/classic-progress-binding.js': ['oralRehearsalDone']
}
for target, needles in checks.items():
    data = load(target)
    missing = [needle for needle in needles if needle not in data]
    if missing:
        raise RuntimeError(f'{target}: invariantes ausentes: {missing}')

print('P7/U06 patch estrutural aplicado: áudio-first, transcript pós-tentativa, oral rehearsal pending e regras explícitas.')
