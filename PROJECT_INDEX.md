# Índice do Projeto — Português Completo

## Objetivo

Este arquivo é o mapa mestre do projeto. Ele não substitui a documentação detalhada; serve para localizar rapidamente a fonte correta antes de trabalhar em qualquer área.

## Visão geral

```text
Português Completo
|
|-- Arquitetura e decisões técnicas
|   `-- arquitetura.md
|
|-- Currículo e conteúdo pedagógico
|   |-- docs/mapa-curso.md
|   `-- docs/conteudo.md
|
|-- Exercícios
|   `-- docs/exercicios.md          (quando criado)
|
|-- Progresso e avaliação
|   `-- docs/progresso.md           (quando criado)
|
|-- Configurações
|   `-- docs/configuracoes.md       (quando criado)
|
|-- Convenções do projeto
|   `-- docs/convencoes.md          (quando criado)
|
|-- Frontend
|   |-- index.html
|   |-- css/
|   `-- js/
|
|-- Conteúdo do curso
|   `-- content/
|
|-- Assets da aplicação
|   `-- assets/
|
`-- Instruções do ChatGPT
    `-- .ChatGPT/
```

## Onde procurar antes de trabalhar

### Arquitetura, armazenamento, rotas ou integração com GitHub

Ler:

- `arquitetura.md`

Arquivos de código relacionados:

- `js/core/`
- `js/services/`

### Frontend e interface

Ler:

- `arquitetura.md`

Usar quando aplicável:

- `.ChatGPT/skills/frontend-visual-check/SKILL.md`

Arquivos principais:

- `index.html`
- `css/`
- `js/ui/`

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
- `arquitetura.md` quando houver mídia ou limitações técnicas

Conteúdo fica em:

- `content/`

### Exercícios

Quando esta área for implementada, consultar:

- `docs/exercicios.md`
- skill específica de exercícios, se existir

Arquivos de conteúdo relacionados devem ficar sob a estrutura de `content/` definida na arquitetura.

### Progresso do aluno

Ler:

- `arquitetura.md`
- `docs/progresso.md` quando criado

Código relacionado:

- `js/services/progress-service.js`
- `js/services/github-service.js`

A fonte oficial do progresso acadêmico é o Gist do aluno, não `localStorage`.

### Áudio e aparência

Ler:

- `arquitetura.md`
- `docs/configuracoes.md` quando criado

Código relacionado:

- `js/services/narration-service.js`
- `js/services/settings-service.js`
- `js/ui/audio-settings.js`
- `js/ui/appearance-settings.js`

## Fontes de verdade

Quando houver dúvida, considerar esta ordem:

```text
Decisão arquitetural
→ arquitetura.md

Progressão curricular
→ docs/mapa-curso.md

Forma de ensinar e usar mídia
→ docs/conteudo.md

Procedimento específico de trabalho do ChatGPT
→ .ChatGPT/skills/

Implementação atual
→ código-fonte
```

Se uma nova decisão mudar uma fonte de verdade, atualizar a documentação correspondente em vez de deixar apenas a decisão registrada em conversa.

## Regra de organização

Antes de criar um novo arquivo ou diretório, verificar se já existe uma área responsável por aquele tipo de informação.

Evitar:

- documentação duplicada;
- conteúdo pedagógico dentro de JavaScript;
- regras arquiteturais escondidas em código;
- assets do frontend misturados com mídia pedagógica;
- arquivos genéricos que concentrem responsabilidades diferentes.

## Manutenção deste índice

Atualizar `PROJECT_INDEX.md` quando surgir uma nova área importante do projeto, um novo documento de referência ou uma nova skill que altere significativamente o fluxo de trabalho.

Este arquivo deve permanecer curto o suficiente para ser consultado rapidamente.