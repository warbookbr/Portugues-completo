# Homologação P7 — N0-U04

## Estado

```text
P7 / lote N0-U04: HOMOLOGADO
Unidade: N0-U04 — Lendo e compreendendo pequenos textos
Manifesto: READY
Mídia humana obrigatória: nenhuma
Próximo lote: N0-U05 — Escrevendo e organizando mensagens
```

Este registro fecha o segundo lote incremental do P7. O marco P7 continua **ATIVO** até que o catálogo cubra o percurso N0→N4.

## Escopo homologado

Foram incorporados ao pipeline Clássico:

- `content/units/004-lendo-compreendendo-pequenos-textos/unit.json`;
- 9 lições autorais `N0-U04-L01` → `N0-U04-L09`;
- `N0-U04-V01` como verificação integrada;
- 9 competências estáveis `N0-U04-C01` → `N0-U04-C09`;
- pré-requisito `N0-U03-V01`;
- descoberta pelo `ContentService` via `content/course.json`;
- renderer/progresso para as interações reais da unidade;
- publicação `READY`, sem blocker de mídia humana.

A unidade foi mantida como autoria histórica v1. O lote amplia adapter/runtime quando necessário, em vez de reescrever os 10 documentos autorais para caber em uma interface estreita.

## Capacidades novas incorporadas ao runtime

### Seleção de evidência textual

A U04 exige que a compreensão não seja demonstrada apenas por escolher a alternativa correta: em vários itens o aluno precisa voltar ao texto e indicar a evidência que sustenta a resposta.

O adapter passa a:

```text
texto já visível ao aluno
→ segmentar em trechos selecionáveis
→ guardar somente índices corretos no answerKey
→ renderer mostra trechos, não o gabarito
→ avaliador exige a evidência conforme ALL/ANY
```

Isso cobre evidência única, múltipla e evidência dentro de itens compostos sem duplicar respostas no conteúdo público.

Uma alternativa correta acompanhada de evidência incorreta não é promovida como demonstração válida quando a autoria exige retorno ao texto.

### Ordenação por `cards + correctOrder`

Padrões históricos de ordenação são normalizados para `SEQUENCE` canônico:

```text
cards
+ correctOrder
→ availableTiles
+ correctSequence
→ interação determinística compartilhada
```

A ordem usa os próprios valores autorais, não índices posicionais frágeis.

### Regras agregadas de conclusão

A autoria da U04 possui regras que não podem ser achatadas para `tudo obrigatório` nem para simples porcentagem.

O contrato legado explícito preserva, quando aplicável:

- mínimos entre várias evidências;
- pelo menos uma evidência dentro de um subconjunto;
- contagem agregada de acertos entre atividades;
- item/grupo obrigatório separado;
- clusters não compensáveis.

Exemplo importante da L04:

```text
integration
→ 2 de 3 evidências
→ incluindo ao menos uma evidência de múltiplos trechos

relationDiscipline
→ A02 obrigatório
```

Por isso `C01 + A01` não conclui a lição, enquanto combinações válidas que incluem A02 podem concluir sem exigir os três itens.

A V01 preserva seis agrupamentos independentes:

```text
globalComprehension
explicitAndIntegration
reference
sequenceAndRelations
inferenceDiscipline
rereadingAndRevision
```

## Evidência executável

O gate permanente `scripts/test-p7-u04-evidence.mjs` testa comportamento, não apenas existência de campos.

Ele prova, entre outros casos:

- resposta principal correta + evidência errada ≠ resposta correta completa;
- múltiplos trechos obrigatórios precisam ser selecionados conjuntamente;
- evidência aceitável alternativa segue regra `ANY` quando autorada;
- `correctOrder` é avaliado de forma determinística;
- regras 1-de-2 / 2-de-3 e requisitos separados afetam realmente o status no `ProgressService`;
- `clusterStates` é observado apenas em verificações, enquanto lições persistem seu estado público `EM_ESTUDO` / `CONCLUIDA`.

## Renderer e linguagem pública

O audit inicial encontrou 21 incompatibilidades, agrupadas em três capacidades reutilizáveis: evidência textual, ordenação e regras agregadas. Após a adaptação, as 9 lições + V01 normalizam sem `Interação ainda não suportada`.

Inventário final observado pelo audit:

```text
COMPOSITE = 6
SEQUENCE = 3
SINGLE_CHOICE = 34
requisitos explícitos de evidência textual = 17
controlledAudio obrigatório = 0
images obrigatórias = 0
video obrigatório = 0
```

A primeira inspeção visual detectou antes da homologação rótulos autorais crus em inglês, como:

```text
WRONG CONCLUSION
QUESTION
ORDERED EVENTS
CARDS
TEXT REF
COMPETENCY
```

Também detectou que a abertura da V01 exibia o `objective` técnico de professor (`Verificar se o aluno...`) como copy pública.

A correção final:

- traduz campos pedagógicos legítimos (`Pergunta`, `Conclusão incorreta`, `Ordem dos acontecimentos`, etc.);
- oculta campos editoriais/técnicos que não pertencem à experiência do aluno;
- usa abertura pública neutra para verificações quando não existe copy autorada específica;
- mantém o `objective` técnico internamente;
- adiciona proteção no renderer test e no smoke visual contra regressão desses vazamentos.

A inspeção mobile também revelou que o cabeçalho compartilhado deixava destinos finais do menu parcialmente fora da primeira área visível em 390 px. O shell foi compactado de modo responsivo: o desktop mantém `Plano de estudos`, enquanto o mobile usa o rótulo visual `Plano` com `aria-label="Plano de estudos"`, preservando todos os destinos sem esconder seções.

## Mídia

A U04 não possui nova dependência de mídia humana obrigatória:

```text
controlledAudio = 0
images obrigatórias = 0
video obrigatório = 0
TTS = apoio de acesso quando previsto
```

Portanto, blockers históricos de mídia de U1/U2 não se propagam artificialmente para este lote.

## Catálogo e regressões

Após a publicação da U04:

```text
N0-U01
N0-U02
N0-U03
N0-U04
N4-U09
```

estão presentes no slice real do catálogo.

O gate canônico do renderer cobre:

```text
48 lições
+ 5 verificações
→ sem unsupported
```

U1/U2, U03, N4-U09, P6, T1, progresso local/Gist e sincronização permanecem como regressões obrigatórias.

## Validação executável

Gates permanentes relevantes:

- `scripts/audit-p7-n0-u04.mjs`;
- `scripts/test-p7-u04-evidence.mjs`;
- `scripts/test-content-catalog.mjs`;
- `scripts/test-classic-renderer.mjs`;
- `scripts/capture-p7-u04-visuals.sh`;
- regressões P1–P6, T1, U03, progresso, Gist e smoke clássico.

CI de validação do lote, incluindo correções de linguagem pública e responsividade mobile:

```text
run 32283234078
→ estrutura/JSON/schemas: verde
→ catálogo/descoberta: verde
→ T1/P6: verde
→ audit N0-U03/U04: verde
→ semântica de evidência U03/U04: verde
→ progresso/Gist/sync: verde
→ renderer: verde
→ smokes clássico/P6/U03/U04: verde
```

## Inspeção visual

Artefato: `p7-n0-u04-visual-smoke`.

Foram inspecionados manualmente:

1. unidade N0-U04 — desktop;
2. unidade N0-U04 — mobile;
3. L04 — seleção de múltiplas evidências — desktop;
4. L04 — seleção de múltiplas evidências — mobile;
5. L06 — ordenação por fichas — desktop;
6. V01 — resposta + seleção de evidência — desktop.

A inspeção ocorreu em ciclos: o primeiro ciclo encontrou os vazamentos de linguagem pública; o segundo confirmou a correção; o último ciclo validou também o ajuste responsivo do cabeçalho mobile.

Resultado final: **APROVADO**.

## Condição de saída do lote

```text
9 lições normalizam
+ V01 normaliza
+ evidência textual faz parte real da avaliação quando exigida
+ ordenação histórica vira SEQUENCE determinístico
+ regras agregadas preservadas
+ manifesto READY
+ catálogo descobre U04
+ renderer cobre interações reais
+ nenhuma mídia humana obrigatória
+ linguagem pública revisada
+ mobile revisado
+ CI e inspeção visual aprovadas
```

**Condição satisfeita.**

## Próximo passo

P7 permanece ativo. O próximo lote incremental é:

```text
N0-U05 — Escrevendo e organizando mensagens
→ 10 lições + N0-U05-V01
→ inventariar autoria/verificação antes de manifestar
→ auditar produção aberta, revisão, convenções gráficas e qualquer novo contrato de evidência
→ adaptar somente capacidades reutilizáveis necessárias
→ preservar produção própria/revisão sem autoridade automática indevida
→ manifestar/publicar
→ validar progresso/renderer/linguagem pública
→ homologar o lote
```
