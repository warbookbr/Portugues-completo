# Skill: Classic Product Delivery

> **Escopo:** esta skill é destinada ao ChatGPT trabalhando na implementação/publicação do **Modo Clássico** do projeto `Portugues-completo`.

## Objetivo

Executar os marcos P1→P9 do Modo Clássico com continuidade, sem perder o ponto exato do desenvolvimento e sem confundir:

```text
implementação técnica
homologação pedagógica/funcional
mídia/material de apoio
prontidão de publicação
```

A fonte operacional do estado é `docs/estado-implementacao-classico.md`.

## Quando usar

Usar para qualquer trabalho material da fase de produto clássico, incluindo:

- schemas e validadores;
- `ContentService`/normalizadores/adapters;
- manifests e catálogo;
- renderer/telas/atividades;
- progresso, domínio, revisão e persistência;
- GitHub/Gist;
- feedback por IA;
- expansão N0→N4;
- ligação de mídia;
- homologação visual/funcional/pedagógica;
- prontidão de publicação;
- testes E2E do Clássico.

Não usar para implementar gamificação antes do gate `CLÁSSICO HOMOLOGADO`.

## Fontes obrigatórias de entrada

Antes de iniciar ou continuar um marco do Clássico:

```text
1. PROJECT_INDEX.md
2. docs/roadmap-produto.md
3. docs/estado-implementacao-classico.md
4. docs/execucao-continua.md
5. contratos específicos necessários ao item
6. producao-midia/README.md + FILA-MIDIA.md quando mídia puder afetar o item
7. .ChatGPT/skills/frontend-visual-check/SKILL.md quando houver interface visual
```

Contratos específicos podem incluir:

- `docs/arquitetura.md`;
- `docs/contrato-conteudo.md`;
- `docs/conteudo.md`;
- `docs/exercicios.md`;
- `docs/progresso.md`;
- `docs/persistencia-progresso.md`;
- `docs/avaliacao-ia.md`;
- `docs/calibracao-produto.md`.

Não ler documentação irrelevante por rotina se o estado e o item ativo já delimitarem claramente o trabalho.

## Regra de retomada

Uma instância sem contexto anterior deve conseguir continuar pelo repositório.

Fluxo obrigatório:

```text
ler Cursor operacional
→ identificar Marco ativo
→ identificar Item ativo
→ identificar Próximo passo exato
→ verificar blockers
→ ler contratos do item
→ continuar dali
```

Não assumir que “arquivo existe” significa “item concluído”.

Não inferir homologação a partir de implementação.

## Modelo de estado

Para cada inclusão relevante, manter separadamente:

```text
estado consolidado
estado técnico
estado de homologação
estado de mídia
estado de publicação
```

Os enums oficiais ficam em `docs/estado-implementacao-classico.md`.

Se o item ainda não existir no registro, criar um ID de implementação estável quando começar trabalho material.

## IDs de implementação

Formato recomendado:

```text
CL-P<marco>-<escopo-curto>
```

Exemplos:

```text
CL-P1-SCHEMA-LESSON
CL-P2-ADAPTER-VERIFICATION-V1
CL-P3-N0-U01-MANIFEST
CL-P4-RENDERER-OPEN-TEXT
CL-P5-GIST-SYNC
CL-P6-AI-FEEDBACK
CL-P7-N3-U06
CL-P8-N0-U01-L03-AUDIO
CL-P9-E2E-DEVICE-SWITCH
```

Não substituir IDs curriculares, de atividade ou `mediaId` por IDs de implementação.

## Loop de desenvolvimento

Dentro de um marco autorizado:

```text
1. ler estado atual
2. escolher próximo item/subpasso coerente
3. criar/atualizar registro do item
4. implementar
5. revisar contratos e regressões
6. testar/validar
7. classificar mídia e blockers
8. atualizar estado do item
9. branch/PR/CI/merge conforme fluxo seguro
10. verificar main
11. atualizar Cursor operacional
12. continuar se o marco autorizado não terminou
```

Não parar por microdecisões solucionáveis já cobertas pelos contratos.

## Política de mídia flexível

### Regra principal

```text
mídia pendente
≠ desenvolvimento global bloqueado
```

Quando faltar imagem, vídeo ou áudio:

1. verificar se TTS/texto/UI semântica resolve adequadamente;
2. se mídia humana for realmente necessária, confirmar/criar `mediaId` e fila;
3. implementar tudo que não dependa do arquivo final;
4. classificar o impacto no estado;
5. continuar itens independentes;
6. não declarar homologado/publicável o que realmente depende do estímulo ausente.

### O que pode ser implementado sem a mídia final

Quando tecnicamente útil:

- container/layout;
- renderer;
- ligação por `mediaId`;
- loading/erro/ausência;
- acessibilidade estrutural;
- navegação;
- persistência independente;
- placeholders informativos;
- testes que não afirmem validar o estímulo pedagógico final.

### O que não fazer

- gerar mídia fictícia para fingir que a dependência terminou;
- homologar discriminação sonora com TTS quando o contrato exige áudio controlado;
- marcar item `PUBLICAVEL` porque o placeholder aparece corretamente;
- parar um marco inteiro por uma dependência local de mídia;
- criar imagens/vídeos apenas para preencher ausência visual.

## Classificação de mídia

Aplicar os estados definidos no registro:

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

### Regra crítica

`MIDIA_OBRIGATORIA_PARA_ATIVIDADE` permite implementação técnica, mas impede homologação pedagógica daquela atividade até existir estímulo apropriado.

`MIDIA_OBRIGATORIA_PARA_PUBLICACAO` impede `PUBLICAVEL` enquanto a versão final não estiver validada/ligada.

## Placeholders

Placeholder precisa declarar claramente sua natureza no desenvolvimento.

Ele não deve:

- ser confundido com mídia final;
- carregar resposta implícita;
- alterar critérios pedagógicos;
- entrar silenciosamente em produção como recurso definitivo.

Quando o runtime final encontrar mídia obrigatória ausente, o comportamento deve ser explícito e seguro, não falhar de forma opaca.

## Homologação

### Homologação técnica

Verifica se a implementação funciona conforme contrato:

- carrega;
- renderiza;
- responde;
- persiste quando aplicável;
- trata erro;
- passa validadores/testes.

### Homologação pedagógica/funcional

Verifica se a experiência realmente ensina/avalia o que declara:

- estímulo correto;
- interação apropriada;
- feedback correto;
- evidência coerente;
- pending/revisão corretos;
- acessibilidade relevante preservada.

### Homologação visual

Quando houver UI, seguir `.ChatGPT/skills/frontend-visual-check/SKILL.md`.

Não declarar UI homologada apenas por inspeção de código.

## Regra de publicação

Um item só recebe `PUBLICAVEL` quando:

```text
implementação aplicável completa
+ homologação aplicável concluída
+ mídia obrigatória final resolvida
+ acessibilidade aplicável resolvida
+ referências/rotas/providers necessários válidos
+ nenhum blocker de publicação aberto
```

Mídia opcional pendente não torna automaticamente o item não publicável.

## Rastreamento de blockers

Registrar blockers localmente, com escopo exato.

Sempre responder:

```text
o que está bloqueado?
por quê?
o que pode continuar?
o que remove o blocker?
```

Não escrever apenas “aguardando mídia”. Informar `mediaId` quando existir e qual etapa ele impede.

## Atualização de estado em PR

Se uma PR muda materialmente o estado do Clássico, a própria branch deve atualizar `docs/estado-implementacao-classico.md`.

Antes do merge, revisar:

```text
[ ] IDs alterados registrados
[ ] estado técnico correto
[ ] homologação não superestimada
[ ] mídia classificada
[ ] blockers explícitos
[ ] publicação correta
[ ] evidência/PR referenciada quando útil
[ ] Cursor operacional aponta para o próximo passo real
[ ] marco atualizado se condição de saída mudou
```

A documentação de estado faz parte da entrega, não é um relatório opcional posterior.

## Trabalho parcial

Se o tempo/escopo terminar no meio de um item, não tentar esconder a parcialidade.

Registrar:

```text
Estado consolidado: EM_ANDAMENTO ou IMPLEMENTADO_COM_PENDENCIA
Último ponto estável:
O que falta:
Blockers:
Próximo passo exato:
```

Isso é preferível a marcar “feito” e obrigar a próxima instância a redescobrir a lacuna.

## Relação com o roadmap

`docs/roadmap-produto.md` define a condição de saída de cada P1→P9.

O registro de estado deve permitir responder se a condição já foi atingida.

Uma pendência não bloqueante pode atravessar marcos quando o roadmap permitir, desde que permaneça rastreada.

Exemplo:

```text
P4 renderer de áudio implementado
+ atividade específica depende de áudio humano ainda ausente
→ registrar pendência
→ continuar P4/P5 independentes
→ resolver mídia em P8
→ homologar item antes do gate P9
```

## Gate Clássico

Nenhuma implementação de XP, missão, conquista, streak ou progressão gamificada deve começar antes de `CLÁSSICO HOMOLOGADO`.

Durante P1→P9, `docs/calibracao-produto.md` pode registrar casos-âncora de esforço/recuperação para uso futuro, mas isso não vira economia de jogo.

## Pesquisa e fatos atuais

Quando o item depender de APIs, políticas ou comportamentos externos atuais, verificar fontes oficiais atuais antes de implementar.

Exemplo: detalhes atuais de autenticação/permissões GitHub para Gist devem ser confirmados no marco P5, não assumidos apenas de documentação antiga do projeto.

## Condições de parada

Seguir `docs/execucao-continua.md`.

Mídia pendente local normalmente **não é** condição de parada quando trabalho independente existe.

Parar quando:

- o marco autorizado terminou;
- existe decisão estrutural real não coberta pelos contratos;
- ação externa indispensável bloqueia todo trabalho restante dentro do escopo;
- há risco técnico não solucionável pelo fluxo seguro;
- seria necessário quebrar o gate Clássico/Gamificado.

## Relato ao usuário

No fim de um marco/submarco relevante, responder de forma curta:

- o que foi implementado;
- o que foi homologado;
- o que ficou parcial e por quê;
- mídia/blockers relevantes;
- PR/CI/merge;
- próximo passo exato.

Não chamar algo de “concluído” se o registro disser `IMPLEMENTADO_COM_PENDENCIA`.

## Regra final

O objetivo desta skill é que qualquer instância consiga olhar o repositório e distinguir com precisão:

```text
onde estamos
→ o que funciona
→ o que foi provado
→ o que ainda depende de material
→ o que pode continuar agora
→ o que falta para o Clássico ser homologado
```

Se isso não estiver reconstruível a partir do repositório, o trabalho operacional ainda não está devidamente registrado.
