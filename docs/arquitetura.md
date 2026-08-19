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
- Serviços como conteúdo, áudio, configurações, progresso, IA e GitHub devem ficar isolados da interface.
- Preferências locais e progresso acadêmico são dados diferentes e não devem compartilhar a mesma fonte de verdade.
- O conteúdo didático e o progresso pedagógico são únicos; modos de estudo alteram a experiência de uso, não criam currículos paralelos.
- Gamificação é uma camada opcional e não define domínio pedagógico.
- Atividade pedagógica, interação visual, avaliação e evidência são dimensões separadas.
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
    |   `-- conteúdo + manifests do curso em JSON
    |
    |-- Google Drive / providers externos
    |   `-- mídias pedagógicas
    |
    |-- provedor de IA escolhido pelo aluno
    |   `-- feedback assistido via API key do próprio aluno
    |
    `-- GitHub REST API
        |-- identifica o aluno
        `-- lê e grava o progresso em Gist
```

## Estrutura de arquivos

Estrutura base/alvo:

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
|   |   |   |-- content-service.js        (quando implementado)
|   |   |   |-- narration-service.js
|   |   |   |-- settings-service.js
|   |   |   |-- progress-service.js       (quando implementado)
|   |   |   |-- ai-feedback-service.js    (quando implementado)
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
|   |-- levels/
|   `-- units/
|       `-- 001-.../
|           |-- unit.json                  (manifesto quando publicado)
|           |-- integrated-verification.json
|           `-- lessons/
|
|-- docs/
|   |-- arquitetura.md
|   |-- contrato-conteudo.md
|   |-- conteudo.md
|   |-- exercicios.md
|   |-- progresso.md
|   |-- persistencia-progresso.md
|   |-- avaliacao-ia.md
|   |-- mapa-curso.md
|   |-- configuracoes.md                   (quando criado)
|   `-- convencoes.md                      (quando criado)
|
|-- schemas/                               (quando implementados)
|-- scripts/
|-- .github/
`-- .ChatGPT/
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

A pasta existe para evitar que CSS, JavaScript e assets de interface concorram na raiz com conteúdo, documentação e arquivos de governança.

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
ContentService
- carregar course.json e manifests
- carregar lições/verificações
- normalizar gerações de conteúdo para o runtime
- rejeitar versões/formato incompatíveis explicitamente

NarrationService
- carregar vozes disponíveis
- falar texto
- parar, pausar e retomar quando suportado

SettingsService
- carregar preferências
- salvar preferências
- aplicar tema e tipografia
- armazenar preferência de modo de estudo e opções locais de IA

ProgressService
- carregar/salvar progresso pedagógico
- registrar lições, evidências e estados de aprendizagem
- calcular clusters, revisão e competências
- fornecer eventos que a gamificação possa consumir sem controlar domínio

AiFeedbackService
- receber contrato neutro de avaliação
- chamar adapter do provider escolhido
- validar/normalizar feedback estruturado
- nunca gravar domínio diretamente

GitHubService
- autenticar chamadas
- identificar usuário
- localizar, criar e atualizar Gist
```

Contratos:

- conteúdo/runtime: `docs/contrato-conteudo.md`;
- atividades: `docs/exercicios.md`;
- progresso pedagógico: `docs/progresso.md`;
- persistência/cálculo mecânico: `docs/persistencia-progresso.md`;
- feedback com IA: `docs/avaliacao-ia.md`.

A gamificação deve permanecer separada do núcleo pedagógico. Se sua implementação crescer o suficiente para justificar serviço próprio, ela deve ser isolada em vez de concentrada no `ProgressService`.

A interface não deve espalhar chamadas diretas à GitHub REST API ou a providers de IA.

### `app/js/ui/`

Responsável pela interface e interação do aluno.

Exemplos:

- menu de configurações;
- painel de áudio;
- painel de aparência;
- escolha e troca do modo de estudo;
- visualização de lição;
- visualização de exercício;
- estados de feedback, evidência, revisão e sincronização.

### `app/assets/`

Contém assets necessários ao frontend e à identidade visual da aplicação.

Mídia pedagógica pesada não deve ser colocada aqui apenas por conveniência.

### `content/`

Responsável pelo conteúdo pedagógico e pelos manifests de publicação.

O conteúdo continua declarativo em JSON. O JavaScript não deve armazenar grandes blocos pedagógicos.

O contrato oficial de descoberta é:

```text
content/course.json
→ unit.json
→ lesson/verification JSON
→ ContentService/normalizador
→ modelo de runtime
→ renderer
```

Os JSONs curriculares já existentes continuam válidos como autoria. A publicação usa manifests e adaptação incremental; não existe exigência de reescrita em massa.

Detalhes: `docs/contrato-conteudo.md`.

## Navegação

A aplicação deve usar hash routing para permanecer compatível com GitHub Pages sem reescrita de servidor.

Exemplos conceituais:

```text
#/
#/unidade/<id>
#/unidade/<id>/licao/<id>
```

O router trabalha com IDs descobertos pelo catálogo. Ele não deve adivinhar pastas ou manter uma lista curricular paralela em JavaScript.

## Conteúdo e carregamento

`app/js/app.js` é o ponto de inicialização da aplicação.

O catálogo principal é carregado de `content/course.json`.

O conteúdo atual de `course.json` ainda não publica as unidades. O marco técnico de catálogo/manifests deverá preenchê-lo de forma controlada conforme `docs/contrato-conteudo.md`.

## Atividades e renderer

O renderer não deve criar um componente diferente para cada string histórica de `type`.

A normalização separa:

```text
papel pedagógico
interação
avaliação
evidência
estímulos
```

As primitivas e políticas oficiais ficam em `docs/exercicios.md`.

O mesmo estado pedagógico deve ser representável nos modos Clássico e Gamificado sem duplicar conteúdo.

## Mídia pedagógica externa

Vídeos e imagens pertencentes ao conteúdo do curso podem ser armazenados fora do repositório, principalmente no Google Drive.

A separação é:

```text
Assets necessários ao frontend
→ app/assets/

Mídia pedagógica pesada
→ Google Drive ou outro provider declarado
```

O Google Drive não deve ser usado como substituto de `app/assets/` para arquivos essenciais ao funcionamento ou identidade visual da aplicação.

### Referência pelo conteúdo

As lições não devem depender da estrutura interna de pastas do Drive.

Cada bloco declara apenas os dados necessários para localizar a mídia.

Exemplo:

```json
{
  "type": "video",
  "provider": "google-drive",
  "fileId": "1AbCdEfGh123456"
}
```

Nenhuma credencial privada do Google Drive deve ser incluída no frontend ou nos JSON do curso.

A aplicação não deve listar automaticamente uma pasta do Drive para descobrir o conteúdo. Cada unidade ou lição declara explicitamente a mídia utilizada.

### Abstração por provider

O campo `provider` evita acoplamento permanente ao Google Drive.

A interface/serviço decide como renderizar cada provider.

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
- IA / feedback, quando implementado
```

### Áudio

Pode configurar narração, voz, velocidade, tom, volume e teste.

### Aparência

Pode configurar tema, tamanho/família da fonte, cor do texto e restauração dos padrões.

### Modo de estudo

O aluno pode escolher entre duas experiências sobre o mesmo curso:

```text
Clássico
→ experiência direta e focada no conteúdo
→ sem XP, missões, conquistas ou progressão de jogo obrigatória

Gamificado
→ mesmo conteúdo e mesmo progresso pedagógico
→ acrescenta camada opcional de XP, conquistas, missões, sequência de estudo e outros recursos de jogo
```

A escolha inicial deve ser apresentada em momento apropriado e permanecer alterável nas configurações.

O controle visual definitivo pode ser botão, seletor, cards ou outro componente adequado. A arquitetura define o comportamento, não obriga um componente específico antes do desenho da interface.

## Modos de experiência de estudo

O Português Completo possui **um único currículo e um único núcleo de progresso pedagógico**.

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

- não exige XP;
- não exige missões;
- não exige conquistas;
- não exige sequência de dias;
- mostra progresso curricular, revisão, prática e domínio quando úteis;
- não acumula XP ocultamente.

### Modo Gamificado

Usa o mesmo conteúdo e evidências, acrescentando camada motivacional opcional.

Gamificação não substitui avaliação pedagógica. XP, conquistas ou frequência não são prova automática de domínio.

### Troca de modo

Ao trocar de modo, permanecem intactos:

- lições iniciadas/concluídas;
- evidências;
- competências;
- revisões;
- estado curricular.

Clássico → Gamificado não reconstrói XP retroativo. Gamificação anterior pode ser preservada para eventual retorno.

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
preferências de IA não secretas
```

`localStorage` não é a fonte oficial do progresso acadêmico.

## Identificação e progresso dos alunos

A arquitetura usa a própria conta GitHub do aluno e um Gist pertencente a ele para sincronizar progresso entre dispositivos.

Fluxo:

```text
Aluno fornece credencial compatível
→ aplicação identifica conta pela GitHub REST API
→ localiza/cria Gist
→ carrega/atualiza progresso
```

Arquivo oficial:

```text
portugues-completo-progress.json
```

O schema v1 e as regras de merge/migração ficam em `docs/persistencia-progresso.md`.

A credencial deve pertencer ao próprio aluno, ter apenas permissões necessárias e nunca ser commitada.

O mecanismo exato de token e permissões disponíveis deve ser verificado na documentação atual do GitHub antes da implementação definitiva.

## IA, feedback e credenciais do aluno

A integração com IA preserva a arquitetura estática e não pode depender de chave secreta pertencente ao projeto exposta ao navegador.

```text
nenhuma chave privada do projeto para IA
→ frontend
→ repositório
→ JSON do curso
→ configuração pública
```

Qualquer integração com provider pago usa credencial pertencente ao próprio aluno, mas o transporte deve respeitar a política de segredo do provider. Credenciais classificadas como segredo **não podem ser inseridas ou persistidas no código client-side**. Para OpenAI, o P6 usa o companion local documentado em `docs/p6-transporte-ia.md`.

### Separação entre credenciais

```text
credencial GitHub
→ identidade + Gist

API key de IA
→ provider escolhido pelo aluno
→ nunca Gist
→ nunca progresso
```

O `ProgressService` e o `GitHubService` não devem receber/persistir a API key de IA como dado acadêmico.

### Segredos de provider e credenciais de sessão

Regra vigente:

```text
segredo de longa duração do provider
→ nunca frontend/browser
→ nunca localStorage/sessionStorage do GitHub Pages
→ nunca Gist/progresso
```

Um adapter pode usar credencial **efêmera e limitada ao próprio transporte**, desde que ela não seja a API key do provider. No adapter OpenAI do P6:

```text
OPENAI_API_KEY do aluno
→ processo local em 127.0.0.1

browser
→ token efêmero do companion
→ sessionStorage
→ nunca Gist/progresso
```

Detalhes, threat model e execução: `docs/p6-transporte-ia.md`.

### Responsabilidade e transparência

A interface deve informar que:

- a API key pertence ao aluno;
- o aluno deve mantê-la secreta;
- uso, limites e custos pertencem à conta do titular;
- feedback de IA envolve envio da resposta/contexto necessário ao provider escolhido;
- IA pode errar e algumas atividades permanecem `VALIDACAO_PENDENTE`.

O contrato completo de request/response, consentimento, fallback e autoridade pedagógica fica em `docs/avaliacao-ia.md`.

## Fontes oficiais dos dados

```text
Preferências do dispositivo
→ localStorage

Credenciais temporárias
→ armazenamento de sessão quando aplicável

Segredo de provider de IA
→ fora do frontend conforme política do provider
→ no OpenAI/P6: companion local
→ nunca Gist/progresso

Token efêmero do companion
→ sessionStorage
→ nunca Gist/progresso

Progresso acadêmico
→ Gist do aluno
→ schema: docs/persistencia-progresso.md

Conteúdo pedagógico
→ content/
→ contrato: docs/contrato-conteudo.md

Mídia pedagógica pesada
→ provider externo declarado

Assets do frontend
→ app/assets/
```

## Documentação

```text
docs/arquitetura.md
→ decisões estruturais e técnicas

docs/contrato-conteudo.md
→ catálogo, manifests, normalização e versionamento do conteúdo

docs/conteudo.md
→ estrutura pedagógica e mídia

docs/exercicios.md
→ atividades, interações, avaliação e evidência

docs/progresso.md
→ significado pedagógico de progresso, domínio, revisão e gamificação

docs/persistencia-progresso.md
→ schema do Gist e cálculo mecânico

docs/avaliacao-ia.md
→ contrato de feedback/avaliação assistida por IA

docs/mapa-curso.md
→ progressão curricular e níveis
```

`PROJECT_INDEX.md` é o mapa de entrada do repositório e deve apontar para todas as fontes de verdade.

## Validação estrutural

Os validadores atuais protegem estrutura/referências e sintaxe JSON.

A próxima camada deve implementar schemas e integridade conforme contratos agora definidos. Detalhes em `docs/validacoes.md`.

## Vantagens

- sem servidor próprio;
- sem banco externo;
- publicação simples pelo GitHub Pages;
- conteúdo separado da lógica;
- contratos de runtime estáveis sem reescrita curricular em massa;
- preferências independentes do progresso;
- mesmo progresso pedagógico em qualquer modo;
- gamificação opcional;
- IA opcional/BYOK sem chave secreta do projeto no frontend;
- Gist compacto e versionado;
- evolução gradual por schemas e normalização.

## Limitações aceitas

- cada aluno precisa de conta GitHub para sincronizar progresso;
- existe configuração inicial de credencial;
- GitHub é dependência da sincronização;
- Gist é armazenamento simples, não banco relacional;
- sincronização entre dispositivos exige estratégia de conflito testada;
- vozes de narração variam entre sistemas/navegadores;
- mídias externas dependem do provider;
- credenciais de provider permanecem dependentes do ambiente seguro escolhido pelo aluno;
- no adapter OpenAI, iniciar o companion em outro dispositivo exige configurar a API key novamente naquele processo local;
- uso de IA depende de conta/chave/custos do próprio aluno;
- valores exatos de XP e catálogo inicial de missões/conquistas continuam calibráveis sem alterar o contrato pedagógico;
- a arquitetura foi escolhida para um grupo pequeno de usuários, não milhares simultâneos.

## Regra principal

O projeto deve manter separadas:

```text
interface
catálogo/normalização de conteúdo
conteúdo pedagógico
atividades/avaliação
mídia pedagógica
configurações
narração
progresso pedagógico
persistência/sincronização
gamificação opcional
integração com GitHub
feedback com IA/credenciais locais
documentação
validação estrutural
```

Nenhuma dessas áreas deve crescer concentrada dentro de `index.html` ou de um único arquivo JavaScript.
