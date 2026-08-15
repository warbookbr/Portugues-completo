# Roadmap Curricular

## Objetivo

Este documento responde rapidamente:

```text
Onde estamos?
Qual é o marco ativo?
Qual é o próximo subpasso interno?
Que condição estrutural precisa ser atendida antes de aprofundar mais?
```

Fontes relacionadas:

- `docs/mapa-curso.md` — visão geral do percurso e detalhamento consolidado do Nível 0;
- `docs/mapa-niveis-1-4.md` — camada `M1` dos Níveis 1–4;
- `docs/matriz-progressao-global.md` — progressão transversal dos grandes domínios;
- `docs/unidades-nivel-0.md` — unidades do Nível 0;
- `docs/licoes-nivel-0.md` — arquitetura das Unidades 1–5;
- `docs/licoes-nivel-0-unidade-6.md` — arquitetura da Unidade 6;
- `docs/checkpoint-saida-nivel-0.md` — auditoria das competências de saída do Nível 0;
- `content/` — conteúdo efetivamente desenvolvido;
- `docs/execucao-continua.md` — protocolo para execução por marcos.

## Escala de maturidade

```text
M0 — esboço
M1 — nível mapeado
M2 — áreas dimensionadas
M3 — unidades dimensionadas
M4 — lições dimensionadas
M5 — conteúdo desenvolvido
```

A escala mede maturidade de planejamento/desenvolvimento, não progresso do aluno nem prontidão de publicação.

## Estado macro atual

### Nível 0 — Fundamentos

Estado curricular: **`M5` concluído**.

- `M1` concluído;
- `M2` concluído;
- `M3` concluído: seis unidades dimensionadas;
- `M4` concluído: todas as seis unidades possuem arquitetura de lições;
- `M5` concluído: **U1–U6 possuem conteúdo detalhado e verificação integrada**;
- verificação de saída do nível criada em `content/levels/000-fundamentos/exit-verification.json`;
- competências de saída auditadas em `docs/checkpoint-saida-nivel-0.md`.

O fechamento curricular **não** significa publicação pronta. Permanecem dependências técnicas e de mídia descritas abaixo.

### Nível 1 — Básico

Estado atual: **`M1` concluído**.

Próximo avanço estrutural: `M1 → M2`, dimensionando suas áreas antes de organizar unidades ou produzir conteúdo.

### Nível 2 — Intermediário

Estado atual: **`M1` concluído**.

### Nível 3 — Avançado

Estado atual: **`M1` concluído**.

### Nível 4 — Domínio

Estado atual: **`M1` concluído**.

## Checkpoint global após a Unidade 3

Status: **CONCLUÍDO**.

```text
N1 — M0 → M1 ✓
N2 — M0 → M1 ✓
N3 — M0 → M1 ✓
N4 — M0 → M1 ✓
matriz global ✓
revisão de lacunas/sobreposições ✓
```

## Fechamento do Nível 0

Status curricular: **CONCLUÍDO**.

```text
U1 — M5 ✓
U2 — M5 ✓
U3 — M5 ✓
U4 — M5 ✓
U5 — M5 ✓
U6 — M5 ✓
verificações integradas U1–U6 ✓
verificação de saída do N0 ✓
mapeamento das competências de saída ✓
```

### Unidade 6 — Usando a língua no cotidiano

Conteúdo desenvolvido:

```text
1. Quem, para quem e para quê?
2. Perguntar para obter informação
3. Responder e fornecer informação
4. Pedir, oferecer e orientar
5. Avisos, instruções e mensagens do cotidiano
6. Ouvindo mensagens curtas e identificando o principal
7. Mais formal ou mais informal?
8. Maneiras diferentes de usar o português
9. Quando não entendo: repetir, esclarecer e confirmar
10. Reformular e confirmar que a comunicação funcionou
+ verificação integrada
```

A U6 fecha o percurso funcional do Nível 0 sem se tornar revisão geral disfarçada. TTS mede compreensão oral quando a resposta depende do significado e não de prosódia específica.

### Limite de produção oral

Sem reconhecimento de fala ou avaliação humana/externa confiável:

```text
prática oral registrada
≠
produção oral compreensível validada
```

A U6 e a verificação de saída preservam essa distinção. O nível pode ser curricularmente fechado sem fingir que a limitação técnica deixou de existir.

### Dependências ainda abertas fora da maturidade curricular

**Mídia:** U1 e U2 ainda possuem mídias humanas obrigatórias já registradas em `producao-midia/FILA-MIDIA.md`.

**Frontend:** o catálogo/renderer ainda não publica as unidades desenvolvidas; `content/course.json` continua sem unidades publicadas por decisão deliberada.

**Respostas abertas:** validação linguística plena depende de avaliador confiável; o fluxo autônomo registra produção e autochecagem.

**Produção oral:** validação de compreensibilidade depende de observação externa futura.

Portanto:

```text
N0 curricularmente fechado
≠ N0 pronto para publicação
≠ N0 completamente validado por um aluno real
```

## Foco curricular atual

```text
NÍVEL 0 — curricularmente fechado em M5

NÍVEL 1 — MARCO ATIVO
└── elevar de M1 para M2
    └── dimensionar grandes áreas — PRÓXIMO SUBPASSO INTERNO
```

Último marco curricular concluído:

```text
N0 — U1–U6 em M5 + verificação de saída + checkpoint de competências
```

Marco ativo:

```text
N1 — dimensionar áreas em M2
```

Próximo subpasso interno:

```text
N1-M2 — transformar as grandes áreas do mapa M1 em áreas dimensionadas com objetivo, competências, conteúdos essenciais e limites
```

## Gate para avançar o Nível 1

Antes de autoria detalhada do N1:

```text
M1 — concluído
→ M2 — dimensionar áreas
→ revisão contra saída do N0 e matriz global
→ M3 — organizar unidades
→ somente então M4/M5
```

O dimensionamento M2 deve garantir especialmente as responsabilidades do N1 na matriz global: consolidação da alfabetização, leitura básica ampliada, textos curtos/parágrafos, ortografia/acentuação inicial sistemática, classes/flexões fundamentais, sintaxe e concordância básicas, vocabulário, pontuação ampliada, gêneros/oralidade, registro/variação, literatura/multimodalidade e primeiros contatos com argumento e fontes.

## Cobertura global

A fonte oficial continua sendo `docs/matriz-progressao-global.md`.

## Regras de continuidade

1. Detalhar mais o que está mais próximo.
2. Nenhum nível entra em autoria detalhada sem `M1–M3` suficientemente consolidados.
3. Corrigir a camada apropriada quando surgir lacuna estrutural real.
4. Atualizar este roadmap quando o estado curricular mudar.
5. Executar marcos autorizados sem confirmações repetidas conforme `docs/execucao-continua.md`.

## Sequência prevista

```text
MARCO ATIVO — NÍVEL 1
1. dimensionar áreas do N1 em M2
2. revisar conexão N0 → N1 e matriz global
3. consolidar M2

MARCO SEGUINTE — NÍVEL 1 M3
4. organizar áreas em unidades pedagógicas
5. dimensionar cada unidade
6. revisar cobertura e dependências

DEPOIS
7. dimensionar lições do N1 em M4
8. só então iniciar autoria M5
```

## Fonte de verdade e manutenção

```text
visão geral do curso
→ docs/mapa-curso.md

M1 dos Níveis 1–4
→ docs/mapa-niveis-1-4.md

progressão transversal
→ docs/matriz-progressao-global.md

estado e próximo marco
→ docs/roadmap-curricular.md

checkpoint de saída N0
→ docs/checkpoint-saida-nivel-0.md

execução contínua
→ docs/execucao-continua.md

arquitetura U1–U5
→ docs/licoes-nivel-0.md

arquitetura U6
→ docs/licoes-nivel-0-unidade-6.md

conteúdo detalhado
→ content/
```
