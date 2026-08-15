# Checkpoint de saída — Nível 0

## Objetivo

Este documento verifica se o **Nível 0 — Fundamentos** possui cobertura curricular suficiente para ser considerado fechado em planejamento e conteúdo, sem confundir três estados diferentes:

```text
currículo/conteúdo desenvolvido
≠ evidência externa validada de toda competência
≠ publicação técnica pronta
```

## Resultado do checkpoint

**Resultado curricular:** APROVADO.

As seis unidades possuem arquitetura de lições, conteúdo detalhado e verificação integrada. As competências de saída do Nível 0 possuem rotas de evidência plausíveis e coerentes.

**Resultado de validação completa:** PARCIAL.

A produção oral compreensível não pode ser declarada validada automaticamente pela aplicação sem reconhecimento de fala ou observação humana/externa confiável.

**Resultado de publicação:** NÃO PRONTO.

Há mídia humana obrigatória já identificada nas Unidades 1 e 2 que continua pendente na fila de produção. Além disso, o frontend ainda não implementa o renderer das unidades/lições.

## Mapeamento das competências de saída

| Competência de saída do Nível 0 | Evidência principal | Situação |
|---|---|---|
| reconhecer letras, sons, sílabas, palavras, frases e pequenos textos | `N0-U01-V01`, `N0-U02-V01`, `N0-U03-V01`, `N0-U04-V01` | coberta |
| ler palavras, frases e pequenos textos acessíveis com compreensão | `N0-U02-V01`, `N0-U03-V01`, `N0-U04-V01` | coberta |
| escrever palavras, frases e pequenas mensagens de forma compreensível | U2 construção de palavras + `N0-U03-V01` + `N0-U05-V01` | coberta; respostas abertas distinguem realização de validação plena |
| compreender mensagens orais curtas e responder de forma simples em situações familiares | `N0-U06-L06`, `N0-U06-V01` | compreensão oral coberta; produção oral requer validação externa para status forte |
| identificar começo e fim de frases em contextos apropriados | `N0-U05-L08`, `N0-U05-V01` | coberta |
| usar pontuação básica em situações simples | `N0-U05-L09`, `N0-U05-L10`, `N0-U05-V01` | coberta no escopo do nível |
| distinguir introdutoriamente palavra, frase, texto e significado | U1–U4, especialmente `N0-U03-V01` e `N0-U04-V01` | coberta funcionalmente, sem taxonomia excessiva |
| perceber que palavras podem cumprir funções diferentes dentro de uma frase | `N0-U03-L05`, `N0-U03-L06`, `N0-U03-V01` | coberta funcionalmente |
| compreender e seguir instruções simples escritas ou orais | `N0-U04-L06`, `N0-U06-L05`, `N0-U06-L06`, `N0-U06-V01` | coberta |
| perguntar, responder, pedir e fornecer informações simples considerando situação e pessoas | `N0-U06-L01`–`L04`, `N0-U06-V01` | coberta; produção aberta preserva limite de validação automática |
| pedir esclarecimento ou reformular quando a comunicação não funcionar | `N0-U06-L09`, `N0-U06-L10`, `N0-U06-V01` | coberta |
| revisar aspectos básicos já ensinados quando recebe indicação clara | `N0-U04-L09`, U5 L6–L10, `N0-U05-V01` | coberta |

## Revisão por grandes dimensões

### Sistema de escrita e alfabetização

U1 e U2 constroem fala/escrita, sons, letras, sílabas e palavras. O checkpoint não identificou necessidade de criar uma nova unidade de alfabetização.

A mídia controlada dessas unidades continua relevante porque tarefas em que o estímulo sonoro define a resposta não devem depender de TTS variável.

### Leitura e compreensão

U3 conduz palavras a frases; U4 conduz frases a pequenos textos e formaliza releitura, evidência, relações e inferência simples.

O checkpoint confirma a regra:

```text
compreensão
≠ velocidade
≠ memorização
≠ resposta longa
```

### Produção e revisão escrita

U3 inicia frase própria; U5 amplia para pequenas mensagens, planejamento, relação entre frases, suficiência, releitura, revisão e convenções.

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

## Lacunas encontradas e tratamento

### 1. Evidência transversal de saída

As verificações de unidade cobrem as competências, mas faltava um ponto único para observar transferência entre várias unidades.

**Correção implementada:** criação de `content/levels/000-fundamentos/exit-verification.json`.

Ela não repete todo o conteúdo de U1–U6. Usa resultados de base já obtidos e acrescenta uma situação final integrada de leitura, escrita, compreensão oral, uso cotidiano e reparo.

### 2. Produção oral não observável automaticamente

**Lacuna técnica, não curricular.**

**Tratamento:** U6 e a verificação de saída registram separadamente:

- compreensão oral automaticamente observável;
- prática/autochecagem de produção oral;
- produção oral validada por observador confiável.

Nenhuma delas substitui silenciosamente a outra.

### 3. Prontidão para publicação

O conteúdo curricular avançou além da implementação do aplicativo.

**Tratamento:** não alterar `content/course.json` nem declarar unidades publicadas apenas porque os JSONs existem. A publicação será um marco técnico próprio, com renderer, acessibilidade e validação visual.

## Critério para considerar o Nível 0 curricularmente fechado

O Nível 0 pode ser marcado como **curricularmente fechado em M5** quando:

```text
U1–U6 possuem conteúdo detalhado
+ todas possuem verificação integrada
+ verificação de saída do nível existe
+ competências de saída possuem evidência mapeada
+ lacunas encontradas estão corrigidas ou explicitamente classificadas como dependência externa/técnica
```

Essas condições são atendidas após a integração da U6 e da verificação de saída.

## O que NÃO significa fechar o Nível 0

Não significa que:

- todas as mídias obrigatórias estejam produzidas;
- o frontend já saiba renderizar as lições;
- todas as respostas abertas possam ser avaliadas automaticamente;
- oralidade esteja externamente validada;
- o aluno real já concluiu o nível;
- Nível 1 possa começar a receber conteúdo detalhado sem antes avançar por `M2` e `M3`.

## Próximo gate curricular

Depois do fechamento do Nível 0:

```text
Nível 1 — M1 já concluído
→ dimensionar áreas em M2
→ revisar conexão com saída do N0 e matriz global
→ organizar unidades em M3
→ só depois dimensionar lições e produzir conteúdo
```

Antes de iniciar N1 em `M2`, é válido fazer uma revisão final do mapa de entrada/saída entre N0 e N1, mas não é necessário reabrir U1–U6 sem uma lacuna concreta.