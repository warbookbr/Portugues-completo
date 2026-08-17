# Skill: Student UI/UX

> **Escopo:** qualquer trabalho de interface visível ao aluno no projeto `Portugues-completo`.

## Objetivo

Garantir que a aplicação use linguagem humana, hierarquia clara e apresentação pedagógica, sem vazar códigos internos para a experiência do aluno.

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

## Perguntas de revisão

Antes de homologar uma tela:

```text
O aluno entende onde está?
O aluno entende o que aconteceu?
O aluno entende o próximo passo?
Existe algum código interno visível sem necessidade?
Existe informação que aumenta carga cognitiva sem ajudar a estudar?
A linguagem preserva o significado pedagógico real?
```

Se a tela exige que o aluno conheça a arquitetura do sistema para entendê-la, ela ainda não está homologada.

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

Aparência correta não compensa linguagem técnica confusa.
