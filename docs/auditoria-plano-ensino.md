# Auditoria do plano de ensino N0→N4

**Status:** `DECIDIDA` (estrutura e prioridades aprovadas pelo dono do projeto em 2026-10-14)

**Marco gerado:** `R1 — Revisão do plano de ensino` (ver `docs/roadmap-produto.md`)

**Data:** 2026-10-14

**Escopo:** progressão curricular de todo o curso (níveis, unidades e lições), comparada com a sequência real de ensino de português no Brasil e com o conteúdo efetivamente escrito nas lições.

Este documento registra o diagnóstico, a decisão de estrutura (seção 6) e a ordem de correção. As regras de método da Parte 2 foram promovidas às fontes canônicas (`docs/conteudo.md`, `docs/exercicios.md`, `docs/linguagem-aluno.md` e skill `course-content-design`); este arquivo mantém a rastreabilidade do diagnóstico.

---

## 0. Resumo

O curso pretende ser um plano de ensino **completo**: tudo o que uma pessoa precisa saber de português, do alfabeto ao domínio, com progressão concreta e sem sobrecarga.

A auditoria encontrou três camadas de resultado:

```text
ORDEM MACRO (níveis e unidades)
→ boa; segue a lógica de dependência e é compatível com a BNCC

ESCOPO (o que é ensinado)
→ lacuna grave na alfabetização (N0)
→ lacunas pontuais de ortografia e gramática (N1–N2)

MÉTODO (como é ensinado)
→ defeitos repetidos em todos os níveis:
  termo usado antes de ser ensinado,
  exemplo descrito em vez de mostrado,
  pouca produção própria,
  textos que não crescem,
  mesmo cenário repetido,
  N4 que repete o N3 com títulos mais longos
```

O problema mais sério é o N0: o curso ensina o que é letra e o que é sílaba, mas **nunca ensina o aluno a ler uma palavra nova sozinho nem a escrever uma palavra a partir do som**. Logo depois, a partir de N0-U03, cobra exatamente isso.

---

## 1. Como a auditoria foi feita

1. Mapa completo do curso extraído do conteúdo real: 44 unidades, cerca de 440 lições, com pré-requisitos declarados.
2. Verificação automática do grafo de pré-requisitos: nenhuma lição depende de algo posterior. Isso prova coerência das declarações, não qualidade da ordem.
3. Leitura do conteúdo real das lições (explicações, exemplos, atividades e verificações), nível por nível, aplicando o teste de pré-requisito do projeto.
4. Construção de uma sequência de referência a partir da BNCC, da PNA/Compromisso Nacional Criança Alfabetizada, de Miriam Lemle, do guia do IES/WWC e de estudos sobre alfabetização de jovens e adultos.
5. Comparação entre referência e curso.

### Por que a escola leva anos e o curso pode ir mais rápido

O tempo escolar longo tem quatro causas:

| Causa | Vale para o curso? |
|---|---|
| Português divide a semana com outras matérias | Não. O curso pode concentrar. |
| Conteúdo extenso | Sim. O escopo precisa estar completo. |
| Maturidade cognitiva da criança | Não para jovens e adultos. Argumentação, abstração e análise podem chegar mais cedo. |
| Prática até automatizar (ler com fluência, grafar sem pensar) | **Sim.** Isso exige volume de prática em qualquer idade. |

Consequência: a **ordem** de dependência continua valendo, o **ritmo** pode ser mais rápido, mas o **volume de prática** não pode ser comprimido, principalmente na alfabetização.

---

## 2. Parte 1: escopo e sequência de referência

### 2.1 Sequência real de ensino no Brasil (síntese)

**Alfabetização (1º e 2º ano)**

1. Letras: nome, ordem alfabética, maiúscula e minúscula, espaço entre palavras, outros sinais (EF01LP10, EF01LP11, EF01LP12).
2. Consciência fonológica: sílaba, rima, som inicial, medial e final; nome da letra × som (EF01LP06, EF01LP09, EF02LP06).
3. Instrução fônica sistemática: correspondências regulares diretas primeiro (p, b, t, d, f, v, m, n, l), depois as dependentes de posição (c/qu, g/gu, r/rr, s entre vogais), por fim os casos arbitrários (Lemle). Sons contínuos (m, s, f, l) antes dos oclusivos; pares confusos (b/d, p/b) separados no tempo.
4. Estruturas silábicas: CV → V → CVC → CCV; dígrafos (ch, lh, nh, rr, ss, qu, gu); nasalidade com til, m e n (EF02LP04, EF02LP05).
5. Escrever palavras por ditado e espontaneamente; decodificar palavras novas; reconhecer palavras muito frequentes; separar palavras; usar . ? !; maiúscula no início da frase e em nomes (EF01LP02, EF12LP01, EF02LP08, EF02LP09, EF02LP01).
6. Fluência de leitura e compreensão de frases e pequenos textos.

Componentes de evidência (PNA 2019, mantidos como referência mesmo após o Decreto 11.556/2023): consciência fonêmica, instrução fônica sistemática, fluência, vocabulário, compreensão, produção escrita.

**3º ao 5º ano:** ortografia regular e contextual (c/qu, g/gu, r/rr, s/ss, átonas finais, nasais, dígrafos, ditongos que a fala reduz, h inicial, irregulares e dicionário); sílaba tônica e acentuação (monossílabos e oxítonas → paroxítonas → todas); pontuação (dois-pontos, travessão, vírgula em enumeração e vocativo, aspas, reticências); classes (substantivo, verbo, adjetivo, pronome); concordância; tempos verbais; fluência em voz alta.

**6º ao 9º ano:** modos verbais, coordenação, termos da oração, transitividade, regência, voz passiva, subordinação, orações adjetivas, colocação pronominal, coesão, discurso direto e indireto, homonímia e parônimos, argumentação e modalização.

**Ensino médio:** gêneros por campo de atuação, argumentação, pesquisa e curadoria de fontes, variação, literatura com obras e contexto de produção.

### 2.2 Onde o curso está em relação à referência

| Etapa da referência | Onde está no curso | Situação |
|---|---|---|
| Letras, alfabeto, maiúsculas, vogais/consoantes, outros sinais | N0-U01-L03, L04, L05, L09, L06 | OK |
| Consciência silábica, nome × som | N0-U01-L02, L07; N0-U02-L01 a L04 | OK |
| Sons das vogais | não trabalhados | **FALTANDO** |
| Correspondência letra-som consoante por consoante | só som inicial de P, M, S, B, G em N0-U01-L07 | **FALTANDO** |
| Sílabas V, CVC, CCV | N0-U02-L05, apenas exposição | **COMPRIMIDO** |
| Dígrafos ch, lh, nh, rr, ss, qu, gu (para ler) | só no N1-U02, como ortografia | **FORA DE ORDEM** |
| Til, ão/ões, am/em/im, ç (para ler) | til nunca sistematizado; ç só em N2-U02-L02 | **FALTANDO / FORA DE ORDEM** |
| Letras com acento, til e cedilha como letras | nunca apresentadas; aparecem em palavras a partir de N0-U02-L10 | **FALTANDO** |
| Escrever palavras (ditado, de memória) | não existe; primeira escrita livre já é uma frase (N0-U03-L10) | **FALTANDO** |
| Leitura de palavras novas e fluência | repertório de cerca de 15 sílabas sempre ouvidas antes; N0-U03 já usa CORRER, AMIZADE, CANSADO | **FALTANDO / SALTO** |
| Espaço separa palavras; maiúscula inicia frase | só em N0-U05-L08, depois de escrita livre em U5-L02 a L07 | **FORA DE ORDEM** |
| Pontuação . ? ! | N0-U03-L08, N0-U05-L09 | OK |
| Vírgula, dois-pontos, fala | N0-U05-L10, N1-U04-L07/L08 | OK |
| Sílaba tônica e acentuação | N1-U02-L06 a L08, N2-U02-L04/L05 | OK, com termos não ensinados |
| Ortografia: átonas finais, ditongos reduzidos, s/z, g/j, x/ch, h inicial, -am/-ão | ausentes | **FALTANDO** |
| Classes, tempos, concordância | N1-U03, N2-U02-L09, N2-U03 | OK |
| Modos verbais e conjugação | "não sistematizar" em N1-U03-L05; nunca retomado | **FALTANDO** |
| Termos da oração, período, regência, crase, colocação | N2-U03, N2-U04 | OK |
| Voz passiva, oração relativa, gerúndio, particípio | só em N3-U03, tratados como retomada | **FALTANDO NO N2** |
| Discurso direto e indireto | N1-U04-L08 diz "não aprofundar"; sem retomada | **FALTANDO** |
| Porquês, mas/mais, mal/mau, há/a, onde/aonde, parônimos | ausentes | **FALTANDO** |
| Coesão, gêneros, argumentação, oralidade, variação, fontes | N1 a N4 | OK |
| Literatura | só na última unidade de N1 a N4; nada no N0 | **LACUNA DE DISTRIBUIÇÃO** |
| Letra cursiva | ausente | justificável (curso digital); falta só reconhecer letra manuscrita |

Nota: a própria auditoria T1.1 citou a recomendação do IES de "ensinar decodificação de palavras, análise de partes e reconhecimento/escrita de palavras". A decisão de não usar famílias silábicas como arquitetura (contra a decoreba de ba-be-bi-bo-bu) continua correta, mas foi aplicada sem colocar o ensino de decodificação no lugar.

### 2.3 Sequência proposta (o que entra e onde)

A ordem macro dos níveis e unidades é mantida. As inclusões são:

**Alfabetização completa** (pela decisão da seção 6, esta sequência passa a formar a Trilha de Alfabetização separada; o N0 do caminho principal começa em U3)

```text
U1  Letras e primeiros sons (atual, com ajustes)
    + letras com acento, til e cedilha continuam sendo letras
    + reconhecer letra manuscrita (só leitura)
    + parlendas e rimas como material de som

U2  Sílabas e primeiras palavras (atual L01 a L05)

NOVO BLOCO A: Decodificar e escrever palavras simples
    sons das vogais
    grupo 1: m, l, s, f, v, n (sons contínuos)
    grupo 2: p, t (oclusivos surdos)
    grupo 3: b, d (separados de p/t no tempo)
    grupo 4: c e g antes de a/o/u; j, z, x, r inicial
    grupo 5: h, que não tem som
    em cada lição: ler sílabas e palavras inéditas + escrever palavras ouvidas
    palavras geradoras significativas para adultos, não recitação de famílias

NOVO BLOCO B: Sílabas e grafias mais complexas para ler
    sílabas com consoante no fim (CVC: mar, sol, pas-ta, fun-do)
    sílabas com duas consoantes no início (CCV: pra-to, bla-blá, flor)
    ch, lh, nh
    rr, ss, qu, gu
    til, ão/ões, am/em/im, ç
    ditongos frequentes (pai, peixe, couro)

U2  atual L06 a L10 (montar e ler palavras, significado, variação, fala × escrita)
    agora apoiadas em decodificação real

NOVA VERIFICAÇÃO: decodificação consolidada
    ler e escrever palavras inéditas de todas as estruturas ensinadas
    pré-requisito de N0-U03

U3  Palavras, frases e sentido
    + espaço separa palavras; frase começa com maiúscula e termina com sinal
    + ponte de escrita guiada antes da escrita livre de U3-L10
    + textos restritos a palavras de estruturas já ensinadas

U4, U5, U6 (atuais, com ajustes de oralidade, literatura e repetição)
```

Estimativa: 10 a 14 lições novas no N0. É o maior acréscimo e o mais importante.

**N1**

- N1-U02: átonas finais (e/i, o/u), ditongos reduzidos na fala (caixa, peixe, ouro), s/z entre vogais, g/j, x/ch, h inicial, -am × -ão nos verbos; ç passa para cá na escrita.
- N1-U02-L06: nomear "sílaba tônica" e "monossílabo" antes de usar.
- Literatura e oralidade distribuídas ao longo do nível, não só em U6 e U7.

**N2**

- Lição de modos verbais e conjugação regular e irregular (N2-U02 ou N2-U03).
- Introdução de voz passiva, oração relativa, gerúndio e particípio (N2-U03 ou N2-U04), para que N3-U03 aprofunde em vez de ensinar como retomada.
- Discurso direto e indireto (N2-U05 ou N2-U06).
- Pares que confundem na escrita: porquês, mas/mais, mal/mau, há/a, onde/aonde, parônimos (N2-U02, retomada em N3-U06-L08).

**N3 e N4**

- Sem inclusão de escopo obrigatória. O trabalho é de método (Parte 2) e de redundância (Parte 3).
- Opcional: uma lição de literatura no tempo (N3-U09) e uma leitura integral guiada (N4-U09), se o curso quiser cobrir o que o ensino médio pede.

---

## 3. Parte 2: como ensinar cada tipo de conteúdo

Ensinar tudo com qualidade **não** significa lições longas. Significa:

```text
lições curtas, uma ideia por vez
+ prática suficiente e variada
+ revisão espaçada
+ avanço só com evidência
```

O curso pode ser grande no total e leve em cada sessão.

### 3.1 Regras transversais (valem para todos os níveis)

Cada regra abaixo responde a um defeito encontrado repetidamente no conteúdo atual.

| Regra | Defeito que corrige | Onde foi encontrado |
|---|---|---|
| **Termo novo só depois de exemplo, nome e explicação, no ponto do primeiro uso.** | Termo usado como rótulo sem nunca ser ensinado. | N1 (monossílabo tônico, concordância, parágrafo, conector, gênero de texto), N2 (subordinação, regência, próclise, hiato, ditongo), N3 (passiva, tese, modalidade), N4 (clítico, triangulação, linguagem epistêmica) |
| **Exemplo é mostrado, nunca descrito.** O texto, o poema, o documento ou a forma linguística aparece inteiro. | Exemplo que só descreve o material. | N2-U06-L09/L10, N3-U08/U09, N3-U05-L07, N4-U01-L02, N4-U04-L02/L07, N4-U09-L05/L10 |
| **Toda unidade tem pelo menos uma produção própria do aluno**, mesmo curta, revisada com o recorte da unidade. | Blocos longos sem escrita própria. | N1-U02 a U04 (cerca de 29 lições), N2-U02 a U05 (41 lições) |
| **Textos de leitura crescem de forma planejada** em extensão e densidade a cada nível. | Textos que não crescem. | N1 com o mesmo tamanho do N0; N3-U01 igual ao N2-U01; N4-U01 menor que N3-U01 |
| **Variedade de cenários e gêneros.** Um mesmo cenário não domina uma unidade. | Mesmo molde repetido. | "piloto de serviço" no N3 e N4; "reunião remarcada" no N2; "falta horário/local" no N0-U05 |
| **Retorno em espiral precisa acrescentar algo novo.** Se não acrescentar, vira retomada curta e diagnóstica. | Repetição sem ganho. | ambiguidade de "ela" com duas pessoas (7 vezes do N0 ao N2); "dois títulos, mesmos fatos" (5 vezes no N3); N4 espelhando N3 |
| **Exercício fechado tem distratores plausíveis.** Sim/não só quando a distinção é realmente difícil. | Exercício fácil demais nos níveis altos. | N3: 135 de 150 checagens são sim/não, muitas com a resposta no enunciado |
| **Verificação usa itens novos**, do mesmo padrão, nunca cópia das lições. | Verificação que mede memória. | N2-U04-V01, N3-U03-V01 |
| **Oralidade e literatura aparecem em todas as unidades** de forma breve, além das unidades dedicadas. | Concentração no fim do nível. | N0 a N4 |
| **Linguagem interna não aparece para o aluno.** | Vazamento de termos de autoria. | N3-U03-L09 ("variante documentada", "recorte"), N3-U06-L08 ("o sistema deve inventar") |

### 3.2 Modelo por tipo de conteúdo

**Alfabetização (decodificar e escrever)**

- Modelo de lição: ouvir a palavra-chave → ver a letra ou grupo → ligar som e letra → ler sílabas e palavras **inéditas** com a letra nova + letras já ensinadas → escrever palavras ouvidas → ler uma frase curta só com o que foi ensinado.
- Exercícios: ditado com fichas de letras e depois com teclado; montar palavra ouvida; ler e escolher a imagem; achar a palavra lida numa lista de palavras parecidas; ler a mesma frase curta mais de uma vez.
- Áudio só para **conferir depois** da tentativa de leitura, não antes.
- Volume: muitas tentativas curtas por lição (15 a 30 itens rápidos), mais revisão espaçada das letras anteriores.
- Avançar quando: lê e escreve palavras inéditas com a estrutura nova sem apoio, com acerto alto e consistente.

**Ortografia e acentuação**

- Modelo: observar um conjunto de palavras → descobrir o padrão → nomear a regra (se houver) → aplicar em palavras novas → separar o que é regra do que é memória e consulta.
- Exercícios: completar com a letra certa; classificar por padrão; ditado de palavras; revisar um texto curto **do próprio aluno**.
- Avançar quando: aplica em palavras novas e em texto próprio, não só em lista.

**Gramática e análise linguística**

- Modelo: uso em frase real → perceber a função → nomear → explicar → manipular (trocar, expandir, reduzir, reordenar) → aplicar em revisão de texto.
- Exercícios: transformar frases; escolher entre versões; explicar o efeito de uma mudança; revisar texto próprio com o recorte da lição.
- Proibido: classificar sem uso; regra falsa simplificada ("sujeito é a primeira palavra").

**Leitura e compreensão**

- Modelo: objetivo de leitura → texto completo e adequado ao nível → perguntas de localização, relação, inferência e avaliação → justificar com trecho do texto.
- Textos crescem em extensão, densidade e variedade de gênero a cada nível.
- Avançar quando: responde e justifica com evidência em texto inédito do mesmo nível.

**Produção escrita**

- Modelo: ler um modelo completo do gênero → planejar → escrever → revisar com critérios curtos → reescrever.
- Cada unidade tem produção própria, nem que seja um parágrafo.
- Avaliação aberta segue as regras de pending e IA já homologadas.

**Oralidade**

- Modelo: ouvir antes de ler → identificar o principal → responder ou reformular oralmente (ensaio opcional) → comparar com modelo.
- Presença breve em todas as unidades; unidades dedicadas aprofundam recursos próprios da fala (sinalização oral, tomada de turno, citar fonte falando).

**Literatura**

- Contato e fruição desde o N0 (parlendas, rimas, poema curto, microconto), com exigência crescente de interpretação e justificativa.
- Texto literário aparece inteiro, nunca resumido em uma frase.

---

## 4. Parte 3: diagnóstico priorizado do curso atual

### Prioridade 1: alfabetização do N0 (bloqueia o aluno real)

Pela decisão da seção 6, este bloco passa a ser escopo da Trilha de Alfabetização (R1.9). Os itens 1.6 (espaço e maiúscula) e o restante do que afeta N0-U03 em diante continuam no caminho principal (R1.3).

| # | Problema | Evidência | Correção |
|---|---|---|---|
| 1.1 | Decodificação nunca ensinada | N0-U01-L05: "ainda não estamos criando regras sobre os sons de cada letra"; sons das vogais nunca trabalhados; N0-U03-L01 pede "Leia CORRER" com sílabas nunca vistas | Bloco A da seção 2.3 |
| 1.2 | Sílabas complexas, dígrafos e nasais nunca ensinados para leitura | N0-U02-L05 só expõe PRA, FLOR, POR; aluno lê "pão" e "chegou" em U3/U4 | Bloco B da seção 2.3 |
| 1.3 | Escrita de palavras inexistente | primeira escrita livre é uma frase em N0-U03-L10 | ditado e escrita de memória em cada lição do Bloco A; ponte antes de U3-L10 |
| 1.4 | Sem fluência nem leitura graduada | repertório de cerca de 15 sílabas | lista graduada de palavras, palavras frequentes, leitura repetida |
| 1.5 | Passagem para frases e textos cedo demais | consequência de 1.1 a 1.4 | verificação de decodificação consolidada antes de N0-U03 |
| 1.6 | Espaço e maiúscula só em U5-L08 | U5-L02 a L07 já pedem escrita livre | bloco curto em U3-L04 ou U4-L01; antecipar U5-L08 |
| 1.7 | Letras com acento, til e cedilha nunca apresentadas | "é", "ã" em U2-L10; RÁPIDO, ÔNIBUS em U3 | bloco em U1-L09 |

### Prioridade 2: padrões de método em todos os níveis

Aplicar as regras transversais da seção 3.1. Ordem sugerida:

1. Termos não ensinados (N1 e N2 primeiro, porque afetam mais alunos).
2. Produção própria em toda unidade (N1-U02 a U04; N2-U02 a U05).
3. Exemplos descritos em vez de mostrados (N2-U06, N3-U05, U08, U09; N4-U01, U04, U09).
4. Crescimento planejado dos textos de leitura (N1-U01, N3-U01, N4-U01).
5. Literatura e oralidade distribuídas.

### Prioridade 3: lacunas de escopo N1 e N2

- N1-U02: ortografia faltante (seção 2.3).
- N2: modos verbais; introdução de passiva, relativa e formas nominais; discurso direto e indireto; pares que confundem.

### Prioridade 4: redundância e profundidade de N3 e N4

- N3-U01 espelha N2-U01 em 7 de 11 lições; N3-U07-L01 a L06 espelham N2-U08.
- Seis das nove unidades do N4 reproduzem a unidade correspondente do N3, com cenários iguais e textos iguais ou menores.
- Correção: condensar a repetição em retomada curta e usar o espaço para material longo real, várias variáveis ao mesmo tempo, gêneros variados e conflito genuíno.
- No N4, sobreposição interna: ritmo em U5-L04 e U6-L06; calibração de certeza em U1-L08, U3-L05, U6-L08 e U8-L04; status normativo em U5-L05 e U7-L02/L08. Cada conteúdo precisa de uma unidade dona.
- Exercícios do N3 mais fáceis que os do N2; N4 sem nenhum item fechado nem ponto de ensino explícito.

### Prioridade 5: ajustes finos e erros pontuais

- Pré-requisitos com IDs históricos: N0-U03-L01 (N0-U02-V01), N1-U02-L01 e N1-U02-L06 (N0-U01-V01, N0-U02-V01). Trocar pelas V02.
- N0-U02-L08 diz que a próxima etapa é a verificação, mas L09 e L10 vêm depois.
- N1-U01-L04: "caixas de coleta... Eles ficam" e "aos caixas"; o correto é "Elas" e "às caixas".
- Sobreposição de títulos N0-U02-L08 e N0-U03-L01 ("Palavra e significado").
- N1-U04-L06 repete N0-U05-L09 quase item por item.
- N1-U06-L07 repete N0-U06-L07.
- Lições do N1 em diante sem `studentObjective` nem abertura pública: risco de expor o objetivo técnico quando forem publicadas no P7.

---

## 5. Ordem macro: o que **não** precisa mudar

- Sequência dos níveis N0 → N4.
- Ordem das unidades dentro de cada nível, com duas reordenações opcionais de baixo impacto:
  - N3: U1, U2, U4, U3 (mantém leitura, argumentação e fontes contínuos);
  - N3: U8 antes de U6.
- Construção de conceitos que já funciona bem: letra antes de alfabeto, sílaba pelo modelo concreto, frase pelo uso, crase por decomposição (artigo, preposição, regência), coesão separada de coerência, argumentação crescendo de opinião a evidência e objeção, respeito à variação linguística em todos os níveis.

---

## 6. Decisão de estrutura e ordem de execução

### 6.1 Público e estrutura

O curso é voltado principalmente a quem **já lê e escreve**, com qualquer grau de segurança. A alfabetização inicial passa a ser uma **trilha separada e opcional**, fora do caminho principal.

```text
Primeira entrada: "Por onde você quer começar?"
│
├─ Ainda estou aprendendo a ler e escrever
│     → Trilha de Alfabetização (separada, opcional)
│     → ao concluir, segue para o N0
│
├─ Leio e escrevo, mas com pouca segurança
│     → começa no N0
│
└─ Leio e escrevo bem
      → nivelamento curto
      → começa no N1, N2 ou adiante (sempre pode mudar)
```

Consequências:

- **Trilha de Alfabetização:** reúne as atuais N0-U01 (letras e primeiros sons) e N0-U02 (sílabas e primeiras palavras) e recebe os Blocos A e B da seção 2.3 e a verificação de decodificação consolidada. A lacuna 1.1 a 1.7 da Parte 3 passa a ser escopo dessa trilha.
- **N0 do caminho principal:** começa em "Palavras, frases e sentido" (atual N0-U03), para quem lê com pouca segurança. Os pré-requisitos de N0-U03-L01 deixam de exigir a verificação de sílabas; o aluno que vem da trilha chega ao N0 pela conclusão dela.
- **Nivelamento:** escolha de perfil na primeira entrada; teste curto apenas para quem declara ler bem. A escolha é recomendação, não bloqueio.
- **Identidade:** IDs publicados (`N0-U01`, `N0-U02` e suas lições) são preservados para não exigir migração de progresso; muda apenas o pertencimento de trilha no catálogo. A decisão final de identidade é registrada no subpasso de produto que implementar a trilha.
- **Ordem N0 → N4:** mantida.

### 6.2 Ordem de execução aprovada

```text
R1.1 documentação, roadmap e regras de método nas fontes canônicas
R1.2 correções objetivas (IDs históricos, erros pontuais, pontes)
R1.3 N0 a partir de U3: método (termos, espaço/maiúscula, oralidade, literatura, repetição)
R1.4 N1: método + lacunas de ortografia
R1.5 N2: método + modos verbais, passiva/relativa/formas nominais,
     discurso direto e indireto, pares que confundem
R1.6 N3: construção da sintaxe da U3, exemplos reais, crescimento de textos, checagens
R1.7 N4: condensar repetição do N3, material longo real, termos novos
R1.8 produto: trilha separada no catálogo, N0 a partir de U3, nivelamento
R1.9 Trilha de Alfabetização completa (Blocos A e B + verificação de decodificação)
```

O P7 fica **pausado**. A publicação de cada nível no Clássico é retomada quando a revisão daquele nível (R1.4 para o N1, R1.5 para o N2 e assim por diante) estiver concluída, evitando publicar conteúdo que será reescrito.

### 6.3 Literatura

Escopo mantido em interpretação e fruição com exigência crescente. Literatura no tempo e leitura integral guiada ficam como ampliação opcional futura, sem compromisso no R1.

### 6.4 Regras de execução do R1

- Correção de método em lição publicada preserva o ID quando o objetivo e a competência continuam os mesmos; mudança de significado exige novo ID e mapeamento, como em T1.9.
- Lição nova recebe ID novo, sem reaproveitar ID de outra lição.
- Toda correção passa pelas cinco revisões da skill `curricular-orchestration` e mantém CI verde.

## 7. Fontes

- BNCC, portal oficial: https://basenacionalcomum.mec.gov.br/
- BNCC, documento final: http://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf
- Decreto 9.765/2019 (PNA): https://planalto.gov.br/ccivil_03/_ato2019-2022/2019/decreto/D9765impressao.htm
- Decreto 11.556/2023 (Compromisso Nacional Criança Alfabetizada): https://www2.camara.leg.br/legin/fed/decret/2023/decreto-11556-12-junho-2023-794286-norma-pe.html
- Miriam Lemle, Guia teórico do alfabetizador: https://edisciplinas.usp.br/pluginfile.php/5250250/mod_resource/content/1/Miriam-Lemle-Guia-Teorico-Do-Alfabetizador.pdf
- IES/WWC, Foundational Skills to Support Reading for Understanding: https://ies.ed.gov/ncee/wwc/PracticeGuide/21/Published
- NCIL, ensino fônico sistemático: https://improvingliteracy.org/resource/how-to-use-systematic-phonics-instruction-in-your-classroom/
- Texas LDC, sons contínuos e oclusivos: https://texasldcenter.org/wp-content/uploads/2023/12/ReadingStrategies_Dyslexia_Alphabetic.pdf
- Melo e Correa, alfabetização de adultos: https://www.e-publicacoes.uerj.br/revispsi/article/download/8419/6252
- Jardini et al., alfabetização de jovens e adultos: https://periodicos.fclar.unesp.br/iberoamericana/article/view/9208
- Método Paulo Freire, palavras geradoras: https://www.redalyc.org/pdf/440/44026207.pdf

Habilidades BNCC por ano foram conferidas em transcrições secundárias e devem ser reconferidas no documento oficial antes de citação definitiva em lição.
