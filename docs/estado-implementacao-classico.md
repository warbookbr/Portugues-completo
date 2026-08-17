# Estado de implementação do Modo Clássico

## Objetivo

Este documento é o **registro operacional canônico** do desenvolvimento do Modo Clássico do Português Completo.

Ele deve permitir que uma nova instância responda sem depender da conversa anterior:

```text
onde o desenvolvimento parou?
o que foi implementado?
o que foi homologado?
o que ficou parcial?
qual item depende de mídia/material de apoio?
qual blocker existe?
qual é o próximo passo exato?
```

`docs/roadmap-produto.md` define a ordem P1→P9. Este arquivo registra o estado concreto dentro dos marcos.

Regra central:

```text
implementado tecnicamente
≠ homologado
≠ publicável
```

## Regra de atualização

Toda PR que altere materialmente o Modo Clássico deve revisar este documento na mesma branch.

Isso inclui schemas, adapters, catálogo, renderer, progresso, IA, mídia ligada, homologação, blockers e mudança de próximo passo.

Correção puramente editorial que não muda estado não exige atualização.

## Cursor operacional

```text
Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco concluído mais recente: P1 — Schemas e contratos executáveis
Marco ativo: P2 — ContentService e normalizador
Item ativo: ainda não iniciado
Último item concluído: CL-P1-VALIDATOR-CONTRACTS + fixtures N0/N4
Próximo passo exato: implementar ContentService/normalizador e adapters v1 começando por N0-U01-L01 e N4-U09-L01, usando as fixtures P1 como contrato de saída
Blocker atual do próximo passo: nenhum
Gate final do Clássico: NÃO SATISFEITO
```

## Estados consolidados

```text
NAO_INICIADO
EM_ANDAMENTO
IMPLEMENTADO_COM_PENDENCIA
PRONTO_PARA_HOMOLOGAR
HOMOLOGADO
PUBLICAVEL
BLOQUEADO
```

- `NAO_INICIADO` — existe no plano, sem implementação material.
- `EM_ANDAMENTO` — implementação parcial ativa.
- `IMPLEMENTADO_COM_PENDENCIA` — parte técnica principal existe, mas há dependência explícita.
- `PRONTO_PARA_HOMOLOGAR` — implementação completa no escopo e testável.
- `HOMOLOGADO` — comportamento aplicável foi provado por evidência reconstruível.
- `PUBLICAVEL` — homologado e sem blocker de publicação aplicável.
- `BLOQUEADO` — não consegue avançar naquele item sem dependência material.

## Dimensões obrigatórias por item

### Estado técnico

```text
NAO_INICIADO
EM_IMPLEMENTACAO
IMPLEMENTADO
BLOQUEADO_TECNICO
```

### Estado de homologação

```text
NAO_AVALIADO
HOMOLOGACAO_PARCIAL
PRONTO_PARA_HOMOLOGAR
HOMOLOGADO
BLOQUEADO_POR_DEPENDENCIA
```

### Estado de mídia/material de apoio

```text
SEM_DEPENDENCIA
MIDIA_OPCIONAL_PENDENTE
MIDIA_PENDENTE_NAO_BLOQUEANTE
MIDIA_OBRIGATORIA_PARA_ATIVIDADE
MIDIA_OBRIGATORIA_PARA_PUBLICACAO
MIDIA_PRONTA_PARA_VALIDAR
MIDIA_VALIDADA
MIDIA_PUBLICADA
```

### Estado de publicação

```text
NAO_AVALIADO
NAO_APLICAVEL
BLOQUEADO
APTO
```

## Política de mídia flexível

```text
mídia pendente
→ bloqueia somente o que depende pedagogicamente dela
→ todo trabalho independente continua
```

### Regras

- TTS/texto/UI semântica devem ser preferidos quando forem pedagogicamente suficientes.
- `MIDIA_OPCIONAL_PENDENTE` não impede homologação/publicação quando o ensino essencial continua válido.
- `MIDIA_PENDENTE_NAO_BLOQUEANTE` permite desenvolvimento técnico usando `mediaId`/contrato.
- `MIDIA_OBRIGATORIA_PARA_ATIVIDADE` permite implementar estrutura/renderer, mas impede homologar pedagogicamente a atividade sem o estímulo real.
- `MIDIA_OBRIGATORIA_PARA_PUBLICACAO` impede `PUBLICAVEL` enquanto a versão final não estiver validada e ligada.
- placeholder serve para desenvolvimento, nunca para fingir homologação de estímulo ausente.

A fila `producao-midia/FILA-MIDIA.md` rastreia a produção do arquivo; este documento rastreia o **impacto no produto**.

## Formato de registro de item

```text
ID:
Escopo:
Marco:
Descrição:
Estado consolidado:
Estado técnico:
Estado de homologação:
Estado de mídia:
Estado de publicação:
Dependências/mediaIds:
Blockers:
Evidência de validação:
PR/commit de referência:
Última atualização:
Próximo passo:
```

IDs de produto usam formato estável `CL-P<marco>-<escopo>` e não substituem IDs curriculares ou `mediaId`.

## Registro de marcos

| Marco | Estado | Observação | Próximo critério |
|---|---|---|---|
| P1 — Schemas e contratos executáveis | `HOMOLOGADO` | cinco schemas + fixtures N0/N4 + validator em CI | concluído |
| P2 — ContentService/normalizador | `NAO_INICIADO` | marco ativo | slice N0/N4 normalizado contra schemas P1 |
| P3 — Manifests e catálogo inicial | `NAO_INICIADO` | depende de P2 | unidades do slice descobríveis pelo catálogo |
| P4 — Renderer real do Clássico | `NAO_INICIADO` | depende do runtime do slice | conteúdo/atividades do slice renderizados e testáveis |
| P5 — ProgressService/revisão/Gist | `NAO_INICIADO` | núcleo pedagógico clássico | progresso/revisão/persistência homologados |
| P6 — Feedback por IA | `NAO_INICIADO` | BYOK; determinísticos independem de IA | feedback/fallback homologados |
| P7 — Ampliação N0→N4 | `NAO_INICIADO` | após pipeline provado | catálogo clássico cobre o escopo aprovado |
| P8 — Mídia/prontidão de publicação | `NAO_INICIADO` | resolve blockers obrigatórios | itens clássicos aptos à publicação |
| P9 — Homologação E2E | `NAO_INICIADO` | gate final | `CLÁSSICO HOMOLOGADO` |

## P1 — itens concluídos

### `CL-P1-SCHEMA-COURSE`

```text
Escopo: schemas/course.schema.json
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA
Publicação: NAO_APLICAVEL
Evidência: fixture course-v2-slice validada pelo CI
```

### `CL-P1-SCHEMA-UNIT`

```text
Escopo: schemas/unit.schema.json
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA
Publicação: NAO_APLICAVEL
Evidência: fixtures N0-U01 e N4-U09 validadas pelo CI
```

### `CL-P1-SCHEMA-LESSON`

```text
Escopo: schemas/lesson.schema.json
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA
Publicação: NAO_APLICAVEL
Evidência: fixtures normalizadas N0-U01-L01 e N4-U09-L01
```

O schema representa **runtime normalizado**. Os JSONs autorais v1 continuam preservados e serão transformados por P2.

### `CL-P1-SCHEMA-VERIFICATION`

```text
Escopo: schemas/verification.schema.json
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA do schema
Publicação: NAO_APLICAVEL
Evidência: fixtures N0-U01-V01 e N4-U09-V01
```

A fixture N0 contém referências reais de áudio controlado para provar que o contrato consegue representá-las. Isso **não** significa que a mídia N0 foi homologada/publicada; esse impacto continuará sendo rastreado nos itens de conteúdo correspondentes em P3–P9.

### `CL-P1-SCHEMA-PROGRESS`

```text
Escopo: schemas/progress.schema.json
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA
Publicação: NAO_APLICAVEL
Evidência: progress-v1 fixture valida progresso clássico, pending, revisão e resposta aberta
```

### `CL-P1-FIXTURES-N0-N4`

```text
Escopo: schemas/fixtures/p1/
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA para o teste de contrato
Publicação: NAO_APLICAVEL
Fontes reais: N0-U01-L01, N0-U01-V01, N4-U09-L01, N4-U09-V01 e contratos de course/unit/progress
```

As fixtures são contratos de teste; não são manifests públicos e não mudam `content/course.json` para v2.

### `CL-P1-VALIDATOR-CONTRACTS`

```text
Escopo: scripts/validate-contracts.mjs + CI
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA
Publicação: NAO_APLICAVEL
Evidência: PR #105, workflow Validate project structure, etapa Validate contract schemas = success
```

O validator usa o subconjunto de JSON Schema necessário aos schemas P1 e falha se uma keyword futura for adicionada sem suporte explícito.

## Blockers abertos

Nenhum blocker impede iniciar P2.

Pendências históricas de mídia continuam fora do escopo de P1 e não foram apagadas.

## Evidência e regra de homologação

`HOMOLOGADO`/`PUBLICAVEL` precisa de evidência reconstruível adequada ao tipo, por exemplo:

- CI/validator;
- teste automatizado;
- teste manual;
- screenshot/inspeção visual quando houver UI;
- desktop/tablet/mobile;
- exercício executado;
- mídia validada/ligada;
- fluxo E2E;
- PR/commit.

## Atualização após PR

Quando uma PR do Clássico for integrada:

```text
1. identificar IDs alterados
2. atualizar quatro dimensões de estado
3. registrar blockers novos/removidos
4. registrar mediaIds relevantes
5. registrar evidência/PR quando útil
6. atualizar Cursor operacional
7. atualizar estado do marco
8. só então declarar o subpasso concluído
```

Trabalho parcial deve permanecer `EM_ANDAMENTO` ou `IMPLEMENTADO_COM_PENDENCIA`; nunca mascarar a parcialidade.

## Condição de avanço

Um marco pode avançar com pendências locais não bloqueantes quando sua condição de saída do roadmap estiver satisfeita e as pendências permanecerem rastreadas.

```text
avanço contínuo
+
pendências explícitas
+
nenhuma falsa conclusão
```

## Gate `CLÁSSICO HOMOLOGADO`

Só P9 pode satisfazer o gate, aplicando os critérios de `docs/roadmap-produto.md`.

Mídia opcional pendente não bloqueia automaticamente o gate. Mídia obrigatória ainda necessária para a experiência pública impede a parte afetada de ser `PUBLICAVEL` e precisa ser resolvida antes do gate quando fizer parte do escopo final.

Nenhuma implementação de XP, missões, conquistas, streak ou progressão gamificada começa antes desse gate.
