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
- **M5 em andamento** — **U1 e U2 concluídas**; U3–U7 pendentes.

A passagem N0→N1 foi auditada em `docs/transicao-n0-n1.md` e não exige reabrir o N0.

### Níveis 2, 3 e 4

**M1 concluído** para os três níveis.

## N1 — M5

### U1 — Lendo textos com mais autonomia — CONCLUÍDA

```text
9 lições + N1-U01-V01
```

Cobertura: objetivo de leitura; assunto/finalidade/principal; explícitos; referenciação; relações; inferência/insuficiência; multimodalidade acessível; autoria/fonte/opinião/razão; resumo próprio.

### U2 — Palavras: ortografia, acentuação e sentidos — CONCLUÍDA

```text
10 lições + N1-U02-V01
```

Cobertura:

- ortografia como padrões + convenções + consulta;
- `r/rr`, `c/qu`, `g/gu`, `m/n`, `nh/lh/ch` e `s/ss` em regularidades delimitadas;
- sílaba tônica e acento gráfico como conceitos distintos;
- oxítona, paroxítona e proparoxítona como ferramentas;
- primeira sistematização de acentuação: proparoxítonas, oxítonas terminadas em `a(s), e(s), o(s), em, ens` e monossílabos tônicos terminados em `a(s), e(s), o(s)`;
- proximidade/oposição de sentido, polissemia, precisão e figuratividade transparente;
- famílias de palavras, prefixos/sufixos introdutórios e consulta por acepção contextual.

O escopo normativo e os limites estão registrados em `docs/referencias-ortografia-nivel-1.md`. A unidade ensina explicitamente que uma regra correta pode não resolver um caso fora de seu recorte; reconhecer a necessidade de consulta é evidência de autonomia.

Revisões implementadas antes do fechamento:

- removido exemplo de `gu` que misturava comportamento sonoro diferente no mesmo grupo simplificado;
- removida generalização de que toda palavra da língua seria tônica;
- oposição semântica passou a ter prática e evidência própria;
- removido distrator morfologicamente ambíguo em família de palavras;
- verificação integrada passou a amostrar de fato todos os grupos ortográficos centrais da unidade.

Nenhuma nova mídia humana obrigatória foi criada.

## Foco curricular atual

```text
NÍVEL 0 — M5 concluído
NÍVEL 1 — M1–M4 concluídos
└── M5 — MARCO ATIVO
    ├── U1 ✓
    ├── U2 ✓
    └── U3 — PRÓXIMO SUBPASSO
```

Próximo marco:

```text
N1-U03 — Classes, flexões e construção da frase
10 lições + verificação integrada
```

Depois:

```text
U4 → U5 → U6 → U7
→ verificação de saída do N1
→ checkpoint N1→N2
```

## Regras de continuidade

1. Nenhuma unidade entra em M5 sem M4 consolidado.
2. Descobertas locais devem ser conferidas contra `docs/matriz-progressao-global.md`.
3. Ortografia e gramática não devem virar taxonomia isolada: uso, compreensão, aplicação e revisão continuam centrais.
4. Produções abertas e orais não podem receber validação automática falsa quando não há avaliador confiável.
5. Atualizar este roadmap no mesmo PR que alterar materialmente o estado curricular.
6. Em ortografia/acentuação, ensinar regularidades com escopo explícito e nunca transformar padrão parcial em regra universal.
7. Terminologia gramatical no N1 deve funcionar como ferramenta de compreensão/revisão, não como fim classificatório.

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
