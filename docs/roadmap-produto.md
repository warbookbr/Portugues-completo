# Roadmap de Produto

## Função

Registrar o estado e a ordem de implementação da fase de produto/publicação depois do fechamento curricular N0→N4.

A maturidade curricular continua documentada em `docs/roadmap-curricular.md`.

## Estado atual

```text
CURRÍCULO N0→N4
→ fechado curricularmente em M5

CONTRATOS DE PRODUTO
→ definidos

FRONTEND DE CONTEÚDO REAL
→ ainda não implementado
```

## Contratos fechados

### Arquitetura

`docs/arquitetura.md`

- GitHub Pages + HTML/CSS/JS;
- serviços separados;
- progresso em Gist por aluno;
- IA BYOK por aluno;
- modos Clássico/Gamificado sobre o mesmo currículo.

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
- gamificação sem XP retroativo ao período clássico.

### IA

`docs/avaliacao-ia.md`

- feedback opt-in;
- API key do aluno;
- provider adapter;
- request/response estruturado;
- IA não grava domínio;
- tarefas com avaliador confiável permanecem pending por padrão.

### Validação

`docs/validacoes.md`

- estrutura e sintaxe JSON já implementadas;
- schemas de contrato são o próximo guard rail.

## Marco P1 — Schemas e contratos executáveis

**Estado:** próximo.

Objetivo:

Transformar os contratos documentados em validações mecânicas sem alterar o conteúdo em massa.

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
- fixtures de conteúdo real N0 e N4;
- estratégia de compatibilidade para autoria v1;
- CI atualizado.

Condição de saída:

```text
contratos canônicos validáveis
+ conteúdo histórico não quebrado artificialmente
+ CI detecta violações objetivas
```

## Marco P2 — ContentService e normalizador

Objetivo:

Criar camada que transforma conteúdo real em runtime estável.

Entregas:

- `ContentService`;
- adapters de lição/verificação v1;
- normalização de blocos;
- normalização de atividades;
- normalização de `completionEvidence`;
- erro explícito para critério não normalizável.

Casos mínimos de teste:

- lição N0 determinística;
- verificação N0 com clusters/thresholds;
- lição N4 aberta/pending;
- verificação N4;
- saída de nível.

## Marco P3 — Manifests e catálogo

Objetivo:

Tornar unidades reais descobríveis sem lista manual no JavaScript.

Entregas:

- `unit.json` por lote publicável;
- registry de competências estáveis;
- referências de lição/verificação;
- estado de publicação/blockers;
- `content/course.json` schema v2 populado progressivamente;
- integridade catálogo → manifesto → conteúdo.

Estratégia:

Começar por um **slice vertical pequeno e representativo**, não publicar N0→N4 inteiro de uma vez.

Slice recomendado:

```text
uma unidade simples de N0
+ uma unidade complexa de N4
```

Isso testa extremos antes da migração ampla.

## Marco P4 — Renderer real

Objetivo:

Substituir placeholders por conteúdo real normalizado.

Entregas:

- tela de unidade;
- tela de lição;
- blocos de conteúdo;
- primitivas de atividade do primeiro slice;
- estados de feedback/evidência;
- acessibilidade e teclado;
- tratamento explícito de tipo não suportado.

Validação visual obrigatória em desktop/tablet/mobile.

## Marco P5 — ProgressService e persistência

Objetivo:

Implementar progresso pedagógico independente da gamificação.

Entregas:

- estados de lição/evidência/competência;
- clusters de conclusão;
- fila de revisão;
- schema v1 de progresso;
- save/load local da sessão;
- GitHubService/Gist;
- migração de schema;
- conflito entre dispositivos;
- falha de sync sem perda de estado local.

## Marco P6 — Modos Clássico e Gamificado

Objetivo:

Aplicar duas experiências sobre o mesmo motor pedagógico.

Clássico:

- sem XP;
- direto;
- progresso/revisão/domínio.

Gamificado:

- XP;
- missões/conquistas iniciais;
- progressão visual;
- streak sem punição pedagógica.

Troca preserva progresso e não gera XP retroativo.

## Marco P7 — Feedback por IA

Objetivo:

Adicionar feedback opt-in para atividades elegíveis.

Entregas:

- configuração de provider/model;
- armazenamento seguro local da key conforme arquitetura;
- `AiFeedbackService`;
- adapter inicial;
- structured output;
- fallback;
- minimização de contexto/custo;
- fixtures adversariais;
- pending preservado onde exigido.

A primeira versão permanece feedback formativo. `ASSISTED_VALIDATION` exige marco separado de calibração.

## Marco P8 — Ampliação do catálogo

Depois que o slice N0/N4 estiver funcionando:

```text
migrar/publicar lotes
→ validar
→ testar visualmente
→ continuar
```

Não fazer migração massiva antes de provar o pipeline.

## Marco P9 — Mídia obrigatória e publicação

- resolver fila realmente obrigatória de mídia;
- validar blockers de publicação;
- garantir equivalentes acessíveis;
- confirmar Pages e rotas reais.

## Marco P10 — Teste end-to-end e calibração

Cobrir:

- primeira entrada;
- escolha de modo;
- lição simples;
- atividade complexa;
- feedback/revisão;
- pending;
- sincronização;
- troca de dispositivo;
- IA desativada/ativada/falhando;
- navegação N0→N4;
- acessibilidade;
- testes com usuários reais.

## Decisões que não bloqueiam P1–P5

Podem ser calibradas depois sem reabrir os contratos:

- valores exatos de XP;
- catálogo inicial de conquistas;
- quantidade/frequência de missões;
- aparência final do seletor de modo;
- algoritmo fino da fila de revisão;
- provider/model inicial de IA;
- quais classes de IA poderão um dia participar de validação assistida.

## Próximo passo oficial

```text
P1 — schemas e contratos executáveis
```

Não iniciar o renderer antes de o runtime saber validar/normalizar conteúdo suficiente para um slice representativo.
