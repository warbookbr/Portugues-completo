# Progresso, feedback, domínio e gamificação

## Objetivo

Este documento define o contrato pedagógico/funcional do **Português Completo** para:

- progresso curricular;
- evidência e domínio pedagógico;
- feedback ao aluno;
- revisão;
- uso de IA em respostas complexas;
- gamificação opcional.

Contratos técnicos complementares:

- `docs/exercicios.md` — atividade, interação, avaliação e evidência;
- `docs/persistencia-progresso.md` — schema do Gist e cálculo mecânico de conclusão;
- `docs/avaliacao-ia.md` — request/response, consentimento e limites da IA;
- `docs/contrato-conteudo.md` — normalização de `completionEvidence` e conteúdo para runtime.

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

### 1. Progresso curricular

Responde:

> Onde o aluno está e o que já percorreu?

Exemplos:

- unidade atual;
- lição atual;
- lições iniciadas;
- lições concluídas;
- verificações realizadas;
- próximo conteúdo recomendado.

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

Exemplos:

- XP;
- conquistas;
- missões;
- sequência de estudo;
- marcos visuais.

Gamificação pode consumir eventos do progresso pedagógico, mas **não pode alterar retroativamente o significado pedagógico desses eventos**.

## Estados de uma lição

```text
NAO_INICIADA
→ o aluno ainda não começou

EM_ESTUDO
→ começou, mas ainda não cumpriu os requisitos de conclusão

CONCLUIDA
→ os requisitos curriculares da lição foram percorridos/registrados
```

`CONCLUIDA` não significa automaticamente que todas as competências trabalhadas na lição estão consolidadas.

Uma lição pode estar concluída e ainda conter:

- competência em desenvolvimento;
- revisão recomendada;
- evidência aguardando validação;
- produção aberta registrada, mas não validada globalmente.

O cálculo mecânico fica em `docs/persistencia-progresso.md`.

## Estados de evidência

```text
NAO_OBSERVADA
→ ainda não existe tentativa/evidência

PRATICADA
→ a tarefa foi executada, mas a evidência ainda não sustenta demonstração suficiente

DEMONSTRADA
→ há evidência suficiente segundo a política declarada

VALIDACAO_PENDENTE
→ existe produção/tentativa registrada, mas a qualidade relevante exige avaliador confiável

REVISAO_RECOMENDADA
→ há dificuldade, instabilidade ou perda de desempenho que justifica nova prática
```

Uma tentativa pode registrar mais de um fato ao mesmo tempo:

```text
atividade realizada
+ resposta armazenada
+ feedback entregue
+ competência ainda em REVISAO_RECOMENDADA
```

## Estados de competência

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

`CONSOLIDADA` exige nova evidência relevante; não surge só porque passou tempo ou porque o aluno acumulou XP.

Quando uma competência depende de avaliação ainda não disponível, a interface pode apresentar `EM_DESENVOLVIMENTO` e mostrar separadamente `VALIDACAO_PENDENTE` para a evidência correspondente.

## Conclusão de lição versus domínio

```text
lição concluída
→ percurso e evidências obrigatórias foram realizados/registrados segundo a política de conclusão

domínio demonstrado
→ evidência satisfez os critérios pedagógicos aplicáveis
```

Quando uma produção exige avaliador confiável:

```text
aluno realiza a produção
→ produção é registrada
→ feedback disponível é entregue
→ evidência recebe VALIDACAO_PENDENTE
→ a lição pode ser concluída como percurso quando o cluster permitir PENDING_ALLOWED
→ domínio não é inventado
```

As políticas normalizadas são:

```text
DEMONSTRATED_REQUIRED
PENDING_ALLOWED
ATTEMPT_REQUIRED
```

Detalhes em `docs/contrato-conteudo.md` e `docs/persistencia-progresso.md`.

## Flexibilidade e gates

A progressão usa **gates suaves por padrão**.

```text
pré-requisito ainda frágil/pendente
→ avisar
→ recomendar revisão
→ permitir exploração posterior quando a atividade continua compreensível
```

Gate duro só deve existir quando a tarefa realmente depende de pré-requisito/recurso indispensável ou quando o currículo explicitamente exigir bloqueio.

Nenhum gate duro pode ser criado por XP, streak, missão ou conquista.

Explorar conteúdo posterior não transforma automaticamente níveis/unidades anteriores em dominados.

## Modelo de feedback

O feedback é escolhido conforme o tipo real de tarefa.

### Nível A — feedback determinístico

Usado quando existe resposta/condição verificável de forma confiável.

Exemplos:

- múltipla escolha;
- classificação;
- correspondência;
- sequência com solução definida;
- identificação explícita;
- transformação com regra fechada.

Estrutura preferida:

```text
resultado
→ o que estava correto/incorreto
→ princípio que explica
→ próximo passo curto
```

Evitar apenas:

```text
Errado.
Tente novamente.
```

### Nível B — feedback estruturado por critérios

Usado quando a resposta é aberta, mas exige componentes observáveis definidos.

Exemplos:

- tese + evidência + justificativa;
- fato + inferência + limite;
- fonte + função + escopo;
- objeção + resposta;
- revisão + justificativa.

O sistema pode validar partes estruturais quando isso for confiável e dar feedback localizado.

Detectar presença de componente não autoriza concluir automaticamente que a qualidade global está correta.

### Nível C — feedback de produção complexa

Usado quando várias respostas podem ser defensáveis e a qualidade depende de relações de sentido.

Exemplos:

- interpretação literária aberta;
- argumentação longa;
- síntese multifuente;
- produção textual extensa;
- edição autoral complexa;
- adequação/estilo;
- produção oral quando qualidade real precisa ser julgada.

Diagnóstico ideal:

```text
o que o aluno conseguiu fazer
→ o que ficou incompleto/frágil
→ evidência do problema
→ critério afetado
→ próximo passo de revisão
```

## Uso de IA no feedback

A IA apoia principalmente Nível C e, quando útil, Nível B.

A entrada inclui somente contexto necessário, objetivo, enunciado, materiais, critérios, limites e resposta.

A IA é **avaliador assistivo**, não fonte infalível.

Se o conteúdo/política declarar equivalente a:

```text
automaticValidation: false
requiresReliableEvaluatorFor: [...]
```

então:

```text
IA fornece diagnóstico/feedback
→ evidência continua VALIDACAO_PENDENTE
```

A IA não grava progresso diretamente. O `ProgressService` aplica somente as transições permitidas pela política.

Contrato completo em `docs/avaliacao-ia.md`.

### Falha ou ausência de IA

A indisponibilidade de IA não apaga trabalho do aluno.

```text
resposta registrada
→ pending quando aplicável
→ aluno pode continuar segundo a regra da atividade
```

Se avaliação for indispensável antes de uma ação específica, a interface explica a dependência em vez de fabricar resultado.

## Feedback após erro

Fluxo preferido:

```text
tentativa
→ diagnóstico
→ feedback curto
→ releitura/exemplo/dica quando útil
→ nova tentativa ou continuação conforme a atividade
```

Não punir erro pedagógico com:

- perda de acesso;
- espera artificial;
- perda de progresso válido;
- vidas;
- redução de domínio sem nova evidência real.

Uma nova tentativa correta após revisão pode ser evidência mais valiosa que um primeiro acerto casual.

## Dicas, consulta e replay

Consultar material, reler, ouvir novamente ou usar dica não é fracasso automático.

O processo pode registrar:

```text
respondeu sem apoio
respondeu após dica
respondeu após releitura
consultou fonte permitida
revisou a própria resposta
```

Esses dados podem melhorar feedback/revisão, mas não viram julgamento moral.

Quando o currículo permite consulta/replay/revisão, o sistema preserva essa permissão.

## Revisão

Existe uma fila de revisão separada de “continuar o curso”.

Pode ser acionada por:

- erro/dificuldade relevante;
- uso repetido de ajuda em competência instável;
- `REVISAO_RECOMENDADA`;
- nova tentativa após intervalo;
- pré-requisito que reaparece;
- pedido voluntário;
- necessidade de transferência.

Contrato:

```text
necessidade detectada
→ entra na fila
→ revisão produz nova evidência
→ competência é recalculada
```

O schema da fila e razões iniciais ficam em `docs/persistencia-progresso.md`.

A ordem pode evoluir por recência, dificuldade, dependências e histórico sem transformar fórmula arbitrária em verdade pedagógica.

## Consolidação

Uma competência passa de `DEMONSTRADA` para `CONSOLIDADA` quando há nova evidência suficiente em outro momento/contexto.

Boas fontes:

- revisão posterior bem-sucedida;
- aplicação em nova tarefa;
- transferência;
- verificação de unidade/nível;
- recuperação após dificuldade.

Não consolidar apenas por:

- XP;
- número de dias;
- passagem de tempo;
- barra de progresso visual.

## Regressão e dificuldade posterior

Domínio não é necessariamente irreversível.

```text
competência demonstrada anteriormente
→ dificuldade relevante em nova aplicação
→ histórico permanece
→ revisão recomendada
→ nova evidência atualiza estado apresentado
```

O histórico distingue “nunca demonstrou” de “já demonstrou, mas precisa recuperar”.

## Modo Clássico

O aluno recebe todo suporte pedagógico sem gamificação.

Pode mostrar:

- onde parou;
- progresso curricular;
- competências em desenvolvimento;
- revisões;
- feedback;
- evidências pendentes;
- conteúdo concluído.

O modo Clássico **não acumula XP ocultamente** e não exige missões, conquistas ou sequência diária.

## Modo Gamificado

Adiciona camada motivacional sobre os mesmos eventos pedagógicos.

Pode usar:

- XP;
- conquistas;
- missões;
- sequência de estudo;
- marcos/progressão visual.

### XP

XP representa participação/realizações do modo de jogo.

XP não representa domínio de português.

Fontes possíveis:

- concluir lição com Gamificado ativo;
- concluir revisão;
- recuperar atividade anteriormente difícil;
- completar missão;
- alcançar marco da jornada.

Evitar premiar volume mecânico de cliques.

### Erros e XP

Erro não retira XP já obtido.

Pode haver recompensa positiva de recuperação:

```text
erro
→ revisão
→ nova tentativa bem-sucedida
→ bônus de recuperação, quando aplicável
```

### Conquistas

Devem representar marcos compreensíveis, não domínio falso.

Exemplos:

- concluir revisões;
- finalizar unidade;
- recuperar competências;
- praticar diferentes tipos de atividade;
- atingir marco de percurso.

### Missões

Orientam ações úteis e opcionais:

```text
concluir uma lição
fazer revisão pendente
retomar competência marcada
praticar habilidade diferente da última sessão
```

Missão não impede acesso ao curso.

### Sequência de estudo

Pode registrar frequência, sem punição desproporcional.

Perder sequência não pode:

- apagar progresso;
- reduzir domínio;
- bloquear lições;
- retirar recompensas adquiridas.

## Troca entre Clássico e Gamificado

### Clássico → Gamificado

- progresso pedagógico permanece;
- evidências/revisões permanecem;
- **XP não é reconstruído retroativamente**;
- gamificação começa/retoma a partir da ativação.

### Gamificado → Clássico

- progresso pedagógico permanece;
- dados gamificados podem ser preservados;
- mecânicas de jogo deixam de condicionar a experiência.

### Retorno ao Gamificado

Dados gamificados preservados podem continuar de onde pararam.

Troca de modo nunca recalcula domínio.

## Persistência

A fonte oficial do progresso acadêmico é o Gist do próprio aluno.

O contrato técnico deixou de ser aberto e está definido em `docs/persistencia-progresso.md`.

Estrutura principal do schema v1:

```text
curriculum
→ posição, lições e verificações

evidence
→ tentativas/estados

competencies
→ estado + referências de evidência

review
→ fila de revisão

responses
→ somente produções que precisam ser preservadas

gamification
→ somente camada de jogo
```

A preferência de modo de estudo é configuração de experiência e pode permanecer local.

A API key de IA nunca pertence ao objeto de progresso nem ao Gist.

## Privacidade e minimização de dados

Armazenar somente o necessário para:

- retomar curso;
- reconstruir progresso;
- sustentar feedback/revisão;
- preservar evidência quando necessário;
- sincronizar gamificação usada.

Não armazenar automaticamente texto integral de toda interação.

Respostas abertas são preservadas apenas quando necessárias como evidência, rascunho retomável ou objeto de revisão.

## Regras para o renderer

O renderer não assume que toda atividade termina em `correto`/`incorreto`.

Precisa representar:

- resultado automático;
- feedback por critério;
- nova tentativa;
- resposta registrada;
- validação pendente;
- revisão recomendada;
- evidência demonstrada;
- dica/consulta/replay permitidos;
- falha de IA/sincronização sem fabricar resultado.

O contrato de interações fica em `docs/exercicios.md`.

## Regras para o ProgressService

O `ProgressService` deve:

- coordenar progresso pedagógico;
- não depender de XP para concluir conteúdo;
- registrar eventos/evidência;
- manter histórico mínimo suficiente;
- expor estados de lição, evidência e competência;
- calcular clusters de conclusão;
- alimentar revisão;
- permitir gamificação como consumidora de eventos;
- sincronizar apenas dados apropriados via GitHub/Gist;
- nunca receber/persistir API key de IA;
- resolver conflitos sem apagar silenciosamente produções do aluno.

Detalhes técnicos em `docs/persistencia-progresso.md`.

## Decisões calibráveis durante implementação/teste

O comportamento estrutural está fechado. Permanecem calibráveis sem alterar o contrato:

- valores exatos de XP;
- catálogo inicial de conquistas;
- frequência/quantidade de missões;
- apresentação visual de streak;
- algoritmo fino de prioridade da fila de revisão;
- componente visual para seleção dos modos;
- quais classes de atividade, após testes de confiabilidade, podem permitir `ASSISTED_VALIDATION` por IA.

Essas escolhas não podem contrariar os princípios deste documento.

## Regra de fechamento

O sistema deve responder separadamente:

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

Se uma implementação misturar essas respostas em uma única pontuação, viola o contrato de progresso.
