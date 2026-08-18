# Plano ativo — Fundamentos claros e experiência de lição

**Status:** `ATIVO / AUTORIZADO`

**ID operacional:** `CL-T1-FUNDAMENTOS-CLAROS`

**Posição estratégica:** refinamento transversal pós-P5 e antes do P6.

**Objetivo:** corrigir a porta de entrada pedagógica e visual do Modo Clássico antes de expandir o produto, garantindo que um aluno realmente iniciante encontre uma progressão natural, textos fáceis de entender e uma lição que revele uma coisa por vez.

---

## 1. Por que este plano existe

A validação visual e de uso do slice atual revelou problemas que não devem ser carregados para P6/P7:

- a primeira lição publicada começa por uma abstração sobre fala e escrita antes de ensinar fundamentos mais concretos;
- alfabeto, vogais, consoantes e sílabas existem no N0, mas entram tarde demais para a sensação de “começar do zero”;
- objetivos internos precisos estão aparecendo em linguagem inadequada para o aluno;
- a tela inicial de uma lição ainda mistura apresentação, progressão e conteúdo cedo demais;
- mesmo com o fluxo em etapas, falta uma tela de abertura realmente limpa;
- conteúdo pedagógico e microcopy precisam de uma regra mais forte de linguagem simples;
- `Metodologia do curso` ainda ocupa espaço persistente no rodapé mesmo sendo informação secundária;
- uma mudança curricular real exige preservar progresso, IDs, manifests, mídia e deep links com segurança.

Este trabalho não é uma maquiagem de frontend. É uma revisão coordenada de:

```text
progressão curricular inicial
+ linguagem pedagógica
+ contrato de conteúdo
+ experiência da lição
+ navegação secundária
+ compatibilidade de progresso
+ skills de autoria/implementação
+ validação
```

---

## 2. Decisões já aprovadas

Estas decisões fazem parte do escopo autorizado e não precisam ser rediscutidas durante a execução, salvo se surgir conflito pedagógico/técnico material.

### 2.1 A primeira tela da lição deve ser limpa

Ao entrar pela primeira vez em uma lição, o conteúdo pedagógico inicial deve mostrar somente o necessário para orientar:

```text
Lição

Título da lição

Objetivo/explicação curta em linguagem do aluno

[ Começar lição ]
```

O controle `← Voltar para a unidade` pode permanecer como navegação externa ao conteúdo da lição.

Na tela de abertura não mostrar simultaneamente:

- cards de conteúdo;
- atividade;
- `Etapa 1 de N`;
- barra de progresso da etapa;
- badges técnicos;
- lista das etapas futuras;
- texto curricular interno;
- explicação longa;
- mídia decorativa.

A intenção é que a primeira decisão do aluno seja óbvia: entender o que vai aprender e começar.

### 2.2 Objetivo interno não é texto para o aluno

O projeto deve separar explicitamente:

```text
objetivo curricular interno
→ precisão técnica para autoria, competência e avaliação

texto de abertura da lição
→ linguagem simples, concreta e compreensível para o aluno
```

Exemplo aprovado:

```text
INTERNO
Distinguir a realização sonora da língua de sua representação escrita e compreender que fala e escrita podem transmitir mensagens relacionadas sem serem a mesma coisa.

ALUNO
Entender a diferença entre o que falamos e o que escrevemos.
```

Nunca enfraquecer o objetivo técnico internamente só para melhorar a UI. Criar uma camada de apresentação apropriada.

### 2.3 Linguagem do conteúdo deve ser mais “mastigada”

A explicação para o aluno deve seguir uma progressão de compreensão, não reproduzir linguagem de documento curricular.

Regra-base:

```text
concreto
→ exemplo familiar
→ nome do conceito
→ explicação curta
→ prática
→ ampliação
```

Preferir:

- uma ideia nova por vez;
- frases diretas;
- vocabulário cotidiano antes da terminologia especializada;
- definição imediata quando um termo novo for necessário;
- exemplo antes de abstração quando isso reduzir esforço;
- títulos que indiquem claramente o assunto;
- perguntas e instruções que digam exatamente o que o aluno precisa fazer.

Evitar:

- metalíngua antes de ela ser ensinada;
- nominalizações desnecessárias;
- frases longas com várias relações lógicas;
- termos como `realização sonora`, `representação gráfica`, `estrutura sintática`, `evidência` ou equivalentes na fala pública quando uma expressão simples comunica o mesmo sentido;
- introdução que pressuponha alfabetização ou conhecimento escolar anterior no início do N0.

### 2.4 O Nível 0 deve começar do zero de forma perceptível

O início do curso precisa construir uma escada natural de pré-requisitos.

O aluno não deve sentir que precisa compreender uma discussão abstrata sobre língua antes de aprender os elementos básicos da leitura e da escrita.

A ordem final será validada na fase curricular, mas a revisão deve obrigatoriamente considerar uma entrada próxima desta lógica:

```text
letras e alfabeto
→ vogais e consoantes
→ formas das letras / organização básica da escrita
→ o que é sílaba
→ combinar sílabas e reconhecer palavras
→ ampliar relações entre sons, fala e escrita
→ frases e sentido
→ textos progressivamente maiores
```

Isto é uma **direção de progressão**, não uma decisão antecipada de que cada linha precisa virar exatamente uma unidade.

A auditoria pode concluir que o melhor é:

- reordenar lições existentes;
- dividir a atual U1;
- criar uma ou mais unidades iniciais;
- mover a atual lição de fala/escrita para uma posição posterior;
- combinar essas estratégias.

A escolha final deve maximizar progressão natural e minimizar migração destrutiva.

### 2.5 “Metodologia do curso” sai do rodapé persistente

A metodologia continua acessível, mas deixa de ocupar espaço permanente em todas as telas.

Destino preferido:

```text
Ajuda
→ Como o curso funciona
→ Metodologia do curso
```

A rota atual pode ser preservada para compatibilidade/deep links, mas o rodapé não deve continuar exibindo o link como elemento persistente.

---

## 3. Princípios de execução

### 3.1 Não confundir revisão dirigida com reescrita indiscriminada

O N0→N4 foi fechado curricularmente em M5. Este plano reabre **de forma controlada** a porta de entrada porque a validação de produto revelou uma deficiência pedagógica real.

Não reescrever níveis inteiros por estética.

A revisão começa no N0 e só altera outras partes quando houver dependência concreta.

### 3.2 Conteúdo existente é matéria-prima, não obrigação de ordem

Exemplos, atividades e explicações corretos podem ser reutilizados.

```text
reordenar / simplificar / dividir / reaproveitar
≠ descartar tudo e começar do zero
```

### 3.3 Nenhum ID pode mudar de significado silenciosamente

Se uma lição antiga `N0-U01-L01` deixar de representar o mesmo conteúdo, não reutilizar o ID para uma lição semanticamente diferente só para evitar trabalho de migração.

Todo renomeio/reordenação material deve passar por uma matriz:

```text
ID antigo
→ conteúdo antigo
→ destino novo
→ mantém identidade? sim/não
→ ação: preservar | mover | criar novo ID | alias | migrar progresso | aposentar
```

### 3.4 Progresso do aluno é dado valioso

Nenhuma mudança pode transformar conclusão antiga em conclusão de outra competência por acidente.

Quando IDs mudarem:

- mapear progresso quando houver equivalência real;
- preservar histórico antigo quando não houver equivalência;
- nunca promover domínio por migração aproximada;
- testar Gist/localStorage e conflitos;
- manter fallback seguro para dados antigos.

### 3.5 Mídia não dita a arquitetura curricular

A nova ordem pode reaproveitar TTS, áudio controlado, UI semântica ou mídia já planejada.

Mídia antiga que perder função deve ser reclassificada; mídia pendente não pode forçar uma sequência pedagógica pior.

---

# 4. Plano de implementação

## Fase T1.0 — Baseline e ativação

**Objetivo:** congelar o estado anterior e impedir que P6 avance sobre uma base que será alterada.

### Entregas

- este plano em `docs/plano-fundamentos-claros.md`;
- roadmap de produto apontando T1 como ativo;
- P6 marcado como aguardando T1;
- skill operacional específica para o plano;
- registro de que esta revisão é transversal e autorizada.

### Gate de saída

```text
qualquer nova instância
→ encontra T1 no roadmap
→ lê este plano
→ não inicia P6 antes do fechamento de T1
```

---

## Fase T1.1 — Pesquisa e auditoria da porta de entrada

**Objetivo:** decidir a progressão inicial com base pedagógica, não apenas por intuição de layout.

### Pesquisa

Classificação: `OBRIGATÓRIA`.

Investigar fontes primárias/institucionais/acadêmicas relevantes para:

- progressão inicial de alfabetização/letramento;
- consciência fonológica e princípio alfabético;
- introdução de letras, vogais/consoantes e sílabas;
- riscos de antecipar terminologia abstrata;
- segmentação de conteúdo e carga cognitiva;
- linguagem clara para iniciantes.

A pesquisa serve para testar a ordem e detectar lacunas; não substitui a arquitetura própria do curso.

### Auditoria interna

Revisar pelo menos:

- `docs/mapa-curso.md`;
- `docs/unidades-nivel-0.md`;
- `docs/licoes-nivel-0.md`;
- conteúdo real de N0-U01 e N0-U02;
- verificações integradas;
- `N0-EXIT-V01`;
- transição N0→N1;
- manifests/catalog atuais;
- fila de mídia N0;
- competências estáveis usadas pelo progresso.

### Perguntas obrigatórias

```text
O primeiro contato exige algum conceito ainda não ensinado?
O aluno entende por que está aprendendo aquilo?
A sequência vai do concreto ao abstrato?
Uma lição usa um termo antes de defini-lo?
Há competência válida colocada cedo demais?
O que pode ser movido sem perder cobertura?
O que precisa ser criado porque a base está ausente?
```

### Gate de saída

Relatório curto de decisão com:

- problemas confirmados;
- dependências reais;
- proposta de nova espinha inicial;
- impactos em IDs/mídia/progresso;
- justificativa para reuso, divisão ou criação de unidades.

---

## Fase T1.2 — Redimensionamento curricular controlado do N0

**Objetivo:** definir a nova entrada do curso antes de escrever lições.

### Trabalho

Revisar as camadas na ordem:

```text
responsabilidade do N0
→ unidades iniciais
→ competências por unidade
→ pré-requisitos
→ lições
→ verificações
```

### Requisitos

A nova sequência precisa ensinar explicitamente e cedo, em ordem natural:

- o que é uma letra;
- o que é o alfabeto;
- reconhecimento das letras;
- vogais e consoantes em nível introdutório;
- maiúsculas/minúsculas e organização básica quando apropriado;
- o que é uma sílaba;
- formação/reconhecimento progressivo de palavras;
- relações entre sons, fala e escrita sem usar isso como abstração inaugural.

Não pressupor que “alfabeto”, “vogal”, “consoante”, “sílaba”, “palavra” ou “frase” sejam conceitos já compreendidos só porque os termos são comuns para adultos alfabetizados.

### Opções arquitetônicas que devem ser comparadas

1. reordenar a U1 existente;
2. dividir U1 em duas unidades mais simples;
3. criar uma unidade inicial anterior à atual U1;
4. reorganizar U1 + U2 em uma nova progressão;
5. mover “fala e escrita” para funcionar como síntese posterior.

A decisão deve considerar clareza **e** custo de migração, sem sacrificar aprendizagem apenas para preservar IDs.

### Saídas

Atualizar, conforme decisão final:

- mapa do curso;
- unidades N0;
- lições N0;
- competências e limites;
- verificações integradas;
- checkpoint/saída N0;
- transição N0→N1 se afetada.

### Gate de saída

Uma pessoa sem contexto deve conseguir ler a lista das primeiras lições e perceber uma progressão do zero para leitura inicial sem saltos conceituais.

---

## Fase T1.3 — Contrato de linguagem para o aluno

**Objetivo:** impedir que a complexidade da documentação curricular vaze novamente para o conteúdo público.

### Criar/adotar duas camadas

```text
objective / competência interna
→ pode ser técnico e preciso

studentObjective / intro pública
→ curta, direta e compreensível
```

O nome técnico final do campo será decidido com `docs/contrato-conteudo.md`; não criar campo incompatível sem schema/normalizer.

### Padrão da abertura

A frase pública deve normalmente responder:

> O que eu vou entender ou conseguir fazer nesta lição?

Boa forma:

```text
Entender a diferença entre o que falamos e o que escrevemos.
```

Evitar forma como:

```text
Distinguir a realização sonora da língua de sua representação gráfica...
```

### Regra de explicação

Para conceito novo:

```text
1. apresentar algo conhecido/concreto
2. mostrar um exemplo
3. nomear o conceito
4. explicar em poucas frases
5. verificar entendimento
6. ampliar apenas depois
```

Não transformar isso em template rígido quando outra ordem ensinar melhor; é uma regra de clareza, não uma obrigação visual.

### Checklist de linguagem

Antes de publicar uma explicação para iniciante:

```text
[ ] usa termo ainda não ensinado?
[ ] existe palavra mais simples igualmente correta?
[ ] há mais de uma ideia central na mesma frase?
[ ] o exemplo vem cedo o suficiente?
[ ] o aluno consegue explicar com palavras próprias o que está aprendendo?
[ ] o texto parece material para professor ou material para aluno?
```

### Gate de saída

Contrato documentado e exemplos bons/ruins suficientes para orientar nova autoria sem depender da conversa.

---

## Fase T1.4 — Atualização das skills e fontes canônicas

**Objetivo:** fazer o novo método sobreviver a novas conversas e novos modelos.

### Atualizar obrigatoriamente

#### `.ChatGPT/skills/course-content-design/SKILL.md`

Adicionar:

- regra `objetivo interno ≠ texto do aluno`;
- princípio “zero pressupostos” para início do N0;
- progressão concreto → termo → explicação → prática;
- proibição de metalíngua não ensinada na interface;
- revisão específica de clareza para alunos iniciantes;
- obrigação de testar pré-requisitos de cada lição.

#### `.ChatGPT/skills/student-ui-ux/SKILL.md`

Adicionar:

- tela inicial limpa da lição;
- `Começar lição` antes do stepper na primeira entrada;
- progressive disclosure;
- não exibir objetivo curricular técnico;
- retomada sem obrigar o aluno a rever introdução desnecessariamente;
- metodologia fora do rodapé persistente.

#### `.ChatGPT/skills/curricular-orchestration/SKILL.md`

Adicionar:

- validação empírica de produto pode justificar reabertura curricular dirigida;
- uma progressão “fechada em M5” não é imune a correção quando uma falha real de pré-requisito aparece;
- mudança de ordem exige mapa de dependências e impacto em IDs/progresso.

#### `.ChatGPT/skills/classic-product-delivery/SKILL.md`

Adicionar:

- respeitar T1 antes de P6 enquanto ativo;
- mudanças curriculares precisam de migração/compatibilidade;
- frontend de lição deve validar entrada, etapa, retomada e atividade.

#### `.ChatGPT/skills/frontend-visual-check/SKILL.md`

Adicionar aos estados mínimos de inspeção:

- primeira abertura da lição;
- lição já iniciada;
- etapa explicativa;
- etapa com atividade;
- desktop amplo;
- desktop estreito;
- mobile.

### Atualizar documentação

- `docs/conteudo.md`;
- `docs/ui-ux.md`;
- `docs/contrato-conteudo.md` se houver novo campo;
- `PROJECT_INDEX.md` para mapear o contrato/plano definitivo;
- roadmaps/estado conforme avanço.

### Gate de saída

Uma instância nova deve conseguir produzir uma lição do N0 com a nova linguagem e a nova experiência sem receber instruções adicionais do usuário.

---

## Fase T1.5 — Contrato técnico da abertura da lição

**Objetivo:** suportar texto público simples sem destruir precisão curricular.

### Avaliar a solução mínima compatível

Preferência:

```text
autoria
→ objetivo interno existente
→ campo opcional de apresentação ao aluno
→ normalizer
→ runtime
→ renderer de abertura
```

Alternativa aceitável: manifesto/presentation map quando isso evitar alteração indevida de todos os JSONs.

### Requisitos

- retrocompatível com conteúdo v1;
- ausência do novo campo deve ter fallback humano seguro, não imprimir automaticamente objetivo técnico;
- schema/fixtures atualizados;
- normalizer testado;
- conteúdo N1–N4 não precisa ser reescrito em massa agora;
- o novo contrato deve permitir migração incremental durante P7.

### Gate de saída

Renderer consegue receber `title + student-facing intro` sem inferência frágil a partir do objetivo técnico.

---

## Fase T1.6 — Nova autoria das unidades/lessons iniciais

**Objetivo:** materializar a nova progressão aprovada.

### Para cada nova/revisada lição

Produzir e revisar:

- objetivo interno;
- objetivo público simples;
- pré-requisitos;
- explicação em camadas;
- exemplos;
- checagem rápida;
- prática;
- evidência;
- material de apoio;
- decisão de mídia;
- texto de feedback.

### Regra especial do início do N0

O aluno deve conseguir entrar sem saber previamente:

- nome técnico de categorias linguísticas;
- diferença conceitual entre fala/escrita;
- estrutura da palavra;
- terminologia gramatical.

Quando um termo como `vogal` ou `sílaba` aparecer, a própria lição deve construí-lo.

### Revisão em cinco passadas

Além das quatro passadas curriculares já existentes, acrescentar uma quinta:

**E. Clareza para iniciante**

- consigo entender sem formação escolar prévia relevante?
- o texto define os termos antes de usá-los como pressuposto?
- existe frase curricular disfarçada de explicação?
- a ideia principal cabe em uma frase simples?
- o exemplo realmente ajuda?

### Gate de saída

Primeiro percurso N0 autorado, validado e coerente com a nova arquitetura.

---

## Fase T1.7 — Frontend: tela inicial exclusiva da lição

**Objetivo:** fazer a interface refletir o novo método.

### Primeiro acesso

Renderizar:

```text
← Voltar para a unidade

Lição

<Título>

<objetivo público simples>

[ Começar lição ]
```

A área principal não mostra o conteúdo seguinte até o aluno iniciar.

### Após começar

Entrar no fluxo guiado existente, refinado:

```text
etapa atual
→ conteúdo essencial
→ atividade quando aplicável
→ Voltar / Avançar
```

### Retomada

Não obrigar quem está retomando uma lição já iniciada a rever a tela inicial toda vez.

Comportamento desejado:

```text
primeira entrada
→ intro

lição já iniciada / continuar de onde parou
→ restaurar ponto visual seguro quando disponível
→ ou primeira etapa ainda não percorrida
→ nunca inventar domínio/conclusão
```

O estado da UI permanece separado de evidência e domínio.

### Limpeza visual

- evitar card dentro de card sem função;
- uma área de atenção principal;
- poucos rótulos;
- títulos claros;
- stepper/progresso somente depois de começar;
- atividade não compete visualmente com explicações antigas;
- feedback aparece junto da ação que o gerou.

### Acessibilidade

- foco vai para o título ao trocar tela/etapa;
- teclado completo;
- `prefers-reduced-motion`;
- botão de começar com nome acessível;
- não depender de animação para comunicar mudança;
- zoom/font scale não quebra o layout.

### Gate de saída

Screenshots e DOM comprovam que a primeira tela contém somente a apresentação da lição + ação de início, e que as etapas seguintes continuam navegáveis e funcionais.

---

## Fase T1.8 — Frontend: metodologia e navegação secundária

**Objetivo:** remover informação institucional persistente do caminho de estudo.

### Mudança

```text
rodapé
→ remover “Metodologia do curso”

Ajuda
→ adicionar “Como o curso funciona”
→ acesso à metodologia
```

A rota de metodologia pode permanecer.

### Verificar

- não criar nova duplicação no menu principal;
- não transformar Ajuda em página poluída;
- metodologia continua encontrável em no máximo poucos passos;
- deep link antigo continua válido quando possível.

### Gate de saída

Home/lição não exibem metodologia persistentemente; Ajuda mantém acesso claro.

---

## Fase T1.9 — Migração, catálogo, progresso e mídia

**Objetivo:** integrar a nova sequência sem corromper o produto já funcional.

### IDs e progresso

Criar matriz de migração antes de alterar IDs publicados.

Casos:

```text
mesma lição, só nova posição
→ preservar ID quando semanticamente seguro

conteúdo dividido
→ IDs novos
→ progresso antigo não vira domínio duplicado

conteúdo fundido
→ definir regra conservadora

lição removida/movida
→ preservar histórico
→ não apontar current para rota morta
```

### Catálogo/manifests

Atualizar:

- `course.json`;
- manifests afetados;
- ordem pública;
- `competencyIds`;
- links de verificação;
- deep links;
- testes de descoberta.

### Mídia

Auditar:

- IDs de áudio da atual N0-U01;
- quais continuam válidos;
- quais mudam de posição;
- quais deixam de ser obrigatórios cedo;
- quais precisam ser regravados apenas se o estímulo realmente mudou.

Não gerar mídia automaticamente; manter a fila e blockers explícitos.

### Gate de saída

- catálogo abre no novo início;
- progresso antigo não é atribuído à competência errada;
- nenhuma rota corrente aponta para conteúdo inexistente;
- mídia pendente bloqueia somente o que depende dela.

---

## Fase T1.10 — Validação e homologação

**Objetivo:** provar a revisão antes de retomar P6.

### Validação curricular

- nova sequência sem pré-requisito invertido;
- cobertura N0 preservada ou melhorada;
- checkpoint N0 reexecutado quando necessário;
- transição N0→N1 continua coerente;
- nenhuma competência foi perdida por simplificação.

### Validação de clareza

Auditar amostra ampla e obrigatoriamente todas as lições iniciais:

```text
termo novo foi definido?
objetivo público é entendível?
texto começa concreto?
frase excessivamente técnica foi removida?
atividade mede algo já ensinado?
```

### Validação técnica

CI deve cobrir:

- schemas/normalizer;
- catálogo/manifests;
- renderer;
- ProgressService e migração;
- Gist/sync;
- smoke de primeira entrada;
- smoke de retomada;
- fluxo de etapas;
- atividade;
- metodologia fora do rodapé;
- ausência de códigos internos.

### Visual

Inspecionar no mínimo:

```text
home
unidade inicial
intro da primeira lição
primeira etapa explicativa
primeira atividade
retomada
1440px
~1024/900px
~680px
390px
```

### Homologação

T1 fecha somente quando:

```text
[ ] início do N0 realmente parte do básico
[ ] ordem curricular nova está documentada
[ ] primeiras unidades/lições reais foram atualizadas/criadas
[ ] texto público está simples e separado do objetivo técnico
[ ] tela inicial da lição está limpa
[ ] progressão por etapas continua funcional
[ ] metodologia saiu do rodapé
[ ] progresso/IDs antigos foram tratados com segurança
[ ] skills canônicas incorporaram o método
[ ] CI passou
[ ] inspeção visual passou
[ ] estado/roadmaps foram atualizados
```

Após isso:

```text
T1 — HOMOLOGADO
→ P6 — Feedback por IA volta a ser o marco ativo
```

---

# 5. Ordem operacional recomendada

```text
T1.0 ativar plano
→ T1.1 pesquisar + auditar
→ T1.2 redimensionar N0
→ T1.3 congelar contrato de linguagem
→ T1.4 atualizar skills/fontes canônicas
→ T1.5 adaptar contrato técnico
→ T1.6 criar/revisar conteúdo inicial
→ T1.7 implementar intro/fluxo frontend
→ T1.8 mover metodologia
→ T1.9 migrar catálogo/progresso/mídia
→ T1.10 validar e homologar
→ retomar P6
```

Uma fase pode usar mais de uma PR. Não exigir nova autorização entre subpassos porque o plano inteiro foi autorizado.

---

# 6. Itens que não fazem parte deste plano

Não iniciar durante T1:

- XP;
- missões;
- conquistas;
- streak;
- economia gamificada;
- redesign total de N1–N4 sem dependência real;
- geração automática de mídia;
- implementação de P6 em paralelo que dependa das telas/contratos em revisão.

P6 pode receber apenas ajustes preparatórios sem comportamento material se forem indispensáveis para compatibilidade; caso contrário permanece aguardando.

---

# 7. Riscos e guard rails

## Risco: simplificar e perder precisão

Mitigação:

```text
objetivo técnico preservado
+ texto público separado
```

## Risco: reorganizar e quebrar progresso

Mitigação:

```text
matriz de identidade
+ migração conservadora
+ testes
```

## Risco: transformar “começar do zero” em alfabetização mecânica

Mitigação:

- não fazer 26 mini-lições de letras;
- não reduzir sílaba a séries `ba-be-bi-bo-bu`;
- usar palavras e exemplos reais progressivamente;
- manter significado e uso como destino da aprendizagem.

## Risco: microfragmentar a UI

Mitigação:

- intro exclusiva é uma tela intencional;
- depois dela, agrupar blocos relacionados;
- não criar um clique por parágrafo.

## Risco: criar um segundo sistema de conteúdo

Mitigação:

- extensão incremental do contrato existente;
- adapter/normalizer;
- sem fork paralelo do runtime.

---

# 8. Critério de qualidade final

O teste mental mais importante para a porta de entrada é:

> Uma pessoa que quer aprender português “desde o começo” consegue abrir a primeira unidade e entender imediatamente o que está sendo ensinado, por que aquilo vem primeiro e qual é o próximo passo?

A interface e o conteúdo devem responder **sim** sem exigir conhecimento da arquitetura, linguística técnica ou organização curricular do projeto.

Regra final do plano:

> **Primeiro tornar o fundamento óbvio e compreensível; depois aumentar a complexidade sem saltos.**
