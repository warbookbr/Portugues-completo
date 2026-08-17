# Execução contínua do desenvolvimento

## Objetivo

Este documento define como o ChatGPT pode executar **marcos inteiros de desenvolvimento** sem depender de autorizações repetidas como `prossiga`, `e agora?` ou `pode mergear` entre microetapas.

A execução contínua não significa fazer tudo de uma vez sem revisão. Significa encadear etapas de forma controlada até concluir o marco autorizado ou encontrar uma condição real de parada.

Aplica-se tanto a marcos curriculares quanto à fase de produto, usando a fonte de estado apropriada.

## Unidade de autorização

A autorização preferencial é um **marco**, não uma microtarefa.

Exemplos:

```text
execute o checkpoint global

conclua o dimensionamento da Unidade 4

implemente o P1 do Modo Clássico

conclua o renderer do slice autorizado
```

Quando um marco estiver autorizado, o ChatGPT pode avançar por seus subpassos internos, criar branches e PRs, corrigir problemas, acompanhar CI, fazer merges normais e atualizar o estado sem pedir nova confirmação a cada etapa.

## Escolha da fonte de estado

### Trabalho curricular

Usar principalmente:

```text
docs/roadmap-curricular.md
```

### Modo Clássico / produto

Usar em conjunto:

```text
docs/roadmap-produto.md
→ ordem/condições dos marcos

docs/estado-implementacao-classico.md
→ ponto exato de execução, itens, blockers e próximo passo
```

Para o Clássico, `.ChatGPT/skills/classic-product-delivery/SKILL.md` é o procedimento operacional especializado.

## Pipeline padrão

```text
1. ORIENTAR
→ ler PROJECT_INDEX.md
→ ler o roadmap aplicável
→ quando for Clássico, ler docs/estado-implementacao-classico.md
→ identificar marco autorizado, estado atual e condição de conclusão

2. PESQUISAR / VERIFICAR
→ decidir se pesquisa externa é necessária
→ consultar fontes confiáveis quando houver risco de lacuna, desatualização ou cobertura insuficiente
→ separar referência externa de decisão própria do projeto

3. PLANEJAR
→ decompor o marco em subpassos coerentes
→ verificar dependências, limites e fontes de verdade
→ escolher a granularidade adequada de PRs
→ no Clássico, criar/atualizar IDs de implementação conforme o trabalho real começar

4. ESCREVER / IMPLEMENTAR
→ produzir conteúdo, código ou documentação necessária
→ preservar contratos, IDs, estruturas e decisões já consolidadas
→ continuar partes independentes mesmo quando houver mídia pendente local

5. REVISAR
→ revisão pedagógica quando aplicável
→ revisão curricular/dependências quando aplicável
→ revisão de validade das evidências/avaliações
→ revisão de mídia, acessibilidade e implementação
→ no produto, distinguir implementação de homologação/publicação

6. CORRIGIR
→ aplicar melhorias identificadas antes de declarar a etapa concluída
→ distinguir claramente problema apenas identificado de problema realmente corrigido

7. VALIDAR
→ executar validadores/testes aplicáveis
→ abrir PR
→ acompanhar CI
→ corrigir falhas solucionáveis sem pedir autorização adicional
→ fazer validação visual quando exigida pelo frontend

8. INTEGRAR
→ verificar mergeabilidade
→ fazer merge normal quando CI e revisão estiverem satisfatórios
→ verificar a main após o merge

9. ATUALIZAR ESTADO
→ atualizar o roadmap aplicável quando o marco mudou
→ no Clássico, atualizar docs/estado-implementacao-classico.md na mesma PR que mudou materialmente o estado
→ registrar último item, pendências, blockers e próximo passo real

10. CONTINUAR
→ se o marco autorizado ainda não terminou e não existe condição de parada, iniciar o próximo subpasso automaticamente
```

## Quando pesquisar

Pesquisa externa não é obrigatória em toda etapa. Ela deve ser usada quando melhora materialmente a segurança ou a cobertura da decisão.

### Pesquisa normalmente obrigatória

- definição ou revisão de um nível inteiro;
- distribuição global de grandes domínios curriculares;
- dúvida relevante sobre progressão pedagógica ou cobertura;
- afirmação técnica, normativa ou linguística cuja precisão possa ter mudado;
- detalhes atuais de APIs, autenticação, permissões ou serviços externos necessários à implementação;
- comparação com referenciais confiáveis quando necessária para detectar lacunas.

### Pesquisa normalmente opcional

- desenvolvimento de uma lição cuja arquitetura/limites já estejam definidos;
- ajustes editoriais;
- continuidade de uma sequência local consolidada;
- implementação interna totalmente determinada pelos contratos atuais do repositório.

### Regra de uso da pesquisa

```text
fonte externa
→ informa e desafia o planejamento

fontes de verdade do projeto
→ registram a decisão adotada
```

Quando uma pesquisa produzir decisão duradoura, registrar a decisão na fonte oficial apropriada.

## Revisão em quatro passadas

### 1. Revisão pedagógica

Quando aplicável, verificar:

- objetivo claro;
- progressão de dificuldade;
- carga cognitiva;
- exemplos adequados;
- prática suficiente;
- ausência de atalhos que ensinem regra falsa.

### 2. Revisão curricular/contratual

Verificar:

- pré-requisitos;
- coerência com nível/área/unidade ou contrato técnico;
- limites do que ainda não deve entrar;
- duplicação/lacuna;
- compatibilidade com roadmap, schemas e arquitetura.

### 3. Revisão de evidência e avaliação

Verificar:

- se a atividade mede a competência declarada;
- se apoio entrega indevidamente a resposta;
- se acertos fechados mascaram produção necessária;
- se critérios não confundem velocidade/memorização/extensão com domínio;
- se respostas abertas não recebem precisão automática falsa;
- se mídia obrigatória ausente não produz homologação/domínio fictícios.

### 4. Revisão de implementação e suporte

Verificar:

- mídia realmente necessária;
- possibilidade de TTS/UI no lugar de produção humana;
- acessibilidade;
- IDs e dependências de mídia;
- compatibilidade com renderer/arquitetura;
- validações/testes;
- estado técnico versus homologação versus publicação.

## Política de trabalho parcial no Clássico

Se um item for tecnicamente implementado mas faltar mídia, homologação ou outro requisito, registrar a parcialidade em `docs/estado-implementacao-classico.md`.

Não usar um único `feito` para estados diferentes.

Exemplo:

```text
Estado técnico: IMPLEMENTADO
Homologação: BLOQUEADO_POR_DEPENDENCIA
Mídia: MIDIA_OBRIGATORIA_PARA_ATIVIDADE
Publicação: BLOQUEADO
Estado consolidado: IMPLEMENTADO_COM_PENDENCIA
```

Esse registro permite avançar itens independentes sem perder o ponto de retorno.

## Condições de parada

Durante um marco autorizado, **não parar por rotina**. PR, CI, correção de JSON, atualização de estado, pequenas decisões editoriais e ajustes locais fazem parte do trabalho normal.

Parar e pedir decisão do usuário somente quando ocorrer pelo menos uma destas situações:

1. existem duas ou mais direções estruturalmente relevantes, com trade-offs reais, e nenhuma é claramente superior pelas regras já aprovadas;
2. a solução exige mudar uma decisão curricular/arquitetural importante fora do escopo autorizado;
3. fontes confiáveis entram em conflito de forma que a escolha muda materialmente o projeto;
4. uma ação externa indispensável do usuário bloqueia a continuação e não pode ser substituída por uma dependência registrada;
5. há risco de perda, sobrescrita ou bypass de proteção não resolvível pelo fluxo normal branch + PR + CI;
6. o marco autorizado foi concluído.

### O que não deve parar o fluxo

- mídia obrigatória ainda não produzida quando há implementação independente a continuar;
- blocker local que não bloqueia o restante do marco;
- necessidade de corrigir erro encontrado na própria revisão;
- CI falhando por problema solucionável na branch;
- necessidade de abrir mais de uma PR para manter mudanças revisáveis;
- próximo subpasso já determinado pelo roadmap/registro e contido no marco autorizado.

## Granularidade de PR

Execução contínua não exige uma única PR gigante.

Preferir PRs que representem unidades lógicas revisáveis. Um marco pode conter várias PRs sequenciais, desde que o ChatGPT continue automaticamente depois de cada merge enquanto a autorização cobrir o marco.

Cada PR do Clássico que alterar materialmente estado deve incluir a atualização correspondente do registro operacional.

## Falhas e autocorreção

Se uma revisão ou CI revelar problema solucionável dentro do escopo:

```text
identificar
→ corrigir
→ revalidar
→ atualizar estado real
→ continuar
```

Não apresentar melhoria como implementada quando foi apenas identificada.

Se uma tentativa técnica falhar sem alterar o repositório, corrigir o procedimento e continuar. Registrar no relatório final somente falhas com consequência material ou limitação restante.

## Relatório ao usuário

Durante execução longa, atualizações intermediárias devem ser curtas e usadas quando ajudam a entender um marco ou correção relevante.

Ao concluir, reportar:

- marco/submarco concluído;
- mudanças realmente implementadas;
- o que foi homologado;
- pendências reais e seu impacto;
- PRs/CI/merges relevantes;
- próximo passo registrado.

Não chamar item com pendência registrada de “100% concluído”.

## Limite operacional

Execução contínua acontece **dentro da solicitação ativa**. O ChatGPT não continua trabalhando em segundo plano depois de terminar a resposta.

A finalidade deste protocolo é reduzir ativações manuais dentro de um marco: uma autorização ampla deve bastar até a conclusão do marco ou até surgir uma condição real de parada.
