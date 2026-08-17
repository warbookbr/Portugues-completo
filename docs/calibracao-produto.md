# Calibração progressiva de gamificação, revisão e experiência

## Objetivo

Este documento define **como** decisões ainda calibráveis do Português Completo devem ser fechadas durante homologação e testes, em vez de congelar números ou fórmulas antes de existir experiência real suficiente.

Ele se aplica principalmente a:

- valores de XP;
- bônus de recuperação e outros eventos gamificados;
- conquistas;
- missões;
- sequência de estudo e marcos visuais;
- prioridade fina da fila de revisão;
- decisões visuais do seletor Clássico/Gamificado.

A regra central é:

```text
primeiro homologar a aprendizagem
→ depois calibrar a camada de experiência
```

E o guard rail principal é:

> **A gamificação é calibrada sobre conteúdo homologado; o conteúdo nunca é redesenhado para caber numa economia de XP.**

Este documento complementa `docs/progresso.md`, `docs/exercicios.md`, `docs/persistencia-progresso.md` e `docs/roadmap-produto.md`.

## Por que não fixar tudo antecipadamente

Antes de executar atividades reais no renderer, não existe base suficiente para saber com segurança:

- quanto esforço uma atividade exige na prática;
- se duas atividades aparentemente semelhantes realmente têm carga equivalente;
- quanto uma unidade fica longa depois de renderizada;
- quais tipos de recuperação aparecem com frequência;
- quais missões surgem naturalmente do percurso;
- quais sinais de revisão são realmente úteis;
- qual controle visual de modo funciona melhor no contexto real da interface.

Fixar números nessa fase produziria precisão aparente, não calibração.

Portanto, o projeto define agora:

```text
princípios
+ fatores de comparação
+ procedimento de homologação
+ registro de decisões
```

E define valores concretos gradualmente quando houver casos reais para comparar.

## O que significa homologar

Homologar não é apenas confirmar que o JSON carrega ou que um botão funciona.

Uma atividade, lição, verificação ou unidade está pronta para participar da calibração quando, no recorte testado:

1. o conteúdo pedagógico está correto para o objetivo declarado;
2. a interação representa adequadamente a tarefa;
3. o feedback funciona como esperado;
4. a evidência produzida corresponde ao contrato;
5. estados de progresso/pending/revisão são coerentes;
6. acessibilidade necessária está preservada;
7. não há erro técnico relevante mascarando esforço ou fluxo.

A calibração gamificada vem **depois** dessas verificações.

## Unidade de calibração

A calibração pode ocorrer em diferentes escalas:

```text
atividade
→ evento local de prática/recuperação

lição
→ percurso completo e seu esforço agregado

verificação
→ integração de evidências e exigência real

unidade
→ marco de percurso e equilíbrio entre várias lições

jornada
→ coerência global entre níveis e etapas
```

Não atribuir peso apenas olhando o nome do nível ou a quantidade de telas.

## Protocolo obrigatório durante homologação

Sempre que uma atividade, verificação ou unidade relevante for homologada e puder afetar gamificação/revisão, executar esta sequência:

```text
1. validar comportamento pedagógico
2. identificar esforço e complexidade reais
3. identificar o tipo de evento gamificado/revisão
4. comparar com casos já homologados
5. propor peso/XP ou prioridade coerente
6. justificar a decisão
7. verificar distorções no conjunto
8. registrar a decisão duradoura
9. recalibrar referências anteriores se novos casos revelarem desequilíbrio
```

A ausência de uma mudança também pode ser uma decisão válida.

Exemplo:

```text
atividade homologada
→ esforço curto e determinístico
→ equivalente a outras práticas breves
→ não merece bônus especial
→ mantém peso da faixa já usada
```

## Fatores para calibrar XP

XP representa **participação e realização na experiência gamificada**, nunca domínio de português.

Ao propor XP, considerar em conjunto:

### Esforço efetivo

Quanto trabalho real o aluno precisa realizar para concluir a ação de modo legítimo.

Não usar apenas número de cliques, telas ou caracteres.

### Complexidade da ação

Distinguir, por exemplo:

```text
seleção simples
≠ prática estruturada em várias etapas
≠ produção complexa com planejamento/revisão
```

Complexidade não significa que níveis avançados devam gerar inflação automática de XP.

### Autonomia exigida

Uma produção que exige organizar, revisar ou tomar decisões próprias pode justificar peso diferente de uma checagem guiada, desde que isso seja observado no uso real.

### Integração

Verificações/unidades que integram várias responsabilidades podem justificar um marco gamificado próprio, sem transformar o número de competências em fórmula automática.

### Recuperação

Quando o aluno encontra dificuldade, revisa e depois consegue executar a tarefa, o sistema pode reconhecer positivamente a recuperação.

Isso é diferente de premiar erro por si só.

### Tempo

Tempo esperado pode ser um sinal auxiliar de esforço, mas **nunca é critério pedagógico de qualidade ou domínio**.

Não criar XP proporcional a minutos gastos; isso incentivaria comportamento artificial e prejudicaria alunos com ritmos diferentes.

### Repetição

Repetição só deve gerar recompensa quando ainda existe valor real de prática/revisão.

Não permitir farm de XP por repetição mecânica de uma ação trivial já dominada.

## O que não deve gerar XP por si só

- abrir uma tela;
- clicar em continuar;
- ouvir TTS sem atividade associada;
- repetir indefinidamente uma ação já concluída apenas para acumular pontos;
- errar deliberadamente;
- permanecer com a página aberta por muito tempo;
- ativar/desativar o modo Gamificado;
- mudar configurações;
- fornecer API key;
- quantidade de palavras escrita sem relação com a tarefa.

## Construção gradual da escala de XP

A escala não nasce de uma tabela inventada no início.

Ela deve emergir de **casos-âncora homologados**.

Fluxo:

```text
primeiros casos reais
→ atribuir valores provisórios justificados
→ comparar atividades equivalentes
→ observar proporção entre atividade/lição/verificação/unidade
→ formar referências estáveis
→ revisar outliers
→ somente então tratar valores como baseline do produto
```

Uma nova atividade não deve receber XP isoladamente. A pergunta obrigatória é:

> Qual caso já homologado é o comparador mais próximo e por que este deve valer igual, menos ou mais?

Se não houver comparador adequado, o valor permanece explicitamente **provisório** até existirem âncoras suficientes.

## Registro de calibração de XP

Cada decisão relevante deve poder ser reconstruída.

Formato recomendado:

```text
ID / evento:
Escopo: atividade | lição | verificação | unidade | jornada
Estado: provisório | homologado | recalibrado
Esforço observado:
Complexidade/autonomia:
Comparadores usados:
Valor de XP proposto/adotado:
Bônus aplicável:
Justificativa:
Risco de farm/distorção:
Data/marco de homologação:
```

O registro pode ficar neste documento enquanto o volume for pequeno. Se crescer muito, pode migrar para um arquivo de dados ou documento específico sem alterar o protocolo.

## Recalibração de XP

Recalibrar não é falha. É parte esperada da homologação incremental.

Revisar a escala quando:

- atividades equivalentes acabarem com recompensas claramente desproporcionais;
- uma unidade gerar muito mais XP apenas por estar fragmentada em mais blocos;
- determinado tipo de atividade permitir farm;
- bônus de recuperação superar de forma distorcida a realização principal;
- a progressão visual avançar rápido ou devagar demais em relação ao percurso real;
- novos casos extremos N0/N4 mostrarem que a escala não generaliza.

Quando recalibrar:

1. preservar progresso pedagógico;
2. não transformar XP em domínio;
3. evitar retirar recompensas já obtidas de alunos sem necessidade forte;
4. preferir ajustar regras futuras/baselines antes de reescrever histórico individual;
5. documentar a razão.

## Conquistas

Não criar um grande catálogo de conquistas antes de observar padrões reais do produto.

Uma conquista deve nascer quando existir um marco que seja:

- compreensível;
- repetível ou reconhecível pelo sistema;
- positivo;
- não manipulável por clique trivial;
- coerente com a jornada;
- independente de falsa alegação de domínio.

Boas fontes potenciais:

- concluir uma unidade;
- concluir um conjunto significativo de revisões;
- recuperar uma competência anteriormente marcada;
- experimentar diferentes tipos relevantes de prática;
- atingir marco de percurso.

Ao homologar uma unidade/fluxo, perguntar:

> Surgiu aqui um comportamento ou marco que mereça reconhecimento recorrente?

Se não, não criar conquista apenas para aumentar quantidade.

## Missões

Missões devem surgir de ações que o produto realmente consegue recomendar com valor pedagógico.

Podem combinar, quando fizer sentido:

```text
continuar uma lição
+ fazer uma revisão pendente
+ recuperar uma dificuldade anterior
```

A homologação deve verificar se a missão:

- é clara;
- é executável;
- não força conteúdo irrelevante;
- não cria bloqueio;
- não incentiva comportamento mecânico;
- respeita o modo Gamificado como opcional.

A quantidade/frequência de missões só deve ser definida depois que houver fluxo real suficiente para avaliar saturação e utilidade.

## Sequência de estudo

A sequência pode reconhecer frequência, mas não deve ser calibrada como mecanismo punitivo.

Durante testes, observar:

- se o aluno entende o que mantém a sequência;
- se fusos/horários geram comportamento inesperado;
- se uma perda de sequência causa sensação desproporcional de punição;
- se existe incentivo a abrir o app sem estudar de verdade.

Sequência nunca altera domínio, gates ou progresso curricular.

## Calibração da revisão

O algoritmo fino da fila de revisão deve nascer dos sinais reais de aprendizagem registrados pelo produto.

### Fatores permitidos

- erro/dificuldade recente;
- evidência `REVISAO_RECOMENDADA`;
- competência pré-requisito próxima de reaparecer;
- repetição de dificuldade em contextos diferentes;
- uso recorrente de ajuda quando relevante;
- tempo desde evidência anterior como sinal auxiliar;
- recuperação bem-sucedida;
- solicitação voluntária do aluno.

### Primeira implementação

Antes de existir dado suficiente, preferir prioridades explicáveis em vez de fórmula matemática sofisticada.

Exemplo conceitual:

```text
ALTA
→ dificuldade recente em pré-requisito relevante

NORMAL
→ revisão recomendada sem dependência imediata

VOLUNTARIA
→ prática escolhida pelo aluno
```

Os nomes exatos podem evoluir na implementação.

Não criar uma pontuação de “probabilidade de esquecimento” sem base/teste suficiente.

### Homologação da revisão

Ao testar uma atividade ou unidade, verificar:

1. quais erros realmente deveriam gerar revisão;
2. quais erros são locais e não merecem fila futura;
3. quando nova evidência deve remover/rebaixar a prioridade;
4. se o item recomendado ajuda no conteúdo que vem depois;
5. se a fila está repetitiva ou excessiva;
6. se o aluno consegue entender por que aquilo foi recomendado.

## Aparência do seletor Clássico/Gamificado

O comportamento já está definido arquitetonicamente; a forma visual deve ser calibrada quando a interface real existir.

A decisão entre cards, botão, seletor ou outro componente deve considerar:

- clareza da escolha inicial;
- compreensão de que o conteúdo é o mesmo;
- facilidade de troca posterior;
- acessibilidade por teclado/leitor de tela;
- responsividade;
- risco de parecer que um modo é “melhor” pedagogicamente;
- consistência com o restante da interface.

A escolha visual deve passar pela validação de frontend em desktop/tablet/mobile.

Não criar uma decisão visual definitiva só em documentação abstrata.

## Relação com os marcos do roadmap

A calibração é **contínua**, não um trabalho concentrado apenas no P10.

### P1–P2

- não fixar economia numérica;
- garantir que eventos necessários possam ser representados nos contratos/runtime.

### P3–P4

- começar a observar casos reais do slice N0/N4;
- registrar primeiras hipóteses/âncoras de esforço;
- não tratar valores como finais antes de o fluxo funcionar.

### P5

- homologar sinais e prioridades iniciais de revisão;
- garantir que progresso pedagógico permaneça independente de gamificação.

### P6

- iniciar calibração concreta de XP, conquistas, missões, sequência e seletor de modo;
- usar casos homologados de P3–P5 como âncoras.

### P7–P9

- verificar se feedback com IA, ampliação do catálogo e mídia alteram esforço/fluxo de casos antes usados como referência;
- recalibrar quando necessário.

### P10

- revisar a economia e a revisão no conjunto;
- testar com usuários reais;
- fechar baselines iniciais de produção;
- manter possibilidade de calibração posterior baseada em evidência.

## Checklist de homologação

Ao homologar uma atividade, lição, verificação ou unidade, perguntar:

```text
PEDAGOGIA
[ ] o comportamento pedagógico está correto?
[ ] feedback/evidência/progresso estão coerentes?

GAMIFICAÇÃO
[ ] existe evento que merece XP?
[ ] qual caso homologado é o comparador?
[ ] o peso evita premiar cliques/tempo/farm?
[ ] existe recuperação que merece reconhecimento?
[ ] surgiu marco útil para conquista?
[ ] surgiu ação útil e opcional para missão?

REVISÃO
[ ] alguma dificuldade deve entrar na fila?
[ ] qual prioridade é justificável?
[ ] há condição clara para retirar/rebaixar essa revisão?

EXPERIÊNCIA
[ ] alguma decisão visual/comportamental precisa ser ajustada?
[ ] a mudança funciona nos dois modos sem alterar o núcleo pedagógico?

REGISTRO
[ ] a decisão duradoura foi registrada?
[ ] algum baseline anterior precisa ser recalibrado?
```

Nem todos os itens precisam gerar mudança. O checklist existe para obrigar a avaliação, não para fabricar mecânicas.

## Regra contra otimização do currículo pela gamificação

Não alterar:

- número de lições;
- quantidade de exercícios;
- dificuldade;
- extensão de produção;
- critérios de domínio;
- ordem curricular;

apenas para ajustar XP, missões, streak ou progressão visual.

Quando a economia estiver desequilibrada:

```text
corrigir a gamificação
≠ distorcer o currículo
```

Se uma mudança pedagógica for realmente necessária, ela precisa ser justificada pedagogicamente de forma independente.

## Baseline inicial

No momento de criação deste protocolo:

```text
valores exatos de XP          → ainda não calibrados
conquistas iniciais           → ainda não homologadas
missões iniciais              → ainda não homologadas
algoritmo fino de revisão     → ainda não calibrado
seletor visual de modo        → comportamento definido; visual em aberto
```

Esse estado é intencional.

O primeiro conjunto de baselines deve surgir da homologação do slice vertical N0/N4 previsto em `docs/roadmap-produto.md`, e amadurecer nos marcos P4–P6.

## Regra final

Sempre que houver dúvida entre definir um número agora ou esperar um caso real comparável:

```text
se o número não é necessário para o contrato funcionar
→ não inventar precisão
→ registrar o critério
→ calibrar durante homologação
```

A meta não é produzir a economia mais complexa. É fazer a camada gamificada permanecer coerente, motivadora e subordinada à aprendizagem real.
