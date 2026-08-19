# Homologação P6.2 — opt-in, piloto N4-U09 e feedback visual

## Resultado

**P6.2: HOMOLOGADO.**

A subfase prova a integração do núcleo P6 com uma atividade aberta real do slice publicado sem transferir autoridade curricular à IA.

## Escopo homologado

### Configuração e consentimento

A interface possui `Configurações → Feedback por IA` com:

- feedback desligado por padrão;
- ativação explícita;
- consentimento versionado obrigatório;
- aviso de que chamadas podem ter custo e enviam dados ao provider;
- aviso de que a IA pode errar;
- aviso de que feedback não aprova atividade nem concede domínio;
- provider/model/endpoint como configuração não secreta;
- token efêmero do companion somente em `sessionStorage`;
- API key OpenAI fora do navegador.

`SettingsService` aceita/persiste somente chaves oficiais. Campos desconhecidos ou históricos como `apiKey` e `rememberApiKey` são descartados.

### Piloto curricular

Atividade:

```text
N4-U09-L01
→ L01-A01 — interpretação aberta
```

A atividade mantém:

```text
evaluation.mode = RELIABLE_EVALUATOR
→ resposta registrada
→ evidência = VALIDACAO_PENDENTE
```

A camada P6 acrescenta apenas feedback formativo.

O contrato do piloto declara cinco critérios explícitos:

1. interpretação própria;
2. evidências internas pertinentes;
3. vínculo entre evidência e interpretação;
4. alternativa plausível;
5. limite de certeza.

O payload envia somente `L01-B01` como material de apoio, não a lição inteira.

### Fluxo público

```text
aluno responde
→ registra resposta pelo fluxo normal
→ resposta já está salva
→ botão separado “Pedir feedback com IA”
→ chamada somente por ação explícita
→ structured feedback
→ nenhuma alteração automática de domínio/evidência
```

Se o aluno alterar o texto depois de registrá-lo, o botão de IA volta a ser bloqueado até a nova versão ser registrada.

### Falha segura

Provider/companion indisponível:

```text
resposta permanece salva
→ progresso não muda
→ validação pendente permanece
→ interface informa indisponibilidade
→ nova tentativa continua possível
```

## Validação automatizada

CI final da branch:

```text
run 32260852054
→ SUCCESS
```

Gates P6 relevantes:

- `Test P6 AI feedback core`;
- `Test P6 AI companion`;
- `Test P6 AI feedback pilot`;
- `Test P6 AI settings security`;
- `Capture P6 AI visual smoke`.

Todos os gates anteriores de T1, P5, catálogo, progresso, Gist/sync e renderer também permaneceram verdes.

## Inspeção visual

Capturas finais inspecionadas:

- `p6-ai-settings-desktop.png`;
- `p6-ai-settings-mobile.png`;
- `p6-ai-success-desktop.png`;
- `p6-ai-success-mobile.png`;
- `p6-ai-failure-desktop.png`;
- atividade N4 real com IA desligada por padrão.

Resultado:

- hierarquia legível;
- controles cabem em mobile;
- feedback não compete com a resposta principal;
- fronteira “formativo ≠ validação” permanece visível;
- estado de falha é compreensível;
- IA desligada não polui a atividade padrão;
- nenhum ID/policy/flag técnico aparece na fala pública.

## Limites preservados

P6.2 **não** significa:

- IA validando domínio;
- IA substituindo `RELIABLE_EVALUATOR`;
- todas as respostas abertas do curso habilitadas para IA;
- feedback obrigatório;
- API key OpenAI persistida no frontend;
- P6 inteiro fechado sem homologação transversal.

## Próximo gate

```text
P6.3 — homologação transversal do feedback IA
→ verificar segurança + opt-in + payload mínimo + structured output
→ verificar falha/ausência de IA
→ verificar neutralidade sobre ProgressService
→ verificar fontes/documentação canônicas
→ fechar P6 e liberar P7 somente se todos os invariantes continuarem satisfeitos
```
