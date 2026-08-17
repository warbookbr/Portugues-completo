# Exercícios, atividades e evidência

## Objetivo

Este documento define o contrato funcional das atividades do **Português Completo** para que conteúdo, renderer, feedback, progresso e avaliação possam evoluir sem transformar cada tipo pedagógico em um componente de interface exclusivo.

A distinção central é:

```text
função pedagógica
≠ interação da interface
≠ política de avaliação
≠ peso como evidência
```

Uma atividade pode ter um nome pedagógico específico no conteúdo e ainda reutilizar a mesma interação de runtime de dezenas de outras atividades.

## Fontes relacionadas

- `docs/conteudo.md` — estrutura pedagógica de lições e diferença entre checagem e exercício;
- `docs/progresso.md` — estados de evidência, domínio, revisão e conclusão;
- `docs/contrato-conteudo.md` — normalização dos JSONs para runtime;
- `docs/avaliacao-ia.md` — contrato para feedback assistido por IA;
- `docs/arquitetura.md` — separação entre conteúdo e aplicação.

## Princípios

1. A atividade mede uma competência; a interface não deve determinar a competência.
2. `type` pedagógico pode continuar específico, mas o renderer deve trabalhar com primitivas reutilizáveis.
3. Toda atividade avaliativa deve declarar como pode ser avaliada e que evidência pode produzir.
4. Resposta aberta não deve ser convertida em certo/errado só para simplificar o frontend.
5. Ajuda, replay, releitura e consulta só são penalizados quando a própria atividade justificar isso pedagogicamente.
6. Uma verificação integrada pode exigir vários agrupamentos não compensáveis.
7. Feedback e domínio são separados: uma atividade pode fornecer feedback sem ter autoridade para declarar domínio.
8. Acessibilidade faz parte do contrato da atividade, não é correção posterior.

## As quatro dimensões de uma atividade

### 1. Papel pedagógico

O papel explica por que a atividade existe.

Valores canônicos de runtime:

```text
CHECK
→ checagem curta durante a explicação

PRACTICE
→ prática estruturada sem função de checkpoint

EVIDENCE
→ produz evidência relevante para conclusão de lição/unidade

VERIFICATION
→ verificação integrada de unidade ou nível

PRODUCTION
→ produção autoral, escrita, oral ou multimodal

REFLECTION
→ revisão, justificativa, comparação ou metacognição registrada
```

`CHECK` normalmente tem baixo peso no progresso. `EVIDENCE`, `VERIFICATION` e `PRODUCTION` podem participar de requisitos de conclusão conforme o conteúdo.

### 2. Primitiva de interação

O renderer deve suportar um conjunto pequeno de primitivas de interação.

```text
SINGLE_CHOICE
MULTIPLE_CHOICE
CLASSIFY
MATCH
ORDER
SEQUENCE
SHORT_TEXT
STRUCTURED_RESPONSE
LONG_TEXT
ORAL_RESPONSE
COMPOSITE
```

#### `SINGLE_CHOICE`

Uma opção entre várias.

Serve para múltipla escolha, identificação, conceito fechado e outros tipos em que existe uma escolha única.

#### `MULTIPLE_CHOICE`

Uma ou mais opções corretas.

Só deve ser usada quando selecionar vários elementos mede melhor a competência do que uma série de itens binários artificiais.

#### `CLASSIFY`

Distribui itens entre categorias.

Pode representar, por exemplo, fala/escrita, classes, tipos de fonte ou categorias normativas.

#### `MATCH`

Liga pares ou relações.

Exemplos: termo ↔ função, fonte ↔ afirmação, maiúscula ↔ minúscula.

#### `ORDER`

Ordena elementos segundo uma regra observável.

#### `SEQUENCE`

Reconstrói ou reproduz uma sequência declarada. Pode manter modelo visível quando memória não é o alvo.

#### `SHORT_TEXT`

Resposta textual curta. Pode ser determinística somente quando normalização e conjunto de respostas aceitáveis forem confiáveis.

#### `STRUCTURED_RESPONSE`

Resposta aberta dividida em campos semânticos.

Exemplo:

```text
tese
+ evidência
+ justificativa
+ limite
```

É preferível a um campo totalmente livre quando a própria competência exige componentes identificáveis.

#### `LONG_TEXT`

Produção textual livre ou extensa em que significado global e relações entre partes são relevantes.

#### `ORAL_RESPONSE`

Produção oral registrada ou executada pelo aluno. O contrato deve distinguir `tentativa registrada` de `qualidade oral validada`.

#### `COMPOSITE`

Atividade com etapas dependentes entre si.

Usar quando decompor em atividades independentes mudaria o que está sendo medido, por exemplo:

```text
ouvir sem ver escrita
→ responder julgamento auditivo
→ revelar escrita
→ responder sobre relação som-escrita
```

`COMPOSITE` não é autorização para criar componentes monolíticos; cada etapa ainda deve usar primitivas simples internamente.

## Estímulos

A interação é separada do estímulo.

Tipos de estímulo canônicos:

```text
TEXT
TTS
CONTROLLED_AUDIO
IMAGE
VIDEO
SEMANTIC_UI
DATA_SET
PREVIOUS_RESPONSE
```

### Regras

- `TTS` é adequado quando diferenças específicas de voz não determinam a resposta.
- `CONTROLLED_AUDIO` usa `mediaId` quando características reais do estímulo sonoro são decisivas.
- `IMAGE` e `VIDEO` devem possuir equivalente/acessibilidade conforme a função pedagógica.
- `SEMANTIC_UI` é preferível para letras, tabelas, mapas, relações e diagramas que a interface consegue renderizar de modo acessível.
- `PREVIOUS_RESPONSE` permite revisar ou comparar uma produção anterior sem copiar o texto manualmente.

## Política de avaliação

Cada atividade normalizada deve possuir uma política de avaliação, mesmo que seja `NONE`.

Modos:

```text
NONE
DETERMINISTIC
CRITERIA
AI_ASSISTED
RELIABLE_EVALUATOR
```

### `NONE`

A atividade registra participação/reflexão, mas não tenta declarar acerto ou domínio.

### `DETERMINISTIC`

Existe condição verificável com segurança pelo programa.

Pode usar:

- chave de resposta;
- conjunto de respostas aceitáveis;
- correspondência;
- sequência;
- classificação;
- limiar declarado para itens múltiplos.

### `CRITERIA`

A resposta possui componentes observáveis e critérios explícitos, mas não deve depender de igualdade literal com um gabarito.

A aplicação pode validar partes estruturais de forma determinística e manter outras como pendentes.

### `AI_ASSISTED`

A IA fornece diagnóstico por critérios conforme `docs/avaliacao-ia.md`.

Por padrão, esse modo produz feedback e recomendação; não concede autoridade pedagógica que o conteúdo não tenha declarado.

### `RELIABLE_EVALUATOR`

A competência exige julgamento cuja qualidade o runtime não pode garantir automaticamente.

A tentativa pode ser registrada e receber feedback assistivo, mas a evidência permanece `VALIDACAO_PENDENTE` até existir política de avaliador confiável aplicável.

## Estrutura normalizada de avaliação

Modelo conceitual:

```json
{
  "evaluation": {
    "mode": "DETERMINISTIC",
    "feedbackTiming": "IMMEDIATE",
    "allowRetry": true,
    "penalizeSupport": false,
    "answerKey": {},
    "criteria": [],
    "threshold": null
  }
}
```

Campos são condicionais ao modo. Não preencher estruturas irrelevantes apenas para satisfazer um template.

### `feedbackTiming`

Valores:

```text
IMMEDIATE
AFTER_ACTIVITY
AFTER_VERIFICATION
```

Verificações integradas podem adiar feedback detalhado quando uma resposta revelaria diretamente outra questão.

### Nova tentativa

`allowRetry` deve ser `true` por padrão para prática e checagens.

Uma verificação pode registrar tentativas separadas e exigir revisão antes de nova tentativa, mas não deve criar espera artificial.

## Critérios

Quando uma atividade usa critérios, cada critério deve ser identificável.

Exemplo conceitual:

```json
{
  "criteria": [
    {
      "id": "C1",
      "description": "apresenta uma tese explícita",
      "required": true,
      "observable": true
    },
    {
      "id": "C2",
      "description": "relaciona a evidência à conclusão",
      "required": true,
      "observable": false
    }
  ]
}
```

`observable: true` significa que o sistema possui uma regra confiável para observar aquele componente. Não significa que a qualidade global da resposta é automaticamente válida.

## Papel como evidência

Toda atividade normalizada deve declarar se participa ou não do progresso pedagógico.

```text
NONE
PRACTICE
REQUIRED
CHECKPOINT
```

Modelo conceitual:

```json
{
  "evidence": {
    "role": "REQUIRED",
    "competencyIds": ["N4-U09-C01"],
    "clusterId": "interpretationEvidence",
    "recordResponse": true,
    "requiredForCompletion": true
  }
}
```

### Regras

- `NONE`: não altera domínio.
- `PRACTICE`: pode gerar histórico e revisão, mas não é requisito obrigatório.
- `REQUIRED`: participa de requisito de lição/unidade.
- `CHECKPOINT`: participa de verificação integrada e pode compor gate não compensável.

## Agrupamentos não compensáveis

Uma verificação pode declarar clusters.

Exemplo:

```text
leitura
pesquisa
argumentação
oralidade
```

Se todos são obrigatórios:

```text
desempenho forte em leitura
≠ compensação por ausência de oralidade
```

O runtime deve calcular cada cluster separadamente e somente depois aplicar a política de conclusão definida em `docs/progresso.md`.

## Feedback

A atividade não deve armazenar apenas uma mensagem genérica.

Quando possível, separar:

```text
resultado
explicação
pista/dica
próximo passo
feedback por critério
```

Para atividades determinísticas, feedback pode ser totalmente local.

Para atividades por critérios e produções complexas, o feedback deve apontar o aspecto afetado, e não apenas dizer que a resposta está "fraca" ou "errada".

## Uso de apoio

A atividade pode registrar metadados de processo quando úteis:

```text
hintUsed
replayCount
rereadUsed
consultationUsed
revisionCount
```

Esses dados não alteram domínio automaticamente.

Se a própria tarefa autoriza consulta ou replay, usar esse apoio não pode invalidar a evidência.

## Resposta e armazenamento

Uma atividade pode declarar:

```text
recordResponse: false
→ guardar apenas resultado/estado suficiente

recordResponse: true
→ preservar a produção quando ela é evidência, rascunho retomável ou objeto de revisão posterior
```

Não salvar texto integral apenas por conveniência técnica.

O contrato de persistência fica em `docs/progresso.md`.

## Atividades abertas e IA

Quando a atividade permitir IA:

```text
atividade
→ política de avaliação
→ contexto mínimo + critérios + resposta
→ AiFeedbackService
→ feedback estruturado
→ ProgressService aplica apenas a transição de estado autorizada
```

A IA nunca escreve diretamente no progresso.

Se `requiresReliableEvaluatorFor` estiver presente ou a política normalizada for `RELIABLE_EVALUATOR`, feedback de IA não promove a evidência para `DEMONSTRADA` por padrão.

## Conteúdo existente e compatibilidade

O conteúdo atual já usa muitos nomes pedagógicos, por exemplo:

- `quick-check`;
- `guided-activity`;
- `interpretation-boundary-check`;
- `open-interpretation`;
- `audio-pair-classify`;
- `sequence-reproduction`;
- outros tipos específicos de cada unidade.

Esses nomes **não precisam ser apagados**.

A camada de normalização definida em `docs/contrato-conteudo.md` transforma o payload existente em:

```text
pedagogicalType
+ role
+ interaction
+ evaluation
+ evidence
+ stimuli
```

Assim, um novo subtipo pedagógico não exige automaticamente um novo renderer.

## Mapeamentos iniciais

Exemplos de normalização:

```text
quick-check + single-choice
→ role CHECK
→ interaction SINGLE_CHOICE
→ evaluation DETERMINISTIC
→ evidence NONE ou PRACTICE

guided-activity + classify
→ role PRACTICE/EVIDENCE conforme completionEvidence
→ interaction CLASSIFY
→ evaluation DETERMINISTIC

open-interpretation
→ role PRODUCTION/EVIDENCE
→ interaction LONG_TEXT ou STRUCTURED_RESPONSE
→ evaluation RELIABLE_EVALUATOR quando declarado

sequence-reproduction
→ role VERIFICATION
→ interaction SEQUENCE
→ evaluation DETERMINISTIC

atividade multietapa ouvir → revelar → relacionar
→ interaction COMPOSITE
```

O mapeamento definitivo deve ser feito a partir das propriedades reais da atividade, não apenas do texto de `type`.

## Acessibilidade

Toda primitiva precisa funcionar com:

- teclado quando houver interação visual;
- nome e instrução acessíveis;
- ordem de foco coerente;
- estado selecionado identificável sem depender só de cor;
- alternativas semânticas para relações visuais decisivas;
- replay quando permitido;
- feedback associado à atividade correspondente.

Arrastar e soltar pode existir visualmente, mas deve possuir alternativa operável sem gesto de arraste. A primitiva continua sendo `ORDER`, `CLASSIFY` ou `MATCH`, não `DRAG_AND_DROP` como único contrato.

## O que o renderer não deve fazer

O renderer não deve:

- deduzir domínio a partir de aparência da atividade;
- considerar todo `type` desconhecido como múltipla escolha;
- marcar texto livre como correto por palavras-chave frágeis;
- esconder atividade incompatível e fingir que a lição foi concluída;
- alterar regra curricular conforme modo Clássico/Gamificado;
- transformar XP em pontuação de avaliação.

## Regra de fechamento

Para cada atividade, o sistema deve conseguir responder separadamente:

```text
Por que ela existe?
→ role

Como o aluno interage?
→ interaction

Como pode ser avaliada?
→ evaluation

Que evidência ela produz?
→ evidence

Que estímulo precisa apresentar?
→ stimuli
```

Se essas respostas dependem apenas do nome específico de `type`, o contrato ainda não está suficientemente normalizado.
