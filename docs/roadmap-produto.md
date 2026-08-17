# Roadmap de Produto

## Função

Registrar a ordem e as condições de saída da fase de produto/publicação após o fechamento curricular N0→N4.

- maturidade curricular: `docs/roadmap-curricular.md`;
- estado operacional exato: `docs/estado-implementacao-classico.md`.

## Estado atual

```text
CURRÍCULO N0→N4 → fechado curricularmente em M5
P1 — Schemas/contratos executáveis → HOMOLOGADO
P2 — ContentService/normalizador → HOMOLOGADO
P3 — Manifests e catálogo inicial → HOMOLOGADO
P4 — Renderer real do Clássico → HOMOLOGADO
MARCO ATIVO → P5 — ProgressService, revisão e persistência
MODO CLÁSSICO REAL → slice funcional; ainda não completo de ponta a ponta
MODO GAMIFICADO → somente após CLÁSSICO HOMOLOGADO
```

## Sequência estratégica: Clássico primeiro

```text
P1 schemas/contratos
→ P2 runtime/normalizador
→ P3 catálogo/manifests
→ P4 renderer clássico
→ P5 progresso/revisão/Gist
→ P6 feedback IA quando aplicável
→ P7 expansão N0→N4
→ P8 mídia/publicação
→ P9 homologação E2E
────────────────────────────
GATE: CLÁSSICO HOMOLOGADO
────────────────────────────
→ P10 Modo Gamificado
→ P11 homologação/calibração gamificada
```

Antes do gate não implementar XP, missões, conquistas ou streak como produto, não fazer o Clássico depender de jogo e não alterar currículo para preparar recompensa. Casos-âncora podem ser observados para calibração posterior.

## Política transversal de mídia

```text
mídia ausente
→ registrar dependência/mediaId
→ implementar tudo que é independente
→ bloquear somente homologação/publicação do escopo dependente
→ continuar
```

Detalhes: `docs/estado-implementacao-classico.md`, `docs/conteudo.md`, `producao-midia/README.md`.

## P1 — Schemas e contratos executáveis

**Estado: HOMOLOGADO.**

Schemas `course`, `unit`, `lesson`, `verification` e `progress`, fixtures reais N0/N4 e validator em CI. Autoria histórica de lições/verificações permanece v1 e é normalizada em runtime canônico.

## P2 — ContentService e normalizador

**Estado: HOMOLOGADO.**

```text
fonte autoral v1
→ adapter/ContentService
→ runtime canônico
→ schema P1
→ teste verde
```

Prosa histórica ambígua nunca é convertida por heurística. Sem estrutura/regra legada explícita, usar `UNNORMALIZABLE_COMPLETION`.

## P3 — Manifests e catálogo inicial

**Estado: HOMOLOGADO.**

Entregas:

```text
content/course.json v2
unit.json N0-U01
unit.json N4-U09
registry de competências estáveis
competencyIds por lição/verificação
ContentService: catálogo → manifesto → fonte → runtime
integridade/descoberta em CI
```

Slice:

```text
N0-U01 → 8 lições + verificação
N4-U09 → 12 lições + verificação
```

Demais unidades continuam como autoria curricular e entram na publicação progressiva em P7.

## P4 — Renderer real do Clássico

**Estado: HOMOLOGADO.**

O slice deixou de ser placeholder e passou a ser uma experiência Clássica funcional baseada exclusivamente no catálogo/manifests.

Entregas homologadas:

- home real do curso;
- tela real de unidade;
- tela real de lição;
- rota e tela de verificação integrada;
- blocos `CONTENT`;
- `SINGLE_CHOICE`, `MULTIPLE_CHOICE`, `CLASSIFY`, `MATCH`, `ORDER/SEQUENCE`, respostas abertas e `COMPOSITE` necessários ao slice;
- TTS via `NarrationService`;
- mídia controlada ausente representada explicitamente por `mediaId`;
- correção determinística de lição sem punição;
- feedback neutro em verificações com `AFTER_VERIFICATION`;
- `RELIABLE_EVALUATOR` representado como avaliação pendente, sem declarar domínio;
- estados de loading/erro/fora-do-catálogo explícitos;
- camada pública que não expõe IDs/status de runtime/publicação ao aluno;
- smoke DOM + screenshots automáticos.

Validação:

```text
20/20 lições do slice
+ 2/2 verificações
→ renderizadas sem estado unsupported

Desktop → home/unidade/lição N0 + lição N4
Tablet → unidade N0
Mobile 390px → home + lição N0
→ inspecionados visualmente
```

O smoke de navegador falha automaticamente em tela de erro, `Illegal invocation`, interação sem suporte e metadados internos conhecidos na interface pública.

Durante P4, N0-U01-L02...L08 revelou critérios históricos ainda em prosa. Foram formalizados por ID, mantendo a regra de não interpretar prosa por regex. Datasets autorais como `letterSet`, `letterPairs` e classificação vogal/consoante passaram a ser materializados pelo adapter, sem reescrever as lições.

Estado local após P4:

```text
N0-U01
→ renderer homologado
→ manifesto BLOCKED somente pelos áudios controlados obrigatórios ainda pendentes

N4-U09
→ renderer homologado
→ nenhuma nova mídia humana obrigatória
→ manifesto READY
```

A pendência N0 é local e não impede P5–P7.

## P5 — ProgressService, revisão e persistência

**Estado: MARCO ATIVO / PRÓXIMO.**

Objetivo: transformar respostas/interações P4 em estado pedagógico persistente sem misturar percurso, domínio e gamificação.

Entregas:

- `ProgressService` isolado da UI;
- eventos pedagógicos do renderer para o serviço;
- estados de lição `NAO_INICIADA`, `EM_ESTUDO`, `CONCLUIDA`;
- estados de evidência `NAO_OBSERVADA`, `PRATICADA`, `DEMONSTRADA`, `VALIDACAO_PENDENTE`, `REVISAO_RECOMENDADA`;
- estados de competência `NOVA`, `EM_DESENVOLVIMENTO`, `DEMONSTRADA`, `CONSOLIDADA`;
- políticas `DEMONSTRATED_REQUIRED`, `PENDING_ALLOWED`, `ATTEMPT_REQUIRED`;
- suporte a `minimumEvidence` + `requiredAnyOf`;
- fila de revisão explicável e não punitiva;
- schema de progresso v1 em uso real;
- save/load local;
- migração de schema;
- GitHubService/Gist usando `portugues-completo-progress.json`;
- merge/conflitos entre dispositivos;
- falha de sync sem perda local.

Ordem recomendada:

```text
motor em memória
→ testes de completion/evidência
→ persistência local
→ revisão
→ Gist
→ conflito/sync
→ integração UI
```

Antes de implementar credencial, scopes ou chamadas Gist, verificar documentação oficial atual do GitHub; esses detalhes não são congelados por memória do projeto.

Condição de saída:

```text
interação do aluno
→ evento pedagógico
→ evidência
→ conclusão/domínio honestos
→ revisão quando aplicável
→ estado salvo/restaurado
→ sync remoto sem perda
```

O Clássico não cria nem mantém XP oculto.

## P6 — Feedback por IA no Clássico

Objetivo: feedback opt-in em atividades elegíveis.

Entregas: provider/model configurável, BYOK, chave fora de Git/Gist/progresso, `AiFeedbackService`, structured output, minimização de contexto/custo, fallback e preservação de `VALIDACAO_PENDENTE` quando avaliador confiável é exigido.

## P7 — Ampliação do catálogo Clássico N0→N4

Objetivo: levar o pipeline homologado ao curso inteiro.

```text
normalizar
→ manifestar/publicar
→ validar
→ renderizar
→ testar
→ homologar o possível
→ registrar mídia/blockers locais
→ continuar
```

Não reescrever conteúdo em massa para satisfazer renderer.

Condição de saída: catálogo cobre N0→N4, tipos necessários têm suporte ou blocker explícito e navegação alcança o percurso completo.

## P8 — Mídia e prontidão de publicação do Clássico

Objetivo: resolver blockers realmente obrigatórios, não produzir mídia decorativa.

Reconciliar fila de mídia, ligar mídias validadas, resolver `MIDIA_OBRIGATORIA_PARA_ATIVIDADE/PUBLICACAO`, garantir equivalentes acessíveis e reclassificar itens aptos/publicáveis.

## P9 — Homologação end-to-end do Clássico

Objetivo: provar o produto-base antes da gamificação.

Cobrir primeira entrada, navegação N0→N4, atividades determinísticas/estruturadas/abertas, feedback, revisão, pending, domínio, persistência/Gist, conflitos, IA ativa/desligada/falhando, mídia obrigatória, acessibilidade, desktop/tablet/mobile e recuperação sem perda.

### Gate `CLÁSSICO HOMOLOGADO`

```text
núcleo pedagógico estável
+ N0→N4 utilizável
+ feedback/revisão/progresso coerentes
+ persistência confiável
+ blockers obrigatórios tratados
+ E2E aprovado
+ nenhuma dependência de gamificação para estudar
```

P10 não começa antes desse gate.

## P10 — Modo Gamificado

Adicionar seleção/troca de modo, XP, progressão visual, conquistas, missões e streak não punitivo sobre o motor clássico homologado. Não há XP retroativo ao período estudado apenas no Clássico.

A economia nasce dos casos-âncora observados durante P3–P9 conforme `docs/calibracao-produto.md`.

## P11 — Homologação/calibração gamificada

Cobrir troca de modos, preservação de domínio, coerência/resistência a farm, revisão/recuperação, missões/conquistas, streak/fusos, acessibilidade, responsividade e usuários reais quando possível.

## Próximo passo oficial

```text
P5 — ProgressService, revisão e persistência
```
