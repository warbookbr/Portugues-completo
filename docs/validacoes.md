# Validações e Guard Rails

## Objetivo

Definir a estratégia de validação automática do **Português Completo**.

```text
quebra objetiva de contrato
→ erro e CI bloqueado

risco, dependência externa ou julgamento aberto
→ warning/pendência/revisão explícita
```

Automação protege contratos mecânicos; não substitui revisão pedagógica, homologação visual nem avaliador confiável.

## Fontes de contrato

- `docs/contrato-conteudo.md` — catálogo, manifests, runtime e versões;
- `docs/exercicios.md` — atividade, interação, avaliação, estímulo e evidência;
- `docs/progresso.md` — significado pedagógico dos estados;
- `docs/persistencia-progresso.md` — persistência, conclusão e sincronização;
- `docs/avaliacao-ia.md` — limites de feedback assistido;
- `docs/estado-implementacao-classico.md` — estado operacional e blockers.

## Camada 1 — estrutura do repositório

Implementada em `scripts/validate-project.mjs`.

Protege caminhos do índice, arquivos carregados pelo frontend, imports/fetch locais, CSS e problemas objetivos de estrutura.

## Camada 2 — sintaxe JSON

Implementada em `scripts/validate-json.mjs`.

Todos os `.json` em `content/` e `schemas/` precisam ser sintaticamente válidos.

## Camada 3 — schemas de contrato

Implementada no P1.

```text
schemas/course.schema.json
schemas/unit.schema.json
schemas/lesson.schema.json
schemas/verification.schema.json
schemas/progress.schema.json
```

Todos usam JSON Schema Draft 2020-12. `lesson` e `verification` validam runtime normalizado, não reescrevem a autoria histórica.

Validator: `scripts/validate-contracts.mjs`.

Ele valida as keywords usadas pelos schemas atuais e falha se um schema começar a usar keyword que o validator local ainda não executa.

## Camada 4 — normalização

Implementada no P2 em `scripts/test-content-normalizer.mjs`.

Cobre:

- N0 determinístico;
- N0 verification com threshold/áudio controlado;
- N4 aberto com avaliador confiável;
- N4 verification não compensável;
- saída de nível.

Prosa histórica sem regra auditável produz erro explícito; nunca semântica inventada.

## Camada 5 — integridade de publicação

Implementada no P3.

```text
scripts/validate-catalog.mjs
scripts/test-content-catalog.mjs
```

Protege catálogo → manifesto → fonte real, identidade de IDs/títulos, paths, registry de competências, verification e cobertura da pasta de lições publicada.

Conteúdo curricular ainda fora do catálogo é permitido.

## Camada 6 — renderer e navegador

Implementada no P4 e mantida nos marcos seguintes.

```text
scripts/test-classic-renderer.mjs
scripts/capture-classic-visuals.sh
```

O teste de renderer percorre as 20 lições + 2 verificações do slice N0-U01/N4-U09 e rejeita interação sem suporte.

O smoke Chrome real valida home/unidade/lição N0 e lição N4, além de gerar screenshots em desktop, tablet e 390px.

Falhas automáticas incluem:

```text
tela de erro
Illegal invocation
interação unsupported
metadado técnico conhecido exposto ao aluno
TTS autoral não transformado em controle
pending N4 ausente
painel/configuração de progresso P5 ausentes
```

A inspeção humana das screenshots continua obrigatória quando mudança visual relevante ocorrer.

## Camada 7 — progresso pedagógico

Implementada no P5.

### `scripts/test-progress-service.mjs`

Valida com runtime real:

- N0: erro determinístico → `REVISAO_RECOMENDADA`;
- nova tentativa correta → recuperação;
- cluster satisfeito → lição `CONCLUIDA`;
- competência `EM_DESENVOLVIMENTO`/`DEMONSTRADA` coerente;
- N4: resposta aberta → `VALIDACAO_PENDENTE`;
- `PENDING_ALLOWED` conclui percurso sem declarar domínio;
- resposta aberta persistida;
- progress final valida contra `schemas/progress.schema.json`;
- merge concorrente preserva as duas versões autorais.

### `scripts/test-progress-policies.mjs`

Valida guard rails do contrato independentemente dos casos mais simples do slice:

```text
minimumEvidence
requiredAnyOf
ATTEMPT_REQUIRED
backup local antes de substituir schema desconhecido/JSON inválido
```

Um schema futuro não pode ser descartado silenciosamente só porque a aplicação atual entende apenas v1.

### `scripts/test-progress-merge-edge-cases.mjs`

Cobre conflitos que não aparecem no caminho feliz:

- cluster de verificação presente apenas em um lado do merge não pode virar `undefined`;
- cluster novo do outro dispositivo deve ser preservado;
- revisão já resolvida em um lado não pode ser ressuscitada por uma alteração local não relacionada;
- alteração real concorrente da revisão não pode ser descartada como se fosse somente remoção.

## Camada 8 — GitHub/Gist e sincronização

Implementada no P5 sem chamar a rede real em CI.

### `scripts/test-github-service.mjs`

Mocka a REST API e verifica:

- `GET /user`;
- descoberta de Gist;
- criação com `public: false`;
- leitura de `portugues-completo-progress.json`;
- atualização;
- Authorization header somente nas chamadas da API;
- `Accept: application/vnd.github+json`;
- `X-GitHub-Api-Version` declarado;
- Gist truncado segue `raw_url` somente quando o host é `gist.githubusercontent.com`;
- a leitura por `raw_url` não envia bearer token nem header de versão da API;
- host de `raw_url` inesperado é rejeitado antes de qualquer `fetch`.

Permissões/endpoints são fatos externos e devem ser rechecados em documentação oficial quando o fluxo GitHub for alterado.

### `scripts/test-progress-sync-service.mjs`

Valida:

```text
primeiro sync
baseline
LOCAL_CHANGES após nova alteração
só local mudou
só remoto mudou
merge concorrente
CONFLICT_PRESERVED
falha remota → ERROR sem perda local
desconexão → token de sessão removido
```

Resposta autoral concorrente nunca é validada por concatenação automática.

## Camada 9 — IA

Entra em P6.

Casos mínimos previstos:

- opt-in/BYOK;
- request mínimo;
- structured output válido e inválido;
- provider indisponível;
- resposta do aluno preservada em falha;
- `mayAffectEvidence` respeitado;
- `requiresReliableEvaluator` permanecendo pending;
- ausência de credenciais em progress/Gist/logs persistidos.

## Interface e acessibilidade

Automação complementa — não substitui — `.ChatGPT/skills/frontend-visual-check/SKILL.md`.

Validar:

- teclado e foco;
- nomes acessíveis;
- estados não dependentes apenas de cor;
- alternativas a gesto de arrastar;
- desktop/tablet/mobile;
- estado de progresso/sync compreensível;
- nenhuma afirmação falsa de sincronização/domínio.

## Execução atual no CI

O workflow `.github/workflows/validate-project.yml` executa em PRs e pushes para `main`:

```text
Validate repository structure
Validate JSON syntax
Validate contract schemas
Test content normalization
Validate publication catalog
Test catalog discovery
Test progress engine
Test progress policies
Test progress merge edge cases
Test GitHub Gist service
Test progress sync
Test classic renderer
Capture classic visual smoke
Upload classic visual smoke
```

## Estado das camadas

```text
estrutura/referências locais          ✓
sintaxe JSON                          ✓
schemas/fixtures                     ✓ P1
normalizador/adapters                 ✓ P2
integridade de manifests              ✓ P3
renderer + smoke visual               ✓ P4
progresso/revisão/cache               ✓ P5
Gist/sync/conflito                    ✓ P5
IA                                    → P6
expansão N0→N4                        → P7
publicação/mídia final                → P8
E2E global                            → P9
```

## Regra para novo guard rail

Antes de adicionar automação:

1. qual problema real ela detecta?
2. é verificável com confiança?
3. é erro, warning ou pendência?
4. qual o risco de falso positivo?
5. pertence a schema, integridade, código, UI ou revisão humana?

Não criar heurística automática para substituir julgamento pedagógico aberto.
