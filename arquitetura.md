# Arquitetura

## Objetivo

Construir uma plataforma completa de ensino de português usando o GitHub Pages como interface, sem depender de Vercel, Neon, Supabase ou outro backend externo.

O projeto deve continuar simples de publicar, fácil de manter e organizado o suficiente para crescer para muitas unidades, lições e exercícios sem concentrar tudo em poucos arquivos.

## Princípios gerais

- GitHub Pages é a hospedagem da aplicação.
- O frontend usa HTML, CSS e JavaScript nativos.
- Não usar framework ou etapa de build enquanto isso não trouxer benefício real.
- `index.html` deve ser pequeno e funcionar apenas como ponto de entrada da aplicação.
- Conteúdo pedagógico não deve ficar misturado ao código da interface.
- Serviços como áudio, configurações, progresso e GitHub devem ficar isolados.
- O progresso acadêmico e as preferências locais do dispositivo são tipos diferentes de dados e devem ser tratados separadamente.

## Arquitetura geral

```text
GitHub Pages
    |
    |-- HTML / CSS / JavaScript
    |-- conteúdo do curso em JSON
    |-- interface de aulas e exercícios
    |-- configurações de áudio e aparência
    |-- XP, níveis e progresso visual
    |
    `-- GitHub REST API
            |
            |-- identifica o aluno pela conta GitHub
            `-- lê e grava o progresso em um Gist do próprio aluno
```

## Estrutura de arquivos

Estrutura base recomendada:

```text
Portugues-completo/
|
|-- index.html
|-- README.md
|-- arquitetura.md
|
|-- css/
|   |-- base.css
|   |-- layout.css
|   |-- components.css
|   |-- settings.css
|   `-- themes.css
|
|-- js/
|   |-- app.js
|   |
|   |-- core/
|   |   |-- router.js
|   |   `-- state.js
|   |
|   |-- services/
|   |   |-- narration-service.js
|   |   |-- settings-service.js
|   |   |-- progress-service.js
|   |   `-- github-service.js
|   |
|   |-- ui/
|   |   |-- settings-menu.js
|   |   |-- audio-settings.js
|   |   |-- appearance-settings.js
|   |   |-- lesson-view.js
|   |   `-- exercise-view.js
|   |
|   `-- utils/
|       `-- dom.js
|
|-- content/
|   |-- course.json
|   `-- units/
|       |-- 001-fundamentos/
|       |   |-- unit.json
|       |   |-- lessons/
|       |   |   |-- 001.json
|       |   |   |-- 002.json
|       |   |   `-- 003.json
|       |   `-- exercises/
|       |       |-- 001.json
|       |       |-- 002.json
|       |       `-- 003.json
|       `-- 002-.../
|
|-- assets/
|   |-- icons/
|   `-- images/
|
|-- docs/
|   |-- conteudo.md
|   |-- exercicios.md
|   |-- configuracoes.md
|   `-- convencoes.md
|
`-- .ChatGPT/
    `-- skills/
```

## Separação de responsabilidades

### `index.html`

Responsável apenas por:

- carregar os arquivos CSS;
- carregar `js/app.js`;
- fornecer o contêiner principal da aplicação;
- manter o mínimo possível de marcação e lógica inline.

### `css/`

Responsável exclusivamente pela apresentação visual.

As configurações de tema, fonte, escala e cor devem usar variáveis CSS, evitando alterar estilos espalhados pela aplicação.

Exemplo:

```css
:root {
  --background: #ffffff;
  --surface: #ffffff;
  --text: #172033;
  --font-family: system-ui, sans-serif;
  --font-scale: 1;
}

html[data-theme="dark"] {
  --background: #080808;
  --surface: #151515;
  --text: #f3f3f3;
}
```

### `js/core/`

Infraestrutura central da aplicação.

Exemplos:

- roteamento;
- estado global necessário;
- inicialização da aplicação.

### `js/services/`

Serviços independentes da interface.

Exemplos:

```text
NarrationService
- carregar vozes disponíveis
- falar texto
- parar
- pausar
- retomar

SettingsService
- carregar preferências
- salvar preferências
- aplicar tema e tipografia

ProgressService
- carregar progresso
- salvar progresso
- atualizar XP e lições concluídas

GitHubService
- autenticar chamadas
- identificar usuário
- localizar/criar/atualizar Gist
```

A interface não deve chamar a GitHub REST API diretamente em vários lugares.

### `js/ui/`

Responsável pela interface e interação do aluno.

Exemplos:

- menu de configurações;
- painel de áudio;
- painel de aparência;
- visualização de lição;
- visualização de exercício.

### `content/`

Responsável por todo o conteúdo pedagógico.

O conteúdo deve ser preferencialmente declarativo em JSON, sem misturar texto de aula com lógica JavaScript.

Uma lição pode seguir um formato semelhante a:

```json
{
  "id": "001",
  "titulo": "O que é uma palavra?",
  "narracao": "Antes de começarmos, vamos entender o que é uma palavra.",
  "blocos": [
    {
      "tipo": "texto",
      "conteudo": "Uma palavra é..."
    },
    {
      "tipo": "exemplo",
      "conteudo": "Casa, pessoa, correr..."
    }
  ]
}
```

Exercícios ficam separados das lições e podem seguir um formato semelhante a:

```json
{
  "id": "001",
  "tipo": "multipla-escolha",
  "pergunta": "Qual destas opções é uma palavra?",
  "opcoes": ["Casa", "!!!", "123"],
  "resposta": 0,
  "explicacao": "Casa é uma palavra da língua portuguesa."
}
```

Os formatos definitivos de lições e exercícios devem ser documentados em `docs/`.

## Navegação

A aplicação deve usar hash routing para permanecer compatível com GitHub Pages sem configuração de servidor.

Exemplos:

```text
#/ 
#/unidade/1
#/unidade/1/licao/3
#/exercicio/1/3
```

Isso evita erros `404` ao atualizar diretamente uma rota, porque o navegador continua carregando `index.html` e o JavaScript interpreta a parte após `#`.

## Configurações

A engrenagem no canto superior direito abre o menu principal de configurações.

O menu deve mostrar categorias primeiro, em vez de abrir diretamente todas as opções.

Estrutura inicial:

```text
Configurações

- Áudio
- Aparência
```

### Áudio

Ao entrar em `Áudio`, o aluno pode configurar:

- narração ligada/desligada;
- voz disponível no dispositivo;
- velocidade;
- tom;
- volume;
- teste de voz.

A narração usa a Web Speech API / `speechSynthesis` do navegador e não depende de arquivos de áudio hospedados.

As vozes disponíveis dependem do navegador e do sistema operacional do aluno.

### Aparência

Ao entrar em `Aparência`, o aluno pode configurar inicialmente:

- tema claro/escuro;
- tamanho da fonte;
- família da fonte;
- cor do texto;
- restauração das configurações padrão.

O tema escuro deve usar fundo escuro e texto claro, respeitando contraste e legibilidade.

## Persistência das configurações

Preferências de interface podem ser salvas localmente no navegador.

Exemplos:

```text
tema
fonte
tamanho da fonte
cor do texto
voz
velocidade
tom
volume
narração ligada/desligada
```

Para esse tipo de dado, `localStorage` é aceitável porque são preferências daquele dispositivo e não constituem a fonte oficial do progresso acadêmico.

## Identificação dos alunos

Cada aluno usa sua própria conta GitHub.

Na primeira configuração, o aluno fornece ao site um Fine-grained Personal Access Token com acesso mínimo necessário para trabalhar com Gists.

O site usa esse token para consultar a API do GitHub e descobrir o usuário autenticado. O `login` da conta GitHub passa a ser o identificador único do aluno.

Exemplo:

```text
@joao
@maria
@pedro
```

Não é necessário manter uma tabela própria de usuários.

## Armazenamento do progresso

Cada aluno possui um Gist próprio contendo um arquivo chamado:

```text
portugues-completo-progress.json
```

Exemplo:

```json
{
  "schemaVersion": 1,
  "aluno": "joao",
  "xp": 1250,
  "nivel": 3,
  "licaoAtual": "3.4",
  "concluidas": ["1.1", "1.2", "1.3", "2.1"],
  "ultimaAtividade": "2026-08-11T22:30:00-03:00"
}
```

Na primeira utilização, se o Gist ainda não existir, o sistema cria um novo.

Nas próximas utilizações, o sistema localiza o Gist, lê `portugues-completo-progress.json` e restaura o progresso do aluno.

## Fluxo do progresso

```text
Aluno abre o Português Completo
        |
        v
Conecta sua conta GitHub
        |
        v
Site consulta a GitHub REST API
        |
        v
Identifica o @usuario
        |
        v
Procura o Gist de progresso
        |
        +-- não existe --> cria
        |
        `-- existe ------> carrega
        |
        v
Aluno utiliza o curso
        |
        v
Exercícios, XP e progresso são atualizados
        |
        v
GitHub REST API atualiza o Gist
```

## Token

O token deve pertencer ao próprio aluno e possuir somente as permissões necessárias.

Ele nunca deve ser incluído no código-fonte, commitado no repositório ou compartilhado entre alunos.

O progresso não deve depender de `localStorage` como fonte oficial de dados.

Se for necessário manter a credencial apenas durante a sessão, pode-se usar armazenamento temporário como `sessionStorage`.

## Fonte oficial dos dados

A separação é:

```text
Preferências do dispositivo
→ localStorage

Credencial temporária de sessão
→ sessionStorage, quando aplicável

Progresso acadêmico
→ Gist do aluno no GitHub
```

O Gist é a fonte oficial do progresso acadêmico.

## Documentação

`arquitetura.md` documenta decisões estruturais e responsabilidades gerais.

A pasta `docs/` documenta como trabalhar dentro dessa arquitetura.

Planejamento inicial:

```text
docs/conteudo.md
→ formato e criação de unidades e lições

docs/exercicios.md
→ tipos e formatos de exercícios

docs/configuracoes.md
→ áudio, aparência e persistência

docs/convencoes.md
→ IDs, nomes de arquivos, pastas e regras gerais
```

## Vantagens

- sem servidor próprio;
- sem banco de dados externo;
- sem Vercel, Neon ou Supabase;
- publicação simples pelo GitHub Pages;
- código dividido por responsabilidade;
- conteúdo separado da lógica da aplicação;
- possibilidade de centenas ou milhares de exercícios sem concentrá-los no JavaScript;
- preferências visuais independentes do progresso acadêmico;
- cada aluno possui seus próprios dados;
- trocar de computador não elimina o progresso acadêmico;
- o progresso não fica misturado aos commits do repositório do curso.

## Limitações aceitas

- cada aluno precisa possuir uma conta GitHub para sincronizar progresso;
- existe uma configuração inicial de credencial;
- o GitHub passa a ser uma dependência da aplicação;
- Gist é armazenamento simples de progresso, não banco relacional;
- vozes de narração variam entre sistemas e navegadores;
- a arquitetura foi escolhida para um grupo pequeno de usuários, principalmente familiar, e não para milhares de alunos simultâneos.

## Regra principal

O projeto deve manter separadas as seguintes responsabilidades:

```text
interface
conteúdo pedagógico
exercícios
configurações
narração
progresso
integração com GitHub
documentação
```

Nenhuma dessas áreas deve crescer concentrada dentro de `index.html` ou de um único arquivo JavaScript.
