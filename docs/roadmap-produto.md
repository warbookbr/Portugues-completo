# Roadmap de Produto

## Função

Registrar a ordem e as condições de saída da fase de produto/publicação após o fechamento curricular N0→N4.

- maturidade curricular: `docs/roadmap-curricular.md`;
- estado operacional exato: `docs/estado-implementacao-classico.md`.

## Estado atual

```text
CURRÍCULO N0→N4
→ fechado curricularmente em M5

P1 — SCHEMAS/CONTRATOS EXECUTÁVEIS
→ HOMOLOGADO

P2 — CONTENTSERVICE/NORMALIZADOR
→ HOMOLOGADO

MARCO ATIVO
→ P3 — Manifests e catálogo inicial

MODO CLÁSSICO REAL
→ ainda não completo de ponta a ponta

MODO GAMIFICADO
→ deliberadamente posterior ao gate CLÁSSICO HOMOLOGADO
```

## Sequência estratégica: Clássico primeiro

```text
schemas/contratos
→ runtime/normalizador
→ catálogo/manifests
→ renderer clássico
→ progresso/revisão/Gist
→ feedback IA quando aplicável
→ expansão N0→N4
→ mídia/publicação
→ homologação E2E
────────────────────────────
GATE: CLÁSSICO HOMOLOGADO
────────────────────────────
→ Modo Gamificado
→ homologação/calibração gamificada
```

Antes do gate:

- não implementar XP, missões, conquistas ou streak como produto;
- não fazer o Clássico depender de infraestrutura gamificada;
- não alterar currículo para preparar recompensa;
- casos-âncora de esforço/recuperação podem ser registrados para calibração futura.

## Mídia/material de apoio

Mídia pendente não bloqueia o desenvolvimento global.

```text
mídia ausente
→ registrar dependência/mediaId
→ implementar tudo que é independente
→ bloquear somente homologação/publicação do escopo dependente
→ continuar
```

Detalhes: `docs/estado-implementacao-classico.md`, `docs/conteudo.md` e `producao-midia/README.md`.

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

Extremos reais: N0-U01 e N4-U09.

Decisão:

```text
autoria histórica v1
→ preservada
→ normalizada em P2
→ runtime canônico validado pelos schemas
```

## P2 — ContentService e normalizador

**Estado: HOMOLOGADO.**

Entregas concluídas:

```text
app/js/services/content-service.js
app/js/services/content-normalizer-v1.js
app/js/services/content-normalization-rules-v1.js
scripts/test-content-normalizer.mjs
CI: Test content normalization
```

Fluxo provado:

```text
fonte autoral v1 real
→ ContentService/adapter v1
→ runtime canônico
→ schema P1
→ teste verde
```

Casos homologados:

- N0-U01-L01 — single choice, classify, TTS, threshold e conclusão determinística;
- N0-U01-V01 — 12 itens, controlled audio, sequence, thresholds e clusters não compensáveis;
- N4-U09-L01 — resposta aberta, `RELIABLE_EVALUATOR`, `PENDING_ALLOWED`;
- N4-U09-V01 — produção complexa, tarefa fechada e clusters não compensáveis;
- N4-EXIT-V01 — `LEVEL_VERIFICATION` com oito clusters obrigatórios.

### Regra legada

Prosa histórica ambígua não é interpretada por heurística/regex.

```text
estrutura explícita disponível
→ normalizar diretamente

prosa histórica sem estrutura suficiente
→ regra legada auditável por ID

sem estrutura e sem regra explícita
→ UNNORMALIZABLE_COMPLETION
```

### Refinamento de cluster descoberto no N0

`N0-U01-V01` exige um caso que o P1 inicialmente não expressava por completo:

```text
4 de 5 evidências
+
pelo menos uma entre Q10/Q11
```

O contrato passou a admitir campos opcionais:

```text
minimumEvidence
requiredAnyOf
```

Isso preserva a regra real sem transformar o cluster em média global.

### Warnings transitórios

Os módulos de P2 ainda não são alcançáveis pelo `index.html`. O validator estrutural emite warnings até P3/P4 conectarem o serviço ao produto. Isso não é blocker.

## P3 — Manifests e catálogo inicial

**Estado: MARCO ATIVO / PRÓXIMO.**

Objetivo: tornar conteúdo real descobrível sem listas hardcoded no JavaScript.

Entregas:

- `content/units/001-fala-sons-escrita/unit.json`;
- `content/units/409-literatura-multimodalidade-autoria-intermedial-digital/unit.json`;
- registry de competências estáveis das duas unidades;
- referências de lições/verificações;
- publication status + blockers;
- `content/course.json` schema v2 com o slice inicial;
- validator de integridade catálogo → manifesto → conteúdo;
- `ContentService` carregando pelo catálogo/manifests, não por paths hardcoded na UI.

Slice:

```text
N0-U01
+
N4-U09
```

Condição de saída:

```text
course.json v2
→ unit.json
→ fontes reais
→ ContentService
→ runtime normalizado
→ integridade/CI verdes
```

As unidades podem manter `BLOCKED`/`DRAFT` para publicação quando mídia ou etapas posteriores ainda faltarem; isso não invalida P3 se a descoberta e integridade estiverem corretas.

## P4 — Renderer real do Clássico

Objetivo: substituir placeholders por conteúdo normalizado real em experiência exclusivamente clássica.

Entregas:

- tela de unidade;
- tela de lição;
- blocos `CONTENT`;
- primitivas `ACTIVITY` necessárias ao slice;
- feedback/evidência/pending;
- loading/erro/unsupported explícitos;
- acessibilidade e teclado;
- mídia por `mediaId`/fallback seguro.

Validação visual obrigatória em desktop, tablet e mobile conforme `.ChatGPT/skills/frontend-visual-check/SKILL.md`.

## P5 — ProgressService, revisão e persistência

Objetivo: implementar o motor pedagógico do Clássico.

Entregas:

- estados de lição/evidência/competência;
- clusters `DEMONSTRATED_REQUIRED`, `PENDING_ALLOWED`, `ATTEMPT_REQUIRED`, incluindo políticas internas de quantidade/grupo quando declaradas;
- revisão;
- schema v1 de progresso em uso;
- save/load local;
- GitHubService/Gist;
- migração e conflitos;
- falha de sync sem perda local.

Detalhes atuais de autenticação/permissões GitHub devem ser verificados em documentação oficial no momento da implementação.

## P6 — Feedback por IA no Clássico

Objetivo: adicionar feedback opt-in às atividades elegíveis.

Entregas:

- provider/model configurável;
- BYOK por aluno;
- key fora de Git/Gist/progresso;
- `AiFeedbackService` + adapter inicial;
- structured output;
- minimização de contexto/custo;
- fallback;
- testes adversariais/mocks;
- `VALIDACAO_PENDENTE` preservada quando avaliador confiável é exigido.

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

Condição de saída:

- catálogo cobre N0→N4 no escopo aprovado;
- tipos necessários possuem suporte ou blocker explícito;
- navegação alcança o percurso completo.

## P8 — Mídia e prontidão de publicação do Clássico

Objetivo: resolver blockers de publicação realmente obrigatórios, não produzir mídia decorativa.

Entregas:

- reconciliar `producao-midia/FILA-MIDIA.md` com estado do produto;
- ligar mídias validadas;
- resolver `MIDIA_OBRIGATORIA_PARA_ATIVIDADE/PUBLICACAO` do escopo final;
- garantir equivalentes acessíveis;
- confirmar providers/rotas/Pages;
- reclassificar itens como aptos/publicáveis.

## P9 — Homologação end-to-end do Clássico

Objetivo: provar o produto-base antes de qualquer gamificação.

Cobrir pelo menos:

- primeira entrada e navegação N0→N4;
- lições simples/complexas;
- atividades determinísticas, estruturadas e abertas;
- feedback, revisão e `VALIDACAO_PENDENTE`;
- progresso/domínio;
- persistência/Gist e conflito entre dispositivos;
- IA desligada/ativa/falhando;
- mídia obrigatória;
- acessibilidade;
- desktop/tablet/mobile;
- recuperação após erro e falhas sem perda de trabalho.

### Gate: `CLÁSSICO HOMOLOGADO`

```text
núcleo pedagógico estável
+ N0→N4 utilizável no Clássico
+ feedback/revisão/progresso coerentes
+ persistência confiável
+ blockers obrigatórios tratados
+ E2E aprovado
+ nenhuma dependência de gamificação para estudar
```

P10 não começa antes desse gate.

## P10 — Modo Gamificado

Objetivo: adicionar uma segunda experiência sobre o motor clássico homologado.

Entregas iniciais: seleção/troca de modo, XP, progressão visual, conquistas, missões, streak não punitivo e preservação integral do progresso pedagógico. Não há XP retroativo ao período estudado apenas no Clássico.

A economia nasce dos casos-âncora observados durante P3–P9 conforme `docs/calibracao-produto.md`.

## P11 — Homologação/calibração gamificada

Cobrir troca de modos, preservação de domínio, coerência/resistência a farm da economia, revisão/recuperação, missões/conquistas, streak/fusos, acessibilidade, responsividade e usuários reais quando possível.

Condição de saída:

```text
baselines gamificados homologados
+ principais distorções corrigidas
+ nenhuma mecânica de jogo controlando domínio/gates
+ Clássico continua funcional sozinho
```

## Próximo passo oficial

```text
P3 — Manifests e catálogo inicial
```

Próximo caso concreto:

```text
N0-U01 + N4-U09
→ unit.json + competência registry
→ content/course.json v2
→ integridade catálogo → manifesto → conteúdo
→ ContentService carregando o slice por descoberta
```
