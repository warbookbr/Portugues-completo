# Contrato de conteúdo, catálogo e runtime

## Objetivo

Este documento define como o conteúdo curricular já existente deve chegar ao frontend de forma estável, versionável e validável.

O projeto possui hoje grande volume de JSON curricular, mas `content/course.json` ainda não publica as unidades e as pastas de unidade não possuem um manifesto uniforme. Portanto, a solução adotada é separar três camadas:

```text
AUTORIA CURRICULAR EXISTENTE
→ JSONs ricos já produzidos em content/

MANIFESTOS DE PUBLICAÇÃO
→ catálogo e unit.json com referências estáveis

MODELO NORMALIZADO DE RUNTIME
→ formato que renderer/progresso consomem
```

A separação evita reescrever centenas de lições apenas para o frontend conseguir carregá-las.

## Fontes relacionadas

- `docs/conteudo.md` — princípios pedagógicos;
- `docs/exercicios.md` — contrato de atividades e interações;
- `docs/progresso.md` — conclusão, evidência e persistência;
- `docs/avaliacao-ia.md` — feedback assistido;
- `docs/arquitetura.md` — organização técnica;
- `docs/validacoes.md` — guard rails e schemas.

## Princípios

1. Conteúdo pedagógico continua declarativo em `content/`.
2. O frontend não deve possuir textos curriculares hardcoded para contornar lacunas do catálogo.
3. O catálogo deve referenciar arquivos, não duplicar o conteúdo integral das lições.
4. IDs pedagógicos existentes devem ser preservados.
5. Caminhos físicos podem mudar no futuro; referências lógicas devem continuar estáveis.
6. O runtime deve normalizar diferenças legítimas entre gerações de conteúdo.
7. Novos contratos devem ser versionados.
8. Migração deve ser incremental e reversível; não fazer reescrita em massa sem necessidade.
9. Conteúdo não publicável pode existir no repositório sem ser exposto no catálogo público.
10. O renderer deve falhar de forma explícita diante de formato não suportado; nunca esconder conteúdo silenciosamente.

## Camada 1 — autoria curricular

Os JSONs já existentes em `content/units/**/lessons/*.json`, `integrated-verification.json` e `content/levels/**/exit-verification.json` permanecem fontes curriculares válidas.

Um payload de lição atual pode conter, entre outros:

```text
schemaVersion
id
title
status
objective
competencies
prerequisites
limits
media
supportMaterials
sequence
assessmentBehavior
completionEvidence
```

Nem todos os campos aparecem com a mesma forma em todos os níveis. Isso é esperado porque o conteúdo foi amadurecendo durante o desenvolvimento curricular.

A primeira implementação do produto **não exige regravar todos esses arquivos em um único molde**.

## Camada 2 — manifestos de publicação

### `content/course.json`

O catálogo passa a ser a porta de entrada para conteúdo publicável.

Contrato alvo:

```json
{
  "schemaVersion": 2,
  "id": "portugues-completo",
  "title": "Português Completo",
  "description": "...",
  "levels": [
    {
      "id": "N0",
      "order": 0,
      "title": "Fundamentos"
    }
  ],
  "units": [
    {
      "id": "N0-U01",
      "levelId": "N0",
      "order": 1,
      "title": "Fala, sons e escrita",
      "manifest": "units/001-fala-sons-escrita/unit.json"
    }
  ]
}
```

### Regras do catálogo

- `schemaVersion` é obrigatório.
- `id` do curso é estável.
- `levels` define agrupamento e ordem, não duplica conteúdo curricular extenso.
- `units` contém apenas unidades efetivamente descobertas pelo produto.
- `manifest` é caminho relativo a `content/`.
- a ordem é explícita; o frontend não deve depender de ordem alfabética de pasta.
- uma unidade pode existir no repositório e ainda não estar no catálogo.
- ausência do catálogo significa “não publicada”, não “conteúdo inexistente”.

## `unit.json`

Cada unidade publicável deverá possuir um manifesto.

Contrato alvo:

```json
{
  "schemaVersion": 1,
  "id": "N0-U01",
  "levelId": "N0",
  "order": 1,
  "title": "Fala, sons e escrita",
  "objective": "...",
  "competencies": [
    {
      "id": "N0-U01-C01",
      "label": "distinguir fala e escrita"
    }
  ],
  "prerequisites": [],
  "lessons": [
    {
      "id": "N0-U01-L01",
      "order": 1,
      "title": "Fala e escrita: duas formas relacionadas",
      "path": "lessons/001-fala-e-escrita.json"
    }
  ],
  "verification": {
    "id": "N0-U01-V01",
    "path": "integrated-verification.json"
  },
  "publication": {
    "status": "BLOCKED",
    "blockers": ["required-media-pending"]
  }
}
```

### Responsabilidades do manifesto

O manifesto é responsável por:

- identidade e posição da unidade;
- título utilizado na navegação;
- competências estáveis de runtime;
- referências às lições;
- referência à verificação integrada;
- pré-requisitos estruturais;
- estado de publicação derivado de dependências reais.

O manifesto **não deve duplicar** textos completos de lições.

## IDs de competência

Para progresso longitudinal, competências precisam de IDs estáveis.

O conteúdo histórico frequentemente usa descrições textuais. Durante a publicação de uma unidade, o `unit.json` deve criar uma pequena registry de competências:

```text
N0-U01-C01
N0-U01-C02
...
```

Esses IDs mapeiam para os rótulos curriculares já existentes. Não é necessário editar cada menção textual histórica de uma vez.

O normalizador resolve descrições/autoria para `competencyIds` de runtime.

### Regra

```text
texto da competência pode ser refinado editorialmente
ID da competência permanece estável enquanto o significado pedagógico central for o mesmo
```

Se o significado mudar materialmente, criar novo ID em vez de reutilizar o anterior silenciosamente.

## Estado de autoria versus estado de publicação

Não usar um único `status` para significar coisas diferentes.

### Estado de autoria

Pode continuar existindo no JSON curricular, por exemplo:

```text
conteudo-pronto-para-implementacao
```

Esse estado diz respeito à maturidade do conteúdo.

### Estado de publicação

Pertence ao manifesto de unidade/catálogo.

Valores canônicos:

```text
DRAFT
READY
BLOCKED
PUBLISHED
```

- `DRAFT`: manifesto ainda em preparação.
- `READY`: conteúdo e dependências técnicas necessárias estão prontos para publicação.
- `BLOCKED`: existe dependência explícita, como mídia obrigatória pendente ou renderer ainda não suportado.
- `PUBLISHED`: unidade está no catálogo usado pela aplicação publicada.

`READY` não implica que a unidade já foi adicionada a `course.json`.

## Caminhos

Todos os caminhos de manifesto são relativos ao arquivo que os declara ou a `content/`, conforme o campo.

Convenção:

```text
course.json.manifest
→ relativo a content/

unit.json.lessons[].path
→ relativo à pasta da unidade

unit.json.verification.path
→ relativo à pasta da unidade
```

O frontend não deve montar caminhos com base apenas em nomes ou números da unidade.

## Camada 3 — modelo normalizado de runtime

O renderer e o `ProgressService` não devem consumir diretamente todas as variações históricas.

Uma futura camada `ContentService`/normalizador deverá devolver objetos coerentes.

### Unidade normalizada

Modelo conceitual:

```json
{
  "id": "N0-U01",
  "levelId": "N0",
  "title": "Fala, sons e escrita",
  "competencies": [],
  "lessons": [],
  "verification": {},
  "publication": {}
}
```

### Lição normalizada

```json
{
  "id": "N4-U09-L01",
  "kind": "LESSON",
  "title": "Interpretação literária autônoma e evidência",
  "objective": "...",
  "competencyIds": ["N4-U09-C01"],
  "prerequisites": [],
  "limits": [],
  "blocks": [],
  "completion": {}
}
```

### Bloco normalizado

Cada elemento da sequência vira um bloco com identidade estável.

```json
{
  "id": "L01-C01",
  "kind": "ACTIVITY",
  "pedagogicalType": "interpretation-boundary-check",
  "focus": "respond",
  "content": {},
  "activity": {
    "role": "CHECK",
    "interaction": "SINGLE_CHOICE",
    "evaluation": {},
    "evidence": {},
    "stimuli": []
  }
}
```

Blocos expositivos usam `kind: CONTENT` e não precisam carregar `activity`.

## Tipos de bloco de conteúdo

O runtime não precisa apagar nomes pedagógicos como:

- `objective`;
- `explanation`;
- `demonstration`;
- `paired-example`;
- `summary`;
- `authored-literary-text`;
- `evidence-map`.

Eles ficam em `pedagogicalType` e podem usar famílias visuais reutilizáveis.

O contrato mínimo é:

```text
CONTENT
ACTIVITY
```

A especialização visual pode crescer sem alterar o contrato de progresso.

## Normalização de atividades existentes

A normalização deve considerar propriedades reais, não somente `type`.

Exemplos:

```text
interaction: single-choice
+ correct/correctIndex
→ SINGLE_CHOICE + DETERMINISTIC

automaticValidation: false
+ recordResponse: true
+ requiresReliableEvaluatorFor
→ produção aberta + RELIABLE_EVALUATOR

categories + items[].correct
→ CLASSIFY + DETERMINISTIC

correctSequence
→ SEQUENCE + DETERMINISTIC
```

O mapeamento detalhado fica em `docs/exercicios.md`.

## Conclusão normalizada

As diversas formas históricas de `completionEvidence` devem virar uma estrutura comum.

Modelo conceitual:

```json
{
  "completion": {
    "clusters": [
      {
        "id": "interpretationEvidence",
        "required": true,
        "evidenceIds": ["L01-A01"],
        "satisfaction": "PENDING_ALLOWED"
      }
    ],
    "nonCompensable": true
  }
}
```

Valores canônicos de satisfação por cluster:

```text
DEMONSTRATED_REQUIRED
PENDING_ALLOWED
ATTEMPT_REQUIRED
```

- `DEMONSTRATED_REQUIRED`: precisa de evidência `DEMONSTRADA`.
- `PENDING_ALLOWED`: `VALIDACAO_PENDENTE` conta para concluir o percurso, mas não declara domínio.
- `ATTEMPT_REQUIRED`: execução/registro basta para o percurso quando a atividade é de reflexão/processo e não pretende validar domínio.

A regra detalhada de conclusão fica em `docs/progresso.md`.

## Verificações integradas

`integrated-verification.json` e `exit-verification.json` são tipos de conteúdo avaliativo de primeira classe.

Modelo normalizado:

```text
kind: UNIT_VERIFICATION
kind: LEVEL_VERIFICATION
```

Eles podem conter:

- cobertura de competências;
- vários clusters;
- tarefas fechadas e abertas;
- políticas diferentes de feedback;
- agrupamentos obrigatórios e não compensáveis;
- dependências de mídia.

O renderer não deve tratá-los como “uma lição comum com outro título” quando isso apagar as regras de avaliação.

## Gates e navegação

A arquitetura de produto adota **gates pedagógicos suaves por padrão**.

```text
pré-requisito ainda não demonstrado
→ recomendar revisão / avisar
→ não esconder conteúdo arbitrariamente
```

Exceções só existem quando uma atividade realmente depende de capacidade ou recurso anterior para ser interpretável.

### Consequência

O aluno pode explorar conteúdo posterior, mas o sistema não deve declarar:

```text
unidade dominada
nível validado
competência consolidada
```

sem as evidências obrigatórias correspondentes.

Isso preserva flexibilidade sem transformar ausência de evidência em aprovação.

## Publicação parcial

O catálogo pode publicar o curso progressivamente.

Exemplo:

```text
N0-U01 READY
N0-U02 BLOCKED
N0-U03 DRAFT
```

`course.json` pode listar somente o que a versão pública suporta ou pode listar unidades bloqueadas com estado explícito, conforme a experiência escolhida na implementação.

Regra: o aluno nunca deve cair em uma rota que parece quebrada apenas porque o conteúdo ainda não foi publicado.

## Compatibilidade e migração

### Fase 1

```text
definir contratos
→ concluído por esta documentação
```

### Fase 2

```text
criar schemas e normalizador
→ validar formatos canônicos
→ ainda sem migrar todos os JSONs
```

### Fase 3

```text
criar unit.json por unidade publicável
→ registrar competências estáveis
→ mapear lições/verificação
```

### Fase 4

```text
preencher course.json
→ publicar por lotes validados
```

### Fase 5

Somente se trouxer benefício real, migrar payloads históricos para uma versão de autoria mais uniforme.

Não fazer essa migração apenas por estética estrutural.

## Versionamento

### `schemaVersion`

Mudança incompatível de formato aumenta a versão.

O runtime deve rejeitar versões maiores que as suportadas com mensagem explícita.

Mudanças retrocompatíveis não exigem necessariamente nova versão, mas devem ser documentadas.

### Adapter

O normalizador pode suportar mais de uma geração:

```text
lesson schemaVersion 1
→ adapter v1
→ runtime normalizado

lesson schemaVersion 2
→ adapter v2
→ mesmo runtime normalizado
```

O modelo de runtime deve mudar menos frequentemente que o formato de autoria.

## Schemas futuros

Quando implementados, os schemas devem cobrir pelo menos:

```text
schemas/course.schema.json
schemas/unit.schema.json
schemas/lesson.schema.json
schemas/verification.schema.json
schemas/progress.schema.json
```

`exercise.schema.json` pode existir para atividades isoladas, mas o contrato atual permite atividades embutidas na sequência da lição/verificação. O schema deve refletir o formato realmente adotado, não uma separação artificial de arquivos.

## Validações de integridade

Após os manifests existirem, o CI deve verificar:

- `course.json` referencia manifesto existente;
- IDs de unidade são únicos;
- `unit.json.id` coincide com o ID do catálogo;
- `unit.json.lessons[].path` existe;
- IDs de lição referenciados coincidem com o JSON apontado;
- verificação referenciada existe e possui o ID esperado;
- `competencyIds` referenciados existem na unidade/escopo permitido;
- evidências e clusters apontam para atividades existentes;
- mídia obrigatória declarada tem referência válida na fila/registry aplicável;
- versão de schema é suportada.

As regras mecânicas ficam em `docs/validacoes.md` e serão implementadas no marco técnico correspondente.

## Regra de fechamento

O frontend deve descobrir conteúdo assim:

```text
course.json
→ unit.json
→ lesson/verification JSON
→ normalizador
→ runtime model
→ renderer
```

Nunca assim:

```text
router adivinha pasta
→ JavaScript contém lista manual paralela
→ renderer interpreta dezenas de formatos diretamente
```

Se uma nova lição exigir alterar o router apenas para ser encontrada, o catálogo ainda não está cumprindo seu papel.
