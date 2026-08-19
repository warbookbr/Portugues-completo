# Homologação P6 — Feedback por IA no Modo Clássico

## Resultado

**P6: HOMOLOGADO.**

O marco implementa feedback formativo opt-in em atividades elegíveis sem transformar IA em autoridade automática de domínio, preservando o motor pedagógico P5 e a política `VALIDACAO_PENDENTE` para respostas que exigem avaliador confiável.

## Escopo homologado

### P6.1 — núcleo neutro e transporte seguro

Evidência principal: PR #131.

Entregas:

- `AiFeedbackService` isolado de `ProgressService`, Gist e UI;
- envelope mínimo com critérios e limites explícitos;
- `purpose = FORMATIVE_FEEDBACK`;
- `mayPromoteEvidence = false` fixo;
- structured output validado antes de chegar à UI;
- adapter `openai-companion` restrito a loopback;
- token efêmero do companion apenas em `sessionStorage`;
- API key OpenAI mantida no processo local, nunca no navegador;
- companion em `127.0.0.1` com Origin allowlist + token efêmero;
- Responses API com `store: false` e JSON Schema estrito;
- falha técnica convertida em estado seguro sem perda da resposta.

Contrato técnico: `docs/p6-transporte-ia.md`.

### P6.2 — opt-in, piloto e experiência pública

Evidência principal: PR #132 / `docs/homologacao-p6-2.md`.

Entregas:

- IA desligada por padrão;
- consentimento versionado obrigatório;
- Configurações com provider/model/endpoint não secretos;
- API key fora das preferências do browser;
- campos desconhecidos/legados de settings descartados;
- piloto real `N4-U09-L01/L01-A01`;
- cinco critérios explícitos;
- somente `L01-B01` enviado como material;
- chamada paga somente depois de resposta registrada e clique explícito;
- edição da resposta exige novo registro antes de pedir outro feedback;
- feedback estruturado em resumo, forças, melhorias, critérios e próximo passo;
- fronteira pública clara: formativo ≠ validação;
- sucesso e falha não mutam progresso;
- falha preserva resposta e permite nova tentativa;
- IA desligada não polui a experiência padrão.

## P6.3 — auditoria transversal

Gate permanente:

```text
scripts/test-p6-homologation.mjs
```

O gate verifica em conjunto:

```text
segredo de provider fora do frontend
+ token efêmero somente em sessão
+ IA desligada por padrão
+ consentimento vigente antes de ativação
+ AiFeedbackService sem ProgressService/Gist
+ mayPromoteEvidence=false
+ companion loopback
+ store:false
+ structured output estrito
+ rejeição de policy insegura
+ piloto RELIABLE_EVALUATOR
+ material mínimo e critérios explícitos
+ ação explícita do aluno
+ UI declarando limite de autoridade
+ documentação canônica coerente
```

## Validação final

CI da P6.3:

```text
run 32261814336
→ SUCCESS
```

Passaram:

- estrutura do repositório;
- JSON/schemas;
- normalização;
- T1 completo;
- catálogo;
- progresso/migração;
- P6 core;
- P6 companion;
- P6 piloto;
- P6 segurança de settings;
- **P6 homologation**;
- políticas de progresso;
- Gist/sync;
- renderer;
- smoke clássico;
- smoke visual P6.

A inspeção visual da P6.2 já havia aprovado Configurações desktop/mobile, feedback de sucesso desktop/mobile, falha segura e a atividade N4 real com IA desligada.

## Fronteira curricular

A regra final é:

```text
resposta aberta
→ aluno registra
→ ProgressService registra percurso/evidência conforme policy
→ se RELIABLE_EVALUATOR: VALIDACAO_PENDENTE

feedback IA opcional
→ comenta critérios
→ sugere revisão/próximo passo
→ não chama transição de domínio
→ não altera status acadêmico
```

Mesmo um resultado `OK` do provider não significa:

- resposta validada;
- competência demonstrada automaticamente;
- lição aprovada por IA;
- domínio concedido;
- substituição de avaliador confiável.

## Segurança e privacidade

### Segredo do provider

Para OpenAI:

```text
OPENAI_API_KEY
→ companion local do próprio aluno
→ nunca app/js
→ nunca localStorage/sessionStorage do Pages
→ nunca Gist/progresso
```

O browser recebe somente um token efêmero específico do companion.

### Dados enviados

A atividade declara os materiais necessários. Não se envia a lição inteira por conveniência.

Não fazem parte do payload P6 por padrão:

- token GitHub;
- Gist;
- progresso completo;
- API key OpenAI;
- outras lições;
- gamificação.

### Provider

A implementação OpenAI foi rechecada em documentação oficial em 2026-08-19 para:

- autenticação e tratamento de API keys;
- Responses API;
- Structured Outputs;
- modelos/configuração;
- controles de dados.

Como provider/model/políticas podem mudar, qualquer alteração nesses pontos deve revalidar as fontes oficiais vigentes.

## Compatibilidade de navegador

O transporte companion foi validado no caminho Chrome/Chromium usado pelos smokes do projeto. O uso de loopback é compatível com a política de contexto confiável aplicada por esse ambiente.

O P6 não declara homologação universal de todos os navegadores. Compatibilidade específica — especialmente diferenças de WebKit/Safari — pertence à validação E2E do produto. Isso não bloqueia o percurso porque:

```text
IA é opt-in
+ indisponibilidade de IA não bloqueia atividade/curso
+ resposta e progresso permanecem locais/persistidos normalmente
```

## Condição de saída do P6

```text
[x] AiFeedbackService isolado
[x] adapter/provider desacoplado
[x] provider/model configuráveis
[x] BYOK sem segredo no frontend
[x] opt-in/consentimento explícitos
[x] request mínimo
[x] critérios/limites explícitos
[x] structured output validado
[x] falha sem perda da resposta
[x] IA não bloqueia percurso
[x] RELIABLE_EVALUATOR continua pendente
[x] ProgressService mantém autoridade exclusiva
[x] UI sem códigos internos
[x] CI transversal verde
[x] inspeção visual aprovada
```

## Próximo marco

```text
P6 — HOMOLOGADO
→ P7 — Ampliação do catálogo Clássico N0→N4
```

P7 deve aplicar o pipeline homologado ao curso inteiro e habilitar feedback IA apenas onde houver atividade realmente elegível, critérios explícitos e benefício pedagógico. Não adicionar IA em massa apenas porque o mecanismo existe.
