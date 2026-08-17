# Validações e Guard Rails

## Objetivo

Este documento define a estratégia de validação automática do **Português Completo**.

Regra geral:

```text
quebra objetiva de contrato
→ erro e CI bloqueado

risco, conteúdo ainda não publicado ou possível degradação
→ warning/pendência explícita
```

Automação protege contratos mecânicos; não substitui revisão pedagógica, homologação visual ou avaliador confiável.

## Fontes de contrato

- `docs/contrato-conteudo.md` — catálogo, manifests, runtime e versões;
- `docs/exercicios.md` — atividade, interação, avaliação, estímulo e evidência;
- `docs/progresso.md` — significado pedagógico dos estados;
- `docs/persistencia-progresso.md` — persistência e cálculo mecânico;
- `docs/avaliacao-ia.md` — limites de feedback assistido;
- `docs/estado-implementacao-classico.md` — estado operacional e blockers.

## Camada 1 — estrutura do repositório

Implementada em `scripts/validate-project.mjs`.

Protege caminhos do índice, arquivos carregados pelo frontend, imports/fetch locais, CSS e problemas objetivos de estrutura.

## Camada 2 — sintaxe JSON

Implementada em `scripts/validate-json.mjs`.

Todos os `.json` em `content/` e `schemas/` precisam ser sintaticamente válidos.

## Camada 3 — schemas de contrato

**Implementada no P1.**

Schemas canônicos:

```text
schemas/course.schema.json
schemas/unit.schema.json
schemas/lesson.schema.json
schemas/verification.schema.json
schemas/progress.schema.json
```

Todos usam JSON Schema Draft 2020-12 como contrato declarativo.

### O que cada schema representa

- `course.schema.json` — catálogo de publicação v2;
- `unit.schema.json` — manifesto de unidade v1;
- `lesson.schema.json` — lição **normalizada de runtime**, não o JSON autoral histórico diretamente;
- `verification.schema.json` — verificação normalizada de unidade/nível;
- `progress.schema.json` — persistência de progresso v1.

### Compatibilidade com autoria v1

Os JSONs históricos continuam válidos como autoria curricular.

```text
autoria v1 existente
→ adapter/normalizador (P2)
→ runtime canônico validado pelos schemas
```

Portanto, P1 **não** regrava nem tenta validar centenas de lições históricas como se já fossem runtime normalizado.

O validator confirma, nas fixtures que possuem fonte JSON real, que:

- a fonte ainda existe;
- a versão autoral esperada continua presente;
- o ID normalizado preserva o ID curricular quando aplicável.

## Fixtures P1

Fonte:

`schemas/fixtures/p1/manifest.json`

As fixtures cobrem extremos reais do curso:

```text
N0-U01-L01
→ single choice
→ classificação
→ TTS
→ evidência determinística

N0-U01-V01
→ verificação determinística
→ áudio controlado
→ sequência

N4-U09-L01
→ interpretação aberta
→ resposta registrada
→ RELIABLE_EVALUATOR
→ PENDING_ALLOWED

N4-U09-V01
→ produção complexa
→ limites sensoriais
→ clusters não compensáveis
```

Também existem fixtures de `course`, `unit` e `progress`.

Fixtures são **contratos de teste**. Não equivalem a manifests publicados e não tornam `content/course.json` v2 antes do P3.

## Validator de contratos

Implementado em:

`scripts/validate-contracts.mjs`

Ele é deliberadamente independente de biblioteca externa para preservar o projeto sem build/runtime adicional.

Responsabilidades:

1. exigir os cinco schemas P1;
2. exigir Draft 2020-12 e `$id`;
3. rejeitar keywords que o validator local ainda não implementa;
4. validar as fixtures contra os schemas;
5. verificar fontes reais declaradas no manifesto de fixtures;
6. verificar compatibilidade básica autoria v1 → fixture normalizada;
7. executar self-test do próprio validator.

### Subconjunto executado atualmente

O validator cobre as keywords usadas pelos schemas P1, incluindo:

```text
type
required
properties
additionalProperties
const
enum
pattern
minimum
minLength
minItems
items
oneOf
```

Se um schema futuro usar nova keyword, o CI deve falhar até o validator ser ampliado ou até o projeto adotar um engine externo de JSON Schema de forma deliberada.

Isso evita a falsa impressão de que uma regra escrita no schema está sendo aplicada quando o CI a ignora.

## Limites intencionais do P1

P1 valida **forma canônica**, não toda integridade entre arquivos.

Ainda pertencem aos próximos marcos:

- catálogo → `unit.json` → lesson/verificação apontando para arquivos reais;
- IDs duplicados entre manifests diferentes;
- `competencyId` referenciado mas inexistente na registry;
- cluster apontando para evidência inexistente;
- normalização automática de prosa histórica;
- comportamento do `ProgressService`;
- Gist;
- IA;
- renderer e acessibilidade visual.

## Camada 4 — integridade de publicação

Entra a partir de P3, quando manifests reais existirem.

Erros objetivos esperados:

```text
course manifest inexistente
unit.id != catálogo
lesson path inexistente
lesson.id != manifesto
verification incompatível
competencyId inexistente
cluster/evidenceId inexistente
schemaVersion não suportada
```

Unidade existente no repositório mas ainda não publicada continua permitida.

## Camada 5 — testes do normalizador

Entra em P2.

Casos mínimos:

- N0 determinístico;
- N0 verification com threshold/áudio controlado;
- N4 aberto com `requiresReliableEvaluatorFor`;
- N4 verification não compensável;
- saída de nível.

Quando uma regra histórica não puder ser normalizada com confiança, retornar erro/estado `BLOCKED`; nunca inventar semântica.

## Camada 6 — progresso, IA e integrações

Conforme P5/P6, adicionar testes para:

- conclusão determinística;
- `PENDING_ALLOWED` concluindo percurso sem fingir domínio;
- clusters não compensáveis;
- revisão;
- persistência/migração/conflito;
- falha de Gist sem perda local;
- falha de IA sem perda de resposta;
- `RELIABLE_EVALUATOR` permanecendo pending;
- ausência de credenciais no progresso.

## Interface e acessibilidade

Quando houver renderer, automação complementa — não substitui — `.ChatGPT/skills/frontend-visual-check/SKILL.md`.

Validar teclado, foco, nomes acessíveis, estados não dependentes só de cor, alternativas a gesto de arrastar e regressões reais em desktop/tablet/mobile.

## Execução atual

```text
node scripts/validate-project.mjs
node scripts/validate-json.mjs
node scripts/validate-contracts.mjs
```

O workflow `.github/workflows/validate-project.yml` executa as três validações em PRs e pushes para `main`.

## Ordem atual

```text
estrutura/referências locais          ✓
sintaxe JSON                          ✓
schemas + fixtures + validator P1     ✓ implementado; CI é a homologação técnica
normalizador/adapters                 → P2
integridade de manifests              → P3
renderer/acessibilidade               → P4+
progresso/Gist                        → P5
IA                                    → P6
```

## Regra para novo guard rail

Antes de adicionar uma validação automática:

1. qual problema real ela detecta?
2. é verificável com confiança?
3. erro, warning ou pendência?
4. qual risco de falso positivo?
5. pertence a schema, integridade, código, UI ou revisão humana?

Não criar heurística automática para substituir julgamento pedagógico aberto.
