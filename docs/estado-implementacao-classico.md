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

`docs/roadmap-produto.md` define a ordem P1→P9. Este arquivo registra o estado concreto.

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
Marco ativo: P6 — Feedback por IA no Clássico
Item ativo: ainda não iniciado
Último item concluído: CL-UX-HOME-REDESIGN (refinamento transversal pós-P5) + CL-P5-PROGRESS-ENGINE + CL-P5-LOCAL-CACHE + CL-P5-REVIEW + CL-P5-GIST-SYNC + CL-P5-CONFLICT + CL-P5-UI
Próximo passo exato: implementar AiFeedbackService/provider adapter sobre o contrato docs/avaliacao-ia.md, com BYOK opt-in, structured output, fallback e preservação de VALIDACAO_PENDENTE
Blocker atual do próximo passo: nenhum blocker técnico global; provider/model/API atuais devem ser verificados em documentação oficial no início de P6
Gate final do Clássico: NÃO SATISFEITO
```

## Registro de marcos

| Marco | Estado | Evidência principal | Próximo critério |
|---|---|---|---|
| P1 — Schemas e contratos executáveis | `HOMOLOGADO` | PR #105 + schemas/fixtures/CI | concluído |
| P2 — ContentService/normalizador | `HOMOLOGADO` | PR #106 + runtime canônico N0/N4/N4-EXIT | concluído |
| P3 — Manifests e catálogo inicial | `HOMOLOGADO` | PR #107 + catálogo v2 + manifests + integridade | concluído |
| P4 — Renderer real do Clássico | `HOMOLOGADO` | PR #108 + 20 lições/2 verificações + smoke Chrome + screenshots | concluído |
| P5 — ProgressService/revisão/Gist | `HOMOLOGADO` | PR #109 + engine/policies/Gist/sync/conflitos/cache/UI em CI | concluído |
| P6 — Feedback por IA | `NAO_INICIADO` | marco ativo | feedback/fallback homologados |
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

## Refinamento transversal de UI após P5

### `CL-UX-HOME-REDESIGN`

```text
Escopo: home + navegação global do Modo Clássico
Estado consolidado: HOMOLOGADO
Técnico: IMPLEMENTADO
Homologação visual: desktop + tablet + mobile
Mudança de currículo/progresso: nenhuma
Marco P6: permanece ativo e ainda não iniciado materialmente
```

Decisões implementadas:

- navegação principal única no cabeçalho: Início, Plano de estudos, Unidades, Revisões e Desempenho;
- nenhuma sidebar duplicando os mesmos destinos;
- `Plano de estudos` aparece somente na navegação e não é repetido no hero;
- hero orientado a início/retomada com um único CTA principal;
- primeiro acesso usa “Comece seu percurso de aprendizagem” e “Comece por aqui”; retorno usa linguagem de continuidade;
- `N0`–`N4` permanecem internos e são apresentados como Fundamentos/Básico/Intermediário/Avançado/Domínio;
- home mostra somente métricas derivadas de catálogo + `ProgressService`;
- `Metodologia do curso` permanece acessível pelo rodapé;
- `Ajuda` permanece acessível como utilitário discreto no cabeçalho;
- Plano de estudos, Unidades, Revisões e Desempenho possuem destinos funcionais em vez de links decorativos;
- o redesign segue `docs/ui-ux.md` e `.ChatGPT/skills/student-ui-ux/SKILL.md`.

Validação:

- smoke DOM cobre home e todos os destinos de navegação;
- guard rails impedem reintrodução de `Ver plano de estudos` no hero e código de nível cru como rótulo público;
- screenshots 1440px, 768px e 390px inspecionadas;
- nenhuma regressão funcional observada em unidade/lição N0/N4.

## Estado de publicação do slice após P5

### N0-U01

```text
Renderer: HOMOLOGADO
Progresso: HOMOLOGADO
Mídia: MIDIA_OBRIGATORIA_PARA_ATIVIDADE ainda pendente para áudios controlados
Manifesto: BLOCKED somente pela mídia obrigatória local
```

A pendência é local e não impede P6/P7. P8 reconcilia a mídia obrigatória antes da publicação final.

### N4-U09

```text
Renderer: HOMOLOGADO
Progresso/pending: HOMOLOGADOS
Nova mídia humana obrigatória: nenhuma
Manifesto: READY
```

Produções abertas continuam `VALIDACAO_PENDENTE` quando exigem avaliador confiável. P6 poderá acrescentar feedback assistido, mas não converter isso automaticamente em domínio.

## Pendências abertas

```text
Global para iniciar P6: nenhuma
Local: áudios controlados obrigatórios de N0-U01
```

## Próximo marco — P6

Implementar:

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

Provider/model/API atuais devem ser verificados em documentação oficial durante P6.

## Condição de avanço

Um marco pode avançar com pendências locais não bloqueantes quando sua condição de saída estiver satisfeita e as pendências continuarem explícitas.

## Gate `CLÁSSICO HOMOLOGADO`

Só P9 pode satisfazer o gate. Nenhuma implementação de XP, missões, conquistas, streak ou progressão gamificada começa antes dele.
