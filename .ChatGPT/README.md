# ChatGPT no projeto Português Completo

## Objetivo

Este diretório reúne instruções específicas para o ChatGPT trabalhar de forma consistente no projeto `Portugues-completo`.

Antes de executar uma tarefa que dependa da estrutura do projeto, consultar primeiro:

- `PROJECT_INDEX.md`

Depois, ler apenas os documentos e skills relevantes para a área atual.

## Estrutura do projeto

A arquitetura oficial fica em:

- `docs/arquitetura.md`

O código da aplicação fica em:

- `app/`

O conteúdo pedagógico fica em:

- `content/`

Não assumir caminhos antigos como `css/`, `js/` ou `arquitetura.md` na raiz.

## Skills disponíveis

### Frontend Visual Check

Arquivo:

- `.ChatGPT/skills/frontend-visual-check/SKILL.md`

Usar para mudanças visuais relevantes no frontend.

Objetivo:

- renderizar a interface quando possível;
- gerar screenshots;
- inspecionar layout, responsividade e estados visuais;
- não considerar uma mudança visual concluída apenas pela leitura do código quando houver meios de validar a renderização.

### Course Content Design

Arquivo:

- `.ChatGPT/skills/course-content-design/SKILL.md`

Usar para planejamento curricular, unidades, lições, material de apoio e decisões pedagógicas.

Objetivo:

- preservar coerência com o mapa do curso;
- priorizar clareza;
- evitar saturação de mídia;
- manter estrutura pedagógica consistente com composição flexível;
- distinguir checagens de exercícios;
- consultar as fontes oficiais antes de propor grandes mudanças.

## Fontes principais relacionadas

```text
PROJECT_INDEX.md
→ mapa geral do projeto

docs/arquitetura.md
→ decisões técnicas e responsabilidades

docs/mapa-curso.md
→ níveis e progressão curricular

docs/conteudo.md
→ regras pedagógicas, lições e uso de mídia
```

## Validação estrutural

Mudanças de caminhos, entrada da aplicação ou organização do repositório devem respeitar:

- `scripts/validate-project.mjs`
- `.github/workflows/validate-project.yml`

Antes de concluir uma mudança estrutural importante, verificar se o validador continua passando.

O validador complementa as skills; ele não substitui revisão visual nem revisão pedagógica.

## Como adicionar novas skills

Criar uma nova skill apenas quando existir um procedimento recorrente que mereça ser seguido de forma consistente.

Não criar skills apenas para registrar uma decisão isolada. Decisões do projeto devem ficar na documentação oficial apropriada.

Possíveis skills futuras, quando houver necessidade real:

```text
exercise-design
→ criação e qualidade de exercícios

content-review
→ revisão pedagógica de unidades completas

frontend-accessibility-check
→ acessibilidade e usabilidade

project-consistency-check
→ coerência entre arquitetura, documentação e implementação
```

Essas skills não devem ser criadas antecipadamente sem material real suficiente para definir bons critérios.

## Regra de manutenção

Quando uma nova skill for criada ou uma skill deixar de ser relevante, atualizar este README.

Quando uma tarefa revelar uma nova regra estrutural do projeto, atualizar a documentação oficial correspondente em vez de depender apenas desta pasta.
