# Skill: Course Content Design

> **Escopo:** esta skill é destinada ao **ChatGPT** trabalhando no projeto `Portugues-completo`. **Não é uma instrução para Codex**.

## Objetivo

Planejar, revisar e produzir conteúdo pedagógico do curso com progressão natural, explicações claras, evidência válida e mídia somente quando houver ganho real de aprendizagem.

## Fontes de verdade

Antes de propor estrutura curricular, unidades, lições ou materiais de apoio, considerar:

- `PROJECT_INDEX.md`;
- `docs/mapa-curso.md` e documentos curriculares específicos;
- `docs/roadmap-curricular.md`;
- `docs/roadmap-produto.md` e `docs/estado-implementacao-classico.md` quando houver publicação/runtime;
- `docs/conteudo.md`;
- `docs/exercicios.md`;
- `docs/progresso.md`;
- `docs/contrato-conteudo.md`;
- `docs/avaliacao-ia.md` quando aplicável;
- `docs/arquitetura.md`;
- `docs/ui-ux.md` quando houver texto visível ao aluno;
- `producao-midia/README.md` e `producao-midia/FILA-MIDIA.md` quando mídia puder ser relevante.

Quando existir plano transversal ativo no roadmap, lê-lo antes de continuar o trabalho correspondente.

## Princípio central

```text
progressão natural
+ explicação clara, completa e simples
+ prática coerente
+ evidência compatível com a competência
+ mídia somente quando ajuda
```

A tecnologia e a terminologia servem à aprendizagem. Não fazer o aluno aprender a linguagem do autor para conseguir aprender o conteúdo.

## Regra canônica de explicação: clara, completa e simples

Uma explicação para o aluno deve ser simultaneamente:

```text
CLARA
→ o aluno entende do que se trata e o que está sendo afirmado

COMPLETA
→ contém o necessário para compreender e agir, sem esconder uma etapa essencial

SIMPLES
→ usa a linguagem mais comum possível para aquele nível, sem complexidade desnecessária
```

**Simples não significa raso. Completo não significa técnico.**

Antes de publicar uma explicação, verificar:

- há uma ideia principal identificável?
- algum termo técnico pode ser trocado por palavra comum sem perder precisão?
- algum termo ainda não ensinado está sendo usado como pré-requisito?
- algum termo aparentemente simples nomeia um conceito que o aluno ainda não construiu?
- o exemplo aparece cedo o suficiente?
- uma frase longa pode ser dividida em duas ideias menores?
- o texto parece escrito para um professor ou para o aluno?
- o aluno entende o que fazer depois de ler?

Quando uma formulação tecnicamente precisa for necessária para autoria, mantê-la internamente e criar texto público próprio.

### Clareza é relativa ao momento curricular

Clareza não depende apenas da dificuldade das palavras. Uma palavra curta, cotidiana ou comum na escola pode continuar obscura se o conceito correspondente ainda não tiver sido ensinado ou consolidado naquele ponto do percurso.

Regra:

```text
palavra simples
≠ conceito compreendido

conceito ainda não construído
→ não usar o nome do conceito como pressuposto
→ começar por algo perceptível/concreto ou por exemplo acessível
→ construir o significado
→ nomear o conceito
→ reutilizar o termo depois que ele passou a ter significado para o aluno
```

Exemplo:

```text
RUIM SE "VOGAL" AINDA NÃO FOI ENSINADA
→ Aprender a reconhecer vogais.

MELHOR NESSE MOMENTO
→ Conhecer um grupo de letras que aparece em muitas palavras.

DEPOIS DE CONSTRUIR O SIGNIFICADO
→ Essas letras são chamadas de vogais.
```

Isso não significa evitar terminologia curricular. Significa introduzi-la no momento certo. Depois que o conceito foi construído e praticado, usar seu nome normalmente ajuda a consolidar e ampliar a aprendizagem.

## Duas linguagens obrigatórias

### Linguagem interna

Pode ser técnica e precisa. Serve para:

```text
objetivos curriculares
competências
critérios
limites
evidência
contratos/runtime
```

### Linguagem pública

Deve falar com o aluno. Deve responder, conforme o momento:

```text
O que vou aprender?
O que isso significa?
Qual é um exemplo?
O que faço agora?
```

Regra:

```text
objetivo curricular técnico
≠ texto de abertura da lição
```

Nunca imprimir ou reaproveitar automaticamente um objetivo interno como explicação pública apenas porque ele já existe no conteúdo.

Exemplo de referência:

```text
INTERNO
Distinguir a realização sonora da língua de sua representação escrita.

ALUNO
Entender a diferença entre o que falamos e o que escrevemos.
```

## Regra de progressão pedagógica

Especialmente no começo de um nível ou domínio novo, preferir:

```text
perceber algo concreto
→ observar um exemplo
→ nomear o conceito
→ explicar em linguagem simples
→ praticar com apoio
→ praticar com menos apoio
→ ampliar, relacionar e abstrair
```

Não começar por uma abstração apenas porque ela organiza bem a teoria para o autor.

### Pré-requisito precisa ter sido ensinado

Se um conceito é objeto da aprendizagem, ele não pode ser usado como pressuposto antes de ser apresentado.

No começo do N0, por exemplo, não presumir domínio prévio de termos como:

- alfabeto;
- vogal;
- consoante;
- sílaba;
- palavra;
- frase;
- distinções linguísticas abstratas entre fala e escrita.

A ordem exata deve respeitar a arquitetura curricular vigente, mas a experiência de entrada precisa ser perceptivelmente básica, concreta e cumulativa.

### Progressão natural antes de elegância teórica

Ao revisar sequência de unidades/lições, perguntar:

```text
O aluno consegue compreender esta lição usando somente o que já foi ensinado?
Existe um salto conceitual evitável?
Estou apresentando uma categoria abstrata antes de seus exemplos concretos?
Um fundamento necessário aparece tarde demais?
```

Se sim, corrigir a progressão antes de polir a redação.

## Clareza antes de variedade

Priorizar a forma mais simples que ensine bem.

Não adicionar imagem, vídeo, animação, áudio ou interação apenas para tornar a aula dinâmica. Cada recurso deve melhorar pelo menos um destes pontos:

- compreensão;
- demonstração;
- memória;
- contextualização;
- percepção auditiva/visual;
- prática.

## Regra de foco

Evitar múltiplos elementos competindo ao mesmo tempo.

Cada momento deve ter um foco principal: ler, observar, ouvir, assistir ou responder.

Conteúdo longo deve ser quebrado em etapas coerentes, sem microfragmentar um parágrafo por tela.

## Estrutura pedagógica de lição

Uma lição deve normalmente cumprir estas funções, com flexibilidade:

```text
orientar o aluno
→ explicar
→ exemplificar
→ checar compreensão
→ praticar/consolidar
→ concluir ou indicar próximo passo
```

Quando a interface permitir, a primeira entrada pode usar uma apresentação limpa com título, objetivo público simples e ação de começar, sem despejar todo o conteúdo imediatamente.

## Vídeo

Vídeo é opcional. Usar quando houver vantagem real em ver algo acontecendo, como pronúncia, entonação, leitura expressiva, demonstração passo a passo ou situação comunicativa.

Se texto, exemplo, áudio ou UI semântica transmitir a ideia com mais clareza e rapidez, não recomendar vídeo.

## Imagens

Usar quando reduzirem esforço de compreensão ou adicionarem informação pedagógica real. Evitar imagens meramente decorativas.

Quando a própria UI puder representar letras, tabelas, relações, mapas ou diagramas semanticamente, preferir UI acessível a imagem rasterizada.

## Narração e áudio controlado

Narração geral usa TTS do navegador/dispositivo quando variações de voz não alteram o objeto pedagógico.

Quando características específicas do som fizerem parte da aprendizagem ou determinarem a resposta, planejar `AUDIO_CONTROLADO` e registrar em `producao-midia/FILA-MIDIA.md`.

## Checagem, exercício e produção

Não confundir função pedagógica com componente visual.

```text
checagem
→ entendimento imediato
→ normalmente role CHECK

prática/exercício
→ operar sobre conteúdo
→ PRACTICE ou EVIDENCE conforme função

produção aberta
→ resposta autoral/complexa
→ PRODUCTION/EVIDENCE

verificação
→ integração de competências
→ VERIFICATION
```

O contrato oficial fica em `docs/exercicios.md`.

### Regra de autoria de atividades

Toda atividade deve responder:

```text
por que existe? → role
como o aluno interage? → interaction
como será avaliada? → evaluation
que evidência produz? → evidence
que estímulo precisa? → stimuli
```

Não inventar novo componente apenas porque o tipo pedagógico é novo.

### Respostas abertas

Não reduzir interpretação, argumentação, síntese, escrita, edição ou oralidade a palavras-chave frágeis só para automatizar correção.

Quando necessário, declarar critérios, limites, registro de resposta, autoridade de avaliação e necessidade de avaliador confiável.

IA pode fornecer feedback conforme `docs/avaliacao-ia.md`, mas não produz domínio automático quando a política exigir avaliador confiável.

## Conteúdo complementar

Curiosidades e aprofundamentos não devem interromper a linha principal. Usar `Saiba mais`/`Aprofundamento` quando apropriado.

Nunca esconder conhecimento necessário em bloco opcional.

## Planejamento curricular

A progressão macro permanece:

```text
0 — Fundamentos
1 — Básico
2 — Intermediário
3 — Avançado
4 — Domínio
```

O currículo N0→N4 possui material M5, mas validação de uso pode justificar revisão curricular dirigida. Não preservar uma sequência ruim apenas porque o material já existe; também não reescrever em massa apenas para facilitar renderer.

Mudança curricular real deve ser explicitamente documentada e compatibilizada com IDs, progresso, manifests e mídia.

## Dimensionamento por camada

Hierarquia:

```text
Nível
→ Área
→ Unidade
→ Lição
→ Checagens / Exercícios / Produções / Verificações
```

### Nível

Definir objetivo geral, competências de saída e grandes áreas.

### Área

Definir:

```text
Objetivo da área
Competências ao concluir
Conteúdos essenciais
Limites
```

### Unidade

Definir:

```text
Objetivo da unidade
Competências ao concluir
Conteúdos nucleares
Retomadas e conexões
Evidências de conclusão
Limites
```

### Lição

Registrar:

```text
Objetivo interno
Objetivo/texto público quando aplicável
Competências
Pré-requisitos realmente ensinados
Conteúdo e dependências
Modalidade principal
Recursos necessários
Tipos de prática
Evidência de conclusão
```

## Revisão obrigatória de conteúdo

Antes de considerar conteúdo pronto, revisar cinco dimensões:

### A. Pedagógica

Objetivo, exemplos, prática, carga cognitiva e feedback coerentes.

### B. Curricular

Pré-requisitos reais, ordem natural, limites e ausência de antecipação indevida.

### C. Evidência

A atividade mede a competência declarada sem fabricar domínio.

### D. Implementação/suporte

Texto, UI, TTS e mídia são adequados e compatíveis com contratos.

### E. Clareza para o aluno

```text
A explicação é clara, completa e simples?
O aluno entende o objetivo sem metalíngua desnecessária?
Termos novos são ensinados antes de usados como pressuposto?
Algum termo simples nomeia um conceito que ainda não foi construído?
O exemplo chega cedo?
Existe uma ideia principal por vez?
Há um salto entre esta lição e a anterior?
O texto público é realmente texto para aluno?
```

Falha relevante em qualquer dimensão exige correção antes de homologação pedagógica.

## Mídia durante o planejamento

Fluxo:

```text
necessidade pedagógica
→ verificar se texto/TTS/UI existente basta
→ se exigir produção humana, criar/reutilizar mediaId
→ registrar na fila
→ referenciar pelo ID
→ continuar partes independentes
```

Mídia obrigatória pendente bloqueia somente o escopo que realmente depende dela.

## Contrato operacional de material de apoio

Avaliar por lição:

```text
curatedMedia
runtimeResources
generatedVisualResources
productionQueueRequired
publicationDependency
decisionRationale
```

`curatedMedia` vazio é válido. Não criar mídia só porque não existe mídia.

## Forma de trabalho com o usuário

O projeto é grande. Na conversa, apresentar primeiro a direção principal e evitar despejar dezenas de decisões quando isso não for necessário.

Preferir:

```text
definir
→ verificar
→ consolidar
→ documentar
→ avançar
```

## Inicialização sem contexto

Para criação/revisão curricular:

```text
1. PROJECT_INDEX.md
2. esta skill
3. roadmap/plano ativo
4. documentos curriculares específicos
5. docs/conteudo.md
6. docs/exercicios.md quando houver atividades
7. docs/progresso.md quando houver domínio/revisão
8. docs/contrato-conteudo.md quando houver publicação
9. docs/ui-ux.md quando houver texto público
10. mídia quando aplicável
11. conteúdo existente relacionado
```

Não depender da conversa anterior para decisões duradouras.

## Regra final

Ao escolher entre uma formulação tecnicamente elegante e uma que o aluno compreende melhor, preserve a precisão internamente e **ensine externamente da forma mais clara, completa e simples possível, respeitando o que o aluno já teve oportunidade de construir naquele ponto do percurso**.
