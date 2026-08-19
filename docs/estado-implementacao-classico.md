# Estado de implementação do Modo Clássico

## Função

Registro operacional canônico do Modo Clássico. `docs/roadmap-produto.md` define a sequência macro; este arquivo define o **cursor exato**.

Regra permanente:

```text
implementado tecnicamente
≠ homologado
≠ publicável
```

## Cursor operacional

```text
Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco transversal T1 — Fundamentos claros e experiência de lição: HOMOLOGADO
Homologação: docs/homologacao-t1-10.md
Migração T1 `t1-n0-entry-v2`: ATIVA / HOMOLOGADA local + Gist
P6 — Feedback por IA: ATIVO
Subfase P6.1 — núcleo neutro + transporte seguro: HOMOLOGADO (PR #131)
Subfase ativa: P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual
Próximo passo exato: ligar AiFeedbackService à UI com consentimento explícito, configurar companion/model/token efêmero, habilitar uma atividade aberta piloto em N4-U09 e provar sucesso/falha sem alterar `VALIDACAO_PENDENTE`
Blocker global: nenhum
Gate final do Clássico: NÃO SATISFEITO
```

T1 foi homologado em T1.10. As regras duradouras permanecem nas fontes/skills canônicas; P6 pode avançar materialmente sem reabrir T1, salvo nova evidência concreta de regressão.

## Marcos do produto

| Marco | Estado | Evidência principal |
|---|---|---|
| P1 — Schemas/contratos | `HOMOLOGADO` | PR #105 |
| P2 — ContentService/normalizador | `HOMOLOGADO` | PR #106 |
| P3 — Manifests/catálogo inicial | `HOMOLOGADO` | PR #107 |
| P4 — Renderer real do Clássico | `HOMOLOGADO` | PR #108 |
| P5 — Progresso/revisão/Gist | `HOMOLOGADO` | PR #109 |
| T1 — Fundamentos claros | `HOMOLOGADO` | PRs #116–#130; `docs/homologacao-t1-10.md` |
| P6 — Feedback por IA | `ATIVO` | P6.1 núcleo/transporte homologado na PR #131; P6.2 ativo |
| P7 — Catálogo N0→N4 | `NAO_INICIADO` | — |
| P8 — Mídia/publicação | `NAO_INICIADO` | — |
| P9 — E2E / Clássico homologado | `NAO_INICIADO` | — |

## Base homologada P1–P5

A base técnica já prova:

```text
catálogo/manifests
→ ContentService/normalização
→ renderer/atividades
→ evidência/progresso/revisão
→ cache local
→ sync Gist/conflitos
```

O `ProgressService` mantém separadas:

```text
percurso curricular
≠ evidência/domínio
≠ gamificação
```

O Clássico não possui XP oculto, lives ou punição por erro. Persistência local/Gist, respostas abertas, merge de três vias e falha remota sem perda foram homologados em P5.

## UX homologada antes de T1

### Home

- navegação superior única;
- sem sidebar duplicada;
- sem hero/banner grande;
- `Continue estudando / Comece por aqui` concentra o CTA principal;
- métricas derivadas de dados reais;
- card de progresso validado também em largura intermediária;
- `Ajuda` como utilitário discreto.

### Fluxo de lição

Base técnica homologada:

- uma etapa principal por vez;
- `← Voltar para a unidade` no lugar do breadcrumb longo;
- `Voltar` / `Avançar` sem gate artificial;
- respostas preservadas entre etapas;
- rótulos técnicos redundantes removidos;
- movimento respeita `prefers-reduced-motion`.

T1 acrescenta a tela inicial exclusiva da lição, nova linguagem pública e nova progressão inicial N0.

# T1 — Fundamentos claros e experiência de lição

```text
T1.0 baseline/ativação                                      ✓
T1.1 pesquisa + auditoria                                  ✓
T1.2 redimensionamento curricular N0                       ✓
T1.3 contrato de linguagem                                 ✓
T1.4 skills/fontes canônicas                               ✓
T1.5 contrato técnico de abertura                          ✓
T1.6 nova autoria inicial                                  ✓ staged + validada
  lote U1 — Letras e primeiros sons                        ✓
  lote U2 — Sílabas e primeiras palavras                   ✓
T1.7 frontend de intro/fluxo                               ✓ homologado
T1.8 metodologia em Ajuda                                  ✓ homologado
T1.9 migração/catálogo/progresso/mídia                     ✓ homologado
  contrato + mapper de progresso                           ✓
  wiring local/Gist + backup                               ✓ ativo
  promoção + ativação + catálogo/manifests                 ✓
  deep-link aliases + reconciliação de mídia               ✓
T1.10 validação/homologação                                ✓ homologado
```

## T1.1–T1.5 — decisões consolidadas

Fontes:

- auditoria: `docs/auditoria-t1-1-porta-entrada-n0.md`;
- arquitetura: `docs/redimensionamento-t1-2-n0.md`;
- linguagem: `docs/linguagem-aluno.md`;
- contrato técnico: `app/js/services/content-presentation-normalizer-v1.js` + `ContentService`.

Regras vigentes:

```text
fala/escrita não abre mais o curso
letras + consciência sonora aparecem cedo e articuladas
não exigir domínio perfeito A–Z antes de sons/sílabas
sílabas entram cedo na U2
variação letra↔som vem depois de experiências concretas

objetivo técnico ≠ objetivo público
clara + completa + simples
concreto → exemplo → conceito → prática → ampliação
```

A autoria v1 pode declarar `studentObjective`. O runtime produz `presentation.intro`; conteúdo legado sem copy pública recebe fallback neutro e **nunca** o `objective` técnico.

## T1.6 — nova autoria inicial

**Estado: CONCLUÍDO / VALIDADO EM STAGING.**

### Estratégia de staging

A nova autoria **não é colocada nos caminhos publicados antes da migração de T1.9**.

Motivo: o catálogo/manifests atuais ainda representam a ordem histórica. Alterar os arquivos vivos antes da troca do manifesto faria o Pages carregar conteúdo novo numa ordem antiga e pedagogicamente incoerente.

Regra:

```text
T1.6 autoria nova
→ content/staging/t1/
→ validação própria no CI
→ não descoberta pelo catálogo público

T1.9
→ migração de IDs/progresso/mídia
→ manifesto/catalog novos
→ promoção staged → caminhos publicados
→ troca coerente/atômica
```

Não enfraquecer `validate-catalog.mjs` para acomodar conteúdo intermediário.

### Lote U1 — Letras e primeiros sons

**Estado: CONCLUÍDO / VALIDADO EM STAGING.**

Local:

```text
content/staging/t1/n0-u01/
```

Nova ordem autorada:

```text
1. N0-U01-L03 — Letras e alfabeto
2. N0-U01-L04 — Maiúsculas e minúsculas
3. N0-U01-L05 — Vogais e consoantes
4. N0-U01-L09 — Letras, números e outros sinais
5. N0-U01-L06 — Como a escrita se organiza
6. N0-U01-L02 — Ouvindo sons nas palavras
7. N0-U01-L07 — Nome da letra e som: coisas diferentes
→ N0-U01-V02 — Verificação: Letras e primeiros sons
```

Decisões de autoria:

- as sete lições possuem `studentObjective` próprio;
- `N0-U01-L03` começa explicitamente por **o que é uma letra** e não possui pré-requisito;
- `N0-U01-L05` foi reduzida ao núcleo vogais/consoantes;
- o segundo núcleo da antiga L05 ganhou novo `N0-U01-L09`;
- `N0-U01-L06` define `espaço` perto do primeiro uso;
- `N0-U01-L02` foi reposicionada depois da base de letras;
- `N0-U01-L07` encerra U1 sem antecipar a variação complexa da U2;
- antigas `N0-U01-L01` e `N0-U01-L08` permanecem fontes legadas para reaproveitamento na U2.

### Verificação U1 V02

A `N0-U01-V02` cobre quatro agrupamentos obrigatórios e não compensáveis:

```text
alphabetAndForms
letterCategories
visualOrganization
soundAndLetter
```

Deliberadamente não cobra:

- síntese fala × escrita;
- variação ampla letra↔som;
- sílabas ou leitura sistemática de palavras.

Não cria novas mídias humanas: reutiliza `mediaId`s já reservados quando semanticamente adequados.

### Lote U2 — Sílabas e primeiras palavras

**Estado: CONCLUÍDO / VALIDADO EM STAGING.**

Local:

```text
content/staging/t1/n0-u02/
```

Nova ordem autorada/materializável:

```text
1. N0-U02-L01 — O que é uma sílaba?
2. N0-U02-L02 — Separando e juntando sílabas
3. N0-U02-L03 — Da sílaba ouvida à escrita
4. N0-U02-L04 — Sílabas no começo e no fim
5. N0-U02-L05 — Sílabas podem ter formas diferentes
6. N0-U02-L06 — Montando palavras
7. N0-U02-L07 — Lendo por partes e depois a palavra inteira
8. N0-U02-L08 — Palavra e significado
9. N0-U02-L09 — Letras e sons podem variar
10. N0-U02-L10 — Falar e escrever: duas formas de comunicar
→ N0-U02-V02 — Verificação: Sílabas e primeiras palavras
```

Decisões de autoria/materialização:

- as dez lições recebem `studentObjective` próprio;
- L01–L08 preservam o núcleo pedagógico silábico histórico que continuava válido;
- critérios históricos de conclusão são registrados explicitamente no overlay de autoria, sem inferência a partir de frases;
- o materializador adapta interações/gabaritos históricos ao contrato canônico de runtime sem reescrever a autoria fonte;
- blocos demonstrativos não são promovidos falsamente a atividades apenas por conterem metadados internos;
- L09 reaproveita a responsabilidade de variação letra↔som somente depois da base de sílabas/palavras;
- L10 fecha a unidade com fala × escrita como síntese concreta, não como abstração inaugural;
- V02 preserva a evidência silábica válida da verificação histórica e acrescenta apenas relações som-escrita e fala-escrita;
- staging permanece fora do catálogo público até T1.9.

### Verificação U2 V02

A `N0-U02-V02` possui 12 tarefas e cinco agrupamentos obrigatórios/não compensáveis:

```text
syllableAwareness
syllableWriting
wordReadingAndMeaning
soundWritingRelations
speechAndWriting
```

Mídia humana nova não foi criada: os novos núcleos reutilizam `mediaId`s já reservados quando o estímulo precisa ser controlado; TTS continua restrito aos casos em que a realização específica do som não determina a resposta.

### Validação staged

Teste:

```text
scripts/test-t1-content-authoring.mjs
```

CI executa `Test T1 staged authoring` sem misturar o conteúdo staged ao catálogo de produção.

Provas consolidadas de T1.6:

- U1: 7/7 lições com `studentObjective` autoral + V02;
- U2: 10/10 lições com objetivo público materializado + V02;
- `presentation.introSource = AUTHORED` nas lições staged;
- objetivo público separado do objetivo técnico;
- primeira lição do curso sem pré-requisito e com definição explícita de letra;
- U2 constrói sílaba antes de reutilizar o termo como pressuposto;
- L09/L10 entram somente depois da base concreta prevista na nova arquitetura;
- conclusão e evidência estruturadas para materialização;
- interações staged normalizáveis para o runtime atual;
- V01 histórica não vaza como identidade de evidência para V02;
- `validate-catalog` continua verde porque o conteúdo publicado permanece intacto;
- renderer/progresso/smoke visual atuais continuam protegidos pelo CI.

## T1.7 — frontend de abertura e retomada da lição

**Estado: CONCLUÍDO / HOMOLOGADO.**

Implementação principal:

```text
primeiro acesso
→ ← Voltar para a unidade
→ Lição
→ título
→ runtime.presentation.intro
→ Começar lição
→ stepper/conteúdo/conclusão ocultos

lição já iniciada
→ intro dispensada
→ etapa visual segura restaurada
→ conteúdo/evidência continuam governados pelo runtime e ProgressService
```

Decisões técnicas:

- `classic-presentation.js` substitui a fala pública da hero pelo `presentation.intro`; ausência de copy pública não faz o `objective` técnico reaparecer;
- `classic-lesson-flow.js` mantém `começou + etapa visual` em `localStorage` próprio (`lesson-ui:v1`), separado do progresso acadêmico;
- clicar em `Começar lição` **não** cria evidência, domínio nem conclusão;
- histórico pedagógico P5 já existente (`curriculum.lessons`, evidência ou resposta registrada) conta como sinal seguro de retomada para não obrigar alunos antigos a rever a intro;
- `curriculum.current.lessonId` isolado não conta como histórico, porque apenas abrir a rota já atualiza essa posição;
- o antigo step de sessão continua utilizável como fallback de posição somente quando já há sinal seguro de início;
- verificações de unidade continuam entrando diretamente no fluxo avaliativo; T1.7 não cria gate visual novo para verificação;
- foco vai para o título da intro/etapa e o movimento continua respeitando `prefers-reduced-motion`;
- nenhuma mídia nova é necessária para T1.7.

Validação/homologação:

- CI funcional verde para contratos, normalização, autoria T1, catálogo, progresso, Gist e renderer;
- smoke DOM prova intro visível + `lesson-stream` oculto no primeiro acesso;
- smoke DOM prova intro oculta + fluxo restaurado em retomada seedada sem alterar progresso acadêmico;
- capturas inspecionadas em 1440px, 900px, 680px e 390px;
- N0 validado em intro, retomada e etapa com atividade determinística;
- N4 validado em etapa de produção aberta/pending;
- ação principal permanece visível no celular e não há overflow do conteúdo da lição;
- a navegação global em largura móvel mantém o comportamento horizontal rolável já existente e não constitui blocker de T1.7.

Evidência de integração: PR #125.

## T1.8 — metodologia em Ajuda

**Estado: CONCLUÍDO / HOMOLOGADO.**

Mudança aplicada:

```text
shell global
→ remove rodapé persistente “Metodologia do curso”

Ajuda
→ adiciona “Como o curso funciona”
→ aponta para #/metodologia

#/metodologia
→ deep link preservado
→ retorno explícito para Ajuda
```

Guard rails preservados:

- nenhum item novo foi criado na navegação principal;
- Ajuda continua uma grade curta de caminhos, sem virar página institucional carregada;
- metodologia permanece encontrável em poucos passos;
- home, unidade e lição deixam de carregar informação institucional persistente;
- nenhuma alteração de currículo, progresso, evidência, mídia ou rota histórica foi necessária.

Validação/homologação:

- smoke DOM prova ausência de `app-footer` e de link persistente para metodologia no caminho de estudo;
- smoke DOM prova `Como o curso funciona` + `#/metodologia` dentro de Ajuda;
- smoke DOM prova retorno `#/ajuda` na página de metodologia;
- CI completo permaneceu verde, incluindo todas as proteções de T1.7;
- Ajuda foi inspecionada em desktop e 390px; metodologia foi inspecionada em desktop;
- hierarquia, legibilidade e navegação permaneceram coerentes.

Evidência de integração: PR #126.

## T1.9 — migração, catálogo, progresso e mídia

**Estado: CONCLUÍDO / HOMOLOGADO.**

### Gate 1 — contrato e mapper de progresso

**Estado: CONCLUÍDO / HOMOLOGADO.**

Fontes:

- `docs/migracao-t1-9-n0.md` — matriz executável;
- `app/js/services/progress-migration-t1-n0.js` — mapper puro/idempotente;
- `scripts/test-progress-migration-t1.mjs` — cenários de migração no CI.

Decisões já provadas:

- revisão-alvo `t1-n0-entry-v2` é idempotente;
- revisão futura/desconhecida é recusada, nunca rebaixada;
- colisões de refs da antiga U1-L05 são arquivadas antes de receber novo significado;
- split L05→L05+L09 preserva somente evidência semanticamente suficiente;
- U1-L01→U2-L10 e U1-L08→U2-L09 transferem histórico/current sem contar duas lições;
- U1-V01 concluída pode satisfazer U1-V02 pela equivalência curricular congelada em T1.2;
- U2-V01 sozinha preserva apenas os clusters silábicos da V02; extensão letra↔som/fala↔escrita exige escopo histórico correspondente;
- targets já existentes não são sobrescritos por uma fonte histórica;
- reviews seguem nova identidade somente quando o `sourceEvidenceRef` justifica a mudança;
- competências reconstruídas por evidência herdada chegam no máximo a `DEMONSTRADA`; migração não inventa `CONSOLIDADA` por duplicar a mesma fonte em lição/verificação;
- todo resultado testado continua válido contra `progress.schema.json`.

Evidência de integração: PR #127.

### Gate 2 — backup, cache local e Gist/sync

**Estado: CONCLUÍDO / HOMOLOGADO / ATIVO EM PRODUÇÃO.**

Entregas:

- `SafeProgressStorage.backupItem()` preserva explicitamente o JSON válido pré-migração;
- `MigratingProgressStorage` migra o cache antes de ele virar estado ativo;
- revisão futura/desconhecida é quarentenada em backup em vez de rebaixada;
- `ProgressSyncService` pode normalizar local, baseline e remoto antes das comparações;
- baseline antiga é persistida novamente na revisão canônica;
- Gist pré-T1 é regravado na revisão nova mesmo quando o snapshot migrado é semanticamente igual;
- Gist de revisão futura falha fechado, sem alterar local/remoto;
- todos os testes antigos de P5 permanecem verdes.

Ativação final:

```text
catálogo/manifests T1
+ MigratingProgressStorage
+ mapper do ProgressSyncService
+ contentRevision=t1-n0-entry-v2
→ ativos no mesmo lote
```

A janela inválida “progresso novo + catálogo antigo” não existiu. Backup local, baseline e Gist são normalizados conservadoramente antes de virarem estado ativo.

Evidência de infraestrutura: PR #128. Evidência de ativação atômica: PR #129.

## T1.10 — validação e homologação

**Estado: CONCLUÍDO / HOMOLOGADO.**

Evidência: `docs/homologacao-t1-10.md` + PR #130.

Provas fechadas:

- 17/17 lições iniciais auditadas por ordem, pré-requisito e objetivo público;
- checkpoint N0 reexecutado e realinhado para `N0-U01-V02`/`N0-U02-V02`;
- transição N0→N1 revalidada;
- CI funcional completo verde, incluindo gate permanente `Test T1 homologation`;
- smoke e inspeção visual aprovados em desktop, ~900px, ~680px e 390px;
- ausência de IDs/metadados internos na interface protegida pelo smoke;
- blockers de mídia permanecem locais e explícitos.

## Estado de publicação do slice

### N0-U01 / N0-U02

```text
Renderer/progresso: HOMOLOGADOS
Autoria T1 U1/U2: PUBLICADA / HOMOLOGADA
Experiência de abertura/retomada T1.7: HOMOLOGADA
Navegação secundária T1.8: HOMOLOGADA
Migração T1.9 local/Gist: ATIVA / HOMOLOGADA
Manifestos públicos: V02 ATIVOS
Deep links históricos: ALIASES ATIVOS
Mídia obrigatória: blockers locais explícitos nos manifests/fila
Publicação pedagógica das interações dependentes de mídia: BLOQUEADA somente onde o estímulo obrigatório falta
```

### N4-U09

```text
Renderer/progresso/pending: HOMOLOGADOS
Abertura/retomada T1.7: HOMOLOGADA
Navegação secundária T1.8: HOMOLOGADA
Manifesto: READY
Nova mídia humana obrigatória: nenhuma
```

## Pendências abertas

```text
Global antes de P6: nenhum — T1 homologado
Ativo: P6 — Feedback por IA no Clássico
P6.1: HOMOLOGADO — AiFeedbackService neutro + companion OpenAI local + gates de segurança (PR #131)
Ativo P6.2: opt-in/configuração UI + piloto N4-U09 + feedback visual + smoke de sucesso/falha
Local: resolver mídia obrigatória de U1/U2 quando o marco de publicação exigir esses estímulos
Depois de P6: P7 — ampliação do catálogo N0→N4
```

## Gate `CLÁSSICO HOMOLOGADO`

Somente P9 pode satisfazer o gate final. Nenhuma implementação de XP, missões, conquistas ou streak começa antes dele.
