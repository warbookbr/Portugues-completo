# T1.1 — Auditoria da porta de entrada do N0

**Status:** `CONCLUÍDA`

**Marco:** `CL-T1-FUNDAMENTOS-CLAROS`

## Objetivo

Determinar, com base em evidência pedagógica e no estado real do repositório, como o Nível 0 deve começar para um aluno realmente iniciante, antes de reescrever unidades e lições.

Este documento fecha a fase T1.1. Ele **não** executa ainda o redimensionamento curricular; essa decisão material pertence à T1.2.

---

## 1. Decisão principal

A porta de entrada atual precisa ser reorganizada.

A abertura por `Fala e escrita: duas formas relacionadas` é pedagogicamente válida como conteúdo, mas **não é a melhor primeira experiência do curso**. O aluno encontra uma distinção abstrata antes de construir referências mais concretas como letra, alfabeto, vogal, consoante, sílaba e palavra.

A nova espinha inicial deve tornar perceptível uma progressão próxima de:

```text
letra → alfabeto → reconhecimento das letras
→ maiúsculas/minúsculas
→ vogais e consoantes em nível introdutório
→ percepção de sons em palavras + relações simples som–letra
→ sílabas como partes percebidas da palavra
→ combinar sílabas / primeiras palavras
→ leitura e reconhecimento de palavras
→ síntese posterior sobre fala, sons e escrita
→ frases → pequenos textos
```

Essa sequência é **uma espinha de dependências**, não uma obrigação de criar exatamente uma lição por linha.

### Nuance importante

A pesquisa não sustenta uma sequência rígida do tipo:

```text
memorizar todas as letras
→ somente depois trabalhar sons
```

Conhecimento das letras e consciência fonológica devem ser articulados. O curso pode introduzir as letras concretamente desde o início enquanto desenvolve, em paralelo e de forma gradual, percepção sonora e ligação entre sons e letras.

Também não é necessário exigir domínio da classificação `vogal/consoante` como pré-requisito para toda decodificação. Essas categorias podem aparecer cedo e de forma simples, como referência útil, sem virar gate artificial.

---

## 2. Evidência externa sintetizada

### 2.1 Consciência sonora + letras precisam se encontrar cedo

O What Works Clearinghouse / Institute of Education Sciences recomenda, com **evidência forte**, desenvolver consciência dos segmentos sonoros da fala e de como eles se ligam às letras; a recomendação seguinte é ensinar decodificação de palavras, análise de partes e reconhecimento/escrita de palavras.

Fonte: [IES — Foundational Skills to Support Reading for Understanding in Kindergarten Through 3rd Grade](https://ies.ed.gov/ncee/wwc/PracticeGuide/21/Published).

O IES também descreve a consciência fonológica como base para leitura, indo de unidades sonoras mais acessíveis, como sílabas, para manipulações menores, e destaca que isolar sons e ligá-los às letras é um passo importante. Para alunos com dificuldade, recomenda modelagem, prática guiada e divisão das habilidades em partes menores.

Fonte: [IES — Phonological Awareness: The Sounds of Reading](https://ies.ed.gov/learn/blog/phonological-awareness-sounds-reading).

### 2.2 A literatura brasileira também trata escrita alfabética e consciência fonológica de forma articulada

Material acadêmico indexado no eduCAPES/UnB trata explicitamente da articulação entre o ensino do sistema de escrita alfabética e da consciência fonológica no bloco inicial de alfabetização.

Fonte: [eduCAPES / UnB — A articulação entre o ensino e o aprendizado do sistema de escrita alfabética e da consciência fonológica](https://educapes.capes.gov.br/handle/capes/928764).

A CAPES, em material de formação de alfabetização, também apresenta consciência fonológica e conhecimento das letras como conhecimentos relacionados à aprendizagem inicial da leitura e da escrita, com percepção de rimas/sílabas e conhecimento das letras.

Fonte: [CAPES — Consciência Fonológica e Conhecimento das Letras](https://www.gov.br/capes/pt-br/assuntos/noticias/curso-abc-consciencia-fonologica-e-conhecimento-das-letras).

### 2.3 A política brasileira atual não impõe uma única sequência metodológica

O Compromisso Nacional Criança Alfabetizada é a política federal vigente para alfabetização e trabalha em regime de colaboração; o MEC informa que não propõe uma resposta metodológica única e centralizada para todo o país. Por isso, o curso deve usar evidências e a BNCC como referências, sem transformar uma política específica em método fechado.

Fontes:
- [MEC — Compromisso Nacional Criança Alfabetizada](https://www.gov.br/mec/pt-br/assuntos/noticias/2025/outubro/gt-do-mec-dara-suporte-tecnico-aos-entes-federados-no-par)
- [BNCC — portal oficial](https://basenacionalcomum.mec.gov.br/)

A antiga Política Nacional de Alfabetização de 2019 foi revogada em 2023; ela não é usada aqui como norma vigente.

### 2.4 Segmentação da experiência é válida, mas sem microfragmentar

Meta-análise de 56 investigações / 88 comparações encontrou benefício do conteúdo apresentado em segmentos coerentes, incluindo redução de carga cognitiva e ganhos em retenção/transferência. Isso sustenta o fluxo de lição em etapas, mas não exige uma tela por parágrafo ou uma atividade artificial a cada frase.

Fonte: [Rey et al. (2019) — A Meta-analysis of the Segmenting Effect](https://doi.org/10.1007/s10648-018-9456-4).

### 2.5 Linguagem pública deve ser concreta e fácil de entender

A orientação de acessibilidade cognitiva do W3C recomenda palavras fáceis, frases curtas, blocos pequenos, conteúdo inequívoco e linguagem concreta/literal. Também recomenda que instruções sejam separadas em passos e não omitam etapas consideradas “óbvias”.

Fontes:
- [W3C WAI — Use Clear and Understandable Content](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/)
- [W3C WAI — Use Literal Language](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p04-literal-language/)
- [W3C WAI — Use Clear Step-by-step Instructions](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/)

---

## 3. Auditoria interna

### 3.1 O N0 declara corretamente que parte do zero

`docs/mapa-curso.md` define o Nível 0 como base inicial “partindo do zero” e afirma que terminologia técnica não deve ser antecipada sem utilidade pedagógica.

**Diagnóstico:** a intenção macro está correta; o problema está principalmente na materialização da entrada.

### 3.2 A U1 atual mistura fundamentos concretos e abstrações posteriores

A U1 publicada reúne, na mesma unidade:

- fala × escrita;
- percepção auditiva;
- alfabeto;
- maiúsculas/minúsculas;
- vogais/consoantes;
- organização visual da escrita;
- nome da letra × som;
- variação letra ↔ som.

Isso é cobertura válida, mas a ordem atual começa pelas duas partes mais abstratas (`fala × escrita` e percepção sonora sem referência escrita) e só apresenta o alfabeto na terceira lição.

### 3.3 A primeira lição confirma o problema de linguagem e abstração

`N0-U01-L01` não possui pré-requisito, mas usa formulações como:

- `realização sonora da língua`;
- `representação escrita`;
- `marcas gráficas`;
- relação conceitual entre fala e escrita.

O conteúdo pode ser reescrito de modo simples e reutilizado depois, mas não deve continuar como a primeira competência formal do curso.

### 3.4 A lição de alfabeto já contém matéria-prima forte

`N0-U01-L03 — Conhecendo o alfabeto` já possui uma base próxima do desejado:

- apresenta as 26 letras;
- não exige recitação decorada;
- trabalha reconhecimento fora de ordem;
- distingue nome da letra de som;
- usa rodadas curtas;
- renderiza letras semanticamente pela UI.

**Decisão T1.1:** preservar e adaptar esse núcleo; ele é forte candidato a compor a nova abertura, com uma etapa anterior ainda mais elementar explicando o que é uma letra.

### 3.5 Vogais/consoantes estão cedo o suficiente no conteúdo, mas combinadas com coisa demais

`N0-U01-L05` junta:

```text
vogais + consoantes + algarismos + pontuação + outros símbolos
```

Para um aluno realmente iniciante, isso aumenta o número de categorias novas na mesma lição.

**Decisão T1.1:** manter vogais/consoantes cedo, mas avaliar em T1.2 separar ou reduzir o bloco `outros sinais` para uma etapa posterior de organização da escrita.

### 3.6 A atual U2 possui uma introdução de sílaba pedagogicamente boa

`N0-U02-L01` apresenta primeiro a palavra falada inteira e depois suas partes, só então nomeando `sílaba`. Essa sequência concreto → exemplo → nome do conceito está alinhada com o novo padrão.

O problema é o pré-requisito atual: exige `N0-U01-V01`, portanto obriga o aluno a concluir também relações letra–som mais complexas antes de chegar à primeira sílaba.

**Decisão T1.1:** reutilizar grande parte da U2, mas trazer o núcleo silábico para mais perto dos fundamentos iniciais e revisar seus pré-requisitos.

### 3.7 Relações letra–som complexas estão cedo demais para a porta de entrada

`N0-U01-L07` e `N0-U01-L08` são conceitos importantes, mas a distinção entre nome da letra e som e, especialmente, a ideia de que a relação letra ↔ som varia são melhores depois que o aluno já possui exemplos concretos de letras, sílabas e palavras.

**Decisão T1.1:** não eliminar; mover para posição posterior ou usar como síntese após primeiras experiências de leitura/decodificação.

### 3.8 O conceito fala × escrita deve virar síntese, não porta de entrada

A competência é válida. A mudança recomendada é de posição e linguagem:

```text
antes
→ primeiro conteúdo do curso

novo papel
→ síntese curta depois de o aluno já ter visto letras, ouvido palavras e relacionado partes faladas e escritas
```

Texto público de referência:

> Entender a diferença entre o que falamos e o que escrevemos.

### 3.9 A saída do N0 continua adequada em nível macro

`N0-EXIT-V01` mede leitura, escrita, pequenos textos, compreensão oral, uso funcional e reparo. A deficiência encontrada é de **entrada/progressão**, não de ambição final do N0.

A verificação de saída, porém, referencia nominalmente verificações `N0-U01-V01`, `N0-U02-V01` e `N0-U03-V01`; se a arquitetura mudar em T1.2, essas referências precisam ser reconciliadas.

### 3.10 A transição N0→N1 precisa ser reaberta apenas para consistência documental

`docs/transicao-n0-n1.md` registra que não havia razão para reabrir N0. A validação de produto posterior encontrou uma razão concreta. Não há evidência de que o **resultado de saída** N0→N1 esteja errado, mas o documento precisa ser revisitado depois do redimensionamento para deixar de afirmar que N0 não precisava ser reaberto.

---

## 4. Nova espinha inicial recomendada para T1.2

A auditoria recomenda que T1.2 compare as opções arquitetônicas usando esta espinha como referência:

### Bloco A — O que vemos na escrita

```text
1. O que é uma letra
2. O alfabeto e as 26 letras
3. Reconhecer letras em diferentes posições/ordens
4. Maiúsculas e minúsculas
5. Vogais e consoantes — introdução simples
6. Organização visual básica: esquerda→direita, espaços e outros sinais essenciais
```

### Bloco B — O que ouvimos e como começa a ligação com a escrita

```text
7. Perceber sons/partes em palavras familiares
8. Ligar sons iniciais simples a letras já conhecidas
9. Nome da letra ≠ som — apenas quando houver exemplos concretos suficientes
```

### Bloco C — Sílabas e primeiras palavras

```text
10. Palavra inteira → partes sonoras → nome “sílaba”
11. Separar e juntar sílabas oralmente
12. Relacionar sílabas ouvidas à escrita
13. Combinar/completar sílabas para formar palavras
14. Ler por partes quando necessário → reconhecer a palavra inteira
15. Relacionar palavra lida a significado familiar
```

### Bloco D — Síntese e ampliação

```text
16. Fala e escrita: formas relacionadas, explicadas com exemplos já conhecidos
17. Relações letra–som podem variar, sem sistematizar ortografia
18. Seguir para frases e sentido
```

A numeração é apenas de dependência; T1.2 pode agrupar vários itens na mesma lição ou unidade.

---

## 5. Opção arquitetônica preferida

Entre as opções previstas no plano, a recomendação de T1.1 é **não criar uma U0 artificial antes do N0-U01** e também não manter U1/U2 intactas apenas trocando a ordem.

A melhor candidata para T1.2 é:

> **reorganizar conjuntamente a atual U1 + U2 em duas unidades iniciais mais naturais**, preservando o máximo de conteúdo semanticamente equivalente.

Direção sugerida:

```text
Nova Unidade 1 — Letras e alfabeto
→ base visual concreta + reconhecimento + categorias introdutórias

Nova Unidade 2 — Sons, sílabas e primeiras palavras
→ consciência sonora + ligações com letras + sílabas + decodificação inicial

Unidade seguinte
→ palavras, significado, frases e sínteses mais abstratas
```

`Fala e escrita` e `letra ↔ som pode variar` deixam de abrir o curso e passam a uma posição de síntese/aprofundamento compatível com os exemplos já construídos.

Esta opção tem melhor equilíbrio entre:

- progressão natural;
- reaproveitamento do conteúdo existente;
- clareza para iniciante;
- menor risco de criar uma unidade “preliminar” redundante;
- possibilidade de preservar identidades semânticas onde realmente houver equivalência.

---

## 6. Impactos técnicos e de migração

### 6.1 Catálogo

O catálogo v2 atualmente publica somente `N0-U01` no N0. A atual U2 existe em conteúdo, mas ainda não possui manifesto publicado no catálogo.

**Impacto favorável:** a maior parte da reorganização de U2 pode acontecer antes de ela ganhar identidade pública de catálogo, reduzindo custo de compatibilidade.

### 6.2 IDs e competências

`N0-U01` já possui IDs estáveis de competência e lição usados pelo runtime/progresso.

Regra para T1.2/T1.5:

```text
mesmo conteúdo/competência semântica
→ pode preservar identidade com mapeamento explícito

conteúdo materialmente novo ou competência redefinida
→ novo ID
```

Não transformar `N0-U01-L01` em “O que é uma letra” apenas porque ele ocupa a primeira posição.

### 6.3 Progresso e Gist

Pode existir progresso real associado ao slice N0-U01 já publicado.

T1.2 deve produzir uma matriz de identidade antes da reescrita:

```text
ID antigo | significado antigo | destino | equivalência | ação de migração
```

Conclusão antiga só pode ser migrada para uma lição nova quando houver equivalência real de competência/evidência.

### 6.4 Deep links

Rotas antigas de lição/unidade devem ser mapeadas para alias, redirecionamento ou tela informativa quando a identidade mudar. Não depender de `history.back()` nem deixar URL antiga apontar silenciosamente para conteúdo diferente.

### 6.5 Mídia

Os lotes N0 atuais têm forte reutilização cruzada entre U1 e U2. A reorganização não deve renumerar mídia só porque a lição mudou de posição.

Preferência:

```text
mediaId existente + significado acústico intacto
→ preservar como ID legado estável e remapear localização pedagógica
```

A fila precisa ser reconciliada depois que T1.2 congelar a nova arquitetura.

### 6.6 Verificações

U1/U2 e `N0-EXIT-V01` usam referências nominais às verificações atuais. Se a unidade for dividida/reorganizada, a verificação integrada também precisa seguir a nova responsabilidade curricular; não basta trocar título.

---

## 7. Problemas confirmados

1. `Fala × escrita` é válido, mas abstrato demais para abrir o curso.
2. O alfabeto aparece tarde demais na experiência publicada, apesar de já existir bom conteúdo para ele.
3. A U1 atual concentra conceitos de complexidades muito diferentes.
4. Vogais/consoantes podem ser ensinadas cedo, mas a lição atual mistura categorias demais.
5. A introdução de sílabas da U2 é boa, porém está bloqueada por pré-requisitos mais amplos do que o necessário.
6. Relações letra–som variáveis são importantes, mas entram cedo demais para um aluno do zero.
7. Objetivos internos técnicos não servem como texto público.
8. A ordem atual do slice é mais responsável pela sensação de dificuldade do que a cobertura curricular em si.
9. O N0 final não precisa ser “simplificado”; é a **escada até ele** que precisa melhorar.

---

## 8. O que não deve ser feito em T1.2

- não transformar o começo em memorização mecânica A–Z;
- não ensinar todas as regras som–grafia antes das primeiras palavras;
- não usar famílias silábicas como arquitetura rígida;
- não obrigar classificação técnica antes de uso funcional;
- não apagar conteúdo válido apenas porque será movido;
- não reutilizar IDs com significado novo;
- não deixar a mídia existente ditar uma ordem pedagógica pior;
- não tornar a explicação infantilizada: **simples não significa incompleta**.

---

## 9. Gate T1.1

**SATISFEITO.**

A auditoria produziu:

- problemas confirmados;
- dependências reais;
- espinha inicial recomendada;
- opção arquitetônica preferida;
- impactos em IDs, progresso, mídia, catálogo e verificações;
- justificativa para reuso, divisão e movimentação de conteúdo.

## Próximo passo

```text
T1.2 — Redimensionamento curricular controlado do N0
```

T1.2 deve congelar a arquitetura concreta das novas unidades/lições e produzir a matriz de identidade/migração antes da reescrita de conteúdo.