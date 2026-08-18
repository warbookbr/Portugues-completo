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
Marco transversal ativo: T1 — Fundamentos claros e experiência de lição
Plano: docs/plano-fundamentos-claros.md
Skill: .ChatGPT/skills/fundamentos-claros/SKILL.md
Subfase ativa: T1.9 — migração, catálogo, progresso e mídia
Contrato/matriz de migração: CONGELADO / VALIDADO EM CI
P6 — Feedback por IA: AGUARDANDO T1
Próximo passo exato: integrar o mapper T1.9 ao carregamento local e ao progresso vindo do Gist, com backup explícito do JSON pré-T1 e baseline remota já migrada; somente depois promover staging e trocar catálogo/manifests/deep links de N0-U01/N0-U02
Blocker global: nenhum
Gate final do Clássico: NÃO SATISFEITO
```

Enquanto T1 estiver ativo, não iniciar P6 materialmente. O T1 foi autorizado como uma unidade de trabalho completa e pode usar múltiplas PRs sem nova autorização entre subfases previstas.

## Marcos do produto

| Marco | Estado | Evidência principal |
|---|---|---|
| P1 — Schemas/contratos | `HOMOLOGADO` | PR #105 |
| P2 — ContentService/normalizador | `HOMOLOGADO` | PR #106 |
| P3 — Manifests/catálogo inicial | `HOMOLOGADO` | PR #107 |
| P4 — Renderer real do Clássico | `HOMOLOGADO` | PR #108 |
| P5 — Progresso/revisão/Gist | `HOMOLOGADO` | PR #109 |
| T1 — Fundamentos claros | `ATIVO` | PRs #116–#127; T1.9 ativo |
| P6 — Feedback por IA | `AGUARDANDO T1` | — |
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
T1.9 migração/catálogo/progresso/mídia                     ← ativo
  contrato + mapper de progresso                           ✓ validado em CI
  wiring local/Gist + backup                               ← próximo
  promoção staged + catálogo/manifests/deep links
  reconciliação de mídia
T1.10 validação/homologação
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

**Estado: ATIVO.**

### Gate 1 — contrato e mapper de progresso

**Estado: CONCLUÍDO / VALIDADO EM CI.**

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

A implementação ainda **não está ativa no app/Gist** e nenhum arquivo staged foi promovido. Isso é intencional: o próximo lote integra backup/carregamento/sync primeiro, mantendo o catálogo histórico até esse gate ficar verde.

Evidência de integração: PR #127.

## Estado de publicação do slice

### N0-U01 / N0-U02

```text
Renderer/progresso atual: base técnica homologada
Autoria T1 nova: STAGED / VALIDADA
Experiência de abertura/retomada T1.7: HOMOLOGADA
Navegação secundária T1.8: HOMOLOGADA
Migração T1.9: CONTRATO/MAPPER VALIDADO, AINDA NÃO ATIVO
Manifestos públicos: ainda históricos
Mídia obrigatória histórica/reutilizada: pendente, reconciliar T1.9
Publicação das novas U1/U2: NÃO ATIVADA até wiring + promoção coerente
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
Global antes de P6: concluir T1
Imediato T1.9: backup explícito + wiring do mapper no cache local e no Gist/sync
Depois T1.9: promoção staged + catálogo/manifests/deep links + reconciliação de mídia
Depois: T1.10 — validação/homologação transversal
```

## Gate `CLÁSSICO HOMOLOGADO`

Somente P9 pode satisfazer o gate final. Nenhuma implementação de XP, missões, conquistas ou streak começa antes dele.
