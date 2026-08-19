# Roadmap de Produto

## Função

Registrar a ordem e as condições de saída da fase de produto/publicação após o fechamento curricular N0→N4.

- maturidade curricular: `docs/roadmap-curricular.md`;
- estado operacional exato: `docs/estado-implementacao-classico.md`;
- refinamento transversal ativo: `docs/plano-fundamentos-claros.md`;
- decisão da auditoria de entrada: `docs/auditoria-t1-1-porta-entrada-n0.md`;
- arquitetura inicial congelada: `docs/redimensionamento-t1-2-n0.md`;
- linguagem pública canônica: `docs/linguagem-aluno.md`.

## Estado atual

```text
CURRÍCULO N0→N4 → fechado curricularmente em M5, com revisão dirigida da porta de entrada N0 autorizada
P1 — Schemas/contratos executáveis → HOMOLOGADO
P2 — ContentService/normalizador → HOMOLOGADO
P3 — Manifests e catálogo inicial → HOMOLOGADO
P4 — Renderer real do Clássico → HOMOLOGADO
P5 — ProgressService, revisão e persistência → HOMOLOGADO
T1 — Fundamentos claros e experiência de lição → HOMOLOGADO
T1.1–T1.8 → CONCLUÍDOS / HOMOLOGADOS conforme gates
T1.9 — migração, catálogo, progresso e mídia → CONCLUÍDO / HOMOLOGADO
T1.10 — validação/homologação → CONCLUÍDO / HOMOLOGADO
P6 — Feedback por IA no Clássico → HOMOLOGADO
P7 — Ampliação do catálogo Clássico N0→N4 → ATIVO
MODO CLÁSSICO REAL → slice funcional com progresso persistente, entrada N0 homologada e catálogo sendo ampliado por lotes P7
MODO GAMIFICADO → somente após CLÁSSICO HOMOLOGADO
```

T1 está homologado. Suas regras duradouras permanecem nas fontes/skills canônicas; o cursor operacional volta a P6.

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

O P3 homologou o pipeline inicial de catálogo/manifests. Após T1, o slice publicado usado para regressão é:

```text
N0-U01 → 7 lições + V02
N0-U02 → 10 lições + V02
N4-U09 → 12 lições + V01
```

`course.json` v2, manifests, registry de competências estáveis e integridade/descoberta em CI continuam homologados. Demais unidades entram progressivamente em P7.

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
29/29 lições
+ 3/3 verificações
→ sem unsupported
```

Estado local após P4:

```text
N0-U01 → BLOCKED somente por mídia obrigatória local ainda pendente
N0-U02 → BLOCKED somente por mídia obrigatória local ainda pendente
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

A experiência mostra, quando aplicável:

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

**Estado: HOMOLOGADO.**

Fontes canônicas:

- plano: `docs/plano-fundamentos-claros.md`;
- skill operacional: `.ChatGPT/skills/fundamentos-claros/SKILL.md`;
- T1.1: `docs/auditoria-t1-1-porta-entrada-n0.md`;
- T1.2: `docs/redimensionamento-t1-2-n0.md`;
- T1.3: `docs/linguagem-aluno.md`.

Objetivo: corrigir antes de P6 a porta de entrada curricular e visual revelada pela validação do produto.

Estado interno:

```text
T1.1 pesquisa + auditoria                                  ✓
T1.2 redimensionamento curricular N0                       ✓
T1.3 contrato de linguagem                                 ✓
T1.4 skills/fontes canônicas                               ✓
T1.5 contrato técnico de abertura                          ✓
T1.6 nova autoria inicial                                  ✓
T1.7 frontend de intro/fluxo                               ✓
T1.8 metodologia em Ajuda                                  ✓
T1.9 migração/catálogo/progresso/mídia                     ✓
T1.10 validação/homologação                                ✓
```

### T1.1 — auditoria

Confirmou que:

- `Fala e escrita` é conteúdo válido, mas abstrato demais para abrir o curso;
- letras/conhecimento alfabético e consciência sonora devem se articular cedo;
- não se deve impor memorização perfeita A–Z antes de trabalhar sons/sílabas;
- a introdução de sílabas existente é boa, mas estava atrasada por pré-requisito amplo;
- relações letra–som mais complexas devem vir depois de experiências concretas.

### T1.2 — arquitetura inicial

N0 continua com seis unidades. U3–U6 mantêm sua responsabilidade e a entrada passa a ser:

```text
U1 — Letras e primeiros sons
→ letras/alfabeto
→ maiúsculas/minúsculas
→ vogais/consoantes
→ outros sinais/organização
→ primeiros sons
→ nome da letra × som

U2 — Sílabas e primeiras palavras
→ sílabas
→ separar/juntar
→ sílaba ouvida ↔ escrita
→ montar/ler palavras
→ significado
→ variação letra–som
→ falar × escrever como síntese
```

A matriz de identidade em `docs/redimensionamento-t1-2-n0.md` impede reutilizar ID com significado novo e antecipa migração conservadora de progresso/verificações/mídia.

### T1.3 — linguagem do aluno

`docs/linguagem-aluno.md` congela:

```text
objetivo técnico
≠ objetivo público

clara
+ completa
+ simples

concreto
→ exemplo
→ nome do conceito
→ explicação
→ prática
→ ampliação
```

`simples` não pode significar raso, infantilizado ou impreciso. Termos novos precisam ser ensinados antes de usados como pressuposto. O início do N0 aplica regra de zero pressupostos para conceitos como letra, alfabeto, vogal, consoante, sílaba, palavra e frase.

### T1.4 — fontes e skills

Regras duradouras foram antecipadas na PR #117 nas skills `course-content-design`, `curricular-orchestration`, `student-ui-ux` e `classic-product-delivery`.

T1.4 completa a consolidação com:

- `docs/conteudo.md` apontando linguagem pública como parte do conteúdo;
- `docs/ui-ux.md` incorporando tela inicial limpa e nova posição de Metodologia;
- `.ChatGPT/skills/frontend-visual-check/SKILL.md` exigindo inspeção de primeira abertura, retomada, explicação e atividade, incluindo largura intermediária quando relevante;
- `PROJECT_INDEX.md` mapeando as fontes T1.

### T1.5–T1.8 — contrato, autoria e experiência inicial

Consolidado antes de T1.9:

- `studentObjective` autoral pode alimentar `runtime.presentation.intro` sem substituir `objective` técnico;
- conteúdo legado recebe fallback público neutro, não vazamento de objetivo curricular;
- novas U1/U2 foram promovidas de forma atômica em T1.9 e estão publicadas no slice ativo;
- a primeira entrada de lição mostra somente retorno à unidade, título, intro pública e `Começar lição`;
- stepper/conteúdo ficam ocultos até o início;
- retomada usa estado visual separado e histórico pedagógico real sem criar domínio/evidência;
- metodologia saiu do rodapé persistente e passou a ser acessada por `Ajuda → Como o curso funciona`, preservando o deep link histórico;
- CI e inspeção visual em desktop/intermediário/mobile homologaram T1.7 e T1.8.

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

**Estado: HOMOLOGADO.**

T1 foi homologado em T1.10; P6 volta a ser o marco ativo do Modo Clássico.

Subfases:

```text
P6.1 — núcleo neutro + transporte seguro → HOMOLOGADO (PR #131)
P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual → HOMOLOGADO (PR #132)
P6.3 — homologação transversal do feedback IA → HOMOLOGADO (PR #133)
P6 — FECHADO / HOMOLOGADO → docs/homologacao-p6.md
```

P6.1 consolidou `AiFeedbackService`, adapter neutro, companion local OpenAI, structured output, `store:false`, chave fora do navegador e gates que impedem IA de promover evidência. Contrato técnico: `docs/p6-transporte-ia.md`.

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

**Estado: ATIVO.**

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

Lotes homologados até aqui:

- N0-U03 — Palavras, frases e sentido — PR #134 / `docs/homologacao-p7-n0-u03.md`;
- N0-U04 — Lendo e compreendendo pequenos textos — PR #135 / `docs/homologacao-p7-n0-u04.md`;
- N0-U05 — Escrevendo e organizando mensagens — PR #136 / `docs/homologacao-p7-n0-u05.md`.

Próximo lote: N0-U06 — Usando a língua no cotidiano.

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
P7 — Ampliação do catálogo Clássico N0→N4
→ N0-U03 + N0-U04 + N0-U05 HOMOLOGADAS / publicadas no catálogo
→ próximo lote: N0-U06 — Usando a língua no cotidiano
→ inventariar autoria + N0-U06-V01 e classificar interlocutor/finalidade, pergunta/resposta, pedidos/orientações, compreensão oral, adequação formal/informal, variação linguística, mídia e blocker real
→ adaptar somente contratos reutilizáveis necessários antes de manifestar/publicar
→ preservar N4-U09 como caso-âncora de resposta aberta/IA
→ não reescrever autoria apenas para satisfazer renderer
→ não transformar sotaque, variedade ou informalidade em erro automático
→ registrar blockers locais e continuar por lotes independentes
```
