# Estado de implementação do Modo Clássico

## Objetivo

Registro operacional canônico do desenvolvimento do Modo Clássico. Uma nova instância deve conseguir descobrir sem contexto de conversa:

```text
onde paramos?
o que foi implementado e homologado?
o que continua parcial?
qual mídia/dependência ainda existe?
qual é o próximo passo exato?
```

`docs/roadmap-produto.md` define a ordem P1→P9 e os refinamentos transversais inseridos entre marcos. Este arquivo registra o estado concreto.

Regra central:

```text
implementado tecnicamente
≠ homologado
≠ publicável
```

## Cursor operacional

```text
Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco concluído mais recente: P5 — ProgressService, revisão e persistência
Marco transversal ativo: T1 — Fundamentos claros e experiência de lição
Plano ativo: docs/plano-fundamentos-claros.md
Skill ativa: .ChatGPT/skills/fundamentos-claros/SKILL.md
Subfases concluídas mais recentes: T1.3 — contrato de linguagem + T1.4 — skills/fontes canônicas
Subfase ativa: T1.5 — contrato técnico da abertura da lição
P6 — Feedback por IA: AGUARDANDO T1
Último item concluído: T1.4 + T1.3 + T1.2 + T1.1 + refinamentos UX pós-P5
Próximo passo exato: executar T1.5, definindo authoring/runtime/fallback para title + apresentação pública da lição, com retrocompatibilidade v1 e sem imprimir objective técnico quando faltar copy pública segura
Blocker atual: nenhum blocker técnico global; T1 é uma prioridade pedagógica deliberada, não um blocker acidental
Gate final do Clássico: NÃO SATISFEITO
```

Enquanto T1 estiver ativo, não iniciar P6 materialmente. O plano T1 foi autorizado como uma unidade de trabalho completa e pode usar múltiplas PRs sem nova autorização entre subfases previstas.

## Registro de marcos

| Marco | Estado | Evidência principal | Próximo critério |
|---|---|---|---|
| P1 — Schemas e contratos executáveis | `HOMOLOGADO` | PR #105 + schemas/fixtures/CI | concluído |
| P2 — ContentService/normalizador | `HOMOLOGADO` | PR #106 + runtime canônico N0/N4/N4-EXIT | concluído |
| P3 — Manifests e catálogo inicial | `HOMOLOGADO` | PR #107 + catálogo v2 + manifests + integridade | concluído |
| P4 — Renderer real do Clássico | `HOMOLOGADO` | PR #108 + 20 lições/2 verificações + smoke Chrome + screenshots | concluído |
| P5 — ProgressService/revisão/Gist | `HOMOLOGADO` | PR #109 + engine/policies/Gist/sync/conflitos/cache/UI em CI | concluído |
| T1 — Fundamentos claros e experiência de lição | `ATIVO` | T1.1 auditoria + T1.2 arquitetura + T1.3 linguagem + T1.4 fontes/skills | T1.5 contrato técnico → T1.10 homologação |
| P6 — Feedback por IA | `NAO_INICIADO / AGUARDANDO T1` | — | iniciar após T1 homologado |
| P7 — Ampliação N0→N4 | `NAO_INICIADO` | — | catálogo clássico cobre escopo aprovado |
| P8 — Mídia/prontidão de publicação | `NAO_INICIADO` | — | blockers obrigatórios resolvidos |
| P9 — Homologação E2E | `NAO_INICIADO` | — | `CLÁSSICO HOMOLOGADO` |

## Base homologada P1–P5

### P1–P4

```text
P1
→ schemas course/unit/lesson/verification/progress
→ fixtures reais N0/N4
→ validação mecânica

P2
→ autoria v1 preservada
→ adapter/normalizador
→ runtime canônico
→ ambiguidade histórica falha explicitamente

P3
→ course.json v2
→ manifests N0-U01 + N4-U09
→ IDs estáveis de competência
→ catálogo → manifesto → autoria → runtime

P4
→ home/unidade/lição/verificação reais
→ renderer CONTENT/ACTIVITY
→ 20 lições + 2 verificações sem unsupported
→ TTS, pending e mídia ausente explícitos
→ validação desktop/tablet/mobile
```

### P5 — progresso, revisão e persistência

`ProgressService` mantém separadas:

```text
percurso curricular
≠ evidência/domínio
≠ gamificação
```

Estados centrais homologados:

```text
Lição
NAO_INICIADA | EM_ESTUDO | CONCLUIDA

Evidência
NAO_OBSERVADA | PRATICADA | DEMONSTRADA | VALIDACAO_PENDENTE | REVISAO_RECOMENDADA

Competência
NOVA | EM_DESENVOLVIMENTO | DEMONSTRADA | CONSOLIDADA
```

Políticas homologadas:

```text
DEMONSTRATED_REQUIRED
PENDING_ALLOWED
ATTEMPT_REQUIRED
minimumEvidence
requiredAnyOf
```

Revisão pode ser criada por dificuldade e removida por recuperação sem apagar histórico. Não existe XP oculto, vidas ou penalidade de acesso no Clássico.

Persistência:

- cache local resiliente;
- schema futuro/desconhecido ou JSON inválido é preservado em backup antes de iniciar estado novo compatível;
- respostas abertas são restauradas;
- GitHub/Gist usa `portugues-completo-progress.json`;
- token pertence ao aluno, fica em sessão e nunca entra em conteúdo/progresso/Gist;
- merge de três vias preserva respostas concorrentes em vez de concatená-las ou descartá-las;
- falha remota mantém trabalho local;
- estados de sync permanecem `LOCAL_ONLY`, `LOCAL_CHANGES`, `SYNCING`, `SYNCED`, `CONFLICT_PRESERVED`, `ERROR`.

Fonte histórica detalhada: PR #109 + `docs/progresso.md` + `docs/persistencia-progresso.md`.

## Refinamentos transversais de UI após P5

### `CL-UX-HOME-REDESIGN`

```text
Estado: HOMOLOGADO
Homologação visual: desktop + tablet + mobile + desktop estreito
```

Decisões vigentes:

- navegação principal: Início, Plano de estudos, Unidades, Revisões e Desempenho;
- nenhuma sidebar duplicando esses destinos;
- hero/banner introdutório grande removido;
- home começa diretamente por retomada/progresso;
- `Continue estudando / Comece por aqui` concentra o único CTA principal;
- métricas derivam de catálogo + `ProgressService`;
- níveis técnicos N0–N4 recebem nomes humanos;
- `Ajuda` é utilitário discreto;
- `Metodologia do curso` ainda está temporariamente no rodapé e será realocada por T1.8;
- card `Seu progresso` possui layout responsivo validado também em 680px.

### `CL-UX-LESSON-FLOW`

```text
Estado: HOMOLOGADO como base técnica
Arquivos principais: classic-lesson-flow.js + classic-lesson-flow.css
Homologação visual: N0 desktop/mobile + N4 desktop
```

Decisões vigentes:

- uma etapa principal da lição por vez;
- blocos relacionados agrupados sem microfragmentação;
- `Voltar` / `Avançar` livres, sem gate artificial;
- breadcrumb longo substituído por `← Voltar para a unidade`;
- rótulos técnicos/redundantes removidos da apresentação;
- transição respeita `prefers-reduced-motion`;
- respostas permanecem preservadas ao navegar entre etapas.

T1 acrescentará sobre essa base:

- primeira tela exclusiva de apresentação;
- objetivo público simples separado do objetivo curricular técnico;
- `Começar lição` antes do stepper na primeira entrada;
- retomada sem repetir introdução desnecessariamente;
- nova progressão inicial N0.

## T1 — `CL-T1-FUNDAMENTOS-CLAROS`

```text
Estado consolidado: ATIVO / AUTORIZADO
T1.0 baseline/ativação                                      ✓
T1.1 pesquisa + auditoria                                  ✓
T1.2 redimensionamento curricular N0                       ✓
T1.3 contrato de linguagem                                 ✓
T1.4 skills/fontes canônicas                               ✓
T1.5 contrato técnico de abertura                          ← ativo
T1.6 nova autoria inicial
T1.7 frontend de intro/fluxo
T1.8 metodologia em Ajuda
T1.9 migração/catálogo/progresso/mídia
T1.10 validação/homologação
```

Fontes centrais:

- plano: `docs/plano-fundamentos-claros.md`;
- auditoria T1.1: `docs/auditoria-t1-1-porta-entrada-n0.md`;
- arquitetura T1.2: `docs/redimensionamento-t1-2-n0.md`;
- contrato T1.3: `docs/linguagem-aluno.md`;
- conteúdo: `docs/conteudo.md`;
- UI: `docs/ui-ux.md`;
- skill temporária: `.ChatGPT/skills/fundamentos-claros/SKILL.md`;
- regras duradouras nas skills canônicas pela PR #117 + complemento de validação visual T1.4.

### Decisão T1.1

A auditoria confirmou:

- `Fala e escrita` é conteúdo válido, mas abstrato demais para abrir o curso;
- letras/conhecimento alfabético e consciência sonora devem se articular cedo, sem exigir memorização mecânica A–Z antes de qualquer trabalho sonoro;
- a introdução silábica existente é boa, mas estava atrasada por pré-requisito amplo demais;
- relações letra–som mais complexas devem vir após experiências concretas com letras, sílabas e palavras;
- o N0 final não precisa ser reduzido: é a escada até ele que precisava ser corrigida.

### Decisão T1.2

O N0 continua com seis unidades. U3–U6 preservam suas responsabilidades. As duas primeiras passam a ser:

```text
U1 — Letras e primeiros sons
→ letra/alfabeto
→ maiúsculas/minúsculas
→ vogais/consoantes
→ letras, números e outros sinais
→ organização básica da escrita
→ perceber sons em palavras
→ nome da letra × som

U2 — Sílabas e primeiras palavras
→ o que é sílaba
→ separar/juntar
→ sílaba ouvida ↔ escrita
→ montar e ler palavras
→ significado
→ variação letra–som
→ falar × escrever como síntese posterior
```

A nova U1 terá 7 lições + verificação; a nova U2 terá 10 lições + verificação.

Identidades preservadas quando o núcleo semântico permanece igual; conteúdo dividido ou movido recebe ID novo. Em especial:

- `N0-U01-L03` torna-se a primeira lição pública, preservando identidade de alfabeto;
- `N0-U01-L05` permanece para vogais/consoantes e o núcleo de outros sinais vira novo `N0-U01-L09`;
- fala/escrita sai de `N0-U01-L01` e terá nova identidade `N0-U02-L10`;
- variação letra–som sai de `N0-U01-L08` e terá nova identidade `N0-U02-L09`;
- verificações antigas `N0-U01-V01` e `N0-U02-V01` ficam como legado; novas responsabilidades usam `V02`;
- progresso antigo nunca é atribuído a competência nova por coincidência de nome/posição;
- mídia existente mantém `mediaId` quando o ativo continua semanticamente válido, mesmo mudando de posição.

Até T1.6 materializar os JSONs, para U1/U2 a precedência é:

```text
docs/redimensionamento-t1-2-n0.md
→ arquitetura congelada

docs/auditoria-t1-1-porta-entrada-n0.md
→ justificativa

docs/unidades-nivel-0.md + docs/licoes-nivel-0.md
→ material histórico a reutilizar
```

### Decisão T1.3 — linguagem

`docs/linguagem-aluno.md` é canônico para a fala pública.

Regra:

```text
objetivo técnico
≠ objetivo público

clara + completa + simples

concreto
→ exemplo
→ nome do conceito
→ explicação simples
→ prática
→ ampliação
```

`simples` não significa raso, infantilizado ou impreciso. O início do N0 não presume que letra, alfabeto, vogal, consoante, sílaba, palavra ou frase já sejam conceitos compreendidos.

### Decisão T1.4 — consolidação canônica

T1.4 fecha porque:

- PR #117 já incorporou as regras duradouras em `course-content-design`, `curricular-orchestration`, `student-ui-ux` e `classic-product-delivery`;
- `docs/conteudo.md` agora trata linguagem pública como parte da autoria;
- `docs/ui-ux.md` aponta para `docs/linguagem-aluno.md`, formaliza a primeira tela limpa e registra Metodologia em Ajuda/Como o curso funciona;
- `.ChatGPT/skills/frontend-visual-check/SKILL.md` agora exige validar primeira abertura, retomada, etapa explicativa, atividade e largura intermediária quando relevante;
- roadmaps/índice/estado registram as fontes T1.

## Estado de publicação do slice

### N0-U01

```text
Renderer: HOMOLOGADO como base técnica
Progresso: HOMOLOGADO como base técnica
Currículo/publicação: EM REVISÃO DIRIGIDA por T1
Mídia: áudios controlados do desenho histórico ainda pendentes, sujeitos à reconciliação T1.9
Manifesto: BLOCKED até materialização/migração da nova ordem
```

A mídia pendente é local e não impede T1.

### N4-U09

```text
Renderer: HOMOLOGADO
Progresso/pending: HOMOLOGADOS
Nova mídia humana obrigatória: nenhuma
Manifesto: READY
```

Produções abertas continuam `VALIDACAO_PENDENTE` quando exigem avaliador confiável. P6 poderá acrescentar feedback assistido depois de T1, sem transformar IA em autoridade automática de domínio.

## Pendências abertas

```text
Global antes de P6: concluir CL-T1-FUNDAMENTOS-CLAROS
T1 imediato: T1.5 — contrato técnico da abertura da lição
Local: mídias obrigatórias históricas de N0-U01/U02, sujeitas à reconciliação T1.9
```

## Próximo marco operacional — T1

```text
T1.1 pesquisa + auditoria                                  ✓
T1.2 redimensionamento curricular N0                       ✓
T1.3 contrato de linguagem                                 ✓
T1.4 skills/fontes canônicas                               ✓
→ T1.5 contrato técnico de abertura                        ← ativo
→ T1.6 nova autoria inicial
→ T1.7 frontend de intro/fluxo
→ T1.8 metodologia em Ajuda
→ T1.9 migração/catálogo/progresso/mídia
→ T1.10 validação/homologação
```

Depois de T1 homologado, P6 volta a ser o próximo marco.

## Condição de avanço

Um marco pode avançar com pendências locais não bloqueantes quando sua condição de saída estiver satisfeita e as pendências continuarem explícitas.

T1 é uma revisão dirigida autorizada por validação real do produto. O fato de N0 ter sido fechado anteriormente em M5 não impede correção de ordem/pré-requisitos quando a experiência revelou um problema pedagógico concreto.

## Gate `CLÁSSICO HOMOLOGADO`

Só P9 pode satisfazer o gate. Nenhuma implementação de XP, missões, conquistas, streak ou progressão gamificada começa antes dele.
