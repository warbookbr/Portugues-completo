# Skill: Student UI/UX

> **Escopo:** qualquer trabalho de interface visível ao aluno no projeto `Portugues-completo`.

## Objetivo

Garantir que a aplicação use linguagem humana, hierarquia clara e apresentação pedagógica, sem vazar códigos internos para a experiência do aluno e sem introduzir controles redundantes que aumentem carga cognitiva.

Fonte canônica: `docs/ui-ux.md`.

## Regra central

> **A interface fala a linguagem do aluno; a infraestrutura fala a linguagem do sistema.**

IDs, enums, códigos curriculares, nomes de schema e estados de máquina podem existir internamente, mas não devem ser impressos diretamente na UI quando não forem pedagogicamente úteis.

## Quando usar

Usar ao criar, revisar ou alterar:

- home/dashboard;
- navegação;
- cards de unidade/lição;
- progresso e revisão;
- atividades e feedback;
- estados de mídia;
- configurações;
- IA/feedback;
- mensagens de erro;
- qualquer rótulo, badge ou texto gerado a partir do runtime.

## Leitura obrigatória

Antes de trabalho visual relevante:

```text
docs/ui-ux.md
+ .ChatGPT/skills/frontend-visual-check/SKILL.md
+ contrato específico da tela/estado
```

## Tradução obrigatória

Preferir:

```text
N0-U01-L04 → Fundamentos / Unidade 1 / Lição 4
VALIDACAO_PENDENTE → Aguardando avaliação
REVISAO_RECOMENDADA → Revisão recomendada
BLOCKED por mídia → Material necessário ainda não disponível
```

Nunca usar automaticamente o valor cru do runtime como texto público.

## Hierarquia e redundância

Antes de adicionar um botão, link, card de ação ou atalho, verificar se a mesma função já está claramente disponível na navegação ou em outro controle simultaneamente visível.

```text
mesmo destino + mesma função + sem benefício contextual
→ não duplicar
```

Uma repetição só deve permanecer quando reduzir esforço de forma contextual e justificável.

Decisão aprovada para a home do Clássico:

```text
navegação principal
→ Início | Plano de estudos | Unidades | Revisões | Desempenho

sidebar duplicando esses destinos
→ não usar

Plano de estudos
→ somente na navegação superior

hero introdutório
→ não usar
→ a home começa diretamente pelo estado acionável do aluno

Continue estudando / Comece por aqui
→ concentra o único CTA principal
→ "Continuar de onde parou" ou "Começar a estudar"

Metodologia
→ fora da navegação principal
→ acesso pelo rodapé como "Metodologia do curso"

Ajuda
→ fora da navegação principal
→ utilitário discreto no cabeçalho
```

## Fluxo guiado de lição

Lições longas não devem mostrar todos os blocos simultaneamente quando isso aumenta ruído e reduz foco.

Padrão aprovado:

```text
uma etapa principal por vez
→ Observe / Entenda / Pratique / Consolide
→ blocos relacionados agrupados em quantidade moderada
→ Voltar / Avançar livres
→ nenhuma alteração de IDs, evidência ou domínio
```

Não criar uma nova rota para cada bloco e não microfragmentar um clique por parágrafo. A segmentação é visual; currículo, runtime e `ProgressService` permanecem autoridades separadas.

Dentro de lição/verificação, preferir:

```text
← Voltar para a unidade
```

em vez de breadcrumb longo. O destino deve ser a unidade real, não depender de `history.back()`.

Quando a etapa já comunica a função pedagógica, remover rótulos redundantes como `Prática` + `Pratique` ou `correção objetiva`. Manter badges apenas quando forem acionáveis, por exemplo `Necessária para concluir`.

Transições curtas podem comunicar continuidade, mas devem respeitar `prefers-reduced-motion`, manter navegação por teclado e preservar respostas ao voltar/avançar.

## Honestidade de métricas

Não inserir métricas apenas porque deixam o dashboard visualmente mais rico.

Tempo estudado, streak, estimativas, XP, conquistas ou percentuais precisam ter fonte de dados real e significado claro. No Modo Clássico, métricas devem derivar do catálogo/`ProgressService` ou ser identificadas explicitamente como estimativas.

## Perguntas de revisão

Antes de homologar uma tela:

```text
O aluno entende onde está?
O aluno entende o que aconteceu?
O aluno entende o próximo passo?
Existe algum código interno visível sem necessidade?
Existe informação que aumenta carga cognitiva sem ajudar a estudar?
Existe ação repetida sem ganho contextual real?
A home começa por informação acionável em vez de introdução genérica?
A navegação principal está focada em estudar/acompanhar?
Metodologia e Ajuda estão acessíveis sem competir com o fluxo principal?
As métricas exibidas vêm de dados reais?
Uma lição longa está segmentada sem microfragmentação?
Voltar/Avançar preservam acesso e respostas?
A linguagem preserva o significado pedagógico real?
```

Se a tela exige que o aluno conheça a arquitetura do sistema para entendê-la, ou repete controles sem utilidade real, ela ainda não está homologada.

## Separação no código

Adotar camada de apresentação:

```text
runtime/estado técnico
→ mapeamento de apresentação
→ texto/controle acessível ao aluno
```

Evitar interpolação direta de enums, IDs e nomes técnicos no HTML.

## Validação visual

Mudança visual relevante deve seguir `.ChatGPT/skills/frontend-visual-check/SKILL.md` e ser inspecionada em desktop/tablet/mobile conforme aplicável.

Aparência correta não compensa linguagem técnica confusa nem hierarquia prejudicada por ações redundantes.
