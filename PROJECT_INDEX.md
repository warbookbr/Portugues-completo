# Índice do Projeto — Português Completo

## Objetivo

Este arquivo é o mapa mestre do projeto. Ele não substitui a documentação detalhada; serve para localizar rapidamente a fonte correta antes de trabalhar em qualquer área.

## Visão geral

```text
Português Completo
|
|-- Entrada pública
|   `-- index.html
|
|-- Aplicação
|   `-- app/
|       |-- css/
|       |-- js/
|       `-- assets/
|
|-- Conteúdo do curso
|   `-- content/
|
|-- Produção de mídia
|   `-- producao-midia/
|
|-- Documentação
|   `-- docs/
|
|-- Validação automática
|   |-- scripts/
|   `-- .github/workflows/
|
`-- Instruções do ChatGPT
    `-- .ChatGPT/
```

## Arquivos de entrada

- `README.md` — apresentação do repositório e acesso ao aplicativo.
- `PROJECT_INDEX.md` — este mapa.
- `index.html` — entrada pública carregada pelo GitHub Pages.

## Onde procurar antes de trabalhar

### Arquitetura, armazenamento, rotas ou integração com GitHub

Ler `docs/arquitetura.md`.

Código relacionado:

- `app/js/core/`
- `app/js/services/`

### Frontend e interface

Ler `docs/arquitetura.md` e usar `.ChatGPT/skills/frontend-visual-check/SKILL.md` quando aplicável.

Arquivos principais:

- `index.html`
- `app/css/`
- `app/js/ui/`
- `app/assets/`

### Planejamento curricular

Ler:

- `docs/roadmap-curricular.md` — estado atual, marco ativo, próximo subpasso e maturidade;
- `docs/execucao-continua.md` — execução por marcos;
- `docs/mapa-curso.md` — visão geral e Nível 0;
- `docs/mapa-niveis-1-4.md` — camada `M1` dos Níveis 1–4;
- `docs/matriz-progressao-global.md` — progressão transversal N0–N4;
- `docs/unidades-nivel-0.md` — unidades do Nível 0;
- `docs/licoes-nivel-0.md` — lições das Unidades 1–5;
- `docs/licoes-nivel-0-unidade-6.md` — lições da Unidade 6;
- `docs/checkpoint-saida-nivel-0.md` — auditoria e limites do fechamento do Nível 0;
- `docs/conteudo.md`.

Usar:

- `.ChatGPT/skills/curricular-orchestration/SKILL.md` para marcos longos;
- `.ChatGPT/skills/course-content-design/SKILL.md` para planejamento/revisão pedagógica.

### Criação de unidades e lições

Ler o roadmap, a fonte curricular correspondente à camada, `docs/conteudo.md`, `docs/arquitetura.md` quando houver dependência técnica e a documentação de mídia quando produção humana puder ser necessária.

No Nível 0:

- U1–U5 → `docs/licoes-nivel-0.md`;
- U6 → `docs/licoes-nivel-0-unidade-6.md`;
- saída do nível → `docs/checkpoint-saida-nivel-0.md` + `content/levels/000-fundamentos/exit-verification.json`.

Conteúdo detalhado fica em `content/`.

### Execução contínua de marcos

Quando o usuário autorizar um marco amplo, ler:

- `docs/execucao-continua.md`;
- `docs/roadmap-curricular.md`;
- `.ChatGPT/skills/curricular-orchestration/SKILL.md`;
- skill especializada aplicável.

Pesquisa, planejamento, escrita, revisões, correções, PR, CI, merge e atualização do roadmap pertencem ao mesmo ciclo quando já estiverem contidos no marco autorizado.

### Produção e curadoria de mídia pedagógica

- `producao-midia/README.md` — contrato operacional;
- `producao-midia/FILA-MIDIA.md` — fila oficial.

Mídia pedagógica humana deve existir por necessidade pedagógica concreta. Arquivos pesados de produção não devem ser usados como área de trabalho do repositório.

### Exercícios

Quando esta área for formalizada, consultar `docs/exercicios.md` (quando criado), `docs/validacoes.md` e skill específica, se existir.

### Progresso do aluno

Ler `docs/arquitetura.md` e `docs/progresso.md` quando este último existir. A fonte oficial futura do progresso acadêmico é o Gist do aluno, não `localStorage`.

### Áudio e aparência

Ler `docs/arquitetura.md`; para mídia controlada, consultar também `producao-midia/README.md` e `producao-midia/FILA-MIDIA.md`.

### Validações e guard rails

- `docs/validacoes.md`
- `scripts/validate-project.mjs`
- `scripts/validate-json.mjs`
- `.github/workflows/validate-project.yml`

## Documentação oficial existente

- `docs/arquitetura.md` — arquitetura e responsabilidades técnicas.
- `docs/roadmap-curricular.md` — estado curricular e próximos marcos.
- `docs/execucao-continua.md` — protocolo de execução contínua.
- `docs/mapa-curso.md` — visão geral do percurso e Nível 0.
- `docs/mapa-niveis-1-4.md` — `M1` dos Níveis 1–4.
- `docs/matriz-progressao-global.md` — progressão transversal N0–N4.
- `docs/unidades-nivel-0.md` — unidades do Nível 0.
- `docs/licoes-nivel-0.md` — lições das Unidades 1–5.
- `docs/licoes-nivel-0-unidade-6.md` — lições da Unidade 6 e limite técnico de oralidade.
- `docs/checkpoint-saida-nivel-0.md` — mapeamento das competências de saída, lacunas e distinção entre fechamento curricular, validação e publicação.
- `docs/conteudo.md` — estrutura pedagógica e uso de mídia.
- `docs/validacoes.md` — política dos guard rails automáticos.

Documentos previstos:

- `docs/exercicios.md`
- `docs/progresso.md`
- `docs/configuracoes.md`
- `docs/convencoes.md`

## Aplicação

### Estilos

- `app/css/`

### JavaScript

- `app/js/app.js`
- `app/js/core/`
- `app/js/services/`
- `app/js/ui/`

### Assets da interface

- `app/assets/`

Mídia pedagógica pesada não pertence a `app/assets/`.

## Conteúdo pedagógico

- `content/course.json`
- `content/units/`
- `content/levels/` — verificações ou conteúdo transversal de nível quando necessário; atualmente contém a verificação de saída do Nível 0.

`content/` contém aquilo que o aplicativo ensina/avalia. `app/` contém o programa que apresenta e executa esse conteúdo.

## Produção de mídia

- `producao-midia/README.md`
- `producao-midia/FILA-MIDIA.md`

A pasta coordena produção; não substitui `docs/conteudo.md`, `docs/arquitetura.md` nem o conteúdo final.

## Instruções do ChatGPT

Índice: `.ChatGPT/README.md`.

Skills atuais:

- `.ChatGPT/skills/curricular-orchestration/SKILL.md`
- `.ChatGPT/skills/frontend-visual-check/SKILL.md`
- `.ChatGPT/skills/course-content-design/SKILL.md`

## Validação automática

### Estrutura e referências

`scripts/validate-project.mjs` protege principalmente referências explícitas do índice, áreas principais, documentos oficiais, skills, arquivos carregados pelo frontend, imports/fetches/referências CSS e caminhos incompatíveis com o subcaminho do GitHub Pages.

### JSON

`scripts/validate-json.mjs` valida sintaticamente JSON em `content/` e `schemas/` quando existir.

Schemas pedagógicos só devem ser adicionados depois que os formatos oficiais estiverem suficientemente estabilizados.

### Política e roadmap

Fonte: `docs/validacoes.md`.

O `PROJECT_INDEX.md` mapeia áreas e fontes. Estado detalhado e próximo marco pertencem ao roadmap.

## Fontes de verdade

```text
Decisão arquitetural
→ docs/arquitetura.md

Visão geral curricular
→ docs/mapa-curso.md

M1 dos Níveis 1–4
→ docs/mapa-niveis-1-4.md

Progressão transversal
→ docs/matriz-progressao-global.md

Estado curricular e marcos
→ docs/roadmap-curricular.md

Execução contínua
→ docs/execucao-continua.md

Unidades N0
→ docs/unidades-nivel-0.md

Lições N0 U1–U5
→ docs/licoes-nivel-0.md

Lições N0 U6
→ docs/licoes-nivel-0-unidade-6.md

Saída N0
→ docs/checkpoint-saida-nivel-0.md

Forma de ensinar/mídia
→ docs/conteudo.md

Produção de mídia
→ producao-midia/README.md + producao-midia/FILA-MIDIA.md

Validação automática
→ docs/validacoes.md

Procedimentos ChatGPT
→ .ChatGPT/skills/

Implementação
→ app/ + index.html

Conteúdo
→ content/
```

Se uma decisão mudar uma fonte de verdade, atualizar a documentação correspondente.

## Regra de organização

Antes de criar novo arquivo/diretório, verificar se já existe uma área responsável. Evitar documentação duplicada, conteúdo pedagógico em JavaScript, regras arquiteturais escondidas em código, mistura de assets de interface com mídia pedagógica e novas áreas sem atualização do índice.

## Manutenção deste índice

Atualizar quando surgir nova área estrutural, documento oficial, skill, ponto de entrada ou mudança importante de responsabilidade.

Depois de mudanças estruturais ou JSON:

```text
node scripts/validate-project.mjs
node scripts/validate-json.mjs
```

O workflow do GitHub executa essas validações em PRs e pushes para `main`.
