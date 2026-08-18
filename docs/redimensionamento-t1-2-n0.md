# T1.2 — Redimensionamento curricular controlado do N0

**Status:** `CONCLUÍDO / ARQUITETURA CONGELADA`

**Marco:** `CL-T1-FUNDAMENTOS-CLAROS`

**Origem da decisão:** `docs/auditoria-t1-1-porta-entrada-n0.md`

## Objetivo

Definir a nova porta de entrada do Nível 0 antes de reescrever as lições, preservando a ambição de saída do nível e corrigindo a escada de pré-requisitos que hoje faz o curso começar por conceitos abstratos.

Esta fase congela **responsabilidades, ordem pedagógica, identidades e regras de migração**. A nova autoria dos JSONs acontece em T1.6 e a migração técnica/catálogo/progresso em T1.9.

---

# 1. Decisão estrutural

O Nível 0 continua com **seis unidades**.

Não será criada uma `U0`, nem uma unidade preliminar artificial.

As Unidades 3–6 mantêm sua responsabilidade curricular atual. A mudança material concentra-se nas atuais U1 e U2.

Nova entrada:

```text
U1 — Letras e primeiros sons
→ reconhecer o que é letra
→ conhecer o alfabeto
→ perceber formas maiúsculas/minúsculas
→ reconhecer vogais/consoantes
→ distinguir letras de outros sinais
→ compreender organização visual básica
→ perceber sons em palavras
→ iniciar relação entre nome da letra e som

U2 — Sílabas e primeiras palavras
→ entender o que é sílaba
→ separar e juntar sílabas
→ ligar sílabas ouvidas à escrita
→ combinar partes para formar palavras
→ ler com apoio e reduzir o apoio
→ ligar palavra lida a significado
→ perceber que letras e sons podem variar
→ sintetizar, com exemplos concretos, diferença entre falar e escrever

U3 — Palavras, frases e sentido
→ permanece como ampliação para significado, frases e mensagens
```

A mudança central é:

```text
antes
fala/escrita abstrata
→ sons
→ alfabeto
→ relações letra/som complexas
→ só então sílabas

agora
letras concretas
→ formas/categorias/organização
→ primeiros sons
→ sílabas
→ palavras
→ sínteses mais abstratas
```

---

# 2. Responsabilidade do Nível 0

A responsabilidade global do N0 **não muda**.

O nível continua levando o aluno do zero até:

- reconhecimento funcional do sistema de escrita;
- leitura de palavras, frases e pequenos textos acessíveis;
- escrita de palavras, frases e pequenas mensagens;
- compreensão oral curta e uso cotidiano simples;
- pontuação/convenções básicas;
- revisão e reparo comunicativo introdutórios.

O problema detectado em T1.1 foi de **ordem de construção**, não de ambição de saída.

Portanto:

```text
N0 saída
→ preservada

N0 entrada e percurso U1/U2
→ redimensionados
```

---

# 3. Nova Unidade 1 — Letras e primeiros sons

## Objetivo interno

Construir uma base concreta do sistema de escrita, permitindo ao aluno reconhecer letras, alfabeto, formas, categorias introdutórias e organização visual, e iniciar a percepção de sons e relações simples entre o que ouve e as letras que já conhece.

## Princípio público

A unidade deve parecer, para o aluno, o começo real do curso:

> Primeiro vamos conhecer as letras e entender como elas aparecem na escrita. Depois começaremos a ouvir os sons que elas podem ajudar a representar.

O texto final para a UI será definido em T1.3/T1.6; esta frase é referência de intenção, não payload técnico congelado.

## Competências ao concluir

O aluno deve conseguir:

1. reconhecer visualmente as 26 letras como integrantes do alfabeto português;
2. identificar letras pelos nomes trabalhados, inclusive fora da ordem A–Z;
3. compreender que o alfabeto é um conjunto de letras com uma ordem convencional, sem depender de recitação decorada;
4. associar maiúscula e minúscula como formas da mesma letra;
5. reconhecer `A, E, I, O, U` como vogais e as demais letras como consoantes em nível introdutório;
6. distinguir letras de algarismos, pontuação e outros símbolos simples;
7. acompanhar direção predominante da escrita da esquerda para a direita e perceber função visual dos espaços;
8. perceber diferenças sonoras claras em palavras familiares;
9. compreender, por exemplos concretos, que o **nome de uma letra** e o **som que ela pode representar numa palavra** não são a mesma coisa;
10. realizar primeiras associações som–letra trabalhadas sem concluir que toda letra possui um único som.

## Limites

A U1 não exige ainda:

- segmentação sistemática em sílabas;
- leitura autônoma de palavras como competência central;
- formação de palavras por sílabas;
- explicação abstrata de fala × escrita;
- estudo da variação completa letra ↔ som;
- regras ortográficas;
- famílias silábicas;
- fonema como terminologia obrigatória;
- classificação fonética de vogais/consoantes;
- memorização perfeita do alfabeto como gate.

## Regra importante de progressão

Apresentar as 26 letras cedo **não significa bloquear o aluno até dominar todas perfeitamente**.

```text
alfabeto apresentado e praticado
+
reconhecimento sendo consolidado
→ sons e relações simples já podem ser trabalhados
```

Dificuldades específicas de letras podem alimentar revisão sem transformar o curso em treino A–Z antes de qualquer outra aprendizagem.

---

# 4. Arquitetura de lições da nova U1

A U1 passa a ter **7 lições + verificação integrada**.

A ordem pública é determinada por `order`/manifesto, não pelo número histórico embutido em IDs ou nomes de arquivo.

## Lição 1 — Letras e alfabeto

**Função:** ensinar explicitamente o que é uma letra e apresentar o alfabeto.

Base principal reutilizada:
- atual `N0-U01-L03 — Conhecendo o alfabeto`.

Mudança de autoria:
- começar com uma definição concreta de letra antes de dizer “alfabeto”;
- apresentar as 26 letras como conjunto de referência;
- manter reconhecimento em grupos/ordem embaralhada;
- não exigir recitação perfeita.

**Identidade recomendada:** preservar `N0-U01-L03`, pois o núcleo semântico continua sendo conhecimento das letras/alfabeto. A explicação “o que é uma letra” é uma base adicionada, não uma nova competência independente que invalide a evidência histórica.

## Lição 2 — Maiúsculas e minúsculas

Base:
- atual `N0-U01-L04`.

**Identidade:** preservar `N0-U01-L04`.

A lição deve falar em linguagem pública simples: a mesma letra pode aparecer em formas diferentes.

## Lição 3 — Vogais e consoantes

Base:
- parte da atual `N0-U01-L05`.

**Identidade:** preservar `N0-U01-L05` para o núcleo vogais/consoantes.

Mudança:
- retirar da mesma lição a carga de classificar simultaneamente números, pontuação e outros símbolos;
- manter a classificação apenas no nível introdutório necessário.

## Lição 4 — Letras, números e outros sinais

Base:
- segunda responsabilidade da atual `N0-U01-L05`.

**Identidade:** criar `N0-U01-L09`.

Motivo:
- a atual L05 junta duas aprendizagens diferentes;
- separá-las reduz quantidade de categorias novas simultâneas;
- `L09` está livre porque a verificação integrada não conta como lição.

Migração histórica:
- conclusão antiga de `N0-U01-L05` contém evidência para **ambos** os novos núcleos;
- T1.9 poderá, de forma conservadora e testada, derivar conclusão de `N0-U01-L09` quando houver evidência histórica suficiente da L05 antiga.

## Lição 5 — Como a escrita se organiza

Base:
- atual `N0-U01-L06`.

**Identidade:** preservar `N0-U01-L06`.

Foco:
- esquerda → direita;
- sequências;
- espaços;
- reprodução/ordenação simples a partir de modelo.

## Lição 6 — Ouvindo sons nas palavras

Base:
- atual `N0-U01-L02 — Percebendo os sons da fala`.

**Identidade:** preservar `N0-U01-L02`.

Mudança de linguagem:
- evitar começar por teoria sobre “fala”;
- usar palavras familiares e comparação auditiva concreta;
- explicar somente o necessário para preparar relações som–letra e sílabas.

Os áudios controlados `N0-U01-L02-AUD-*` permanecem semanticamente úteis.

## Lição 7 — Nome da letra e som: coisas diferentes

Base:
- atual `N0-U01-L07`.

**Identidade:** preservar `N0-U01-L07`.

Pré-requisitos novos:
- alfabeto/letras já apresentados;
- primeiros exemplos auditivos já percebidos.

A explicação deve partir de pares concretos; a distinção não aparece como metalíngua isolada.

---

# 5. Conteúdo retirado da U1

Duas responsabilidades deixam de fazer parte da conclusão da U1.

## Atual `N0-U01-L01 — Fala e escrita: duas formas relacionadas`

Não é descartada.

Novo papel:
- síntese posterior na U2, depois que o aluno já ouviu palavras, viu letras/sílabas e leu exemplos simples.

A identidade antiga **não pode** ser reutilizada para a primeira lição da nova U1.

Destino previsto:
- nova lição `N0-U02-L10`.

## Atual `N0-U01-L08 — Letras e sons: a relação pode variar`

Não é descartada.

Novo papel:
- ampliação depois das primeiras experiências reais de leitura de palavras.

Destino previsto:
- nova lição `N0-U02-L09`.

A ordem `L09` antes de `L10` é deliberada: primeiro o aluno observa variação em palavras concretas; depois fecha a unidade entendendo, em linguagem simples, que falar e escrever são formas relacionadas, mas diferentes.

---

# 6. Nova Unidade 2 — Sílabas e primeiras palavras

## Objetivo interno

Usar a base de letras e sons da U1 para ensinar sílabas como partes percebidas nas palavras, relacioná-las progressivamente à escrita e utilizá-las como apoio para formar, ler e reconhecer palavras simples, finalizando com sínteses introdutórias sobre relações entre sons, letras, fala e escrita.

## Competências ao concluir

O aluno deve conseguir:

1. perceber uma palavra falada como um todo e também em partes sonoras;
2. entender e usar funcionalmente o termo `sílaba`;
3. segmentar e recombinar palavras simples oralmente;
4. relacionar sílabas ouvidas a trechos escritos correspondentes em exemplos controlados;
5. reconhecer sílabas no começo, fim e em recorrências simples;
6. compreender que sílabas escritas podem ter organizações diferentes de letras;
7. ordenar/completar sílabas fornecidas para formar palavras conhecidas;
8. usar segmentação como apoio de leitura e reduzir esse apoio progressivamente;
9. relacionar palavra lida a significado familiar;
10. perceber, por exemplos, que uma mesma letra pode aparecer associada a sons diferentes e que relações entre som e escrita não são sempre um-para-um;
11. distinguir, de modo concreto e simples, uma mensagem apresentada pela fala de uma mensagem apresentada pela escrita, compreendendo que podem comunicar conteúdo relacionado sem serem a mesma forma.

## Limites

A U2 não exige:

- famílias silábicas como currículo;
- classificação por quantidade de sílabas;
- sílaba tônica;
- regras completas de divisão silábica;
- ortografia sistemática;
- leitura de frases como competência central;
- teoria linguística sobre fala/escrita;
- explicação formal de grafema/fonema;
- fluência ampla ou velocidade como critério.

---

# 7. Arquitetura de lições da nova U2

A U2 passa a ter **10 lições + verificação integrada**.

## Lição 1 — O que é uma sílaba?

Base:
- atual `N0-U02-L01 — Ouvindo as partes das palavras`.

**Identidade:** preservar `N0-U02-L01`.

Mudança principal:
- título público direto;
- manter a excelente sequência já existente: palavra inteira → partes ouvidas → nome `sílaba`.

## Lição 2 — Separando e juntando sílabas

Base/identidade:
- preservar `N0-U02-L02`.

## Lição 3 — Da sílaba ouvida à escrita

Base/identidade:
- preservar `N0-U02-L03`.

## Lição 4 — Sílabas no começo e no fim

Base:
- atual `N0-U02-L04`.

**Identidade:** preservar `N0-U02-L04`.

Recorrências entre palavras continuam como prática sem taxonomia excessiva.

## Lição 5 — Sílabas podem ter formas diferentes

Base/identidade:
- preservar `N0-U02-L05`.

## Lição 6 — Montando palavras

Base:
- atual `N0-U02-L06`.

**Identidade:** preservar `N0-U02-L06`.

## Lição 7 — Lendo por partes e depois a palavra inteira

Base:
- atual `N0-U02-L07`.

**Identidade:** preservar `N0-U02-L07`.

## Lição 8 — Palavra e significado

Base:
- atual `N0-U02-L08`.

**Identidade:** preservar `N0-U02-L08`.

## Lição 9 — Letras e sons podem variar

Base semântica:
- atual `N0-U01-L08`.

**Nova identidade:** `N0-U02-L09`.

A autoria deve usar palavras que o aluno agora já consegue observar/ler com apoio. Não introduzir regras ortográficas sistemáticas.

## Lição 10 — Falar e escrever: duas formas de comunicar

Base semântica:
- atual `N0-U01-L01`.

**Nova identidade:** `N0-U02-L10`.

Objetivo público de referência:

> Entender a diferença entre o que falamos e o que escrevemos.

A lição funciona como **síntese**, não como pré-requisito inaugural.

---

# 8. Pré-requisitos e progressão

## Dentro da U1

```text
Letras/alfabeto
→ maiúsculas/minúsculas
→ vogais/consoantes
→ outros sinais
→ organização da escrita
→ perceber sons
→ nome da letra ≠ som
```

A prática das letras continua transversalmente; não some depois da primeira lição.

## U1 → U2

A U2 pressupõe:

- contato real com as letras;
- reconhecimento funcional suficiente para acompanhar exemplos;
- direção/espaços básicos;
- primeiras experiências auditivas.

Não exige:

- recitação integral do alfabeto;
- todas as letras consolidadas sem erro;
- variação letra–som já dominada;
- teoria fala/escrita.

O produto mantém **soft gates**: dificuldades específicas de letras podem gerar revisão sem impedir automaticamente todo o percurso.

## U2 → U3

A U3 continua recebendo um aluno que já:

- reconhece palavras simples com apoio compatível;
- entende funcionalmente sílabas;
- começou a reduzir leitura por partes;
- liga palavras familiares a significado.

Portanto a responsabilidade atual da U3 permanece coerente.

---

# 9. Verificações integradas

A semântica das verificações U1/U2 muda materialmente; portanto **não reutilizar silenciosamente `V01` como se nada tivesse mudado**.

## Nova U1

Criar:

```text
N0-U01-V02
```

Cobrir:
- letras/alfabeto;
- maiúsculas/minúsculas;
- vogais/consoantes;
- letras versus outros sinais;
- direção/espaços;
- percepção sonora simples;
- nome da letra versus som;
- associações som–letra trabalhadas.

Não cobrir como requisito da nova U1:
- síntese fala × escrita;
- variação letra ↔ som mais ampla.

### Migração possível

A antiga `N0-U01-V01` cobria todos os núcleos da nova U1 e ainda incluía competências que serão movidas para U2.

Logo:

```text
V01 antiga concluída
→ pode ser evidência suficiente para V02 nova
```

Essa migração só será materializada/testada em T1.9.

## Nova U2

Criar:

```text
N0-U02-V02
```

Cobrir:
- competências silábicas e de palavra da antiga U2;
- variação letra–som em nível introdutório;
- síntese concreta fala × escrita.

### Migração possível

Para um aluno antigo, a conclusão da nova U2 só pode ser derivada com segurança quando houver evidência suficiente dos dois escopos históricos:

```text
N0-U02-V01 antiga concluída
+
evidência antiga de N0-U01-L01 / competência fala-escrita
+
evidência antiga de N0-U01-L08 / variação letra-som
→ candidato seguro a equivalência da nova U2-V02
```

Regra exata será implementada/testada em T1.9; não promover domínio por aproximação.

---

# 10. Matriz de identidade congelada

| Origem atual | Papel novo | Identidade T1.2 | Ação futura |
|---|---|---|---|
| `N0-U01-L01` fala/escrita | síntese final U2 | `N0-U02-L10` | novo ID + alias/migração conservadora |
| `N0-U01-L02` percepção sonora | U1 L6 | preservar | mudar ordem/título público, conteúdo simplificado |
| `N0-U01-L03` alfabeto | U1 L1 | preservar | adicionar base “o que é letra”, mudar ordem |
| `N0-U01-L04` formas | U1 L2 | preservar | simplificar título/copy |
| `N0-U01-L05` vogais + outros sinais | U1 L3 + U1 L4 | preservar `L05` para vogais; criar `L09` para outros sinais | split com regra de migração |
| `N0-U01-L06` organização | U1 L5 | preservar | mudar ordem |
| `N0-U01-L07` nome × som | U1 L7 | preservar | reescrever mais concretamente |
| `N0-U01-L08` variação som/letra | U2 L9 | `N0-U02-L09` | novo ID + alias/migração conservadora |
| `N0-U02-L01` partes/sílaba | U2 L1 | preservar | título público “O que é uma sílaba?” |
| `N0-U02-L02` separar/juntar | U2 L2 | preservar | simplificar linguagem |
| `N0-U02-L03` som→escrita | U2 L3 | preservar | manter núcleo |
| `N0-U02-L04` posição/recorrência | U2 L4 | preservar | manter núcleo |
| `N0-U02-L05` formatos | U2 L5 | preservar | manter núcleo |
| `N0-U02-L06` montar palavras | U2 L6 | preservar | título mais direto |
| `N0-U02-L07` leitura por partes | U2 L7 | preservar | título mais claro |
| `N0-U02-L08` significado | U2 L8 | preservar | título mais claro |
| `N0-U01-V01` | legado da U1 antiga | não sobrescrever | criar `N0-U01-V02` |
| `N0-U02-V01` | legado da U2 antiga | não sobrescrever | criar `N0-U02-V02` |

---

# 11. Competências estáveis e progresso

O manifesto atual de U1 já publica competências `N0-U01-C01`…`C08`.

T1.2 congela estas regras:

- competências cujo significado permanece igual podem manter ID;
- `N0-U01-C03` alfabeto, `C04` formas, `C06` organização, `C02` percepção sonora e `C07` nome×som são candidatas fortes a preservação;
- `C05` pode permanecer representando o núcleo vogais/consoantes, porque demonstração antiga do escopo mais amplo implica esse subconjunto;
- criar nova competência estável para `letras versus outros sinais` em vez de fingir que o split não ocorreu;
- `C01` fala/escrita e `C08` variação letra–som deixam a responsabilidade da nova U1 e devem ganhar identidades coerentes na U2; os IDs antigos ficam como legado, não como novos significados;
- nenhuma conclusão antiga é apagada;
- nenhuma competência nova recebe domínio apenas por semelhança nominal.

T1.9 produzirá o mapper executável sobre estas decisões.

---

# 12. Mídia

A arquitetura curricular não renumera mídia por posição.

## Preservar

- `N0-U01-L02-AUD-*` continua servindo à percepção sonora;
- `N0-U01-L03-AUD-*` continua servindo aos nomes das letras;
- mídias de U2 para sílabas/palavras continuam semanticamente válidas;
- `N0-U01-L08-AUD-*` pode ser reutilizado na futura `N0-U02-L09` mesmo mantendo ID histórico.

Regra:

```text
mediaId descreve um ativo pedagógico já reservado
≠ precisa seguir o novo número visual da lição
```

A fila será reconciliada em T1.9. Não produzir/regravar nada nesta fase.

---

# 13. Catálogo, manifests e deep links

Estado atual favorável:

- apenas `N0-U01` está publicado no catálogo v2 do N0;
- a U2 possui conteúdo autoral, mas ainda não possui manifesto público no catálogo;
- portanto a reorganização da U2 ocorre antes de sua expansão pública em P7.

T1.9 deverá:

- alterar título/ordem do manifesto U1;
- publicar manifesto U2 já na arquitetura nova;
- criar aliases/redirects para `N0-U01-L01` e `N0-U01-L08` quando suas identidades novas existirem;
- impedir que deep links antigos apontem silenciosamente para conteúdo semanticamente diferente;
- reconciliar `current`/retomada do progresso.

---

# 14. N0-EXIT-V01 e transição N0→N1

## Saída do N0

A verificação final do N0 continua adequada em sua ambição macro.

Ela deverá trocar, na materialização final, referências de carry-forward:

```text
U1/U2 V01 históricas
→ V02 novas ou regra explícita de compatibilidade
```

Não criar `N0-EXIT-V02` apenas por mudança de percurso se os clusters e a competência final permanecerem semanticamente os mesmos.

Se a autoria T1.6 revelar mudança material naquilo que a saída mede, reavaliar essa decisão antes de reutilizar o ID.

## Transição N0→N1

A conclusão continua:

```text
N0 saída
→ base funcional

N1
→ consolidação + sistematização + maior autonomia
```

O que fica obsoleto é apenas a afirmação histórica de que “não havia razão para reabrir o N0”. O N0 foi reaberto de forma dirigida por evidência de produto, sem alterar a competência esperada na entrada do N1.

---

# 15. Fonte canônica durante T1

Até T1.6 materializar os novos JSONs e consolidar novamente `docs/unidades-nivel-0.md` / `docs/licoes-nivel-0.md`, aplicar esta precedência para **U1/U2**:

```text
docs/redimensionamento-t1-2-n0.md
→ arquitetura nova congelada

docs/auditoria-t1-1-porta-entrada-n0.md
→ diagnóstico/justificativa

docs/unidades-nivel-0.md + docs/licoes-nivel-0.md
→ descrição histórica do conteúdo que será reaproveitado/reorganizado
```

Para U3–U6, os documentos curriculares existentes continuam canônicos sem alteração.

Isso evita reescrever duas vezes grandes documentos antes da autoria T1.6, sem deixar a arquitetura nova dependente da conversa.

---

# 16. Gate T1.2

O gate está satisfeito porque uma pessoa sem contexto agora consegue reconstruir:

- por que a entrada antiga estava errada;
- quais unidades mudam;
- o que U1 ensina primeiro;
- quando sílabas aparecem;
- quando fala/escrita e variação letra–som aparecem;
- quais lições são preservadas, divididas ou movidas;
- quais IDs não podem ser reutilizados silenciosamente;
- como verificações antigas e progresso devem ser tratados;
- quais mídias podem ser reaproveitadas.

Nova progressão legível:

```text
letra
→ alfabeto
→ formas
→ vogais/consoantes
→ outros sinais e organização
→ sons
→ nome da letra × som
→ sílaba
→ formar/juntar partes
→ palavras
→ leitura e significado
→ variação letra–som
→ falar × escrever como síntese
→ frases
```

**Próxima fase:** `T1.3 — contrato de linguagem para o aluno`.
