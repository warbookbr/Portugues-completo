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

**M5 concluído.**

- seis unidades desenvolvidas;
- verificações integradas U1–U6;
- verificação de saída `N0-EXIT-V01`;
- competências de saída auditadas em `docs/checkpoint-saida-nivel-0.md`.

Permanece a distinção:

```text
currículo fechado
≠ publicação pronta
≠ validação externa de toda resposta aberta/oral
```

### Nível 1 — Básico

- **M1 concluído** — `docs/mapa-niveis-1-4.md`;
- **M2 concluído** — 10 áreas em `docs/areas-nivel-1.md`;
- **M3 concluído** — 7 unidades em `docs/unidades-nivel-1.md`;
- **M4 concluído** — 64 lições + 7 verificações integradas dimensionadas em `docs/licoes-nivel-1.md` e `docs/licoes-nivel-1-u1.md` a `docs/licoes-nivel-1-u7.md`;
- **M5 ainda não concluído**.

A passagem N0→N1 foi auditada em `docs/transicao-n0-n1.md` e não exige reabrir o N0.

### Níveis 2, 3 e 4

**M1 concluído** para os três níveis. O detalhamento adicional continua deliberadamente posterior ao avanço coerente do N1.

## Arquitetura do Nível 1

### M2 — 10 áreas

1. Leitura e compreensão básica ampliada
2. Produção de textos curtos e parágrafos
3. Ortografia, acentuação e convenções frequentes
4. Palavras, classes e flexões fundamentais
5. Frase, relações sintáticas básicas e concordância
6. Vocabulário, semântica e formação básica de palavras
7. Pontuação e organização gráfica ampliadas
8. Gêneros, oralidade e uso social da língua
9. Registro, variação e adequação
10. Literatura, multimodalidade e fontes iniciais

### M3 — 7 unidades

1. Lendo textos com mais autonomia
2. Palavras: ortografia, acentuação e sentidos
3. Classes, flexões e construção da frase
4. Da frase ao parágrafo: conectando e pontuando ideias
5. Produzindo textos curtos para diferentes finalidades
6. Língua em interação: oralidade, registros e variação
7. Literatura, multimodalidade e leitura digital

### M4 — 64 lições

```text
U1 — 9 lições
U2 — 10 lições
U3 — 10 lições
U4 — 9 lições
U5 — 10 lições
U6 — 8 lições
U7 — 8 lições
+ 1 verificação integrada por unidade
```

A progressão preservada é:

```text
leitura ampliada
→ ortografia/acentuação/semântica
→ classes/flexões/sintaxe
→ parágrafo/coesão/pontuação
→ produção de textos/gêneros
→ oralidade/registro/variação
→ literatura/multimodalidade/digital/fontes
```

## Foco curricular atual

```text
NÍVEL 0 — M5 concluído
NÍVEL 1 — M1–M4 concluídos
└── M5 — MARCO ATIVO
    └── desenvolver U1 — PRÓXIMO SUBPASSO
```

Próximo marco:

```text
N1-U01 — desenvolver as 9 lições e a verificação integrada
```

Depois:

```text
U2 → U3 → U4 → U5 → U6 → U7
→ verificação de saída do N1
→ checkpoint N1→N2
```

## Regras de continuidade

1. Nenhuma unidade entra em M5 sem M4 consolidado.
2. Descobertas locais devem ser conferidas contra `docs/matriz-progressao-global.md`.
3. Ortografia e gramática não devem virar taxonomia isolada: uso, compreensão, aplicação e revisão continuam centrais.
4. Produções abertas e orais não podem receber validação automática falsa quando a aplicação não possui avaliador confiável.
5. Atualizar este roadmap no mesmo PR que alterar materialmente o estado curricular.

## Dependências não curriculares ainda abertas

- mídias humanas antigas de U1/U2 do N0 registradas em `producao-midia/FILA-MIDIA.md`;
- frontend ainda sem catálogo/renderer das unidades desenvolvidas;
- respostas abertas dependem de avaliador confiável para correção linguística plena;
- produção oral compreensível depende de observação externa futura.

Essas dependências não bloqueiam o desenvolvimento curricular do N1.

## Fontes de verdade

```text
visão geral
→ docs/mapa-curso.md

M1 N1–N4
→ docs/mapa-niveis-1-4.md

matriz global
→ docs/matriz-progressao-global.md

N1 M2
→ docs/areas-nivel-1.md

N1 M3
→ docs/unidades-nivel-1.md

N1 M4
→ docs/licoes-nivel-1.md + docs/licoes-nivel-1-u*.md

transição N0→N1
→ docs/transicao-n0-n1.md

estado atual
→ docs/roadmap-curricular.md

conteúdo
→ content/
