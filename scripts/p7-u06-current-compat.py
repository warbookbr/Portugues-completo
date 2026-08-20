from pathlib import Path


def replace_once(path, before, after):
    p = Path(path)
    text = p.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{path}: esperado 1 match, encontrado {count}')
    p.write_text(text.replace(before, after, 1))

# Audio-first: o texto falado fica no runtime, não no HTML inicial.
replace_once(
    'app/js/ui/classic-renderer.js',
    """  if (content.ttsText) {\n    lead.push(`<button type=\"button\" class=\"secondary-button stimulus-button\" data-tts=\"${esc(content.ttsText)}\">Ouvir exemplo</button>`);\n  }""",
    """  if (content.ttsText) {\n    const runtimeOnlyTts = content.transcriptHiddenUntilAttempt === true;\n    lead.push(`<button type=\"button\" class=\"secondary-button stimulus-button\" data-tts=\"${runtimeOnlyTts ? '' : esc(content.ttsText)}\"${runtimeOnlyTts ? ' data-runtime-tts' : ''}>Ouvir exemplo</button>`);\n  }"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """  root.querySelectorAll('[data-tts]').forEach(button => button.addEventListener('click', () => speak(button.dataset.tts || '')));""",
    """  const runtimeBlocks = document ? new Map((document.blocks || []).map(block => [block.id, block])) : new Map();\n  root.querySelectorAll('[data-tts]').forEach(button => button.addEventListener('click', () => {\n    const cardId = button.closest('[id]')?.id;\n    const runtimeText = button.hasAttribute('data-runtime-tts') ? runtimeBlocks.get(cardId)?.content?.ttsText : null;\n    speak(runtimeText || button.dataset.tts || '');\n  }));"""
)

# A demonstração B02 é atividade determinística no runtime atual; ela recebe um
# controle manual de transcrição que só é habilitado depois de ouvir o TTS.
replace_once(
    'app/js/ui/classic-renderer.js',
    """      ${renderKnownContent(block.content)}\n      ${renderStimuli(block.activity)}\n      <form class=\"activity-form\" data-activity-form novalidate>""",
    """      ${renderKnownContent(block.content)}\n      ${block.pedagogicalType === 'audio-first-demonstration' ? renderDelayedTranscriptControl(block) : ''}\n      ${renderStimuli(block.activity)}\n      <form class=\"activity-form\" data-activity-form novalidate>"""
)

# O helper U06 recebe o runtime; criação de elementos continua usando o DOM real.
p = Path('app/js/ui/classic-renderer.js')
text = p.read_text()
text = text.replace('function bindContentTranscriptControls(root, document) {', 'function bindContentTranscriptControls(root, documentRuntime) {')
text = text.replace("  if (!document) return;\n  const byId = new Map((document.blocks || []).map(block => [block.id, block]));", "  if (!documentRuntime) return;\n  const byId = new Map((documentRuntime.blocks || []).map(block => [block.id, block]));")
text = text.replace("      const title = document.createElement('strong');", "      const title = globalThis.document.createElement('strong');")
text = text.replace("      const body = document.createElement('div');", "      const body = globalThis.document.createElement('div');")
p.write_text(text)

# O patch estrutural já troca o detector original por affirmedStigma; aqui excluímos
# as alternativas de escolha, pois uma frase estigmatizante pode aparecer como distractor a rejeitar.
p = Path('scripts/audit-p7-n0-u06.mjs')
text = p.read_text()
before = """  if (sourceHasAntiStigmaRule(source)) {\n    const affirmedStigma = /linguagem informal é sempre errada[.!]|mais formal é automaticamente melhor[.!]|sotaque[^.!?]{0,40}é erro[.!]|variedade[^.!?]{0,40}é inferior[.!]/i;\n    if (affirmedStigma.test(html)) issue(`${source.id}: linguagem pública afirma hierarquia/estigma incompatível com a autoria.`);\n  }"""
after = """  if (sourceHasAntiStigmaRule(source)) {\n    const publicAssertionsHtml = html.replace(/<label class=\"choice-option\"[\\s\\S]*?<\\/label>/g, '');\n    const affirmedStigma = /linguagem informal é sempre errada[.!]|mais formal é automaticamente melhor[.!]|sotaque[^.!?]{0,40}é erro[.!]|variedade[^.!?]{0,40}é inferior[.!]/i;\n    if (affirmedStigma.test(publicAssertionsHtml)) issue(`${source.id}: linguagem pública afirma hierarquia/estigma incompatível com a autoria.`);\n  }"""
if before not in text:
    raise RuntimeError('audit U06: detector affirmedStigma pós-patch não encontrado')
p.write_text(text.replace(before, after, 1))

# O teste comportamental aplica a mesma distinção: distractor estigmatizante é
# aceitável quando a atividade existe justamente para rejeitá-lo.
p = Path('scripts/test-p7-u06-communication.mjs')
text = p.read_text()
text = text.replace(
    "assert.match(JSON.stringify(l07Source.limits), /não tratar linguagem informal como errada|não apresentar linguagem mais formal como automaticamente melhor/i);",
    "assert.match(JSON.stringify(l07Source.limits), /não apresentar linguagem informal como errada|não apresentar linguagem formal como universalmente superior/i);"
)
before = """assert.doesNotMatch(l07Html + l08Html, /linguagem informal é sempre errada[.!]|mais formal é automaticamente melhor[.!]|sotaque[^.!?]{0,40}é erro[.!]|variedade[^.!?]{0,40}é inferior[.!]/i);"""
after = """const antiStigmaAssertionsHtml = (l07Html + l08Html).replace(/<label class=\"choice-option\"[\\s\\S]*?<\\/label>/g, '');\nassert.doesNotMatch(antiStigmaAssertionsHtml, /linguagem informal é sempre errada[.!]|mais formal é automaticamente melhor[.!]|sotaque[^.!?]{0,40}é erro[.!]|variedade[^.!?]{0,40}é inferior[.!]/i);"""
if before not in text:
    raise RuntimeError('teste U06: asserção antiestigma esperada não encontrada')
p.write_text(text.replace(before, after, 1))

print('Compatibilidade U06 atual aplicada: TTS protegido, transcrição demonstrativa controlada e regras sociolinguísticas alinhadas à autoria.')
