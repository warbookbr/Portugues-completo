# Persistência e cálculo mecânico do progresso

## Objetivo

Este documento transforma as regras pedagógicas de `docs/progresso.md` em um contrato técnico suficiente para implementar `ProgressService`, sincronização por Gist e cálculo de conclusão.

Ele não redefine o significado pedagógico dos estados; apenas diz como representá-los e calculá-los.

## Fontes relacionadas

- `docs/progresso.md` — significado de progresso, evidência, domínio e gamificação;
- `docs/exercicios.md` — atividades e políticas de avaliação;
- `docs/contrato-conteudo.md` — normalização de conteúdo e `completion`;
- `docs/avaliacao-ia.md` — resultados assistidos por IA;
- `docs/arquitetura.md` — Gist por aluno e separação de credenciais.

## Princípio central

```text
estado salvo
→ fatos suficientes para reconstruir a situação do aluno

estado salvo
≠ cache de toda a interface
≠ log completo de tudo que aconteceu
```

O progresso deve ser compacto, explicável, migrável e sincronizável.

## Arquivo no Gist

Nome oficial:

```text
portugues-completo-progress.json
```

O Gist pertence ao próprio aluno.

A API key de IA nunca entra nesse arquivo.

## Schema de progresso — versão 1

Contrato alvo:

```json
{
  "schemaVersion": 1,
  "courseId": "portugues-completo",
  "curriculum": {
    "current": {
      "levelId": "N0",
      "unitId": "N0-U01",
      "lessonId": "N0-U01-L01"
    },
    "lessons": {},
    "verifications": {}
  },
  "evidence": {},
  "competencies": {},
  "review": {
    "queue": []
  },
  "responses": {},
  "gamification": null,
  "meta": {
    "createdAt": "2026-08-17T00:00:00-03:00",
    "updatedAt": "2026-08-17T00:00:00-03:00",
    "contentRevision": null
  }
}
```

## `curriculum.current`

Representa apenas o ponto recomendado para retomar.

Não significa que o aluno esteja proibido de abrir outra unidade.

Campos podem ser `null` quando ainda não há posição.

## `curriculum.lessons`

Mapa por ID de lição.

Exemplo:

```json
{
  "N0-U01-L01": {
    "status": "CONCLUIDA",
    "startedAt": "2026-08-17T10:00:00-03:00",
    "completedAt": "2026-08-17T10:12:00-03:00",
    "lastVisitedAt": "2026-08-17T10:12:00-03:00"
  }
}
```

Estados válidos:

```text
NAO_INICIADA
EM_ESTUDO
CONCLUIDA
```

`NAO_INICIADA` pode ser omitida do mapa para economizar dados.

## `curriculum.verifications`

Mapa de verificações de unidade/nível.

Exemplo:

```json
{
  "N0-U01-V01": {
    "status": "EM_ESTUDO",
    "attemptCount": 1,
    "clusterStates": {
      "auditoryAndModality": "DEMONSTRADA",
      "graphicSystem": "REVISAO_RECOMENDADA"
    },
    "lastAttemptAt": "2026-08-17T10:30:00-03:00"
  }
}
```

Uma verificação não precisa de um único percentual global.

## `evidence`

Mapa por referência estável de evidência.

Chave recomendada:

```text
<contentId>/<activityId>
```

Exemplo:

```json
{
  "N4-U09-L01/L01-A01": {
    "status": "VALIDACAO_PENDENTE",
    "attemptCount": 1,
    "lastAttemptAt": "2026-08-17T11:00:00-03:00",
    "support": {
      "hintUsed": false,
      "replayCount": 0,
      "rereadUsed": true,
      "consultationUsed": false
    },
    "feedbackRef": "N4-U09-L01/L01-A01@1"
  }
}
```

Estados válidos seguem `docs/progresso.md`:

```text
PRATICADA
DEMONSTRADA
VALIDACAO_PENDENTE
REVISAO_RECOMENDADA
```

Ausência da chave equivale a `NAO_OBSERVADA`.

## Tentativas

O arquivo não precisa salvar cada detalhe de todas as tentativas.

Por padrão, guardar:

- `attemptCount`;
- última tentativa;
- estado atual;
- dados mínimos de apoio relevantes;
- histórico somente quando necessário para revisão, recuperação ou auditoria pedagógica.

Quando histórico detalhado for necessário, usar uma lista limitada/compacta de eventos, não duplicar payloads extensos.

## `competencies`

Mapa por ID estável definido nos manifests de unidade/nível.

Exemplo:

```json
{
  "N0-U01-C01": {
    "status": "DEMONSTRADA",
    "evidenceRefs": [
      "N0-U01-L01/L01-A01",
      "N0-U01-V01/V01-Q01"
    ],
    "reviewRecommended": false,
    "updatedAt": "2026-08-17T10:30:00-03:00"
  }
}
```

Estados:

```text
NOVA
EM_DESENVOLVIMENTO
DEMONSTRADA
CONSOLIDADA
```

`NOVA` pode ser omitida até existir evidência.

## Cálculo de competência

A competência não é média simples de atividades.

Regra inicial:

```text
nenhuma evidência
→ NOVA

apenas prática / dificuldade / pendência
→ EM_DESENVOLVIMENTO

evidência obrigatória suficiente
→ DEMONSTRADA

nova evidência relevante posterior/transferência suficiente
→ CONSOLIDADA
```

Se uma evidência posterior indicar dificuldade significativa:

```text
histórico de DEMONSTRADA/CONSOLIDADA permanece
+ reviewRecommended = true
+ estado apresentado pode voltar a EM_DESENVOLVIMENTO quando a política da competência justificar
```

Não apagar a evidência histórica anterior.

## `review.queue`

Exemplo:

```json
{
  "queue": [
    {
      "id": "review:N0-U01-C01",
      "competencyId": "N0-U01-C01",
      "reason": "RECENT_DIFFICULTY",
      "sourceEvidenceRef": "N0-U01-V01/V01-Q01",
      "priority": "NORMAL",
      "createdAt": "2026-08-17T10:30:00-03:00",
      "lastReviewedAt": null
    }
  ]
}
```

### Razões iniciais

```text
RECENT_DIFFICULTY
REPEATED_SUPPORT
PREREQUISITE_WEAKNESS
TRANSFER_NEEDED
PENDING_RECOVERY
VOLUNTARY
```

### Prioridade

```text
LOW
NORMAL
HIGH
```

A prioridade é operacional, não nota de domínio.

Algoritmo fino de ordenação pode evoluir depois sem mudar o schema.

## `responses`

Somente atividades com `recordResponse: true` precisam preservar produção.

Exemplo:

```json
{
  "N4-U09-L01/L01-A01": {
    "type": "LONG_TEXT",
    "value": "...",
    "updatedAt": "2026-08-17T11:00:00-03:00",
    "revision": 1
  }
}
```

### Minimização

Não guardar resposta integral quando não for necessária para:

- retomar um rascunho;
- revisar uma produção;
- sustentar evidência declarada;
- reapresentar feedback relevante.

Para tarefas fechadas, resultado e estado normalmente bastam.

## Feedback persistido

Feedback detalhado pode ser salvo em `responses` ou em uma estrutura auxiliar somente quando precisa sobreviver entre dispositivos.

Referência recomendada:

```text
<contentId>/<activityId>@<revision>
```

O progresso pode salvar resumo de critérios e próximo passo sem preservar logs completos de IA.

## `gamification`

No modo Clássico, pode ser `null` se o aluno nunca ativou o Gamificado.

Após ativação:

```json
{
  "gamification": {
    "xp": 120,
    "startedAt": "2026-08-17T11:00:00-03:00",
    "achievements": [],
    "missions": {},
    "streak": {
      "current": 2,
      "best": 4,
      "lastStudyDate": "2026-08-17"
    }
  }
}
```

Valores exatos de XP e catálogo de conquistas/missões continuam configuráveis pela camada de gamificação.

### Regra de troca

```text
Clássico → Gamificado
→ cria/retoma gamification
→ não calcula XP retroativo

Gamificado → Clássico
→ preserva gamification
→ deixa de usá-lo na experiência atual
```

## Preferência de modo

A preferência `CLASSIC`/`GAMIFIED` é configuração de experiência e pode ficar em `localStorage`.

Ela não precisa ser duplicada no Gist para calcular o progresso pedagógico.

Se no futuro houver benefício claro em sincronizar essa preferência, ela poderá ser adicionada como perfil/configuração, não como requisito de domínio.

## Cálculo mecânico de uma atividade

Fluxo:

```text
aluno responde
→ renderer entrega resposta ao serviço de avaliação
→ avaliação local ou AiFeedbackService devolve resultado normalizado
→ ProgressService consulta evidence policy
→ grava evidência permitida
→ recalcula clusters/competências/revisão
```

## Resultado determinístico

```text
condição satisfeita
→ DEMONSTRADA quando evidence.role autoriza

condição não satisfeita
→ PRATICADA ou REVISAO_RECOMENDADA conforme política
```

`CHECK` de baixo peso pode não promover competência mesmo quando correto.

## Resultado por critérios

```text
critérios estruturais suficientes e política autoriza
→ DEMONSTRADA ou PRATICADA

critério essencial não observável automaticamente
→ VALIDACAO_PENDENTE quando a produção foi registrada
```

## Resultado assistido por IA

Aplicar `docs/avaliacao-ia.md`.

```text
mayPromoteEvidence = false
→ IA nunca promove para DEMONSTRADA

requiresReliableEvaluator = true
→ feedback pode existir
→ evidência fica VALIDACAO_PENDENTE
```

## Conclusão mecânica de lição

A lição é `CONCLUIDA` quando **todos os clusters obrigatórios** do `completion` normalizado estão satisfeitos segundo sua política.

### `DEMONSTRATED_REQUIRED`

Satisfeito somente por evidência `DEMONSTRADA` válida.

### `PENDING_ALLOWED`

Satisfeito para **percurso curricular** por:

```text
DEMONSTRADA
ou
VALIDACAO_PENDENTE
```

Mas `VALIDACAO_PENDENTE` não promove a competência correspondente para `DEMONSTRADA`.

### `ATTEMPT_REQUIRED`

Satisfeito quando a tentativa/resposta exigida foi registrada.

Pode ser usado para reflexão, processo de revisão ou produção cujo objetivo imediato é executar/documentar um processo, não validar qualidade global.

## Compatibilidade com conteúdo histórico

Exemplo N0:

```text
criterion: acertar C03 + 3/4 de A01
→ normalizador cria cluster DEMONSTRATED_REQUIRED
→ evaluator determinístico calcula o threshold
```

Exemplo N4:

```text
L01-A01 required
+ automaticValidation false
+ requiresReliableEvaluatorFor qualidade da interpretação
→ cluster PENDING_ALLOWED
→ resposta registrada = VALIDACAO_PENDENTE
→ lição pode ser CONCLUIDA como percurso
→ domínio continua pendente
```

O adapter deve traduzir a intenção curricular, não apenas procurar palavras fixas em strings de `completionRule`.

Quando um critério histórico existe somente como prosa e não pode ser normalizado com confiança, a unidade deve ficar `BLOCKED` para publicação até o contrato ser explicitado no manifesto/adapter correspondente.

## Conclusão de unidade

Uma unidade possui duas leituras distintas.

### Percurso da unidade

```text
todas as lições obrigatórias CONCLUIDAS
+ verificação obrigatória realizada conforme política de percurso
→ unidade percorrida
```

### Domínio/verificação da unidade

```text
todos os clusters obrigatórios da verificação
→ DEMONSTRADA
ou
→ estado explicitamente pendente onde avaliador confiável é necessário
```

A interface deve conseguir dizer:

```text
Unidade concluída
+ 1 evidência aguardando validação
```

em vez de escolher entre mentir que tudo foi dominado ou impedir o aluno de continuar indefinidamente.

## Conclusão de nível

Verificações de saída seguem a mesma lógica, mas seus clusters obrigatórios e não compensáveis têm autoridade maior.

```text
percurso do nível concluído
≠ saída do nível totalmente demonstrada
```

Se um cluster obrigatório depende de avaliador confiável:

```text
saída: VALIDACAO_PENDENTE
```

Não converter XP, quantidade de lições ou desempenho em outros clusters em compensação.

## Gates suaves

Por padrão:

```text
falta de domínio/pré-requisito
→ aviso + recomendação de revisão
→ conteúdo posterior continua explorável
```

O sistema pode destacar:

- “Recomendamos revisar antes de continuar”;
- “Você ainda tem evidências pendentes”;
- “Este conteúdo pressupõe X”.

### Gate duro

Só pode existir quando:

- a tarefa seria incompreensível/inexecutável sem pré-requisito;
- existe dependência técnica obrigatória;
- regra curricular explicitamente documentada exige bloqueio.

Gate duro nunca deve ser criado por XP, streak ou missão.

## Sincronização

Fluxo conceitual:

```text
carregar Gist
→ validar schemaVersion
→ normalizar/migrar se suportado
→ trabalhar localmente
→ salvar alterações
```

### Conflitos entre dispositivos

Não usar “último arquivo vence” cegamente quando isso puder apagar progresso.

Estratégia inicial:

- `meta.updatedAt` identifica revisão mais recente;
- mapas por ID permitem merge por entidade;
- para a mesma entidade, preservar estado pedagogicamente mais informativo quando não houver conflito real;
- respostas autorais conflitantes não devem ser mescladas automaticamente por concatenação;
- conflito de duas revisões diferentes da mesma resposta deve preservar ambas ou pedir escolha, não apagar silenciosamente uma delas.

A implementação do merge deve ter testes próprios antes de sincronização multi-dispositivo ser considerada confiável.

## Migração de schema

O `schemaVersion` do progresso é independente do schema de conteúdo.

```text
progress v1
→ migrateProgressV1ToV2
→ progress v2
```

Migrações devem:

- preservar evidência;
- preservar respostas registradas;
- preservar gamificação existente;
- nunca inventar domínio ausente;
- manter backup em memória durante a operação até a gravação nova ser confirmada.

## Falha de sincronização

Falha do GitHub/Gist não deve apagar progresso local da sessão.

```text
save remoto falha
→ manter estado local
→ informar sincronização pendente
→ permitir nova tentativa
```

A interface deve distinguir:

```text
progresso salvo localmente na sessão
progresso sincronizado no GitHub
```

sem afirmar sincronização que não ocorreu.

## Limites de dados

O Gist não é banco de telemetria.

Não armazenar:

- cada clique;
- tempo de mouse/scroll;
- logs completos de prompts/IA;
- API keys;
- cache de conteúdo curricular;
- cópias integrais de materiais da lição.

## IDs e estabilidade

Chaves de progresso dependem de IDs pedagógicos estáveis.

Renomear arquivo físico não deve quebrar progresso se o `id` interno permanecer igual.

Remover ou substituir um ID publicado exige estratégia de migração.

## Testes obrigatórios antes da implementação ser considerada pronta

O `ProgressService` deverá possuir testes para pelo menos:

- primeira abertura sem Gist;
- retomar lição em andamento;
- concluir atividade determinística;
- falhar e recuperar após revisão;
- registrar resposta aberta pending;
- concluir lição com `PENDING_ALLOWED` sem promover domínio;
- cluster não compensável;
- revisão que consolida competência;
- Clássico sem criar XP;
- ativar Gamificado sem XP retroativo;
- retornar ao Gamificado preservando XP anterior;
- falha de IA sem perder resposta;
- falha de sincronização sem perder estado local;
- conflito entre dispositivos;
- migração de schema.

## Regra de fechamento

O progresso persistido deve permitir reconstruir quatro respostas sem ambiguidade:

```text
onde o aluno parou?
→ curriculum

que evidências existem?
→ evidence + responses

o que está demonstrado/revisar/pendente?
→ competencies + review

o que pertence ao jogo?
→ gamification
```

Se a implementação precisar inferir essas respostas de um único número de XP ou de uma porcentagem geral, ela está fora do contrato.
