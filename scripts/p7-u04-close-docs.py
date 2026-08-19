from pathlib import Path


def replace_once(file, before, after):
    path = Path(file)
    text = path.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es)')
    path.write_text(text.replace(before, after, 1))

# Estado operacional: cursor e tabela de marcos.
replace_once(
    'docs/estado-implementacao-classico.md',
    '''P7 — Ampliação do catálogo Clássico N0→N4: ATIVO
Lote P7 N0-U03 — Palavras, frases e sentido: HOMOLOGADO (PR #134)
Homologação N0-U03: docs/homologacao-p7-n0-u03.md
Próximo passo exato: iniciar o lote N0-U04 — Lendo e compreendendo pequenos textos — inventariando autoria/verificação, normalização, interações e mídia antes de manifestar/publicar
''',
    '''P7 — Ampliação do catálogo Clássico N0→N4: ATIVO
Lote P7 N0-U04 — Lendo e compreendendo pequenos textos: HOMOLOGADO (PR #135)
Homologação N0-U04: docs/homologacao-p7-n0-u04.md
Próximo passo exato: iniciar o lote N0-U05 — Escrevendo e organizando mensagens — inventariando 10 lições + N0-U05-V01, normalização, produção aberta/revisão, convenções gráficas, interações e mídia antes de manifestar/publicar
'''
)

replace_once(
    'docs/estado-implementacao-classico.md',
    '| P7 — Catálogo N0→N4 | `ATIVO` | N0-U03 homologada na PR #134; próximo lote N0-U04 |',
    '| P7 — Catálogo N0→N4 | `ATIVO` | N0-U03/U04 homologadas nas PRs #134/#135; próximo lote N0-U05 |'
)

replace_once(
    'docs/estado-implementacao-classico.md',
    '''### N4-U09

```text
Renderer/progresso/pending: HOMOLOGADOS
''',
    '''### N0-U04

```text
Renderer/progresso/evidência textual/ordenação: HOMOLOGADOS
9 lições + N0-U04-V01: PUBLICADAS / HOMOLOGADAS
Manifesto: READY
Catálogo: ATIVO
Regras agregadas de conclusão: PRESERVADAS / TESTADAS
Mídia humana obrigatória: nenhuma
Linguagem pública + abertura de verificação: HOMOLOGADAS
Responsividade mobile do cabeçalho compartilhado: REVALIDADA
Homologação: docs/homologacao-p7-n0-u04.md
```

### N4-U09

```text
Renderer/progresso/pending: HOMOLOGADOS
'''
)

replace_once(
    'docs/estado-implementacao-classico.md',
    '''P7: ATIVO — expansão incremental do catálogo N0→N4
N0-U03: HOMOLOGADA — docs/homologacao-p7-n0-u03.md
Ativo agora: N0-U04 — inventário/adaptação/manifesto/publicação/homologação
''',
    '''P7: ATIVO — expansão incremental do catálogo N0→N4
N0-U03: HOMOLOGADA — docs/homologacao-p7-n0-u03.md
N0-U04: HOMOLOGADA — docs/homologacao-p7-n0-u04.md
Ativo agora: N0-U05 — Escrevendo e organizando mensagens — inventário/adaptação/manifesto/publicação/homologação
'''
)

# Roadmap: estado corrente e cursor P7.
replace_once(
    'docs/roadmap-produto.md',
    'P6 — Feedback por IA no Clássico → ATIVO\nMODO CLÁSSICO REAL → slice funcional com progresso persistente e nova entrada N0 homologada; próximo marco é feedback IA opt-in',
    'P6 — Feedback por IA no Clássico → HOMOLOGADO\nP7 — Ampliação do catálogo Clássico N0→N4 → ATIVO\nMODO CLÁSSICO REAL → slice funcional com progresso persistente, entrada N0 homologada e catálogo sendo ampliado por lotes P7'
)

replace_once(
    'docs/roadmap-produto.md',
    '''Lotes homologados até aqui:

- N0-U03 — Palavras, frases e sentido — PR #134 / `docs/homologacao-p7-n0-u03.md`.

Próximo lote: N0-U04 — Lendo e compreendendo pequenos textos.
''',
    '''Lotes homologados até aqui:

- N0-U03 — Palavras, frases e sentido — PR #134 / `docs/homologacao-p7-n0-u03.md`;
- N0-U04 — Lendo e compreendendo pequenos textos — PR #135 / `docs/homologacao-p7-n0-u04.md`.

Próximo lote: N0-U05 — Escrevendo e organizando mensagens.
'''
)

replace_once(
    'docs/roadmap-produto.md',
    '''P7 — Ampliação do catálogo Clássico N0→N4
→ N0-U03 HOMOLOGADA / publicada no catálogo
→ próximo lote: N0-U04 — Lendo e compreendendo pequenos textos
→ inventariar autoria/verificação e classificar normalização, interações, mídia e blocker real
''',
    '''P7 — Ampliação do catálogo Clássico N0→N4
→ N0-U03 + N0-U04 HOMOLOGADAS / publicadas no catálogo
→ próximo lote: N0-U05 — Escrevendo e organizando mensagens
→ inventariar 10 lições + N0-U05-V01 e classificar normalização, produção aberta/revisão, convenções gráficas, interações, mídia e blocker real
'''
)

# Índice mestre: registrar a nova fonte canônica de homologação.
replace_once(
    'PROJECT_INDEX.md',
    '- `docs/homologacao-p7-n0-u03.md` — **homologação do primeiro lote P7**: N0-U03 publicada, adapter legado, evidência agregada, renderer, linguagem pública, mídia e inspeção visual.\n',
    '- `docs/homologacao-p7-n0-u03.md` — **homologação do primeiro lote P7**: N0-U03 publicada, adapter legado, evidência agregada, renderer, linguagem pública, mídia e inspeção visual.\n- `docs/homologacao-p7-n0-u04.md` — **homologação do segundo lote P7**: N0-U04 publicada, evidência textual, ordenação, regras agregadas, linguagem pública, responsividade mobile e inspeção visual.\n'
)

print('Fechamento documental P7/N0-U04 aplicado; cursor movido para N0-U05.')
