# Homologação P7 — N0-U06

## Estado

```text
P7 / lote N0-U06: HOMOLOGADO
Unidade: N0-U06 — Usando a língua no cotidiano
Manifesto: READY
Mídia humana obrigatória: nenhuma
Próximo lote: N1-U01 — Lendo textos com mais autonomia
```

Este registro fecha o quarto lote incremental do P7 e encerra a ampliação do catálogo do **Nível 0**. O P7 continua **ATIVO** até cobrir N0→N4.

## Escopo homologado

Entraram no pipeline Clássico:

- `content/units/006-usando-lingua-cotidiano/unit.json`;
- 10 lições `N0-U06-L01` → `N0-U06-L10`;
- `N0-U06-V01`;
- 10 competências estáveis `N0-U06-C01` → `N0-U06-C10`;
- pré-requisito `N0-U05-V01`;
- descoberta pelo `ContentService` via `content/course.json`;
- renderer/progresso para compreensão oral audio-first, produção aberta, reparo comunicativo e ensaio oral registrável;
- publicação `READY`, sem blocker de mídia humana.

A autoria v1 foi preservada. O adapter/runtime foi ampliado por capacidades reutilizáveis, sem converter sotaque, variedade ou informalidade em erro automático.

## Fronteiras pedagógicas homologadas

### Compreensão oral audio-first

As atividades de escuta preservam a ordem:

```text
ouvir
→ responder pelo que ouviu
→ somente depois consultar transcrição
```

A transcrição não entra no HTML inicial. Repetir o áudio é permitido e registrado como apoio/prática, sem penalidade automática de domínio.

### Adequação e variação

A camada pública e os testes preservam:

- formalidade ≠ qualidade universal;
- informalidade ≠ erro automático;
- sotaque/variedade ≠ inferioridade;
- adequação depende de situação, interlocutor e finalidade;
- pedir repetição, esclarecimento e confirmação é competência comunicativa.

### Produção escrita e ensaio oral

Produções abertas continuam `RELIABLE_EVALUATOR` e são persistidas como `VALIDACAO_PENDENTE` quando não há avaliador confiável.

O ensaio oral é registrável, mas marcar que praticou **não autoriza** o sistema a declarar pronúncia, sotaque ou compreensibilidade validados. Na L10 ele é complemento opcional da reformulação escrita; na V01 a prática é obrigatória para concluir o percurso, mas sua evidência permanece pending.

## V01 e não compensação

`N0-U06-V01` usa cinco clusters:

```text
comprehensionAndPurpose
functionalUseAndProduction
oralComprehension
adequacyVariationAndRepair
oralProductionPractice
```

A verificação é não compensável. Sem `V01-Q12`, os demais resultados não concluem o percurso. Com a prática oral registrada, o percurso pode ser concluído mantendo `oralProductionPractice=VALIDACAO_PENDENTE`, sem alegar oralidade validada.

## Renderer e linguagem pública

Durante a validação foram encontrados e corrigidos problemas reais antes da homologação:

1. um binder de transcrição possuía chamada recursiva indevida; a ligação passou a ocorrer uma única vez no `bindClassicRenderer`;
2. `REQUIRED INTENT` vazava na L10;
3. `MEANING` e `selfCheck` autorais duplicavam/contaminavam a apresentação da V01;
4. instrução de ensaio oral aparecia duas vezes.

A camada pública agora oculta esses metadados e mantém apenas os componentes destinados ao aluno.

O renderer canônico cobre neste ponto:

```text
68 lições
+ 7 verificações
→ sem interação unsupported no slice publicado
```

## Evidência executável

### `scripts/audit-p7-n0-u06.mjs`

Audita as 10 lições + V01 e protege audio-first, replay sem penalidade, produções abertas, ensaio oral, antiestigma, ausência de vazamento técnico e blockers de mídia.

### `scripts/test-p7-u06-communication.mjs`

Prova comportamento de progresso e autoridade de avaliação, incluindo V01 não compensável, `VALIDACAO_PENDENTE` e regressão contra recursão no binder de transcrição.

### `scripts/capture-p7-u06-visuals.sh`

Cobre unidade desktop/mobile, L06 audio-first desktop/mobile, L10 com reformulação + ensaio oral e V01 oral desktop/mobile. Também rejeita metadados internos na camada pública.

## Validação final

CI final limpa:

```text
run 32428092201
→ contratos/catálogo/descoberta verdes
→ U03/U04/U05 preservadas
→ audit U06 verde
→ semântica comunicativa U06 verde
→ ProgressService/Gist/sync verdes
→ renderer verde
→ smoke clássico/P6/U03/U04/U05/U06 verde
→ artefato visual U06 gerado
```

A inspeção visual final confirmou:

- unidade legível em desktop e mobile;
- transcrição não aparece antes da tentativa;
- ensaio oral é explicado sem falsa autoridade de avaliação;
- L10 não expõe `REQUIRED INTENT`;
- V01 não expõe `MEANING` nem duplica autochecagem/instrução;
- navegação mobile permanece íntegra.

## Resultado

**N0-U06 está HOMOLOGADA e publicável no Modo Clássico.**

Com U1→U6 cobertas, a expansão P7 segue para **N1-U01 — Lendo textos com mais autonomia**, começando novamente por inventário executável antes de manifestar/publicar.
