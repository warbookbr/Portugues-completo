# Avaliação assistida por IA

## Objetivo

Este documento define o contrato funcional para uso futuro de IA no **Português Completo**, principalmente em respostas abertas e produções complexas.

Ele não escolhe um provedor específico e não transforma IA em fonte automática de verdade pedagógica.

A regra central é:

```text
IA produz análise estruturada
→ ProgressService aplica a política pedagógica declarada
→ IA não escreve domínio/progresso diretamente
```

## Fontes relacionadas

- `docs/arquitetura.md` — BYOK, segurança e persistência local da API key;
- `docs/progresso.md` — estados de evidência e domínio;
- `docs/exercicios.md` — políticas de avaliação das atividades;
- `docs/contrato-conteudo.md` — modelo normalizado de runtime.

## Escopo inicial

A IA é indicada principalmente para:

- interpretação aberta;
- argumentação;
- síntese de fontes;
- produção textual;
- revisão/edição justificada;
- respostas estruturadas em que relações de sentido são relevantes;
- feedback formativo sobre produção oral quando o formato disponível permitir análise apropriada.

A IA não deve ser chamada por padrão para tarefas que o navegador consegue avaliar com segurança de forma determinística.

Exemplo:

```text
múltipla escolha com gabarito local
→ correção local
→ sem custo de API
```

## Credencial

A credencial segue `docs/arquitetura.md`:

```text
API key pertence ao aluno
→ sessão por padrão
→ persistência local somente se o aluno escolher
→ nunca GitHub/Gist
→ nunca conteúdo do curso
```

Nenhuma chave privada do projeto pode ser usada diretamente pelo frontend estático.

## Consentimento e custos

A integração de IA deve ser **opt-in**.

Antes da primeira chamada, a interface deve deixar claro que:

- a chamada usa a API key do próprio aluno;
- o provedor pode cobrar pelo uso conforme o plano do titular;
- o Português Completo envia ao provedor somente o contexto necessário para produzir o feedback;
- feedback de IA pode conter erros e deve ser apresentado com esse limite;
- algumas tarefas continuarão como `VALIDACAO_PENDENTE` mesmo depois do feedback de IA.

A interface não deve iniciar chamadas pagas silenciosamente apenas porque uma chave foi configurada.

Após o aluno ativar feedback por IA, a aplicação pode automatizar chamadas em atividades elegíveis, desde que exista uma configuração clara para desligá-las.

## Abstração por provider

A aplicação deve usar um serviço conceitual equivalente a:

```text
AiFeedbackService
→ recebe contrato neutro do curso
→ seleciona adapter do provider
→ executa a chamada
→ valida a resposta estruturada
→ devolve resultado neutro ao restante da aplicação
```

O renderer e o `ProgressService` não devem conhecer detalhes de endpoint, cabeçalhos ou formato proprietário do provedor.

Estrutura futura sugerida:

```text
app/js/services/ai-feedback-service.js
app/js/services/ai-providers/<provider>.js
```

A estrutura física pode ser refinada na implementação, mas a separação de responsabilidade é obrigatória.

## Configuração local de IA

Preferências de IA pertencem ao dispositivo, separadas do progresso.

Podem incluir:

```text
aiFeedbackEnabled
provider
model
rememberApiKey
```

A própria API key segue a política de armazenamento definida na arquitetura e não deve ser serializada junto das outras preferências se isso criar exposição desnecessária. O serviço de credenciais deve controlar sua leitura/escrita separadamente.

## Contrato de entrada

A IA não recebe a lição inteira automaticamente.

Enviar somente o contexto necessário para avaliar a atividade.

Envelope conceitual:

```json
{
  "schemaVersion": 1,
  "context": {
    "courseId": "portugues-completo",
    "levelId": "N4",
    "unitId": "N4-U09",
    "lessonId": "N4-U09-L01",
    "activityId": "L01-A01",
    "locale": "pt-BR"
  },
  "task": {
    "objective": "...",
    "prompt": "...",
    "materials": [],
    "criteria": [],
    "limits": []
  },
  "learnerResponse": {
    "type": "LONG_TEXT",
    "value": "..."
  },
  "policy": {
    "purpose": "FORMATIVE_FEEDBACK",
    "mayPromoteEvidence": false,
    "requiresReliableEvaluator": true
  }
}
```

## Materiais enviados

`materials` deve conter somente material necessário para reconstruir a tarefa.

Exemplos:

- texto-base da atividade;
- trechos de fontes usados na pergunta;
- dados/tabela necessários;
- resposta anterior quando a tarefa é revisão;
- transcrição quando a atividade oral for analisada textualmente.

Não enviar automaticamente:

- outras lições;
- histórico completo do aluno;
- API key GitHub;
- API key de IA como conteúdo de prompt;
- dados de gamificação;
- informações pessoais que não tenham função pedagógica.

## Critérios

Cada critério enviado deve possuir ID estável dentro da atividade.

Exemplo:

```json
{
  "id": "C2",
  "description": "relaciona cada evidência à interpretação proposta",
  "required": true
}
```

A IA deve avaliar critérios declarados. Ela não deve inventar uma nova rubrica secreta baseada em estilo pessoal.

## Limites

`limits` deve informar explicitamente o que não pode ser inferido ou pontuado.

Exemplos:

```text
não pontuar posição ideológica
não exigir concordância com uma interpretação-modelo
não premiar extensão
não tratar formalidade como superioridade linguística
não inferir fatos externos não presentes no material
```

Esses limites fazem parte da entrada, não apenas da documentação interna.

## Contrato de saída

A resposta do provider deve ser normalizada para um envelope estruturado.

Modelo conceitual:

```json
{
  "schemaVersion": 1,
  "result": "OK",
  "criterionResults": [
    {
      "criterionId": "C1",
      "status": "MET",
      "evidence": "...",
      "feedback": "..."
    }
  ],
  "feedback": {
    "summary": "...",
    "strengths": ["..."],
    "improvements": ["..."],
    "nextStep": "..."
  },
  "confidence": "MEDIUM",
  "recommendation": "REVISE",
  "flags": []
}
```

## Valores de `result`

```text
OK
INSUFFICIENT_CONTEXT
CANNOT_EVALUATE
INVALID_RESPONSE
PROVIDER_ERROR
```

- `INSUFFICIENT_CONTEXT`: faltou material necessário.
- `CANNOT_EVALUATE`: a modalidade/critério excede o que a chamada consegue avaliar com segurança.
- `INVALID_RESPONSE`: o provider respondeu fora do contrato e o adapter não conseguiu normalizar com confiança.
- `PROVIDER_ERROR`: falha técnica/API.

Nenhum desses estados deve ser reinterpretado como erro pedagógico do aluno.

## Status por critério

Valores:

```text
MET
PARTIAL
NOT_MET
UNCERTAIN
NOT_APPLICABLE
```

`UNCERTAIN` é obrigatório como possibilidade. O modelo não deve ser forçado a declarar certeza quando a evidência não sustenta isso.

## Recomendação

Valores canônicos:

```text
CONTINUE
REVISE
RETRY
PENDING_VALIDATION
CANNOT_EVALUATE
```

A recomendação orienta UX. Ela **não é uma transição de estado executada pela IA**.

## Autoridade sobre evidência

O conteúdo/runtime envia uma política explícita.

### Feedback somente

```json
{
  "purpose": "FORMATIVE_FEEDBACK",
  "mayPromoteEvidence": false
}
```

A IA pode explicar, sugerir revisão e apontar critérios.

### Validação assistida futura

Só poderá existir quando uma classe de tarefa tiver sido calibrada e aprovada explicitamente.

```json
{
  "purpose": "ASSISTED_VALIDATION",
  "mayPromoteEvidence": true,
  "validationPolicyId": "..."
}
```

A mera presença de IA não autoriza esse modo.

### `requiresReliableEvaluator`

Se `true`:

```text
feedback da IA
→ permitido

evidência DEMONSTRADA por IA sozinha
→ proibido por padrão
```

O resultado normal é `VALIDACAO_PENDENTE` no progresso.

## Quem altera o progresso

Somente o `ProgressService` aplica transições.

Fluxo:

```text
activity policy
+ resposta do aluno
+ resultado local/IA
→ ProgressService
→ calcula estado permitido
→ salva progresso
```

O `AiFeedbackService` não recebe acesso ao Gist para gravar domínio.

## Robustez contra conteúdo não confiável

Resposta do aluno, textos analisados e fontes da atividade são **dados**, não instruções para controlar o avaliador.

O adapter deve separar claramente:

```text
instruções de avaliação
critérios
limites
materiais
resposta do aluno
```

Se um texto da atividade contiver algo como “ignore as regras anteriores”, isso deve ser tratado como conteúdo a analisar, não como comando do sistema.

## Resposta estruturada

Quando o provider suportar saída estruturada/JSON schema, preferir esse recurso.

Quando não suportar:

```text
resposta textual do provider
→ parser/validador
→ se contrato não for reconstruível com confiança: INVALID_RESPONSE
```

Não extrair estado pedagógico de texto livre por heurísticas frágeis.

## Confiança

`confidence` é metadado do feedback, não nota do aluno.

Valores:

```text
LOW
MEDIUM
HIGH
```

Baixa confiança deve favorecer:

- `UNCERTAIN` nos critérios afetados;
- pedido de nova evidência;
- `PENDING_VALIDATION`;
- não promoção de domínio.

## Feedback ao aluno

O texto deve ser:

- específico;
- respeitoso;
- ligado ao critério;
- curto o suficiente para orientar ação;
- livre de falsa certeza;
- sem elogio genérico usado como preenchimento.

Estrutura preferida:

```text
O que funcionou
→ ponto concreto

O que precisa melhorar
→ ponto concreto + evidência

Próximo passo
→ ação curta e realizável
```

## Falhas técnicas

Se a IA falhar:

```text
resposta do aluno permanece salva quando recordResponse=true
→ tentativa não é perdida
→ mostrar que o feedback de IA está indisponível
→ permitir nova tentativa de feedback quando apropriado
→ manter estado pedagógico anterior/pending
```

Não substituir falha de API por feedback inventado localmente.

## Custo e eficiência

Para reduzir custo e latência:

- não chamar IA em tarefas determinísticas;
- enviar somente material necessário;
- não enviar histórico completo por padrão;
- limitar feedback ao que a atividade precisa;
- reutilizar resultado já salvo quando a mesma resposta e mesma política forem reapresentadas, se isso for seguro e útil;
- não realizar chamadas paralelas redundantes para a mesma atividade.

A implementação pode usar um fingerprint local da entrada para detectar repetição sem armazenar segredos.

## Persistência do feedback de IA

Por padrão, o progresso deve preservar apenas o necessário:

```text
provider/model usados como metadado opcional
policyVersion
criterionResults resumidos
feedback necessário para retomada/revisão
createdAt
fingerprint da resposta/contexto quando útil
```

Não armazenar logs completos de API, prompts internos ou tokens de autenticação.

Quando o feedback não precisar sobreviver entre dispositivos, ele pode permanecer somente local. A decisão por atividade deve favorecer minimização de dados.

## Privacidade

A interface deve informar que uma resposta enviada para feedback de IA sai do GitHub Pages e é processada pelo provedor escolhido pelo aluno.

O projeto deve minimizar o payload e evitar dados pessoais desnecessários.

Textos autorais do aluno só devem ser enviados quando ele ativou o recurso e a atividade efetivamente usa feedback de IA.

## Modalidade oral

A arquitetura inicial não deve prometer avaliação acústica completa sem uma cadeia técnica adequada.

Possibilidades distintas:

```text
transcrição textual
→ IA pode comentar conteúdo verbal conforme critérios textuais

áudio real com provider multimodal adequado
→ pode fornecer feedback acústico somente se a política da atividade e a capacidade do provider forem explicitamente suportadas
```

Mesmo nesse segundo caso, produção oral marcada como dependente de avaliador confiável continua pendente até existir política calibrada.

## Provider e modelo

O contrato do curso é neutro.

A implementação pode começar com um único provider/modelo suportado para reduzir complexidade, desde que:

- o restante da aplicação use o adapter neutro;
- provider/modelo sejam configuráveis sem alterar conteúdo curricular;
- uma atividade não contenha lógica exclusiva de uma API específica.

## Versionamento

Existem três versões distintas que não devem ser confundidas:

```text
ai contract schemaVersion
→ formato request/response interno

policyVersion
→ rubrica/limites aplicados

provider model
→ modelo externo utilizado
```

Feedback salvo deve registrar informação suficiente para saber sob qual política foi produzido.

## Validação e testes antes de autoridade maior

Antes de permitir que IA promova qualquer classe de resposta aberta para `DEMONSTRADA`, o projeto deverá possuir conjunto de casos de teste com:

- respostas claramente adequadas;
- parcialmente adequadas;
- inadequadas;
- alternativas defensáveis;
- respostas que tentem explorar palavras-chave;
- respostas que contenham instruções adversariais;
- casos ambíguos que devem resultar em incerteza.

A comparação deve ser feita com julgamento de referência confiável.

Sem essa calibração, IA permanece **feedback formativo**.

## Regra de fechamento

Para toda chamada de IA, o sistema precisa saber responder:

```text
Por que estamos chamando IA?
→ purpose

Que critérios ela pode analisar?
→ criteria

Que limites ela deve respeitar?
→ limits

Ela pode alterar domínio?
→ policy explícita

O que acontece se falhar?
→ fallback explícito
```

Se alguma dessas respostas estiver implícita apenas no prompt, a integração ainda não está suficientemente contratada.
