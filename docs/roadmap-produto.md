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
MARCO ATIVO → P4 — Renderer real do Clássico
MODO CLÁSSICO REAL → ainda não completo de ponta a ponta
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

Entregas:

```text
schemas/course.schema.json
schemas/unit.schema.json
schemas/lesson.schema.json
schemas/verification.schema.json
schemas/progress.schema.json
schemas/fixtures/p1/
scripts/validate-contracts.mjs
CI: Validate contract schemas
```

Extremos reais: N0-U01 e N4-U09. Autoria histórica de lições/verificações permanece v1 e é normalizada em runtime canônico.

## P2 — ContentService e normalizador

**Estado: HOMOLOGADO.**

Entregas:

```text
app/js/services/content-service.js
app/js/services/content-normalizer-v1.js
app/js/services/content-normalization-rules-v1.js
scripts/test-content-normalizer.mjs
CI: Test content normalization
```

Fluxo provado:

```text
fonte autoral v1
→ adapter/ContentService
→ runtime canônico
→ schema P1
→ teste verde
```

Cobertura mínima homologada: N0-U01-L01, N0-U01-V01, N4-U09-L01, N4-U09-V01 e N4-EXIT-V01.

Prosa histórica ambígua nunca é interpretada por heurística; sem estrutura/regra legada explícita, usar `UNNORMALIZABLE_COMPLETION`.

O N0 exigiu `minimumEvidence` + `requiredAnyOf` para representar regras compostas de cluster sem média global.

## P3 — Manifests e catálogo inicial

**Estado: HOMOLOGADO.**

Entregas concluídas:

```text
content/course.json → schemaVersion 2
content/units/001-fala-sons-escrita/unit.json
content/units/409-literatura-multimodalidade-autoria-intermedial-digital/unit.json
registry estável N0-U01-C01...C08
registry estável N4-U09-C01...C12
competencyIds por referência de lição/verificação
ContentService: course.json → unit.json → fonte → runtime
scripts/validate-catalog.mjs
scripts/test-content-catalog.mjs
CI: Validate publication catalog + Test catalog discovery
```

Slice publicado na camada de descoberta:

```text
N0-U01 → 8 lições + verificação
N4-U09 → 12 lições + verificação
```

O catálogo é incremental: demais unidades continuam existindo como autoria curricular e entram na camada de publicação em P7.

A integridade P3 verifica schema, identidade catálogo/manifesto, IDs/títulos/ordens, paths seguros, competências, cobertura completa da pasta `lessons/`, verification e manifesto real órfão.

Estado de publicação atual:

```text
N0-U01 → BLOCKED por mídia obrigatória local + renderer P4
N4-U09 → BLOCKED somente pelo renderer P4
```

Esses blockers não invalidam P3; descoberta e integridade estão homologadas.

## P4 — Renderer real do Clássico

**Estado: MARCO ATIVO.**

Objetivo: substituir placeholders por conteúdo normalizado real em experiência exclusivamente clássica.

Entregas:

- conectar `app.js` ao `ContentService`/catálogo;
- home baseada no catálogo real;
- tela de unidade baseada em `unit.json`;
- tela de lição baseada no runtime normalizado;
- blocos `CONTENT`;
- primitivas `ACTIVITY` necessárias ao slice;
- feedback determinístico e representação de evidência/pending no escopo P4;
- estados de loading, erro, mídia pendente e tipo não suportado explícitos;
- acessibilidade por teclado e semântica;
- integração TTS existente;
- mídia por `mediaId` com fallback seguro/placeholder de desenvolvimento onde permitido.

Slice de homologação:

```text
N0-U01
+
N4-U09
```

O N0 deve provar interações determinísticas, classificação, sequência e áudio controlado como dependência explícita. O N4 deve provar respostas abertas e `RELIABLE_EVALUATOR`/`PENDING_ALLOWED` sem fingir validação automática.

Validação visual obrigatória conforme `.ChatGPT/skills/frontend-visual-check/SKILL.md` em desktop, tablet e mobile.

Condição de saída:

```text
catálogo real
→ unidade real
→ lição real
→ conteúdo/atividade renderizados
→ feedback/estado explícito
→ navegação/teclado/responsividade validados
→ sem esconder tipo não suportado
```

Mídia N0 ainda ausente pode deixar atividades específicas `IMPLEMENTADO_COM_PENDENCIA`; não bloqueia renderer independente.

## P5 — ProgressService, revisão e persistência

Objetivo: implementar o motor pedagógico do Clássico.

Entregas: estados de lição/evidência/competência, clusters `DEMONSTRATED_REQUIRED`/`PENDING_ALLOWED`/`ATTEMPT_REQUIRED`, revisão, schema de progresso em uso, save/load local, GitHubService/Gist, migração, conflitos e falha de sync sem perda local.

Detalhes atuais de autenticação/permissões GitHub devem ser verificados em documentação oficial no momento da implementação.

## P6 — Feedback por IA no Clássico

Objetivo: feedback opt-in em atividades elegíveis.

Entregas: provider/model configurável, BYOK, chave fora de Git/Gist/progresso, `AiFeedbackService`, structured output, minimização de contexto/custo, fallback, testes e preservação de `VALIDACAO_PENDENTE` quando avaliador confiável é exigido.

## P7 — Ampliação do catálogo Clássico N0→N4

Objetivo: levar o pipeline homologado do slice ao curso inteiro.

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

Entregas: reconciliar fila de mídia, ligar mídias validadas, resolver `MIDIA_OBRIGATORIA_PARA_ATIVIDADE/PUBLICACAO`, garantir equivalentes acessíveis, confirmar Pages/rotas/providers e reclassificar itens aptos/publicáveis.

## P9 — Homologação end-to-end do Clássico

Objetivo: provar o produto-base antes da gamificação.

Cobrir primeira entrada, navegação N0→N4, lições simples/complexas, atividades determinísticas/estruturadas/abertas, feedback, revisão, pending, domínio, persistência/Gist, conflito entre dispositivos, IA ativa/desligada/falhando, mídia obrigatória, acessibilidade, desktop/tablet/mobile e recuperação sem perda de trabalho.

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
P4 — Renderer real do Clássico
```

Primeiro fluxo concreto:

```text
app.js
→ ContentService.loadCatalog()
→ N0-U01 / N4-U09
→ unit.json
→ lesson runtime
→ renderer clássico
→ validação visual desktop/tablet/mobile
```
