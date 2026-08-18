# Skill: Classic Product Delivery

> **Escopo:** implementação/publicação do **Modo Clássico** do projeto `Portugues-completo`.

## Objetivo

Executar os marcos do Clássico com continuidade, sem perder o estado real e sem confundir:

```text
implementação técnica
homologação pedagógica/funcional
clareza para o aluno
mídia/material de apoio
prontidão de publicação
```

A fonte operacional é `docs/estado-implementacao-classico.md`.

## Quando usar

Usar para qualquer trabalho material da fase de produto clássico, incluindo schemas, normalização, catálogo, renderer, telas, atividades, progresso, revisão, persistência, GitHub/Gist, feedback por IA, expansão N0→N4, mídia e homologação E2E.

Não implementar gamificação antes do gate `CLÁSSICO HOMOLOGADO`.

## Fontes obrigatórias de entrada

Antes de iniciar/continuar um marco:

```text
1. PROJECT_INDEX.md
2. docs/roadmap-produto.md
3. docs/estado-implementacao-classico.md
4. plano transversal ativo, quando houver
5. docs/execucao-continua.md
6. contratos específicos necessários
7. .ChatGPT/skills/course-content-design/SKILL.md quando houver conteúdo pedagógico/texto público
8. .ChatGPT/skills/student-ui-ux/SKILL.md quando houver interface visível ao aluno
9. .ChatGPT/skills/frontend-visual-check/SKILL.md quando houver mudança visual
10. mídia quando aplicável
```

Contratos específicos podem incluir `docs/arquitetura.md`, `docs/contrato-conteudo.md`, `docs/conteudo.md`, `docs/exercicios.md`, `docs/progresso.md`, `docs/persistencia-progresso.md`, `docs/avaliacao-ia.md` e `docs/calibracao-produto.md`.

## Regra de retomada

Uma instância sem contexto deve conseguir continuar pelo repositório:

```text
ler Cursor operacional
→ identificar marco/plano ativo
→ identificar item ativo
→ identificar próximo passo exato
→ verificar blockers
→ ler contratos/skills do item
→ continuar dali
```

Não assumir que arquivo existente significa item concluído e não inferir homologação de implementação.

## Modelo de estado

Para cada inclusão relevante, distinguir:

```text
estado consolidado
estado técnico
estado de homologação
estado de mídia
estado de publicação
```

Se necessário, criar ID operacional estável `CL-P<marco>-<escopo>` ou ID transversal definido pelo plano ativo.

IDs operacionais não substituem IDs curriculares, de atividade ou `mediaId`.

## Loop de desenvolvimento

Dentro de marco autorizado:

```text
1. ler estado atual
2. escolher próximo item
3. registrar/atualizar item
4. implementar
5. revisar contratos, pedagogia, clareza e regressões
6. testar/validar
7. classificar mídia/blockers
8. atualizar estado
9. branch/PR/CI/merge
10. verificar main
11. atualizar Cursor operacional
12. continuar se o marco não terminou
```

Não parar por microdecisões já cobertas pelos contratos.

## Regra canônica para conteúdo e UI pública

Qualquer implementação que mostre conteúdo ao aluno deve obedecer às skills `course-content-design` e `student-ui-ux`.

### Duas camadas de linguagem

```text
INTERNA
→ técnica e precisa para objetivo, competência, evidência e runtime

PÚBLICA
→ clara, completa e simples para o aluno
```

Nunca interpolar automaticamente objetivo curricular técnico, enum, ID ou regra interna como explicação pública.

### Progressão natural

Ao materializar conteúdo, o renderer não deve tornar uma progressão ruim “aceitável” apenas porque ela renderiza.

Se validação revelar que o aluno recebe abstração antes de fundamento necessário:

```text
registrar como problema pedagógico/curricular
→ revisar a sequência pela skill curricular
→ compatibilizar IDs/progresso/manifests
→ só então homologar
```

Não resolver salto curricular apenas com CSS ou texto decorativo.

### Explicação para o aluno

Exigir:

```text
clara
+ completa
+ simples
+ exemplo cedo quando útil
+ termos ensinados antes de usados como pressuposto
```

Simples não significa raso; completo não significa técnico.

## Experiência canônica de lição

Primeira entrada, quando aplicável:

```text
← Voltar para a unidade

Lição
Título
Objetivo público simples

[ Começar lição ]
```

Antes de `Começar lição`, não despejar stepper, conteúdo, atividade, badges ou objetivo interno.

Depois do início:

```text
uma etapa principal por vez
→ conteúdo relacionado agrupado
→ prática/feedback local
→ Voltar / Avançar livres
→ sem microfragmentação
```

Retomada de lição iniciada deve poder retornar ao percurso sem obrigar repetição da apresentação.

## Compatibilidade em mudanças curriculares

Antes de alterar ordem/identidade de conteúdo publicado:

```text
mapear identidade semântica
→ progresso existente
→ competências/evidências
→ manifests/catalog
→ deep links
→ mídia
→ migração
```

Não reutilizar ID antigo para conteúdo semanticamente novo só para preservar aparência de compatibilidade.

Conclusão antiga não pode virar domínio de novo conteúdo por coincidência de ID.

## Política de mídia flexível

```text
mídia pendente
≠ desenvolvimento global bloqueado
```

Quando faltar mídia:

1. verificar se texto/TTS/UI semântica resolve;
2. se mídia humana for necessária, criar/reutilizar `mediaId` e fila;
3. implementar partes independentes;
4. classificar impacto;
5. não homologar/publicar a parte que realmente depende do estímulo ausente.

Estados usuais:

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

Placeholder não é mídia final nem evidência de homologação pedagógica.

## Homologação

### Técnica

Verifica carregamento, renderer, interação, persistência, erros, contratos e testes.

### Pedagógica/funcional

Verifica estímulo, prática, feedback, evidência, pending/revisão, acessibilidade e progressão.

### Clareza para o aluno

Verifica:

```text
texto público claro, completo e simples
termos não antecipados
uma ação principal por momento
nenhum objetivo interno cru
nenhuma abstração indevida na entrada
hierarquia visual compatível com a tarefa
```

### Visual

Seguir `frontend-visual-check`; inspeção de código não basta.

Um item visível ao aluno só pode ser considerado homologado quando técnica + pedagogia + clareza + visual aplicáveis estiverem satisfeitas.

## Regra de publicação

Um item só recebe `PUBLICAVEL` quando:

```text
implementação completa aplicável
+ homologação técnica
+ homologação pedagógica/clareza
+ mídia obrigatória resolvida
+ acessibilidade aplicável
+ referências/rotas/providers válidos
+ nenhum blocker de publicação
```

Mídia opcional pendente não impede publicação automaticamente.

## Blockers

Registrar sempre:

```text
o que está bloqueado?
por quê?
o que pode continuar?
o que remove o blocker?
```

Não escrever apenas “aguardando mídia” ou “aguardando conteúdo”.

## Atualização de estado em PR

Se uma PR muda materialmente o estado do Clássico, atualizar `docs/estado-implementacao-classico.md` na mesma mudança.

Antes do merge, revisar:

```text
[ ] IDs/migração registrados quando aplicável
[ ] estado técnico correto
[ ] homologação não superestimada
[ ] clareza pedagógica revisada
[ ] mídia classificada
[ ] blockers explícitos
[ ] publicação correta
[ ] Cursor operacional aponta para o próximo passo real
[ ] roadmap/plano atualizado se o estado mudou
```

## Trabalho parcial

Se o escopo parar no meio:

```text
Estado consolidado: EM_ANDAMENTO ou IMPLEMENTADO_COM_PENDENCIA
Último ponto estável:
O que falta:
Blockers:
Próximo passo exato:
```

Não marcar “feito” para esconder parcialidade.

## Relação com roadmap e planos transversais

`docs/roadmap-produto.md` define ordem/condições dos marcos. Se um plano transversal estiver explicitamente ativo e marcado como precedente a um marco, respeitar essa precedência até homologação do plano.

Uma pendência não bloqueante pode atravessar marcos quando documentada e permitida.

## Gate Clássico

Nenhuma implementação de XP, missões, conquistas, streak ou progressão gamificada antes de `CLÁSSICO HOMOLOGADO`.

`docs/calibracao-produto.md` pode registrar casos-âncora, mas isso não vira economia de jogo antecipada.

## Pesquisa e fatos atuais

Quando depender de APIs, políticas ou comportamento externo atual, verificar fontes oficiais atuais antes de implementar.

## Condições de parada

Seguir `docs/execucao-continua.md`.

Parar quando:

- marco autorizado terminou;
- existe decisão estrutural real não coberta pelos contratos;
- ação externa indispensável bloqueia todo o trabalho restante;
- há risco técnico não solucionável pelo fluxo seguro;
- seria necessário quebrar o gate Clássico/Gamificado.

Mídia local não bloqueante, CI corrigível e PR rotineira não são condições de parada.

## Relato ao usuário

Ser curto e operacional:

- o que foi implementado;
- o que foi homologado;
- o que ficou parcial;
- blockers relevantes;
- PR/CI/merge;
- próximo passo.

## Regra final

O Clássico só é produto-base de qualidade quando **funciona, ensina na ordem certa e fala com o aluno de forma clara, completa e simples**.