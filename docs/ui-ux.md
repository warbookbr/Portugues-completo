# UI/UX — linguagem e apresentação ao aluno

## Objetivo

Definir princípios transversais para a interface do **Português Completo**, especialmente o Modo Clássico.

Esta documentação governa o que é mostrado ao aluno. IDs, enums, códigos curriculares e demais estruturas internas continuam pertencendo à infraestrutura.

## Princípio central

> **A interface fala a linguagem do aluno; a infraestrutura fala a linguagem do sistema.**

A aplicação pode depender internamente de códigos precisos para roteamento, progresso, evidência, sincronização, testes e diagnóstico, mas esses códigos não devem aparecer para o aluno quando não forem pedagogicamente úteis.

```text
infraestrutura
→ precisão técnica
→ IDs estáveis
→ enums
→ códigos curriculares
→ estados de máquina

interface do aluno
→ linguagem humana
→ significado pedagógico
→ orientação clara
→ próximo passo compreensível
```

## Regra de tradução

Todo dado técnico exibível deve passar por uma camada de apresentação.

Antes de mostrar um valor interno, perguntar:

1. O aluno precisa dessa informação para estudar, decidir ou compreender seu progresso?
2. O termo já é compreensível sem conhecer a arquitetura do projeto?
3. Existe uma forma mais humana e igualmente precisa de comunicar o mesmo significado?

Se a resposta indicar que o valor é apenas técnico, ele permanece fora da interface pública.

## Exemplos

### Estrutura curricular

```text
INTERNO
N0-U01-L04

INTERFACE
Fundamentos
Unidade 1
Lição 4
```

Quando o nível não acrescentar contexto útil, simplificar ainda mais:

```text
Unidade 1
Fala, sons e escrita
```

Não exibir por padrão:

```text
N0 • Unidade 1
```

`N0` continua válido e necessário internamente, mas não é linguagem natural para um aluno novo.

### Estados internos

```text
VALIDACAO_PENDENTE
→ Aguardando avaliação

REVISAO_RECOMENDADA
→ Revisão recomendada

BLOCKED por mídia
→ Material necessário ainda não disponível

CONCLUIDA
→ Lição concluída
```

A tradução precisa preservar o significado real. Não simplificar a ponto de declarar domínio, aprovação ou disponibilidade quando o estado interno não autoriza isso.

## O que não deve vazar para a UI

Salvo quando houver finalidade explícita de diagnóstico/administração, não mostrar ao aluno:

- IDs como `N0-U01-C01`, `N4-U09-L01`, `CL-P5-*`;
- nomes de schema ou versões de runtime;
- enums como `VALIDACAO_PENDENTE`, `DEMONSTRADA_REQUIRED`, `BLOCKED`, `LOCAL_CHANGES`;
- nomes de campos JSON;
- códigos de implementação;
- mensagens de erro técnicas quando existe explicação acionável em linguagem humana;
- detalhes de infraestrutura que não ajudam a aprender ou decidir o próximo passo.

## O que a UI deve priorizar

A apresentação ao aluno deve responder com clareza:

```text
Onde estou?
O que estou estudando?
O que já concluí?
O que ainda precisa de atenção?
Qual é o próximo passo?
Por que algo está pendente?
O que posso fazer agora?
```

Informações que não ajudam a responder a uma dessas perguntas devem justificar sua presença.

## Níveis e nomes humanos

Os códigos `N0`–`N4` permanecem como identificadores curriculares internos.

Na interface, preferir nomes humanos quando o nível precisar aparecer. A nomenclatura visual definitiva deve seguir os nomes curriculares aprovados do produto:

```text
N0 → Fundamentos
N1 → Básico
N2 → Intermediário
N3 → Avançado
N4 → Domínio
```

Não usar automaticamente o código interno como rótulo público.

## Redundância de navegação e ações

A interface não deve repetir a mesma ação em áreas de destaque próximas quando a navegação principal já oferece essa função de forma clara.

Regra prática:

```text
mesmo destino
+ mesma função
+ controles simultaneamente visíveis
+ nenhuma vantagem contextual real
→ manter apenas a ocorrência mais adequada à hierarquia
```

Duplicação pode existir quando houver benefício contextual comprovável — por exemplo, uma ação de continuidade dentro de uma tarefa longa — mas não deve ser usada apenas para preencher espaço ou repetir o menu.

### Decisão específica da home

Na tela inicial do Modo Clássico:

```text
Plano de estudos
→ permanece na navegação superior

retomada
→ um único CTA principal
→ "Continuar de onde parou" quando já existe percurso
→ "Começar a estudar" no primeiro acesso
→ CTA fica no bloco Continue estudando / Comece por aqui

hero introdutório
→ não usar
→ a home começa diretamente pelo estado acionável do aluno
```

A home deve privilegiar a próxima ação de estudo. Mensagens genéricas de boas-vindas ou continuidade não devem ocupar uma faixa grande acima do conteúdo quando não acrescentarem decisão, estado ou orientação nova.

## Arquitetura visual aprovada da home clássica

A home é uma tela de **orientação e retomada**, não um painel administrativo, catálogo completo ou página institucional.

Estrutura aprovada:

```text
cabeçalho superior
→ marca + Modo Clássico
→ Início | Plano de estudos | Unidades | Revisões | Desempenho
→ Ajuda como utilitário discreto
→ Configurações como utilitário

primeira faixa útil
→ Continue estudando / Comece por aqui
→ nível em linguagem humana
→ unidade atual
→ lição/posição atual
→ progresso da unidade
→ único CTA principal de retomada/início

bloco Seu progresso
→ percentual do curso disponível
→ lições concluídas
→ revisões recomendadas

prévia de Unidades do curso
→ poucas unidades
→ progresso resumido
→ acesso a Ver todas as unidades

rodapé
→ Metodologia do curso
```

A home não usa hero introdutório acima desses blocos. O primeiro conteúdo deve ser útil para decidir ou continuar o estudo.

### Navegação principal

A navegação principal deve conter apenas destinos diretamente ligados ao estudo e acompanhamento:

```text
Início
Plano de estudos
Unidades
Revisões
Desempenho
```

Não manter uma sidebar duplicando os mesmos destinos quando o cabeçalho superior já os apresenta de forma clara.

### Metodologia e Ajuda

As duas funções continuam existindo, mas **não competem com a navegação de estudo**:

```text
Metodologia
→ conteúdo institucional/pedagógico
→ acesso pelo rodapé como "Metodologia do curso"

Ajuda
→ função utilitária
→ acesso discreto no cabeçalho
→ não ocupar item da navegação principal
```

Não duplicar Metodologia ou Ajuda em múltiplas áreas simultaneamente sem benefício contextual.

### Métricas e honestidade

A home deve mostrar apenas métricas derivadas de estado real do produto. Não inventar:

- tempo de estudo não registrado;
- sequência de dias inexistente;
- estimativas apresentadas como fatos;
- conquistas/XP no Modo Clássico;
- domínio inferido apenas por conclusão de tela.

Toda métrica da home precisa ser calculável a partir do catálogo e do `ProgressService` ou estar claramente identificada como estimativa.

## Fluxo guiado de lição e tarefa

Uma lição não deve despejar todos os blocos de conteúdo e atividade simultaneamente quando isso prejudicar foco e hierarquia.

Regra:

> **preservar todo o conteúdo e a evidência, mas revelar a experiência em etapas pedagógicas de tamanho moderado.**

Estrutura visual:

```text
Unidade
  ↓
Lição
  ↓
Etapa 1 de N — Observe / Comece / Entenda
[conteúdo relevante desta etapa]

[Voltar]                         [Avançar]
  ↓
Etapa seguinte — Pratique
[atividade + resposta + feedback]
```

### Segmentação

A unidade continua contendo várias lições; não criar uma nova rota ou uma nova "lição" para cada bloco de autoria.

Dentro da lição:

- mostrar uma etapa principal por vez;
- agrupar blocos relacionados em quantidade moderada;
- evitar tanto a página longa com tudo expandido quanto a microfragmentação de um clique por parágrafo;
- atividades podem formar uma etapa própria ou vir acompanhadas de até poucos blocos preparatórios;
- resumo/consolidação pode ocupar a etapa final.

A segmentação é **apresentacional**. Ela não altera IDs, runtime, contratos de conclusão, evidências ou `ProgressService`.

### Navegação da lição

Usar controles explícitos:

```text
← Voltar
Avançar →
```

O avanço entre etapas não cria gate pedagógico artificial. O aluno pode avançar e voltar para reler ou revisar; requisitos de conclusão continuam sendo determinados pelas evidências e políticas reais do curso.

A etapa visual atual pode ser lembrada apenas como conveniência de interface, sem virar estado de domínio.

### Retorno para a unidade

Dentro de lições e verificações, preferir um controle direto:

```text
← Voltar para a unidade
```

em vez de um breadcrumb longo como:

```text
Curso › Unidade › Lição
```

O destino do botão deve ser determinístico: a unidade à qual o documento pertence, e não apenas `history.back()`.

### Redução de ruído dentro da etapa

Quando a etapa já comunica sua função (`Observe`, `Entenda`, `Pratique`, `Consolide`), não repetir rótulos que não acrescentam decisão ou significado.

Exemplos de ruído a evitar:

```text
EXEMPLO + rótulo de etapa equivalente
Prática + Pratique
correção objetiva
nomes de modo de avaliação internos
```

Manter um badge apenas quando ele comunica algo realmente acionável, por exemplo `Necessária para concluir`.

### Movimento e acessibilidade

Transições entre etapas podem usar deslocamento/fade curto para comunicar continuidade, mas:

- movimento é decorativo, nunca necessário para entender a troca;
- respeitar `prefers-reduced-motion`;
- mover foco para o título da nova etapa após navegação;
- manter `Voltar` e `Avançar` acessíveis por teclado;
- não apagar respostas já preenchidas ao navegar entre etapas.

## Separação obrigatória no código

Renderer e componentes visuais não devem depender de imprimir diretamente valores crus do runtime.

Preferir:

```text
estado interno
→ função/mapeamento de apresentação
→ texto acessível ao aluno
```

em vez de:

```text
estado interno
→ interpolação direta no HTML
```

Essa separação permite alterar vocabulário e UX sem quebrar IDs, persistência, progresso ou contratos curriculares.

## Erros e estados excepcionais

A UI deve comunicar:

```text
o que aconteceu
+ impacto real
+ o que o aluno pode fazer agora
```

Evitar despejar exceção, nome de serviço, código HTTP ou enum quando isso não ajuda a resolver o problema.

Detalhes técnicos podem continuar disponíveis em console, logs de desenvolvimento e testes quando apropriado.

## Critério de revisão de UI

Toda mudança visual relevante deve verificar:

```text
[ ] algum ID/código técnico apareceu para o aluno?
[ ] algum enum interno foi exibido sem tradução?
[ ] o texto descreve o significado pedagógico real?
[ ] a interface deixa claro o próximo passo?
[ ] existe ação repetida sem ganho contextual real?
[ ] informação técnica ou controle redundante aumentou a carga cognitiva?
[ ] a home começa por informação acionável em vez de introdução genérica?
[ ] a navegação principal contém somente destinos de estudo/acompanhamento?
[ ] Metodologia/Ajuda estão acessíveis sem competir com o fluxo principal?
[ ] as métricas mostradas vêm de dados reais?
[ ] uma lição longa está segmentada sem microfragmentação?
[ ] Voltar/Avançar preservam respostas e permitem revisão livre?
[ ] o retorno para unidade é direto e previsível?
[ ] movimento respeita redução de animações?
[ ] a tradução preserva acessibilidade e precisão?
```

Um componente não está visualmente homologado se sua aparência estiver correta, mas a linguagem ainda exigir que o aluno conheça a arquitetura do sistema ou se controles redundantes prejudicarem a hierarquia da tela.

## Relação com o Modo Clássico

O Modo Clássico deve ser direto, calmo e orientado ao estudo:

```text
menos linguagem de sistema
+ menos ruído
+ menos controles redundantes
+ hierarquia clara
+ ações compreensíveis
+ estado pedagógico honesto
```

A aplicação não deve parecer um painel administrativo do currículo.

## Regra final

Quando houver conflito entre expor a estrutura interna literalmente e comunicar o mesmo significado de maneira clara ao aluno:

> **preservar a estrutura internamente e traduzir a experiência externamente.**

Quando houver conflito entre repetir uma função já claramente acessível e preservar uma hierarquia simples:

> **manter uma única ação clara, salvo quando a repetição tiver benefício contextual real.**

Quando houver conflito entre mostrar todo o conteúdo simultaneamente e manter foco sem perder acesso:

> **segmentar a apresentação, preservar o conteúdo e manter navegação livre entre etapas.**
