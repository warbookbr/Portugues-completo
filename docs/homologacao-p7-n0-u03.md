# Homologação P7 — N0-U03

## Estado

```text
P7 / lote N0-U03: HOMOLOGADO
Unidade: N0-U03 — Palavras, frases e sentido
Manifesto: READY
Mídia humana obrigatória: nenhuma
Próximo lote: N0-U04
```

Este registro fecha o primeiro lote incremental do P7. O marco P7 continua **ATIVO** até que o catálogo cubra o percurso N0→N4.

## Escopo homologado

A N0-U03 foi incorporada ao pipeline Clássico sem reescrever em massa a autoria histórica para satisfazer o renderer.

Foram homologados:

- `content/units/003-palavras-frases-sentido/unit.json`;
- 10 lições autorais `N0-U03-L01` → `N0-U03-L10`;
- `N0-U03-V01` como verificação integrada;
- 10 competências estáveis `N0-U03-C01` → `N0-U03-C10`;
- pré-requisito `N0-U02-V02`;
- descoberta pelo `ContentService` via `content/course.json`;
- renderer e progresso para as interações reais da unidade;
- produção aberta/autochecagem sem promoção automática de domínio;
- publicação da unidade como `READY`, sem blocker de mídia humana.

## Adaptação do legado ao runtime

A autoria da U03 é anterior ao contrato P2. As regras históricas de conclusão são semanticamente válidas, mas não possuíam `completionEvidence.clusters` estruturados.

A solução homologada foi adaptar o runtime, preservando a fonte autoral:

```text
autoria histórica válida
→ adapter explícito
→ runtime canônico
→ renderer/progresso

não:

autoria histórica
→ reescrita em massa para caber no renderer
```

`LEGACY_COMPLETION_RULES_V1` registra explicitamente as regras de L01–L10 e V01. Não há parsing heurístico de frases de `completionRule` para inferir domínio.

O adapter também passou a materializar padrões históricos reutilizáveis encontrados na U03, incluindo alternativas em `cases`, respostas múltiplas, sequências aceitas, funções/grupos semânticos, revisão em duas etapas e produções abertas.

## Avaliação determinística compartilhada

`app/js/ui/classic-deterministic-evaluator.js` tornou-se o avaliador determinístico compartilhado entre renderer e persistência.

O contrato cobre, conforme aplicável:

- escolha única e múltipla;
- classificação/associação;
- sequência/ordenação;
- composições com vários subitens;
- `correctIndex` / `correctIndexes`;
- respostas escalares históricas;
- sequências alternativas aceitas;
- transformação textual controlada;
- critérios adicionais como item obrigatório, grupo obrigatório e cobertura entre grupos.

Renderer e `classic-progress-binding` usam a mesma avaliação, evitando divergência entre o feedback mostrado e a evidência persistida.

## Evidência agregada da V01

A verificação histórica possui regras que atravessam subitens e atividades. Elas não foram reduzidas a um simples estado binário.

O progresso passou a preservar, quando aplicável:

```text
status
+ score
+ itemResults
```

Clusters podem declarar critérios agregados. A V01 preserva estruturalmente:

### Significado e contexto

```text
Q01 + Q02 + Q03
→ pelo menos 5 de 6 subitens corretos
→ os dois contextos de MANGA em Q03 são obrigatórios
```

### Construção e manipulação

```text
Q05 obrigatório
+ Q06/Q09 com pelo menos 3 de 4 subitens corretos
+ reconstrução obrigatória de Q09
```

### Mensagem e produção

```text
Q04 + Q07 + Q08 + Q10
→ desempenho fechado exigido
→ Q10 é produção aberta
→ VALIDACAO_PENDENTE permitida
→ percurso pode concluir sem transformar pending em domínio automático
```

O gate `scripts/test-p7-u03-evidence.mjs` prova os casos de borda, inclusive 4/6 ≠ 5/6, requisito obrigatório de Q09 e persistência de produção aberta.

## Renderer e linguagem pública

O audit da unidade encontrou e o lote passou a cobrir os tipos reais necessários sem estado `Interação ainda não suportada`.

Inventário observado no audit do lote:

```text
COMPOSITE       71
LONG_TEXT        4
MULTIPLE_CHOICE  1
SEQUENCE          2
SINGLE_CHOICE     6
```

A inspeção visual detectou antes da homologação um problema no fallback genérico: chaves autorais como `goal`, `firstDraft`, `questions` e `purpose` apareciam como rótulos crus em inglês.

A correção final:

- traduz campos pedagógicos legítimos para linguagem pública em português;
- oculta metadados editoriais que não pertencem à experiência do aluno;
- mantém o JSON autoral intacto;
- adiciona proteção no smoke contra retorno desses rótulos crus.

Exemplos públicos após a correção:

```text
Exemplo
Objetivo da mensagem
Primeira versão
Autochecagem
Versão revisada
Frase para revisar
Perguntas
```

## Mídia

O audit não encontrou dependência de mídia humana obrigatória neste lote:

```text
controlledAudio = 0
images obrigatórias = 0
video obrigatório = 0
```

TTS e UI semântica cobrem os apoios necessários. Portanto, a N0-U03 não deve ser bloqueada artificialmente pela fila de mídia de U1/U2.

## Validação executável

Gates permanentes relevantes:

- `scripts/audit-p7-n0-u03.mjs`;
- `scripts/test-p7-u03-evidence.mjs`;
- `scripts/test-content-catalog.mjs`;
- `scripts/test-classic-renderer.mjs`;
- `scripts/capture-p7-u03-visuals.sh`;
- regressões P1–P6, T1, progresso, Gist e smoke clássico.

CI definitiva da branch limpa:

```text
run 32269240210
→ estrutura: verde
→ JSON/schemas: verde
→ catálogo/descoberta: verde
→ T1: verde
→ P6: verde
→ audit N0-U03: verde
→ semântica de evidência N0-U03: verde
→ progresso/Gist: verde
→ renderer: verde
→ smoke clássico: verde
→ smoke P6: verde
→ smoke visual N0-U03: verde
```

## Inspeção visual

Artefato final do run `32269240210`: `p7-n0-u03-visual-smoke`.

Foram inspecionados manualmente:

1. unidade N0-U03 — desktop;
2. unidade N0-U03 — mobile;
3. L03 — pista progressiva — desktop;
4. L10 — produção/revisão/autochecagem — desktop;
5. L10 — produção/revisão/autochecagem — mobile;
6. V01 — produção aberta/autochecagem — desktop.

Resultado final: **APROVADO**. Não há overflow ou estado de erro relevante nas capturas, a hierarquia principal permanece legível e os rótulos autorais crus identificados na primeira inspeção foram removidos.

## Condição de saída do lote

```text
10 lições normalizam
+ V01 normaliza
+ regras históricas de conclusão preservadas
+ evidência agregada preservada
+ produção aberta continua pending quando necessário
+ manifesto READY
+ catálogo descobre U03
+ renderer cobre interações reais
+ nenhuma mídia humana obrigatória
+ linguagem pública revisada
+ CI e inspeção visual aprovadas
```

**Condição satisfeita.**

## Próximo passo

P7 permanece ativo. O próximo lote incremental é:

```text
N0-U04 — Lendo e compreendendo pequenos textos
→ inventariar autoria + verificação
→ auditar normalização/interações/mídia
→ adaptar somente contratos reutilizáveis necessários
→ manifestar/publicar
→ validar progresso/renderer
→ homologar o lote
```
