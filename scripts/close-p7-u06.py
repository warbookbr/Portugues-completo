from pathlib import Path


def replace_once(path, before, after):
    p = Path(path)
    text = p.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{path}: esperado 1 match, encontrado {count}: {before[:180]!r}')
    p.write_text(text.replace(before, after, 1))

# Estado operacional.
replace_once(
    'docs/estado-implementacao-classico.md',
    """Lote P7 N0-U05 — Escrevendo e organizando mensagens: HOMOLOGADO (PR #136)
Homologação N0-U05: docs/homologacao-p7-n0-u05.md
Próximo passo exato: iniciar o lote N0-U06 — Usando a língua no cotidiano — inventariando autoria + N0-U06-V01, interlocutor/finalidade, pergunta/resposta, pedidos/orientações, compreensão oral, adequação formal/informal, variação linguística, mídia e blockers antes de manifestar/publicar
""",
    """Lote P7 N0-U06 — Usando a língua no cotidiano: HOMOLOGADO (PR #139)
Homologação N0-U06: docs/homologacao-p7-n0-u06.md
Próximo passo exato: iniciar o lote N1-U01 — Lendo textos com mais autonomia — inventariando 9 lições + N1-U01-V01, objetivo de leitura, assunto/finalidade, informações explícitas, referências, relações, inferência, apoios multimodais, fonte/opinião/razão, resumo, mídia e blockers antes de manifestar/publicar
"""
)
replace_once(
    'docs/estado-implementacao-classico.md',
    "| P7 — Catálogo N0→N4 | `ATIVO` | N0-U03/U04/U05 homologadas nas PRs #134/#135/#136; próximo lote N0-U06 |",
    "| P7 — Catálogo N0→N4 | `ATIVO` | N0-U03/U04/U05/U06 homologadas nas PRs #134/#135/#136/#139; N0 completo; próximo lote N1-U01 |"
)

# Roadmap P7.
replace_once(
    'docs/roadmap-produto.md',
    """- N0-U03 — Palavras, frases e sentido — PR #134 / `docs/homologacao-p7-n0-u03.md`;
- N0-U04 — Lendo e compreendendo pequenos textos — PR #135 / `docs/homologacao-p7-n0-u04.md`;
- N0-U05 — Escrevendo e organizando mensagens — PR #136 / `docs/homologacao-p7-n0-u05.md`.

Próximo lote: N0-U06 — Usando a língua no cotidiano.
""",
    """- N0-U03 — Palavras, frases e sentido — PR #134 / `docs/homologacao-p7-n0-u03.md`;
- N0-U04 — Lendo e compreendendo pequenos textos — PR #135 / `docs/homologacao-p7-n0-u04.md`;
- N0-U05 — Escrevendo e organizando mensagens — PR #136 / `docs/homologacao-p7-n0-u05.md`;
- N0-U06 — Usando a língua no cotidiano — PR #139 / `docs/homologacao-p7-n0-u06.md`.

Nível 0 está integralmente coberto pelo catálogo Clássico. Próximo lote: N1-U01 — Lendo textos com mais autonomia.
"""
)
replace_once(
    'docs/roadmap-produto.md',
    """→ N0-U03 + N0-U04 + N0-U05 HOMOLOGADAS / publicadas no catálogo
→ próximo lote: N0-U06 — Usando a língua no cotidiano
→ inventariar autoria + N0-U06-V01 e classificar interlocutor/finalidade, pergunta/resposta, pedidos/orientações, compreensão oral, adequação formal/informal, variação linguística, mídia e blocker real
""",
    """→ N0-U03 + N0-U04 + N0-U05 + N0-U06 HOMOLOGADAS / publicadas no catálogo
→ Nível 0 integralmente coberto no Clássico
→ próximo lote: N1-U01 — Lendo textos com mais autonomia
→ inventariar 9 lições + N1-U01-V01 e classificar objetivo de leitura, assunto/finalidade, informações explícitas, referências, relações, inferência, apoios multimodais, fonte/opinião/razão, resumo, mídia e blocker real
"""
)

# Índice mestre.
replace_once(
    'PROJECT_INDEX.md',
    "- `docs/homologacao-p7-n0-u05.md` — **homologação do terceiro lote P7**: N0-U05 publicada, escrita aberta pending, planejamento/autochecagem, apoio opcional, edição controlada, linguagem pública e inspeção visual.\n",
    "- `docs/homologacao-p7-n0-u05.md` — **homologação do terceiro lote P7**: N0-U05 publicada, escrita aberta pending, planejamento/autochecagem, apoio opcional, edição controlada, linguagem pública e inspeção visual.\n- `docs/homologacao-p7-n0-u06.md` — **homologação do quarto lote P7 e fechamento do N0 no catálogo**: comunicação cotidiana, audio-first, reparo, adequação/variação, ensaio oral sem falsa validação e inspeção visual.\n"
)

print('Fechamento U06 aplicado: N0 completo e cursor P7 em N1-U01.')
