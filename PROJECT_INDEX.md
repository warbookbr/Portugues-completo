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
|-- Documentação
|   `-- docs/
|
|-- Validação estrutural
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

- `docs/mapa-curso.md`
- `docs/conteudo.md`

Usar:

- `.ChatGPT/skills/course-content-design/SKILL.md`

### Criação de unidades e lições

Ler:

- `docs/mapa-curso.md`
- `docs/conteudo.md`
- `docs/arquitetura.md` quando houver mídia ou limitações técnicas

Conteúdo fica em:

- `content/`

### Exercícios

Quando esta área for implementada, consultar:

- `docs/exercicios.md` (quando criado)
- skill específica de exercícios, se existir

Os arquivos de exercícios devem ficar dentro da estrutura de `content/` definida pela arquitetura.

### Progresso do aluno

Ler:

- `docs/arquitetura.md`
- `docs/progresso.md` (quando criado)

Código futuro relacionado:

- `app/js/services/progress-service.js` (quando criado)
- `app/js/services/github-service.js` (quando criado)

A fonte oficial do progresso acadêmico é o Gist do aluno, não `localStorage`.

### Áudio e aparência

Ler:

- `docs/arquitetura.md`
- `docs/configuracoes.md` (quando criado)

Código relacionado:

- `app/js/services/narration-service.js`
- `app/js/services/settings-service.js`
- `app/js/ui/audio-settings.js`
- `app/js/ui/appearance-settings.js`

## Documentação oficial existente

- `docs/arquitetura.md` — arquitetura e responsabilidades técnicas.
- `docs/mapa-curso.md` — níveis e progressão curricular.
- `docs/conteudo.md` — estrutura pedagógica e uso de mídia.

Documentos previstos:

- `docs/exercicios.md` (quando criado)
- `docs/progresso.md` (quando criado)
- `docs/configuracoes.md` (quando criado)
- `docs/convencoes.md` (quando criado)

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

Mídia pedagógica pesada não pertence a `app/assets/`; ela segue as regras de providers externos de `docs/arquitetura.md`.

## Conteúdo pedagógico

- `content/course.json`
- `content/units/` (quando criado)

`content/` contém aquilo que o aplicativo ensina. `app/` contém o programa que apresenta e executa esse conteúdo.

## Instruções do ChatGPT

Índice:

- `.ChatGPT/README.md`

Skills atuais:

- `.ChatGPT/skills/frontend-visual-check/SKILL.md`
- `.ChatGPT/skills/course-content-design/SKILL.md`

## Validação estrutural

Validador:

- `scripts/validate-project.mjs`

Workflow:

- `.github/workflows/validate-project.yml`

O validador protege principalmente:

- referências explícitas do `PROJECT_INDEX.md`;
- cobertura das áreas principais da raiz;
- documentos oficiais em `docs/`;
- registro das skills;
- arquivos locais carregados pelo `index.html`;
- imports JavaScript;
- `fetch()` de arquivos locais;
- referências locais de CSS;
- risco de caminhos absolutos incompatíveis com o subcaminho do GitHub Pages.

Módulos JavaScript e folhas CSS que existam mas não sejam alcançáveis a partir do `index.html` geram aviso.

O `PROJECT_INDEX.md` não deve listar cada aula ou exercício individual. Ele mapeia áreas estruturais, documentos e pontos de entrada.

## Fontes de verdade

Quando houver dúvida, considerar esta ordem:

```text
Decisão arquitetural
→ docs/arquitetura.md

Progressão curricular
→ docs/mapa-curso.md

Forma de ensinar e usar mídia
→ docs/conteudo.md

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

Depois de mudanças estruturais, executar:

```text
node scripts/validate-project.mjs
```

O workflow do GitHub também executa essa validação automaticamente em pushes para `main` e em pull requests.

Este arquivo deve permanecer curto o suficiente para ser consultado rapidamente.
