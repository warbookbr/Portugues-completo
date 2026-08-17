# Estado de implementação do Modo Clássico

## Objetivo

Registro operacional canônico do desenvolvimento do Modo Clássico. Deve permitir reconstruir sem contexto de conversa:

```text
onde paramos?
o que foi implementado/homologado?
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

Toda PR que altere materialmente o Clássico deve revisar este arquivo.

## Cursor operacional

```text
Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco concluído mais recente: P3 — Manifests e catálogo inicial
Marco ativo: P4 — Renderer real do Clássico
Item ativo: ainda não iniciado
Último item concluído: CL-P3-COURSE-CATALOG + CL-P3-MANIFEST-N0-U01 + CL-P3-MANIFEST-N4-U09 + CL-P3-CATALOG-INTEGRITY
Próximo passo exato: conectar app.js ao ContentService e substituir placeholders de unidade/lição por renderer clássico real do slice N0-U01 + N4-U09, implementando primeiro blocos CONTENT e primitivas ACTIVITY exigidas pelo slice
Blocker atual do próximo passo: nenhum blocker técnico global; áudios obrigatórios de N0-U01 permanecem pendência local e não bloqueiam o renderer independente
Gate final do Clássico: NÃO SATISFEITO
```

## Estados

```text
Consolidado: NAO_INICIADO | EM_ANDAMENTO | IMPLEMENTADO_COM_PENDENCIA | PRONTO_PARA_HOMOLOGAR | HOMOLOGADO | PUBLICAVEL | BLOQUEADO
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

- TTS/texto/UI semântica são suficientes quando a competência não depende de característica sensorial específica.
- Placeholder serve para desenvolvimento, nunca para fingir homologação.
- `MIDIA_OBRIGATORIA_PARA_ATIVIDADE` impede homologar a atividade sem o estímulo final, mas não paralisa o produto.
- `producao-midia/FILA-MIDIA.md` rastreia produção do arquivo; este documento rastreia impacto no produto.

## Registro de marcos

| Marco | Estado | Evidência principal | Próximo critério |
|---|---|---|---|
| P1 — Schemas e contratos executáveis | `HOMOLOGADO` | PR #105 + schemas/fixtures/CI | concluído |
| P2 — ContentService/normalizador | `HOMOLOGADO` | PR #106 + N0/N4/N4-EXIT em runtime canônico | concluído |
| P3 — Manifests e catálogo inicial | `HOMOLOGADO` | PR #107 + catálogo v2 + 2 manifests + integridade/descoberta em CI | concluído |
| P4 — Renderer real do Clássico | `NAO_INICIADO` | marco ativo | slice real renderizado + atividades necessárias + validação visual |
| P5 — ProgressService/revisão/Gist | `NAO_INICIADO` | — | progresso/revisão/persistência homologados |
| P6 — Feedback por IA | `NAO_INICIADO` | — | feedback/fallback homologados |
| P7 — Ampliação N0→N4 | `NAO_INICIADO` | — | catálogo clássico cobre escopo aprovado |
| P8 — Mídia/prontidão de publicação | `NAO_INICIADO` | — | blockers obrigatórios resolvidos |
| P9 — Homologação E2E | `NAO_INICIADO` | — | `CLÁSSICO HOMOLOGADO` |

## P1 — resumo

### `CL-P1-SCHEMAS`

```text
Estado: HOMOLOGADO
Escopo: schemas/course|unit|lesson|verification|progress.schema.json
Evidência: PR #105 + Validate contract schemas
```

### `CL-P1-FIXTURES-VALIDATOR`

```text
Estado: HOMOLOGADO
Escopo: schemas/fixtures/p1 + scripts/validate-contracts.mjs
Observação: a fixture de course acompanha a migração oficial de content/course.json para v2 em P3; lições/verificações autorais continuam v1
```

## P2 — resumo

### `CL-P2-NORMALIZER-V1`

```text
Estado: HOMOLOGADO
Escopo: content-normalizer-v1.js + content-normalization-rules-v1.js
Fluxo: autoria v1 → runtime canônico
Casos provados: N0-U01-L01, N0-U01-V01, N4-U09-L01, N4-U09-V01, N4-EXIT-V01
```

Regras históricas ambíguas não são interpretadas por regex. Sem estrutura explícita/regra legada auditável, retornar `UNNORMALIZABLE_COMPLETION`.

O N0 real exigiu suporte a:

```text
minimumEvidence
requiredAnyOf
```

para representar `4 de 5 + pelo menos uma entre Q10/Q11` sem distorcer o critério.

### `CL-P2-CONTENT-SERVICE`

```text
Estado: HOMOLOGADO
Escopo: app/js/services/content-service.js
P2: carregamento/normalização injetável
P3: estendido para descoberta por course.json → unit.json → fonte autoral
```

## P3 — itens homologados

### `CL-P3-COURSE-CATALOG`

```text
Escopo: content/course.json
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA do catálogo
Publicação: NAO_APLICAVEL ao arquivo de catálogo em si
Evidência: schemaVersion 2 + Validate publication catalog + Test catalog discovery
```

O catálogo é incremental. Neste marco ele publica a descoberta de `N0-U01` e `N4-U09`; N1–N3 e demais unidades continuam existentes como autoria curricular e serão adicionados à camada de publicação em P7.

### `CL-P3-MANIFEST-N0-U01`

```text
Escopo: content/units/001-fala-sons-escrita/unit.json
Estado consolidado: IMPLEMENTADO_COM_PENDENCIA
Técnico: IMPLEMENTADO
Homologação do manifesto: HOMOLOGADO
Mídia: MIDIA_OBRIGATORIA_PARA_ATIVIDADE
Publicação: BLOQUEADO
Conteúdo declarado: 8 lições + N0-U01-V01
Registry: N0-U01-C01 ... N0-U01-C08
Blockers: áudios controlados obrigatórios ainda pendentes; renderer P4 ainda ausente
Evidência: validator confirma 100% das lições autorais declaradas e refs/IDs/títulos coerentes
```

O blocker de áudio é local: P4 pode implementar telas, atividades, fallback/estado de mídia e tudo que não dependa do estímulo definitivo.

### `CL-P3-MANIFEST-N4-U09`

```text
Escopo: content/units/409-literatura-multimodalidade-autoria-intermedial-digital/unit.json
Estado consolidado: IMPLEMENTADO_COM_PENDENCIA
Técnico: IMPLEMENTADO
Homologação do manifesto: HOMOLOGADO
Mídia: SEM_DEPENDENCIA de nova mídia humana obrigatória
Publicação: BLOQUEADO
Conteúdo declarado: 12 lições + N4-U09-V01
Registry: N4-U09-C01 ... N4-U09-C12
Blocker: renderer P4 ainda ausente
Evidência: validator confirma 100% das lições autorais declaradas e refs/IDs/títulos coerentes
```

### `CL-P3-COMPETENCY-MAPPING`

```text
Escopo: schemas/unit.schema.json + unit.json reais
Estado: HOMOLOGADO
Decisão: referências de lição/verificação podem declarar competencyIds; registry mantém IDs estáveis e sourceLabels humanos
```

Isso impede o normalizador de atribuir todas as competências da unidade indiscriminadamente a cada lição.

### `CL-P3-CATALOG-INTEGRITY`

```text
Escopo: scripts/validate-catalog.mjs + scripts/test-content-catalog.mjs + CI
Estado: HOMOLOGADO
Verifica: schemas, IDs, títulos, ordens, paths seguros, competências, cobertura de todas as lições autorais, verification, manifests órfãos e carregamento real pelo ContentService
Evidência: PR #107 — Validate publication catalog + Test catalog discovery = success
```

## Blockers e pendências abertas

### Blocker global para iniciar P4

```text
nenhum
```

### Pendência local conhecida

```text
N0-U01
→ áudios controlados obrigatórios ainda não produzidos/validados
→ manifesto e renderer podem avançar
→ atividades dependentes não podem ser homologadas pedagogicamente/publicadas com estímulo final até a mídia existir
```

### Warnings transitórios

Os módulos `content-normalization-rules-v1.js`, `content-normalizer-v1.js` e `content-service.js` continuam não alcançáveis pelo `index.html` até P4 conectá-los à aplicação. São warnings esperados e devem desaparecer/reduzir quando o renderer real entrar.

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

## Condição de avanço

Um marco pode avançar com pendências locais não bloqueantes quando sua condição de saída estiver satisfeita e as pendências continuarem explícitas.

## Gate `CLÁSSICO HOMOLOGADO`

Só P9 pode satisfazer o gate. Nenhuma implementação de XP, missões, conquistas, streak ou progressão gamificada começa antes dele.
