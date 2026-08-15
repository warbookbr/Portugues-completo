# Roadmap Curricular

## Objetivo

Registrar o estado real do desenvolvimento curricular, o marco ativo e a próxima camada que pode ser aprofundada.

## Escala de maturidade

```text
M0 — esboço
M1 — nível mapeado
M2 — áreas dimensionadas
M3 — unidades dimensionadas
M4 — lições dimensionadas
M5 — conteúdo desenvolvido
```

A escala mede maturidade curricular. Não equivale a progresso do aluno nem a prontidão de publicação.

## Estado macro

### Nível 0 — Fundamentos

**M5 concluído.** Seis unidades, verificações integradas U1–U6, verificação de saída `N0-EXIT-V01` e auditoria de competências concluídas.

```text
currículo fechado
≠ publicação pronta
≠ validação externa de toda resposta aberta/oral
```

### Nível 1 — Básico

- **M1 concluído** — `docs/mapa-niveis-1-4.md`;
- **M2 concluído** — 10 áreas em `docs/areas-nivel-1.md`;
- **M3 concluído** — 7 unidades em `docs/unidades-nivel-1.md`;
- **M4 concluído** — 64 lições + 7 verificações integradas em `docs/licoes-nivel-1.md` e documentos U1–U7;
- **M5 em andamento** — **U1–U5 concluídas**; U6–U7 pendentes.

A passagem N0→N1 foi auditada em `docs/transicao-n0-n1.md`.

### Níveis 2, 3 e 4

**M1 concluído** para os três níveis.

## N1 — M5

### U1 — Lendo textos com mais autonomia — CONCLUÍDA
`9 lições + N1-U01-V01`

### U2 — Palavras: ortografia, acentuação e sentidos — CONCLUÍDA
`10 lições + N1-U02-V01`

Escopo normativo: `docs/referencias-ortografia-nivel-1.md`.

### U3 — Classes, flexões e construção da frase — CONCLUÍDA
`10 lições + N1-U03-V01`

### U4 — Da frase ao parágrafo: conectando e pontuando ideias — CONCLUÍDA
`9 lições + N1-U04-V01`

### U5 — Produzindo textos curtos para diferentes finalidades — CONCLUÍDA

```text
10 lições + N1-U05-V01
```

Cobertura:

- planejamento proporcional por finalidade, leitor e informação necessária;
- organização de texto curto e decisão funcional de parágrafos;
- mensagens, bilhetes e avisos com produção própria;
- relato/narrativa curta com sequência e referência;
- descrição guiada pela finalidade, sem premiar quantidade de adjetivos;
- instruções/procedimentos com executabilidade básica;
- pequeno texto informativo com fonte fornecida e registro simples de origem;
- resumo/anotação com seleção do essencial e palavras próprias;
- opinião simples acompanhada de razão relacionada;
- revisão em camadas, preservação de versão anterior e reescrita.

A verificação integrada exige **duas produções próprias com finalidades diferentes**:

1. texto funcional/informativo baseado em fonte fornecida;
2. opinião própria acompanhada de razão.

Ao menos a primeira percorre `plano → rascunho → revisão → reescrita`, preservando histórico. Questões fechadas não compensam produção ausente.

Limite de validação registrado na própria verificação:

```text
processo/evidência registrada pela aplicação
≠
qualidade linguística global validada automaticamente
```

A aplicação pode verificar presença de etapas, decisões objetivas, histórico e checklists. Compreensibilidade global, fidelidade de paráfrase aberta, adequação global e correção linguística plena dependem de avaliador confiável.

Revisões implementadas antes do fechamento:

- procedimento digital reescrito com sequência executável e não ambígua;
- exemplo de enumeração em revisão corrigido para não misturar ações semanticamente incompatíveis.

Nenhuma nova mídia humana obrigatória foi criada.

## Guard rails acumulados do N1

- parágrafo não tem tamanho fixo;
- repetição não é erro automático;
- conector é escolhido pela relação;
- pontuação não é regra de respiração;
- não separar sujeito simples e verbo por vírgula;
- classes/gramática servem a uso, compreensão e revisão;
- regra ortográfica parcial não vira regra universal;
- produção aberta não recebe selo automático de qualidade por tamanho, palavras-chave ou semelhança com modelo;
- revisão preserva trechos corretos e pode aceitar soluções equivalentes.

## Foco curricular atual

```text
NÍVEL 0 — M5 concluído
NÍVEL 1 — M1–M4 concluídos
└── M5 — MARCO ATIVO
    ├── U1 ✓
    ├── U2 ✓
    ├── U3 ✓
    ├── U4 ✓
    ├── U5 ✓
    └── U6 — PRÓXIMO SUBPASSO
```

Próximo marco:

```text
N1-U06 — Língua em interação: oralidade, registros e variação
8 lições + verificação integrada
```

Depois:

```text
U7
→ verificação de saída do N1
→ checkpoint N1→N2
```

## Regras de continuidade

1. Nenhuma unidade entra em M5 sem M4 consolidado.
2. Descobertas locais devem ser conferidas contra `docs/matriz-progressao-global.md`.
3. Atualizar este roadmap no mesmo PR que alterar materialmente o estado curricular.
4. Produções abertas e orais não podem receber validação automática falsa.
5. Terminologia deve produzir ganho de compreensão/revisão, não ser fim classificatório.
6. Contraexemplos devem aparecer cedo quando uma simplificação puder virar regra falsa.
7. Em revisão, preservar trechos corretos e aceitar soluções equivalentes quando a competência permitir.

## Dependências não curriculares ainda abertas

- mídias humanas antigas de U1/U2 do N0 em `producao-midia/FILA-MIDIA.md`;
- frontend sem catálogo/renderer das unidades desenvolvidas;
- validação plena de respostas abertas dependente de avaliador confiável;
- produção oral compreensível dependente de observação externa futura.

## Fontes de verdade

```text
visão geral → docs/mapa-curso.md
M1 N1–N4 → docs/mapa-niveis-1-4.md
matriz global → docs/matriz-progressao-global.md
N1 M2 → docs/areas-nivel-1.md
N1 M3 → docs/unidades-nivel-1.md
N1 M4 → docs/licoes-nivel-1.md + docs/licoes-nivel-1-u*.md
escopo normativo N1-U02 → docs/referencias-ortografia-nivel-1.md
transição N0→N1 → docs/transicao-n0-n1.md
estado atual → docs/roadmap-curricular.md
conteúdo → content/
