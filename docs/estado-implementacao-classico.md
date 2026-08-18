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
Subfase ativa: T1.1 — pesquisa e auditoria da porta de entrada do N0
P6 — Feedback por IA: AGUARDANDO T1
Último item concluído: CL-UX-LESSON-FLOW + CL-UX-HOME-REDESIGN + refinamentos responsivos da home (pós-P5)
Próximo passo exato: executar T1.1, pesquisando e auditando a progressão inicial N0, pré-requisitos, conteúdo real, IDs, mídia e progresso antes de congelar a nova espinha curricular
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
| T1 — Fundamentos claros e experiência de lição | `ATIVO` | `docs/plano-fundamentos-claros.md` | T1.1 pesquisa/auditoria → T1.10 homologação |
| P6 — Feedback por IA | `NAO_INICIADO / AGUARDANDO T1` | — | iniciar após T1 homologado |
| P7 — Ampliação N0→N4 | `NAO_INICIADO` | — | catálogo clássico cobre escopo aprovado |
| P8 — Mídia/prontidão de publicação | `NAO_INICIADO` | — | blockers obrigatórios resolvidos |
| P9 — Homologação E2E | `NAO_INICIADO` | — | `CLÁSSICO HOMOLOGADO` |

## Base homologada P1–P4

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

## P5 — itens homologados

### `CL-P5-PROGRESS-ENGINE`

```text
Escopo: app/js/services/progress-service.js
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação: HOMOLOGADO no slice P4 e em fixtures sintéticas de policy
Gamificação: AUSENTE / não acumulada
```

O serviço mantém separadas três dimensões:

```text
percurso curricular
≠ evidência/domínio
≠ gamificação
```

Estados implementados:

```text
Lição
NAO_INICIADA (ausência de registro) | EM_ESTUDO | CONCLUIDA

Evidência
NAO_OBSERVADA (ausência de registro) | PRATICADA | DEMONSTRADA | VALIDACAO_PENDENTE | REVISAO_RECOMENDADA

Competência
NOVA (ausência de registro) | EM_DESENVOLVIMENTO | DEMONSTRADA | CONSOLIDADA
```

Políticas mecânicas provadas:

```text
DEMONSTRATED_REQUIRED
PENDING_ALLOWED
ATTEMPT_REQUIRED
minimumEvidence
requiredAnyOf
```

N0 prova erro → revisão → nova tentativa → recuperação → conclusão determinística. N4 prova produção aberta registrada como `VALIDACAO_PENDENTE`, permitindo conclusão de percurso quando o cluster é `PENDING_ALLOWED` sem promover domínio automaticamente.

### `CL-P5-REVIEW`

```text
Escopo: fila review do progress v1
Estado: HOMOLOGADO
```

Uma dificuldade relevante em evidência obrigatória cria `REVISAO_RECOMENDADA` e entrada explicável na fila. Recuperação demonstrada remove a recomendação correspondente sem apagar histórico de tentativas. Revisão voluntária também é suportada.

Não existe penalidade por erro, XP, lives ou gate artificial.

### `CL-P5-LOCAL-CACHE`

```text
Escopo: localStorage como cópia resiliente do progress v1
Arquivos: progress-service.js + progress-storage-service.js
Estado: HOMOLOGADO
```

A cópia local permite continuar estudando quando GitHub/rede estão indisponíveis.

Guard rail de versão:

```text
cache v1 válido
→ carregar normalmente

schema futuro/desconhecido ou JSON inválido
→ preservar conteúdo em backup local
→ remover somente a chave ativa incompatível
→ iniciar v1 novo sem destruir o conteúdo anterior
```

Ainda não existe migração v1→v2 porque progress v2 não existe. Quando um novo schema surgir, a migração deve ser explícita e testada; o P5 não inventa transformação futura.

### `CL-P5-GIST-SYNC`

```text
Arquivos: github-service.js + progress-sync-service.js
Arquivo remoto: portugues-completo-progress.json
Estado: HOMOLOGADO por testes de contrato/mock
```

Fluxo:

```text
cache local
↕
ProgressSyncService
↕
GitHubService
↕
Gist do próprio aluno
```

Decisões implementadas:

- token GitHub pertence ao aluno;
- token fica apenas em `sessionStorage` durante a sessão;
- token nunca entra no progress, Gist ou conteúdo;
- criação usa `public: false` e o projeto não apresenta isso como cofre/segredo forte;
- o Gist é descoberto pelo nome de arquivo oficial ou pelo ID já conhecido;
- sincronização explícita evita depender de rede a cada atividade;
- nova alteração local muda o estado para `LOCAL_CHANGES` em vez de continuar afirmando `SYNCED`.

Verificação oficial realizada durante P5: token refinado não precisa de permissão adicional para `GET /user`; criação/atualização de Gist exige somente permissão de usuário `Gists: write`. Nenhum acesso a repositórios do aluno é necessário para este fluxo.

### `CL-P5-CONFLICT`

```text
Estado: HOMOLOGADO por merge de três vias + teste de falha remota
```

O último snapshot sincronizado funciona como baseline.

```text
só remoto mudou → adotar remoto
só local mudou → enviar local
ambos mudaram → merge por domínio
```

Regras principais:

- lição concluída não é rebaixada por cópia obsoleta;
- mapas de evidência/competência/revisão são combinados por entidade;
- respostas abertas concorrentes nunca são concatenadas;
- quando as duas versões mudaram, uma permanece na referência principal e a outra é preservada numa referência `#conflict-...`;
- a UI informa `CONFLICT_PRESERVED`;
- falha de atualização remota deixa o estado local intacto e marca `ERROR`.

### `CL-P5-UI`

```text
Arquivos: classic-progress.js + classic-progress-binding.js + progress-settings.js + progress.css
Estado: HOMOLOGADO no slice
```

A experiência Clássica agora pode mostrar:

- ponto de retomada / Continuar estudando;
- lição em estudo ou concluída;
- evidência demonstrada, pendente ou em revisão;
- número de tentativas;
- resumo de pending/revisões;
- resposta aberta restaurada ao reabrir a atividade;
- estado de sincronização `LOCAL_ONLY`, `LOCAL_CHANGES`, `SYNCING`, `SYNCED`, `CONFLICT_PRESERVED` ou `ERROR`;
- conexão/sincronização/desconexão GitHub em Configurações → Progresso.

O renderer continua responsável pela interação/feedback imediato; o `ProgressService` é a autoridade sobre estado pedagógico. A UI não grava domínio diretamente.

### `CL-P5-VALIDATION`

CI executa, além das camadas P1–P4:

```text
Test progress engine
Test progress policies
Test GitHub Gist service
Test progress sync
```

Casos provados:

- N0 determinístico;
- revisão e recuperação;
- N4 pending + resposta persistida;
- schema progress v1 válido;
- `minimumEvidence` e `requiredAnyOf`;
- `ATTEMPT_REQUIRED`;
- backup de schema local desconhecido;
- criação/leitura/update de Gist sem rede real;
- merge concorrente preservando duas respostas;
- falha remota sem perda local;
- DOM Chrome com painel de progresso/configuração presente;
- screenshots desktop/tablet/mobile sem regressão visual aparente.

## Refinamentos transversais de UI após P5

### `CL-UX-HOME-REDESIGN`

```text
Escopo: home + navegação global do Modo Clássico
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação visual: desktop + tablet + mobile + desktop estreito
Mudança de currículo/progresso: nenhuma
```

Decisões implementadas:

- navegação principal única no cabeçalho: Início, Plano de estudos, Unidades, Revisões e Desempenho;
- nenhuma sidebar duplicando os mesmos destinos;
- `Plano de estudos` aparece somente na navegação;
- hero/banner introdutório grande foi removido; a home começa diretamente pela retomada/progresso;
- `Continue estudando / Comece por aqui` concentra o único CTA principal (`Continuar de onde parou` ou `Começar a estudar`);
- `Continuar lição` foi removido como ação concorrente na home;
- `N0`–`N4` permanecem internos e são apresentados como Fundamentos/Básico/Intermediário/Avançado/Domínio;
- home mostra somente métricas derivadas de catálogo + `ProgressService`;
- `Metodologia do curso` permanece temporariamente acessível pelo rodapé e será realocada por T1;
- `Ajuda` permanece acessível como utilitário discreto no cabeçalho;
- Plano de estudos, Unidades, Revisões e Desempenho possuem destinos funcionais em vez de links decorativos;
- o card `Seu progresso` possui alinhamento responsivo corrigido para ring/ícone, valor e descrição em largura estreita, com smoke dedicado em 680px;
- o redesign segue `docs/ui-ux.md` e `.ChatGPT/skills/student-ui-ux/SKILL.md`.

Validação:

- smoke DOM cobre home e todos os destinos de navegação;
- guard rails impedem reintrodução de CTA duplicado e código de nível cru como rótulo público;
- screenshots 1440px, 768px, 680px e 390px inspecionadas conforme refinamento;
- nenhuma regressão funcional observada em unidade/lição N0/N4.

### `CL-UX-LESSON-FLOW`

```text
Escopo: apresentação de lições e verificações do Modo Clássico
Estado consolidado: HOMOLOGADO como base, com nova abertura/clareza prevista em T1
Técnico: IMPLEMENTADO
Arquivos principais: classic-lesson-flow.js + classic-lesson-flow.css
Homologação visual: N0 desktop/mobile + N4 desktop
Mudança de currículo/runtime/progresso: nenhuma nesta entrega original
```

Decisões implementadas:

- a lição deixa de mostrar todos os blocos simultaneamente e passa a exibir uma etapa principal por vez;
- blocos de conteúdo relacionados são agrupados em quantidade moderada, sem criar uma tela por bloco;
- atividades podem vir com poucos blocos preparatórios e continuam usando os mesmos IDs/contratos/evidências;
- controles `Voltar` e `Avançar` permitem revisão livre, sem gate artificial;
- etapa visual corrente pode ser lembrada em `sessionStorage` apenas como conveniência de interface;
- breadcrumb `Curso › Unidade › Lição` é substituído por `← Voltar para a unidade`, apontando deterministicamente para a unidade;
- rótulos redundantes como `Prática` e `correção objetiva` são removidos quando a etapa já comunica a função;
- badge obrigatório é apresentado como `Necessária para concluir`;
- transição curta de etapa respeita `prefers-reduced-motion` e move foco para o título da etapa;
- respostas permanecem no DOM ao navegar entre etapas, portanto não são apagadas por `Voltar/Avançar`.

T1 acrescentará sobre essa base:

- primeira tela exclusiva de apresentação da lição;
- texto público simples separado do objetivo curricular técnico;
- `Começar lição` antes do stepper na primeira entrada;
- retomada sem repetir introdução desnecessariamente;
- revisão curricular da ordem inicial N0.

Validação da entrega original:

- teste mecânico confirma que N0-U01-L01 é agrupada em poucas etapas, preserva todos os blocos e não microfragmenta um bloco por tela;
- smoke DOM confirma `Voltar para a unidade`, `Avançar`, montagem de `data-lesson-step` e ausência do breadcrumb longo;
- smoke DOM impede reintrodução de `correção objetiva` na apresentação final;
- screenshots da primeira etapa N0 em desktop/mobile inspecionadas;
- screenshot N4 inspecionada com atividade real dentro do fluxo segmentado;
- CI completo da PR do refinamento passou antes da homologação.

## T1 — `CL-T1-FUNDAMENTOS-CLAROS`

```text
Estado consolidado: ATIVO / AUTORIZADO
Técnico: PLANEJADO; execução material ainda não iniciada
Subfase: T1.1 — pesquisa e auditoria
Plano: docs/plano-fundamentos-claros.md
Skill: .ChatGPT/skills/fundamentos-claros/SKILL.md
Impacto: currículo N0 inicial + conteúdo + contratos + frontend + skills + migração + mídia
P6: aguardando conclusão de T1
```

Decisões já aprovadas e registradas:

- primeira entrada da lição terá tela limpa com `Lição`, título, objetivo público simples e `Começar lição`;
- exemplo de objetivo público aprovado: `Entender a diferença entre o que falamos e o que escrevemos.`;
- objetivo curricular técnico não deve ser impresso diretamente como apresentação ao aluno;
- linguagem para iniciantes deve partir do concreto, definir termos e avançar em pequenas camadas;
- a porta de entrada N0 será reavaliada para começar perceptivelmente por fundamentos como letras/alfabeto, vogais/consoantes, sílabas e palavras antes de abstrações inadequadas ao primeiro contato;
- pode haver reordenação, divisão ou criação de unidades iniciais, mediante auditoria de dependências;
- IDs publicados não podem mudar de significado silenciosamente;
- progresso/localStorage/Gist/deep links precisam de migração conservadora quando a identidade mudar;
- `Metodologia do curso` sairá do rodapé persistente e ficará acessível por Ajuda → Como o curso funciona;
- skills canônicas serão atualizadas antes do fechamento de T1 para preservar o método em novas instâncias.

## Estado de publicação do slice após P5

### N0-U01

```text
Renderer: HOMOLOGADO como base técnica
Progresso: HOMOLOGADO como base técnica
Currículo/publicação: EM REVISÃO DIRIGIDA por T1
Mídia: MIDIA_OBRIGATORIA_PARA_ATIVIDADE ainda pendente para áudios controlados do desenho atual
Manifesto: BLOCKED; será reconciliado com a nova ordem antes de publicação final
```

A pendência de mídia é local e não impede T1. A nova ordem pode reutilizar, mover ou aposentar demandas de mídia; P8 continua responsável por resolver blockers finais após a reconciliação.

### N4-U09

```text
Renderer: HOMOLOGADO
Progresso/pending: HOMOLOGADOS
Nova mídia humana obrigatória: nenhuma
Manifesto: READY
```

Produções abertas continuam `VALIDACAO_PENDENTE` quando exigem avaliador confiável. P6 poderá acrescentar feedback assistido depois de T1, mas não converter isso automaticamente em domínio.

## Pendências abertas

```text
Global antes de P6: concluir CL-T1-FUNDAMENTOS-CLAROS
T1 imediato: pesquisa/auditoria da porta de entrada N0
Local: áudios controlados obrigatórios do desenho atual de N0-U01, sujeitos à reconciliação T1
```

## Próximo marco operacional — T1

Executar:

```text
T1.1 pesquisa + auditoria
→ T1.2 redimensionamento curricular N0
→ T1.3 contrato de linguagem
→ T1.4 skills/fontes canônicas
→ T1.5 contrato técnico de abertura
→ T1.6 nova autoria inicial
→ T1.7 frontend de intro/fluxo
→ T1.8 metodologia em Ajuda
→ T1.9 migração/catálogo/progresso/mídia
→ T1.10 validação/homologação
```

Detalhes e gates: `docs/plano-fundamentos-claros.md`.

Depois de T1 homologado, P6 volta a ser o próximo marco:

```text
AiFeedbackService
→ adapter de provider
→ BYOK opt-in
→ chave fora de Git/Gist/progresso
→ request mínimo e estruturado
→ structured response validado
→ fallback sem perda de resposta
→ IA nunca grava ProgressService diretamente
→ VALIDACAO_PENDENTE preservada quando avaliador confiável é exigido
```

Provider/model/API atuais devem ser verificados em documentação oficial quando P6 for retomado.

## Condição de avanço

Um marco pode avançar com pendências locais não bloqueantes quando sua condição de saída estiver satisfeita e as pendências continuarem explícitas.

T1 é uma revisão dirigida autorizada por validação real do produto. O fato de N0 ter sido fechado anteriormente em M5 não impede correção de ordem/pré-requisitos quando a experiência revelou um problema pedagógico concreto.

## Gate `CLÁSSICO HOMOLOGADO`

Só P9 pode satisfazer o gate. Nenhuma implementação de XP, missões, conquistas, streak ou progressão gamificada começa antes dele.
