# Roadmap de Produto

## Função

Registrar a ordem e as condições de saída da fase de produto/publicação depois do fechamento curricular N0→N4.

- maturidade curricular: `docs/roadmap-curricular.md`;
- estado operacional exato do Clássico: `docs/estado-implementacao-classico.md`.

```text
roadmap-produto
→ para onde vamos + condição de saída

estado-implementacao-classico
→ onde paramos + itens/blockers/próximo passo
```

## Estado atual

```text
CURRÍCULO N0→N4
→ fechado curricularmente em M5

CONTRATOS DE PRODUTO
→ definidos

P1 — SCHEMAS E CONTRATOS EXECUTÁVEIS
→ HOMOLOGADO

MARCO ATIVO
→ P2 — ContentService e normalizador

MODO CLÁSSICO REAL
→ ainda não completo de ponta a ponta

MODO GAMIFICADO
→ deliberadamente posterior ao gate CLÁSSICO HOMOLOGADO
```

## Sequência estratégica: Clássico primeiro

O modo Clássico é o produto-base.

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

Enquanto o gate não estiver satisfeito:

- não implementar XP;
- não implementar missões/conquistas/streak como produto;
- não fazer o Clássico depender de infraestrutura de jogo;
- não alterar currículo para preparar recompensa;
- pode registrar casos-âncora de esforço/recuperação para calibração futura.

## Mídia/material de apoio durante o Clássico

Mídia pendente **não bloqueia o desenvolvimento global**.

```text
mídia ausente
→ registrar dependência/mediaId
→ implementar tudo que é independente
→ classificar impacto
→ continuar
```

Somente o escopo pedagogicamente dependente fica impedido de homologação/publicação.

A política detalhada está em:

- `docs/estado-implementacao-classico.md`;
- `docs/conteudo.md`;
- `producao-midia/README.md`.

## P1 — Schemas e contratos executáveis

**Estado: HOMOLOGADO.**

Entregas concluídas:

```text
schemas/course.schema.json
schemas/unit.schema.json
schemas/lesson.schema.json
schemas/verification.schema.json
schemas/progress.schema.json
scripts/validate-contracts.mjs
schemas/fixtures/p1/
CI: Validate contract schemas
```

As fixtures usam como extremos reais:

- N0-U01-L01 + N0-U01-V01;
- N4-U09-L01 + N4-U09-V01.

Decisão de compatibilidade:

```text
JSON autoral histórico v1
→ permanece preservado
→ P2 normaliza
→ saída canônica valida schemas P1
```

P1 não migrou `content/course.json` para v2 e não publicou manifests reais.

Condição de saída atingida:

```text
contratos canônicos validáveis
+ fixtures reais N0/N4
+ CI detecta violação objetiva
+ conteúdo histórico não reescrito artificialmente
```

## P2 — ContentService e normalizador

**Estado: PRÓXIMO / MARCO ATIVO.**

Objetivo: transformar conteúdo autoral real nas estruturas canônicas validadas em P1.

Entregas:

- `ContentService`;
- adapters de lesson v1;
- adapters de verification v1;
- normalização de blocos;
- normalização de atividades;
- normalização de `completionEvidence`;
- erro explícito para regra não normalizável;
- testes contra fixtures P1.

Casos mínimos:

```text
N0-U01-L01
→ single choice + classify + TTS + completion determinístico

N0-U01-V01
→ threshold + controlled audio + sequence

N4-U09-L01
→ resposta aberta + RELIABLE_EVALUATOR + PENDING_ALLOWED

N4-U09-V01
→ produção complexa + clusters não compensáveis

saída de nível
→ provar kind LEVEL_VERIFICATION
```

Condição de saída:

```text
fontes reais v1
→ ContentService/adapters
→ runtime canônico
→ schemas P1
→ testes verdes
```

Não inventar normalização quando uma regra histórica em prosa for ambígua; retornar blocker explícito.

## P3 — Manifests e catálogo inicial

Objetivo: tornar conteúdo real descobrível sem listas hardcoded no frontend.

Entregas:

- `unit.json` para o slice inicial;
- registry de competências estáveis;
- referências de lição/verificação;
- publication status + blockers;
- `content/course.json` v2 populado progressivamente;
- integridade catálogo → manifesto → conteúdo.

Slice recomendado:

```text
N0-U01
+
N4-U09
```

Condição de saída: unidades do slice descobríveis e carregáveis somente por catálogo/manifests.

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

Mídia obrigatória ausente pode deixar atividade `IMPLEMENTADO_COM_PENDENCIA`; não paralisa renderers independentes.

## P5 — ProgressService, revisão e persistência

Objetivo: implementar o motor pedagógico do Clássico.

Entregas:

- estados de lição/evidência/competência;
- clusters `DEMONSTRATED_REQUIRED`, `PENDING_ALLOWED`, `ATTEMPT_REQUIRED`;
- revisão;
- schema v1 de progresso em uso;
- save/load local;
- GitHubService/Gist;
- migração;
- conflito entre dispositivos;
- falha de sync sem perda local.

Detalhes atuais de autenticação/permissões GitHub devem ser verificados em documentação oficial no momento da implementação.

A revisão é parte do Clássico; não depende de XP.

## P6 — Feedback por IA no Clássico

Objetivo: adicionar feedback opt-in a atividades elegíveis.

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

A falha/ausência de IA não quebra atividades determinísticas nem apaga resposta.

## P7 — Ampliação do catálogo Clássico N0→N4

Objetivo: levar o pipeline homologado do slice ao curso inteiro.

Ciclo por lote:

```text
normalizar
→ manifestar/publicar
→ validar
→ renderizar
→ testar
→ homologar o que for possível
→ registrar mídia/blockers locais
→ continuar
```

Não reescrever conteúdo em massa para satisfazer renderer.

Condição de saída:

- catálogo clássico cobre N0→N4 no escopo aprovado;
- tipos necessários possuem suporte ou blocker explícito;
- navegação alcança o percurso completo.

## P8 — Mídia e prontidão de publicação do Clássico

Objetivo: resolver **blockers de publicação realmente obrigatórios**, não produzir mídia decorativa.

Entregas:

- reconciliar `producao-midia/FILA-MIDIA.md` com estado do produto;
- ligar mídias já validadas;
- resolver itens `MIDIA_OBRIGATORIA_PARA_ATIVIDADE/PUBLICACAO` necessários ao escopo final;
- garantir equivalentes acessíveis;
- confirmar providers/rotas/Pages;
- reclassificar itens como `APTO/PUBLICAVEL` quando aplicável.

Mídia opcional pode continuar pendente sem impedir o gate quando não compromete ensino/avaliação/publicação essencial.

## P9 — Homologação end-to-end do Clássico

Objetivo: provar o produto-base antes de qualquer gamificação.

Cobrir pelo menos:

- primeira entrada;
- navegação N0→N4;
- lições simples e complexas;
- atividades determinísticas, estruturadas e abertas;
- feedback;
- revisão;
- `VALIDACAO_PENDENTE`;
- progresso/domínio;
- persistência/Gist;
- retomada e conflito entre dispositivos;
- IA desligada/ativa/falhando;
- mídia obrigatória;
- acessibilidade;
- desktop/tablet/mobile;
- recuperação após erro;
- falhas sem perda de trabalho.

### Gate: `CLÁSSICO HOMOLOGADO`

Só satisfeito quando:

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

Objetivo: adicionar segunda experiência sobre o motor clássico já homologado.

Entregas iniciais:

- seleção/troca de modo;
- XP;
- progressão visual;
- conquistas;
- missões;
- streak sem punição pedagógica;
- progresso/domínio/revisão compartilhados com Clássico;
- sem XP retroativo ao período estudado apenas no Clássico.

A economia nasce dos casos-âncora observados durante P3–P9 conforme `docs/calibracao-produto.md`.

## P11 — Homologação/calibração gamificada

Cobrir:

- troca Clássico ↔ Gamificado;
- preservação de progresso/domínio;
- coerência de XP;
- resistência a farm;
- recuperação/revisão sem distorção;
- utilidade/saturação de missões/conquistas;
- streak/fusos;
- acessibilidade/responsividade;
- usuários reais quando possível.

Condição de saída:

```text
baselines gamificados homologados
+ principais distorções corrigidas
+ nenhuma mecânica de jogo controlando domínio/gates
+ Clássico continua funcional sozinho
```

## Calibração durante o Clássico

P1–P9 podem registrar esforço, complexidade e recuperação como casos-âncora, mas não atribuem economia de XP ao produto.

O algoritmo fino de revisão é exceção: revisão pertence ao núcleo clássico e amadurece a partir de P5 com sinais pedagógicos explicáveis.

## Próximo passo oficial

```text
P2 — ContentService e normalizador
```

Próximo caso concreto:

```text
N0-U01-L01 + N4-U09-L01
→ adapters v1
→ runtime canônico
→ schemas P1
```
