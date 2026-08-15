# Skill: Course Content Design

> **Escopo:** esta skill é destinada ao **ChatGPT** trabalhando no projeto `Portugues-completo`. **Não é uma instrução para Codex** e não deve ser interpretada como documentação sobre como o Codex funciona.

## Objetivo

Ajudar o ChatGPT a planejar e produzir conteúdo pedagógico do curso sem perder as decisões já consolidadas sobre clareza, progressão e uso de mídia.

## Fontes de verdade

Antes de propor estrutura curricular, unidades, lições ou materiais de apoio, considerar como referência principal:

- `docs/mapa-curso.md` para níveis, áreas, competências de saída e progressão geral;
- `docs/roadmap-curricular.md` para estado atual, próximo passo, maturidade dos níveis e checkpoints de cobertura global;
- `docs/unidades-nivel-0.md` para o detalhamento pedagógico já consolidado das unidades do Nível 0;
- `docs/licoes-nivel-0.md` para o dimensionamento de lições já consolidado do Nível 0;
- `docs/conteudo.md` para estrutura pedagógica e critérios de apresentação;
- `docs/arquitetura.md` para limitações técnicas, mídia externa, TTS e organização do projeto;
- `producao-midia/README.md` para o contrato operacional de produção/curadoria de mídia;
- `producao-midia/FILA-MIDIA.md` para as demandas concretas de mídia já identificadas.

Se uma nova decisão relevante entrar em conflito com esses documentos, não assumir silenciosamente a mudança. Explicar a razão e atualizar a documentação quando a nova decisão for adotada.

## Princípio central

Manter:

```text
estrutura pedagógica consistente
+
composição de mídia flexível
```

Não transformar cada lição em um template rígido, mas garantir que ela tenha objetivo claro, explicação, exemplificação, oportunidade de checagem e consolidação/prática quando apropriado.

## Clareza antes de variedade

Ao planejar uma lição, priorizar a forma mais simples que ensine bem.

Não adicionar imagem, vídeo, animação, áudio ou componente interativo apenas para tornar a aula mais dinâmica visualmente.

Cada recurso deve melhorar pelo menos um aspecto como:

- compreensão;
- demonstração;
- memória;
- contextualização;
- percepção auditiva ou visual;
- prática.

## Regra de foco

Evitar múltiplos elementos competindo ao mesmo tempo.

Cada momento da lição deve ter um foco principal: ler, observar, ouvir, assistir ou responder.

Quebrar conteúdo longo em blocos progressivos em vez de criar paredes de texto ou páginas visualmente saturadas.

## Vídeo

Vídeo é opcional.

Usar quando houver vantagem clara em ver algo acontecendo, por exemplo pronúncia, entonação, leitura expressiva, demonstração passo a passo ou situação comunicativa.

Se texto, exemplo ou imagem transmitir a mesma ideia com mais clareza e rapidez, não recomendar vídeo.

Não propor vídeo obrigatório para toda unidade ou lição.

## Imagens

Usar imagens quando elas reduzirem esforço de compreensão ou adicionarem informação pedagógica real.

Evitar imagens meramente decorativas dentro do conteúdo didático.

## Narração e áudio controlado

A narração geral do curso usa TTS do navegador/dispositivo.

Pensar o texto de narração em trechos coerentes e controláveis pelo aluno, não como uma gravação longa obrigatória da página inteira.

TTS variável é adequado quando pequenas diferenças entre vozes não alteram o objeto pedagógico. Quando características específicas do som forem parte da aprendizagem ou quando a resposta correta depender precisamente do estímulo auditivo, não depender apenas do TTS do dispositivo: planejar `AUDIO_CONTROLADO` e registrar a demanda em `producao-midia/FILA-MIDIA.md`.

## Checagem e exercício

Não confundir os dois conceitos:

- `checagem`: curta, durante a explicação, confirma entendimento imediato;
- `exercício`: prática estruturada que pode afetar XP, progresso, revisão e domínio.

## Conteúdo complementar

Informações secundárias, curiosidades e aprofundamentos não devem interromper a linha principal de aprendizagem.

Quando apropriado, tratá-los como conteúdo opcional, como `Saiba mais` ou `Aprofundamento`.

Nunca esconder informação necessária para atingir o objetivo da lição dentro de um bloco opcional.

## Forma de trabalho com o usuário

O projeto é grande. Evitar despejar currículos enormes ou dezenas de decisões de uma só vez quando isso não for necessário.

Preferir:

1. definir a camada atual;
2. discutir critérios;
3. consolidar a decisão;
4. documentar;
5. avançar para a próxima camada.

Ao recomendar uma estrutura, apresentar uma direção principal clara antes de alternativas.

## Planejamento curricular

Não começar produzindo grandes quantidades de aulas antes de o nível correspondente estar suficientemente mapeado.

A progressão geral atualmente é:

```text
0 — Fundamentos
1 — Básico
2 — Intermediário
3 — Avançado
4 — Domínio
```

Tratar `docs/mapa-curso.md` como fonte oficial para a evolução desses níveis e `docs/roadmap-curricular.md` como fonte oficial para saber **onde o desenvolvimento está, qual é o próximo passo e quando um checkpoint estrutural deve ocorrer**.

O detalhamento local não deve avançar indefinidamente ignorando a maturidade das camadas superiores. Quando o roadmap estabelecer um checkpoint, concluí-lo antes de iniciar a próxima rodada extensa de autoria detalhada.

## Dimensionamento por camada

Planejar o curso de cima para baixo, sem saltar prematuramente para aulas detalhadas.

A hierarquia conceitual atual é:

```text
Nível
→ Área
→ Unidade
→ Lição
→ Checagens / Exercícios
```

Cada camada deve responder a perguntas compatíveis com seu nível de abstração. Não reutilizar mecanicamente o mesmo conjunto de perguntas em todas as camadas.

### Dimensionamento de um nível

Antes de detalhar as áreas de um nível, definir:

```text
Objetivo geral
→ onde queremos que o aluno chegue ao concluir o nível

Competências de saída
→ o que ele precisa conseguir fazer sozinho

Grandes áreas
→ quais blocos de conhecimento precisam existir para produzir essas competências
```

As competências de saída devem ser, sempre que possível, observáveis e verificáveis. Elas servirão posteriormente para orientar unidades, exercícios e critérios de conclusão.

Não transformar a lista de grandes áreas em unidades automaticamente. Primeiro verificar se as áreas cobrem adequadamente o objetivo e as competências do nível.

### Dimensionamento de uma área

Antes de dividir uma área em unidades, definir:

```text
Objetivo da área
→ o que essa área precisa construir dentro do nível

Competências ao concluir
→ o que o aluno consegue fazer depois de concluir a área

Conteúdos essenciais
→ o que obrigatoriamente precisa ser ensinado para alcançar essas competências

Limites
→ o que ainda não entra aqui e deve ficar para outra área ou etapa posterior
```

Os limites são parte importante do planejamento. Eles evitam que uma área cresça indefinidamente ou antecipe conhecimentos que serão melhor ensinados depois.

### Dimensionamento de unidade

O primeiro molde de unidade foi formalizado a partir da divisão real do Nível 0. Usar, como estrutura de planejamento:

```text
Objetivo da unidade
→ o que esta etapa precisa construir

Competências ao concluir
→ o que o aluno consegue fazer sozinho ao final da unidade

Conteúdos nucleares
→ o que precisa ser ensinado nesta unidade para produzir essas competências

Retomadas e conexões
→ conhecimentos anteriores que continuam sendo praticados ou que se conectam ao novo conteúdo

Evidências de conclusão
→ quais desempenhos observáveis mostram que as competências da unidade foram atingidas

Limites
→ o que pode aparecer como apoio ou contato, mas ainda não precisa ser dominado nesta unidade
```

Esse molde organiza a decisão pedagógica da unidade, mas não determina quantidade fixa de lições, exercícios ou componentes visuais. O número de lições deve ser definido depois, conforme densidade, dependências e necessidade de prática.

Uma área não corresponde obrigatoriamente a uma unidade. Uma unidade pode combinar conhecimentos de mais de uma área quando isso produzir uma sequência de aprendizagem mais natural.

Da mesma forma, competências transversais podem atravessar várias unidades. Uma habilidade pode:

```text
ser apresentada
→ praticada
→ retomada
→ consolidada
```

em momentos diferentes do percurso. Não adiar oralidade, escrita, pontuação ou uso cotidiano apenas porque sua sistematização ou consolidação principal ocorre em uma unidade posterior.

### Dimensionamento de lição

Ao dimensionar uma lição, não definir apenas um título. Registrar, em nível adequado de detalhe:

```text
Objetivo
→ o que a lição precisa construir

Competências
→ o que o aluno deve conseguir fazer após a lição

Conteúdo e dependências
→ o que precisa ser ensinado e o que já pode ser pressuposto

Modalidade principal
→ ler / observar / ouvir / assistir / responder, conforme o momento

Recursos necessários
→ texto, TTS, áudio controlado, imagem, vídeo ou interação somente quando houver ganho pedagógico

Tipos de prática
→ como o aluno opera sobre o conteúdo

Evidência de conclusão
→ qual desempenho mostra que a lição cumpriu seu objetivo
```

Não congelar ainda todas as telas ou quantidades exatas de exercícios se isso não for necessário para decidir a progressão.

### Mídia durante o planejamento de lições

Mídia curada deve entrar no planejamento como dependência explícita, sem bloquear a continuação do desenvolvimento.

Fluxo obrigatório quando uma necessidade real de mídia for identificada:

```text
necessidade pedagógica
→ verificar se TTS/recurso existente é suficiente
→ se exigir produção humana, criar ID permanente
→ registrar ficha completa em producao-midia/FILA-MIDIA.md
→ referenciar a mídia pelo ID no planejamento/conteúdo
→ continuar desenvolvendo o restante da lição e do curso
```

Não deixar uma demanda de mídia apenas em conversa ou em descrição solta da lição.

IDs seguem o padrão documentado em `producao-midia/README.md`, por exemplo:

```text
N0-U01-L03-AUD-001
```

Cada demanda precisa informar ao produtor, sem depender de contexto da conversa:

- onde será usada;
- objetivo pedagógico;
- roteiro/conteúdo exato;
- orientações de produção;
- nome esperado;
- destino de produção;
- critérios de validação;
- prioridade, status e obrigatoriedade para publicação.

Uma mídia obrigatória pendente não bloqueia planejamento ou implementação das partes independentes, mas o conteúdo dependente dela não deve ser considerado pronto para publicação.

### Contrato operacional de material de apoio por lição

Ao desenvolver uma lição em detalhe, **avaliar material de apoio explicitamente mesmo quando a conclusão for não criar mídia**. A ausência de imagem, vídeo ou áudio humano deve ser uma decisão pedagógica consciente, não uma omissão acidental.

Usar este checklist em toda lição:

```text
1. Mídia curada / produção humana
→ existe áudio controlado, vídeo ou imagem que realmente precisa ser produzido?
→ se sim: quais IDs, onde entram e são obrigatórios para publicação?

2. Recursos de runtime
→ TTS, texto, controles ou outro recurso fornecido pela aplicação são suficientes?
→ registrar onde são usados quando isso for relevante para implementação.

3. Recursos visuais gerados pela interface
→ algo deve ser renderizado como texto/componente da UI em vez de virar arquivo de imagem?
→ preferir UI quando ela for mais acessível, responsiva, reutilizável e fiel ao objetivo.

4. Dependência de publicação
→ o que pode ser implementado agora?
→ o que não pode ser considerado publicável enquanto uma mídia obrigatória estiver pendente?

5. Justificativa
→ por que a composição escolhida é pedagogicamente adequada?
→ por que mídias não escolhidas não acrescentariam valor suficiente?
```

Quando o formato de conteúdo da lição permitir, registrar essas decisões em um bloco conceitual equivalente a `supportMaterials`, sem tratar os nomes abaixo como schema global congelado enquanto os schemas oficiais ainda não existirem:

```text
supportMaterials
├── curatedMedia
│   └── mediaIds + tipo + finalidade + localizações + requiredForPublication
├── runtimeResources
│   └── TTS/recursos da aplicação + localizações + finalidade
├── generatedVisualResources
│   └── recursos que a própria UI deve renderizar
├── productionQueueRequired
├── publicationDependency
└── decisionRationale
```

Regras:

- `curatedMedia` vazio é válido quando nenhuma produção humana traz ganho real;
- não criar `IMG` ou `VID` apenas porque a lição ainda não tem imagem ou vídeo;
- letras, palavras, tabelas simples e outros elementos que funcionem melhor como conteúdo acessível da interface não devem ser convertidos em imagem sem necessidade;
- se uma mídia humana for necessária, criar o ID **antes** de o arquivo existir;
- ligar cada `mediaId` às posições pedagógicas exatas assim que a lição estiver detalhada;
- atualizar `producao-midia/FILA-MIDIA.md` quando essas posições se tornarem conhecidas, sem esperar exercícios formais futuros;
- reutilizar IDs existentes quando a mesma mídia cumprir a mesma função; não regravar nem renumerar sem motivo;
- a implementação deve depender do ID lógico, não do nome físico ou da pasta de produção;
- mídia obrigatória pendente não interrompe a criação das próximas lições, mas impede declarar como publicada/concluída a parte que depende dela.

### Inicialização em uma conversa sem contexto

Se a instância não tiver contexto anterior do projeto e a tarefa envolver criação/revisão de conteúdo:

```text
1. ler PROJECT_INDEX.md
2. ler esta skill
3. ler docs/roadmap-curricular.md
4. ler os documentos de nível/unidade/lição relevantes
5. ler docs/conteudo.md
6. se houver qualquer possibilidade de mídia ou material de apoio, ler producao-midia/README.md e FILA-MIDIA.md
7. inspecionar o conteúdo já existente para não duplicar IDs, decisões ou formatos
8. só então criar ou alterar a próxima unidade/lição
```

Não depender da conversa anterior para descobrir o próximo passo curricular, padrões de material de apoio, IDs de mídia, critérios de publicação ou limites pedagógicos. Se uma decisão precisa sobreviver à conversa, ela deve estar nas fontes do repositório.

### Regra de progressão

Antes de descer uma camada, verificar se a camada atual está suficientemente consolidada e se `docs/roadmap-curricular.md` não exige um checkpoint estrutural antes do próximo aprofundamento.

Fluxo preferido:

```text
definir
→ verificar cobertura e limites
→ consolidar
→ documentar quando necessário
→ atualizar o estado/roadmap quando houver avanço material
→ descer uma camada
```

Evitar produzir dezenas de unidades ou lições para compensar uma camada superior ainda mal definida.

Toda PR que altere materialmente o avanço curricular deve verificar se o foco atual, próximo passo ou maturidade registrados em `docs/roadmap-curricular.md` precisam ser atualizados na mesma mudança. Correções puramente editoriais ou técnicas não precisam mover o roadmap.

## Regra final

A tecnologia serve à aprendizagem.

Ao escolher entre uma solução mais chamativa e uma solução mais clara, preferir a que ajuda o aluno a compreender, praticar e reter o conteúdo com menor carga desnecessária.
