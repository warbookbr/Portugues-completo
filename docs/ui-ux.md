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

Na interface, preferir nomes humanos quando o nível precisar aparecer. A nomenclatura visual definitiva deve seguir os nomes curriculares aprovados do produto, por exemplo conceitos como:

```text
Fundamentos
Básico
Intermediário
Avançado
Domínio
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

botão "Ver plano de estudos" no hero
→ não usar

CTA principal do hero
→ "Continuar de onde parou"
```

A home deve privilegiar a próxima ação de estudo. Destinos estruturais permanentes, como `Plano de estudos`, ficam na navegação quando já estão claramente acessíveis ali.

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
[ ] a tradução preserva acessibilidade e precisão?
```

Um componente não está visualmente homologado se sua aparência estiver correta, mas a linguagem ainda exigir que o aluno conheça a arquitetura do sistema ou se controles redundantes prejudicarem a hierarquia da tela.

## Relação com o Modo Clássico

O Modo Clássico deve ser direto, calmo e orientado ao estudo. Portanto, este princípio é especialmente importante nele:

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
