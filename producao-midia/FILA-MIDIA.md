# Fila de produção de mídia

Lista oficial das mídias pedagógicas que precisam ser produzidas manualmente. Ler `producao-midia/README.md` antes de produzir.

## Resumo

| Lote | Uso | Prioridade | Obrigatório | Status |
|---|---|---|---|---|
| `N0-U01-L02-AUD-*` | U1 L2; reutiliza nas L7, L8 e U2 L1/L2/L3 | ALTA | SIM | A_PRODUZIR |
| `N0-U01-L03-AUD-*` | U1 L3; reutiliza na L7 e na verificação integrada | ALTA | SIM | A_PRODUZIR |
| `N0-U01-L08-AUD-*` | U1 L8 | NORMAL | SIM | A_PRODUZIR |
| `N0-U01-V01-AUD-*` | Verificação integrada da U1 | ALTA | SIM | A_PRODUZIR |
| `N0-U02-L01-AUD-*` | U2 L1 — percepção inicial de sílabas | ALTA | SIM | A_PRODUZIR |
| `N0-U02-L02-AUD-*` | U2 L2 — segmentação e recombinação oral; reutiliza na U2 L3 | ALTA | SIM | A_PRODUZIR |
| `N0-U02-L08-IMG-*` | U2 L8 — associação entre palavra lida e significado familiar | ALTA | SIM | A_PRODUZIR |

As ligações pedagógicas das Lições 2, 3, 7 e 8, da verificação integrada da Unidade 1 e das Lições 1, 2, 3 e 8 da Unidade 2 já estão dimensionadas abaixo. Exercícios formais futuros podem reutilizar estes mesmos IDs quando fizer sentido; não renumerar mídias existentes. As Lições 1, 4, 5 e 6 da Unidade 1 não exigem mídia humana na fila: usam TTS e/ou recursos visuais renderizados pela própria interface. A Lição 7 não cria novos arquivos e reutiliza subconjuntos dos lotes L2 e L3. A Lição 8 usa quatro novos arquivos já reservados no lote L8 e reutiliza `sapo` e `gato` do lote L2. A Lição 1 da Unidade 2 reutiliza `pato`, `mala` e `sol` como palavras inteiras e cria apenas os estímulos novos/segmentados que não existem nos lotes anteriores. A Lição 2 reutiliza `gato`, `mala` e `pato` como palavras inteiras e cria fichas de sílabas contextuais, além das palavras novas `boneca` e `tomate`. A Lição 3 não cria novo lote: reutiliza os mesmos estímulos auditivos da Lição 2 e as palavras inteiras `gato`, `mala`, `pato` e `sol`, acrescentando apenas trechos escritos renderizados pela interface. As Lições 4, 5, 6 e 7 da Unidade 2 não criam mídia humana nova. A Lição 8 da Unidade 2 cria sete imagens curadas de referentes concretos para verificar significado sem impor leitura adicional de definições como modalidade principal.

Para verificações integradas que ficam fora da contagem de lições, usar `V01`, `V02` etc. no segmento que normalmente identifica a lição. Exemplo: `N0-U01-V01-AUD-001` significa Nível 0, Unidade 1, Verificação integrada 1, áudio 001. Não criar uma `L09` apenas para representar a verificação.

## Lote L2 — palavras para percepção auditiva

**Tipo:** `AUDIO_CONTROLADO`  
**Destino:** `Português Completo/Nível 0/Unidade 01/Lição 02/Audio/`

Objetivo: fornecer estímulos fixos para comparar sons claros sem depender do TTS.

| ID | Gravar |
|---|---|
| `N0-U01-L02-AUD-001` | `pato` |
| `N0-U01-L02-AUD-002` | `pipa` |
| `N0-U01-L02-AUD-003` | `mala` |
| `N0-U01-L02-AUD-004` | `mesa` |
| `N0-U01-L02-AUD-005` | `sol` |
| `N0-U01-L02-AUD-006` | `sapo` |
| `N0-U01-L02-AUD-007` | `gato` |
| `N0-U01-L02-AUD-008` | `bola` |

### Ligações já dimensionadas na Lição 2

| ID | Localização pedagógica atual |
|---|---|
| `N0-U01-L02-AUD-001` | `L02-B02`; `L02-A01` itens 1 e 4; U2 `L01-B02` como palavra inteira; U2 `L02-B03`; `L02-C03`; `L02-A02` item 1 e opções relacionadas; U2 `L03-C02`; `L03-A01` item 3 |
| `N0-U01-L02-AUD-002` | `L02-B02`; `L02-A01` item 1 |
| `N0-U01-L02-AUD-003` | `L02-C01`; `L02-A01` item 2; U2 `L01-C01` como palavra inteira; U2 `L02-C01`; `L02-C02` opção; `L02-A01` item 2; `L02-A02` itens 1 e 4; U2 `L03-C01`; `L03-A01` item 2 |
| `N0-U01-L02-AUD-004` | `L02-C01` |
| `N0-U01-L02-AUD-005` | `L02-A01` item 3; U2 `L01-B04`; U2 `L01-A01` item 5; U2 `L03-B03`; `L03-A01` item 5 |
| `N0-U01-L02-AUD-006` | `L02-A01` item 3; reutilização em L7; `L08-B04`; `L08-A01` item 3 |
| `N0-U01-L02-AUD-007` | `L02-B03`; `L02-A01` item 2; reutilização em L7; `L08-C01`; `L08-A01` item 2; U2 `L02-B02`; `L02-C02`; `L02-P01`; `L02-A01` item 1; `L02-A02` itens 1 e 3; U2 `L03-B02`; `L03-A01` item 1; `L03-A02` item 1 |
| `N0-U01-L02-AUD-008` | `L02-B03`; `L02-A01` item 4; reutilização em L7 |

### Ligações já dimensionadas na Lição 7

| ID | Localização pedagógica atual |
|---|---|
| `N0-U01-L02-AUD-001` (`pato`) | `L07-B02`; `L07-C01` segundo áudio; `L07-A02` item 4 |
| `N0-U01-L02-AUD-003` (`mala`) | `L07-B03`; `L07-A02` item 5 |
| `N0-U01-L02-AUD-006` (`sapo`) | `L07-A01` item 2; `L07-A02` item 1 |
| `N0-U01-L02-AUD-007` (`gato`) | `L07-A02` item 3 |
| `N0-U01-L02-AUD-008` (`bola`) | `L07-A01` item 4; `L07-A02` item 2 |

Os clipes de palavra usados em `L07-A02` devem ser apresentados sem a forma escrita antes da resposta. A palavra e o destaque da letra inicial podem ser revelados somente depois da escolha, para não fornecer uma pista visual decisiva em uma tarefa de associação auditiva.

Gravar **uma palavra por arquivo**, uma única vez. Usar português brasileiro claro, mesma voz, ritmo natural moderado, volume/ambiente consistentes, sem música, efeitos ou ênfase artificial no som observado. Arquivo: `ID.wav`.

Validar: palavra correta, alta inteligibilidade, sem cortes, sem ruído perceptível e sem pistas de volume/entonação entre arquivos.

## Lote L3 — nomes das 26 letras

**Tipo:** `AUDIO_CONTROLADO`  
**Destino:** `Português Completo/Nível 0/Unidade 01/Lição 03/Audio/`

Objetivo: servir de referência fixa quando o aluno ouvir o nome isolado e precisar identificar a letra.

| ID final | Roteiro em ordem A–Z |
|---|---|
| `N0-U01-L03-AUD-001` a `026` | `a`; `bê`; `cê`; `dê`; `e`; `efe`; `gê`; `agá`; `i`; `jota`; `cá`; `ele`; `eme`; `ene`; `o`; `pê`; `quê`; `erre`; `esse`; `tê`; `u`; `vê`; `dáblio`; `xis`; `ípsilon`; `zê` |

### Ligações já dimensionadas na Lição 3

Todos os 26 IDs alimentam o `letterSet` da lição e são usados em `L03-B02`, `L03-B03` e `L03-A01`. O ID `N0-U01-L03-AUD-011` também é o estímulo explícito de `L03-C01`. As letras devem aparecer visualmente como texto/interface; não produzir uma imagem estática do alfabeto para substituir essa renderização.

### Ligações já dimensionadas na Lição 7

| ID | Letra | Localização pedagógica atual |
|---|---|---|
| `N0-U01-L03-AUD-002` | B | `L07-A01` item 3 |
| `N0-U01-L03-AUD-007` | G | `L07-A01` item 5 |
| `N0-U01-L03-AUD-013` | M | `L07-B03` |
| `N0-U01-L03-AUD-016` | P | `L07-B02`; `L07-C01` primeiro áudio |
| `N0-U01-L03-AUD-019` | S | `L07-A01` item 1 |

### Reutilização na verificação integrada da Unidade 1

| ID | Letra | Localização pedagógica atual |
|---|---|---|
| `N0-U01-L03-AUD-006` | F | `V01-Q08` |

Na Lição 7 e na verificação integrada esses arquivos representam explicitamente **o nome da letra**. Não usar TTS no lugar deles nas tarefas em que o aluno precisa distinguir nome de letra de som representado em palavra.

A numeração corresponde exatamente à ordem A=001, B=002 ... Z=026. Cada arquivo contém somente o nome da letra, sem dizer `letra`. Usar a mesma voz e padrão acústico do Lote L2 quando possível. As formas listadas são referência do curso e não significam que variantes legítimas sejam automaticamente erros.

Validar: 26 arquivos presentes, conteúdo correspondente, volume consistente, sem cortes ou efeitos.

## Lote L8 — contrastes letra–som

**Tipo:** `AUDIO_CONTROLADO`  
**Destino:** `Português Completo/Nível 0/Unidade 01/Lição 08/Audio/`

| ID | Gravar |
|---|---|
| `N0-U01-L08-AUD-001` | `casa` |
| `N0-U01-L08-AUD-002` | `cidade` |
| `N0-U01-L08-AUD-003` | `gelo` |
| `N0-U01-L08-AUD-004` | `quilo` |

Reutilizar `gato` (`N0-U01-L02-AUD-007`) e `sapo` (`N0-U01-L02-AUD-006`). Não regravar.

Contrastes dimensionados: `casa/cidade`, `gato/gelo`, `sapo/cidade` e `casa/quilo`. O aluno deve perceber a variação; não precisa explicar ainda as regras ortográficas.

### Ligações já dimensionadas na Lição 8

| ID | Conteúdo | Localização pedagógica atual |
|---|---|---|
| `N0-U01-L08-AUD-001` | `casa` | `L08-B02`; `L08-C02`; `L08-A01` itens 1 e 4 |
| `N0-U01-L08-AUD-002` | `cidade` | `L08-B02`; `L08-B04`; `L08-A01` itens 1 e 3 |
| `N0-U01-L08-AUD-003` | `gelo` | `L08-C01`; `L08-A01` item 2 |
| `N0-U01-L08-AUD-004` | `quilo` | `L08-C02`; `L08-A01` item 4 |
| `N0-U01-L02-AUD-006` | `sapo` | `L08-B04`; `L08-A01` item 3 |
| `N0-U01-L02-AUD-007` | `gato` | `L08-C01`; `L08-A01` item 2 |

Em `L08-B02`, `L08-C01`, `L08-B04`, `L08-C02` e no primeiro estágio de cada item de `L08-A01`, a forma escrita não deve aparecer antes do julgamento auditivo quando isso puder transformar a tarefa em reconhecimento visual. Depois da resposta auditiva, revelar as palavras como texto da interface e destacar apenas o começo relevante (`C`, `G`, `S` ou `QU`). Não introduzir classificação formal de `QU` nesta lição.

Usar as mesmas boas práticas do Lote L2. Validar também se os novos clipes combinam acusticamente com os reutilizados.

## Lote V01 — exemplos novos para a verificação integrada da Unidade 1

**Tipo:** `AUDIO_CONTROLADO`  
**Prioridade:** `ALTA`  
**Obrigatório para publicação:** `SIM`  
**Destino:** `Português Completo/Nível 0/Unidade 01/Verificação 01/Audio/`

Objetivo: fornecer exemplos auditivos novos para verificar as competências da Unidade 1 sem depender de memorização dos pares e palavras usados nas atividades centrais das lições.

| ID | Gravar | Localização pedagógica |
|---|---|---|
| `N0-U01-V01-AUD-001` | `foca` | `V01-Q02` primeiro par; `V01-Q08` segundo áudio |
| `N0-U01-V01-AUD-002` | `fita` | `V01-Q02` primeiro par |
| `N0-U01-V01-AUD-003` | `vaca` | `V01-Q02` segundo par; `V01-Q09` |
| `N0-U01-V01-AUD-004` | `rato` | `V01-Q02` segundo par |
| `N0-U01-V01-AUD-005` | `copo` | `V01-Q10` |
| `N0-U01-V01-AUD-006` | `cego` | `V01-Q10`; `V01-Q11` |
| `N0-U01-V01-AUD-007` | `sino` | `V01-Q11` |

Reutilizar o nome da letra F (`N0-U01-L03-AUD-006`) em `V01-Q08`. Não regravar.

Em `V01-Q02`, `V01-Q08`, `V01-Q09`, `V01-Q10` e `V01-Q11`, não mostrar a palavra escrita antes do julgamento auditivo quando a escrita puder revelar a resposta. Em `V01-Q10` e `V01-Q11`, revelar as palavras somente depois da primeira resposta para então verificar a relação entre som e escrita.

Produzir uma palavra por arquivo, sem frase introdutória. Usar português brasileiro claro, ritmo natural moderado, volume e condições acústicas consistentes entre os sete arquivos e, quando possível, compatíveis com os lotes L2 e L8. Não enfatizar artificialmente o som inicial.

Validar: palavra correta, alta inteligibilidade, ausência de cortes/ruído/efeitos, consistência de volume e ausência de pistas artificiais. Confirmar pedagogicamente que `foca/fita` oferecem começo sonoro claramente semelhante, `vaca/rato` claramente diferente, `copo/cego` evidenciam variação com C e `cego/sino` permitem perceber começo sonoro semelhante com escrita inicial diferente.

## Lote U2 L1 — percepção inicial de sílabas

**Família:** `N0-U02-L01-AUD-*`  
**Tipo:** `AUDIO_CONTROLADO`  
**Prioridade:** `ALTA`  
**Obrigatório para publicação:** `SIM`  
**Status:** `A_PRODUZIR`  
**Destino:** `Português Completo/Nível 0/Unidade 02/Lição 01/Audio/`

Objetivo: fornecer versões segmentadas de palavras e duas palavras novas em versões natural e segmentada para ensinar a percepção inicial de sílabas sem depender de pausas imprevisíveis do TTS.

| ID | Gravar | Função | Localização pedagógica |
|---|---|---|---|
| `N0-U02-L01-AUD-001` | `pa — to` | `pato` segmentado em duas sílabas | `L01-B02`; `L01-A01` item 1 |
| `N0-U02-L01-AUD-002` | `ma — la` | `mala` segmentado em duas sílabas | `L01-C01` segundo áudio |
| `N0-U02-L01-AUD-003` | `bo — la` | `bola` segmentado em duas sílabas | `L01-A01` item 2 |
| `N0-U02-L01-AUD-004` | `banana` | palavra inteira nova | `L01-B04` segundo exemplo |
| `N0-U02-L01-AUD-005` | `ba — na — na` | `banana` segmentado em três sílabas | `L01-B04` segundo exemplo; `L01-A01` item 3 |
| `N0-U02-L01-AUD-006` | `janela` | palavra inteira nova | `L01-C02` primeiro áudio |
| `N0-U02-L01-AUD-007` | `ja — ne — la` | `janela` segmentado em três sílabas | `L01-C02` segundo áudio; `L01-A01` item 4 |

Reutilizar, sem regravar:

| ID existente | Conteúdo | Uso na U2 L1 |
|---|---|---|
| `N0-U01-L02-AUD-001` | `pato` | `L01-B02` como palavra inteira |
| `N0-U01-L02-AUD-003` | `mala` | `L01-C01` primeiro áudio |
| `N0-U01-L02-AUD-005` | `sol` | `L01-B04` primeiro exemplo; `L01-A01` item 5 |

### Orientações de produção

Nos arquivos segmentados, o travessão do roteiro indica **pausa entre sílabas** e não deve ser pronunciado. Gravar as sílabas de forma clara e natural, mantendo a identidade sonora da palavra, com uma pausa curta e consistente entre partes — suficiente para a separação ser percebida, mas sem transformar cada sílaba em soletração ou fala artificialmente exagerada.

Quando possível, usar a mesma voz e condições acústicas do lote `N0-U01-L02-AUD-*`, porque `pato`, `mala` e `sol` serão reutilizados como palavras inteiras. Para `banana` e `janela`, a versão inteira e a segmentada devem ter voz, intensidade e ritmo-base compatíveis entre si.

Não dizer `duas sílabas`, `três sílabas`, nomes de letras ou qualquer explicação dentro do arquivo. Não adicionar palmas, bipes, música ou efeitos. Os pulsos visuais pertencem à interface e não ao áudio.

Não produzir imagem com `PA | TO`, `MA | LA` ou outra grafia segmentada para esta lição. A Lição 1 trabalha percepção auditiva; a relação sistemática entre sílaba ouvida e trecho escrito começa na Lição 3.

### Critérios de validação

Validar:

- conteúdo correto e português brasileiro claro;
- nenhuma sílaba ausente, fundida de forma indevida ou acrescida;
- pausas suficientemente perceptíveis e aproximadamente consistentes entre arquivos segmentados;
- pronúncia natural das partes, sem soletração e sem ênfase artificial;
- volume e ambiente consistentes;
- ausência de cortes, ruído, efeitos ou pistas extrapedagógicas;
- `pa — to`, `ma — la` e `bo — la` claramente percebidos como duas partes;
- `ba — na — na` e `ja — ne — la` claramente percebidos como três partes;
- versões inteira e segmentada de `banana` e `janela` reconhecíveis como a mesma palavra.

## Lote U2 L2 — segmentação e recombinação oral

**Família:** `N0-U02-L02-AUD-*`  
**Tipo:** `AUDIO_CONTROLADO`  
**Prioridade:** `ALTA`  
**Obrigatório para publicação:** `SIM`  
**Status:** `A_PRODUZIR`  
**Destino:** `Português Completo/Nível 0/Unidade 02/Lição 02/Audio/`

Objetivo: permitir que o aluno opere sobre as sílabas pela escuta, selecionando e ordenando fichas sonoras para separar palavras e juntando fichas para recuperar a palavra inteira, ainda sem apoio de grafia silabificada.

As fichas são **contextuais à palavra de origem**. Não reutilizar automaticamente uma gravação apenas porque duas sílabas teriam a mesma grafia. A realização sonora precisa ser compatível com a palavra-alvo e com a voz de referência usada no conjunto.

| ID | Gravar | Palavra de origem / função | Localização pedagógica |
|---|---|---|---|
| `N0-U02-L02-AUD-001` | `ga` | 1ª sílaba de `gato` | `L02-B02`; `L02-C01` como distrator; `L02-C02`; `L02-P01`; `L02-A01` itens 1 e 4; `L02-A02` item 3 como opção relacionada |
| `N0-U02-L02-AUD-002` | `to` | 2ª sílaba de `gato` | `L02-B02`; `L02-C02`; `L02-P01`; `L02-A01` itens 1 e 3; `L02-A02` item 3 como opção relacionada |
| `N0-U02-L02-AUD-003` | `ma` | 1ª sílaba de `mala` | `L02-C01`; `L02-A01` itens 1 e 2; `L02-A02` item 4 |
| `N0-U02-L02-AUD-004` | `la` | 2ª sílaba de `mala` | `L02-C01`; `L02-A01` item 2; `L02-A02` item 4 |
| `N0-U02-L02-AUD-005` | `pa` | 1ª sílaba de `pato` | `L02-B03`; `L02-C03`; `L02-A01` item 2 como distrator; `L02-A02` item 1 |
| `N0-U02-L02-AUD-006` | `to` | 2ª sílaba de `pato` | `L02-B03`; `L02-C03`; `L02-A02` item 1 |
| `N0-U02-L02-AUD-007` | `bo` | 1ª sílaba de `boneca` | `L02-A01` item 3; `L02-A02` item 2 |
| `N0-U02-L02-AUD-008` | `ne` | 2ª sílaba de `boneca` | `L02-A01` item 3; `L02-A02` item 2 |
| `N0-U02-L02-AUD-009` | `ca` | 3ª sílaba de `boneca` | `L02-A01` item 3; `L02-A02` item 2 |
| `N0-U02-L02-AUD-010` | `to` | 1ª sílaba de `tomate` | `L02-A01` item 4; `L02-A02` item 3 |
| `N0-U02-L02-AUD-011` | `ma` | 2ª sílaba de `tomate` | `L02-A01` item 4; `L02-A02` item 3 |
| `N0-U02-L02-AUD-012` | `te` | 3ª sílaba de `tomate` | `L02-A01` item 4; `L02-A02` item 3 |
| `N0-U02-L02-AUD-013` | `boneca` | palavra inteira nova | `L02-A01` item 3; `L02-A02` itens 2 e 3 como opção |
| `N0-U02-L02-AUD-014` | `tomate` | palavra inteira nova | `L02-A01` item 4; `L02-A02` itens 2 e 3 |

Reutilizar, sem regravar:

| ID existente | Conteúdo | Uso na U2 L2 |
|---|---|---|
| `N0-U01-L02-AUD-007` | `gato` | `L02-B02`; `L02-C02`; `L02-P01`; `L02-A01` item 1; opções de `L02-A02` |
| `N0-U01-L02-AUD-003` | `mala` | `L02-C01`; `L02-C02` como opção; `L02-A01` item 2; opções de `L02-A02` |
| `N0-U01-L02-AUD-001` | `pato` | `L02-B03`; `L02-C02` como opção; `L02-C03`; opções de `L02-A02` |

### Reutilização na U2 L3 — ligação entre sílaba ouvida e trecho escrito

A Lição 3 não cria novos áudios. Ela reutiliza as fichas contextuais deste lote e acrescenta a escrita apenas como texto/componentes da interface. Manter a contextualização por palavra definida na Lição 2; não substituir uma ficha por outra de grafia semelhante.

| ID | Uso adicional na U2 L3 |
|---|---|
| `N0-U02-L02-AUD-001` | mapa `GATO → GA`; `L03-B02`; `L03-A01` item 1; `L03-A02` item 1 |
| `N0-U02-L02-AUD-002` | mapa `GATO → TO`; `L03-B02`; `L03-A02` item 1 |
| `N0-U02-L02-AUD-003` | mapa de referência `MALA → MA` em `writtenExamples` |
| `N0-U02-L02-AUD-004` | mapa `MALA → LA`; `L03-C01`; `L03-A01` item 2 |
| `N0-U02-L02-AUD-005` | mapa `PATO → PA`; `L03-C02`; `L03-A01` item 3 |
| `N0-U02-L02-AUD-006` | mapa `PATO → TO`; `L03-C02` |
| `N0-U02-L02-AUD-007` | mapa `BONECA → BO`; `L03-B04`; `L03-A02` item 2 |
| `N0-U02-L02-AUD-008` | mapa `BONECA → NE`; `L03-B04`; `L03-A01` item 4; `L03-A02` item 2 |
| `N0-U02-L02-AUD-009` | mapa `BONECA → CA`; `L03-B04`; `L03-A02` item 2 |
| `N0-U02-L02-AUD-010` | mapa `TOMATE → TO`; `L03-C03`; `L03-A02` item 3 |
| `N0-U02-L02-AUD-011` | mapa `TOMATE → MA`; `L03-C03`; `L03-A02` item 3 |
| `N0-U02-L02-AUD-012` | mapa `TOMATE → TE`; `L03-C03`; `L03-A02` item 3 |
| `N0-U02-L02-AUD-013` | palavra inteira `boneca`; `L03-B04`; `L03-A01` item 4; `L03-A02` item 2 |
| `N0-U02-L02-AUD-014` | palavra inteira `tomate`; `L03-C03`; `L03-A02` item 3 |

Na U2 L3, os trechos `GA`, `TO`, `MA`, `LA`, `PA`, `BO`, `NE`, `CA`, `TE` e `SOL` são **texto da interface**, não arquivos de imagem. Quando uma tarefa medir a associação auditiva, ouvir primeiro e revelar/realçar a escrita depois, conforme o JSON da lição. O exemplo `SOL` existe para evitar a falsa inferência de que toda sílaba escrita possui duas letras; a sistematização da variedade de estruturas permanece reservada à Lição 5.

### Orientações de produção

Cada arquivo `AUD-001` a `AUD-012` contém **somente uma sílaba**, sem dizer o nome da palavra, sem explicação e sem soletração. Gravar a sílaba com a mesma voz de referência e com uma realização compatível com a palavra de origem indicada na tabela. O objetivo não é criar um banco abstrato de sílabas universais, mas fichas sonoras confiáveis para operar sobre palavras concretas desta lição.

Quando houver a mesma grafia em contextos diferentes, manter IDs distintos se a ficha estiver ligada a palavras diferentes. Por exemplo, os três registros de `to` pertencem respectivamente a `gato`, `pato` e `tomate`; a produção e a validação devem verificar a compatibilidade acústica com cada palavra, sem forçar uma pronúncia única artificial.

Para `boneca` e `tomate`, gravar a palavra inteira (`AUD-013` e `AUD-014`) na mesma sessão ou em condições equivalentes às fichas de suas sílabas. Variantes legítimas do português brasileiro não devem ser tratadas como erro por si só; dentro deste conjunto, porém, as fichas precisam combinar com a realização escolhida para a palavra inteira.

Usar ritmo natural, volume consistente e ausência de música/efeitos. Não adicionar silêncio excessivo no começo ou fim dos clips. Pequenas pausas entre fichas serão controladas pela interface quando uma sequência for reproduzida.

As fichas visuais do aplicativo são neutras: não colocar `GA`, `TO`, `MA` etc. em imagem ou asset. O roteiro escrito existe somente para produção e rastreabilidade.

### Critérios de validação

Validar:

- cada arquivo contém exatamente o conteúdo previsto;
- alta inteligibilidade, sem cortes, ruído ou efeitos;
- sílabas isoladas soam naturais o suficiente para serem reconhecidas como partes da palavra-alvo, sem virar nomes de letras ou soletração;
- cada ficha corresponde à posição indicada na palavra de origem;
- a sequência `AUD-001` + `AUD-002` é compatível com `gato`;
- `AUD-003` + `AUD-004` é compatível com `mala`;
- `AUD-005` + `AUD-006` é compatível com `pato`;
- `AUD-007` + `AUD-008` + `AUD-009` é compatível com `boneca` (`AUD-013`);
- `AUD-010` + `AUD-011` + `AUD-012` é compatível com `tomate` (`AUD-014`);
- volume e condições acústicas são consistentes o suficiente para que diferenças técnicas não entreguem respostas;
- as fichas contextuais não sejam substituídas entre palavras apenas por coincidência de grafia.

## Lote U2 L8 — imagens para significado familiar

**Família:** `N0-U02-L08-IMG-*`  
**Tipo:** `IMAGEM_CURADA`  
**Prioridade:** `ALTA`  
**Obrigatório para publicação:** `SIM`  
**Status:** `A_PRODUZIR`  
**Destino:** `Português Completo/Nível 0/Unidade 02/Lição 08/Imagem/`

Objetivo: fornecer referentes visuais concretos e inequívocos para que o aluno relacione uma palavra lida ao seu significado sem precisar ler outra definição como modalidade principal da atividade.

| ID | Referente | Brief visual | Localização pedagógica |
|---|---|---|---|
| `N0-U02-L08-IMG-001` | `gato` | um único gato doméstico claramente reconhecível, corpo ou silhueta suficientemente visível, sem outros animais e sem texto | `L08-C01`; `L08-A01`; `L08-A02` |
| `N0-U02-L08-IMG-002` | `pato` | um único pato claramente reconhecível, com bico e corpo visíveis, sem outros animais e sem texto | `L08-B03`; `L08-C01`; `L08-C02`; `L08-A01`; `L08-A02` |
| `N0-U02-L08-IMG-003` | `prato` | um único prato de mesa simples e claramente visível; evitar comida que vire o referente principal; sem texto | `L08-B03`; `L08-C02`; `L08-A01`; `L08-A02` |
| `N0-U02-L08-IMG-004` | `mala` | uma única mala de viagem fechada e claramente reconhecível, sem marcas e sem outros objetos dominantes | `L08-C03`; `L08-A01`; `L08-A02` |
| `N0-U02-L08-IMG-005` | `mesa` | uma única mesa simples, com tampo e apoio claramente identificáveis, sem objetos que dominem a cena e sem texto | `L08-C02`; `L08-C03`; `L08-A01`; `L08-A02` |
| `N0-U02-L08-IMG-006` | `uva` | um cacho de uvas claramente reconhecível, sem outras frutas concorrentes e sem texto | `L08-B04`; `L08-C03`; `L08-A01`; `L08-A02` |
| `N0-U02-L08-IMG-007` | `casa` | uma casa residencial simples vista de modo claramente reconhecível, sem placas, números ou texto | `L08-B02`; `L08-C01`; `L08-A01`; `L08-A02` |

### Orientações de produção

Produzir as sete imagens como **um conjunto visual coerente**. Pode ser fotografia, ilustração ou outra linguagem visual, desde que o referente seja mais importante do que o estilo e que todos os itens mantenham nível semelhante de detalhe, enquadramento e contraste.

Regras obrigatórias:

- não incorporar a palavra-alvo, letras, legendas, marcas d'água, placas ou pistas textuais;
- preferir um único referente principal e fundo simples;
- evitar objetos secundários que possam se tornar uma resposta concorrente;
- não depender de marca comercial, contexto cultural específico ou detalhe raro para reconhecer o item;
- `pato` e `prato` precisam ser imediatamente distinguíveis mesmo em miniatura;
- `mala` e `mesa` precisam ter silhuetas e enquadramentos suficientemente distintos;
- manter resolução e proporção adequadas para cartões de escolha responsivos em celular e desktop;
- não colocar borda, número da alternativa, letra A/B/C ou estado de correto/incorreto dentro do arquivo; isso pertence à interface.

A palavra-alvo permanece texto real da interface. Estas imagens representam **significado**, não a grafia.

Para acessibilidade, a implementação deve oferecer uma alternativa não visual por descrições semânticas curtas. Não usar o `alt` da própria imagem como uma resposta escondida que revele diretamente o item durante a avaliação visual.

### Critérios de validação

Validar:

- cada ID representa exatamente o referente previsto;
- ausência total de texto ou pistas ortográficas incorporadas;
- alta reconhecibilidade do referente em tamanho de cartão;
- ausência de ambiguidade relevante entre as sete imagens;
- consistência suficiente de estilo, iluminação/contraste e complexidade para que uma imagem não se destaque apenas pela produção;
- nenhum arquivo contém elemento visual que entregue sua posição como resposta correta;
- `gato`, `pato`, `prato`, `mala`, `mesa`, `uva` e `casa` são identificáveis sem depender do nome do arquivo;
- as imagens continuam claras em tela pequena e não exigem interpretação de detalhes finos.

## Entrega

Quando concluir um lote: salvar com o ID correspondente, colocar na pasta indicada, preservar o master de melhor qualidade e mudar/comunicar o status para `PRONTO_PARA_VALIDAR`.

Para áudio, o nome esperado é `ID.wav`. Para imagem curada, usar o ID como base do nome e preservar um formato mestre adequado; a versão de publicação poderá ser otimizada conforme a arquitetura sem mudar o ID lógico.

Mídia obrigatória pendente não bloqueia o restante do desenvolvimento, mas impede que a atividade dependente seja considerada pronta para publicação.