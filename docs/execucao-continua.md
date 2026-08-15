# Execução contínua do desenvolvimento curricular

## Objetivo

Este documento define como o ChatGPT pode executar **marcos inteiros de desenvolvimento** sem depender de autorizações repetidas como `prossiga`, `e agora?` ou `pode mergear` entre microetapas.

A execução contínua não significa fazer tudo de uma vez sem revisão. Significa encadear etapas de forma controlada até concluir o marco autorizado ou encontrar uma condição real de parada.

## Unidade de autorização

A autorização preferencial é um **marco**, não uma microtarefa.

Exemplos:

```text
execute o checkpoint global

conclua o dimensionamento da Unidade 4

desenvolva a Unidade 4 completa

revise e feche o Nível 1 em M1
```

Quando um marco estiver autorizado, o ChatGPT pode avançar por seus subpassos internos, criar branches e PRs, corrigir problemas, aguardar CI, fazer merges normais e atualizar o roadmap sem pedir nova confirmação a cada etapa.

## Pipeline padrão

```text
1. ORIENTAR
→ ler PROJECT_INDEX.md
→ ler docs/roadmap-curricular.md
→ identificar o marco autorizado, estado atual e condição de conclusão

2. PESQUISAR / VERIFICAR
→ decidir se pesquisa externa é necessária
→ consultar fontes confiáveis quando houver risco de lacuna, desatualização ou cobertura insuficiente
→ separar referência externa de decisão curricular própria

3. PLANEJAR
→ decompor o marco em subpassos coerentes
→ verificar dependências, limites e fontes de verdade
→ escolher a granularidade adequada de PRs

4. ESCREVER / IMPLEMENTAR
→ produzir o conteúdo ou documentação necessária
→ preservar contratos, IDs, estruturas e decisões já consolidadas

5. REVISAR
→ revisão pedagógica
→ revisão de coerência curricular e dependências
→ revisão de validade das evidências/avaliações
→ revisão de mídia, acessibilidade e implementação

6. CORRIGIR
→ aplicar as melhorias identificadas antes de declarar a etapa concluída
→ distinguir claramente problema apenas identificado de problema realmente corrigido

7. VALIDAR
→ executar validadores aplicáveis
→ abrir PR
→ acompanhar CI
→ corrigir falhas solucionáveis sem pedir autorização adicional

8. INTEGRAR
→ verificar mergeabilidade
→ fazer merge normal quando CI e revisão estiverem satisfatórios
→ verificar a main após o merge

9. ATUALIZAR ESTADO
→ atualizar docs/roadmap-curricular.md quando o avanço curricular mudou
→ registrar o último marco e o próximo subpasso interno

10. CONTINUAR
→ se o marco autorizado ainda não terminou e não existe condição de parada, iniciar o próximo subpasso automaticamente
```

## Quando pesquisar

Pesquisa externa não é obrigatória em toda lição. Ela deve ser usada quando melhora materialmente a segurança ou a cobertura da decisão.

### Pesquisa normalmente obrigatória

- definição ou revisão de um nível inteiro;
- distribuição global de grandes domínios como ortografia, morfologia, sintaxe, interpretação, produção textual, argumentação, gêneros, registro e variação;
- dúvida relevante sobre progressão pedagógica ou cobertura curricular;
- afirmação técnica, normativa ou linguística cuja precisão possa ter mudado ou que não esteja bem sustentada pela documentação interna;
- comparação com referenciais curriculares, linguísticos ou educacionais para detectar lacunas.

### Pesquisa normalmente opcional

- desenvolvimento de uma lição cuja arquitetura, limites e exemplos já estejam bem definidos pelas fontes internas;
- ajustes editoriais;
- continuidade de uma sequência local já consolidada.

### Regra de uso da pesquisa

```text
fonte externa
→ informa e desafia o planejamento

fontes de verdade do projeto
→ registram a decisão adotada
```

Não copiar a estrutura de uma fonte externa mecanicamente. Usar pesquisa para verificar cobertura, dependências, terminologia e progressão; depois sintetizar uma solução coerente com o projeto.

Quando uma pesquisa produzir uma decisão duradoura, registrar a decisão na fonte oficial apropriada. Não transformar o repositório em arquivo de notas de pesquisa sem necessidade.

## Revisão em quatro passadas

### 1. Revisão pedagógica

Verificar:

- objetivo claro;
- progressão de dificuldade;
- carga cognitiva;
- exemplos adequados;
- prática suficiente;
- ausência de atalhos que ensinem uma regra falsa.

### 2. Revisão curricular

Verificar:

- pré-requisitos;
- coerência com nível, área e unidade;
- limites do que ainda não deve entrar;
- duplicação ou lacuna com etapas anteriores/posteriores;
- compatibilidade com a matriz global de progressão.

### 3. Revisão de evidência e avaliação

Verificar:

- se a atividade mede a competência declarada;
- se uma modalidade de apoio entrega a resposta;
- se acertos fechados estão mascarando ausência de produção necessária;
- se critérios de conclusão são observáveis e não confundem velocidade, memorização ou extensão com domínio;
- se respostas abertas não recebem precisão automática que o sistema não consegue sustentar.

### 4. Revisão de implementação e suporte

Verificar:

- mídia realmente necessária;
- possibilidade de TTS ou UI no lugar de produção humana;
- acessibilidade;
- IDs e dependências de mídia;
- compatibilidade com renderer e arquitetura;
- validações e estrutura de arquivos.

## Condições de parada

Durante um marco autorizado, **não parar por rotina**. PR, CI, correção de JSON, atualização de roadmap, pequenas decisões editoriais e ajustes de exemplos fazem parte do trabalho normal.

Parar e pedir decisão do usuário somente quando ocorrer pelo menos uma destas situações:

1. existem duas ou mais direções estruturalmente relevantes, com trade-offs reais, e nenhuma é claramente superior pelas regras já aprovadas;
2. a solução exige mudar uma decisão curricular ou arquitetural importante fora do escopo do marco autorizado;
3. fontes confiáveis entram em conflito de forma que a escolha muda materialmente o curso;
4. uma ação externa indispensável do usuário bloqueia a continuação e não pode ser substituída por uma dependência registrada;
5. há risco de perda, sobrescrita ou bypass de proteção que não pode ser resolvido pelo fluxo normal de branch + PR + CI;
6. o marco autorizado foi concluído.

### O que não deve parar o fluxo

- mídia obrigatória ainda não produzida, quando o contrato permite continuar autoria/implementação independente;
- necessidade de corrigir um erro encontrado na própria revisão;
- CI falhando por problema solucionável na branch;
- necessidade de abrir mais de uma PR para manter mudanças revisáveis;
- próximo subpasso já determinado pelo roadmap e contido no marco autorizado.

## Granularidade de PR

Execução contínua não exige uma única PR gigante.

Preferir PRs que representem unidades lógicas revisáveis. Um marco pode conter várias PRs sequenciais, desde que o ChatGPT continue automaticamente depois de cada merge.

Exemplo:

```text
CHECKPOINT GLOBAL
→ PR: Nível 1 M1
→ merge
→ PR: Nível 2 M1
→ merge
→ PR: Nível 3 M1
→ merge
→ PR: Nível 4 M1
→ merge
→ PR: matriz global + revisão cruzada
→ merge
→ marco concluído
```

## Falhas e autocorreção

Se uma revisão ou CI revelar um problema solucionável dentro do escopo:

```text
identificar
→ corrigir
→ revalidar
→ continuar
```

Não apresentar uma melhoria como implementada quando ela foi apenas identificada.

Se uma tentativa técnica falhar sem alterar o repositório, corrigir o procedimento e continuar. Registrar no relatório final somente falhas que tenham consequência material ou que expliquem uma limitação restante.

## Relatório ao usuário

Durante execução longa, atualizações intermediárias devem ser curtas e usadas apenas quando ajudam a entender um marco importante ou uma correção relevante.

Ao concluir, reportar:

- marco concluído;
- mudanças realmente implementadas;
- PRs/CI/merges relevantes;
- pendências reais;
- próximo marco registrado no roadmap.

Não transformar o relatório em reprodução de todo o processo interno.

## Limite operacional

Execução contínua acontece **dentro da solicitação ativa**. O ChatGPT não continua trabalhando em segundo plano depois de terminar a resposta.

A finalidade deste protocolo é reduzir ativações manuais dentro de um marco: uma autorização ampla deve bastar até a conclusão do marco ou até surgir uma condição real de parada.
