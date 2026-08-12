# Arquitetura

## Objetivo

Construir uma plataforma completa de ensino de português usando o GitHub Pages como interface, sem depender de Vercel, Neon, Supabase ou outro backend externo.

## Arquitetura escolhida

```text
GitHub Pages
    |
    |-- HTML / CSS / JavaScript
    |-- Conteúdo do curso
    |-- Exercícios
    |-- XP, níveis e progresso visual
    |
    `-- GitHub REST API
            |
            |-- identifica o aluno pela conta GitHub
            `-- lê e grava o progresso em um Gist do próprio aluno
```

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

Exemplo de conteúdo:

```json
{
  "schemaVersion": 1,
  "aluno": "joao",
  "xp": 1250,
  "nivel": 3,
  "licaoAtual": "3.4",
  "concluidas": [
    "1.1",
    "1.2",
    "1.3",
    "2.1"
  ],
  "ultimaAtividade": "2026-08-11T22:30:00-03:00"
}
```

Na primeira utilização, se o Gist ainda não existir, o sistema cria um novo.

Nas próximas utilizações, o sistema localiza o Gist, lê `portugues-completo-progress.json` e restaura o progresso do aluno.

## Fluxo de uso

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

## Responsabilidades

### GitHub Pages

Responsável por:

- renderizar toda a interface;
- servir HTML, CSS e JavaScript;
- apresentar aulas e exercícios;
- calcular estados temporários da interface;
- chamar a GitHub REST API.

### GitHub

Responsável por:

- fornecer a identidade da conta do aluno;
- autorizar chamadas com o token individual;
- armazenar o arquivo de progresso em Gist;
- disponibilizar o progresso em diferentes dispositivos.

## Camada de código recomendada

O frontend não deve acessar a API do GitHub de forma espalhada pelo projeto.

A implementação deve ser centralizada em serviços, por exemplo:

```text
AuthService
- connect(token)
- disconnect()
- getCurrentUser()

ProgressService
- findProgressGist()
- createProgress()
- loadProgress()
- saveProgress(progress)
```

Isso mantém o restante do curso independente da forma de armazenamento.

## Token

O token deve pertencer ao próprio aluno e possuir somente as permissões necessárias.

Ele nunca deve ser incluído no código-fonte, commitado no repositório ou compartilhado entre alunos.

O progresso não deve depender de `localStorage` como fonte oficial de dados.

Se for necessário manter a credencial apenas durante a sessão, pode-se usar armazenamento temporário no navegador, como `sessionStorage`. A persistência definitiva continua sendo o Gist.

## Vantagens

- sem servidor próprio;
- sem banco de dados externo;
- sem Vercel, Neon ou Supabase;
- GitHub Pages continua sendo toda a hospedagem da aplicação;
- cada aluno possui seus próprios dados;
- trocar de computador não elimina o progresso;
- o progresso não fica misturado aos commits do repositório do curso;
- não é necessário entregar aos alunos permissão de escrita no repositório `Portugues-completo`.

## Limitações aceitas

- cada aluno precisa possuir uma conta GitHub;
- existe uma configuração inicial de credencial;
- o GitHub passa a ser uma dependência da aplicação;
- Gist está sendo usado como armazenamento simples de progresso, não como banco relacional;
- o modelo foi escolhido para um grupo pequeno de usuários, principalmente familiar, e não para milhares de alunos simultâneos.

## Regra principal

O Gist é a fonte oficial do progresso do aluno.

O navegador apenas executa a interface e mantém estados temporários. Nenhum progresso importante deve existir exclusivamente no armazenamento local do navegador.
