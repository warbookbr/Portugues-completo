# Validações e Guard Rails

## Objetivo

Este documento define a estratégia de validação automática do **Português Completo**.

A regra geral é:

```text
quebra objetiva
→ erro e CI bloqueado

risco, possível abandono ou degradação
→ warning
```

Automação protege contratos mecânicos; não substitui revisão pedagógica ou julgamento confiável.

## Fontes de contrato

As próximas validações devem implementar, e não reinventar:

- `docs/contrato-conteudo.md` — catálogo, manifests, versões e normalização;
- `docs/exercicios.md` — atividades, interação, avaliação e evidência;
- `docs/progresso.md` — estados pedagógicos;
- `docs/persistencia-progresso.md` — schema do Gist e cálculo mecânico;
- `docs/avaliacao-ia.md` — envelopes e políticas de IA;
- `docs/arquitetura.md` — separação de responsabilidades/credenciais.

## Princípios

- automatizar verificações determinísticas;
- evitar falso positivo alto;
- não pontuar qualidade pedagógica por heurística;
- não transformar `PROJECT_INDEX.md` em inventário de aulas;
- erro somente para quebra objetiva de contrato;
- warning para conteúdo ainda não publicado/órfão quando isso puder ser intencional;
- schemas versionados devem aceitar somente versões que o runtime suporta.

## Camada 1 — estrutura do repositório

Implementada em:

- `scripts/validate-project.mjs`;
- `.github/workflows/validate-project.yml`.

Protege:

- caminhos explícitos do `PROJECT_INDEX.md`;
- áreas importantes da raiz não mapeadas;
- documentos/skills oficiais não registrados;
- arquivos carregados por `index.html`;
- imports JavaScript;
- `fetch()` local;
- referências CSS;
- caminhos absolutos incompatíveis com GitHub Pages de projeto;
- módulos JS/CSS não alcançáveis como warning.

## Camada 2 — sintaxe JSON

Implementada em `scripts/validate-json.mjs`.

Todo `.json` de `content/` e, quando existir, `schemas/` deve ser JSON sintaticamente válido.

JSON inválido é **erro**.

## Camada 3 — schemas de contrato

**Contrato definido; implementação é o próximo marco técnico.**

Estrutura alvo:

```text
schemas/
├── course.schema.json
├── unit.schema.json
├── lesson.schema.json
├── verification.schema.json
└── progress.schema.json
```

Um `exercise.schema.json` separado só deve ser criado se atividades realmente passarem a existir como arquivos independentes. Enquanto estiverem embutidas em lições/verificações, o schema correspondente deve reutilizar definições comuns em `$defs` em vez de exigir separação artificial.

### `course.schema.json`

Validar:

- `schemaVersion` suportada;
- `id`, `title`;
- levels com IDs/ordem válidos;
- units com `id`, `levelId`, `order`, `title`, `manifest`;
- duplicidade de IDs no catálogo.

### `unit.schema.json`

Validar:

- identidade/nível/ordem;
- registry de competências estáveis;
- lista de lições;
- verificação integrada quando declarada;
- estado de publicação;
- estrutura de blockers.

### `lesson.schema.json`

A estratégia deve reconhecer versões de autoria suportadas.

A primeira implantação pode validar fortemente o **manifest/runtime canônico** e aplicar validações estruturais compatíveis aos payloads históricos v1, evitando quebrar centenas de arquivos antes do adapter existir.

Validar, quando aplicável:

- `id`, `title`, `objective`;
- sequência/blocos;
- IDs de bloco únicos dentro da lição;
- `assessmentBehavior`;
- `completionEvidence`/forma normalizável;
- materiais de apoio e referências de mídia.

### `verification.schema.json`

Validar unit/level verifications:

- tipo de verificação;
- IDs;
- coverage/clusters;
- items/atividades;
- avaliação;
- agrupamentos obrigatórios;
- `completionEvidence`.

### `progress.schema.json`

Implementar exatamente o contrato v1 de `docs/persistencia-progresso.md`:

```text
courseId
curriculum
evidence
competencies
review
responses
gamification
meta
```

API key de IA ou credencial GitHub dentro do objeto de progresso deve ser **erro**.

## Camada 4 — integridade entre arquivos

Depois dos manifests começarem a existir, implementar `validate-content-integrity.mjs` ou responsabilidade equivalente.

Erros objetivos:

```text
course.json.manifest inexistente
unit.json.id != id do catálogo
lesson path inexistente
lesson id != id declarado no manifesto
verification path/id incompatível
competencyId referenciado inexistente
cluster referencia activity/evidence inexistente
ID duplicado no mesmo escopo
schemaVersion maior que a suportada
```

## Conteúdo existente sem manifesto

O repositório contém conteúdo curricular não publicado no catálogo.

Durante a migração:

```text
pasta de unidade sem unit.json
+ unidade ainda não referenciada por course.json
→ permitido
→ warning opcional quando útil
```

Mas:

```text
course.json referencia unidade
+ unit.json ausente
→ erro
```

Isso permite migração incremental sem confundir “não publicado” com “quebrado”.

## Normalização e adapters

Schemas não substituem o `ContentService`.

Testes do normalizador devem cobrir exemplos reais de gerações diferentes:

- N0 com `quick-check`, `guided-activity`, thresholds e critérios em prosa;
- N4 com `automaticValidation: false`, clusters e `requiresReliableEvaluatorFor`;
- verificações integradas;
- saída de nível.

Quando critério histórico não puder ser convertido com segurança para o runtime, o normalizador deve retornar erro/estado `BLOCKED`, nunca inventar regra.

## Validação de atividades

Com base em `docs/exercicios.md`, verificar:

- interaction suportada;
- evaluation mode compatível com os campos presentes;
- `DETERMINISTIC` possui condição/chave suficiente;
- `RELIABLE_EVALUATOR` não declara promoção automática contraditória;
- activity IDs únicos;
- `recordResponse` e evidence policy coerentes;
- opções não são duplicadas de forma inválida;
- answer key aponta para opção/item existente;
- `COMPOSITE` possui etapas válidas.

Contradição mecânica deve ser erro.

## Validação de conclusão

Após normalização:

- todos os clusters obrigatórios têm IDs únicos;
- `evidenceIds` existem;
- satisfaction pertence a `DEMONSTRATED_REQUIRED`, `PENDING_ALLOWED`, `ATTEMPT_REQUIRED`;
- cluster obrigatório não pode ficar vazio;
- verificação marcada não compensável não pode ser reduzida a média global pelo schema/runtime.

Não tentar validar automaticamente se um critério pedagógico em linguagem natural é “bom”.

## Validação do progresso

Além do JSON Schema, testes de unidade do `ProgressService` devem cobrir:

- lição determinística concluída;
- `PENDING_ALLOWED` concluindo percurso sem promover domínio;
- cluster obrigatório não compensável;
- revisão/consolidação;
- modo Clássico sem XP;
- Gamificado sem XP retroativo;
- falha de IA sem perda de resposta;
- falha de Gist sem perda do estado local;
- conflito entre dispositivos;
- migração de schema.

Esses testes são **erro de CI** quando a implementação existir.

## Validação de IA

O contrato de `docs/avaliacao-ia.md` deve possuir testes sem depender de chamadas pagas em todo push.

Testar adapters com fixtures/mocks:

- `OK` válido;
- `UNCERTAIN`;
- contexto insuficiente;
- resposta fora do JSON esperado;
- provider error;
- tentativa adversarial dentro do texto do aluno;
- `mayPromoteEvidence=false` nunca promovendo domínio;
- `requiresReliableEvaluator=true` permanecendo pending.

Chamadas reais ao provider devem ser teste separado/sob demanda quando necessário.

## Conteúdo órfão

Arquivo pedagógico existente mas não alcançável por manifesto/catalog pode gerar **warning**.

Isso é especialmente útil depois que uma unidade for declarada `PUBLISHED`, pois nesse estágio um arquivo órfão pode indicar esquecimento.

## Qualidade editorial mecânica

Pode validar objetivamente:

- título obrigatório vazio;
- bloco vazio quando proibido;
- opções idênticas;
- resposta para opção inexistente;
- mídia sem identificador obrigatório;
- blocker inválido;
- path fora do escopo permitido.

Não usar automação para decidir clareza, beleza, interesse ou correção global de interpretação aberta.

## Acessibilidade e interface

Quando o renderer existir, adicionar:

- HTML semântico;
- nomes acessíveis;
- controles com labels;
- teclado;
- foco;
- estados não dependentes apenas de cor;
- alternativa a drag-and-drop;
- contraste detectável;
- regressões visuais relevantes.

Automação complementa a skill de inspeção visual.

## Performance e tamanho

Começar como warning com dados reais.

Possíveis métricas:

- tamanho de JS/CSS;
- JSON individual excessivo;
- resposta/progresso Gist crescendo inesperadamente;
- asset local pesado.

Não definir números arbitrários antes de medir o produto.

## Segurança e integrações

Quando implementadas, validar:

- nenhum token/key commitado;
- nenhuma API key de IA no progresso/Gist;
- nenhuma credencial em JSON pedagógico;
- providers permitidos;
- URLs/payloads coerentes;
- separação entre preferências, credenciais e progresso;
- logs não contendo segredo.

Regras dependentes de comportamento atual de APIs externas devem ser verificadas novamente na implementação.

## Mídia externa

Validar formato e consistência das referências declaradas sem tornar cada push dependente da disponibilidade remota do provider.

Disponibilidade real de mídia pode ser checada sob demanda.

## Ordem de implementação

```text
1. estrutura/referências locais                  ✓
2. sintaxe JSON                                  ✓
3. schemas de contrato                           PRÓXIMO
4. integridade catálogo → unit → lesson          depois dos manifests
5. testes do normalizador                        junto do ContentService
6. schema/testes de progresso                    junto do ProgressService
7. testes de adapters de IA                      junto do AiFeedbackService
8. acessibilidade/performance/segurança           conforme implementação
```

## Regra para novo guard rail

Antes de adicionar:

1. qual problema real detecta?
2. é verificável com confiança?
3. erro ou warning?
4. qual risco de falso positivo?
5. pertence a schema, integridade, código, UI ou revisão humana?

## Execução atual

```text
node scripts/validate-project.mjs
node scripts/validate-json.mjs
```

O GitHub Actions executa as validações atuais em PRs e pushes para `main`.
