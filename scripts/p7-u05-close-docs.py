from pathlib import Path


def replace_once(file, before, after):
    path = Path(file)
    text = path.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es)')
    path.write_text(text.replace(before, after, 1))

# Estado operacional.
replace_once(
    'docs/estado-implementacao-classico.md',
    '''P7 — Ampliação do catálogo Clássico N0→N4: ATIVO
Lote P7 N0-U04 — Lendo e compreendendo pequenos textos: HOMOLOGADO (PR #135)
Homologação N0-U04: docs/homologacao-p7-n0-u04.md
Próximo passo exato: iniciar o lote N0-U05 — Escrevendo e organizando mensagens — inventariando 10 lições + N0-U05-V01, normalização, produção aberta/revisão, convenções gráficas, interações e mídia antes de manifestar/publicar
''',
    '''P7 — Ampliação do catálogo Clássico N0→N4: ATIVO
Lote P7 N0-U05 — Escrevendo e organizando mensagens: HOMOLOGADO (PR #136)
Homologação N0-U05: docs/homologacao-p7-n0-u05.md
Próximo passo exato: iniciar o lote N0-U06 — Usando a língua no cotidiano — inventariando autoria + N0-U06-V01, interlocutor/finalidade, pergunta/resposta, pedidos/orientações, compreensão oral, adequação formal/informal, variação linguística, mídia e blockers antes de manifestar/publicar
'''
)

replace_once(
    'docs/estado-implementacao-classico.md',
    '| P7 — Catálogo N0→N4 | `ATIVO` | N0-U03/U04 homologadas nas PRs #134/#135; próximo lote N0-U05 |',
    '| P7 — Catálogo N0→N4 | `ATIVO` | N0-U03/U04/U05 homologadas nas PRs #134/#135/#136; próximo lote N0-U06 |'
)

replace_once(
    'docs/estado-implementacao-classico.md',
    '''### N4-U09

```text
Renderer/progresso/pending: HOMOLOGADOS
''',
    '''### N0-U05

```text
Renderer/progresso/escrita aberta/edição controlada: HOMOLOGADOS
10 lições + N0-U05-V01: PUBLICADAS / HOMOLOGADAS
Manifesto: READY
Catálogo: ATIVO
Produção própria: VALIDACAO_PENDENTE quando não há avaliador confiável
Planejamento/autochecagem/apoio opcional: PRESERVADOS / TESTADOS
Edições textuais controladas: DETERMINÍSTICAS somente nos alvos exatos autorados
Múltiplas ordens válidas: PRESERVADAS
Mídia humana obrigatória: nenhuma
Linguagem pública: HOMOLOGADA
Homologação: docs/homologacao-p7-n0-u05.md
```

### N4-U09

```text
Renderer/progresso/pending: HOMOLOGADOS
'''
)

replace_once(
    'docs/estado-implementacao-classico.md',
    '''N0-U03: HOMOLOGADA — docs/homologacao-p7-n0-u03.md
N0-U04: HOMOLOGADA — docs/homologacao-p7-n0-u04.md
Ativo agora: N0-U05 — Escrevendo e organizando mensagens — inventário/adaptação/manifesto/publicação/homologação
''',
    '''N0-U03: HOMOLOGADA — docs/homologacao-p7-n0-u03.md
N0-U04: HOMOLOGADA — docs/homologacao-p7-n0-u04.md
N0-U05: HOMOLOGADA — docs/homologacao-p7-n0-u05.md
Ativo agora: N0-U06 — Usando a língua no cotidiano — inventário/adaptação/manifesto/publicação/homologação
'''
)

# Roadmap P7.
replace_once(
    'docs/roadmap-produto.md',
    '''- N0-U03 — Palavras, frases e sentido — PR #134 / `docs/homologacao-p7-n0-u03.md`;
- N0-U04 — Lendo e compreendendo pequenos textos — PR #135 / `docs/homologacao-p7-n0-u04.md`.

Próximo lote: N0-U05 — Escrevendo e organizando mensagens.
''',
    '''- N0-U03 — Palavras, frases e sentido — PR #134 / `docs/homologacao-p7-n0-u03.md`;
- N0-U04 — Lendo e compreendendo pequenos textos — PR #135 / `docs/homologacao-p7-n0-u04.md`;
- N0-U05 — Escrevendo e organizando mensagens — PR #136 / `docs/homologacao-p7-n0-u05.md`.

Próximo lote: N0-U06 — Usando a língua no cotidiano.
'''
)

replace_once(
    'docs/roadmap-produto.md',
    '''P7 — Ampliação do catálogo Clássico N0→N4
→ N0-U03 + N0-U04 HOMOLOGADAS / publicadas no catálogo
→ próximo lote: N0-U05 — Escrevendo e organizando mensagens
→ inventariar 10 lições + N0-U05-V01 e classificar normalização, produção aberta/revisão, convenções gráficas, interações, mídia e blocker real
→ adaptar somente contratos reutilizáveis necessários antes de manifestar/publicar
→ preservar N4-U09 como caso-âncora de resposta aberta/IA
→ não reescrever autoria apenas para satisfazer renderer
→ registrar blockers locais e continuar por lotes independentes
''',
    '''P7 — Ampliação do catálogo Clássico N0→N4
→ N0-U03 + N0-U04 + N0-U05 HOMOLOGADAS / publicadas no catálogo
→ próximo lote: N0-U06 — Usando a língua no cotidiano
→ inventariar autoria + N0-U06-V01 e classificar interlocutor/finalidade, pergunta/resposta, pedidos/orientações, compreensão oral, adequação formal/informal, variação linguística, mídia e blocker real
→ adaptar somente contratos reutilizáveis necessários antes de manifestar/publicar
→ preservar N4-U09 como caso-âncora de resposta aberta/IA
→ não reescrever autoria apenas para satisfazer renderer
→ não transformar sotaque, variedade ou informalidade em erro automático
→ registrar blockers locais e continuar por lotes independentes
'''
)

# Índice mestre.
replace_once(
    'PROJECT_INDEX.md',
    '- `docs/homologacao-p7-n0-u04.md` — **homologação do segundo lote P7**: N0-U04 publicada, evidência textual, ordenação, regras agregadas, linguagem pública, responsividade mobile e inspeção visual.\n',
    '- `docs/homologacao-p7-n0-u04.md` — **homologação do segundo lote P7**: N0-U04 publicada, evidência textual, ordenação, regras agregadas, linguagem pública, responsividade mobile e inspeção visual.\n- `docs/homologacao-p7-n0-u05.md` — **homologação do terceiro lote P7**: N0-U05 publicada, escrita aberta pending, planejamento/autochecagem, apoio opcional, edição controlada, linguagem pública e inspeção visual.\n'
)

print('Fechamento documental P7/N0-U05 aplicado; cursor movido para N0-U06.')
