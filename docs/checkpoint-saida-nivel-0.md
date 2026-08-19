# Checkpoint de saída — Nível 0

## Objetivo

Este documento verifica se o **Nível 0 — Fundamentos** possui cobertura curricular suficiente para ser considerado fechado em planejamento e conteúdo, sem confundir três estados diferentes:

```text
currículo/conteúdo desenvolvido
≠ evidência externa validada de toda competência
≠ publicação técnica integralmente pronta
```

## Reexecução T1.10

O checkpoint foi reexecutado após a reorganização T1 da entrada do curso.

**Resultado curricular:** APROVADO.

As seis unidades continuam cobrindo as competências de saída do N0. A nova U1 — **Letras e primeiros sons** — e a nova U2 — **Sílabas e primeiras palavras** — redistribuem e antecipam fundamentos sem retirar responsabilidade curricular. As verificações ativas dessas unidades são `N0-U01-V02` e `N0-U02-V02`.

**Resultado de validação completa:** PARCIAL.

A produção oral compreensível continua não podendo ser declarada validada automaticamente sem reconhecimento de fala confiável ou observação humana/externa adequada.

**Resultado de publicação:** PARCIAL.

O renderer, o fluxo de lição, progresso, migração e sincronização já possuem base homologada no Modo Clássico. U1 e U2 ainda têm bloqueios locais de mídia controlada/imagens registrados nos manifests; isso impede fingir que os estímulos ausentes estão publicados, mas não reabre a arquitetura curricular.

## Mapeamento das competências de saída

| Competência de saída do Nível 0 | Evidência principal | Situação |
|---|---|---|
| reconhecer letras, sons, sílabas, palavras, frases e pequenos textos | `N0-U01-V02`, `N0-U02-V02`, `N0-U03-V01`, `N0-U04-V01` | coberta |
| ler palavras, frases e pequenos textos acessíveis com compreensão | `N0-U02-V02`, `N0-U03-V01`, `N0-U04-V01` | coberta |
| escrever palavras, frases e pequenas mensagens de forma compreensível | U2 construção de palavras + `N0-U03-V01` + `N0-U05-V01` | coberta; respostas abertas distinguem realização de validação plena |
| compreender mensagens orais curtas e responder de forma simples em situações familiares | `N0-U06-L06`, `N0-U06-V01` | compreensão oral coberta; produção oral requer validação externa para status forte |
| identificar começo e fim de frases em contextos apropriados | `N0-U05-L08`, `N0-U05-V01` | coberta |
| usar pontuação básica em situações simples | `N0-U05-L09`, `N0-U05-L10`, `N0-U05-V01` | coberta no escopo do nível |
| distinguir introdutoriamente palavra, frase, texto e significado | U2–U4, especialmente `N0-U02-V02`, `N0-U03-V01` e `N0-U04-V01` | coberta funcionalmente, sem taxonomia excessiva |
| perceber que palavras podem cumprir funções diferentes dentro de uma frase | `N0-U03-L05`, `N0-U03-L06`, `N0-U03-V01` | coberta funcionalmente |
| compreender e seguir instruções simples escritas ou orais | `N0-U04-L06`, `N0-U06-L05`, `N0-U06-L06`, `N0-U06-V01` | coberta |
| perguntar, responder, pedir e fornecer informações simples considerando situação e pessoas | `N0-U06-L01`–`L04`, `N0-U06-V01` | coberta; produção aberta preserva limite de validação automática |
| pedir esclarecimento ou reformular quando a comunicação não funcionar | `N0-U06-L09`, `N0-U06-L10`, `N0-U06-V01` | coberta |
| revisar aspectos básicos já ensinados quando recebe indicação clara | `N0-U04-L09`, U5 L6–L10, `N0-U05-V01` | coberta |

## Revisão por grandes dimensões

### Sistema de escrita e alfabetização

A progressão inicial agora é mais concreta:

```text
U1
letra e alfabeto
→ maiúsculas/minúsculas
→ vogais/consoantes
→ letras × números × outros sinais
→ organização visual da escrita
→ percepção de sons
→ nome da letra × som

U2
sílaba
→ separar/juntar
→ sílaba ouvida × escrita
→ posição/recorrência
→ formas silábicas diferentes
→ montar palavras
→ ler com apoio decrescente
→ palavra/significado
→ variação letra-som
→ fala × escrita como síntese
```

A reorganização preserva o princípio de não reduzir escrita a uma relação fixa entre letras e sons e evita transformar alfabetização em memorização mecânica de famílias silábicas.

A mídia controlada dessas unidades continua relevante porque tarefas em que o estímulo sonoro define a resposta não devem depender de TTS variável.

### Leitura e compreensão

U2 introduz leitura inicial de palavras; U3 conduz palavras a frases; U4 conduz frases a pequenos textos e formaliza releitura, evidência, relações e inferência simples.

O checkpoint confirma a regra:

```text
compreensão
≠ velocidade
≠ memorização
≠ resposta longa
```

### Produção e revisão escrita

U2 inicia construção de palavras; U3 inicia frase própria; U5 amplia para pequenas mensagens, planejamento, relação entre frases, suficiência, releitura, revisão e convenções.

A escrita aberta não recebe falsa validação automática por contagem de palavras, palavra-chave ou comparação literal com modelo.

### Uso cotidiano e oralidade

U6 integra finalidade, pergunta/resposta, pedido, orientação, mensagens cotidianas, compreensão oral, registro, variação e reparo.

TTS é suficiente para **compreensão oral sem dependência de prosódia específica**.

Produção oral é diferente:

```text
aluno marcou que falou
ou
aluno digitou uma resposta equivalente

≠
prova de que a fala foi compreensível
```

O curso pode oferecer ensaio oral e autochecagem. Para emitir status de `oralidade-validada`, será necessário mecanismo confiável de observação humana ou externa.

## Verificação transversal de saída

`content/levels/000-fundamentos/exit-verification.json` integra leitura, escrita, compreensão oral, uso cotidiano e reparo sem repetir mecanicamente U1–U6.

Na T1.10, as dependências fundacionais foram realinhadas:

```text
N0-U01-V02
+ N0-U02-V02
+ N0-U03-V01
→ carry-forward fundacional do N0-EXIT-V01
```

As antigas `N0-U01-V01` e `N0-U02-V01` permanecem apenas como legado histórico e **não** são dependências do checkpoint ativo.

## Transição N0 → N1

A transição foi rechecada contra `docs/transicao-n0-n1.md`, `docs/areas-nivel-1.md` e `docs/unidades-nivel-1.md`.

A nova ordem de U1/U2 não cria salto para o N1. O N1 continua recebendo exatamente a saída funcional esperada:

```text
N0
fundação funcional
↓
N1
consolidação + sistematização inicial + autonomia básica ampliada
```

O N1 não depende dos IDs históricos `N0-U01-V01`/`N0-U02-V01` nem da antiga posição de “fala e escrita” na abertura do curso.

## Lacunas e dependências que permanecem

### Produção oral não observável automaticamente

**Lacuna técnica, não curricular.**

U6 e a verificação de saída registram separadamente:

- compreensão oral automaticamente observável;
- prática/autochecagem de produção oral;
- produção oral validada por observador confiável.

Nenhuma delas substitui silenciosamente a outra.

### Mídia inicial

U1/U2 ainda possuem estímulos controlados e imagens obrigatórias pendentes identificados nos manifests/fila de mídia.

O bloqueio é local:

```text
mídia ausente
≠ currículo inválido
≠ permissão para fingir que o estímulo existe
```

## Critério de fechamento curricular

O N0 permanece **curricularmente fechado em M5** porque:

```text
U1–U6 possuem conteúdo detalhado
+ todas possuem verificação integrada ativa
+ verificação de saída do nível existe
+ competências de saída possuem evidência mapeada
+ dependências U1/U2 foram realinhadas às V02
+ transição N0→N1 permanece coerente
+ lacunas restantes são dependências externas/técnicas explícitas
```

## O que NÃO significa fechar o Nível 0

Não significa que:

- todas as mídias obrigatórias estejam produzidas;
- todas as respostas abertas possam ser avaliadas automaticamente;
- oralidade esteja externamente validada;
- o aluno real já concluiu o nível;
- todo o catálogo N0→N4 já esteja publicado no frontend.

## Resultado T1.10

A reexecução curricular não encontrou perda de competência nem pré-requisito invertido decorrente da nova entrada. A correção necessária foi o realinhamento do checkpoint de saída para `N0-U01-V02` e `N0-U02-V02`.

A homologação completa do marco T1 depende ainda dos gates técnicos, de clareza e visuais registrados em `docs/homologacao-t1-10.md`.
