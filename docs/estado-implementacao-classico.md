# Estado de implementação do Modo Clássico

## Função

Registro operacional canônico do Modo Clássico. `docs/roadmap-produto.md` define a sequência macro; este arquivo define o **cursor exato**.

Regra permanente:

```text
implementado tecnicamente
≠ homologado
≠ publicável
```

## Cursor operacional

```text
Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco transversal T1 — Fundamentos claros e experiência de lição: HOMOLOGADO
Homologação: docs/homologacao-t1-10.md
Migração T1 `t1-n0-entry-v2`: ATIVA / HOMOLOGADA local + Gist
P6 — Feedback por IA: HOMOLOGADO
Homologação P6: docs/homologacao-p6.md
P7 — Ampliação do catálogo Clássico N0→N4: PAUSADO por R1 (N0 publicado)
Lote P7 N0-U06 — Usando a língua no cotidiano: HOMOLOGADO (PR #139)
R1 — Revisão do plano de ensino: ATIVO (docs/auditoria-plano-ensino.md)
Próximo passo exato: executar R1.1 a R1.3 e depois R1.4 (N1); P7 retoma com N1-U01 revisada
Estilo da interface (Simples/Completo): IMPLEMENTADO / não homologado
Blocker global: nenhum
Gate final do Clássico: NÃO SATISFEITO
```

T1 e P6 estão homologados. P7 avança incrementalmente por unidade, preservando os gates anteriores e sem reabrir marcos concluídos salvo nova evidência concreta de regressão.

## Marcos do produto

| Marco | Estado | Evidência principal |
|---|---|---|
| P1 — Schemas/contratos | `HOMOLOGADO` | PR #105 |
| P2 — ContentService/normalizador | `HOMOLOGADO` | PR #106 |
| P3 — Manifests/catálogo inicial | `HOMOLOGADO` | PR #107 |
| P4 — Renderer real do Clássico | `HOMOLOGADO` | PR #108 |
| P5 — Progresso/revisão/Gist | `HOMOLOGADO` | PR #109 |
| T1 — Fundamentos claros | `HOMOLOGADO` | PRs #116–#130; `docs/homologacao-t1-10.md` |
| P6 — Feedback por IA | `HOMOLOGADO` | PRs #131–#133; `docs/homologacao-p6.md` |
| R1 — Revisão do plano de ensino | `ATIVO` | `docs/auditoria-plano-ensino.md` |
| P7 — Catálogo N0→N4 | `PAUSADO` | N0-U03/U04/U05/U06 homologadas nas PRs #134/#135/#136/#139; N0 completo; N1 retoma após R1.4 |
| P8 — Mídia/publicação | `NAO_INICIADO` | — |
| P9 — E2E / Clássico homologado | `NAO_INICIADO` | — |

## R1 — Revisão do plano de ensino

```text
Estado consolidado: ATIVO
Fonte: docs/auditoria-plano-ensino.md
R1.1 documentação, roadmap e regras de método: CONCLUÍDO
R1.2 correções objetivas: CONCLUÍDO
R1.3 N0 a partir de U3: CONCLUÍDO
R1.4 N1: CONCLUÍDO (conteúdo); publicação do N1 segue no P7
R1.5 N2: CONCLUÍDO (conteúdo); publicação do N2 segue no P7
R1.6 N3: CONCLUÍDO (conteúdo); publicação do N3 segue no P7
R1.7 N4: em execução
R1.8 trilha separada + N0 a partir de U3: CONCLUÍDO; nivelamento: aguarda publicação do N1 (P7)
R1.9 Trilha de Alfabetização completa: CONCLUÍDO (N0-U07 e N0-U08 publicadas na trilha)
```

R1.2 aplicou:

- pré-requisitos com IDs aposentados trocados pelas V02 vigentes em N0-U03-L01, N1-U02-L01 e N1-U02-L06;
- N1-U01-L04: "caixas de coleta" (feminino) com retomada "Eles" substituído por "coletores", preservando a pista de gênero sem criar ambiguidade com "pilhas";
- N0-U02-L08: ponte final apontava para a verificação, mas L09 e L10 vêm depois; agora aponta para L09.

R1.3 aplicou no N0 (U3 a U6), sem mudar IDs, competências nem regras de conclusão:

- U3-L03 deixa de usar "frase" antes de U3-L04, que ensina o conceito;
- U3-L04 ensina espaço entre palavras, maiúscula inicial e sinal final antes da primeira escrita livre (U3-L10);
- U4-L01 define "texto" no primeiro uso;
- oralidade distribuída: escuta antes da leitura em U3-L08 e U4-L03; leitura em voz alta como estratégia de revisão em U5-L06;
- literatura e linguagem artística popular: ditado em U3-L05, primeira estrofe de "Canção do exílio" em U4-L01, refrão de "Luar do sertão" em U6-L08 (todos em domínio público);
- U5-L06-A01 e U5-L07-A02 deixam de repetir o problema "falta horário/local"; agora tratam mensagem contraditória e documento sem a característica pedida;
- U6-L08-B03 passa a mostrar exemplos reais de variação regional (mandioca/aipim/macaxeira, tangerina/mexerica/bergamota, semáforo/sinal/sinaleira) em vez de descrevê-los;
- renderer: o campo `lines` passa a ser exibido como versos, um por linha, também nos poemas já publicados do N4-U09.

Validação: 35 checagens Node do CI e os seis smokes visuais verdes; capturas inspecionadas em 1280px e 390px.

R1.4 aplicou no N1 (sete unidades), preservando IDs:

- `studentObjective` em todas as lições;
- termos ensinados no primeiro uso: sílaba tônica, monossílabo, oxítona/paroxítona/proparoxítona, sinônimo, antônimo, polissemia, prefixo, sufixo, singular/plural, gênero da palavra, locução verbal, concordância, parágrafo, conector, gênero de texto, norma-padrão, comparação e personificação;
- lacunas de ortografia: novas N1-U02-L11 (vogais finais e ditongos que a fala reduz) e N1-U02-L12 (s/z, g/j, x/ch, h inicial), cedilha em N1-U02-L03, -am × -ão em N1-U03-L05; verificação da U2 cobre as lições novas;
- produção própria: frases com acento (U02-L08), parágrafo com conector (U04-L05), revisão do próprio parágrafo (U04-L09);
- textos crescem: U01 chega a textos de dois e três parágrafos (80 a 110 palavras), inclusive na verificação;
- exemplos mostrados: narrativa-modelo em U05-L04, fontes reais em U05-L07, roteiro e e-mail completos em U06;
- repetições com o N0 reorientadas: N1-U04-L06 trata pontuação dentro do parágrafo; N1-U06-L07 trata áudio, mensagem e e-mail;
- literatura e oralidade distribuídas (microconto autoral, cantiga popular, cena literária, escutas e ensaio oral opcionais);
- itens de verificação que copiavam lições substituídos por itens novos.

Renderer (afeta também conteúdo publicado):

- linhas em branco dentro de um texto viram parágrafos;
- exercícios com várias rodadas passam a mostrar a pergunta e o contexto de cada item (situação, frase, mensagem, rascunho). Antes, o aluno via apenas "Rodada N" e as opções; em N0-U03-L05, por exemplo, a situação a ser montada não aparecia.

Pendências registradas para o P7 do N1: várias lições ainda não normalizam (mesmo estado de antes do R1); textos da verificação N1-U01-V01 usam um formato (`texts` como objeto) que o normalizador não exibe; ordem por nome de arquivo (`005a`, `005b`) deve ser respeitada no manifesto; respostas certas de itens antigos ficam sempre na primeira posição.

R1.5 aplicou no N2 (nove unidades), preservando IDs:

- `studentObjective` em todas as lições; termo central de cada lição ensinado no primeiro uso (ditongo, hiato, regência, oração principal, coordenação e subordinação pela dependência, próclise e ênclise, período, coesão, coerência, referente, progressão temática, entre outros);
- lacunas de escopo preenchidas com lições novas: N2-U02-L12 (tempos, modos e conjugação), N2-U02-L13 (palavras que confundem na escrita e parônimos), N2-U03-L11 (voz ativa e passiva), N2-U04-L12 (orações que caracterizam e pronome relativo), N2-U04-L13 (infinitivo, gerúndio e particípio pelo uso), N2-U06-L11 (discurso direto e indireto); verificações cobrem as lições novas;
- produção própria em U02, U03, U04 e U05, que antes só revisavam trechos dados;
- leitura com gêneros variados (narrativa, crônica, opinião, carta, divulgação, reportagem) e textos que crescem até cerca de 250 palavras;
- argumentação com questões reais e debatíveis; U08 com registro na fala e dados concretos de variação;
- retomada à distância entre parágrafos, quadro de conectores por relação, rascunhos e modelos completos;
- itens de verificação que copiavam as lições substituídos por itens novos;
- conteúdo que estava em campos não exibidos passou para campos visíveis; normalização do N2 passou de 53 para 88 documentos válidos (14 ainda pendentes para o P7).

R1.6 aplicou no N3 (nove unidades), preservando IDs:

- `studentObjective` em todas as lições;
- U01 trabalha texto longo de verdade: textos completos de 311 a 587 palavras, em gêneros variados (reportagem, divulgação científica, editorial, conto, crônica, poema, ensaio), com retomada curta do que já estava no N2;
- termos construídos no primeiro uso: posição central e tese, modalidade (distinta de multimodalidade), pressuposto e implicação, enquadramento, intertextualidade, concessão, consequência, comparação, proporção, conformidade, passiva com se, verbo impessoal, ponto e vírgula;
- U03 aprofunda o que o N2 passou a ensinar e usa rótulos públicos para decisões normativas ("regra que sempre vale", "duas formas aceitas", "depende do manual", "escolha de estilo", "conferir em fonte");
- modelos de gênero completos na U05; formas reais de variação e mudança na U08; contos e poemas escritos por inteiro na U09; soneto "Língua portuguesa" (Bilac) na U06 e "Canção do exílio" completa na U01;
- U07 trata recursos próprios da fala formal em vez de repetir o N2;
- repetições internas ("dois títulos, mesmos fatos", dados clonados, calibração de certeza) substituídas por variações com dimensão nova;
- checagens sim/não convertidas em três opções plausíveis; verificações com itens novos.

R1.8 implementou a estrutura de entrada decidida em `docs/auditoria-plano-ensino.md` (seção 6):

- `content/course.json` declara `tracks` com a Trilha de Alfabetização (opcional); N0-U01 e N0-U02 recebem `trackId: "alfabetizacao"`. IDs, manifests, progresso e deep links foram preservados, sem migração;
- `app/js/ui/course-tracks.js` separa caminho principal e trilha e calcula a numeração exibida: o caminho principal começa em "Palavras, frases e sentido" como Fundamentos · Unidade 1; a trilha numera as próprias unidades; níveis sem trilha mantêm a numeração original;
- home: o CTA único "Começar a estudar" leva ao caminho principal; abaixo dele, só no primeiro acesso, um link discreto "Ainda está aprendendo a ler e escrever? Comece pela Trilha de Alfabetização"; a lista de unidades e as métricas consideram o caminho principal, e a trilha entra quando o aluno a usa;
- Unidades: caminho principal primeiro e trilha em seção própria marcada como opcional; Plano de estudos inclui a trilha só para quem a usa;
- N0-U03-L01 deixa de exigir a verificação de sílabas;
- novo gate `Test course tracks` no CI; smokes visuais e capturas em 1280px e 390px inspecionados.

Nivelamento: a terceira opção ("leio e escrevo bem" → teste curto → N1, N2 ou adiante) depende de existirem níveis publicados para onde encaminhar. Hoje o catálogo publica N0 e N4-U09. O nivelamento entra quando o P7 publicar o N1.

R1.9 completou a Trilha de Alfabetização com o ensino que faltava (Blocos A e B da auditoria):

- N0-U07 "Ler e escrever palavras: letras e sons": sons das vogais; letras de som contínuo (m, l, s, f, v, n); p e t; b e d (pares p/b e t/d só no fim); c e g antes de a, o, u, j, z, x e r no começo; h inicial; revisão. Cada lição faz ler palavras inéditas (áudio só para conferir depois da tentativa) e escrever palavras ouvidas com fichas de letras; o vocabulário de cada lição usa só letras já ensinadas, conferido por script;
- N0-U08 "Sílabas e grafias mais complexas": consoante no fim da sílaba, duas consoantes no começo, ch/lh/nh, rr/ss/qu/gu, til e sons pelo nariz com cedilha, vogais juntas na mesma sílaba e leitura de palavras longas e frases; N0-U08-V01 funciona como verificação de decodificação consolidada da trilha (leitura, escrita e compreensão de frase, não compensáveis, com palavras inéditas);
- trilha completa: N0-U01 → N0-U02 → N0-U07 → N0-U08, exibidas como Trilha de Alfabetização · Unidades 1 a 4; manifestos `READY`, apenas TTS de palavra inteira ou frase, sem nova mídia humana;
- normalizador passa a aplicar limiares autorados por atividade (`completionEvidence.activityPolicies`, por exemplo 7 de 8 itens);
- renderer: cada rodada de exercício mostra seu próprio botão Ouvir (antes, itens com `ttsCue` em N0-U02-L06 não tinham áudio);
- catálogo, renderer e trilhas cobertos pelos testes do CI (82 lições e 9 verificações renderizadas sem interação não suportada).

Pendência registrada: enunciados das lições da trilha ainda dependem de leitura; narração das instruções para quem ainda não lê é melhoria de produto a avaliar no P8/P9.

R1.3b corrigiu a apresentação de conteúdo já publicado (N0 e N4-U09):

- o renderer deixou de exibir qualquer campo autoral como detalhe; só aparecem campos de uma lista pública com rótulo em português (`KEY_LABELS` em `classic-renderer.js`);
- em atividades, campos que revelam a resposta (exemplo completo, versão revisada, significado, pista, evidência, palavra a ouvir, conclusão) ficam ocultos até a correção;
- notas internas de autoria (regras de apresentação, de distratores, de avaliação) deixaram de aparecer para o aluno;
- listas de frases aparecem como lista legível, não como fichas monoespaçadas;
- falas para ouvir (`spoken`, `spokenContent`) viram botão de áudio em conteúdo explicativo;
- novo gate de CI `Test public labels` (`scripts/test-public-labels.mjs`) falha se algum documento publicado expuser rótulo interno.

## Remover o título redundante do primeiro acesso

```text
Estado consolidado: IMPLEMENTADO
Estado técnico: implementado
Estado de homologação: correção visual pontual, validada por captura real
Estado de mídia: SEM_DEPENDENCIA
Estado de publicação: PUBLICAVEL
```

Achado do usuário: o título "Comece por aqui" apenas repetia o que o botão "Começar a estudar" logo abaixo já dizia. Vale para os dois estilos, Simples e Completo, e não é específico do estilo Simples — por isso a correção não é uma regra de `interface-style.css`, é mudança no próprio `classic-home.js`.

Correção: `currentStudyCard` só renderiza o `<h2>` quando já existe percurso em andamento (`hasCurrent`), mostrando "Continue estudando". No primeiro acesso, o card vai direto para o contexto da unidade e o CTA, sem título. "Continue estudando" permanece porque comunica um estado (retomada) que o botão sozinho não diz.

## Reduzir a home e o cabeçalho no Simples

```text
Estado consolidado: IMPLEMENTADO
Estado técnico: implementado
Estado de homologação: correção visual pontual, validada por captura real
Estado de mídia: SEM_DEPENDENCIA
Estado de publicação: PUBLICAVEL
```

Achado do usuário: na home, a pílula `<Nível> · Unidade <N>` do card "Comece por aqui" duplicava o que já aparece no card `Unidades do curso` logo abaixo; e o botão `?` de Ajuda não agregava nada essencial ao Simples, já que a página de Ajuda reúne sobretudo atalhos (continuar estudando, plano, revisões) que no Simples já saíram da navegação ou viraram card na home.

Correção: `.course-context` (a pílula) e `.header-utilities .utility-link[href="#/ajuda"]` ficam ocultos por CSS só no Simples. O Completo preserva os dois.

Trade-off registrado: no Simples não há mais caminho até `#/metodologia` ("Como o curso funciona"). É aceitável porque essa página é material de apoio institucional, não currículo, e quem quiser esse nível de detalhe pode trocar para o estilo Completo em Configurações.

## Reduzir metadados internos da tela de unidade no Simples

```text
Estado consolidado: IMPLEMENTADO
Estado técnico: implementado
Estado de homologação: correção visual pontual, validada por captura real
Estado de mídia: SEM_DEPENDENCIA
Estado de publicação: PUBLICAVEL
```

Achado do usuário: dentro de uma unidade, a trilha `Curso › <título>` e a pílula `<Nível> · Unidade <N>` competiam com o título da unidade sem ajudar quem só quer estudar — no Simples o cabeçalho já mantém Início/Unidades sempre visíveis, então essa navegação é redundante.

Correção: no estilo Simples, `[data-unit-id] > .breadcrumbs` e `.unit-hero .eyebrow` ficam ocultos por CSS. O Completo preserva os dois, sem alteração. Lições e verificações não são afetadas: `.breadcrumbs` ali já é substituído por `← Voltar para a unidade` independentemente do estilo.

## Affordance de clique nas linhas de lição/unidade

```text
Estado consolidado: IMPLEMENTADO
Estado técnico: implementado
Estado de homologação: correção visual pontual, validada por captura real
Estado de mídia: SEM_DEPENDENCIA
Estado de publicação: PUBLICAVEL
```

Achado do usuário: dentro de uma unidade, as linhas de lição não deixavam claro que eram clicáveis — a seta `→` era só texto cinza-claro sem nenhum estado de interação na linha.

Correção: `.row-arrow` virou um selo circular com a cor de destaque do curso, visível em repouso (não só no hover), reaproveitado nas linhas de unidade da home e nas linhas de lição/verificação dentro da unidade. A linha inteira ganhou fundo ao passar o mouse/focar e o título destaca a cor de destaque. No mobile, a seta deixou de ser escondida por completo — fica visível em versão compacta, mantendo a affordance para o público de baixa familiaridade com interface que motivou o estilo Simples.

## Estilo da interface — Simples e Completo

```text
Estado consolidado: IMPLEMENTADO_COM_PENDENCIA
Estado técnico: implementado
Estado de homologação: pendente de homologação pedagógica/clareza com aluno real
Estado de mídia: SEM_DEPENDENCIA
Estado de publicação: aguarda homologação
```

Item transversal de interface, decidido com o usuário e fora do lote P7 ativo. Contrato público em `docs/ui-ux.md`.

Entregas:

- preferência local `interfaceStyle`, com `simple` de fábrica, aplicada em `data-interface-style` na raiz;
- estilo Simples: cabeçalho sem marca e sem selo de modo, navegação reduzida a Início e Unidades, sem o card `Seu progresso`;
- revisão recomendada vira card acionável na home do Simples, preservando o acesso que saiu da navegação;
- botão `Tamanho das letras` montado apenas no Simples, operando a mesma preferência de Aparência, com `Padrão`, `Grande` e `Extra grande`;
- estilo Completo idêntico ao painel anterior;
- `scripts/test-interface-style.mjs` no CI e smoke DOM + capturas dos dois estilos em `scripts/capture-classic-visuals.sh`.

O que falta para homologar:

- verificação de clareza com pessoa do público-alvo real, que é o critério que motivou o recurso;
- decidir se as escalas de fonte devem crescer também os títulos: hoje `--font-scale` não alcança alguns títulos da home, comportamento anterior ao item e comum aos dois estilos.

## Base homologada P1–P5

A base técnica já prova:

```text
catálogo/manifests
→ ContentService/normalização
→ renderer/atividades
→ evidência/progresso/revisão
→ cache local
→ sync Gist/conflitos
```

O `ProgressService` mantém separadas:

```text
percurso curricular
≠ evidência/domínio
≠ gamificação
```

O Clássico não possui XP oculto, lives ou punição por erro. Persistência local/Gist, respostas abertas, merge de três vias e falha remota sem perda foram homologados em P5.

## UX homologada antes de T1

### Home

- navegação superior única;
- sem sidebar duplicada;
- sem hero/banner grande;
- botão único de retomada/início concentra o CTA principal, com o título "Continue estudando" só quando já existe percurso;
- métricas derivadas de dados reais;
- card de progresso validado também em largura intermediária;
- `Ajuda` como utilitário discreto.

### Fluxo de lição

Base técnica homologada:

- uma etapa principal por vez;
- `← Voltar para a unidade` no lugar do breadcrumb longo;
- `Voltar` / `Avançar` sem gate artificial;
- respostas preservadas entre etapas;
- rótulos técnicos redundantes removidos;
- movimento respeita `prefers-reduced-motion`.

T1 acrescenta a tela inicial exclusiva da lição, nova linguagem pública e nova progressão inicial N0.

# T1 — Fundamentos claros e experiência de lição

```text
T1.0 baseline/ativação                                      ✓
T1.1 pesquisa + auditoria                                  ✓
T1.2 redimensionamento curricular N0                       ✓
T1.3 contrato de linguagem                                 ✓
T1.4 skills/fontes canônicas                               ✓
T1.5 contrato técnico de abertura                          ✓
T1.6 nova autoria inicial                                  ✓ staged + validada
  lote U1 — Letras e primeiros sons                        ✓
  lote U2 — Sílabas e primeiras palavras                   ✓
T1.7 frontend de intro/fluxo                               ✓ homologado
T1.8 metodologia em Ajuda                                  ✓ homologado
T1.9 migração/catálogo/progresso/mídia                     ✓ homologado
  contrato + mapper de progresso                           ✓
  wiring local/Gist + backup                               ✓ ativo
  promoção + ativação + catálogo/manifests                 ✓
  deep-link aliases + reconciliação de mídia               ✓
T1.10 validação/homologação                                ✓ homologado
```

## T1.1–T1.5 — decisões consolidadas

Fontes:

- auditoria: `docs/auditoria-t1-1-porta-entrada-n0.md`;
- arquitetura: `docs/redimensionamento-t1-2-n0.md`;
- linguagem: `docs/linguagem-aluno.md`;
- contrato técnico: `app/js/services/content-presentation-normalizer-v1.js` + `ContentService`.

Regras vigentes:

```text
fala/escrita não abre mais o curso
letras + consciência sonora aparecem cedo e articuladas
não exigir domínio perfeito A–Z antes de sons/sílabas
sílabas entram cedo na U2
variação letra↔som vem depois de experiências concretas

objetivo técnico ≠ objetivo público
clara + completa + simples
concreto → exemplo → conceito → prática → ampliação
```

A autoria v1 pode declarar `studentObjective`. O runtime produz `presentation.intro`; conteúdo legado sem copy pública recebe fallback neutro e **nunca** o `objective` técnico.

## T1.6 — nova autoria inicial

**Estado: CONCLUÍDO / VALIDADO EM STAGING.**

### Estratégia de staging

A nova autoria **não é colocada nos caminhos publicados antes da migração de T1.9**.

Motivo: o catálogo/manifests atuais ainda representam a ordem histórica. Alterar os arquivos vivos antes da troca do manifesto faria o Pages carregar conteúdo novo numa ordem antiga e pedagogicamente incoerente.

Regra:

```text
T1.6 autoria nova
→ content/staging/t1/
→ validação própria no CI
→ não descoberta pelo catálogo público

T1.9
→ migração de IDs/progresso/mídia
→ manifesto/catalog novos
→ promoção staged → caminhos publicados
→ troca coerente/atômica
```

Não enfraquecer `validate-catalog.mjs` para acomodar conteúdo intermediário.

### Lote U1 — Letras e primeiros sons

**Estado: CONCLUÍDO / VALIDADO EM STAGING.**

Local:

```text
content/staging/t1/n0-u01/
```

Nova ordem autorada:

```text
1. N0-U01-L03 — Letras e alfabeto
2. N0-U01-L04 — Maiúsculas e minúsculas
3. N0-U01-L05 — Vogais e consoantes
4. N0-U01-L09 — Letras, números e outros sinais
5. N0-U01-L06 — Como a escrita se organiza
6. N0-U01-L02 — Ouvindo sons nas palavras
7. N0-U01-L07 — Nome da letra e som: coisas diferentes
→ N0-U01-V02 — Verificação: Letras e primeiros sons
```

Decisões de autoria:

- as sete lições possuem `studentObjective` próprio;
- `N0-U01-L03` começa explicitamente por **o que é uma letra** e não possui pré-requisito;
- `N0-U01-L05` foi reduzida ao núcleo vogais/consoantes;
- o segundo núcleo da antiga L05 ganhou novo `N0-U01-L09`;
- `N0-U01-L06` define `espaço` perto do primeiro uso;
- `N0-U01-L02` foi reposicionada depois da base de letras;
- `N0-U01-L07` encerra U1 sem antecipar a variação complexa da U2;
- antigas `N0-U01-L01` e `N0-U01-L08` permanecem fontes legadas para reaproveitamento na U2.

### Verificação U1 V02

A `N0-U01-V02` cobre quatro agrupamentos obrigatórios e não compensáveis:

```text
alphabetAndForms
letterCategories
visualOrganization
soundAndLetter
```

Deliberadamente não cobra:

- síntese fala × escrita;
- variação ampla letra↔som;
- sílabas ou leitura sistemática de palavras.

Não cria novas mídias humanas: reutiliza `mediaId`s já reservados quando semanticamente adequados.

### Lote U2 — Sílabas e primeiras palavras

**Estado: CONCLUÍDO / VALIDADO EM STAGING.**

Local:

```text
content/staging/t1/n0-u02/
```

Nova ordem autorada/materializável:

```text
1. N0-U02-L01 — O que é uma sílaba?
2. N0-U02-L02 — Separando e juntando sílabas
3. N0-U02-L03 — Da sílaba ouvida à escrita
4. N0-U02-L04 — Sílabas no começo e no fim
5. N0-U02-L05 — Sílabas podem ter formas diferentes
6. N0-U02-L06 — Montando palavras
7. N0-U02-L07 — Lendo por partes e depois a palavra inteira
8. N0-U02-L08 — Palavra e significado
9. N0-U02-L09 — Letras e sons podem variar
10. N0-U02-L10 — Falar e escrever: duas formas de comunicar
→ N0-U02-V02 — Verificação: Sílabas e primeiras palavras
```

Decisões de autoria/materialização:

- as dez lições recebem `studentObjective` próprio;
- L01–L08 preservam o núcleo pedagógico silábico histórico que continuava válido;
- critérios históricos de conclusão são registrados explicitamente no overlay de autoria, sem inferência a partir de frases;
- o materializador adapta interações/gabaritos históricos ao contrato canônico de runtime sem reescrever a autoria fonte;
- blocos demonstrativos não são promovidos falsamente a atividades apenas por conterem metadados internos;
- L09 reaproveita a responsabilidade de variação letra↔som somente depois da base de sílabas/palavras;
- L10 fecha a unidade com fala × escrita como síntese concreta, não como abstração inaugural;
- V02 preserva a evidência silábica válida da verificação histórica e acrescenta apenas relações som-escrita e fala-escrita;
- staging permanece fora do catálogo público até T1.9.

### Verificação U2 V02

A `N0-U02-V02` possui 12 tarefas e cinco agrupamentos obrigatórios/não compensáveis:

```text
syllableAwareness
syllableWriting
wordReadingAndMeaning
soundWritingRelations
speechAndWriting
```

Mídia humana nova não foi criada: os novos núcleos reutilizam `mediaId`s já reservados quando o estímulo precisa ser controlado; TTS continua restrito aos casos em que a realização específica do som não determina a resposta.

### Validação staged

Teste:

```text
scripts/test-t1-content-authoring.mjs
```

CI executa `Test T1 staged authoring` sem misturar o conteúdo staged ao catálogo de produção.

Provas consolidadas de T1.6:

- U1: 7/7 lições com `studentObjective` autoral + V02;
- U2: 10/10 lições com objetivo público materializado + V02;
- `presentation.introSource = AUTHORED` nas lições staged;
- objetivo público separado do objetivo técnico;
- primeira lição do curso sem pré-requisito e com definição explícita de letra;
- U2 constrói sílaba antes de reutilizar o termo como pressuposto;
- L09/L10 entram somente depois da base concreta prevista na nova arquitetura;
- conclusão e evidência estruturadas para materialização;
- interações staged normalizáveis para o runtime atual;
- V01 histórica não vaza como identidade de evidência para V02;
- `validate-catalog` continua verde porque o conteúdo publicado permanece intacto;
- renderer/progresso/smoke visual atuais continuam protegidos pelo CI.

## T1.7 — frontend de abertura e retomada da lição

**Estado: CONCLUÍDO / HOMOLOGADO.**

Implementação principal:

```text
primeiro acesso
→ ← Voltar para a unidade
→ Lição
→ título
→ runtime.presentation.intro
→ Começar lição
→ stepper/conteúdo/conclusão ocultos

lição já iniciada
→ intro dispensada
→ etapa visual segura restaurada
→ conteúdo/evidência continuam governados pelo runtime e ProgressService
```

Decisões técnicas:

- `classic-presentation.js` substitui a fala pública da hero pelo `presentation.intro`; ausência de copy pública não faz o `objective` técnico reaparecer;
- `classic-lesson-flow.js` mantém `começou + etapa visual` em `localStorage` próprio (`lesson-ui:v1`), separado do progresso acadêmico;
- clicar em `Começar lição` **não** cria evidência, domínio nem conclusão;
- histórico pedagógico P5 já existente (`curriculum.lessons`, evidência ou resposta registrada) conta como sinal seguro de retomada para não obrigar alunos antigos a rever a intro;
- `curriculum.current.lessonId` isolado não conta como histórico, porque apenas abrir a rota já atualiza essa posição;
- o antigo step de sessão continua utilizável como fallback de posição somente quando já há sinal seguro de início;
- verificações de unidade continuam entrando diretamente no fluxo avaliativo; T1.7 não cria gate visual novo para verificação;
- foco vai para o título da intro/etapa e o movimento continua respeitando `prefers-reduced-motion`;
- nenhuma mídia nova é necessária para T1.7.

Validação/homologação:

- CI funcional verde para contratos, normalização, autoria T1, catálogo, progresso, Gist e renderer;
- smoke DOM prova intro visível + `lesson-stream` oculto no primeiro acesso;
- smoke DOM prova intro oculta + fluxo restaurado em retomada seedada sem alterar progresso acadêmico;
- capturas inspecionadas em 1440px, 900px, 680px e 390px;
- N0 validado em intro, retomada e etapa com atividade determinística;
- N4 validado em etapa de produção aberta/pending;
- ação principal permanece visível no celular e não há overflow do conteúdo da lição;
- a navegação global em largura móvel mantém o comportamento horizontal rolável já existente e não constitui blocker de T1.7.

Evidência de integração: PR #125.

## T1.8 — metodologia em Ajuda

**Estado: CONCLUÍDO / HOMOLOGADO.**

Mudança aplicada:

```text
shell global
→ remove rodapé persistente “Metodologia do curso”

Ajuda
→ adiciona “Como o curso funciona”
→ aponta para #/metodologia

#/metodologia
→ deep link preservado
→ retorno explícito para Ajuda
```

Guard rails preservados:

- nenhum item novo foi criado na navegação principal;
- Ajuda continua uma grade curta de caminhos, sem virar página institucional carregada;
- metodologia permanece encontrável em poucos passos;
- home, unidade e lição deixam de carregar informação institucional persistente;
- nenhuma alteração de currículo, progresso, evidência, mídia ou rota histórica foi necessária.

Validação/homologação:

- smoke DOM prova ausência de `app-footer` e de link persistente para metodologia no caminho de estudo;
- smoke DOM prova `Como o curso funciona` + `#/metodologia` dentro de Ajuda;
- smoke DOM prova retorno `#/ajuda` na página de metodologia;
- CI completo permaneceu verde, incluindo todas as proteções de T1.7;
- Ajuda foi inspecionada em desktop e 390px; metodologia foi inspecionada em desktop;
- hierarquia, legibilidade e navegação permaneceram coerentes.

Evidência de integração: PR #126.

## T1.9 — migração, catálogo, progresso e mídia

**Estado: CONCLUÍDO / HOMOLOGADO.**

### Gate 1 — contrato e mapper de progresso

**Estado: CONCLUÍDO / HOMOLOGADO.**

Fontes:

- `docs/migracao-t1-9-n0.md` — matriz executável;
- `app/js/services/progress-migration-t1-n0.js` — mapper puro/idempotente;
- `scripts/test-progress-migration-t1.mjs` — cenários de migração no CI.

Decisões já provadas:

- revisão-alvo `t1-n0-entry-v2` é idempotente;
- revisão futura/desconhecida é recusada, nunca rebaixada;
- colisões de refs da antiga U1-L05 são arquivadas antes de receber novo significado;
- split L05→L05+L09 preserva somente evidência semanticamente suficiente;
- U1-L01→U2-L10 e U1-L08→U2-L09 transferem histórico/current sem contar duas lições;
- U1-V01 concluída pode satisfazer U1-V02 pela equivalência curricular congelada em T1.2;
- U2-V01 sozinha preserva apenas os clusters silábicos da V02; extensão letra↔som/fala↔escrita exige escopo histórico correspondente;
- targets já existentes não são sobrescritos por uma fonte histórica;
- reviews seguem nova identidade somente quando o `sourceEvidenceRef` justifica a mudança;
- competências reconstruídas por evidência herdada chegam no máximo a `DEMONSTRADA`; migração não inventa `CONSOLIDADA` por duplicar a mesma fonte em lição/verificação;
- todo resultado testado continua válido contra `progress.schema.json`.

Evidência de integração: PR #127.

### Gate 2 — backup, cache local e Gist/sync

**Estado: CONCLUÍDO / HOMOLOGADO / ATIVO EM PRODUÇÃO.**

Entregas:

- `SafeProgressStorage.backupItem()` preserva explicitamente o JSON válido pré-migração;
- `MigratingProgressStorage` migra o cache antes de ele virar estado ativo;
- revisão futura/desconhecida é quarentenada em backup em vez de rebaixada;
- `ProgressSyncService` pode normalizar local, baseline e remoto antes das comparações;
- baseline antiga é persistida novamente na revisão canônica;
- Gist pré-T1 é regravado na revisão nova mesmo quando o snapshot migrado é semanticamente igual;
- Gist de revisão futura falha fechado, sem alterar local/remoto;
- todos os testes antigos de P5 permanecem verdes.

Ativação final:

```text
catálogo/manifests T1
+ MigratingProgressStorage
+ mapper do ProgressSyncService
+ contentRevision=t1-n0-entry-v2
→ ativos no mesmo lote
```

A janela inválida “progresso novo + catálogo antigo” não existiu. Backup local, baseline e Gist são normalizados conservadoramente antes de virarem estado ativo.

Evidência de infraestrutura: PR #128. Evidência de ativação atômica: PR #129.

## T1.10 — validação e homologação

**Estado: CONCLUÍDO / HOMOLOGADO.**

Evidência: `docs/homologacao-t1-10.md` + PR #130.

Provas fechadas:

- 17/17 lições iniciais auditadas por ordem, pré-requisito e objetivo público;
- checkpoint N0 reexecutado e realinhado para `N0-U01-V02`/`N0-U02-V02`;
- transição N0→N1 revalidada;
- CI funcional completo verde, incluindo gate permanente `Test T1 homologation`;
- smoke e inspeção visual aprovados em desktop, ~900px, ~680px e 390px;
- ausência de IDs/metadados internos na interface protegida pelo smoke;
- blockers de mídia permanecem locais e explícitos.

## Estado de publicação do slice

### N0-U01 / N0-U02

```text
Renderer/progresso: HOMOLOGADOS
Autoria T1 U1/U2: PUBLICADA / HOMOLOGADA
Experiência de abertura/retomada T1.7: HOMOLOGADA
Navegação secundária T1.8: HOMOLOGADA
Migração T1.9 local/Gist: ATIVA / HOMOLOGADA
Manifestos públicos: V02 ATIVOS
Deep links históricos: ALIASES ATIVOS
Mídia obrigatória: blockers locais explícitos nos manifests/fila
Publicação pedagógica das interações dependentes de mídia: BLOQUEADA somente onde o estímulo obrigatório falta
```

### N0-U03

```text
Renderer/progresso/evidência agregada: HOMOLOGADOS
10 lições + N0-U03-V01: PUBLICADAS / HOMOLOGADAS
Manifesto: READY
Catálogo: ATIVO
Produção aberta: VALIDACAO_PENDENTE quando não há avaliador confiável
Mídia humana obrigatória: nenhuma
Homologação: docs/homologacao-p7-n0-u03.md
```

### N0-U04

```text
Renderer/progresso/evidência textual/ordenação: HOMOLOGADOS
9 lições + N0-U04-V01: PUBLICADAS / HOMOLOGADAS
Manifesto: READY
Catálogo: ATIVO
Regras agregadas de conclusão: PRESERVADAS / TESTADAS
Mídia humana obrigatória: nenhuma
Linguagem pública + abertura de verificação: HOMOLOGADAS
Responsividade mobile do cabeçalho compartilhado: REVALIDADA
Homologação: docs/homologacao-p7-n0-u04.md
```

### N0-U05

```text
Renderer/progresso/escrita aberta/edição controlada: HOMOLOGADOS
10 lições + N0-U05-V01: PUBLICADAS / HOMOLOGADAS
Manifesto: READY
Catálogo: ATIVO
Produção própria: VALIDACAO_PENDENTE quando não há avaliador confiável
Planejamento/autochecagem/apoio opcional: PRESERVADOS / TESTADOS
Edições textuais controladas: DETERMINÍSTICAS somente nos alvos exatos autorados
Múltiplas ordens válidas: PRESERVADAS
Mídia humana obrigatória: nenhuma
Linguagem pública: HOMOLOGADA
Homologação: docs/homologacao-p7-n0-u05.md
```

### N4-U09

```text
Renderer/progresso/pending: HOMOLOGADOS
Abertura/retomada T1.7: HOMOLOGADA
Navegação secundária T1.8: HOMOLOGADA
Manifesto: READY
Nova mídia humana obrigatória: nenhuma
```

## Pendências abertas

```text
Global: nenhum blocker técnico
P6: HOMOLOGADO — docs/homologacao-p6.md
P7: ATIVO — expansão incremental do catálogo N0→N4
N0-U03: HOMOLOGADA — docs/homologacao-p7-n0-u03.md
N0-U04: HOMOLOGADA — docs/homologacao-p7-n0-u04.md
N0-U05: HOMOLOGADA — docs/homologacao-p7-n0-u05.md
N0-U06: HOMOLOGADA — docs/homologacao-p7-n0-u06.md
Ativo agora: R1 — Revisão do plano de ensino; P7 pausado até a revisão de cada nível
Estrutural: Trilha de Alfabetização separada + N0 a partir de U3 + nivelamento (R1.8/R1.9)
Local: resolver mídia obrigatória de U1/U2 quando o marco P8 exigir esses estímulos
```

## Gate `CLÁSSICO HOMOLOGADO`

Somente P9 pode satisfazer o gate final. Nenhuma implementação de XP, missões, conquistas ou streak começa antes dele.
