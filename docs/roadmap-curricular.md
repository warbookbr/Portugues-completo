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
- **M5 em andamento** — **U1, U2, U3 e U4 concluídas**; U5–U7 pendentes.

A passagem N0→N1 foi auditada em `docs/transicao-n0-n1.md`.

### Níveis 2, 3 e 4

**M1 concluído** para os três níveis.

## N1 — M5

### U1 — Lendo textos com mais autonomia — CONCLUÍDA

```text
9 lições + N1-U01-V01
```

### U2 — Palavras: ortografia, acentuação e sentidos — CONCLUÍDA

```text
10 lições + N1-U02-V01
```

Escopo normativo: `docs/referencias-ortografia-nivel-1.md`.

### U3 — Classes, flexões e construção da frase — CONCLUÍDA

```text
10 lições + N1-U03-V01
```

### U4 — Da frase ao parágrafo: conectando e pontuando ideias — CONCLUÍDA

```text
9 lições + N1-U04-V01
```

Cobertura:

- parágrafo como bloco gráfico/de sentido sem tamanho fixo;
- continuidade, ordenação, frase intrusa e contradição apenas quando sustentada;
- referência por pronome, expressão nominal e repetição funcional;
- adição, sequência, causa, resultado, contraste e explicação com conectores escolhidos pelo sentido;
- ponto final, interrogação e exclamação em textos;
- vírgula apenas nos usos estudados: enumeração e chamamento direto;
- dois-pontos para lista anunciada, explicação e fala em casos transparentes;
- fala/citação simples com travessão ou aspas;
- revisão em passes: sentido → continuidade/referência → conectores → pontuação;
- verificação integrada com tarefa real de edição.

Guard rails consolidados:

- parágrafo não tem número obrigatório de frases;
- repetição não é erro automático;
- conector é escolhido pela relação, não para enfeitar o texto;
- sequência temporal não é automaticamente causa;
- pontuação não é regra de respiração;
- não inserir vírgula entre sujeito simples e verbo por analogia com chamamento;
- somente os usos de pontuação efetivamente ensinados são avaliados;
- versões equivalentes de revisão são aceitas quando preservam sentido e convenções estudadas.

Revisões implementadas antes do fechamento:

- modelos de edição foram tornados mais naturais (`O curso também oferece...`, `Os participantes também devem...`);
- exemplo de retomada nominal foi explicitado para reduzir ambiguidade conceitual.

Nenhuma nova mídia humana obrigatória foi criada.

## Foco curricular atual

```text
NÍVEL 0 — M5 concluído
NÍVEL 1 — M1–M4 concluídos
└── M5 — MARCO ATIVO
    ├── U1 ✓
    ├── U2 ✓
    ├── U3 ✓
    ├── U4 ✓
    └── U5 — PRÓXIMO SUBPASSO
```

Próximo marco:

```text
N1-U05 — Produzindo textos curtos para diferentes finalidades
10 lições + verificação integrada
```

Depois:

```text
U6 → U7
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
8. Em sintaxe básica, apresentar contraexemplos cedo quando uma regra simplificada puder virar falsa generalização.
9. Em pontuação, ensinar função textual/sintática; não usar pausa respiratória como regra.
10. Em revisão, preservar trechos corretos e aceitar soluções equivalentes quando a competência não exige uma única formulação.

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
