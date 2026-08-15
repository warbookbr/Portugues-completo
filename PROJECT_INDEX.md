# Índice do Projeto — Português Completo

## Objetivo

Este arquivo é o mapa mestre do projeto. Ele localiza as fontes oficiais antes de qualquer trabalho.

## Visão geral

```text
Português Completo
├── README.md                  → apresentação pública do repositório
├── index.html + app/          → aplicação
├── content/                   → conteúdo pedagógico
├── producao-midia/            → coordenação de mídia
├── docs/                      → fontes de verdade
├── scripts/ + .github/        → validação
└── .ChatGPT/                  → procedimentos/skills
```

## Fontes curriculares principais

### Estado e execução

- `docs/roadmap-curricular.md` — estado atual, maturidade, marco ativo e próximo subpasso.
- `docs/execucao-continua.md` — execução autônoma por marcos autorizados.
- `.ChatGPT/skills/curricular-orchestration/SKILL.md` — orquestração de marcos longos.
- `.ChatGPT/skills/course-content-design/SKILL.md` — planejamento/revisão pedagógica.

### Curso inteiro

- `docs/mapa-curso.md` — visão geral e detalhamento consolidado do Nível 0.
- `docs/mapa-niveis-1-4.md` — camada `M1` dos Níveis 1–4.
- `docs/matriz-progressao-global.md` — progressão transversal N0–N4.

### Nível 0

- `docs/unidades-nivel-0.md` — unidades.
- `docs/licoes-nivel-0.md` — arquitetura U1–U5.
- `docs/licoes-nivel-0-unidade-6.md` — arquitetura U6.
- `docs/checkpoint-saida-nivel-0.md` — auditoria de saída.
- `content/levels/000-fundamentos/exit-verification.json` — verificação de saída.
- `content/units/` — conteúdo detalhado das seis unidades.

### Nível 1

- `docs/areas-nivel-1.md` — **M2**, dez áreas dimensionadas.
- `docs/unidades-nivel-1.md` — **M3**, sete unidades dimensionadas.
- `docs/transicao-n0-n1.md` — auditoria da passagem N0→N1.

Quando o N1 avançar para M4, registrar sua arquitetura de lições em documento próprio em `docs/` e atualizar este índice.

## Arquitetura e frontend

- `docs/arquitetura.md` — arquitetura, armazenamento e responsabilidades técnicas.
- `.ChatGPT/skills/frontend-visual-check/SKILL.md` — mudanças visuais relevantes.
- `index.html`
- `app/css/`
- `app/js/`
- `app/assets/`

Mídia pedagógica pesada não pertence a `app/assets/`.

## Conteúdo e mídia

- `docs/conteudo.md` — estrutura pedagógica e uso de mídia.
- `producao-midia/README.md` — contrato operacional de mídia.
- `producao-midia/FILA-MIDIA.md` — demandas humanas já identificadas.
- `content/course.json` — catálogo publicado pela aplicação; não adicionar unidades apenas porque o conteúdo JSON já foi desenvolvido.
- `content/units/` — conteúdo de unidades/lições/verificações.
- `content/levels/` — conteúdo/verificações transversais de nível.

## Validação

- `docs/validacoes.md`
- `scripts/validate-project.mjs`
- `scripts/validate-json.mjs`
- `.github/workflows/validate-project.yml`

Documentos previstos:

- `docs/exercicios.md` (quando criado)
- `docs/progresso.md` (quando criado)
- `docs/configuracoes.md` (quando criado)
- `docs/convencoes.md` (quando criado)

## Fontes de verdade

```text
arquitetura
→ docs/arquitetura.md

visão geral curricular
→ docs/mapa-curso.md

M1 N1–N4
→ docs/mapa-niveis-1-4.md

matriz transversal
→ docs/matriz-progressao-global.md

N1 M2
→ docs/areas-nivel-1.md

N1 M3
→ docs/unidades-nivel-1.md

estado/marcos
→ docs/roadmap-curricular.md

execução contínua
→ docs/execucao-continua.md

conteúdo detalhado
→ content/

forma de ensinar/mídia
→ docs/conteudo.md

produção de mídia
→ producao-midia/README.md + producao-midia/FILA-MIDIA.md

validação automática
→ docs/validacoes.md

procedimentos ChatGPT
→ .ChatGPT/skills/
```

Se uma decisão mudar uma fonte de verdade, atualizar a documentação correspondente em vez de depender da conversa.

## Regra de organização

Antes de criar um arquivo/diretório, verificar se já existe área responsável. Evitar documentação duplicada, conteúdo pedagógico escondido em JavaScript, regras arquiteturais em código, mídia pedagógica misturada com assets da interface e novas fontes sem registro neste índice.

## Manutenção

Atualizar este arquivo quando surgir nova fonte oficial, skill ou mudança significativa de responsabilidade.

Depois de mudanças estruturais ou JSON:

```text
node scripts/validate-project.mjs
node scripts/validate-json.mjs
```

O workflow executa essas validações em PRs e pushes para `main`.
