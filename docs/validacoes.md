# Validações e Guard Rails

## Objetivo

Este documento define a estratégia de validação automática do projeto **Português Completo**.

A finalidade dos guard rails é detectar cedo quebras objetivas, referências inconsistentes e deriva estrutural sem transformar o desenvolvimento em burocracia excessiva.

A regra geral é:

```text
quebra objetiva
→ erro e CI bloqueado

risco, possível abandono ou degradação
→ warning
```

Um guard rail só deve ser promovido a erro quando a condição puder ser verificada de forma confiável e representar um problema real para o projeto.

## Princípios

- Automatizar verificações mecânicas e repetitivas.
- Não tentar substituir revisão pedagógica ou julgamento humano por regras frágeis.
- Preferir validações determinísticas.
- Evitar regras que gerem muitos falsos positivos.
- Não transformar `PROJECT_INDEX.md` em inventário de todas as aulas e exercícios.
- Adicionar novas validações conforme a estrutura correspondente seja formalizada.
- Manter os validadores pequenos e separados por responsabilidade quando isso melhorar clareza.

## Camada atual — estrutura do repositório

Implementada em:

- `scripts/validate-project.mjs`
- `.github/workflows/validate-project.yml`

Protege atualmente:

- caminhos explícitos do `PROJECT_INDEX.md`;
- áreas importantes da raiz não mapeadas;
- documentos oficiais não registrados;
- skills não registradas;
- arquivos locais carregados pelo `index.html`;
- imports JavaScript;
- `fetch()` de arquivos locais;
- referências locais em CSS;
- caminhos absolutos que podem quebrar no subcaminho do GitHub Pages;
- módulos JavaScript e CSS não alcançáveis, como warning.

## Camada atual — validade sintática dos JSON

Implementada em:

- `scripts/validate-json.mjs`

Todo arquivo `.json` dentro de `content/` deve ser JSON sintaticamente válido.

Quando `schemas/` existir, os JSON dessa pasta também serão verificados automaticamente.

JSON inválido é **erro**, porque a aplicação não consegue consumi-lo de forma confiável.

Esta validação é propositalmente genérica. Ela não define ainda quais campos uma unidade, lição ou exercício deve possuir.

## Próxima camada — schemas do conteúdo

Implementar somente depois que os formatos oficiais estiverem definidos.

Estrutura prevista:

```text
schemas/
├── course.schema.json
├── unit.schema.json
├── lesson.schema.json
└── exercise.schema.json
```

Os schemas deverão validar, entre outros pontos:

- campos obrigatórios;
- tipos de dados;
- IDs;
- tipos permitidos de bloco;
- campos exigidos por cada bloco;
- formatos de mídia;
- estrutura de opções e respostas de exercícios.

Uma violação de schema deverá ser **erro**.

Não criar schemas definitivos antes de estabilizar os formatos de conteúdo, para não transformar decisões provisórias em contrato rígido.

## Camada futura — integridade curricular

Depois que unidades, lições e exercícios estiverem sendo produzidos, validar as relações entre arquivos.

Exemplos:

```text
course.json referencia uma unidade
→ a unidade precisa existir

unit.json referencia uma lição
→ a lição precisa existir

lição referencia exercício
→ o exercício precisa existir

IDs que precisam ser únicos
→ não podem se repetir no mesmo escopo
```

Referências quebradas e duplicidades que tornem o curso ambíguo deverão ser **erros**.

## Camada futura — conteúdo órfão

Detectar arquivos pedagógicos que existem, mas não são alcançáveis pelo catálogo ou pela unidade correspondente.

Exemplo:

```text
content/units/001/lessons/007.json existe
mas não é referenciado pela unidade
→ warning
```

Por padrão, conteúdo órfão deve gerar **warning**, porque pode representar material em preparação ainda não publicado.

Se no futuro houver uma convenção explícita para conteúdo em rascunho, essa validação poderá ser refinada.

## Camada futura — qualidade editorial mecânica

Automatizar apenas verificações objetivas e de baixo risco.

Possíveis exemplos:

- título obrigatório vazio;
- bloco de conteúdo vazio;
- opções idênticas em exercício de múltipla escolha;
- resposta apontando para opção inexistente;
- mídia sem identificador obrigatório;
- campos declarados que não são utilizados pelo schema.

Não usar esse validador para decidir se uma explicação está pedagogicamente boa, clara ou interessante. Isso pertence à revisão de conteúdo.

## Camada futura — acessibilidade e interface

Quando a interface estiver mais madura, adicionar verificações automáticas complementares à inspeção visual.

Possíveis áreas:

- HTML semântico;
- nomes acessíveis;
- controles sem label;
- navegação por teclado;
- problemas detectáveis de contraste;
- estados de foco;
- regressões de layout relevantes.

A automação deve complementar, não substituir, a skill de validação visual.

## Camada futura — performance e tamanho

Não definir limites arbitrários agora.

Quando houver dados reais do projeto, considerar warnings para:

- JavaScript excessivamente grande;
- CSS excessivamente grande;
- JSON individual muito grande;
- asset local pesado demais para a função que cumpre;
- crescimento inesperado do repositório.

Inicialmente esses controles devem ser **warnings**. Só devem virar erros se existir um limite técnico ou de produto claramente justificado.

## Camada futura — segurança e integrações

Quando autenticação e sincronização forem implementadas, validar pontos como:

- ausência de tokens ou segredos commitados;
- credenciais fora do conteúdo pedagógico;
- URLs e providers permitidos;
- estrutura esperada do progresso salvo;
- separação entre preferências locais e progresso acadêmico.

As regras exatas devem ser definidas junto da implementação real, especialmente quando dependerem de comportamento atual da GitHub API.

## Mídia externa

Quando houver volume suficiente de conteúdo com mídia, poderá existir uma checagem separada para referências declaradas.

Ela poderá verificar formato e consistência de `provider`, `fileId` ou equivalentes.

Verificar disponibilidade remota de cada mídia em todo push pode ser caro, lento ou instável. Se esse tipo de checagem for implementado, deve preferir execução sob demanda ou rotina específica em vez de tornar cada commit dependente de serviços externos.

## Política de evolução

A ordem recomendada é:

```text
1. estrutura e referências locais                 — implementado
2. sintaxe de JSON                                — implementado
3. schemas de course/unit/lesson/exercise         — após definição dos formatos
4. integridade entre arquivos                     — ao criar unidades reais
5. conteúdo órfão e qualidade mecânica            — com volume real de conteúdo
6. acessibilidade, performance e segurança        — conforme essas áreas amadurecerem
```

Antes de criar um novo guard rail, responder:

1. Qual problema real ele detecta?
2. A condição é verificável automaticamente com confiança?
3. Deve bloquear o CI ou apenas avisar?
4. Existe risco alto de falso positivo?
5. A regra pertence a código, conteúdo, documentação ou revisão humana?

## Execução

A validação automática é executada pelo GitHub Actions em pushes para `main` e em pull requests.

Localmente, as validações atuais podem ser executadas com:

```text
node scripts/validate-project.mjs
node scripts/validate-json.mjs
```

Este documento deve ser atualizado quando uma nova camada de guard rail for adotada oficialmente.
