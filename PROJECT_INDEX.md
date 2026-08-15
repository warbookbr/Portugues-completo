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

Ler:

- `docs/arquitetura.md`

Código relacionado:

- `app/js/core/`
- `app/js/services/`

Arquivos futuros já previstos, mas ainda não implementados:

- `app/js/services/progress-service.js` (quando criado)
- `app/js/services/github-service.js` (quando criado)

### Frontend e interface

Ler:

- `docs/arquitetura.md`

Usar quando aplicável:

- `.ChatGPT/skills/frontend-visual-check/SKILL.md`

Arquivos principais:

- `index.html`
- `app/css/`
- `app/js/ui/`
- `app/assets/`

### Planejamento curricular

Ler:

- `docs/roadmap-curricular.md` para estado atual, marco ativo, próximo subpasso e maturidade dos níveis;
- `docs/execucao-continua.md` quando o usuário autorizar um marco com vários subpassos;
- `docs/mapa-curso.md` para a visão geral do percurso e o detalhamento consolidado do Nível 0;
- `docs/mapa-niveis-1-4.md` para objetivo, competências, grandes áreas, responsabilidades e limites dos Níveis 1–4 em `M1`;
- `docs/matriz-progressao-global.md` para verificar a progressão transversal dos grandes domínios do português entre N0–N4;
- `docs/unidades-nivel-0.md` quando o trabalho envolver as unidades do Nível 0;
- `docs/licoes-nivel-0.md` para a arquitetura consolidada das lições das Unidades 1–5;
- `docs/licoes-nivel-0-unidade-6.md` quando o trabalho envolver a arquitetura ou o desenvolvimento da Unidade 6;
- `docs/conteudo.md`.

Usar:

- `.ChatGPT/skills/curricular-orchestration/SKILL.md` para marcos longos ou checkpoints completos;
- `.ChatGPT/skills/course-content-design/SKILL.md` para planejamento e revisão pedagógica especializada.

### Criação de unidades e lições

Ler:

- `docs/roadmap-curricular.md` para confirmar o foco e o gate atual;
- `docs/execucao-continua.md` se a autorização cobrir uma sequência inteira ou unidade completa;
- `docs/mapa-curso.md`;
- `docs/mapa-niveis-1-4.md` e `docs/matriz-progressao-global.md` quando a decisão puder afetar níveis superiores ou distribuição global de cobertura;
- `docs/unidades-nivel-0.md` para unidades já detalhadas do Nível 0;
- `docs/licoes-nivel-0.md` para U1–U5;
- `docs/licoes-nivel-0-unidade-6.md` para U6;
- `docs/conteudo.md`;
- `docs/arquitetura.md` quando houver mídia ou limitações técnicas;
- `producao-midia/README.md` quando a lição exigir mídia produzida/curada;
- `producao-midia/FILA-MIDIA.md` para reutilizar IDs existentes e registrar novas demandas de mídia;
- `docs/validacoes.md` antes de formalizar novos formatos estruturados.

Conteúdo fica em:

- `content/`

### Execução contínua de marcos

Quando o usuário autorizar um marco como `execute o checkpoint global`, `desenvolva a unidade completa` ou equivalente, ler:

- `docs/execucao-continua.md`;
- `docs/roadmap-curricular.md`;
- `.ChatGPT/skills/curricular-orchestration/SKILL.md`;
- `.ChatGPT/skills/course-content-design/SKILL.md` quando houver trabalho pedagógico.

Nesse modo, pesquisa, planejamento, escrita, revisões, correções, PR, CI, merge e atualização do roadmap fazem parte do mesmo ciclo. O ChatGPT deve continuar entre subpassos contidos no marco autorizado até concluí-lo ou atingir uma condição real de parada.

### Produção e curadoria de mídia pedagógica

Manual operacional:

- `producao-midia/README.md`

Fila oficial do que precisa ser produzido:

- `producao-midia/FILA-MIDIA.md`

Usar esta área para roteiros, IDs, prioridade, status, destino de produção e critérios de validação de áudio controlado, vídeo curado e imagem pedagógica curada.

As regras pedagógicas gerais de uso de mídia permanecem em `docs/conteudo.md` e as regras técnicas de providers/carregamento permanecem em `docs/arquitetura.md`.

Arquivos pesados de produção não devem ser commitados aqui apenas para servir como área de trabalho.

### Exercícios

Quando esta área for implementada, consultar:

- `docs/exercicios.md` (quando criado);
- `docs/validacoes.md`;
- skill específica de exercícios, se existir.

Os arquivos de exercícios devem ficar dentro da estrutura de `content/` definida pela arquitetura.

### Progresso do aluno

Ler:

- `docs/arquitetura.md`;
- `docs/progresso.md` (quando criado).

Código futuro relacionado:

- `app/js/services/progress-service.js` (quando criado);
- `app/js/services/github-service.js` (quando criado).

A fonte oficial do progresso acadêmico é o Gist do aluno, não `localStorage`.

### Áudio e aparência

Ler:

- `docs/arquitetura.md`;
- `docs/configuracoes.md` (quando criado).

Para produção de áudio pedagógico controlado, consultar também:

- `producao-midia/README.md`;
- `producao-midia/FILA-MIDIA.md`.

Código relacionado:

- `app/js/services/narration-service.js`;
- `app/js/services/settings-service.js`;
- `app/js/ui/audio-settings.js`;
- `app/js/ui/appearance-settings.js`.

### Validações e guard rails

Ler:

- `docs/validacoes.md`

Executar:

- `scripts/validate-project.mjs`;
- `scripts/validate-json.mjs`.

Workflow:

- `.github/workflows/validate-project.yml`

## Documentação oficial existente

- `docs/arquitetura.md` — arquitetura e responsabilidades técnicas.
- `docs/roadmap-curricular.md` — estado do desenvolvimento curricular, marco ativo, próximo subpasso e maturidade dos níveis.
- `docs/execucao-continua.md` — protocolo para executar marcos com pesquisa, escrita, revisão, validação e integração sem confirmações repetidas.
- `docs/mapa-curso.md` — visão geral do percurso e detalhamento curricular consolidado do Nível 0.
- `docs/mapa-niveis-1-4.md` — camada `M1` dos Níveis 1–4.
- `docs/matriz-progressao-global.md` — progressão transversal e revisão de cobertura dos grandes domínios entre N0–N4.
- `docs/unidades-nivel-0.md` — detalhamento pedagógico consolidado das unidades do Nível 0.
- `docs/licoes-nivel-0.md` — dimensionamento pedagógico das lições das Unidades 1–5 do Nível 0.
- `docs/licoes-nivel-0-unidade-6.md` — dimensionamento pedagógico da Unidade 6 e seu limite técnico de oralidade.
- `docs/conteudo.md` — estrutura pedagógica e uso de mídia.
- `docs/validacoes.md` — estratégia, severidade e roadmap dos guard rails automáticos.

Documentos previstos:

- `docs/exercicios.md` (quando criado);
- `docs/progresso.md` (quando criado);
- `docs/configuracoes.md` (quando criado);
- `docs/convencoes.md` (quando criado).

## Aplicação

### Estilos

- `app/css/`

### JavaScript

- `app/js/app.js`;
- `app/js/core/`;
- `app/js/services/`;
- `app/js/ui/`.

### Assets da interface

- `app/assets/`

Mídia pedagógica pesada não pertence a `app/assets/`; ela segue as regras de providers externos de `docs/arquitetura.md`.

## Conteúdo pedagógico

- `content/course.json`;
- `content/units/`.

`content/` contém aquilo que o aplicativo ensina. `app/` contém o programa que apresenta e executa esse conteúdo.

## Produção de mídia

- `producao-midia/README.md` — contrato operacional, IDs, estados, boas práticas e fluxo de entrega/validação.
- `producao-midia/FILA-MIDIA.md` — visão viva das mídias que precisam ser produzidas, com roteiro e localização pedagógica.

Esta pasta coordena produção; não substitui `docs/conteudo.md`, `docs/arquitetura.md` nem o conteúdo final em `content/`.

## Instruções do ChatGPT

Índice:

- `.ChatGPT/README.md`

Skills atuais:

- `.ChatGPT/skills/curricular-orchestration/SKILL.md`;
- `.ChatGPT/skills/frontend-visual-check/SKILL.md`;
- `.ChatGPT/skills/course-content-design/SKILL.md`.

## Validação automática

### Estrutura e referências

Validador:

- `scripts/validate-project.mjs`

Protege principalmente:

- referências explícitas do `PROJECT_INDEX.md`;
- cobertura das áreas principais da raiz;
- documentos oficiais em `docs/`;
- registro das skills;
- arquivos locais carregados pelo `index.html`;
- imports JavaScript;
- `fetch()` de arquivos locais;
- referências locais de CSS;
- risco de caminhos absolutos incompatíveis com o subcaminho do GitHub Pages.

Módulos JavaScript e folhas CSS que existam mas não sejam alcançáveis a partir do `index.html` geram warning.

### JSON

Validador:

- `scripts/validate-json.mjs`

Valida sintaticamente os JSON de `content/` e, quando existir, `schemas/`.

Schemas estruturais de curso, unidade, lição e exercício serão adicionados somente depois que seus formatos oficiais forem definidos.

### Política e roadmap

Fonte oficial:

- `docs/validacoes.md`

O documento define o que deve bloquear o CI, o que deve gerar apenas warning e em que momento adicionar schemas, integridade curricular, detecção de conteúdo órfão, acessibilidade, performance e segurança.

O `PROJECT_INDEX.md` não deve listar cada aula ou exercício individual. Ele mapeia áreas estruturais, documentos e pontos de entrada. O estado detalhado, o marco ativo e o próximo subpasso curricular pertencem a `docs/roadmap-curricular.md`.

## Fontes de verdade

Quando houver dúvida, considerar esta ordem:

```text
Decisão arquitetural
→ docs/arquitetura.md

Visão geral do percurso curricular
→ docs/mapa-curso.md

M1 dos Níveis 1–4
→ docs/mapa-niveis-1-4.md

Progressão transversal e cobertura global
→ docs/matriz-progressao-global.md

Estado curricular, marcos e próximo subpasso
→ docs/roadmap-curricular.md

Protocolo de execução contínua
→ docs/execucao-continua.md

Detalhamento das unidades do Nível 0
→ docs/unidades-nivel-0.md

Detalhamento das lições do Nível 0 — U1–U5
→ docs/licoes-nivel-0.md

Detalhamento das lições do Nível 0 — U6
→ docs/licoes-nivel-0-unidade-6.md

Forma de ensinar e usar mídia
→ docs/conteudo.md

Produção e curadoria de mídia
→ producao-midia/README.md + producao-midia/FILA-MIDIA.md

Política de validação automática
→ docs/validacoes.md

Procedimento específico de trabalho do ChatGPT
→ .ChatGPT/skills/

Implementação atual
→ app/ e index.html

Conteúdo atual
→ content/
```

Se uma nova decisão mudar uma fonte de verdade, atualizar a documentação correspondente em vez de deixar apenas a decisão registrada em conversa.

## Regra de organização

Antes de criar um novo arquivo ou diretório, verificar se já existe uma área responsável por aquele tipo de informação.

Evitar:

- documentação duplicada;
- conteúdo pedagógico dentro de JavaScript;
- regras arquiteturais escondidas em código;
- assets do frontend misturados com mídia pedagógica;
- arquivos genéricos que concentrem responsabilidades diferentes;
- novas áreas estruturais sem atualização deste índice.

## Manutenção deste índice

Atualizar `PROJECT_INDEX.md` quando surgir:

- uma nova área importante na raiz;
- um novo documento oficial;
- uma nova skill;
- um novo ponto de entrada estrutural;
- uma mudança significativa de responsabilidade entre pastas.

Depois de mudanças estruturais ou de conteúdo JSON, executar:

```text
node scripts/validate-project.mjs
node scripts/validate-json.mjs
```

O workflow do GitHub executa essas validações automaticamente em pushes para `main` e em pull requests.

Este arquivo deve permanecer curto o suficiente para ser consultado rapidamente.
