# Roadmap de Produto

## Função

Registrar a ordem e as condições de saída da fase de produto/publicação após o fechamento curricular N0→N4.

- maturidade curricular: `docs/roadmap-curricular.md`;
- estado operacional exato: `docs/estado-implementacao-classico.md`;
- refinamento transversal ativo: `docs/plano-fundamentos-claros.md`;
- decisão da auditoria de entrada: `docs/auditoria-t1-1-porta-entrada-n0.md`.

## Estado atual

```text
CURRÍCULO N0→N4 → fechado curricularmente em M5, com revisão dirigida da porta de entrada N0 autorizada
P1 — Schemas/contratos executáveis → HOMOLOGADO
P2 — ContentService/normalizador → HOMOLOGADO
P3 — Manifests e catálogo inicial → HOMOLOGADO
P4 — Renderer real do Clássico → HOMOLOGADO
P5 — ProgressService, revisão e persistência → HOMOLOGADO
MARCO TRANSVERSAL ATIVO → T1 — Fundamentos claros e experiência de lição
T1.1 — pesquisa/auditoria da entrada N0 → CONCLUÍDO
T1.2 — redimensionamento curricular controlado do N0 → ATIVO
P6 — Feedback por IA no Clássico → AGUARDANDO T1
MODO CLÁSSICO REAL → slice funcional com progresso persistente; porta de entrada em revisão antes de ampliar o produto
MODO GAMIFICADO → somente após CLÁSSICO HOMOLOGADO
```

Enquanto T1 estiver ativo, `docs/plano-fundamentos-claros.md` e `.ChatGPT/skills/fundamentos-claros/SKILL.md` governam a execução e têm precedência operacional sobre iniciar P6.

## Sequência estratégica: Clássico primeiro

```text
P1 schemas/contratos
→ P2 runtime/normalizador
→ P3 catálogo/manifests
→ P4 renderer clássico
→ P5 progresso/revisão/Gist
→ T1 fundamentos claros + experiência de lição
→ P6 feedback IA quando aplicável
→ P7 expansão N0→N4
→ P8 mídia/publicação
→ P9 homologação E2E
────────────────────────────
GATE: CLÁSSICO HOMOLOGADO
────────────────────────────
→ P10 Modo Gamificado
→ P11 homologação/calibração gamificada
```

Antes do gate não implementar XP, missões, conquistas ou streak como produto, não fazer o Clássico depender de jogo e não alterar currículo para preparar recompensa. Casos-âncora podem ser observados para calibração posterior.

## Política transversal de mídia

```text
mídia ausente
→ registrar dependência/mediaId
→ implementar tudo que é independente
→ bloquear somente homologação/publicação do escopo dependente
→ continuar
```

Detalhes: `docs/estado-implementacao-classico.md`, `docs/conteudo.md`, `producao-midia/README.md`.

## P1 — Schemas e contratos executáveis

**Estado: HOMOLOGADO.**

Schemas `course`, `unit`, `lesson`, `verification` e `progress`, fixtures reais N0/N4 e validator em CI. Autoria histórica permanece v1 e é adaptada para runtime canônico.

## P2 — ContentService e normalizador

**Estado: HOMOLOGADO.**

```text
fonte autoral v1
→ adapter/ContentService
→ runtime canônico
→ schema P1
→ teste verde
```

Prosa histórica ambígua nunca é convertida por heurística. Sem estrutura/regra legada explícita, usar `UNNORMALIZABLE_COMPLETION`.

## P3 — Manifests e catálogo inicial

**Estado: HOMOLOGADO.**

Slice de publicação/descoberta:

```text
N0-U01 → 8 lições + verificação
N4-U09 → 12 lições + verificação
```

`course.json` v2, manifests, registry de competências estáveis e integridade/descoberta em CI estão homologados. Demais unidades entram progressivamente em P7.

## P4 — Renderer real do Clássico

**Estado: HOMOLOGADO.**

Entregas principais:

- home/unidade/lição/verificação reais;
- blocos `CONTENT`;
- primitivas `ACTIVITY` exigidas pelo slice;
- TTS;
- mídia controlada ausente por `mediaId`;
- feedback determinístico sem punição;
- `AFTER_VERIFICATION` sem revelar gabarito por item;
- `RELIABLE_EVALUATOR` como pending;
- camada pública sem metadados internos;
- smoke DOM + screenshots desktop/tablet/mobile.

Validação do slice:

```text
20/20 lições
+ 2/2 verificações
→ sem unsupported
```

Estado local após P4:

```text
N0-U01 → BLOCKED somente pelos áudios controlados obrigatórios pendentes
N4-U09 → READY
```

## P5 — ProgressService, revisão e persistência

**Estado: HOMOLOGADO.**

Objetivo cumprido: transformar interações P4 em estado pedagógico persistente sem misturar percurso, domínio e gamificação.

### Motor pedagógico

Implementado em `app/js/services/progress-service.js`:

```text
lição → NAO_INICIADA | EM_ESTUDO | CONCLUIDA
evidência → PRATICADA | DEMONSTRADA | VALIDACAO_PENDENTE | REVISAO_RECOMENDADA
competência → NOVA | EM_DESENVOLVIMENTO | DEMONSTRADA | CONSOLIDADA
```

Ausência de registro representa `NAO_INICIADA`/`NAO_OBSERVADA`/`NOVA`.

Políticas homologadas:

```text
DEMONSTRATED_REQUIRED
PENDING_ALLOWED
ATTEMPT_REQUIRED
minimumEvidence
requiredAnyOf
```

N0 prova erro → revisão → recuperação → conclusão. N4 prova resposta aberta → `VALIDACAO_PENDENTE` → conclusão de percurso permitida por `PENDING_ALLOWED` sem domínio inventado.

### Revisão

Dificuldade relevante pode criar `REVISAO_RECOMENDADA` e fila explicável. Recuperação remove a recomendação sem apagar histórico. Revisão voluntária é suportada. Não há vidas, penalidade de acesso ou XP oculto.

### Persistência local

`localStorage` funciona como cache resiliente, não como declaração falsa de sincronização remota.

`progress-storage-service.js` preserva cache de schema futuro/desconhecido ou JSON inválido em backup antes de iniciar um v1 novo. Não existe migração v1→v2 enquanto progress v2 não existir; futuras migrações devem ser explícitas e testadas.

### Gist e credencial

Serviços:

```text
ProgressService
↕
ProgressSyncService
↕
GitHubService
↕
portugues-completo-progress.json
```

Decisões homologadas:

- token do próprio aluno;
- token somente na sessão (`sessionStorage`);
- token nunca em progresso/Gist/conteúdo;
- Gist criado com `public: false` sem ser apresentado como cofre criptográfico;
- sync explícito/manual após conexão;
- nova alteração local muda `SYNCED` → `LOCAL_CHANGES`;
- `GET /user` é usado para nomear a conta conectada sem exigir permissão adicional em token refinado;
- criar/atualizar Gist exige permissão de usuário `Gists: write`; nenhum acesso a repositórios faz parte do fluxo P5.

Detalhes de API/permissão são fatos externos e devem ser rechecados em documentação oficial se o fluxo GitHub for alterado.

### Conflitos e falha remota

O último snapshot sincronizado é baseline de merge de três vias.

```text
só remoto mudou → adotar remoto
só local mudou → enviar local
ambos mudaram → merge por domínio
```

Resposta autoral concorrente nunca é concatenada nem descartada: uma versão permanece na referência principal e a outra é preservada em referência `#conflict-...`; a interface sinaliza `CONFLICT_PRESERVED`.

Falha remota mantém trabalho local e muda o estado para `ERROR`.

### UI Clássica

A experiência agora mostra, quando aplicável:

- continuar estudando;
- lição em estudo/concluída;
- evidência demonstrada/pending/revisão;
- tentativas;
- resumo de revisão/pending;
- restauração de resposta aberta;
- Configurações → Progresso para conectar/sincronizar/desconectar GitHub;
- estados `LOCAL_ONLY`, `LOCAL_CHANGES`, `SYNCING`, `SYNCED`, `CONFLICT_PRESERVED`, `ERROR`.

A UI não grava domínio diretamente.

### Validação P5

CI acrescentou:

```text
Test progress engine
Test progress policies
Test GitHub Gist service
Test progress sync
```

Além disso, o smoke Chrome exige painel de progresso/configuração e mantém os guard rails visuais P4.

Condição de saída P5 satisfeita:

```text
interação
→ evidência
→ conclusão/domínio honestos
→ revisão quando aplicável
→ cache local
→ restore
→ sync Gist
→ conflito preservado
→ falha remota sem perda
```

## T1 — Fundamentos claros e experiência de lição

**Estado: ATIVO / AUTORIZADO.**

Plano canônico: `docs/plano-fundamentos-claros.md`.

Skill operacional: `.ChatGPT/skills/fundamentos-claros/SKILL.md`.

Relatório T1.1: `docs/auditoria-t1-1-porta-entrada-n0.md`.

Objetivo: corrigir antes de P6 a porta de entrada curricular e visual revelada pela validação do produto.

Estado interno:

```text
T1.1 pesquisa + auditoria                                  ✓
T1.2 redimensionamento curricular N0                      ← ativo
T1.3 contrato de linguagem
T1.4 skills/fontes canônicas — regras centrais já antecipadas na PR #117; reconciliar ao fechar a fase
T1.5 contrato técnico de abertura
T1.6 nova autoria inicial
T1.7 frontend de intro/fluxo
T1.8 metodologia em Ajuda
T1.9 migração/catálogo/progresso/mídia
T1.10 validação/homologação
```

T1.1 concluiu que a melhor candidata para T1.2 é reorganizar conjuntamente as atuais U1 + U2 em duas unidades iniciais mais naturais, trazendo letras/alfabeto para a porta de entrada, articulando consciência sonora cedo e aproximando sílabas/primeiras palavras. `Fala e escrita` permanece conteúdo válido, mas deixa de ser a abstração inaugural; relações letra–som mais complexas também passam para depois de experiências concretas.

Escopo resumido:

```text
pesquisar/auditar a entrada do N0                           ✓
→ reorganizar/criar fundamentos iniciais quando necessário
→ separar objetivo técnico de texto para o aluno
→ adotar linguagem simples e progressão concreto→conceito→prática
→ atualizar skills e contratos
→ criar/revisar conteúdo inicial
→ abrir lição com tela exclusiva e limpa
→ manter fluxo em etapas depois de “Começar lição”
→ mover Metodologia do rodapé para Ajuda/Como o curso funciona
→ preservar/migrar IDs, progresso, deep links e mídia
→ validar currículo + CI + desktop estreito/amplo + mobile
```

Decisões já congeladas incluem a preferência por textos como:

```text
Entender a diferença entre o que falamos e o que escrevemos.
```

em vez de expor diretamente objetivos curriculares com metalíngua como `realização sonora`/`representação gráfica`.

O N0 continua historicamente fechado em M5, mas sua porta de entrada está em **revisão dirigida**. A maturidade só será reclassificada nos documentos curriculares quando a nova arquitetura de unidades/lições for decidida e integrada; não tratar “M5 concluído” como motivo para impedir correção pedagógica real.

### Condição de saída T1

```text
início do N0 parte de fundamentos perceptivelmente básicos
+ ordem/pré-requisitos revalidados
+ primeiras unidades/lições atualizadas ou criadas
+ texto público simples separado do objetivo técnico
+ tela inicial da lição limpa
+ retomada/etapas preservadas
+ metodologia fora do rodapé persistente
+ compatibilidade de progresso/IDs resolvida
+ skills canônicas atualizadas
+ CI e inspeção visual aprovados
```

T1 pode usar várias PRs e deve seguir `docs/execucao-continua.md`; não pedir nova autorização entre subfases já previstas no plano.

## P6 — Feedback por IA no Clássico

**Estado: AGUARDANDO T1.**

P6 volta a ser marco ativo somente quando `CL-T1-FUNDAMENTOS-CLAROS` estiver homologado.

Objetivo: acrescentar feedback opt-in em atividades elegíveis sem transformar IA em autoridade automática de domínio.

Entregas:

- `AiFeedbackService` isolado da UI;
- adapter do provider escolhido;
- provider/model configurável conforme contrato;
- BYOK;
- chave fora de Git/Gist/progresso;
- opt-in explícito;
- request mínimo com contexto/critério necessários;
- structured output validado;
- fallback sem perda da resposta;
- indisponibilidade de IA não bloqueia percurso quando a policy permite;
- `requiresReliableEvaluator` continua `VALIDACAO_PENDENTE` por padrão;
- ProgressService aplica somente transições autorizadas, nunca o provider diretamente.

Antes de congelar provider/model/endpoints, verificar documentação oficial atual. Se a implementação usar OpenAI, usar documentação oficial da OpenAI como fonte técnica.

## P7 — Ampliação do catálogo Clássico N0→N4

Objetivo: levar o pipeline homologado P1–P6 ao curso inteiro, usando a porta de entrada N0 revisada por T1.

```text
normalizar
→ manifestar/publicar
→ validar
→ renderizar
→ integrar progresso/feedback
→ homologar o possível
→ registrar mídia/blockers locais
→ continuar
```

Não reescrever conteúdo em massa para satisfazer renderer.

Condição de saída: catálogo cobre N0→N4, tipos necessários têm suporte ou blocker explícito e navegação alcança o percurso completo.

## P8 — Mídia e prontidão de publicação do Clássico

Objetivo: resolver blockers realmente obrigatórios, não produzir mídia decorativa.

Reconciliar fila de mídia, ligar mídias validadas, resolver `MIDIA_OBRIGATORIA_PARA_ATIVIDADE/PUBLICACAO`, garantir equivalentes acessíveis e reclassificar itens aptos/publicáveis.

## P9 — Homologação end-to-end do Clássico

Objetivo: provar o produto-base antes da gamificação.

Cobrir primeira entrada, navegação N0→N4, atividades determinísticas/estruturadas/abertas, feedback, revisão, pending, domínio, persistência/Gist, conflitos, IA ativa/desligada/falhando, mídia obrigatória, acessibilidade, desktop/tablet/mobile e recuperação sem perda.

### Gate `CLÁSSICO HOMOLOGADO`

```text
núcleo pedagógico estável
+ N0→N4 utilizável
+ feedback/revisão/progresso coerentes
+ persistência confiável
+ blockers obrigatórios tratados
+ E2E aprovado
+ nenhuma dependência de gamificação para estudar
```

P10 não começa antes desse gate.

## P10 — Modo Gamificado

Adicionar seleção/troca de modo, XP, progressão visual, conquistas, missões e streak não punitivo sobre o motor clássico homologado. Não há XP retroativo ao período estudado apenas no Clássico.

A economia nasce dos casos-âncora observados durante P3–P9 conforme `docs/calibracao-produto.md`.

## P11 — Homologação/calibração gamificada

Cobrir troca de modos, preservação de domínio, coerência/resistência a farm, revisão/recuperação, missões/conquistas, streak/fusos, acessibilidade, responsividade e usuários reais quando possível.

## Próximo passo oficial

```text
T1.2 — redimensionamento curricular controlado do N0
→ congelar nova arquitetura de unidades/lições + matriz de identidade/migração
→ seguir docs/plano-fundamentos-claros.md
```