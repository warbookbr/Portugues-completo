# Estado de implementação do Modo Clássico

## Objetivo

Este documento é o **registro operacional canônico** do desenvolvimento do Modo Clássico do Português Completo.

Ele existe para responder, sem depender da conversa anterior:

```text
onde o desenvolvimento parou?
o que já foi implementado?
o que está apenas parcialmente pronto?
o que ainda precisa de homologação?
qual item depende de mídia/material de apoio?
qual blocker impede publicação?
qual é o próximo passo exato?
```

`docs/roadmap-produto.md` define **a ordem e os marcos**. Este documento registra **o estado concreto dentro desses marcos**.

A regra central é:

```text
implementado tecnicamente
≠ homologado pedagogicamente
≠ publicável
```

Nenhum desses estados deve ser inferido a partir de outro.

## Fontes relacionadas

- `docs/roadmap-produto.md` — sequência P1→P9 até o gate `CLÁSSICO HOMOLOGADO`.
- `docs/conteudo.md` — composição pedagógica e política de mídia flexível.
- `docs/contrato-conteudo.md` — publicação/runtime.
- `docs/exercicios.md` — atividades e evidência.
- `docs/progresso.md` — progresso/domínio/revisão.
- `docs/persistencia-progresso.md` — persistência/Gist.
- `docs/avaliacao-ia.md` — feedback com IA.
- `producao-midia/README.md` — produção e criticidade de mídia.
- `producao-midia/FILA-MIDIA.md` — fila concreta de mídia.
- `.ChatGPT/skills/classic-product-delivery/SKILL.md` — procedimento obrigatório para uma IA executar o Modo Clássico sem perder estado.

## Regra de atualização

Toda PR que altere materialmente o estado de implementação do Clássico deve revisar este documento **na mesma PR**.

Isso inclui, por exemplo:

- novo schema/validator;
- novo adapter/normalizador;
- nova unidade publicada no catálogo;
- novo tipo de atividade suportado;
- nova tela/renderer;
- progresso/revisão/persistência;
- integração de IA;
- nova mídia ligada ao runtime;
- homologação de atividade/lição/unidade;
- descoberta ou remoção de blocker;
- mudança do próximo item ativo.

Correção puramente editorial que não altera estado não precisa mudar este arquivo.

## Cursor operacional

Este bloco deve permanecer curto e atualizado.

```text
Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco ativo: P1 — Schemas e contratos executáveis
Item ativo: ainda não iniciado
Último item concluído: documentação/contratos de produto e política de execução
Próximo passo exato: selecionar fixtures reais N0/N4 e materializar os contratos em schemas + validator
Blocker atual do próximo passo: nenhum
Gate final do Clássico: NÃO SATISFEITO
```

Sempre que o trabalho parar no meio de um item, `Item ativo` e `Próximo passo exato` devem permitir que outra instância continue sem reconstruir a história da conversa.

## Estados consolidados de item

Usar somente estes estados para leitura rápida:

```text
NAO_INICIADO
EM_ANDAMENTO
IMPLEMENTADO_COM_PENDENCIA
PRONTO_PARA_HOMOLOGAR
HOMOLOGADO
PUBLICAVEL
BLOQUEADO
```

### `NAO_INICIADO`

Existe no plano, mas ainda não houve implementação material.

### `EM_ANDAMENTO`

Há implementação parcial ativa e ainda faltam partes técnicas previstas no próprio item.

### `IMPLEMENTADO_COM_PENDENCIA`

A parte técnica principal existe, mas o item não pode avançar de estado por alguma dependência explícita.

Exemplos:

- mídia obrigatória ainda ausente;
- tipo de estímulo final ainda não disponível;
- avaliação externa necessária;
- dependência de outro marco;
- homologação ainda impossível por recurso ausente.

### `PRONTO_PARA_HOMOLOGAR`

Implementação necessária está completa para o escopo e não existe blocker conhecido que impeça testar o comportamento real.

### `HOMOLOGADO`

O item foi testado no escopo declarado e cumpriu os critérios técnicos/pedagógicos aplicáveis.

`HOMOLOGADO` não significa automaticamente `PUBLICAVEL`.

### `PUBLICAVEL`

Além de homologado, todos os blockers de publicação aplicáveis foram resolvidos, inclusive mídia obrigatória final, acessibilidade e ligações externas necessárias.

### `BLOQUEADO`

O trabalho não consegue avançar naquele item sem resolver uma dependência material.

O blocker deve ser registrado explicitamente. Não usar `BLOQUEADO` para uma mídia que só bloqueia uma parte específica enquanto o restante pode avançar.

## Dimensões obrigatórias de rastreamento

O estado consolidado é apenas resumo. Cada item relevante deve manter as dimensões abaixo separadas.

### 1. Estado técnico

```text
NAO_INICIADO
EM_IMPLEMENTACAO
IMPLEMENTADO
BLOQUEADO_TECNICO
```

Responde: **o código/estrutura necessário existe?**

### 2. Estado de homologação

```text
NAO_AVALIADO
HOMOLOGACAO_PARCIAL
PRONTO_PARA_HOMOLOGAR
HOMOLOGADO
BLOQUEADO_POR_DEPENDENCIA
```

Responde: **já provamos que funciona corretamente no uso real declarado?**

### 3. Estado de mídia/material de apoio

```text
SEM_DEPENDENCIA
MIDIA_OPCIONAL_PENDENTE
MIDIA_PENDENTE_NAO_BLOQUEANTE
MIDIA_OBRIGATORIA_PARA_ATIVIDADE
MIDIA_OBRIGATORIA_PARA_PUBLICACAO
MIDIA_PRONTA_PARA_VALIDAR
MIDIA_VALIDADA
MIDIA_PUBLICADA
```

Responde: **a ausência de material de apoio muda o que pode ser homologado/publicado?**

### 4. Estado de publicação

```text
NAO_AVALIADO
NAO_APLICAVEL
BLOQUEADO
APTO
```

Responde: **este item pode fazer parte da experiência pública final?**

## Política de mídia flexível

### Princípio

```text
mídia pendente
→ bloquear apenas o que depende pedagogicamente dela
→ continuar todo trabalho independente
```

A ausência de conteúdo de apoio **não paralisa o desenvolvimento do Modo Clássico**.

### `SEM_DEPENDENCIA`

O item não necessita mídia humana/curada.

TTS, texto ou UI semântica podem ser suficientes.

### `MIDIA_OPCIONAL_PENDENTE`

A mídia melhora a experiência, mas sua ausência não prejudica o ensino/avaliação essencial.

O item pode ser homologado e, se todos os demais requisitos estiverem satisfeitos, pode ser publicável sem essa mídia.

### `MIDIA_PENDENTE_NAO_BLOQUEANTE`

Existe `mediaId`, posição e contrato, mas a implementação independente pode continuar.

Usar quando a mídia será adicionada depois e ainda não chegou o momento de decidir homologação/publicação final da parte dependente.

### `MIDIA_OBRIGATORIA_PARA_ATIVIDADE`

A mídia é o próprio estímulo necessário para ensinar/avaliar corretamente.

Exemplos:

- discriminação de dois sons controlados;
- análise de entonação específica;
- interpretação de vídeo/imagem cujo conteúdo é indispensável à resposta.

Neste caso:

```text
estrutura técnica pode estar IMPLEMENTADA
+ placeholder pode existir
+ navegação pode funcionar

mas

atividade não pode ser HOMOLOGADA pedagogicamente
sem o estímulo final apropriado
```

### `MIDIA_OBRIGATORIA_PARA_PUBLICACAO`

O fluxo já pode ter sido testado tecnicamente/pedagogicamente com recurso apropriado de validação, mas a versão final validada ainda não está publicada/ligada ao curso.

Bloqueia `PUBLICAVEL`, não necessariamente toda homologação anterior.

### Estados finais da mídia

`MIDIA_PRONTA_PARA_VALIDAR`, `MIDIA_VALIDADA` e `MIDIA_PUBLICADA` devem corresponder à fila oficial de produção quando houver `mediaId`.

Não duplicar a fila completa neste documento; registrar somente o vínculo e seu impacto no item de produto.

## Placeholders e fallback

Placeholder é uma ferramenta de desenvolvimento, não uma forma de fingir conclusão.

Quando mídia obrigatória estiver ausente, o produto pode implementar:

- container/layout final;
- estados de loading/erro/ausência;
- acessibilidade estrutural;
- ligação por `mediaId`;
- renderer do tipo;
- lógica independente do estímulo;
- fallback informativo que não invente conteúdo pedagógico.

Não usar placeholder genérico para homologar uma discriminação/percepção que depende do estímulo real.

## Registro de item

Cada nova inclusão relevante deve poder ser rastreada com este formato:

```text
ID:
Escopo:
Marco:
Descrição:
Estado consolidado:
Estado técnico:
Estado de homologação:
Estado de mídia:
Estado de publicação:
Dependências/mediaIds:
Blockers:
Evidência de validação:
PR/commit de referência:
Última atualização:
Próximo passo:
```

### IDs de implementação

Usar IDs estáveis no registro, por exemplo:

```text
CL-P1-SCHEMA-COURSE
CL-P2-ADAPTER-LESSON-V1
CL-P3-UNIT-N0-U01
CL-P4-RENDERER-MULTIPLE-CHOICE
CL-P5-REVIEW-QUEUE
CL-P6-AI-FEEDBACK-OPEN-TEXT
CL-P7-N2-U04
CL-P8-MEDIA-N0-U01-L03-AUD-001
CL-P9-E2E-RESUME
```

O ID de implementação não substitui IDs curriculares ou `mediaId`; ele serve para rastrear o trabalho de produto.

## Registro atual de marcos

| Marco | Estado | Observação | Próximo critério de avanço |
|---|---|---|---|
| P1 — Schemas e contratos executáveis | `NAO_INICIADO` | próximo marco oficial | schemas + validator + fixtures N0/N4 validados |
| P2 — ContentService/normalizador | `NAO_INICIADO` | depende de P1 | slice N0/N4 normalizado |
| P3 — Manifests e catálogo inicial | `NAO_INICIADO` | depende de P2 | unidades do slice descobríveis pelo catálogo |
| P4 — Renderer real do Clássico | `NAO_INICIADO` | depende do runtime do slice | conteúdo/atividades do slice renderizados e testáveis |
| P5 — ProgressService/revisão/Gist | `NAO_INICIADO` | núcleo pedagógico clássico | progresso/revisão/persistência homologados no slice |
| P6 — Feedback por IA no Clássico | `NAO_INICIADO` | BYOK; não bloqueia determinísticos | feedback opt-in e fallback homologados |
| P7 — Ampliação N0→N4 | `NAO_INICIADO` | após pipeline provado | catálogo clássico cobre escopo N0→N4 |
| P8 — Mídia/prontidão de publicação | `NAO_INICIADO` | resolve blockers obrigatórios | itens clássicos publicáveis no escopo |
| P9 — Homologação E2E | `NAO_INICIADO` | gate final | `CLÁSSICO HOMOLOGADO` |

## Registro de itens ativos/concluídos

No início deste protocolo ainda não existe implementação P1 concluída.

O primeiro item deve ser criado quando P1 começar. Não preencher artificialmente dezenas de itens futuros apenas para completar tabela.

Princípio:

```text
registrar trabalho real
≠ inventariar antecipadamente tudo o que talvez exista
```

## Blockers

Todo blocker aberto deve informar:

```text
ID do item afetado
Tipo: TECNICO | MIDIA | EXTERNO | HOMOLOGACAO | PUBLICACAO
Descrição objetiva
O que ele realmente bloqueia
O que pode continuar apesar dele
Ação necessária para remover
```

### Regra de escopo do blocker

Nunca promover blocker local a blocker global sem necessidade.

Exemplo correto:

```text
áudio obrigatório ausente em N0-U01-L03
→ bloqueia homologação/publicação daquela atividade
→ NÃO bloqueia implementação de N0-U01-L04
→ NÃO bloqueia renderer de outras atividades
→ NÃO bloqueia P1/P2/P3 independentes
```

## Evidência de validação

`HOMOLOGADO` ou `PUBLICAVEL` deve ter alguma evidência reconstruível, conforme o tipo:

- CI/validator;
- teste automatizado;
- teste manual documentado;
- screenshot/validação visual quando aplicável;
- teste desktop/tablet/mobile;
- exercício realizado com resultado esperado;
- mídia validada e ligada;
- fluxo E2E;
- PR/commit onde a homologação foi registrada.

Não exigir burocracia desnecessária, mas evitar estados finais sem nenhuma base rastreável.

## Atualização após PR

Quando uma PR do Clássico for integrada:

```text
1. identificar quais IDs de implementação mudaram
2. atualizar estados por dimensão
3. registrar blockers novos/removidos
4. registrar mediaIds relevantes
5. registrar PR/commit/evidência quando útil
6. atualizar Cursor operacional
7. atualizar tabela do marco se a condição mudou
8. só então declarar o subpasso concluído
```

Se a PR termina com trabalho parcial, isso deve aparecer explicitamente.

Exemplo:

```text
CL-P4-AUDIO-STIMULUS
Estado consolidado: IMPLEMENTADO_COM_PENDENCIA
Estado técnico: IMPLEMENTADO
Homologação: BLOQUEADO_POR_DEPENDENCIA
Mídia: MIDIA_OBRIGATORIA_PARA_ATIVIDADE
Publicação: BLOQUEADO
mediaId: N0-U01-L03-AUD-001
Próximo passo: produzir/validar/publicar estímulo e repetir homologação pedagógica
```

## Condição para avançar de marco

Um marco não precisa ter zero pendências históricas de qualquer tipo para o desenvolvimento continuar.

Ele precisa satisfazer **a condição de saída definida em `docs/roadmap-produto.md`**.

Pendências que não bloqueiam o próximo marco permanecem registradas e são retomadas no ponto apropriado, especialmente P8/P9.

Isso permite:

```text
avanço contínuo
+
pendências rastreadas
+
nenhuma falsa conclusão
```

## Gate `CLÁSSICO HOMOLOGADO`

O gate só pode ser marcado como satisfeito quando P9 confirmar os critérios de `docs/roadmap-produto.md`.

Uma lista de mídia opcional pendente não impede necessariamente o gate.

Uma atividade obrigatória do percurso com `MIDIA_OBRIGATORIA_PARA_ATIVIDADE` ainda sem homologação ou um blocker de publicação obrigatório impede o gate quando estiver dentro do escopo final aprovado.

## Regra para futuras instâncias de IA

Ao assumir desenvolvimento do Clássico sem contexto de conversa:

```text
1. ler PROJECT_INDEX.md
2. ler docs/roadmap-produto.md
3. ler este documento
4. ler .ChatGPT/skills/classic-product-delivery/SKILL.md
5. localizar Marco ativo + Item ativo + Próximo passo exato
6. ler apenas os contratos necessários ao item
7. continuar dali
8. atualizar este documento na mesma PR quando o estado mudar
```

Não reconstruir o estado por suposição a partir do número de arquivos existentes.

## Regra final

O projeto deve sempre conseguir diferenciar:

```text
feito
parcialmente feito
feito tecnicamente mas sem mídia
pronto para testar
homologado
publicável
bloqueado
```

Se uma nova inclusão não puder ser colocada com clareza em uma dessas situações, o registro precisa ser melhorado antes de chamar o trabalho de concluído.
