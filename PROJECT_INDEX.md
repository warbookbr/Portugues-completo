# Índice do Projeto — Português Completo

## Objetivo

Este arquivo é o mapa mestre do projeto. Ele localiza as fontes oficiais antes de qualquer trabalho.

## Visão geral

```text
Português Completo
├── README.md                  → apresentação pública do repositório
├── PROJECT_INDEX.md           → este mapa
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
- `content/units/` — conteúdo detalhado.

### Nível 1

- `docs/areas-nivel-1.md` — M2, dez áreas dimensionadas.
- `docs/unidades-nivel-1.md` — M3, sete unidades dimensionadas.
- `docs/transicao-n0-n1.md` — auditoria N0→N1.
- `docs/licoes-nivel-1.md` — consolidação M4 do nível.
- `docs/licoes-nivel-1-u1.md` — arquitetura M4 da U1.
- `docs/licoes-nivel-1-u2.md` — arquitetura M4 da U2.
- `docs/licoes-nivel-1-u3.md` — arquitetura M4 da U3.
- `docs/licoes-nivel-1-u4.md` — arquitetura M4 da U4.
- `docs/licoes-nivel-1-u5.md` — arquitetura M4 da U5.
- `docs/licoes-nivel-1-u6.md` — arquitetura M4 da U6.
- `docs/licoes-nivel-1-u7.md` — arquitetura M4 da U7.
- `docs/referencias-ortografia-nivel-1.md` — escopo normativo e limites das regularidades/acentuação da N1-U02.

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
- `producao-midia/FILA-MIDIA.md` — fila oficial.
- `content/course.json` — catálogo publicado; não adicionar unidades apenas porque o JSON curricular foi desenvolvido.
- `content/units/` — conteúdo de unidades, lições e verificações.
- `content/levels/` — verificações ou conteúdo transversal de nível.

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

N1 M4
→ docs/licoes-nivel-1.md + docs/licoes-nivel-1-u1.md ... docs/licoes-nivel-1-u7.md

escopo normativo N1-U02
→ docs/referencias-ortografia-nivel-1.md

estado/marcos
→ docs/roadmap-curricular.md

transição N0→N1
→ docs/transicao-n0-n1.md

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
