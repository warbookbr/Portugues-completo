# Índice do Projeto — Português Completo

## Objetivo

Este arquivo é o mapa mestre do projeto. Antes de qualquer trabalho, ele localiza as fontes oficiais, o estado curricular e os procedimentos aplicáveis.

## Visão geral

```text
Português Completo
├── README.md
├── PROJECT_INDEX.md
├── index.html + app/
├── content/
├── producao-midia/
├── docs/
├── scripts/ + .github/
└── .ChatGPT/
```

## Estado e execução

- `docs/roadmap-curricular.md` — estado real, maturidade, marco ativo e próximo subpasso.
- `docs/execucao-continua.md` — execução autônoma por marcos autorizados.
- `.ChatGPT/skills/curricular-orchestration/SKILL.md` — orquestração de marcos longos.
- `.ChatGPT/skills/course-content-design/SKILL.md` — planejamento e revisão pedagógica.
- `.ChatGPT/skills/frontend-visual-check/SKILL.md` — verificação de mudanças visuais relevantes.

## Curso inteiro

- `docs/mapa-curso.md` — visão geral curricular e detalhamento consolidado do Nível 0.
- `docs/mapa-niveis-1-4.md` — camada M1 dos Níveis 1–4.
- `docs/matriz-progressao-global.md` — progressão transversal N0–N4.

## Nível 0

- `docs/unidades-nivel-0.md`
- `docs/licoes-nivel-0.md`
- `docs/licoes-nivel-0-unidade-6.md`
- `docs/checkpoint-saida-nivel-0.md`
- `content/levels/000-fundamentos/exit-verification.json`

## Nível 1

- `docs/areas-nivel-1.md`
- `docs/unidades-nivel-1.md`
- `docs/licoes-nivel-1.md` + `docs/licoes-nivel-1-u1.md` ... `u7.md`
- `docs/referencias-ortografia-nivel-1.md`
- `docs/checkpoint-saida-nivel-1.md`
- `docs/transicao-n0-n1.md`
- `docs/transicao-n1-n2.md`
- `content/levels/001-basico/exit-verification.json`

## Nível 2

- `docs/areas-nivel-2.md`
- `docs/unidades-nivel-2.md`
- `docs/licoes-nivel-2.md` + `docs/licoes-nivel-2-u1.md` ... `u9.md`
- `docs/referencias-ortografia-nivel-2.md`
- `docs/referencias-gramatica-nivel-2-u4.md`
- `docs/checkpoint-saida-nivel-2.md`
- `docs/transicao-n2-n3.md`
- `content/levels/002-intermediario/exit-verification.json`

## Nível 3

### Arquitetura curricular

- `docs/areas-nivel-3.md` — M2.
- `docs/unidades-nivel-3.md` — M3.
- `docs/licoes-nivel-3.md` + `docs/licoes-nivel-3-u1.md` ... `u9.md` — M4, 94 lições + 9 verificações.

### Gates e referências

- `docs/referencias-gramatica-nivel-3-u3.md` — gate normativo satisfeito.
- `docs/gate-audiovisual-nivel-3-u9.md` — gate audiovisual/acessibilidade satisfeito.

### Conteúdo M5

- `content/units/301-leitura-critica-textos-longos/`
- `content/units/302-argumentacao-avancada/`
- `content/units/303-sintaxe-complexa-norma-efeitos/`
- `content/units/304-fontes-multiplas-sintese-leitura-critica/`
- `content/units/305-producao-longa-generos-formais-analiticos/`
- `content/units/306-estilo-precisao-edicao-avancada/`
- `content/units/307-comunicacao-formal-debate-estruturado/`
- `content/units/308-variacao-norma-prestigio-identidade/`
- `content/units/309-literatura-intertextualidade-midia-critica/`
- `content/levels/003-avancado/exit-verification.json` — `N3-EXIT-V01`.
- `docs/checkpoint-saida-nivel-3.md` — auditoria das 18 competências e fronteira N3→N4.

O N3 está curricularmente fechado em M5.

## Nível 4

### Arquitetura curricular

- `docs/mapa-niveis-1-4.md` — M1: objetivo, 17 competências oficiais e nove responsabilidades.
- `docs/areas-nivel-4.md` — M2: nove áreas, cobertura 17/17.
- `docs/unidades-nivel-4.md` — M3: nove unidades integradas e arquitetura antecipada da saída.
- `docs/licoes-nivel-4.md` — M4: 93 lições + 9 verificações.
- `docs/licoes-nivel-4-u1.md` ... `docs/licoes-nivel-4-u9.md` — M4 por unidade.

### Gates do N4

- `docs/gate-normativo-nivel-4-u5-u7.md` — pesquisa obrigatória antes de congelar respostas normativas no M5 de U5/U7.
- `docs/gate-midia-acessibilidade-nivel-4-u9.md` — satisfeito para a arquitetura atual; reabrir apenas se M5 introduzir alvo sensorial real insubstituível.

### Conteúdo M5

- `content/units/401-leitura-estrategica-alta-complexidade-revisao-interpretacao/` — **U1 concluída**, 10 lições + `N4-U01-V01`.

A U1 implementa o salto específico do N4: escolha e eventual troca justificada de estratégia, arquiteturas concorrentes defensáveis, preservação de condições/ressalvas, leitura de cadeias distribuídas, implícitos/intertextualidade com evidência, enquadramento sem inferir manipulação, calibração epistêmica e revisão explícita da interpretação após nova evidência.

Estado:

```text
M1 ✓
M2 ✓ — 9 áreas
M3 ✓ — 9 unidades
M4 ✓ — 93 lições + 9 verificações integradas
M5 em andamento
├── U1 ✓ — 10 lições + N4-U01-V01
└── U2 — próximo subpasso
```

A fonte oficial do estado é `docs/roadmap-curricular.md`.

## Arquitetura e frontend

- `docs/arquitetura.md`
- `index.html`
- `app/css/`
- `app/js/`
- `app/assets/`

Mídia pedagógica pesada não pertence a `app/assets/`.

## Conteúdo e mídia

- `docs/conteudo.md` — estrutura pedagógica e uso de mídia.
- `producao-midia/README.md` — contrato operacional de mídia.
- `producao-midia/FILA-MIDIA.md` — fila oficial.
- `content/course.json` — catálogo publicado; não adicionar unidades apenas porque o JSON curricular foi desenvolvido.
- `content/units/` — conteúdo de unidades, lições e verificações.
- `content/levels/` — verificações e conteúdo transversal de nível.

## Validação

- `docs/validacoes.md`
- `scripts/validate-project.mjs`
- `scripts/validate-json.mjs`
- `.github/workflows/validate-project.yml`

## Fontes de verdade

```text
arquitetura → docs/arquitetura.md
visão geral curricular → docs/mapa-curso.md
M1 N1–N4 → docs/mapa-niveis-1-4.md
matriz transversal → docs/matriz-progressao-global.md
N1 M2/M3/M4 → docs/areas-nivel-1.md + docs/unidades-nivel-1.md + docs/licoes-nivel-1*.md
N2 M2/M3/M4 → docs/areas-nivel-2.md + docs/unidades-nivel-2.md + docs/licoes-nivel-2*.md
N3 M2/M3/M4 → docs/areas-nivel-3.md + docs/unidades-nivel-3.md + docs/licoes-nivel-3*.md
N3 saída → docs/checkpoint-saida-nivel-3.md + content/levels/003-avancado/exit-verification.json
N4 M2 → docs/areas-nivel-4.md
N4 M3 → docs/unidades-nivel-4.md
N4 M4 → docs/licoes-nivel-4.md + docs/licoes-nivel-4-u*.md
N4 M5 → content/units/4xx-*/
N4 gates → docs/gate-normativo-nivel-4-u5-u7.md + docs/gate-midia-acessibilidade-nivel-4-u9.md
estado/marcos → docs/roadmap-curricular.md
conteúdo detalhado → content/
forma de ensinar/mídia → docs/conteudo.md
produção de mídia → producao-midia/README.md + producao-midia/FILA-MIDIA.md
validação automática → docs/validacoes.md
procedimentos ChatGPT → .ChatGPT/skills/
```

Se uma decisão mudar uma fonte de verdade, atualizar a documentação correspondente em vez de depender da conversa.

## Manutenção

Antes de criar arquivo ou diretório, verificar se já existe área responsável. Depois de mudanças estruturais ou JSON:

```text
node scripts/validate-project.mjs
node scripts/validate-json.mjs
```

O workflow executa essas validações em PRs e pushes para `main`.
