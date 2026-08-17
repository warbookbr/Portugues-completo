# Estado de implementação do Modo Clássico

## Objetivo

Registro operacional canônico do desenvolvimento do Modo Clássico.

Ele deve permitir reconstruir sem contexto de conversa:

```text
onde paramos?
o que foi implementado?
o que foi homologado?
o que ficou parcial?
qual mídia/dependência existe?
qual é o próximo passo exato?
```

`docs/roadmap-produto.md` define a ordem P1→P9. Este arquivo registra o estado concreto.

Regra central:

```text
implementado tecnicamente
≠ homologado
≠ publicável
```

Toda PR que altere materialmente o Clássico deve revisar este arquivo na mesma branch.

## Cursor operacional

```text
Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco concluído mais recente: P2 — ContentService e normalizador
Marco ativo: P3 — Manifests e catálogo inicial
Item ativo: ainda não iniciado
Último item concluído: CL-P2-NORMALIZER-V1 + CL-P2-CONTENT-SERVICE + CL-P2-TEST-SLICE
Próximo passo exato: criar manifests reais de N0-U01 e N4-U09, registry de competências e content/course.json v2 do slice, então validar integridade catálogo → unit → conteúdo
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

Dimensões obrigatórias por item:

```text
Técnico: NAO_INICIADO | EM_IMPLEMENTACAO | IMPLEMENTADO | BLOQUEADO_TECNICO
Homologação: NAO_AVALIADO | HOMOLOGACAO_PARCIAL | PRONTO_PARA_HOMOLOGAR | HOMOLOGADO | BLOQUEADO_POR_DEPENDENCIA
Mídia: SEM_DEPENDENCIA | MIDIA_OPCIONAL_PENDENTE | MIDIA_PENDENTE_NAO_BLOQUEANTE | MIDIA_OBRIGATORIA_PARA_ATIVIDADE | MIDIA_OBRIGATORIA_PARA_PUBLICACAO | MIDIA_PRONTA_PARA_VALIDAR | MIDIA_VALIDADA | MIDIA_PUBLICADA
Publicação: NAO_AVALIADO | NAO_APLICAVEL | BLOQUEADO | APTO
```

## Política de mídia flexível

```text
mídia pendente
→ bloqueia somente o que depende pedagogicamente dela
→ todo trabalho independente continua
```

- TTS/texto/UI semântica são suficientes quando a competência não depende de características sensoriais específicas.
- Placeholder pode apoiar desenvolvimento, nunca fingir homologação.
- `MIDIA_OBRIGATORIA_PARA_ATIVIDADE` impede homologar pedagogicamente a atividade sem estímulo final adequado.
- `MIDIA_OBRIGATORIA_PARA_PUBLICACAO` impede `PUBLICAVEL`, não necessariamente desenvolvimento técnico.
- `producao-midia/FILA-MIDIA.md` rastreia produção de arquivo; este documento rastreia impacto no produto.

## Registro de marcos

| Marco | Estado | Observação | Próximo critério |
|---|---|---|---|
| P1 — Schemas e contratos executáveis | `HOMOLOGADO` | cinco schemas + fixtures + validator em CI | concluído |
| P2 — ContentService/normalizador | `HOMOLOGADO` | autoria v1 → runtime canônico para N0/N4/exit; testes contra schemas | concluído |
| P3 — Manifests e catálogo inicial | `NAO_INICIADO` | marco ativo | N0-U01 e N4-U09 descobríveis por catálogo/manifests + integridade validada |
| P4 — Renderer real do Clássico | `NAO_INICIADO` | depende de P3 | slice renderizado e testável |
| P5 — ProgressService/revisão/Gist | `NAO_INICIADO` | núcleo pedagógico clássico | progresso/revisão/persistência homologados |
| P6 — Feedback por IA | `NAO_INICIADO` | BYOK; determinísticos independem de IA | feedback/fallback homologados |
| P7 — Ampliação N0→N4 | `NAO_INICIADO` | após pipeline provado | catálogo clássico cobre escopo aprovado |
| P8 — Mídia/prontidão de publicação | `NAO_INICIADO` | resolve blockers obrigatórios | itens clássicos aptos à publicação |
| P9 — Homologação E2E | `NAO_INICIADO` | gate final | `CLÁSSICO HOMOLOGADO` |

## P1 — resumo homologado

### `CL-P1-SCHEMAS`

```text
Escopo: course/unit/lesson/verification/progress schemas
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA
Publicação: NAO_APLICAVEL
Evidência: PR #105 + CI
```

### `CL-P1-FIXTURES-VALIDATOR`

```text
Escopo: schemas/fixtures/p1 + scripts/validate-contracts.mjs
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA
Publicação: NAO_APLICAVEL
Evidência: 8 fixtures P1 validadas pelo CI
```

## P2 — itens homologados

### `CL-P2-NORMALIZER-V1`

```text
Escopo: app/js/services/content-normalizer-v1.js + content-normalization-rules-v1.js
Descrição: transforma autoria schemaVersion 1 em runtime canônico de lição/verificação.
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: MIDIA_PENDENTE_NAO_BLOQUEANTE no conteúdo que referencia mediaId; o normalizador em si não depende dos arquivos
Publicação: NAO_APLICAVEL
Evidência: PR #106; teste N0/N4/N4-EXIT contra schemas canônicos
```

Cobertura comprovada:

```text
N0-U01-L01
→ quick-check + classify + TTS + threshold + conclusão determinística

N0-U01-V01
→ 12 itens + controlled audio + sequence + thresholds + quatro clusters não compensáveis

N4-U09-L01
→ resposta aberta + RELIABLE_EVALUATOR + PENDING_ALLOWED

N4-U09-V01
→ atividades abertas/fechadas + clusters não compensáveis

N4-EXIT-V01
→ LEVEL_VERIFICATION + oito clusters obrigatórios + produção oral/multimodal pending
```

### Regra descoberta durante P2

O N0 real mostrou que um cluster pode exigir simultaneamente:

```text
4 de 5 evidências
+
pelo menos uma entre duas evidências específicas
```

O runtime passou a representar isso explicitamente com campos opcionais:

```text
minimumEvidence
requiredAnyOf
```

Sem esses campos, a implementação teria simplificado indevidamente `N0-U01-V01`.

Sem `minimumEvidence`, o padrão continua sendo exigir todas as `evidenceIds` conforme a política de satisfação. Cada grupo de `requiredAnyOf` exige pelo menos uma evidência satisfatória do grupo.

### Regras legadas explícitas

Critério histórico em prosa não é interpretado por regex.

Quando a autoria v1 não possui estrutura suficiente, usar regra legada auditável por ID em `content-normalization-rules-v1.js`.

Casos P2 materializados:

```text
N0-U01-L01
N0-U01-V01
```

Se não houver estrutura normalizável nem regra explícita:

```text
ContentNormalizationError
code = UNNORMALIZABLE_COMPLETION
```

Não inventar regra de conclusão.

### `CL-P2-CONTENT-SERVICE`

```text
Escopo: app/js/services/content-service.js
Descrição: carregamento JSON + normalização por serviço isolado e injetável.
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO em teste de serviço com fetch injetado
Mídia: SEM_DEPENDENCIA
Publicação: NAO_APLICAVEL até P3/P4 ligar o serviço ao app
Evidência: scripts/test-content-normalizer.mjs
```

O serviço ainda não é importado por `app.js`; isso é deliberado até o catálogo/manifests reais de P3 existirem.

Por isso `validate-project.mjs` emite três warnings de módulos JavaScript ainda não alcançáveis pelo `index.html`. São warnings esperados neste marco, não blockers.

### `CL-P2-TEST-SLICE`

```text
Escopo: scripts/test-content-normalizer.mjs + CI
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: referências de áudio são validadas estruturalmente por mediaId; arquivo final não é necessário para P2
Publicação: NAO_APLICAVEL
Evidência: workflow PR #106 — Validate JSON syntax + Validate contract schemas + Test content normalization = success
```

O teste importa `validateValue` do validator P1 e valida o runtime produzido pelo código, não apenas fixtures estáticas.

## Blockers abertos

Nenhum blocker impede iniciar P3.

Pendências históricas de mídia continuam rastreadas no conteúdo/fila e não foram promovidas a blocker global.

### Avisos não bloqueantes atuais

```text
content-normalization-rules-v1.js não alcançável a partir de index.html
content-normalizer-v1.js não alcançável a partir de index.html
content-service.js não alcançável a partir de index.html
```

Motivo: P2 implementa a camada antes de P3/P4 conectá-la ao produto público.

## Formato de novo item

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
PR/commit:
Próximo passo:
```

IDs de produto usam `CL-P<marco>-<escopo>` e não substituem IDs curriculares ou `mediaId`.

## Condição de avanço

Um marco pode avançar com pendências locais não bloqueantes quando a condição de saída do roadmap estiver satisfeita e as pendências permanecerem explícitas.

## Gate `CLÁSSICO HOMOLOGADO`

Só P9 pode satisfazer o gate.

Nenhuma implementação de XP, missões, conquistas, streak ou progressão gamificada começa antes dele.
