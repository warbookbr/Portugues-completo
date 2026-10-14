# Nível 1 — Unidade 2 — Lições

# Palavras: ortografia, acentuação e sentidos

## Arquitetura

**12 lições + verificação integrada.**

Ordem de estudo: L1 → L2 → L3 → L4 → L5 → L11 → L12 → L6 → L7 → L8 → L9 → L10. As lições 11 e 12 foram acrescentadas no R1.4 com IDs novos (`N1-U02-L11`, `N1-U02-L12`) e ficam, pelo nome de arquivo (`005a-…`, `005b-…`), logo depois da Lição 5, para fechar o bloco de ortografia antes da tonicidade.

Toda lição tem `studentObjective` (objetivo público curto). Termos novos (cedilha, som nasal, sílaba tônica, acento gráfico, oxítona/paroxítona/proparoxítona, monossílabo, sinônimo, antônimo, polissemia, sentido literal/figurado, família de palavras, prefixo, sufixo, verbete, acepção) são apresentados com exemplo, nome e explicação no ponto do primeiro uso.

A unidade não tenta “zerar a ortografia”. Ela ensina regularidades de alta utilidade, mostra quando uma regra ajuda e quando consulta continua necessária.

Progressão:

```text
ortografia como convenção
→ regularidades contextuais frequentes
→ quando a fala esconde letras e quando letras disputam o mesmo som (família + consulta)
→ tonicidade
→ acentuação básica
→ relações de sentido
→ formação de palavras
→ consulta e revisão
```

## Lição 1 — Ortografia: padrões, convenções e consulta

- **Objetivo:** compreender por que nem toda grafia pode ser deduzida apenas pelo som e como padrões + consulta ajudam a escrever.
- **Dependências:** N0-U01/U02 e N1-U01.
- **Prática:** comparar grafias possíveis, identificar caso regular versus caso que precisa ser conhecido/consultado.
- **Evidência:** escolher estratégia adequada: aplicar padrão estudado ou consultar.
- **Limite:** não transformar “escreva como fala” em regra.

## Lição 2 — R e RR em contextos frequentes

- **Objetivo:** aplicar o contraste `r/rr` em posições e palavras acessíveis nas quais a regularidade gráfica é produtiva.
- **Dependências:** L1.
- **Prática:** leitura, completamento, comparação, escrita de palavras em frases e revisão focada.
- **Evidência:** aplicar padrão em palavras novas compatíveis e revisar erro controlado.
- **Limite:** não converter diferenças de pronúncia regional em erro.

## Lição 3 — C/QU e G/GU: quando o contexto gráfico orienta

- **Objetivo:** reconhecer e aplicar regularidades frequentes envolvendo `c/qu` e `g/gu` antes de `e/i` e outros contextos básicos selecionados.
- **Dependências:** L1–L2.
- **Prática:** agrupar por contexto, completar, comparar pronúncia/grafia e usar em frase.
- **Evidência:** aplicar as regularidades ensinadas em exemplos novos.
- **Cedilha (R1.4):** bloco curto e checagem não obrigatória sobre `ç` antes de `a/o/u` (praça, açúcar, moço) e por que não se usa antes de `e/i`.
- **Limite:** não inferir que a lição resolve todas as grafias de sons semelhantes.

## Lição 4 — M ou N antes de consoante, e grupos como NH, LH e CH

- **Objetivo:** usar padrões frequentes de `m/n` e reconhecer combinações como `nh/lh/ch` quando ajudam a ler e escrever palavras comuns.
- **Dependências:** L1–L3.
- **Prática:** localizar contexto, comparar palavras, completar e revisar.
- **Evidência:** aplicar somente os padrões explicitamente ensinados e reconhecer quando a grafia precisa de memória/consulta.
- **Termo:** "som nasal" é explicado em linguagem comum (parte do ar sai pelo nariz) antes do padrão; o til aparece só como outra marca possível.
- **Limite:** não transformar dígrafo em taxonomia fonológica extensa.

## Lição 5 — S e SS: um padrão útil, mas não o único jeito de escrever o som de s

- **Objetivo:** compreender o contraste contextual básico `s/ss` e perceber que o mesmo som também pode ter outras grafias que não serão resolvidas por uma única regra.
- **Dependências:** L1–L4.
- **Prática:** `s/ss` em contextos transparentes; comparação com palavras em que a grafia precisa ser conhecida/consultada.
- **Evidência:** aplicar o padrão ensinado e não extrapolá-lo para `c/ç/x` como se fossem equivalentes automáticos.
- **Linguagem:** sem notação fonética; o som é nomeado como "som de s em sapo" e o `s` entre vogais como "som do começo de zebra".
- **Limite:** regras completas de `s/z/c/ç/x/ch` ficam para progressão posterior.

## Lição 11 — Quando a fala e a escrita se afastam

- **ID:** `N1-U02-L11` (arquivo `005a-fala-escrita-se-afastam.json`; estudada depois da L5).
- **Objetivo:** reconhecer que a fala reduz vogais finais fracas (leite/leiti, bolo/bolu) e vogais juntas na mesma sílaba (caixa, peixe, ouro, manteiga) que a escrita mantém.
- **Dependências:** L1, L5.
- **Prática:** falar devagar, família de palavras (leite/leiteiro, pente/pentear, tomate/tomateiro), consulta; escuta antes da leitura com TTS.
- **Evidência:** escolha de grafia em frases, item de família, item de estratégia (consulta e fala reduzida não é erro) e produção própria de duas ou três frases com autochecagem (`PENDING_ALLOWED`).
- **Limite:** sem nomear ditongo ou vogal átona; sem regra de acento de paroxítonas em i/u; fala reduzida não é erro de fala.

## Lição 12 — Letras que disputam o mesmo som

- **ID:** `N1-U02-L12` (arquivo `005b-letras-disputam-mesmo-som.json`; estudada depois da L11).
- **Objetivo:** reconhecer `s/z` entre vogais, `g/j` antes de `e/i`, `x/ch` e `h` inicial como casos em que o som não decide a letra.
- **Dependências:** L3, L5, L11.
- **Prática:** família de palavras (casa/casinha, laranja/laranjeira, chave/chaveiro, hora/horário), consulta; pistas reais delimitadas (antes de `a/o/u` o som de "jeito" é sempre `j`; depois de `ai/ei` quase sempre `x`).
- **Evidência:** aplicação com família em palavras derivadas novas, item de consulta e produção própria de duas ou três frases com autochecagem (`PENDING_ALLOWED`).
- **Limite:** não prometer regra inexistente; sistema completo de `s/z/c/ç/x/ch` continua fora.

## Lição 6 — Sílaba tônica e acento gráfico não são a mesma coisa

- **Objetivo:** identificar a sílaba tônica em palavras acessíveis e distinguir destaque sonoro de marca gráfica.
- **Dependências:** base silábica N0 + L1–L5.
- **Prática:** ouvir/ler palavras, marcar sílaba tônica, comparar palavra tônica sem acento gráfico e palavra acentuada.
- **Evidência:** identificar tonicidade e explicar funcionalmente que nem toda sílaba tônica recebe acento escrito.
- **Mídia:** TTS pode apoiar quando a resposta não depende de uma pronúncia regional específica; se um item depender de estímulo acústico exato, migrar para áudio controlado.

## Lição 7 — Oxítona, paroxítona e proparoxítona como ferramentas

- **Objetivo:** usar as três classificações para organizar a posição da sílaba tônica e preparar regras de acentuação.
- **Dependências:** L6.
- **Prática:** identificar posição tônica e classificar palavras acessíveis.
- **Evidência:** classificar por posição sem transformar a nomenclatura em fim isolado.
- **Ordem de apresentação:** contar sílabas do fim (última, penúltima, antepenúltima) e mostrar exemplos antes de dar os três nomes.
- **Limite:** classificação só é mantida porque terá função nas regras seguintes.

## Lição 8 — Primeiras regras de acentuação e revisão

- **Objetivo:** aplicar um conjunto delimitado de regras de acentuação de alta produtividade, partindo de tonicidade já compreendida.
- **Dependências:** L6–L7.
- **Prática:** comparar terminações/padrões selecionados, acentuar, justificar por regra estudada, revisar palavras dentro de frases.
- **Evidência:** aplicar regras ensinadas em palavras novas compatíveis + reconhecer caso ainda não coberto.
- **Monossílabo:** "monossílabo" e "monossílabo tônico" são apresentados com exemplos (pá, pé, pó, três; o, de, nos) antes da regra.
- **Produção própria (R1.4):** duas ou três frases do aluno com palavras acentuadas, revisadas com checklist curto das três regras; registrada, não corrigida automaticamente.
- **Limite:** não esgotar hiatos, ditongos, monossílabos, casos especiais e exceções; a especificação de conteúdo deve documentar exatamente quais regras entram.

## Lição 9 — Sinônimos, antônimos, polissemia e precisão de palavra

- **Objetivo:** nomear e usar relações de sentido básicas, percebendo que sinônimos raramente são substitutos perfeitos em qualquer contexto.
- **Dependências:** semântica do N0 + N1-U01.
- **Prática:** proximidade/oposição, palavra polissêmica em contextos diferentes, escolher palavra mais precisa, primeiro contraste literal/figurado transparente.
- **Evidência:** interpretar relações em contexto e escolher substituição que preserve o sentido naquela situação.
- **Termos:** sinônimo, antônimo, polissemia e sentido literal/figurado são nomeados logo depois de cada demonstração.
- **Literatura:** cantiga popular de domínio público ("Nesta rua, nesta rua tem um bosque") com sentido figurado ("roubou meu coração") e checagem curta.
- **Limite:** semântica formal/figuras extensas ficam depois.

## Lição 10 — Famílias de palavras, prefixos, sufixos e uso do dicionário

- **Objetivo:** reconhecer relações básicas de formação de palavras e usar consulta para confirmar grafia/significado.
- **Dependências:** L1–L9.
- **Prática:** famílias, prefixos/sufixos transparentes, prever sentido e confirmar, consultar entrada simples de dicionário, revisar pequena produção.
- **Evidência:** relacionar palavra derivada à base e usar consulta adequadamente quando a regra não resolve tudo.
- **Termos:** família de palavras, prefixo, sufixo, verbete e acepção são nomeados logo depois de cada demonstração.
- **Limite:** não sistematizar toda derivação/composição nem morfemas teóricos.

## Verificação integrada — arquitetura

Agrupamentos obrigatórios:

```text
regularidades ortográficas estudadas
→ r/rr + c/qu/g/gu + nasalidade/grupos + s/ss
→ fala e escrita (L11) + letras que disputam o mesmo som (L12), avaliadas por família de palavras e consulta, com palavras novas

tonicidade e acentuação
→ sílaba tônica + classificação funcional + regras delimitadas

semântica e precisão
→ relações de sentido + polissemia + literal/figurado inicial

formação e consulta
→ família/prefixo/sufixo + dicionário/revisão
```

A avaliação deve distinguir erro em conteúdo **ensinado** de grafia ainda não sistematizada. Ditado não pode ser a única evidência.