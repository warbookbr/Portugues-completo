# Arquitetura

## Objetivo

Construir uma plataforma completa de ensino de português usando o GitHub Pages como interface, sem depender de Vercel, Neon, Supabase ou outro backend externo.

O projeto deve continuar simples de publicar, fácil de manter e organizado o suficiente para crescer para muitas unidades, lições e exercícios sem concentrar responsabilidades em poucos arquivos.

## Princípios gerais

- GitHub Pages é a hospedagem da aplicação.
- O frontend usa HTML, CSS e JavaScript nativos.
- Não usar framework ou etapa de build enquanto isso não trouxer benefício real.
- `index.html` deve permanecer pequeno e funcionar como ponto de entrada público da aplicação.
- Código da aplicação fica agrupado em `app/`.
- Conteúdo pedagógico fica separado em `content/`.
- Documentação oficial fica em `docs/`.
- Instruções específicas do ChatGPT ficam em `.ChatGPT/`.
- Serviços como áudio, configurações, progresso e GitHub devem ficar isolados da interface.
- Preferências locais e progresso acadêmico são dados diferentes e não devem compartilhar a mesma fonte de verdade.
- O conteúdo didático e o progresso pedagógico são únicos; modos de estudo alteram a experiência de uso, não criam currículos paralelos.
- Gamificação é uma camada opcional e não define domínio pedagógico.
- Assets necessários para o funcionamento e identidade visual do frontend ficam no repositório.
- Mídias pedagógicas pesadas podem ficar fora do repositório e ser referenciadas declarativamente pelo conteúdo.
- Mudanças estruturais devem manter `PROJECT_INDEX.md` e as referências carregadas por `index.html` coerentes.

## Arquitetura geral

```text
GitHub Pages
    |
    |-- index.html
    |-- app/
    |   |-- CSS
    |   |-- JavaScript
    |   `-- assets do frontend
    |
    |-- content/
    |   `-- conteúdo do curso em JSON
    |
    |-- Google Drive / providers externos
    |   `-- mídias pedagógicas
    |
    `-- GitHub REST API
        |-- identifica o aluno
        `-- lê e grava o progresso em Gist
```

## Estrutura de arquivos

Estrutura base:

```text
Portugues-completo/
|
|-- index.html
|-- README.md
|-- PROJECT_INDEX.md
|
|-- app/
|   |-- css/
|   |   |-- base.css
|   |   |-- layout.css
|   |   |-- components.css
|   |   |-- settings.css
|   |   `-- themes.css
|   |
|   |-- js/
|   |   |-- app.js
|   |   |
|   |   |-- core/
|   |   |   |-- router.js
|   |   |   `-- state.js                  (quando necessário)
|   |   |
|   |   |-- services/
|   |   |   |-- narration-service.js
|   |   |   |-- settings-service.js
|   |   |   |-- progress-service.js       (quando implementado)
|   |   |   `-- github-service.js         (quando implementado)
|   |   |
|   |   |-- ui/
|   |   |   |-- settings-menu.js
|   |   |   |-- audio-settings.js
|   |   |   |-- appearance-settings.js
|   |   |   |-- lesson-view.js            (quando implementado)
|   |   |   `-- exercise-view.js          (quando implementado)
|   |   |
|   |   `-- utils/
|   |       `-- dom.js                     (quando necessário)
|   |
|   `-- assets/
|       |-- icons/
|       `-- images/
|
|-- content/
|   |-- course.json
|   `-- units/
|       `-- 001-fundamentos/
|           |-- unit.json
|           |-- lessons/
|           `-- exercises/
|
|-- docs/
|   |-- arquitetura.md
|   |-- mapa-curso.md
|   |-- conteudo.md
|   |-- exercicios.md                      (quando criado)
|   |-- progresso.md
|   |-- configuracoes.md                   (quando criado)
|   `-- convencoes.md                      (quando criado)
|
|-- scripts/
|   `-- validate-project.mjs
|
|-- .github/
|   `-- workflows/
|       `-- validate-project.yml
|
`-- .ChatGPT/
    |-- README.md
    `-- skills/
```

## Separação de responsabilidades

### `index.html`

Responsável apenas por:

- fornecer o contêiner principal da aplicação;
- carregar os estilos de `app/css/`;
- carregar `app/js/app.js`;
- manter o mínimo possível de marcação e lógica inline.

Como o projeto é publicado em um subcaminho do GitHub Pages, referências locais devem preferir caminhos relativos, evitando caminhos iniciados por `/`.

### `app/`

Contém a aplicação entregue ao navegador.

A pasta existe para evitar que `css/`, `js/` e assets de interface concorram na raiz com conteúdo, documentação e arquivos de governança.

### `app/css/`

Responsável exclusivamente pela apresentação visual.

As configurações de tema, fonte, escala e cor devem usar variáveis CSS para evitar alterações de estilo espalhadas pela aplicação.

### `app/js/core/`

Infraestrutura central da aplicação.

Exemplos:

- roteamento;
- estado global realmente necessário;
- coordenação estrutural da aplicação.

### `app/js/services/`

Serviços independentes da interface.

Responsabilidades previstas:

```text
NarrationService
- carregar vozes disponíveis
- falar texto
- parar, pausar e retomar quando suportado

SettingsService
- carregar preferências
- salvar preferências
- aplicar tema e tipografia
- armazenar a preferência de modo de estudo

ProgressService
- carregar progresso pedagógico
- salvar progresso pedagógico
- registrar lições, evidências e estados de aprendizagem
- fornecer eventos de progresso que a gamificação possa consumir sem controlar o domínio

GitHubService
- autenticar chamadas
- identificar usuário
- localizar, criar e atualizar Gist
```

As regras funcionais do `ProgressService`, feedback, revisão, domínio e gamificação ficam em `docs/progresso.md`.

A gamificação deve permanecer separada do núcleo pedagógico. Se sua implementação crescer o suficiente para justificar serviço próprio, ela deve ser isolada em vez de concentrada no `ProgressService`.

A interface não deve espalhar chamadas diretas à GitHub REST API.

### `app/js/ui/`

Responsável pela interface e interação do aluno.

Exemplos:

- menu de configurações;
- painel de áudio;
- painel de aparência;
- escolha e troca do modo de estudo;
- visualização de lição;
- visualização de exercício.

### `app/assets/`

Contém assets necessários ao frontend e à identidade visual da aplicação.

Exemplos:

- logo;
- ícones;
- imagens de interface;
- fundos;
- elementos visuais reutilizados pelo sistema.

Mídia pedagógica pesada não deve ser colocada aqui apenas por conveniência.

### `content/`

Responsável pelo conteúdo pedagógico.

O conteúdo deve ser preferencialmente declarativo em JSON e não deve depender de JavaScript para armazenar textos de aula.

Estrutura prevista:

```text
content/
|-- course.json
`-- units/
    `-- 001-fundamentos/
        |-- unit.json
        |-- lessons/
        `-- exercises/
```

Os formatos definitivos de unidades, lições e exercícios devem ser documentados em `docs/`.

## Navegação

A aplicação deve usar hash routing para permanecer compatível com GitHub Pages sem reescrita de servidor.

Exemplos:

```text
#/
#/unidade/1
#/unidade/1/licao/3
#/exercicio/1/3
```

Assim o navegador sempre carrega `index.html`, e o JavaScript interpreta a parte após `#`.

## Conteúdo e carregamento

`app/js/app.js` é o ponto de inicialização da aplicação.

O catálogo principal é carregado de `content/course.json`.

À medida que unidades e lições forem implementadas, a aplicação deve carregar conteúdo declarativo em vez de incorporar grandes blocos pedagógicos no JavaScript.

## Mídia pedagógica externa

Vídeos e imagens pertencentes ao conteúdo do curso podem ser armazenados fora do repositório, principalmente no Google Drive.

A separação é:

```text
Assets necessários ao frontend
→ app/assets/

Mídia pedagógica pesada
→ Google Drive ou outro provider declarado
```

Exemplos de mídia externa:

- vídeos das unidades;
- fotografias usadas em aulas;
- ilustrações pedagógicas grandes;
- diagramas específicos do conteúdo.

O Google Drive não deve ser usado como substituto de `app/assets/` para arquivos essenciais ao funcionamento ou identidade visual da aplicação.

### Referência pelo conteúdo

As lições não devem depender da estrutura interna de pastas do Drive.

Cada bloco declara apenas os dados necessários para localizar a mídia.

Exemplo:

```json
{
  "tipo": "video",
  "provider": "google-drive",
  "fileId": "1AbCdEfGh123456"
}
```

Para vídeo do Google Drive, o frontend pode montar o player com o formato de visualização correspondente ao provider.

Nenhuma credencial privada do Google Drive deve ser incluída no frontend ou nos JSON do curso.

A aplicação não deve listar automaticamente uma pasta do Drive para descobrir o conteúdo. Cada unidade ou lição declara explicitamente a mídia utilizada.

### Abstração por provider

O campo `provider` evita acoplamento permanente ao Google Drive.

Exemplos futuros:

```text
google-drive
youtube
arquivo-local
outro provider
```

A interface decide como renderizar cada provider.

## Narração

A narração usa a Web Speech API / `speechSynthesis` do navegador ou dispositivo.

Não é necessário hospedar um arquivo de áudio para cada trecho narrado.

As vozes disponíveis variam conforme navegador e sistema operacional.

As preferências de narração pertencem às configurações locais do dispositivo.

## Configurações

A engrenagem abre primeiro um menu de categorias.

Estrutura inicial:

```text
Configurações
- Áudio
- Aparência
- Modo de estudo
```

### Áudio

Pode configurar:

- narração ligada/desligada;
- voz;
- velocidade;
- tom;
- volume;
- teste de voz.

### Aparência

Pode configurar inicialmente:

- tema claro/escuro;
- tamanho da fonte;
- família da fonte;
- cor do texto;
- restauração dos padrões.

### Modo de estudo

O aluno pode escolher entre duas experiências sobre o mesmo curso:

```text
Clássico
→ experiência direta e focada no conteúdo
→ sem XP, missões, conquistas ou progressão de jogo obrigatória

Gamificado
→ mesmo conteúdo e mesmo progresso pedagógico
→ acrescenta uma camada opcional de XP, conquistas, missões, sequência de estudo e outros recursos de jogo
```

A escolha inicial deve ser apresentada ao aluno em momento apropriado da primeira experiência. Depois disso, o modo deve permanecer alterável nas configurações.

O controle visual definitivo pode ser botão, seletor, cards ou outro componente adequado. A arquitetura define o comportamento, não obriga um componente específico antes do desenho da interface.

## Modos de experiência de estudo

O Português Completo possui **um único currículo e um único núcleo de progresso pedagógico**. Os modos Clássico e Gamificado não representam cursos diferentes e não devem duplicar lições, exercícios ou regras curriculares.

Estrutura conceitual:

```text
conteúdo didático único
        |
        v
motor pedagógico / progresso
        |
        +------------------+
        |                  |
        v                  v
modo Clássico        modo Gamificado
interface direta     camada de jogo opcional
```

### Modo Clássico

O modo Clássico deve priorizar uma experiência simples, prática e direta.

Características:

- não exige XP;
- não exige missões;
- não exige conquistas;
- não exige sequência de dias;
- mostra progresso curricular, revisão, prática e domínio quando pedagogicamente úteis;
- não deve esconder requisitos pedagógicos atrás de mecânicas de jogo.

O aluno que escolhe o modo Clássico não precisa participar de um sistema de XP em segundo plano para que o curso funcione.

### Modo Gamificado

O modo Gamificado usa o mesmo conteúdo e as mesmas evidências pedagógicas do modo Clássico, acrescentando uma camada motivacional opcional.

Essa camada poderá incluir, conforme `docs/progresso.md`:

- XP;
- conquistas;
- missões;
- sequência de estudo;
- marcos;
- progressão visual;
- estatísticas ou coleções relacionadas à jornada.

Gamificação não substitui avaliação pedagógica. XP, conquistas ou frequência não devem ser usados como prova automática de domínio de uma competência.

### Troca de modo

O aluno deve poder trocar entre Clássico e Gamificado sem reiniciar o curso.

Ao trocar de modo, devem permanecer intactos:

- lições iniciadas ou concluídas;
- evidências registradas;
- competências demonstradas;
- revisões pendentes;
- estado curricular;
- demais dados pedagógicos independentes da apresentação.

A troca modifica a experiência apresentada ao aluno, não o que ele já aprendeu ou percorreu.

O modo Clássico não acumula XP ocultamente. Ao ativar o Gamificado depois de estudar no Clássico, o progresso pedagógico anterior permanece válido, mas o XP não é reconstruído retroativamente. Dados gamificados já obtidos antes de uma troca para o Clássico podem ser preservados para eventual retorno. O contrato completo fica em `docs/progresso.md`.

### Separação entre progresso e gamificação

A arquitetura deve distinguir pelo menos três conceitos:

```text
PROGRESSO CURRICULAR
→ onde o aluno está e o que percorreu

DOMÍNIO / EVIDÊNCIA
→ o que o aluno demonstrou saber ou ainda precisa validar

GAMIFICAÇÃO
→ XP, missões, conquistas e outros elementos motivacionais opcionais
```

Os dois primeiros pertencem ao núcleo pedagógico e existem independentemente do modo escolhido.

O terceiro só participa da experiência gamificada e não deve ser fonte de verdade para domínio curricular.

## Persistência das configurações

Preferências de interface podem ser salvas em `localStorage`.

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
modo de estudo
```

`localStorage` não é a fonte oficial do progresso acadêmico.

A preferência entre Clássico e Gamificado é uma configuração de experiência; o progresso pedagógico correspondente permanece separado e deve continuar sincronizável conforme a arquitetura de progresso.

## Identificação e progresso dos alunos

A arquitetura escolhida usa a própria conta GitHub do aluno e um Gist pertencente a ele para sincronizar o progresso entre dispositivos.

Fluxo conceitual:

```text
Aluno fornece credencial compatível
        |
        v
Aplicação identifica a conta pela GitHub REST API
        |
        v
Localiza ou cria o Gist de progresso
        |
        v
Carrega e atualiza o progresso acadêmico
```

O arquivo previsto no Gist é:

```text
portugues-completo-progress.json
```

Exemplo conceitual:

```json
{
  "schemaVersion": 1,
  "aluno": "joao",
  "nivel": 3,
  "licaoAtual": "3.4",
  "concluidas": ["1.1", "1.2"],
  "ultimaAtividade": "2026-08-11T22:30:00-03:00"
}
```

O formato definitivo do progresso deve respeitar `docs/progresso.md` e separar dados curriculares, evidência/domínio, revisão e gamificação.

A credencial deve pertencer ao próprio aluno, ter apenas as permissões necessárias e nunca ser commitada no repositório.

O mecanismo exato de token e as permissões disponíveis devem ser verificados na documentação atual do GitHub antes da implementação definitiva.

Se uma credencial precisar permanecer apenas durante a sessão, `sessionStorage` pode ser usado como armazenamento temporário.

## IA, feedback e credenciais do aluno

A integração futura com provedores de IA deve preservar a arquitetura estática do GitHub Pages e **não pode depender de uma chave secreta pertencente ao projeto exposta ao navegador**.

Regra estrutural:

```text
nenhuma chave privada do projeto para provedor de IA
→ frontend estático
→ repositório
→ JSON de conteúdo
→ configuração pública do GitHub Pages
```

Qualquer integração direta entre o navegador e um provedor de IA deve usar uma credencial fornecida pelo próprio aluno, pertencente à conta dele no provedor escolhido.

### Separação entre credenciais

A credencial usada para IA e a credencial usada para GitHub/progresso são responsabilidades diferentes.

```text
credencial GitHub
→ identidade e sincronização de progresso
→ pode participar do fluxo de Gist definido pelo projeto

API key de IA
→ chamadas ao provedor de IA escolhido pelo aluno
→ nunca deve ser colocada no Gist
→ nunca deve ser sincronizada como progresso
```

O `ProgressService` e o mecanismo de Gist não devem receber, persistir ou transportar a API key de IA.

### Persistência da API key de IA

O comportamento padrão deve ser o mais conservador:

```text
aluno informa a API key
→ chave disponível somente para a sessão atual
→ ao encerrar a sessão/navegador, pode ser necessário informar novamente
```

A interface poderá oferecer explicitamente a opção:

```text
☐ Lembrar minha chave neste dispositivo
```

Somente quando o aluno escolher essa opção, a aplicação poderá persistir a chave no armazenamento local daquele navegador/dispositivo.

Essa persistência é **local**, não sincronizada. Portanto:

- trocar de computador ou celular pode exigir inserir a chave novamente;
- trocar de navegador pode exigir inserir a chave novamente;
- limpar os dados do site pode remover a chave;
- a chave não deve ser recuperada do Gist ou de qualquer outro mecanismo de progresso.

### Dispositivos públicos ou compartilhados

A interface deve deixar claro que a opção de lembrar a chave não é recomendada em computador, celular ou perfil de navegador público/compartilhado.

O padrão deve continuar sendo **não persistir a chave** sem escolha explícita do aluno.

### Responsabilidade e transparência

A interface deve informar, em linguagem clara, que:

- a API key pertence à conta do aluno no provedor de IA;
- o Português Completo não fornece uma chave privada própria pelo frontend;
- o aluno deve manter sua chave secreta e não compartilhá-la nem publicá-la;
- uso, limites, cobranças e custos associados à chave pertencem à conta do titular e são responsabilidade dele;
- escolher lembrar a chave aumenta conveniência naquele dispositivo, mas exige cuidado adicional em dispositivos compartilhados.

### Papel da IA no curso

A IA poderá futuramente apoiar feedback de respostas complexas, especialmente quando regras determinísticas não forem suficientes para diagnosticar uma produção aberta.

A integração não deve transformar uma resposta gerada pelo modelo em verdade pedagógica automática. `docs/progresso.md` define o contrato funcional: IA pode fornecer feedback assistivo, enquanto atividades que declaram necessidade de avaliador confiável permanecem com validação pendente por padrão.

## Fontes oficiais dos dados

```text
Preferências do dispositivo
→ localStorage
→ inclui a preferência de modo de estudo

Credencial temporária
→ sessionStorage, quando aplicável

API key de IA
→ sessão por padrão
→ armazenamento local somente mediante escolha explícita do aluno
→ nunca Gist/progresso

Progresso acadêmico
→ Gist do aluno

Conteúdo pedagógico
→ content/

Mídia pedagógica pesada
→ provider externo declarado no conteúdo

Assets do frontend
→ app/assets/
```

## Documentação

A documentação oficial fica em `docs/`.

Responsabilidades:

```text
docs/arquitetura.md
→ decisões estruturais e técnicas

docs/mapa-curso.md
→ progressão curricular e níveis

docs/conteudo.md
→ estrutura pedagógica, lições e uso de mídia

docs/exercicios.md
→ tipos e regras de exercícios, quando criado

docs/progresso.md
→ progresso curricular, evidência/domínio, feedback, revisão, IA assistiva e gamificação

docs/configuracoes.md
→ comportamento das preferências, quando criado

docs/convencoes.md
→ IDs, nomes, caminhos e convenções, quando criado
```

`PROJECT_INDEX.md` é o mapa de entrada do repositório e aponta para as fontes corretas.

## Validação estrutural

O projeto possui `scripts/validate-project.mjs`.

Ele deve detectar automaticamente, entre outros casos:

- caminhos explícitos do `PROJECT_INDEX.md` que não existem;
- novos itens importantes na raiz que não foram mapeados;
- documentos em `docs/` que não aparecem no índice;
- skills que não aparecem no índice do projeto ou no `.ChatGPT/README.md`;
- `src` e `href` locais quebrados em `index.html`;
- imports JavaScript quebrados alcançáveis a partir de `index.html`;
- arquivos carregados por `fetch()` com caminho local inexistente;
- referências locais de CSS quebradas;
- caminhos absolutos locais que podem falhar no GitHub Pages de projeto;
- módulos JS ou CSS órfãos, apresentados como aviso.

A validação roda pelo GitHub Actions em `.github/workflows/validate-project.yml`.

O validador não exige que cada lição ou exercício individual seja listado no `PROJECT_INDEX.md`; o índice deve mapear áreas, documentos e pontos estruturais, não virar um inventário de todo o conteúdo.

## Vantagens

- sem servidor próprio;
- sem banco de dados externo;
- publicação simples pelo GitHub Pages;
- frontend agrupado em uma área clara;
- conteúdo separado da lógica da aplicação;
- documentação centralizada;
- mídias pesadas fora do repositório;
- preferências visuais independentes do progresso;
- mesmo conteúdo e progresso pedagógico em qualquer modo de estudo;
- gamificação opcional sem contaminar a fonte de verdade de domínio;
- progresso do aluno separado dos commits do curso;
- validação automática contra referências quebradas e deriva estrutural.

## Limitações aceitas

- cada aluno precisa possuir uma conta GitHub para sincronizar progresso;
- existe configuração inicial de credencial;
- GitHub é uma dependência da sincronização;
- Gist é armazenamento simples, não banco relacional;
- vozes de narração variam entre sistemas e navegadores;
- mídias externas dependem da disponibilidade e permissões do provider;
- Google Drive não é tratado como CDN nem como filesystem da aplicação;
- uma API key de IA lembrada localmente não acompanha automaticamente o aluno entre dispositivos ou navegadores;
- limpar dados locais pode exigir que a API key de IA seja informada novamente;
- valores exatos de XP, catálogo de conquistas, missões e algoritmo de prioridade da revisão permanecem decisões de implementação/teste, sem alterar o contrato pedagógico de `docs/progresso.md`;
- a arquitetura foi escolhida para um grupo pequeno de usuários, não para milhares de alunos simultâneos.

## Regra principal

O projeto deve manter separadas as seguintes responsabilidades:

```text
interface
conteúdo pedagógico
exercícios
mídia pedagógica
configurações
narração
progresso pedagógico
gamificação opcional
integração com GitHub
integração com IA e credenciais locais
documentação
validação estrutural
```

Nenhuma dessas áreas deve crescer concentrada dentro de `index.html` ou de um único arquivo JavaScript.
