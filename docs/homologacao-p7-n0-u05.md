# Homologação P7 — N0-U05

## Estado

```text
P7 / lote N0-U05: HOMOLOGADO
Unidade: N0-U05 — Escrevendo e organizando mensagens
Manifesto: READY
Mídia humana obrigatória: nenhuma
Próximo lote: N0-U06 — Usando a língua no cotidiano
```

Este registro fecha o terceiro lote incremental do P7. O marco P7 continua **ATIVO** até que o catálogo cubra o percurso N0→N4.

## Escopo homologado

Foram incorporados ao pipeline Clássico:

- `content/units/005-escrevendo-organizando-mensagens/unit.json`;
- 10 lições autorais `N0-U05-L01` → `N0-U05-L10`;
- `N0-U05-V01` como verificação integrada;
- 10 competências estáveis `N0-U05-C01` → `N0-U05-C10`;
- pré-requisito `N0-U04-V01`;
- descoberta pelo `ContentService` via `content/course.json`;
- renderer/progresso para produção aberta, planejamento, apoio opcional, revisão e edições controladas;
- publicação `READY`, sem blocker de mídia humana.

A autoria histórica v1 foi preservada. O lote ampliou adapter/runtime por capacidades reutilizáveis em vez de reescrever as 11 fontes para caber em uma interface mais estreita.

## Auditoria inicial

O gate `scripts/audit-p7-n0-u05.mjs` encontrou inicialmente 21 incompatibilidades. Elas se concentravam em poucas capacidades estruturais:

1. planejamento com múltiplas informações essenciais;
2. produção própria em campo livre + autochecagem + apoio opcional;
3. edição textual controlada com alvo exato;
4. regras agregadas de conclusão e `VALIDACAO_PENDENTE`;
5. aliases históricos como `versions`;
6. múltiplas ordens aceitáveis.

A auditoria também congela uma fronteira pedagógica importante: **preencher o campo ou passar por autochecagem não autoriza o runtime a declarar correção linguística plena**.

## Produção própria e autoridade de avaliação

Produções autorais `free-text*` permanecem:

```text
RELIABLE_EVALUATOR
+ recordResponse=true
+ evidência VALIDACAO_PENDENTE
```

quando não existe avaliador confiável.

Isso vale especialmente para `N0-U05-V01/V01-Q08`: a produção própria é obrigatória e não compensável, mas não recebe promoção automática de domínio por heurística superficial.

A V01 pode concluir o **percurso autônomo** enquanto o cluster `ownProduction` permanece `VALIDACAO_PENDENTE`. Assim:

```text
concluir percurso
≠ validar automaticamente qualidade linguística da produção
```

A resposta aberta é persistida para revisão confiável posterior.

## Planejamento e autochecagem

### Seleção de informações essenciais

Padrões autorais de planejamento passam a uma múltipla escolha real:

```text
informationCards
+ correctEssentialIndexes / correctIndexes
→ options
+ MULTIPLE_CHOICE
+ answerKey.correctIndexes
```

O conjunto precisa preservar todas as informações essenciais; omitir uma informação obrigatória não é aceito como planejamento equivalente.

### Checklist antes da produção

`essentialInformation` é materializado em `planningChecklist` e exibido por um componente público próprio. A interface não duplica os campos autorais crus `planningPrompt` / `essentialInformation`.

### Autochecagem

Autochecagens autoradas são preservadas. Quando a autoria marca `selfReviewRequired` sem perguntas próprias suficientes, o runtime fornece uma autochecagem pública mínima e neutra, sem fingir correção automática.

## Apoio opcional sem penalidade

A L02 possui apoio opcional que não deve ditar a resposta nem contar como erro.

O renderer o apresenta fechado:

```text
Ver apoio opcional
→ início sugerido / palavras de apoio
```

O `classic-progress-binding` registra a abertura separadamente como:

```text
support.hintUsed = true
```

sem converter uso de apoio em erro.

A regra autoral da L02 foi explicitada no progresso:

```text
as duas produções são obrigatórias
+ pelo menos uma produção precisa ocorrer sem abrir o apoio opcional
```

via critério reutilizável `MIN_EVIDENCE_WITHOUT_HINT`.

Modelos marcados `modelExamplesAfterSubmission` ficam fora do DOM inicial e aparecem somente depois da primeira submissão.

## Edição textual controlada

Alguns exercícios não são produção aberta: o aluno deve editar exatamente um exemplo autorado.

Foram mapeadas as interações:

- `insert-spaces`;
- `edit-capitalization-and-boundary`;
- `edit-controlled-text`;
- `insert-commas`.

Quando existe `expected` explícito, o runtime pode usar correção determinística exata:

```text
alvo autorado conhecido
→ SHORT_TEXT / COMPOSITE
→ DETERMINISTIC
→ comparação textual controlada
```

Isso não é reaproveitado para julgar produção própria livre.

Casos com edição + princípio conceitual, como `V01-Q10`, viram atividade composta: **editar corretamente não compensa escolher o princípio errado**.

## Ordenação com múltiplas respostas válidas

`cards + acceptableOrders` é normalizado como:

```text
availableTiles
+ acceptedSequences
→ SEQUENCE determinístico
```

Todas as sequências explicitamente autorizadas pela autoria são aceitas; uma ordem arbitrária não é aceita só por usar os mesmos cartões.

## Regras de conclusão

A U05 explicita no adapter legado regras que antes existiam apenas em prosa autoral.

Casos relevantes:

- L02: produção própria pendente + pelo menos uma sem apoio;
- L03: organização objetiva + produção própria pendente;
- L04: reconhecimento de propósito + produção funcional pendente;
- L09: limiares e contagem agregada de pontuação básica;
- V01: cinco agrupamentos não compensáveis.

A V01 usa:

```text
planningAndPurpose
organizationAndSufficiency
revision
graphicConventions
ownProduction
```

`graphicConventions` registra explicitamente a exigência de 2/3 sinais em `V01-Q09`; `ownProduction` é `PENDING_ALLOWED`.

## Evidência executável

### `scripts/test-p7-u05-writing.mjs`

Prova comportamento, não apenas forma:

- planejamento multi-resposta preserva o conjunto correto;
- apoio opcional é rastreado separadamente e não vira erro;
- duas produções com apoio não satisfazem a regra de autonomia da L02;
- produção aberta permanece pending e é persistida;
- edição controlada exata é determinística;
- múltiplas ordens autorizadas são aceitas;
- edição + princípio exige ambos corretos;
- V01 pode ficar `CONCLUIDA` com `ownProduction=VALIDACAO_PENDENTE` sem inventar domínio.

### `scripts/test-p7-u05-public-ui.mjs`

Protege a camada pública:

- `before` → `Antes`;
- nenhum `before`/`after` cru;
- planejamento aparece uma única vez no componente correto;
- `planningPrompt` / `essentialInformation` não vazam nem duplicam a UI;
- verificação usa abertura pública segura.

## Renderer e linguagem pública

O gate canônico cobre agora:

```text
58 lições
+ 6 verificações
→ sem interação unsupported
```

Na primeira inspeção visual da U05 foram encontrados problemas reais antes da homologação:

- L08 exibia o rótulo autoral cru `BEFORE`;
- V01 duplicava o planejamento com `PLANNING PROMPT` e `ESSENTIAL INFORMATION`.

A primeira tentativa de correção pública foi ampla demais e removeu parte do suporte mais novo de evidência por subitem da U04. A regressão foi detectada pelo próprio gate `Audit P7 N0-U04` no run `32286957578`.

A correção foi refeita de forma conservadora:

1. restaurar exatamente o renderer anterior à regressão;
2. reaplicar somente mudanças mínimas da U05;
3. reexecutar U04 e U05 no mesmo workflow;
4. fortalecer o smoke U05 para falhar se `before`, `after`, `planning prompt` ou `essential information` voltarem à UI.

O workflow de reparo `32287196193` passou U04 + U05 antes de gravar o renderer reparado.

## Mídia

A unidade não introduz nova mídia humana obrigatória:

```text
controlledAudio obrigatório = 0
images obrigatórias = 0
video obrigatório = 0
TTS = apoio de acesso quando previsto
```

Portanto blockers de mídia de U1/U2 não se propagam para U05.

## Catálogo e regressões

Após a publicação da U05, o slice real do catálogo contém:

```text
N0-U01
N0-U02
N0-U03
N0-U04
N0-U05
N4-U09
```

Regressões obrigatórias continuam cobrindo:

- P1–P6;
- T1;
- U03;
- U04;
- progresso local/Gist/sync;
- renderer clássico;
- smokes Clássico/P6/U03/U04/U05.

## Validação final

CI canônica limpa do head reparado:

```text
run 32287331767
→ estrutura/JSON/schemas: verde
→ catálogo/descoberta: verde
→ T1/P6: verde
→ U03/U04: verde
→ audit U05: verde
→ semântica de escrita U05: verde
→ linguagem pública U05: verde
→ progresso/Gist/sync: verde
→ renderer 58 + 6: verde
→ smokes clássico/P6/U03/U04/U05: verde
→ uploads visuais: verde
```

## Inspeção visual

Artefato: `p7-n0-u05-visual-smoke` do run `32287331767`.

Foram inspecionados no ciclo final:

1. unidade N0-U05 — desktop;
2. unidade N0-U05 — mobile;
3. L02 — escrita aberta + apoio opcional + autochecagem — desktop;
4. L02 — mesma etapa — mobile;
5. L08 — edição controlada — desktop;
6. V01 — produção própria + planejamento + autochecagem — desktop.

Resultado final:

- apoio começa fechado;
- modelos pós-envio não aparecem antes da tentativa;
- L08 mostra `Antes`, não `BEFORE`;
- planejamento da V01 aparece uma única vez;
- nenhuma chave autoral/técnica relevante é exibida;
- menu mobile mantém todos os destinos visíveis;
- hierarquia, legibilidade e controles permanecem coerentes.

Resultado: **APROVADO**.

## Condição de saída do lote

```text
10 lições normalizam
+ V01 normaliza
+ produção própria permanece pending sem autoridade automática falsa
+ apoio opcional é rastreado separadamente
+ planejamento/autochecagem preservados
+ edições controladas têm fronteira determinística explícita
+ múltiplas ordens válidas preservadas
+ regras agregadas explicitadas
+ manifesto READY
+ catálogo descobre U05
+ renderer cobre o lote sem regredir U04
+ linguagem pública revisada
+ nenhuma mídia humana obrigatória
+ CI + inspeção visual aprovadas
```

**Condição satisfeita.**

## Próximo passo

P7 permanece ativo. O próximo lote incremental é:

```text
N0-U06 — Usando a língua no cotidiano
→ inventariar autoria e N0-U06-V01 antes de manifestar
→ auditar interlocutor/finalidade, pergunta/resposta, pedidos/orientações e compreensão oral
→ preservar adequação formal/informal sem estigmatizar variação linguística
→ não tratar sotaque, variedade ou informalidade como erro por princípio
→ adaptar somente capacidades reutilizáveis necessárias
→ registrar mídia/blockers locais
→ manifestar/publicar
→ validar progresso/renderer/linguagem pública
→ homologar o lote
```
