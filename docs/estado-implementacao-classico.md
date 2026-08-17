# Estado de implementação do Modo Clássico

## Objetivo

Registro operacional canônico do desenvolvimento do Modo Clássico. Deve permitir que uma nova instância descubra, sem depender da conversa anterior:

```text
onde paramos?
o que foi implementado e homologado?
o que continua parcial?
qual mídia/dependência ainda existe?
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
Marco concluído mais recente: P4 — Renderer real do Clássico
Marco ativo: P5 — ProgressService, revisão e persistência
Item ativo: ainda não iniciado
Último item concluído: CL-P4-APP-ROUTES + CL-P4-RENDERER-SLICE + CL-P4-N0-LEGACY + CL-P4-VISUAL-SMOKE
Próximo passo exato: implementar ProgressService sobre o runtime P4, começando por estados de lição/evidência/competência e políticas de completion cluster; depois revisão + persistência local e, por último, Gist/sync/conflitos
Blocker atual do próximo passo: nenhum blocker técnico global; detalhes atuais de autenticação/permissões GitHub precisam ser verificados em documentação oficial durante a parte Gist de P5
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
- Placeholder serve para desenvolvimento, nunca para fingir homologação de estímulo ausente.
- `MIDIA_OBRIGATORIA_PARA_ATIVIDADE` impede homologar pedagogicamente a atividade sem o estímulo final, mas não paralisa o produto.
- `producao-midia/FILA-MIDIA.md` rastreia produção do arquivo; este documento rastreia impacto no produto.

## Registro de marcos

| Marco | Estado | Evidência principal | Próximo critério |
|---|---|---|---|
| P1 — Schemas e contratos executáveis | `HOMOLOGADO` | PR #105 + schemas/fixtures/CI | concluído |
| P2 — ContentService/normalizador | `HOMOLOGADO` | PR #106 + runtime canônico N0/N4/N4-EXIT | concluído |
| P3 — Manifests e catálogo inicial | `HOMOLOGADO` | PR #107 + catálogo v2 + manifests + integridade | concluído |
| P4 — Renderer real do Clássico | `HOMOLOGADO` | PR #108 + 20 lições/2 verificações + DOM smoke + screenshots desktop/tablet/mobile | concluído |
| P5 — ProgressService/revisão/Gist | `NAO_INICIADO` | marco ativo | progresso/revisão/persistência homologados |
| P6 — Feedback por IA | `NAO_INICIADO` | — | feedback/fallback homologados |
| P7 — Ampliação N0→N4 | `NAO_INICIADO` | — | catálogo clássico cobre escopo aprovado |
| P8 — Mídia/prontidão de publicação | `NAO_INICIADO` | — | blockers obrigatórios resolvidos |
| P9 — Homologação E2E | `NAO_INICIADO` | — | `CLÁSSICO HOMOLOGADO` |

## P1–P3 — base homologada

```text
P1
→ schemas course/unit/lesson/verification/progress
→ fixtures reais N0/N4
→ validação mecânica em CI

P2
→ autoria v1 preservada
→ adapter/normalizador
→ runtime canônico
→ regra histórica ambígua falha explicitamente, sem heurística

P3
→ content/course.json v2
→ manifests reais N0-U01 + N4-U09
→ IDs estáveis de competência
→ catálogo → manifesto → autoria → runtime
→ 20 lições + 2 verificações descobríveis
```

O N0 exigiu suporte a `minimumEvidence` + `requiredAnyOf` para representar critérios compostos sem transformar clusters em média global.

## P4 — itens homologados

### `CL-P4-APP-ROUTES`

```text
Escopo: app/js/app.js + app/js/core/router.js
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO
Mídia: SEM_DEPENDENCIA
Publicação: NAO_APLICAVEL
```

Fluxos reais:

```text
#/
#/unidade/:unitId
#/unidade/:unitId/licao/:lessonId
#/unidade/:unitId/verificacao
```

O app usa apenas catálogo/manifests para descobrir conteúdo. Conteúdo fora do catálogo recebe estado explícito, não placeholder enganoso.

### `CL-P4-RENDERER-SLICE`

```text
Escopo: app/js/ui/classic-renderer.js + classic-presentation.js + CSS Classic
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO no slice P4
Mídia: dependência herdada por atividade quando aplicável
Publicação: APTO tecnicamente; publicação final continua governada pelo manifesto/P8
```

Primitivas provadas no slice:

```text
CONTENT
SINGLE_CHOICE
MULTIPLE_CHOICE
CLASSIFY
MATCH
ORDER / SEQUENCE
SHORT_TEXT
STRUCTURED_RESPONSE
LONG_TEXT
ORAL_RESPONSE como registro técnico textual nesta fase
COMPOSITE
```

Comportamentos provados:

- TTS real via `NarrationService`;
- `CONTROLLED_AUDIO` ausente vira placeholder explícito por `mediaId`;
- correção determinística nas lições sem penalidade por nova tentativa;
- verificações com `AFTER_VERIFICATION` não revelam correção detalhada por item;
- atividades `RELIABLE_EVALUATOR` permanecem como avaliação/validação pendente;
- nenhum `unsupported` existe nas 20 lições + 2 verificações do slice;
- metadados técnicos de runtime/publicação não são expostos ao aluno.

### `CL-P4-N0-LEGACY`

Durante P4 o slice completo revelou sete lições N0 que ainda possuíam critérios de conclusão históricos em prosa. Eles foram formalizados por ID em `content-normalization-rules-v1.js`, sem alterar os JSONs curriculares e sem interpretar prosa por regex.

Também foram materializadas, a partir dos datasets autorais existentes:

```text
N0-U01-L03 → letterSet
N0-U01-L04 → letterPairs
N0-U01-L05 → classificação vogal/consoante
```

O normalizador ainda remove chaves de gabarito do payload de apresentação; respostas corretas pertencem à política de avaliação, não ao conteúdo exibido.

### `CL-P4-VISUAL-SMOKE`

```text
Escopo: scripts/test-classic-renderer.mjs + scripts/capture-classic-visuals.sh + CI
Estado consolidado: HOMOLOGADO
Evidência funcional: 20/20 lições + 2/2 verificações renderizadas sem unsupported
Evidência visual: home/unidade/lição N0 + lição N4 em desktop; unidade em tablet; home/lição em 390px
```

O smoke de navegador agora falha automaticamente se detectar:

```text
tela de erro
Illegal invocation
interação unsupported
metadado BLOCKED/IDs internos na interface pública
rótulos internos conhecidos
TTS autoral não transformado em controle
pending N4 ausente
```

A inspeção humana das screenshots confirmou hierarquia, leitura e ausência de overflow aparente nos viewports cobertos.

## Estado de publicação do slice após P4

### N0-U01

```text
Renderer: HOMOLOGADO
TTS/UI/texto: HOMOLOGADOS no escopo P4
Mídia: MIDIA_OBRIGATORIA_PARA_ATIVIDADE ainda pendente para áudios controlados
Manifesto: BLOCKED somente pela mídia obrigatória local
Consequência: desenvolvimento P5–P7 continua; atividades dependentes do áudio não recebem homologação pedagógica final nem PUBLICAVEL até a mídia existir
```

### N4-U09

```text
Renderer: HOMOLOGADO
Nova mídia humana obrigatória: nenhuma
Manifesto: READY
Produções abertas: continuam VALIDACAO_PENDENTE quando exigem avaliador confiável
```

`READY` no manifesto não significa que o produto Clássico completo já passou P9; significa somente que esta unidade não mantém blocker local de publicação registrado após P4.

## Pendências abertas

### Blocker global para iniciar P5

```text
nenhum
```

### Pendência local conhecida

```text
N0-U01
→ áudios controlados obrigatórios ainda não produzidos/validados
→ P5/P6/P7 podem continuar
→ P8 reconcilia e resolve blockers obrigatórios para publicação final
```

## Próximo marco — P5

Implementar na ordem:

```text
1. ProgressService e eventos pedagógicos
2. estados de lição/evidência/competência
3. completion clusters: DEMONSTRATED_REQUIRED / PENDING_ALLOWED / ATTEMPT_REQUIRED
4. revisão e recomendação
5. persistência local + migração
6. Gist remoto
7. conflito/sync entre dispositivos sem perda
```

A parte GitHub/Gist deve verificar documentação oficial atual antes de congelar token/scopes/fluxo.

## Condição de avanço

Um marco pode avançar com pendências locais não bloqueantes quando sua condição de saída estiver satisfeita e as pendências continuarem explícitas.

## Gate `CLÁSSICO HOMOLOGADO`

Só P9 pode satisfazer o gate. Nenhuma implementação de XP, missões, conquistas, streak ou progressão gamificada começa antes dele.
