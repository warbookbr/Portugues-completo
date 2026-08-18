# Skill: Student UI/UX

> **Escopo:** qualquer trabalho de interface visível ao aluno no projeto `Portugues-completo`.

## Objetivo

Garantir linguagem humana, hierarquia clara, foco pedagógico e apresentação progressiva, sem vazar códigos internos, sem controles redundantes e sem despejar informação antes do momento em que ela ajuda.

Fonte canônica: `docs/ui-ux.md`.

## Regra central

> **A interface fala a linguagem do aluno; a infraestrutura fala a linguagem do sistema.**

IDs, enums, códigos curriculares, nomes de schema e estados de máquina podem existir internamente, mas não devem ser impressos diretamente na UI quando não forem pedagogicamente úteis.

## Regra canônica de linguagem pública

Texto visível ao aluno deve ser:

```text
CLARO
→ dá para entender do que se trata

COMPLETO
→ contém o necessário para compreender e agir

SIMPLES
→ evita complexidade e metalíngua desnecessárias
```

Simples não significa infantilizado nem raso.

A UI nunca deve usar automaticamente um objetivo curricular técnico como microcopy pública apenas porque ele já existe no runtime.

Exemplo:

```text
interno
→ Distinguir a realização sonora da língua de sua representação escrita.

aluno
→ Entender a diferença entre o que falamos e o que escrevemos.
```

Quando houver diferença entre precisão interna e clareza pública, manter a precisão no dado interno e criar uma camada de apresentação própria.

## Quando usar

Usar ao criar, revisar ou alterar:

- home/dashboard;
- navegação;
- cards de unidade/lição;
- abertura de lição;
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
+ .ChatGPT/skills/course-content-design/SKILL.md quando houver conteúdo pedagógico público
+ .ChatGPT/skills/frontend-visual-check/SKILL.md
+ contrato específico da tela/estado
+ plano transversal ativo, quando houver
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

Antes de adicionar botão, link, card de ação ou atalho, verificar se a mesma função já está claramente disponível em outro controle simultaneamente visível.

```text
mesmo destino + mesma função + sem benefício contextual
→ não duplicar
```

Repetição só permanece quando reduz esforço de forma contextual e justificável.

## Navegação principal do Clássico

Padrão atual:

```text
Início | Plano de estudos | Unidades | Revisões | Desempenho
```

Não usar sidebar duplicando esses destinos.

### Home

A home começa por estado acionável, não por banner institucional.

```text
Continue estudando / Comece por aqui
→ concentra o único CTA principal
→ "Continuar de onde parou" ou "Começar a estudar"
```

`Plano de estudos` permanece na navegação superior e não deve ser repetido como CTA principal.

### Ajuda e metodologia

```text
Ajuda
→ utilitário discreto fora da navegação principal

Metodologia do curso
→ não ocupar rodapé persistente da experiência de estudo
→ acessar por Ajuda → Como o curso funciona / Sobre o curso
```

Informação institucional deve continuar acessível, mas não competir com a aprendizagem.

## Abertura limpa de lição

A primeira entrada em uma lição deve orientar antes de ensinar.

Padrão canônico:

```text
← Voltar para a unidade

Lição
Título da lição
Objetivo público curto, claro, completo e simples

[ Começar lição ]
```

Na tela de abertura, não mostrar simultaneamente:

- conteúdo da primeira etapa;
- atividade;
- stepper/progresso de etapas;
- lista das etapas futuras;
- badges técnicos;
- objetivo curricular interno;
- explicação longa;
- mídia decorativa.

O aluno deve primeiro entender **o que vai aprender** e ter uma única ação óbvia: começar.

Ao retomar lição já iniciada, não obrigar o aluno a rever a abertura quando houver estado seguro para retornar ao percurso.

## Fluxo guiado de lição

Depois de começar, lições longas não devem mostrar todos os blocos simultaneamente quando isso aumentar ruído.

Padrão:

```text
uma etapa principal por vez
→ observar / entender / praticar / consolidar conforme o conteúdo
→ blocos relacionados agrupados em quantidade moderada
→ Voltar / Avançar livres
→ feedback junto da atividade correspondente
→ nenhuma alteração indevida de IDs, evidência ou domínio
```

Não criar nova rota para cada parágrafo e não microfragmentar um clique por bloco pequeno. A segmentação é de experiência; currículo, runtime e `ProgressService` continuam autoridades separadas.

Dentro de lição/verificação, preferir:

```text
← Voltar para a unidade
```

em vez de breadcrumb longo. O destino deve ser determinístico, não depender de `history.back()`.

Quando a etapa já comunica a função, remover rótulos redundantes como `Prática` + `Pratique` ou `correção objetiva`.

Badges só permanecem quando comunicam algo útil/acionável, por exemplo `Necessária para concluir`.

Transições curtas podem comunicar continuidade, mas devem respeitar `prefers-reduced-motion`, navegação por teclado e preservação de respostas.

## Progressive disclosure

Não mostrar informação só porque existe.

Perguntar:

```text
O aluno precisa disto agora para entender ou agir?
```

Se não, mover para momento posterior, detalhe expansível ou tela secundária apropriada.

Nunca esconder conteúdo necessário atrás de opcional; esconder apenas informação secundária ou prematura.

## Honestidade de métricas

Não inserir métricas apenas para enriquecer visualmente o dashboard.

Tempo estudado, streak, estimativas, XP, conquistas ou percentuais precisam de fonte real e significado claro. No Clássico, métricas derivam do catálogo/`ProgressService` ou são explicitamente identificadas como estimativas.

## Separação no código

Adotar camada de apresentação:

```text
runtime/estado técnico
→ mapeamento de apresentação
→ texto/controle acessível ao aluno
```

Evitar interpolação direta de enums, IDs, objetivos técnicos e nomes internos no HTML.

## Perguntas de revisão

Antes de homologar uma tela:

```text
O aluno entende onde está?
O aluno entende o que vai aprender ou o que aconteceu?
O próximo passo é óbvio?
O texto é claro, completo e simples?
Existe termo usado antes de ser ensinado?
Existe código interno visível sem necessidade?
Existe informação prematura ou que só aumenta carga cognitiva?
Existe ação repetida sem ganho contextual?
A home começa pelo que o aluno pode fazer agora?
Metodologia/Ajuda estão acessíveis sem competir com o estudo?
As métricas vêm de dados reais?
A primeira entrada na lição está limpa?
A lição longa está segmentada sem microfragmentação?
Voltar/Avançar preservam acesso e respostas?
A linguagem preserva a verdade pedagógica sem parecer documentação para professor?
```

Se a tela exige conhecer a arquitetura do sistema, apresenta texto curricular técnico como explicação ou mostra tudo ao mesmo tempo sem necessidade, ela ainda não está homologada.

## Validação visual

Mudança visual relevante deve seguir `.ChatGPT/skills/frontend-visual-check/SKILL.md` e ser inspecionada nos viewports aplicáveis.

Para fluxo de lição, validar quando aplicável:

```text
primeira entrada
lição já iniciada
etapa explicativa
atividade
feedback
retomada
1440px
~1024/900px
~680px
390px
```

Aparência correta não compensa linguagem confusa, progressão ruim ou hierarquia carregada.

## Regra final

A interface deve revelar **a informação certa, com palavras que o aluno entende, no momento em que ele precisa dela**.