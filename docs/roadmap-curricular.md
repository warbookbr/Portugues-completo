# Roadmap Curricular

## Objetivo

Este documento acompanha **onde o desenvolvimento curricular está**, **qual é o marco ativo** e **quais condições estruturais precisam ser atendidas antes de aprofundar indefinidamente uma única parte do curso**.

Ele não substitui as fontes pedagógicas detalhadas:

- `docs/mapa-curso.md` define a progressão curricular pretendida;
- documentos de áreas, unidades e lições definem o conteúdo de cada camada;
- `content/` registra o conteúdo efetivamente desenvolvido;
- `docs/execucao-continua.md` define como um marco autorizado pode ser executado sem confirmações repetidas;
- este roadmap registra **maturidade estrutural, foco atual, marco ativo, subpasso interno e checkpoints de cobertura global**.

A função principal é evitar dois extremos:

```text
planejar todos os detalhes de todos os níveis antes de produzir qualquer conteúdo

ou

refinar centenas de detalhes de um único nível sem garantir que o restante do curso possui direção suficiente
```

## Escala de maturidade curricular

A escala abaixo serve para comparar níveis sem exigir que todos tenham o mesmo grau de detalhamento ao mesmo tempo.

```text
M0 — esboço
→ existe apenas uma descrição geral do nível

M1 — nível mapeado
→ objetivo geral
→ competências de saída
→ grandes áreas
→ responsabilidades de cobertura e limites principais

M2 — áreas dimensionadas
→ objetivo de cada área
→ competências
→ conteúdos essenciais
→ limites

M3 — unidades dimensionadas
→ objetivo
→ competências
→ conteúdos nucleares
→ retomadas e conexões
→ evidências de conclusão
→ limites

M4 — lições dimensionadas
→ objetivo
→ competências
→ dependências
→ modalidade/recursos
→ prática
→ evidência

M5 — conteúdo desenvolvido
→ lições, verificações e materiais já especificados em `content/`
```

A escala mede **maturidade de planejamento/desenvolvimento**, não qualidade do aluno, publicação ou produção de mídia.

## Estado macro atual

### Nível 0 — Fundamentos

Estado estrutural:

- `M1` concluído: objetivo, competências de saída e oito grandes áreas definidos;
- `M2` concluído: as oito áreas possuem objetivo, competências, conteúdos essenciais e limites;
- `M3` concluído: as oito áreas foram organizadas em seis unidades principais e essas unidades foram dimensionadas;
- `M4` parcial: as lições estão dimensionadas até a Unidade 3;
- `M5` em andamento: Unidades 1, 2 e 3 estão desenvolvidas com suas verificações integradas; as unidades seguintes ainda não entraram em desenvolvimento detalhado.

### Nível 1 — Básico

Estado atual: `M0`.

Existe uma descrição geral, mas ainda faltam objetivo detalhado, competências de saída, grandes áreas, responsabilidades de cobertura e limites do nível.

### Nível 2 — Intermediário

Estado atual: `M0`.

Existe uma descrição geral, mas ainda faltam objetivo detalhado, competências de saída, grandes áreas, responsabilidades de cobertura e limites do nível.

### Nível 3 — Avançado

Estado atual: `M0`.

O mapa geral menciona gramática avançada, interpretação, produção textual, argumentação e usos formais, mas ainda não existe distribuição suficientemente detalhada dessas responsabilidades.

### Nível 4 — Domínio

Estado atual: `M0`.

O mapa geral menciona domínio amplo, nuances de estilo, variação, interpretação complexa e produção textual de alto nível, mas ainda não existe distribuição suficientemente detalhada dessas responsabilidades.

## Foco curricular atual

```text
Nível 0 — Fundamentos
└── Unidade 3 — Palavras, frases e sentido
    ├── Lições 1 a 10 — concluídas
    └── Verificação integrada — concluída

CHECKPOINT GLOBAL — MARCO ATIVO
├── Nível 1 — elevar de M0 para M1 — PRÓXIMO SUBPASSO INTERNO
├── Nível 2 — elevar de M0 para M1 — pendente
├── Nível 3 — elevar de M0 para M1 — pendente
├── Nível 4 — elevar de M0 para M1 — pendente
├── consolidar matriz de progressão global — pendente
└── revisar lacunas e ajustes do mapa — pendente
```

Último marco curricular concluído:

```text
N0-U03-V01 — Verificação integrada da Unidade 3
```

Marco ativo:

```text
CHECKPOINT GLOBAL — elevar Níveis 1–4 para M1, consolidar matriz global e revisar lacunas
```

Próximo subpasso interno:

```text
Nível 1 — elevar de M0 para M1
```

O subpasso interno informa a ordem operacional, mas **não exige nova autorização quando o marco inteiro já tiver sido autorizado**.

## Modo de execução por marcos

O desenvolvimento deve preferir autorizações em escala de marco.

Exemplo:

```text
usuário autoriza: "execute o checkpoint global"

ChatGPT executa:
Nível 1 M1
→ revisão
→ PR/CI/merge
→ Nível 2 M1
→ revisão
→ PR/CI/merge
→ Nível 3 M1
→ revisão
→ PR/CI/merge
→ Nível 4 M1
→ revisão
→ PR/CI/merge
→ matriz global
→ revisão cruzada
→ correções
→ PR/CI/merge
→ checkpoint concluído
```

Não pedir `prossiga` entre subpassos contidos no marco autorizado. Aplicar o pipeline e as condições de parada de `docs/execucao-continua.md` e a skill `.ChatGPT/skills/curricular-orchestration/SKILL.md`.

Uma execução pode usar várias PRs para manter mudanças revisáveis; o marco, e não cada PR, é a unidade principal de autorização do usuário.

## Checkpoint estrutural após a Unidade 3

A Unidade 3 foi fechada com sua verificação integrada. **O checkpoint global está agora ativo e deve ser concluído antes de iniciar uma nova rodada extensa de detalhamento de lições do Nível 0.**

Esse checkpoint deve elevar os Níveis 1, 2, 3 e 4 de `M0` para pelo menos `M1`.

Para cada um desses níveis, definir:

```text
objetivo geral
→ competências de saída
→ grandes áreas
→ responsabilidades principais de cobertura
→ limites e conteúdos deliberadamente reservados para outros níveis
```

O checkpoint também deve consolidar uma matriz de progressão que mostre onde os grandes domínios da língua são:

```text
introduzidos
→ desenvolvidos
→ sistematizados
→ aprofundados
→ dominados
```

Não é necessário dimensionar todas as unidades e lições dos Níveis 1–4 nesse checkpoint. O objetivo é garantir direção e cobertura global antes de continuar aprofundando centenas de decisões locais.

## Cobertura global que precisa ser garantida

A lista abaixo funciona como **checklist de cobertura do curso inteiro**. Ela não determina antecipadamente em qual nível cada conteúdo ficará; essa distribuição será decidida no checkpoint e refinada conforme cada nível for dimensionado.

| Domínio | Situação no Nível 0 | Trabalho estrutural futuro necessário |
|---|---|---|
| Sistema de escrita e alfabetização | base extensa | consolidar fluência e avançar para convenções mais complexas sem retornar a treino mecânico |
| Ortografia e acentuação | apenas contatos e limites introdutórios | distribuir estudo sistemático e progressivo das convenções ortográficas |
| Morfologia e formação de palavras | deliberadamente não sistematizada | definir progressão de morfemas, flexão, derivação, composição e classes quando pedagogicamente útil |
| Sintaxe | percepção funcional de relações | definir progressão para classes, funções, concordância, regência, coordenação, subordinação e análise sintática |
| Semântica e vocabulário | fundamentos funcionais | ampliar relações de sentido, polissemia, sentido figurado, precisão lexical e nuances |
| Leitura e interpretação | compreensão inicial prevista no Nível 0 | distribuir progressão até textos longos, implícitos, leitura crítica e interpretação complexa |
| Produção textual | frases e pequenas mensagens | distribuir planejamento, parágrafo, organização global, revisão e textos progressivamente complexos |
| Coesão e coerência | trabalhadas intuitivamente | sistematizar mecanismos de conexão, referenciação, progressão temática e organização textual |
| Argumentação e persuasão | fora do domínio obrigatório do Nível 0 | construir progressão antes do domínio avançado, não introduzir apenas no final do curso |
| Gêneros textuais e discursivos | contato funcional sem taxonomia | garantir variedade crescente, propósito, estrutura, leitura e produção de gêneros relevantes |
| Pontuação e convenções gráficas | fundamentos básicos previstos | distribuir usos intermediários e avançados ligados à sintaxe, ao texto e ao estilo |
| Oralidade e compreensão oral | uso funcional inicial | ampliar escuta, exposição, interação, clareza, adequação e usos formais sem impor pronúncia idealizada |
| Registro, formalidade e adequação | contato introdutório | desenvolver escolha linguística conforme situação, interlocutor, meio e finalidade |
| Variação linguística e norma | percepção introdutória | aprofundar variedades, norma-padrão, adequação e consciência sociolinguística sem confundir diferença com erro |
| Estilo | fora do domínio sistemático do Nível 0 | desenvolver escolhas expressivas, voz, concisão, ênfase, ritmo e adequação estilística |
| Literatura e linguagem figurada | não sistematizadas | decidir progressão de leitura literária, figuras, efeitos de sentido e interpretação estética quando o mapa superior for detalhado |

### Regra da matriz

Um domínio não deve ser considerado coberto apenas porque seu nome aparece em um nível distante.

Para os domínios centrais, o mapa futuro deve mostrar uma progressão plausível, por exemplo:

```text
contato inicial
→ uso funcional
→ sistematização
→ aplicação em textos reais
→ análise e produção autônomas
→ refinamento avançado
```

Isso é especialmente importante para ortografia, morfologia, sintaxe, interpretação, produção textual, coesão/coerência, argumentação, gêneros, registro, variação e estilo.

## Regras para continuar desenvolvendo o curso

### 1. Não interromper artificialmente uma sequência local já coerente

Uma unidade em desenvolvimento pode ser concluída quando sua arquitetura já está consolidada. O roadmap serve como checkpoint entre grandes marcos, não como motivo para quebrar uma sequência no meio.

### 2. Não deixar um nível muito à frente sem horizonte para os seguintes

Depois da Unidade 3 do Nível 0, os Níveis 1–4 devem chegar a `M1` antes de uma nova rodada extensa de detalhamento local. **Esta regra está atualmente em execução por meio do checkpoint global ativo.**

### 3. Detalhar mais o que está mais próximo

Não é necessário manter todos os níveis na mesma maturidade.

A direção esperada é semelhante a:

```text
curso inteiro
→ horizonte suficiente para garantir cobertura

próximo nível
→ planejamento mais detalhado

unidade ativa
→ planejamento e conteúdo completos
```

### 4. Antes de escrever lições de um novo nível, dimensionar suas unidades

Um nível não deve entrar em `M4` ou `M5` sem ter passado por `M1`, `M2` e `M3` de forma suficientemente consolidada.

### 5. Usar descobertas locais para revisar o mapa, sem redesenhá-lo a cada lição

Se o detalhamento de uma lição revelar uma lacuna estrutural real, registrar e corrigir a camada apropriada. Não alterar o mapa global por pequenas preferências locais, mas também não manter uma arquitetura inadequada apenas porque já foi aprovada anteriormente.

### 6. Atualizar este roadmap quando o estado curricular mudar

Toda PR que altere materialmente o avanço curricular deve verificar se este arquivo precisa ser atualizado.

Exemplos de mudanças que normalmente exigem atualização:

- conclusão de uma lição que move o próximo subpasso;
- fechamento de uma unidade ou verificação integrada;
- dimensionamento de novas lições;
- avanço de maturidade de um nível, área ou unidade;
- alteração de um checkpoint estrutural;
- distribuição ou revisão importante da matriz de cobertura global.

Correções editoriais ou técnicas que não mudem o estado curricular não precisam modificar o roadmap.

### 7. Continuar automaticamente dentro de um marco autorizado

Quando o usuário autorizar explicitamente um marco, executar os subpassos previsíveis sem pedir nova confirmação entre eles.

Parar apenas quando o marco terminar ou ocorrer uma condição real de parada definida em `docs/execucao-continua.md`.

## Sequência de desenvolvimento prevista a partir do estado atual

```text
MARCO ATIVO — CHECKPOINT GLOBAL
1. elevar Nível 1 de M0 para M1
2. elevar Nível 2 de M0 para M1
3. elevar Nível 3 de M0 para M1
4. elevar Nível 4 de M0 para M1
5. consolidar a distribuição dos grandes domínios na matriz de progressão
6. revisar se alguma lacuna descoberta exige ajuste do mapa já construído
→ checkpoint concluído

PRÓXIMO MARCO — RETORNO AO NÍVEL 0
7. dimensionar as lições da Unidade 4
8. desenvolver a Unidade 4 e seguir pelos próximos marcos do Nível 0
```

A sequência interna após o checkpoint pode ser ajustada se a análise global revelar dependências melhores, mas qualquer mudança significativa deve ser registrada aqui. Se o checkpoint inteiro estiver autorizado, esses subpassos não exigem autorizações separadas.

## Relação com a conclusão do Nível 0 e início do Nível 1

Antes de iniciar a autoria detalhada das lições do Nível 1:

- o Nível 1 deve estar pelo menos em `M3`;
- suas competências de saída devem estar conectadas às competências finais do Nível 0;
- suas unidades devem cobrir as responsabilidades atribuídas ao nível na matriz global;
- os limites entre Nível 1 e Níveis 2–4 devem estar explícitos o suficiente para evitar duplicação ou lacunas graves.

O mesmo princípio se repete ao avançar pelos níveis seguintes.

## Fonte de verdade e manutenção

Quando houver divergência:

```text
progressão curricular pretendida
→ docs/mapa-curso.md

estado do desenvolvimento, marco ativo, subpassos e checkpoints
→ docs/roadmap-curricular.md

protocolo de execução contínua
→ docs/execucao-continua.md

conteúdo detalhado de unidades/lições
→ documentos específicos + content/
```

Este arquivo deve permanecer vivo e conciso o suficiente para responder rapidamente a quatro perguntas:

```text
Onde estamos?
Qual é o marco ativo?
Qual é o próximo subpasso interno?
Que condição estrutural precisa ser atendida antes de aprofundar mais?
```
