# Progresso, feedback, domínio e gamificação

## Objetivo

Este documento define o contrato funcional do **Português Completo** para:

- progresso curricular;
- evidência e domínio pedagógico;
- feedback ao aluno;
- revisão;
- uso futuro de IA em respostas complexas;
- gamificação opcional.

Ele complementa `docs/arquitetura.md` e deve orientar a implementação futura do `ProgressService`, dos renderers de atividade e das interfaces dos modos Clássico e Gamificado.

A regra central é:

```text
percorrer conteúdo
≠ demonstrar domínio
≠ receber XP
```

Essas três dimensões podem se relacionar, mas não devem ser confundidas.

## Princípios

1. O conteúdo didático é o mesmo nos modos Clássico e Gamificado.
2. O progresso pedagógico é único e independente do modo visual escolhido.
3. Gamificação é opcional e nunca é fonte de verdade para domínio.
4. Errar faz parte da aprendizagem; erro não deve bloquear o aluno por punição artificial.
5. Feedback deve explicar o próximo passo útil, não apenas marcar certo/errado.
6. O sistema não deve fingir certeza onde a atividade exige julgamento confiável.
7. Respostas abertas podem gerar evidência e feedback sem serem automaticamente aprovadas.
8. Revisão deve responder a necessidade pedagógica real, não apenas a uma sequência fixa de dias.
9. O aluno pode revisar ou praticar voluntariamente mesmo quando o sistema não exige isso.
10. Estados internos devem ser simples o bastante para serem explicáveis ao aluno.

## Separação das três fontes de estado

O sistema deve manter separadas pelo menos três dimensões.

### 1. Progresso curricular

Responde:

> Onde o aluno está e o que já percorreu?

Exemplos:

- unidade atual;
- lição atual;
- lições iniciadas;
- lições concluídas;
- verificações realizadas;
- próximo conteúdo disponível.

### 2. Evidência e domínio

Responde:

> O que o aluno demonstrou saber, o que ainda precisa praticar e o que depende de validação?

Exemplos:

- competência praticada;
- evidência objetiva demonstrada;
- produção registrada aguardando avaliação confiável;
- necessidade de revisão;
- consolidação por nova evidência em outro momento/contexto.

### 3. Gamificação

Responde:

> Quais elementos motivacionais do modo Gamificado foram obtidos?

Exemplos futuros:

- XP;
- conquistas;
- missões;
- sequência de estudo;
- marcos visuais.

Gamificação pode consumir eventos do progresso pedagógico, mas **não pode alterar retroativamente o significado pedagógico desses eventos**.

## Estados de uma lição

O estado curricular da lição deve ser pequeno e objetivo:

```text
NAO_INICIADA
→ o aluno ainda não começou

EM_ESTUDO
→ o aluno começou, mas ainda não cumpriu os requisitos de conclusão

CONCLUIDA
→ os requisitos curriculares da lição foram percorridos/registrados
```

`CONCLUIDA` não significa automaticamente que todas as competências trabalhadas na lição estão consolidadas.

Uma lição pode estar concluída e ainda conter:

- competência em desenvolvimento;
- revisão recomendada;
- evidência aguardando validação;
- produção aberta registrada, mas não validada globalmente.

## Estados de evidência

Cada atividade ou requisito pedagógico relevante pode produzir um estado de evidência.

Estados recomendados:

```text
NAO_OBSERVADA
→ ainda não existe tentativa/evidência

PRATICADA
→ o aluno executou a tarefa, mas a evidência ainda não sustenta demonstração suficiente

DEMONSTRADA
→ há evidência suficiente segundo a política declarada da atividade

VALIDACAO_PENDENTE
→ existe produção/tentativa registrada, mas a qualidade relevante exige avaliador confiável

REVISAO_RECOMENDADA
→ há evidência de dificuldade, instabilidade ou perda de desempenho que justifica nova prática
```

Uma tentativa pode registrar mais de um fato ao mesmo tempo. Exemplo:

```text
atividade realizada
+ resposta armazenada
+ feedback entregue
+ competência ainda em REVISAO_RECOMENDADA
```

## Estados de competência

Para apresentar evolução sem falsa precisão matemática, a competência pode usar uma escala qualitativa:

```text
NOVA
→ ainda sem evidência suficiente

EM_DESENVOLVIMENTO
→ já praticada, mas ainda instável/incompleta

DEMONSTRADA
→ evidência suficiente no escopo atual

CONSOLIDADA
→ evidência reaparece com sucesso em revisão ou transferência posterior
```

`CONSOLIDADA` exige nova evidência relevante; não deve surgir apenas porque passou tempo ou porque o aluno acumulou XP.

Quando uma competência depende de avaliação ainda não disponível, a interface pode apresentar o domínio principal como `EM_DESENVOLVIMENTO` e mostrar separadamente `VALIDACAO_PENDENTE` para a evidência correspondente, em vez de inventar aprovação.

## Conclusão de lição versus domínio

O sistema deve preservar esta distinção:

```text
lição concluída
→ o percurso e as evidências obrigatórias foram realizados/registrados

domínio demonstrado
→ a evidência satisfez os critérios pedagógicos aplicáveis
```

Portanto, concluir uma lição não exige que toda resposta aberta receba uma aprovação automática inexistente.

Quando uma lição possui uma produção que exige avaliador confiável:

```text
aluno realiza a produção
→ produção é registrada
→ feedback disponível é entregue
→ evidência recebe VALIDACAO_PENDENTE
→ a lição pode seguir a regra curricular declarada sem fingir validação global
```

A política exata de conclusão deve respeitar os campos e limites declarados pelo próprio conteúdo.

## Modelo de feedback

O feedback deve ser escolhido conforme o tipo real de tarefa.

### Nível A — feedback determinístico

Usado quando existe resposta ou condição verificável de forma confiável.

Exemplos:

- múltipla escolha;
- classificação;
- correspondência;
- sequência com solução definida;
- identificação de item explícito;
- transformação com regra fechada quando o recorte permite correção automática.

O sistema deve tentar informar:

```text
resultado
→ o que estava correto/incorreto
→ qual princípio explica isso
→ próximo passo curto
```

Evitar feedback que seja apenas:

```text
Errado.
Tente novamente.
```

### Nível B — feedback estruturado por critérios

Usado quando a resposta é aberta, mas a atividade exige componentes observáveis definidos.

Exemplos:

- apresentar tese + evidência + justificativa;
- separar fato, inferência e limite;
- identificar fonte + função + escopo;
- registrar objeção + resposta;
- produzir revisão justificando mudanças.

O sistema pode verificar presença/estrutura de componentes quando isso for confiável e dar feedback localizado, por exemplo:

```text
A tese está explícita.
A evidência foi citada.
Falta explicar como essa evidência sustenta a conclusão.
```

Detectar presença estrutural não autoriza automaticamente concluir que a qualidade global está correta.

### Nível C — feedback de produção complexa

Usado para tarefas em que várias respostas podem ser defensáveis e a qualidade depende de relações de sentido.

Exemplos:

- interpretação literária aberta;
- argumentação longa;
- síntese de múltiplas fontes;
- produção textual extensa;
- edição autoral complexa;
- avaliação global de adequação/estilo;
- produção oral cuja inteligibilidade/prosódia seja relevante.

Nesses casos, o feedback deve ser baseado em **critérios**, não em comparação literal com uma resposta-modelo.

O diagnóstico ideal deve tentar responder:

```text
o que o aluno conseguiu fazer
→ o que ficou incompleto ou frágil
→ onde está a evidência do problema
→ qual critério foi afetado
→ qual é o próximo passo de revisão
```

## Uso de IA no feedback

A IA poderá apoiar principalmente o Nível C e, quando útil, o Nível B.

A entrada para o avaliador de IA deve incluir somente o contexto necessário, como:

- objetivo da atividade;
- enunciado;
- material-base necessário;
- critérios/rubrica;
- limites de avaliação;
- resposta do aluno;
- indicação do que pode ou não ser validado automaticamente.

A IA deve ser tratada como **avaliador assistivo**, não como fonte infalível.

### Regra de segurança pedagógica

Se o conteúdo declarar algo equivalente a:

```text
automaticValidation: false
requiresReliableEvaluatorFor: [...]
```

uma resposta de IA pode fornecer feedback formativo, mas **não deve, por padrão, transformar sozinha a evidência em `DEMONSTRADA`**.

Nesse caso:

```text
resposta do aluno
→ IA fornece diagnóstico/feedback
→ evidência continua VALIDACAO_PENDENTE
→ validação final depende da política futura de avaliador confiável
```

No futuro, categorias específicas podem receber validação assistida por IA somente depois de critérios suficientemente claros, testes e calibração demonstrarem confiabilidade aceitável. Essa mudança deve ser explícita; não pode acontecer apenas porque a integração técnica existe.

### Falha ou ausência de IA

A indisponibilidade de IA não deve apagar trabalho do aluno.

Se uma atividade puder ser concluída pedagogicamente sem avaliação imediata:

```text
resposta registrada
→ estado VALIDACAO_PENDENTE
→ aluno pode continuar conforme a regra da atividade
```

Se a avaliação for indispensável antes de avançar, a interface deve explicar a dependência em vez de fabricar resultado.

## Feedback após erro

Erro deve gerar oportunidade de aprendizagem.

Fluxo preferido:

```text
tentativa
→ diagnóstico
→ feedback curto
→ releitura/exemplo/dica quando útil
→ nova tentativa ou continuação conforme a atividade
```

O sistema não deve punir erro pedagógico com:

- perda de acesso ao conteúdo;
- espera artificial;
- perda de progresso curricular já válido;
- bloqueio por "vidas";
- redução de domínio que não corresponda a nova evidência real.

Uma nova tentativa correta após revisão pode ser uma evidência pedagógica mais valiosa do que um primeiro acerto casual.

## Dicas, consulta e replay

Consultar material, reler, ouvir novamente ou usar uma dica não deve ser tratado automaticamente como fracasso.

A atividade pode registrar o processo quando pedagogicamente relevante:

```text
respondeu sem apoio
respondeu após dica
respondeu após releitura
revisou a própria resposta
```

Esses dados podem melhorar feedback e recomendação de revisão, mas não devem virar julgamento moral sobre o aluno.

Quando o próprio currículo permite consulta, replay ou revisão, o sistema deve preservar essa permissão.

## Revisão

O Português Completo deve oferecer uma fila de revisão separada de "continuar o curso".

A revisão pode ser acionada por:

- erro ou dificuldade relevante;
- uso repetido de ajuda em uma competência ainda instável;
- `REVISAO_RECOMENDADA` declarado pelo sistema;
- nova tentativa após algum intervalo;
- competência pré-requisito que reaparece em conteúdo posterior;
- pedido voluntário do aluno;
- necessidade de transferência para contexto diferente.

A primeira versão não precisa fixar um algoritmo rígido de repetição espaçada.

O contrato inicial é:

```text
necessidade detectada
→ item entra na fila de revisão
→ revisão produz nova evidência
→ estado da competência é recalculado a partir dessa evidência
```

A implementação futura pode ordenar a fila por prioridade usando fatores como recência, dificuldade observada, dependências e histórico, sem transformar uma fórmula arbitrária em verdade pedagógica.

## Consolidação

Uma competência pode passar de `DEMONSTRADA` para `CONSOLIDADA` quando houver nova evidência suficiente em outro momento ou contexto.

Boas fontes de consolidação incluem:

- revisão posterior bem-sucedida;
- aplicação da mesma competência em nova tarefa;
- transferência para outro gênero/contexto;
- verificação de unidade ou nível;
- recuperação bem-sucedida após dificuldade anterior.

Não consolidar apenas por:

- quantidade de XP;
- número de dias seguidos;
- tempo desde a primeira tentativa;
- conclusão visual de uma barra de progresso.

## Regressão e dificuldade posterior

Domínio não precisa ser tratado como estado irreversível.

Se evidência posterior mostrar dificuldade significativa, o sistema pode marcar `REVISAO_RECOMENDADA` sem apagar o histórico anterior.

Exemplo:

```text
competência demonstrada anteriormente
→ dificuldade relevante em nova aplicação
→ histórico permanece
→ revisão é recomendada
→ nova evidência atualiza o estado apresentado
```

O histórico permite distinguir "nunca aprendeu" de "já demonstrou, mas precisa recuperar".

## Modo Clássico

No modo Clássico, o aluno deve receber todo o suporte pedagógico sem depender de gamificação.

A experiência pode mostrar:

- onde parou;
- progresso curricular;
- competências em desenvolvimento;
- revisões recomendadas;
- feedback das atividades;
- evidências pendentes;
- conteúdo concluído.

O modo Clássico **não acumula XP ocultamente** e não exige missões, conquistas ou sequência diária.

## Modo Gamificado

O modo Gamificado adiciona uma camada motivacional sobre os mesmos eventos pedagógicos.

A primeira versão poderá usar:

- XP;
- conquistas;
- missões;
- sequência de estudo;
- marcos/progressão visual.

### XP

XP representa participação e realizações dentro da experiência gamificada.

XP não representa domínio de português.

Fontes possíveis de XP devem ser positivas e transparentes, por exemplo:

- concluir uma lição enquanto o modo Gamificado está ativo;
- concluir uma revisão;
- recuperar uma atividade anteriormente difícil;
- completar uma missão;
- alcançar um marco definido da jornada.

Evitar premiar apenas volume mecânico de cliques ou repetição sem valor pedagógico.

### Erros e XP

Erro não deve retirar XP já obtido.

O sistema pode valorizar recuperação:

```text
erro
→ revisão
→ nova tentativa bem-sucedida
→ recompensa positiva de recuperação, quando aplicável
```

### Conquistas

Conquistas devem representar marcos compreensíveis, não domínio falso.

Exemplos adequados:

- concluir determinada quantidade de revisões;
- finalizar uma unidade;
- recuperar competências marcadas para revisão;
- concluir atividades de diferentes tipos;
- atingir um marco de percurso.

Uma conquista nunca deve substituir evidência pedagógica.

### Missões

Missões devem orientar ações úteis e opcionais.

Exemplos:

```text
concluir uma lição
fazer uma revisão pendente
retomar uma competência marcada para revisão
praticar uma habilidade diferente da última sessão
```

Missão não deve impedir acesso ao curso quando não cumprida.

### Sequência de estudo

Uma sequência pode registrar frequência, mas deve evitar punição desproporcional.

Perder uma sequência não pode:

- apagar progresso;
- reduzir domínio;
- bloquear lições;
- retirar recompensas já adquiridas.

## Troca entre Clássico e Gamificado

O progresso pedagógico é preservado integralmente em qualquer troca.

### Clássico → Gamificado

Ao ativar o Gamificado:

- lições concluídas continuam concluídas;
- competências demonstradas continuam demonstradas;
- revisões continuam pendentes quando aplicável;
- evidências anteriores continuam válidas;
- **XP não é reconstruído retroativamente** para o período em que o aluno escolheu estudar no modo Clássico.

O registro gamificado começa a partir da ativação.

Marcos pedagógicos antigos podem aparecer como histórico do curso, mas não devem gerar uma pontuação retroativa inventada.

### Gamificado → Clássico

Ao voltar ao Clássico:

- o progresso pedagógico continua igual;
- dados gamificados já conquistados podem ser preservados para eventual retorno;
- XP, missões e conquistas deixam de ser necessários para a experiência atual;
- nenhuma mecânica de jogo deve continuar bloqueando ou condicionando o estudo.

### Retorno ao Gamificado

Se o aluno reativar o Gamificado, os dados gamificados preservados podem continuar de onde pararam.

A troca de modo nunca recalcula domínio pedagógico.

## Persistência

A fonte oficial do progresso acadêmico continua sendo o Gist do próprio aluno, conforme `docs/arquitetura.md`.

O modelo futuro de progresso deve conseguir armazenar separadamente:

```text
curriculum
→ posição, lições e verificações

evidence
→ tentativas, estados e referências necessárias

competencies
→ estado atual + histórico mínimo necessário

review
→ itens recomendados/pendentes

gamification
→ somente quando houver dados do modo Gamificado
```

A preferência de modo de estudo é configuração de experiência e pode permanecer em armazenamento local conforme a arquitetura; ela não deve alterar a fonte de verdade do progresso pedagógico.

A API key de IA nunca pertence ao objeto de progresso nem ao Gist.

## Privacidade e minimização de dados

O sistema deve armazenar somente o necessário para:

- retomar o curso;
- reconstruir progresso;
- sustentar feedback/revisão;
- preservar evidências quando necessário;
- sincronizar gamificação se o aluno usar esse modo.

Não armazenar automaticamente texto integral de toda interação se um resumo/estado for suficiente.

Respostas abertas que precisem ser preservadas como evidência devem ser tratadas explicitamente como tal.

## Regras para o renderer futuro

O renderer não deve assumir que toda atividade termina em `correto` ou `incorreto`.

Ele precisa conseguir representar pelo menos:

- resultado automático correto/incorreto quando aplicável;
- feedback por critério;
- nova tentativa;
- resposta registrada;
- validação pendente;
- revisão recomendada;
- evidência demonstrada;
- dica/consulta permitida;
- estado indisponível sem fabricar resultado.

Também deve conseguir mostrar os mesmos estados pedagógicos nos dois modos sem duplicar o conteúdo.

## Regras para o ProgressService futuro

O `ProgressService` deve:

- ser a fonte de coordenação do progresso pedagógico no frontend;
- não depender de XP para concluir conteúdo;
- registrar eventos de aprendizagem e evidência;
- manter histórico suficiente para revisão e recuperação;
- expor estados de lição, evidência e competência;
- permitir que a gamificação consuma eventos sem controlar domínio;
- sincronizar apenas dados apropriados com o `GitHubService`/Gist;
- nunca receber nem persistir API key de IA.

## Decisões ainda abertas para implementação

Este documento fecha o **comportamento**, mas não congela números ou componentes visuais prematuramente.

Ainda podem ser definidos durante implementação/teste:

- valores exatos de XP;
- catálogo inicial de conquistas;
- frequência e quantidade de missões;
- regra visual de sequência;
- algoritmo de prioridade da fila de revisão;
- formato exato do JSON de progresso;
- componente visual para seleção dos modos;
- quais categorias, após calibração, podem usar IA também como validação e não apenas feedback.

Essas escolhas não podem contrariar os princípios deste documento.

## Regra de fechamento

O sistema deve sempre conseguir responder separadamente:

```text
O aluno percorreu o quê?
→ progresso curricular

O aluno demonstrou o quê?
→ evidência/domínio

O que precisa revisar ou validar?
→ revisão/pendências

O que ganhou no modo de jogo?
→ gamificação
```

Se uma implementação misturar essas respostas em uma única pontuação, ela está violando o contrato de progresso do projeto.
