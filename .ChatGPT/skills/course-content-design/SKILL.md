# Skill: Course Content Design

> **Escopo:** esta skill é destinada ao **ChatGPT** trabalhando no projeto `Portugues-completo`. **Não é uma instrução para Codex** e não deve ser interpretada como documentação sobre como o Codex funciona.

## Objetivo

Ajudar o ChatGPT a planejar e produzir conteúdo pedagógico do curso sem perder as decisões já consolidadas sobre clareza, progressão, evidência, atividades e uso de mídia.

## Fontes de verdade

Antes de propor estrutura curricular, unidades, lições ou materiais de apoio, considerar como referência principal:

- `PROJECT_INDEX.md` para localizar as fontes oficiais atuais;
- `docs/mapa-curso.md` para níveis, áreas, competências de saída e progressão geral;
- `docs/roadmap-curricular.md` para maturidade curricular;
- `docs/roadmap-produto.md` quando a tarefa envolver publicação/renderer/progresso;
- `docs/unidades-nivel-0.md` e `docs/licoes-nivel-0.md` como referências históricas do dimensionamento inicial;
- `docs/conteudo.md` para estrutura pedagógica e critérios de apresentação;
- `docs/exercicios.md` quando houver checagem, prática, produção ou evidência;
- `docs/progresso.md` quando a atividade participar de conclusão, revisão ou domínio;
- `docs/contrato-conteudo.md` quando a autoria precisar ser compatível com runtime/publicação;
- `docs/avaliacao-ia.md` quando uma atividade aberta puder usar feedback assistido;
- `docs/arquitetura.md` para limitações técnicas, mídia externa, TTS e organização do projeto;
- `producao-midia/README.md` e `producao-midia/FILA-MIDIA.md` quando mídia puder ser relevante.

Se uma nova decisão relevante entrar em conflito com esses documentos, não assumir silenciosamente a mudança. Explicar a razão e atualizar a fonte oficial quando a nova decisão for adotada.

## Princípio central

```text
estrutura pedagógica consistente
+
composição de mídia flexível
+
evidência compatível com a competência
```

Não transformar cada lição em template rígido, mas garantir objetivo claro, explicação, exemplificação, oportunidade de checagem e consolidação/prática quando apropriado.

## Clareza antes de variedade

Priorizar a forma mais simples que ensine bem.

Não adicionar imagem, vídeo, animação, áudio ou interação apenas para tornar a aula mais dinâmica.

Cada recurso deve melhorar pelo menos:

- compreensão;
- demonstração;
- memória;
- contextualização;
- percepção auditiva/visual;
- prática.

## Regra de foco

Evitar múltiplos elementos competindo ao mesmo tempo.

Cada momento deve ter foco principal: ler, observar, ouvir, assistir ou responder.

Quebrar conteúdo longo em blocos progressivos.

## Vídeo

Vídeo é opcional.

Usar quando houver vantagem clara em ver algo acontecendo, como pronúncia, entonação, leitura expressiva, demonstração passo a passo ou situação comunicativa.

Se texto, exemplo ou imagem transmitir a mesma ideia com mais clareza/rapidez, não recomendar vídeo.

## Imagens

Usar quando reduzirem esforço de compreensão ou adicionarem informação pedagógica real.

Evitar imagens meramente decorativas.

Quando a própria UI puder representar informação como letras, tabelas, relações, mapas ou diagramas semânticos, preferir recurso gerado pela interface a arquivo de imagem.

## Narração e áudio controlado

A narração geral usa TTS do navegador/dispositivo.

TTS variável é adequado quando pequenas diferenças entre vozes não alteram o objeto pedagógico.

Quando características específicas do som fizerem parte da aprendizagem ou determinarem a resposta, planejar `AUDIO_CONTROLADO` e registrar em `producao-midia/FILA-MIDIA.md`.

## Checagem, exercício e produção

Não confundir função pedagógica com componente visual.

```text
checagem
→ confirma entendimento imediato
→ normalmente role CHECK

prática/exercício
→ opera sobre conteúdo
→ role PRACTICE ou EVIDENCE conforme função

produção aberta
→ resposta autoral/complexa
→ role PRODUCTION/EVIDENCE

verificação
→ integra competências
→ role VERIFICATION
```

O contrato oficial de interação, avaliação e evidência fica em `docs/exercicios.md`.

### Regra de autoria de atividades

Ao criar uma atividade, conseguir responder:

```text
por que existe?
→ role

como o aluno interage?
→ interaction

como pode ser avaliada?
→ evaluation

que evidência produz?
→ evidence

que estímulo necessita?
→ stimuli
```

Não inventar novo componente apenas porque o `type` pedagógico é novo.

### Respostas abertas

Não reduzir interpretação, argumentação, síntese, escrita, edição ou oralidade a palavras-chave frágeis.

Quando necessário, declarar:

- critérios;
- limites;
- `recordResponse`;
- validação automática permitida ou não;
- necessidade de avaliador confiável.

Se uma atividade exige avaliador confiável, IA pode fornecer feedback conforme `docs/avaliacao-ia.md`, mas não deve produzir domínio automático por padrão.

## Conteúdo complementar

Informações secundárias, curiosidades e aprofundamentos não devem interromper a linha principal.

Quando apropriado, usar `Saiba mais`/`Aprofundamento`.

Nunca esconder conhecimento necessário em bloco opcional.

## Forma de trabalho com o usuário

O projeto é grande. Evitar despejar dezenas de decisões quando isso não for necessário.

Preferir:

1. definir a camada atual;
2. discutir critérios;
3. consolidar decisão;
4. documentar;
5. avançar.

Ao recomendar estrutura, apresentar direção principal clara antes de alternativas.

## Planejamento curricular

A progressão geral é:

```text
0 — Fundamentos
1 — Básico
2 — Intermediário
3 — Avançado
4 — Domínio
```

O currículo N0→N4 já está fechado em M5. Nova autoria ampla só deve ocorrer quando houver necessidade real detectada por validação/teste, não para alimentar o frontend com um formato mais conveniente.

Para implementação/publicação, seguir `docs/roadmap-produto.md` e adaptar o conteúdo existente pelo contrato de runtime antes de reescrevê-lo.

## Dimensionamento por camada

A hierarquia conceitual continua:

```text
Nível
→ Área
→ Unidade
→ Lição
→ Checagens / Exercícios / Produções / Verificações
```

Cada camada responde a perguntas compatíveis com seu grau de abstração.

### Dimensionamento de um nível

Definir:

```text
Objetivo geral
Competências de saída
Grandes áreas
```

Competências devem ser observáveis/verificáveis sempre que possível.

### Dimensionamento de uma área

Definir:

```text
Objetivo da área
Competências ao concluir
Conteúdos essenciais
Limites
```

Limites evitam crescimento indefinido e antecipação inadequada.

### Dimensionamento de unidade

Usar:

```text
Objetivo da unidade
Competências ao concluir
Conteúdos nucleares
Retomadas e conexões
Evidências de conclusão
Limites
```

Uma área não corresponde obrigatoriamente a uma unidade. Competências podem atravessar várias unidades.

### Dimensionamento de lição

Registrar:

```text
Objetivo
Competências
Conteúdo e dependências
Modalidade principal
Recursos necessários
Tipos de prática
Evidência de conclusão
```

Ao detalhar atividade que produzirá evidência, usar `docs/exercicios.md` e preservar compatibilidade com `docs/contrato-conteudo.md`.

## Mídia durante o planejamento de lições

Fluxo quando houver necessidade real:

```text
necessidade pedagógica
→ verificar se TTS/recurso existente basta
→ se exigir produção humana, criar ID permanente
→ registrar em producao-midia/FILA-MIDIA.md
→ referenciar pelo ID
→ continuar partes independentes
```

Não deixar demanda de mídia apenas na conversa.

IDs seguem o padrão documentado em `producao-midia/README.md`, por exemplo:

```text
N0-U01-L03-AUD-001
```

Cada demanda precisa informar:

- onde será usada;
- objetivo;
- roteiro/conteúdo exato;
- orientações;
- nome esperado;
- destino;
- critérios de validação;
- prioridade/status/obrigatoriedade.

Mídia obrigatória pendente não bloqueia autoria independente, mas impede declarar publicável a parte dependente.

## Contrato operacional de material de apoio por lição

Avaliar material de apoio explicitamente mesmo quando a decisão for não criar mídia.

Checklist:

```text
1. mídia curada / produção humana
2. recursos de runtime
3. recursos visuais gerados pela interface
4. dependência de publicação
5. justificativa
```

Quando o conteúdo permitir, usar bloco conceitual equivalente a:

```text
supportMaterials
├── curatedMedia
├── runtimeResources
├── generatedVisualResources
├── productionQueueRequired
├── publicationDependency
└── decisionRationale
```

Regras:

- `curatedMedia` vazio é válido;
- não criar mídia só porque não existe mídia;
- preferir UI acessível para letras/tabelas simples;
- criar ID antes do arquivo quando mídia humana for necessária;
- ligar `mediaId` às posições pedagógicas;
- atualizar fila de mídia;
- reutilizar IDs quando a mesma mídia cumprir a mesma função;
- implementação depende do ID lógico, não nome físico;
- dependência obrigatória bloqueia publicação, não autoria independente.

## Inicialização em conversa sem contexto

Se a tarefa envolver criação/revisão curricular:

```text
1. ler PROJECT_INDEX.md
2. ler esta skill
3. ler docs/roadmap-curricular.md
4. ler documentos curriculares específicos
5. ler docs/conteudo.md
6. ler docs/exercicios.md se houver atividades/evidência
7. ler docs/progresso.md se houver conclusão/domínio/revisão
8. ler docs/contrato-conteudo.md se o material será publicado/renderizado
9. ler mídia quando aplicável
10. inspecionar conteúdo existente
```

Se a tarefa for de produto/publicação, `docs/roadmap-produto.md` substitui o roadmap curricular como guia do próximo marco, mantendo o currículo como fonte de conteúdo.

Não depender da conversa anterior para descobrir decisões duradouras.

## Regra de progressão

Fluxo preferido:

```text
definir
→ verificar cobertura/limites
→ consolidar
→ documentar
→ atualizar roadmap aplicável
→ avançar
```

Evitar produzir conteúdo novo para compensar uma lacuna puramente técnica de renderer/catalog.

## Regra final

A tecnologia serve à aprendizagem.

Ao escolher entre solução chamativa e solução clara, preferir a que ajuda o aluno a compreender, praticar e reter com menor carga desnecessária e evidência mais válida.
