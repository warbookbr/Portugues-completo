# Fila de produção de mídia

Lista oficial das mídias pedagógicas que precisam ser produzidas manualmente. Ler `producao-midia/README.md` antes de produzir.

## Resumo

| Lote | Uso | Prioridade | Obrigatório | Status |
|---|---|---|---|---|
| `N0-U01-L02-AUD-*` | U1 L2; reutiliza na L7 | ALTA | SIM | A_PRODUZIR |
| `N0-U01-L03-AUD-*` | U1 L3; reutiliza na L7 | ALTA | SIM | A_PRODUZIR |
| `N0-U01-L08-AUD-*` | U1 L8 | NORMAL | SIM | A_PRODUZIR |

Os exercícios ainda não foram dimensionados. Quando forem, estes mesmos IDs serão ligados às posições exatas; não renumerar.

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

Gravar **uma palavra por arquivo**, uma única vez. Usar português brasileiro claro, mesma voz, ritmo natural moderado, volume/ambiente consistentes, sem música, efeitos ou ênfase artificial no som observado. Arquivo: `ID.wav`.

Validar: palavra correta, alta inteligibilidade, sem cortes, sem ruído perceptível e sem pistas de volume/entonação entre arquivos.

## Lote L3 — nomes das 26 letras

**Tipo:** `AUDIO_CONTROLADO`  
**Destino:** `Português Completo/Nível 0/Unidade 01/Lição 03/Audio/`

Objetivo: servir de referência fixa quando o aluno ouvir o nome isolado e precisar identificar a letra.

| ID final | Roteiro em ordem A–Z |
|---|---|
| `N0-U01-L03-AUD-001` a `026` | `a`; `bê`; `cê`; `dê`; `e`; `efe`; `gê`; `agá`; `i`; `jota`; `cá`; `ele`; `eme`; `ene`; `o`; `pê`; `quê`; `erre`; `esse`; `tê`; `u`; `vê`; `dáblio`; `xis`; `ípsilon`; `zê` |

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

Contrastes planejados: `casa/cidade`, `gato/gelo`, `sapo/cidade` e `casa/quilo`. O aluno deve perceber a variação; não precisa explicar ainda as regras ortográficas.

Usar as mesmas boas práticas do Lote L2. Validar também se os novos clipes combinam acusticamente com os reutilizados.

## Entrega

Quando concluir um lote: salvar como `ID.wav`, colocar na pasta indicada, preservar o master de melhor qualidade e mudar/comunicar o status para `PRONTO_PARA_VALIDAR`.

Mídia obrigatória pendente não bloqueia o restante do desenvolvimento, mas impede que a atividade dependente seja considerada pronta para publicação.
