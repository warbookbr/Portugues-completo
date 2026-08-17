# Calibração progressiva de gamificação, revisão e experiência

## Objetivo

Este documento define **como** decisões ainda calibráveis do Português Completo devem ser fechadas durante homologação e testes, sem congelar números ou fórmulas antes de existir experiência real suficiente.

Ele se aplica principalmente a:

- valores de XP;
- bônus de recuperação e outros eventos gamificados;
- conquistas;
- missões;
- sequência de estudo e marcos visuais;
- prioridade fina da fila de revisão;
- decisões visuais do seletor Clássico/Gamificado.

A regra central agora é:

```text
primeiro construir e homologar o Modo Clássico
→ durante essa homologação registrar casos-âncora reais
→ somente depois do gate CLÁSSICO HOMOLOGADO implementar/calibrar gamificação
```

E o guard rail principal permanece:

> **A gamificação é calibrada sobre conteúdo homologado; o conteúdo nunca é redesenhado para caber numa economia de XP.**

Este documento complementa `docs/progresso.md`, `docs/exercicios.md`, `docs/persistencia-progresso.md` e `docs/roadmap-produto.md`.

## Separação entre calibração clássica e gamificada

Nem toda calibração precisa esperar o modo Gamificado.

### Durante o desenvolvimento do Clássico

Devem ser calibrados e homologados:

- comportamento pedagógico;
- esforço real das atividades como observação;
- feedback;
- evidência;
- progresso;
- revisão e sua prioridade;
- acessibilidade;
- fluxo e duração percebida;
- recuperação após erro;
- casos-âncora de atividade, lição, verificação e unidade.

Esses casos-âncora **não recebem XP no produto Clássico**. Eles registram comparadores para uso posterior.

### Depois do gate `CLÁSSICO HOMOLOGADO`

Podem ser concretizados:

- valores de XP;
- bônus gamificados;
- conquistas;
- missões;
- streak;
- progressão visual;
- seletor ativo entre Clássico/Gamificado;
- economia global do modo de jogo.

Assim, o projeto obtém dados reais sem introduzir a camada de jogo antes de o núcleo pedagógico estar provado.

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

Portanto, o projeto define primeiro:

```text
princípios
+ fatores de comparação
+ procedimento de homologação
+ registro de casos-âncora
```

E só converte esses dados em valores gamificados concretos depois que o Clássico estiver homologado.

## O que significa homologar

Homologar não é apenas confirmar que o JSON carrega ou que um botão funciona.

Uma atividade, lição, verificação ou unidade está pronta para virar caso-âncora quando, no recorte testado:

1. o conteúdo pedagógico está correto para o objetivo declarado;
2. a interação representa adequadamente a tarefa;
3. o feedback funciona como esperado;
4. a evidência produzida corresponde ao contrato;
5. estados de progresso/pending/revisão são coerentes;
6. acessibilidade necessária está preservada;
7. não há erro técnico relevante mascarando esforço ou fluxo.

A gamificação vem **depois** dessas verificações e, por decisão de produto, depois da homologação global do Clássico.

## Unidade de calibração

A calibração pode ocorrer em diferentes escalas:

```text
atividade
→ evento local de prática/recuperação

lição
→ percurso completo e esforço agregado

verificação
→ integração de evidências e exigência real

unidade
→ marco de percurso e equilíbrio entre várias lições

jornada
→ coerência global entre níveis e etapas
```

Não atribuir peso olhando apenas o nome do nível ou a quantidade de telas.

## Protocolo obrigatório durante homologação do Clássico

Sempre que uma atividade, verificação ou unidade relevante for homologada:

```text
1. validar comportamento pedagógico
2. identificar esforço e complexidade reais
3. identificar sinais de revisão/recuperação
4. comparar com casos já homologados
5. classificar o caso como possível âncora
6. justificar a comparação
7. verificar distorções no fluxo clássico
8. registrar a decisão duradoura
9. recalibrar referências anteriores se novos casos revelarem desequilíbrio
```

Durante P1–P9, **não é necessário nem desejável atribuir XP ao produto**.

Exemplo:

```text
atividade homologada
→ esforço curto e determinístico
→ equivalente a outras práticas breves
→ registrada como âncora de baixa carga
→ nenhum XP implementado no Clássico
```

## Protocolo após o gate Clássico

A partir do P10, para cada evento candidato a recompensa:

```text
1. escolher caso-âncora clássico comparável
2. identificar esforço/complexidade/autonomia
3. propor valor gamificado provisório
4. comparar com outras âncoras
5. verificar farm e incentivos perversos
6. testar proporção atividade → lição → verificação → unidade
7. justificar a decisão
8. homologar ou recalibrar
```

A ausência de recompensa continua sendo uma decisão válida.

## Fatores para calibrar XP

XP representa **participação e realização na experiência gamificada**, nunca domínio de português.

Ao propor XP depois do gate clássico, considerar em conjunto:

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

Uma produção que exige organizar, revisar ou tomar decisões próprias pode justificar peso diferente de uma checagem guiada, desde que isso tenha sido observado no Clássico homologado.

### Integração

Verificações/unidades que integram várias responsabilidades podem justificar marco gamificado próprio, sem transformar o número de competências em fórmula automática.

### Recuperação

Quando o aluno encontra dificuldade, revisa e depois consegue executar a tarefa, o sistema pode reconhecer positivamente a recuperação.

Isso é diferente de premiar erro por si só.

### Tempo

Tempo esperado pode ser sinal auxiliar de esforço, mas **nunca é critério pedagógico de qualidade ou domínio**.

Não criar XP proporcional a minutos gastos.

### Repetição

Repetição só deve gerar recompensa quando ainda existe valor real de prática/revisão.

Não permitir farm por repetição mecânica de ação trivial já dominada.

## O que não deve gerar XP por si só

- abrir uma tela;
- clicar em continuar;
- ouvir TTS sem atividade associada;
- repetir indefinidamente uma ação já concluída apenas para acumular pontos;
- errar deliberadamente;
- permanecer com a página aberta;
- ativar/desativar o modo Gamificado;
- mudar configurações;
- fornecer API key;
- quantidade de palavras escrita sem relação com a tarefa.

## Construção gradual da escala de XP

A escala não nasce de tabela inventada no início.

### Fase Clássica — construir âncoras sem pontos

```text
casos reais do Clássico
→ observar esforço
→ comparar atividades equivalentes
→ registrar baixa/média/alta carga relativa sem transformar isso em domínio
→ observar proporção entre atividade/lição/verificação/unidade
→ formar referências estáveis
```

### Fase Gamificada — converter âncoras em economia

Somente depois do gate:

```text
âncoras homologadas
→ atribuir valores provisórios justificados
→ comparar proporções
→ testar progressão
→ revisar outliers/farm
→ homologar baselines
```

A pergunta obrigatória passa a ser:

> Qual caso clássico homologado é o comparador mais próximo e por que este evento gamificado deve valer igual, menos ou mais?

Se não houver comparador adequado, o valor permanece **provisório**.

## Registro de casos-âncora

Durante o Clássico, cada âncora relevante deve poder ser reconstruída.

Formato recomendado:

```text
ID / evento:
Escopo: atividade | lição | verificação | unidade | jornada
Estado: observado | homologado | revisado
Esforço observado:
Complexidade/autonomia:
Apoios permitidos:
Recuperação/revisão observada:
Comparadores usados:
Classificação relativa:
Justificativa:
Risco de distorção futura:
Data/marco de homologação:
```

Não há campo obrigatório de XP nessa fase.

## Registro de calibração de XP

Depois do gate clássico, complementar a âncora com:

```text
Estado gamificado: provisório | homologado | recalibrado
Valor de XP proposto/adotado:
Bônus aplicável:
Risco de farm:
Comparadores gamificados usados:
Justificativa da economia:
```

O registro pode ficar neste documento enquanto o volume for pequeno e migrar para arquivo de dados quando necessário.

## Recalibração de XP

Recalibrar não é falha. É parte esperada da homologação incremental.

Revisar a escala quando:

- atividades equivalentes tiverem recompensas desproporcionais;
- unidade gerar muito mais XP apenas por estar fragmentada;
- determinado tipo permitir farm;
- bônus de recuperação superar de forma distorcida a realização principal;
- progressão visual avançar rápido/devagar demais;
- extremos N0/N4 mostrarem que a escala não generaliza.

Quando recalibrar:

1. preservar progresso pedagógico;
2. não transformar XP em domínio;
3. evitar retirar recompensas já obtidas sem necessidade forte;
4. preferir ajustar regras futuras/baselines antes de reescrever histórico;
5. documentar a razão.

## Conquistas

Não criar catálogo de conquistas durante a construção do Clássico.

O Clássico pode revelar marcos candidatos. Uma conquista só deve ser implementada no P10 quando o padrão for:

- compreensível;
- reconhecível pelo sistema;
- positivo;
- não manipulável por clique trivial;
- coerente com a jornada;
- independente de falsa alegação de domínio.

Boas fontes potenciais:

- concluir unidade;
- concluir conjunto significativo de revisões;
- recuperar competência anteriormente marcada;
- experimentar diferentes tipos relevantes de prática;
- atingir marco de percurso.

Durante P3–P9, registrar apenas candidatos quando realmente surgirem.

## Missões

Missões também não são implementadas no Clássico.

Durante a homologação clássica, observar quais ações o sistema realmente consegue recomendar com valor pedagógico, por exemplo:

```text
continuar uma lição
+ fazer revisão pendente
+ recuperar dificuldade anterior
```

No P10, uma missão candidata deve ser validada quanto a:

- clareza;
- executabilidade;
- relevância;
- ausência de bloqueio;
- ausência de incentivo mecânico;
- respeito à opcionalidade do modo Gamificado.

## Sequência de estudo

Streak é exclusivamente gamificado e só entra depois do gate Clássico.

Durante testes do Gamificado, observar:

- clareza da regra;
- fusos/horários;
- sensação de punição;
- incentivo a abrir o app sem estudar de verdade.

Sequência nunca altera domínio, gates ou progresso curricular.

## Calibração da revisão

A revisão é diferente: ela pertence ao **núcleo pedagógico Clássico** e deve amadurecer antes da gamificação.

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

Preferir prioridades explicáveis em vez de fórmula sofisticada.

```text
ALTA
→ dificuldade recente em pré-requisito relevante

NORMAL
→ revisão recomendada sem dependência imediata

VOLUNTARIA
→ prática escolhida pelo aluno
```

Os nomes podem evoluir. Não criar pontuação de “probabilidade de esquecimento” sem base suficiente.

### Homologação da revisão

Ao testar atividade/unidade no Clássico, verificar:

1. quais erros deveriam gerar revisão;
2. quais erros são locais;
3. quando nova evidência remove/rebaixa prioridade;
4. se o item recomendado ajuda no conteúdo seguinte;
5. se a fila fica repetitiva/excessiva;
6. se o aluno entende a recomendação.

Essa homologação participa do gate `CLÁSSICO HOMOLOGADO`.

## Aparência do seletor Clássico/Gamificado

O comportamento arquitetural já está definido, mas o **seletor não precisa existir enquanto só o Clássico está implementado**.

Sua forma visual é decidida no P10, quando o Gamificado realmente existir.

Comparar cards, botão, seletor ou outro componente considerando:

- clareza da escolha;
- compreensão de que o conteúdo é o mesmo;
- facilidade de troca;
- acessibilidade;
- responsividade;
- risco de sugerir superioridade pedagógica de um modo;
- consistência visual.

Validar em desktop/tablet/mobile.

## Relação com os marcos do roadmap

### P1–P2

- nenhum XP;
- garantir contratos/runtime pedagógicos independentes de gamificação.

### P3–P4

- observar primeiros casos reais N0/N4;
- registrar âncoras de esforço e recuperação;
- Clássico apenas.

### P5

- homologar revisão, progresso e persistência;
- continuar formando âncoras.

### P6

- homologar impacto do feedback por IA no esforço/fluxo clássico;
- revisar âncoras afetadas;
- nenhum XP.

### P7–P8

- ampliar catálogo e fechar mídia/publicação do Clássico;
- acumular âncoras N0→N4;
- recalibrar revisão quando necessário;
- nenhum sistema gamificado.

### P9

- homologação end-to-end do Clássico;
- fechar conjunto inicial de casos-âncora;
- gate `CLÁSSICO HOMOLOGADO`.

### P10

- implementar Gamificado;
- converter âncoras em valores provisórios de XP;
- criar conquistas/missões/streak iniciais somente a partir de padrões observados;
- decidir seletor visual.

### P11

- homologar economia gamificada no conjunto;
- corrigir outliers/farm/saturação;
- fechar baselines iniciais;
- manter recalibração futura baseada em evidência.

## Checklist de homologação durante o Clássico

```text
PEDAGOGIA
[ ] comportamento pedagógico correto?
[ ] feedback/evidência/progresso coerentes?

REVISÃO
[ ] alguma dificuldade deve entrar na fila?
[ ] qual prioridade é justificável?
[ ] há condição clara para retirar/rebaixar?

ÂNCORAS FUTURAS
[ ] esforço real foi observado?
[ ] existe comparador já homologado?
[ ] este caso adiciona informação útil para futura gamificação?
[ ] há risco de farm/distorção que deve ser lembrado?

REGISTRO
[ ] decisão duradoura registrada?
[ ] alguma âncora anterior precisa ser revista?
```

**Não perguntar “quanto XP dar?” como requisito de homologação do Clássico.**

## Checklist de homologação do Gamificado

A partir do P10:

```text
GAMIFICAÇÃO
[ ] existe evento que merece XP?
[ ] qual âncora clássica é o comparador?
[ ] peso evita premiar cliques/tempo/farm?
[ ] recuperação merece reconhecimento?
[ ] surgiu marco real para conquista?
[ ] surgiu ação útil e opcional para missão?
[ ] streak está não punitivo?

EXPERIÊNCIA
[ ] troca de modo preserva tudo que é pedagógico?
[ ] seletor está claro e acessível?
[ ] Clássico continua funcionando sem gamificação?
```

Nem todos os itens precisam gerar mudança.

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

Se mudança pedagógica for realmente necessária, precisa de justificativa pedagógica independente.

## Baseline atual

```text
Modo Clássico                → ainda em construção técnica
casos-âncora                 → começam a surgir no P3/P4
revisão                      → começa a ser homologada no P5
valores exatos de XP         → proibidos como requisito antes do gate clássico
conquistas iniciais          → ainda não homologadas
missões iniciais             → ainda não homologadas
streak/progressão visual     → ainda não calibrados
seletor visual de modo       → comportamento definido; implementação no P10
```

Esse estado é intencional.

## Regra final

Antes do gate clássico:

```text
observar
→ comparar
→ registrar âncoras
→ homologar o núcleo
→ não implementar economia de XP
```

Depois do gate clássico:

```text
usar âncoras reais
→ propor gamificação
→ testar
→ recalibrar
```

A meta é manter a camada gamificada coerente, motivadora e **subordinada a um produto clássico já funcional e homologado**.
