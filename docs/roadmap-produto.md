# Roadmap de Produto

## Função

Registrar a ordem e as condições de saída da fase de produto/publicação depois do fechamento curricular N0→N4.

A maturidade curricular continua em `docs/roadmap-curricular.md`.

O estado concreto de execução do Modo Clássico — marco/item ativo, pendências, blockers, mídia e próximo passo exato — fica em `docs/estado-implementacao-classico.md`.

```text
roadmap-produto
→ para onde vamos e quando um marco termina

estado-implementacao-classico
→ onde estamos exatamente agora
```

## Estado atual

```text
CURRÍCULO N0→N4
→ fechado curricularmente em M5

CONTRATOS DE PRODUTO
→ definidos

MODO CLÁSSICO REAL
→ ainda não implementado de ponta a ponta

MODO GAMIFICADO
→ deliberadamente posterior à homologação do Clássico
```

O próximo marco técnico é P1. O cursor operacional detalhado deve ser lido em `docs/estado-implementacao-classico.md`.

## Decisão de sequência: Clássico primeiro

O **Modo Clássico é a linha principal de entrega do produto-base**.

Antes de implementar XP, missões, conquistas, streak, progressão de jogo ou seletor ativo entre modos, o projeto deve provar o núcleo pedagógico completo no Clássico.

Fluxo oficial:

```text
conteúdo N0→N4
→ runtime / renderer
→ atividades + feedback
→ progresso + domínio + revisão
→ persistência / Gist
→ feedback com IA quando aplicável
→ catálogo N0→N4 + mídia/publicação
→ MODO CLÁSSICO COMPLETO
→ homologação end-to-end do Clássico
────────────────────────────────
GATE: CLÁSSICO HOMOLOGADO
────────────────────────────────
→ MODO GAMIFICADO
→ XP + conquistas + missões + streak + jornada
→ homologação e calibração gamificada
```

### Regra do gate

Enquanto o gate **CLÁSSICO HOMOLOGADO** não estiver satisfeito:

- não implementar economia de XP;
- não implementar missões ou conquistas como produto;
- não implementar streak/progressão de jogo;
- não fazer o Clássico depender de infraestrutura gamificada;
- não alterar conteúdo pedagógico para preparar recompensas;
- pode-se registrar casos-âncora de esforço, recuperação e percurso para uso posterior na calibração.

A arquitetura dos dois modos permanece válida. A decisão altera a **ordem de implementação**, não a existência futura do modo Gamificado.

## Política de execução com mídia/material de apoio pendente

A produção humana de imagens, vídeos e áudios **não é pré-requisito global para desenvolver o Clássico**.

Regra:

```text
mídia pendente
→ registrar a dependência
→ implementar tudo que for independente
→ bloquear somente homologação/publicação do escopo que realmente depende dela
→ continuar o restante do roadmap
```

Durante P1→P7, mídia obrigatória ausente pode permanecer como pendência rastreada quando o marco consegue cumprir sua condição de saída sem fingir homologação da parte dependente.

P8 concentra a resolução dos blockers de mídia/publicação necessários ao produto final; **P8 não é o primeiro momento em que mídia é identificada ou integrada**.

Quando a mídia for o próprio estímulo pedagógico, a estrutura técnica pode ser implementada antes, mas a atividade dependente não pode ser homologada pedagogicamente usando um placeholder inadequado.

A classificação e o impacto operacional ficam em `docs/estado-implementacao-classico.md`; a produção dos arquivos fica em `producao-midia/README.md` + `FILA-MIDIA.md`.

## Regra de rastreamento do desenvolvimento

Toda mudança material no Clássico deve atualizar o registro operacional na mesma PR.

O registro separa:

```text
estado técnico
estado de homologação
estado de mídia/material de apoio
estado de publicação
```

Portanto:

```text
IMPLEMENTADO
não significa automaticamente
HOMOLOGADO
nem PUBLICAVEL
```

Ao fim de cada subpasso relevante, o repositório deve deixar reconstruíveis:

- o último item efetivamente concluído;
- o item em andamento, se houver;
- pendências não bloqueantes;
- blockers reais;
- `mediaIds` relacionados;
- próximo passo exato.

## Contratos fechados

### Arquitetura

`docs/arquitetura.md`

- GitHub Pages + HTML/CSS/JS;
- serviços separados;
- progresso em Gist por aluno;
- IA BYOK por aluno;
- Clássico e Gamificado sobre o mesmo currículo e motor pedagógico.

### Conteúdo/runtime

`docs/contrato-conteudo.md`

- autoria existente preservada;
- `course.json` como catálogo;
- `unit.json` como manifesto de unidade;
- normalizador/adapter entre conteúdo histórico e runtime;
- IDs estáveis de competência;
- publicação incremental.

### Atividades

`docs/exercicios.md`

- papel pedagógico separado da interação;
- primitivas reutilizáveis;
- políticas de avaliação;
- estímulos;
- evidência/clusters.

### Progresso

`docs/progresso.md` + `docs/persistencia-progresso.md`

- progresso ≠ domínio ≠ XP;
- estados de lição/evidência/competência;
- gates suaves;
- revisão;
- schema v1 do Gist;
- conclusão mecânica por clusters;
- Clássico funciona integralmente sem gamificação.

### IA

`docs/avaliacao-ia.md`

- feedback opt-in;
- API key do aluno;
- provider adapter;
- request/response estruturado;
- IA não grava domínio;
- tarefas com avaliador confiável permanecem pending por padrão.

### Calibração progressiva

`docs/calibracao-produto.md`

- primeiro homologar pedagogia/fluxo;
- durante o Clássico, registrar casos-âncora reais sem implantar economia de XP;
- revisão é calibrada como parte do núcleo pedagógico clássico;
- XP, conquistas, missões e streak só são concretizados depois do gate Clássico;
- gamificação nunca força alteração curricular para corrigir sua economia.

### Estado operacional

`docs/estado-implementacao-classico.md`

- cursor de execução;
- IDs de implementação;
- estados técnico/homologação/mídia/publicação;
- blockers com escopo;
- evidências de homologação;
- rastreamento de trabalho parcial;
- vínculo entre pendência de mídia e aquilo que ela realmente bloqueia.

### Validação

`docs/validacoes.md`

- estrutura e sintaxe JSON já implementadas;
- schemas de contrato são o próximo guard rail.

## Marco P1 — Schemas e contratos executáveis

**Estado macro:** próximo. O estado operacional deve permanecer sincronizado em `docs/estado-implementacao-classico.md`.

Objetivo: transformar os contratos documentados em validações mecânicas sem alterar o conteúdo em massa.

Entregas:

```text
schemas/course.schema.json
schemas/unit.schema.json
schemas/lesson.schema.json
schemas/verification.schema.json
schemas/progress.schema.json
```

Mais:

- validator de schemas;
- fixtures reais N0 e N4;
- estratégia de compatibilidade para autoria v1;
- CI atualizado.

Condição de saída:

```text
contratos canônicos validáveis
+ conteúdo histórico não quebrado artificialmente
+ CI detecta violações objetivas
```

Nenhuma economia gamificada é implementada neste marco.

## Marco P2 — ContentService e normalizador

Objetivo: criar a camada que transforma conteúdo real em runtime estável.

Entregas:

- `ContentService`;
- adapters de lição/verificação v1;
- normalização de blocos e atividades;
- normalização de `completionEvidence`;
- erro explícito para critério não normalizável.

Casos mínimos:

- lição N0 determinística;
- verificação N0 com clusters/thresholds;
- lição N4 aberta/pending;
- verificação N4;
- saída de nível.

O runtime pode emitir eventos pedagógicos reutilizáveis no futuro, mas não conhece XP.

Dependência de mídia presente no conteúdo deve ser normalizada/rastreável sem exigir que o arquivo físico já exista para todos os casos.

## Marco P3 — Manifests e catálogo inicial

Objetivo: tornar unidades reais descobríveis sem lista manual no JavaScript.

Entregas:

- `unit.json` por lote publicável;
- registry de competências estáveis;
- referências de lição/verificação;
- estado de publicação/blockers;
- `content/course.json` schema v2 populado progressivamente;
- integridade catálogo → manifesto → conteúdo.

Começar por um slice representativo:

```text
uma unidade simples de N0
+ uma unidade complexa de N4
```

Durante o slice:

- registrar hipóteses de esforço/comparabilidade como futuros casos-âncora;
- registrar mídia pendente e seu impacto;
- não retirar do slice uma atividade só porque sua mídia final ainda será produzida, quando a infraestrutura independente puder ser implementada/testada;
- não atribuir economia de XP ao produto Clássico.

## Marco P4 — Renderer real do Clássico

Objetivo: substituir placeholders genéricos por conteúdo real normalizado em uma experiência **exclusivamente clássica**.

Entregas:

- tela de unidade;
- tela de lição;
- blocos de conteúdo;
- primitivas de atividade do primeiro slice;
- estados de feedback/evidência;
- renderers/estados de mídia necessários ao slice;
- acessibilidade e teclado;
- tratamento explícito de tipo não suportado;
- navegação sem qualquer dependência de XP/missões/conquistas.

Validação visual obrigatória em desktop/tablet/mobile.

Se uma mídia obrigatória ainda não existir, implementar os estados/contratos possíveis e registrar `IMPLEMENTADO_COM_PENDENCIA` quando adequado; não usar placeholder como prova pedagógica do estímulo ausente.

A partir de atividades funcionando de ponta a ponta, registrar casos-âncora de esforço e recuperação para futura gamificação, sem expor pontuação ao aluno.

## Marco P5 — ProgressService, revisão e persistência

Objetivo: implementar o motor pedagógico necessário ao Clássico.

Entregas:

- estados de lição/evidência/competência;
- clusters de conclusão;
- fila de revisão;
- schema v1 de progresso;
- save/load local;
- GitHubService/Gist;
- migração de schema;
- conflito entre dispositivos;
- falha de sync sem perda de estado local.

A revisão é parte do produto-base e deve ser homologada aqui com prioridades explicáveis antes de fórmulas finas.

Uma atividade com mídia obrigatória ainda pendente não deve produzir domínio fictício só porque o restante do ProgressService está funcional.

## Marco P6 — Feedback por IA no Clássico

Objetivo: adicionar feedback opt-in para atividades elegíveis **antes** de considerar o Clássico completo.

Entregas:

- configuração de provider/model;
- API key BYOK conforme arquitetura;
- `AiFeedbackService`;
- adapter inicial;
- structured output;
- fallback;
- minimização de contexto/custo;
- fixtures adversariais;
- `VALIDACAO_PENDENTE` preservada onde exigido.

A primeira versão permanece formativa. `ASSISTED_VALIDATION` exige calibração específica futura.

A ausência/falha de IA não pode quebrar atividades determinísticas nem apagar resposta do aluno.

## Marco P7 — Ampliação do catálogo Clássico N0→N4

Objetivo: levar o pipeline comprovado do slice para o curso inteiro.

Fluxo:

```text
migrar/publicar lote
→ validar schema/integridade
→ renderizar
→ testar tudo que for testável no estado atual
→ homologar o que tiver condições reais de homologação
→ registrar pendências de mídia/blockers por item
→ registrar casos-âncora relevantes
→ atualizar estado operacional
→ continuar
```

Não reescrever conteúdo em massa para atender ao renderer; usar adapters/manifests.

Uma dependência local de apoio não deve impedir que outras lições/unidades sejam integradas.

Condição de saída:

- catálogo cobrindo N0→N4 conforme escopo aprovado;
- tipos necessários de atividade suportados ou blockers explicitamente registrados;
- navegação do Clássico alcança o percurso completo;
- pendências conhecidas estão rastreadas por escopo em vez de escondidas.

P7 pode terminar com blockers de mídia claramente registrados para resolução em P8, desde que eles não invalidem a condição de saída acima.

## Marco P8 — Mídia obrigatória e prontidão de publicação do Clássico

Objetivo: remover blockers externos/finais que impedem considerar o Clássico publicável.

Entregas:

- revisar a lista de `IMPLEMENTADO_COM_PENDENCIA` e blockers de mídia/publicação;
- resolver fila realmente obrigatória de mídia dentro do escopo final;
- validar `requiredForPublication` e dependências;
- ligar versões validadas aos `mediaIds`;
- repetir homologações pedagógicas que dependiam do estímulo final;
- garantir equivalentes acessíveis;
- confirmar Pages e rotas reais;
- confirmar TTS/áudio controlado conforme contrato;
- reavaliar experiência de casos cuja mídia final altere materialmente o esforço/fluxo.

Mídia opcional ainda não produzida não deve impedir prontidão de publicação quando a experiência essencial estiver completa.

## Marco P9 — Homologação end-to-end do Modo Clássico

Objetivo: provar que o produto-base funciona de ponta a ponta antes de iniciar gamificação.

Cobrir pelo menos:

- primeira entrada no Clássico;
- navegação N0→N4;
- lição simples e complexa;
- atividades determinísticas, estruturadas e abertas;
- feedback;
- revisão;
- `VALIDACAO_PENDENTE`;
- progresso/domínio;
- persistência e Gist;
- troca de dispositivo/conflito;
- IA desativada, ativada e falhando;
- mídia obrigatória;
- acessibilidade;
- desktop/tablet/mobile;
- recuperação após erro;
- retomada de sessão;
- falhas sem perda de trabalho;
- inexistência de item obrigatório silenciosamente marcado como concluído apesar de blocker aberto.

### Gate de saída: CLÁSSICO HOMOLOGADO

Só considerar o gate satisfeito quando:

```text
núcleo pedagógico estável
+ percurso N0→N4 utilizável no Clássico
+ feedback/revisão/progresso coerentes
+ persistência confiável dentro do contrato
+ blockers obrigatórios de publicação tratados
+ itens obrigatórios sem falsa homologação por ausência de mídia
+ testes end-to-end aprovados
+ nenhuma dependência de gamificação para estudar
```

**P10 não pode começar antes desse gate.**

O registro operacional deve marcar o gate explicitamente como satisfeito e manter eventuais pendências opcionais separadas.

## Marco P10 — Modo Gamificado

Objetivo: adicionar uma segunda experiência sobre o motor pedagógico clássico já homologado.

Entregas iniciais:

- seleção/troca de modo;
- XP;
- progressão visual;
- conquistas iniciais;
- missões iniciais;
- streak sem punição pedagógica;
- preservação do progresso Clássico;
- ausência de XP retroativo ao período estudado no Clássico;
- gamificação consumindo eventos pedagógicos sem controlar domínio.

### Calibração

A economia deve nascer dos casos-âncora observados e homologados durante P3–P9.

Fluxo:

```text
casos clássicos homologados
→ comparar esforço/complexidade/autonomia
→ propor valores provisórios
→ testar economia gamificada
→ revisar outliers/farm/saturação
→ homologar baselines
```

A forma visual do seletor Clássico/Gamificado também é decidida aqui, com validação real de interface.

## Marco P11 — Homologação e calibração global do Gamificado

Objetivo: provar que a camada de jogo melhora a experiência sem contaminar o núcleo já aprovado.

Cobrir:

- troca Clássico ↔ Gamificado;
- preservação de progresso/domínio/revisão;
- coerência da escala de XP;
- resistência a farm;
- recuperação/revisão recompensadas sem distorção;
- utilidade e saturação de missões;
- relevância das conquistas;
- streak e fusos/horários;
- clareza da progressão visual;
- acessibilidade;
- desktop/tablet/mobile;
- usuários reais quando possível.

Condição de saída:

```text
baselines gamificados homologados
+ principais distorções corrigidas
+ nenhuma mecânica de jogo controlando domínio/gates curriculares
+ Clássico continua plenamente funcional sem a camada de jogo
```

Calibração baseada em evidência pode continuar depois de P11.

## Decisões deliberadamente calibráveis

Durante P1–P9, coletar evidência e casos-âncora, mas não congelar prematuramente:

- valores exatos de XP;
- catálogo de conquistas;
- quantidade/frequência de missões;
- streak/progressão visual;
- aparência final do seletor de modo.

O algoritmo fino da fila de revisão é diferente: pertence ao núcleo Clássico e pode amadurecer a partir de P5, sempre por sinais pedagógicos explicáveis.

Também permanecem decisões separadas de integração:

- provider/model inicial de IA;
- classes que poderão futuramente participar de validação assistida.

## Próximo passo oficial

```text
P1 — schemas e contratos executáveis
```

Antes de implementar, ler o cursor de `docs/estado-implementacao-classico.md` e criar/atualizar os IDs dos itens reais trabalhados.

Prioridade estratégica:

```text
CONCLUIR E HOMOLOGAR O CLÁSSICO
→ só então construir o GAMIFICADO
```
