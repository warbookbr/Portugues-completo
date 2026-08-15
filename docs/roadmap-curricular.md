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

**M5 curricularmente concluído.** Seis unidades, verificações integradas U1–U6, verificação de saída `N0-EXIT-V01` e auditoria de competências concluídas.

### Nível 1 — Básico

**M5 curricularmente concluído.**

- M1 — `docs/mapa-niveis-1-4.md`;
- M2 — `docs/areas-nivel-1.md`;
- M3 — `docs/unidades-nivel-1.md`;
- M4 — `docs/licoes-nivel-1.md` + U1–U7;
- M5 — sete unidades com conteúdo e verificações integradas;
- saída — `content/levels/001-basico/exit-verification.json`;
- checkpoint — `docs/checkpoint-saida-nivel-1.md`;
- transição — `docs/transicao-n1-n2.md`.

A auditoria de saída não encontrou lacuna curricular obrigatória que exija reabrir U1–U7 antes do N2.

```text
currículo fechado
≠ publicação pronta
≠ validação automática plena de toda escrita/fala aberta
```

### Nível 2 — Intermediário

- **M1 concluído** — `docs/mapa-niveis-1-4.md`;
- **M2 concluído** — 11 áreas em `docs/areas-nivel-2.md`;
- **M3 concluído** — 9 unidades em `docs/unidades-nivel-2.md`;
- **M4 concluído** — **87 lições + 9 verificações integradas** em `docs/licoes-nivel-2.md` e documentos U1–U9;
- **M5 em andamento** — **U1 concluída**; U2–U9 pendentes.

Arquitetura M4:

```text
U1  10 — Leitura intermediária: estrutura, inferência e ponto de vista
U2  11 — Palavras em sistema: ortografia, acentuação, morfologia e precisão
U3  10 — Oração e termos: construindo e revisando relações sintáticas
U4  11 — Do período simples ao composto: relações, regência e pontuação
U5   9 — Coesão e coerência em textos de vários parágrafos
U6  10 — Produzindo e reescrevendo textos de vários parágrafos
U7   9 — Argumentar: posição, razões, exemplos e evidências
U8   8 — Língua em interação: apresentação, discussão, registro e variação
U9   9 — Literatura, multimodalidade e comparação de fontes
```

### N2-U1 — Leitura intermediária: estrutura, inferência e ponto de vista — CONCLUÍDA

```text
10 lições + N2-U01-V01
```

Cobertura:

- plano de leitura para textos de vários parágrafos;
- foco por parágrafo e organização global sem molde fixo;
- informação principal, secundária relevante e detalhe lateral;
- integração explícita de informações distribuídas;
- cadeias referenciais mais longas e reparo de ambiguidade;
- causa, consequência, condição, contraste e conclusão;
- inferência com duas ou mais pistas distribuídas;
- ponto de vista/perspectiva com evidência e sem intenção autoral inventada;
- distinção entre explícito, inferência apoiada e informação insuficiente;
- síntese própria de texto de vários parágrafos.

A verificação integrada usa texto novo de cinco parágrafos e mantém oito agrupamentos obrigatórios: estrutura/hierarquia, integração de explícitos, referência, relações lógicas, inferência distribuída, perspectiva/evidência, informação insuficiente e síntese própria.

Regras preservadas:

- texto permanece disponível e releitura é permitida;
- velocidade e número de releituras não determinam aprovação;
- inferência exige pistas pertinentes;
- `não há informação suficiente` é resposta legítima quando o material realmente não decide;
- integração de informações explícitas não é tratada automaticamente como inferência;
- síntese própria é obrigatória, mas não recebe falsa validação semântica por palavras-chave;
- TTS é apoio opcional, sem nova mídia humana obrigatória.

Revisão implementada antes do fechamento:

- um item de referenciação foi corrigido para usar dois referentes femininos realmente concorrentes (`a planilha` / `a ficha`), removendo uma ambiguidade artificial que a concordância de gênero resolvia sozinha.

### Níveis 3 e 4

**M1 concluído.** M2–M5 ainda pendentes.

## Foco curricular atual

```text
NÍVEL 0 — M5 ✓
NÍVEL 1 — M5 ✓
NÍVEL 2 — M1–M4 ✓
└── M5 — MARCO ATIVO
    ├── U1 ✓
    └── U2 — PRÓXIMO SUBPASSO
```

Próximo subpasso:

```text
N2-U02 — Palavras em sistema: ortografia, acentuação, morfologia e precisão
11 lições + verificação integrada
```

Antes do M5 da U2, o recorte normativo exato de ortografia/acentuação deve ser conferido e registrado a partir de fontes normativas primárias adequadas.

Depois:

```text
N2-U3 → U4 → U5 → U6 → U7 → U8 → U9
→ verificação de saída N2
→ checkpoint N2→N3
```

## Responsabilidades críticas do N2

O N2 deve avançar de autonomia básica para uso intermediário organizado e justificável:

- textos de vários parágrafos como rotina;
- inferência com pistas distribuídas e evidência;
- ortografia/acentuação ampliadas com escopo normativo explícito;
- sistema morfológico mais completo sem taxonomia enciclopédica;
- oração/período e termos fundamentais usados para revisão;
- concordância, regência, crase e colocação em recortes frequentes;
- coesão/coerência global;
- produção e reescrita de vários parágrafos;
- argumentação `posição → razão → exemplo/evidência → objeção simples`;
- apresentação/discussão curta com limites técnicos de validação oral;
- literatura/multimodalidade e comparação de duas fontes.

## Regras de continuidade

1. Nenhuma unidade entra em M5 sem reler M1–M4 e a transição N1→N2.
2. Descobertas locais devem ser conferidas contra `docs/matriz-progressao-global.md`.
3. Atualizar este roadmap no mesmo PR que alterar materialmente o estado curricular.
4. Produções abertas e orais não podem receber validação automática falsa.
5. Terminologia deve produzir ganho de compreensão, produção ou revisão.
6. Contraexemplos devem aparecer cedo quando uma simplificação puder virar regra falsa.
7. Em ortografia, acentuação, regência, crase e colocação, o M5 deve registrar/conferir o recorte em fontes normativas primárias adequadas.
8. Vírgula não é ensinada por respiração; crase não é ensinada por truque isolado; sujeito não é identificado por posição mecânica.
9. Coesão não é contagem de conectores e repetição não é erro automático.
10. Argumentação avalia relação entre posição e apoio, não concordância ideológica.
11. Interpretações literárias diferentes são aceitas quando sustentadas por evidência.
12. Ao comparar fontes, divergência pode legitimamente exigir confirmação adicional.

## Dependências não curriculares abertas

- mídias humanas antigas do N0 em `producao-midia/FILA-MIDIA.md`;
- frontend ainda sem catálogo/renderer completo das unidades desenvolvidas;
- validação plena de respostas abertas depende de avaliador confiável;
- inteligibilidade da produção oral depende de observação externa confiável.

Essas dependências não impedem autoria curricular M5 quando a atividade registra corretamente seus limites.

## Fontes de verdade

```text
visão geral → docs/mapa-curso.md
M1 N1–N4 → docs/mapa-niveis-1-4.md
matriz global → docs/matriz-progressao-global.md

N1 M2 → docs/areas-nivel-1.md
N1 M3 → docs/unidades-nivel-1.md
N1 M4 → docs/licoes-nivel-1.md + docs/licoes-nivel-1-u*.md
N1 saída → docs/checkpoint-saida-nivel-1.md + content/levels/001-basico/exit-verification.json
N1→N2 → docs/transicao-n1-n2.md

N2 M2 → docs/areas-nivel-2.md
N2 M3 → docs/unidades-nivel-2.md
N2 M4 → docs/licoes-nivel-2.md + docs/licoes-nivel-2-u*.md

estado atual → docs/roadmap-curricular.md
conteúdo desenvolvido → content/
```