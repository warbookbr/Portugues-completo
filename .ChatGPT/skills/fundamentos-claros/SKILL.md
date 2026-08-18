# Skill: Fundamentos claros

> **Escopo:** execução do plano transversal `CL-T1-FUNDAMENTOS-CLAROS` no projeto `Portugues-completo`.

## Status

Usar enquanto `docs/plano-fundamentos-claros.md` estiver `ATIVO`.

Este plano tem precedência operacional sobre iniciar P6. Quando T1 for homologado, consolidar as regras duradouras nas skills canônicas e então retirar a precedência especial desta skill.

## Objetivo

Garantir que a porta de entrada do curso realmente comece do básico, que a linguagem pública seja compreensível para iniciantes e que a interface da lição revele uma etapa por vez sem perder conteúdo, evidência ou progresso.

## Leitura obrigatória

```text
1. PROJECT_INDEX.md
2. docs/plano-fundamentos-claros.md
3. docs/roadmap-produto.md
4. docs/estado-implementacao-classico.md
5. docs/mapa-curso.md
6. docs/unidades-nivel-0.md
7. docs/licoes-nivel-0.md
8. docs/conteudo.md
9. docs/ui-ux.md
10. docs/contrato-conteudo.md
11. docs/exercicios.md
12. docs/progresso.md
13. .ChatGPT/skills/course-content-design/SKILL.md
14. .ChatGPT/skills/student-ui-ux/SKILL.md
15. .ChatGPT/skills/frontend-visual-check/SKILL.md quando houver frontend
```

## Regra operacional

Enquanto T1 estiver ativo:

```text
não iniciar P6 materialmente
→ executar a próxima fase T1 incompleta
→ pesquisar quando a fase exigir
→ implementar
→ revisar
→ testar
→ PR/CI/merge
→ atualizar estado
→ continuar
```

Não pedir autorização entre fases já cobertas pelo plano salvo condição real de parada de `docs/execucao-continua.md`.

## Regra pedagógica central

```text
começar do que o aluno consegue perceber
→ apresentar um exemplo
→ nomear o conceito
→ explicar com linguagem simples
→ praticar
→ só então ampliar/abstrair
```

No início do N0, não presumir que o aluno já entende termos como:

- alfabeto;
- vogal;
- consoante;
- sílaba;
- palavra;
- frase;
- fala versus escrita como conceito linguístico.

Se o termo é objeto da aprendizagem, ensiná-lo antes de usá-lo como pressuposto.

### Clareza depende do momento curricular

Uma palavra pode ser comum, curta e linguisticamente simples e ainda assim ser inadequada naquele ponto do curso se o conceito que ela nomeia ainda não foi construído.

Regra:

```text
linguagem simples
≠ conceito já disponível para o aluno

conceito ainda não ensinado/consolidado
→ não usar seu nome como pressuposto na abertura, explicação ou instrução
→ primeiro construir significado com percepção/exemplo acessível
→ depois nomear o conceito
→ então reutilizar o termo normalmente nas etapas posteriores
```

Exemplo:

```text
RUIM CEDO DEMAIS
→ Aprender a reconhecer vogais.

MELHOR ANTES DE ENSINAR O TERMO
→ Conhecer um grupo de letras que aparece em muitas palavras.

DEPOIS DA CONSTRUÇÃO DO CONCEITO
→ Essas letras são chamadas de vogais.
```

O critério não é evitar para sempre palavras como `vogal`, `sílaba` ou `frase`; é introduzi-las no momento em que o aluno já possui base suficiente para atribuir significado a elas.

## Duas linguagens obrigatórias

### Interna

Pode ser técnica e precisa:

```text
objetivos
competências
critérios
evidência
limites
```

### Pública

Deve ser simples e direta:

```text
O que vou aprender?
O que significa?
Qual é o exemplo?
O que faço agora?
```

Nunca imprimir objetivo curricular técnico como texto introdutório apenas porque ele já existe no JSON.

Exemplo de referência:

```text
interno
→ Distinguir a realização sonora da língua de sua representação escrita...

aluno
→ Entender a diferença entre o que falamos e o que escrevemos.
```

## Regra da primeira tela de lição

Primeiro acesso:

```text
← Voltar para a unidade

Lição
Título
Objetivo público simples

[ Começar lição ]
```

Não mostrar o stepper, atividades ou blocos da etapa seguinte antes do aluno começar.

Ao retomar uma lição já iniciada, não obrigar a repetir a tela de apresentação quando houver estado seguro para retornar ao percurso.

## Regra de progressão curricular

A sequência exata do N0 deve ser validada por pesquisa/auditoria, mas precisa tornar visível uma progressão natural de fundamentos, considerando cedo:

```text
letras/alfabeto
→ vogais e consoantes
→ organização/formas básicas
→ sílabas
→ palavras
→ relações sonoras e fala/escrita em complexidade apropriada
→ frases
→ textos
```

Não preservar uma ordem ruim apenas para evitar renomear arquivos.

Também não renomear/reutilizar IDs de forma destrutiva. Mudança semântica exige mapa de identidade e migração.

## Regra de clareza

Ao revisar texto para iniciante, procurar especialmente:

- termos usados antes de serem ensinados;
- termos aparentemente simples cujo conceito ainda não foi construído;
- frases com mais de uma ideia principal;
- palavras técnicas substituíveis por linguagem comum;
- explicações que parecem destinadas a professores;
- exemplos que chegam tarde;
- abstração antes de experiência concreta;
- instruções que exigem inferir o que fazer.

Se encontrar, corrigir antes de avançar.

## Regra de frontend

A UI deve ter uma área principal de atenção.

Preferir:

```text
apresentação limpa
→ etapa explicativa
→ prática
→ feedback local
→ próxima etapa
```

Evitar:

- card dentro de card sem função;
- rótulos repetidos;
- lista inteira da lição na primeira tela;
- progresso visual antes de o aluno iniciar;
- informação institucional persistente no caminho de estudo.

`Metodologia do curso` deve ser acessível via Ajuda/Como o curso funciona, não pelo rodapé persistente.

## Regra de compatibilidade

Antes de alterar ordem/IDs publicados:

```text
mapear identidade semântica
→ mapear progresso existente
→ mapear deep links
→ mapear manifests/catalog
→ mapear mídia
→ só então migrar
```

Conclusão antiga não pode virar domínio de conteúdo novo por coincidência de ID.

## Revisão obrigatória

Aplicar as quatro passadas da skill curricular e uma quinta:

### E. Clareza para iniciante

```text
O aluno entende o objetivo sem metalíngua?
Os pré-requisitos foram realmente ensinados?
Algum termo simples está nomeando um conceito que ainda não foi construído?
O exemplo chega cedo?
O texto público é mais simples que o objetivo interno?
Existe salto entre esta lição e a anterior?
```

## Validação visual mínima

Quando houver mudança de lição:

```text
primeira entrada
lição já iniciada
etapa explicativa
atividade
retomada
1440px
~1024/900px
~680px
390px
```

## Encerramento

T1 só fecha quando todos os critérios de `docs/plano-fundamentos-claros.md` estiverem satisfeitos.

Ao fechar:

1. incorporar regras duradouras nas skills canônicas;
2. atualizar roadmaps/estado;
3. marcar T1 `HOMOLOGADO`;
4. reativar P6.
