# P6 — Transporte seguro para feedback por IA

## Estado

Documento técnico do marco **P6 — Feedback por IA no Clássico**.

Decisão vigente:

```text
GitHub Pages
→ AiFeedbackService neutro
→ adapter openai-companion
→ auxiliar local em 127.0.0.1
→ OpenAI Responses API
```

A API key da OpenAI **não entra no navegador**.

## Por que o desenho BYOK antigo mudou

A arquitetura original previa que a API key do próprio aluno pudesse ficar na sessão do navegador e, mediante escolha explícita, até ser lembrada localmente.

Para OpenAI, esse desenho não é adotado no P6. A documentação oficial atual de autenticação classifica a API key como segredo e orienta a não expô-la em código client-side/browser.

Fontes verificadas em 2026-08-19:

- autenticação/API key: https://platform.openai.com/docs/api-reference/authentication
- Responses API: https://platform.openai.com/docs/api-reference/responses
- Structured Outputs: https://platform.openai.com/docs/guides/structured-outputs
- modelos: https://platform.openai.com/docs/models
- controles de dados: https://platform.openai.com/docs/models/default-usage-policies-by-endpoint

Consequência:

```text
BYOK continua
≠ chave dentro da página

BYOK no adapter OpenAI
→ chave pertence ao aluno
→ chave fica no processo local iniciado pelo aluno
→ navegador recebe apenas token efêmero e limitado ao companion
```

## Componentes

### `AiFeedbackService`

Local:

```text
app/js/services/ai-feedback-service.js
```

Responsabilidades:

- construir envelope neutro e mínimo;
- exigir critérios explícitos;
- enviar somente materiais declarados pela atividade;
- fixar `purpose = FORMATIVE_FEEDBACK`;
- fixar `mayPromoteEvidence = false`;
- validar o structured output retornado;
- transformar resposta inválida em `INVALID_RESPONSE`;
- transformar falha técnica em `PROVIDER_ERROR` sem perder a resposta do aluno;
- não conhecer `ProgressService`, Gist ou domínio.

### Adapter `openai-companion`

Local:

```text
app/js/services/ai-providers/openai-companion.js
```

O adapter do navegador:

- aceita somente endpoint loopback (`localhost`, `127.0.0.1` ou `::1`);
- envia um token efêmero de sessão para o companion;
- envia envelope neutro, provider/model e nenhum segredo OpenAI;
- não conhece o formato da Responses API.

### Auxiliar local

Local:

```text
tools/ai-feedback-companion.mjs
```

O companion:

- escuta somente em `127.0.0.1`;
- exige origem autorizada;
- exige token efêmero;
- aceita somente JSON;
- rejeita envelopes com `mayPromoteEvidence = true`;
- rejeita chamadas que não sejam `FORMATIVE_FEEDBACK`;
- mantém `OPENAI_API_KEY` no processo local;
- usa `POST /v1/responses`;
- usa Structured Outputs por JSON Schema estrito;
- envia `store: false`;
- não registra prompt/resposta em log;
- não expõe o erro bruto do provider ao navegador.

## Execução do companion

Pré-requisito: Node.js compatível com o projeto e uma API key pertencente ao próprio aluno.

### macOS/Linux

```bash
OPENAI_API_KEY="..." node tools/ai-feedback-companion.mjs
```

### PowerShell

```powershell
$env:OPENAI_API_KEY="..."
node tools/ai-feedback-companion.mjs
```

Ao iniciar, o processo mostra:

```text
URL local
+ token efêmero da sessão
+ modelo padrão
```

A interface do curso usa URL + token. A API key não é copiada para o navegador.

## Configuração opcional

Variáveis suportadas:

```text
OPENAI_API_KEY
→ obrigatória

OPENAI_MODEL
→ modelo padrão do companion
→ default atual: gpt-5.6-terra

PORTUGUES_COMPLETO_AI_PORT
→ porta local
→ default: 43117

PORTUGUES_COMPLETO_AI_TOKEN
→ permite fornecer token efêmero em vez de gerar um

PORTUGUES_COMPLETO_ALLOWED_ORIGINS
→ lista separada por vírgula de origens autorizadas

OPENAI_BASE_URL
→ reservado principalmente a testes/ambientes compatíveis
→ produção usa o endpoint oficial por padrão
```

O modelo continua configurável porque disponibilidade/custo mudam com o tempo. Antes de alterar defaults ou capacidades, revalidar documentação oficial do provider.

## Modelo padrão

Na verificação de 2026-08-19, a documentação pública da OpenAI apresenta `gpt-5.6-terra` como opção de equilíbrio entre capacidade e custo. Por isso ele é o default inicial do companion.

O conteúdo curricular nunca depende desse ID. O modelo pertence à configuração do adapter.

## Contrato de entrada

O navegador envia ao companion:

```json
{
  "schemaVersion": 1,
  "model": "gpt-5.6-terra",
  "envelope": {
    "schemaVersion": 1,
    "context": {},
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
      "requiresReliableEvaluator": true,
      "policyVersion": "..."
    }
  }
}
```

## Seleção mínima de materiais

A atividade declara explicitamente quais blocos são necessários:

```text
aiFeedback.materialBlockIds
```

O serviço não envia a lição inteira por conveniência.

Só são materializados campos públicos necessários do bloco selecionado. Metadados internos não autorizados não entram no envelope.

## Critérios e limites

Atividade elegível precisa declarar:

```text
aiFeedback.criteria
aiFeedback.limits
```

Cada critério possui ID estável.

A IA não pode criar uma rubrica secreta para substituir essa lista.

Os limites do documento são somados aos limites específicos da atividade.

## Structured Output

O companion pede JSON Schema estrito à Responses API.

O resultado neutro continua seguindo `docs/avaliacao-ia.md`:

```text
OK
INSUFFICIENT_CONTEXT
CANNOT_EVALUATE
INVALID_RESPONSE
PROVIDER_ERROR
```

Critérios:

```text
MET
PARTIAL
NOT_MET
UNCERTAIN
NOT_APPLICABLE
```

Recomendações:

```text
CONTINUE
REVISE
RETRY
PENDING_VALIDATION
CANNOT_EVALUATE
```

Recomendação é UX, não transição acadêmica.

## Dados e retenção

A chamada usa `store: false` no request da Responses API.

Isso reduz retenção de estado da resposta no provider, mas não deve ser descrito ao aluno como garantia de zero retenção universal: políticas de abuso, conta, região e controles do provider continuam sendo regidos pelos termos/documentação vigentes do titular da API key.

A aplicação envia somente material necessário e não envia:

- token GitHub;
- Gist;
- progresso completo;
- API key OpenAI;
- gamificação;
- outras lições por padrão.

## Ameaças tratadas

### Roubo da API key pelo frontend

Mitigação:

```text
API key não entra no browser
```

### Site arbitrário chamando o companion local

Mitigações:

- bind somente em loopback;
- allowlist de `Origin`;
- `Content-Type: application/json` obrigatório;
- token efêmero obrigatório;
- CORS restrito.

### Prompt injection no texto do aluno/material

Mitigações:

- instruções do avaliador ficam fixas no companion;
- material/resposta são serializados como dados;
- envelope limita critérios e limites;
- texto que diz “ignore regras anteriores” é conteúdo a analisar.

### IA tentando conceder domínio

Mitigações:

- o browser fixa `mayPromoteEvidence=false`;
- o companion rejeita qualquer request diferente;
- `AiFeedbackService` não recebe `ProgressService`;
- atividade `RELIABLE_EVALUATOR` continua pendente.

## Falha segura

Se provider/companion falhar:

```text
resposta já registrada
→ permanece registrada
→ feedback mostra indisponibilidade
→ progresso/domínio não é rebaixado nem promovido
→ aluno pode tentar feedback novamente
```

## O que P6 ainda precisa depois deste núcleo

Este documento/implementação fecha o transporte e a fronteira de autoridade, mas ainda não constitui sozinho homologação completa de P6.

Restam:

```text
configuração/opt-in na UI
→ atividade piloto elegível no slice publicado
→ apresentação do feedback estruturado
→ persistência mínima/local quando útil
→ smoke de IA desligada/ativa/falhando
→ homologação visual
→ atualização do cursor para P7 quando o marco inteiro fechar
```
