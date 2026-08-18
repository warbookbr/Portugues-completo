# Contrato de linguagem para o aluno

**Status:** `CANÔNICO`

**Origem:** T1.3 — `CL-T1-FUNDAMENTOS-CLAROS`

## Objetivo

Definir como o `Português Completo` transforma objetivos curriculares precisos em explicações que um aluno consiga entender sem conhecer previamente a linguagem técnica usada por autores, schemas ou documentos pedagógicos.

Este contrato vale para:

- abertura de lição;
- explicações;
- exemplos;
- instruções de atividades;
- feedback;
- títulos e subtítulos;
- mensagens de progresso/revisão quando tiverem conteúdo pedagógico.

## Regra central

```text
precisão interna
≠
complexidade pública
```

O projeto mantém duas linguagens legítimas e separadas.

### Linguagem interna

Pode ser técnica e compacta porque serve para autoria, competência, avaliação e implementação.

Exemplos:

- objetivos curriculares;
- competências;
- critérios de evidência;
- limites;
- nomes de estados;
- regras de normalização.

### Linguagem do aluno

Deve ser **clara, completa e simples**.

Isso significa:

- clara: o aluno entende qual ideia está sendo ensinada e o que deve fazer;
- completa: não omite uma informação necessária apenas para deixar a frase curta;
- simples: usa a forma mais fácil de entender que continue correta.

```text
simples
≠ raso
≠ infantilizado
≠ impreciso
```

A linguagem pública não precisa esconder complexidade que seja realmente objeto da lição. Ela precisa **construir essa complexidade em etapas**.

---

# 1. Objetivo interno ≠ objetivo público

Nunca usar automaticamente `objective`, competência, critério ou outro texto técnico como introdução visível apenas porque ele já existe no conteúdo autoral.

Exemplo:

```text
OBJETIVO INTERNO
Distinguir a realização sonora da língua de sua representação escrita e compreender que fala e escrita podem transmitir mensagens relacionadas sem serem a mesma coisa.

OBJETIVO PÚBLICO
Entender a diferença entre o que falamos e o que escrevemos.
```

O primeiro continua útil para autoria e avaliação. O segundo é o que orienta o aluno.

## Regra de fallback

Quando não existir uma apresentação pública adequada:

```text
não existe student-facing copy segura
→ não imprimir automaticamente objective técnico
→ usar fallback humano neutro ou tratar como pendência de apresentação
```

A solução técnica exata pertence à T1.5, mas o comportamento semântico está congelado aqui.

---

# 2. Progressão de explicação

Para um conceito novo, preferir a sequência:

```text
algo concreto/conhecido
→ exemplo
→ nome do conceito
→ explicação simples
→ prática curta
→ ampliação/nuance
```

Essa ordem é uma heurística pedagógica, não um template rígido de HTML.

Quando outra sequência for comprovadamente mais clara, ela pode ser usada. O que não pode acontecer é apresentar uma abstração ou termo técnico como se o aluno já soubesse o que significa.

## Exemplo — sílaba

Evitar começar assim:

> A sílaba é uma unidade fonológica constituinte da palavra.

Preferir construir:

> Ouça a palavra **pato**. Podemos falar devagar: **pa — to**. Ouvimos duas partes. Cada uma dessas partes é chamada de **sílaba**.

Depois dessa base, explicações mais precisas podem ser acrescentadas conforme o nível exigir.

---

# 3. Zero pressupostos no início do N0

No começo do Nível 0, não presumir que o aluno compreende apenas porque o termo é comum para uma pessoa escolarizada:

- letra;
- alfabeto;
- vogal;
- consoante;
- sílaba;
- palavra;
- frase;
- texto;
- fala e escrita como conceitos linguísticos.

Se um termo é parte do que está sendo ensinado, a própria progressão deve apresentá-lo.

Exemplo:

```text
não
→ "As vogais do alfabeto são..." como primeira frase se letra/alfabeto ainda não foram construídos

sim
→ mostrar letras
→ explicar o que chamamos de letra
→ apresentar o conjunto chamado alfabeto
→ depois introduzir a categoria vogal
```

---

# 4. Uma ideia principal por vez

Preferir frases e blocos em que a relação principal seja fácil de seguir.

Evitar frases que tentam simultaneamente:

- definir o conceito;
- comparar com outro conceito;
- apresentar exceção;
- antecipar conteúdo futuro;
- justificar a terminologia.

Quando tudo isso for necessário, dividir em camadas.

## Exemplo

Difícil:

> A escrita representa a fala por convenções gráficas cuja correspondência com os sons não é necessariamente biunívoca.

Melhor, no início:

> Usamos letras para escrever palavras.
>
> As letras podem ajudar a representar os sons que ouvimos. Mais adiante, você vai perceber que essa relação nem sempre funciona do mesmo jeito.

A versão simples preserva a verdade sem exigir a terminologia da versão técnica.

---

# 5. Termo novo deve ser explicado perto de onde aparece

Não depender de o aluno:

- lembrar uma definição distante;
- abrir um glossário para entender a frase principal;
- inferir o significado pelo contexto quando o próprio termo é objeto da aprendizagem.

Boa sequência:

```text
exemplo
→ termo destacado
→ explicação imediata
```

Glossário e `Saiba mais` podem complementar, nunca substituir uma definição necessária.

---

# 6. Títulos devem dizer do que a lição trata

No início do curso, preferir títulos concretos e reconhecíveis.

Preferir:

- `Letras e alfabeto`;
- `Maiúsculas e minúsculas`;
- `Vogais e consoantes`;
- `O que é uma sílaba?`;
- `Montando palavras`;
- `Falar e escrever: duas formas de comunicar`.

Evitar títulos que só fazem sentido depois de conhecer a teoria ou que escondem o assunto em formulação institucional.

O título pode ganhar maior precisão/sofisticação nos níveis avançados quando isso fizer parte natural do domínio esperado.

---

# 7. Abertura da lição

A primeira tela deve responder rapidamente:

> O que eu vou entender ou conseguir fazer aqui?

Forma canônica:

```text
← Voltar para a unidade

Lição

<Título claro>

<objetivo público simples>

[ Começar lição ]
```

O objetivo público normalmente cabe em uma ou duas frases curtas. Não existe limite mecânico de caracteres: clareza e suficiência importam mais que uma métrica arbitrária.

Não mostrar nessa tela:

- objetivo curricular técnico;
- competências internas;
- códigos/IDs;
- stepper da lição;
- atividade seguinte;
- critérios de evidência;
- explicação longa;
- conteúdo institucional.

---

# 8. Explicação clara, completa e simples

Uma explicação está pronta para o aluno quando:

1. diz o que a coisa é ou o que está acontecendo;
2. usa um exemplo quando ele ajuda a compreender;
3. define termos novos;
4. não depende de conteúdo ainda não ensinado;
5. inclui a nuance necessária para não ensinar uma regra falsa;
6. deixa detalhes secundários para depois quando não forem necessários agora.

## Simplicidade com precisão

Não simplificar assim:

> Cada letra tem um som.

Isso é fácil, mas ensina uma regra falsa.

Preferir:

> As letras podem representar sons nas palavras. Vamos começar por alguns exemplos simples. Depois você vai ver que uma mesma letra pode aparecer com sons diferentes.

O texto é um pouco maior, mas continua simples e é mais correto.

---

# 9. Exemplos devem chegar cedo

Se uma definição fica mais fácil depois de ver/ouvir algo, não obrigar o aluno a ler primeiro uma explicação abstrata longa.

Preferir:

```text
ver/ouvir exemplo
→ notar uma característica
→ dar nome
→ explicar
```

No começo do N0, exemplos familiares e concretos têm prioridade sobre explicações metalinguísticas.

Nos níveis avançados, exemplos continuam importantes, mas o aluno pode lidar com abstrações maiores porque os pré-requisitos já foram construídos.

---

# 10. Instruções de atividade

A instrução deve dizer diretamente:

```text
o que observar/ouvir/ler
+
o que fazer
```

Preferir:

> Ouça a palavra e escolha quantas partes você percebe.

Evitar:

> Analise o estímulo apresentado e indique a alternativa correspondente à segmentação percebida.

Quando houver mais de uma ação, apresentá-las na ordem de execução.

Não esconder uma etapa considerada “óbvia”.

---

# 11. Feedback

Feedback não deve ser somente:

- `Correto`;
- `Errado`;
- `Tente novamente`.

Quando houver valor pedagógico, explicar **por que**.

Exemplo:

```text
Resposta: fala
Feedback: Isso é fala porque a mensagem chegou pelos sons de uma voz.
```

Para erro:

```text
não humilhar
não punir
não usar jargão
→ mostrar a pista/conceito relevante
→ permitir nova tentativa quando a atividade permitir
```

Em questões que participam de verificação sem feedback imediato, respeitar o contrato de avaliação; clareza não autoriza revelar gabarito prematuramente.

---

# 12. Evitar linguagem de professor/sistema na fala pública

Revisar especialmente expressões como:

- `realização sonora`;
- `representação gráfica`;
- `unidade fonológica`;
- `estrutura sintática`;
- `evidência de conclusão`;
- `critério de domínio`;
- `modalidade principal`;
- `estímulo avaliativo`;
- `validação automática`.

Essas expressões podem ser corretas internamente. Só devem aparecer para o aluno quando forem realmente conteúdo ensinado naquele nível e tiverem sido apresentadas adequadamente.

---

# 13. Não infantilizar o aluno

Ser simples não significa falar como se o aluno fosse criança.

Evitar:

- diminutivos decorativos;
- entusiasmo artificial em toda frase;
- mascotes/onomatopeias sem função;
- elogios exagerados por ações triviais;
- metáforas infantis quando uma explicação direta é mais clara.

O mesmo contrato serve para criança, adolescente ou adulto iniciante porque prioriza acessibilidade cognitiva e respeito.

---

# 14. Profundidade cresce com o nível

A regra de clareza continua em N1–N4, mas o vocabulário pode evoluir porque o curso constrói os pré-requisitos.

```text
termo já ensinado e necessário
→ pode ser usado normalmente

termo novo e importante
→ apresentar/definir

termo técnico desnecessário para o objetivo atual
→ preferir linguagem comum
```

Não manter artificialmente todo o curso com vocabulário de N0.

---

# 15. Exemplos de transformação

## Fala e escrita

Interno:

> Distinguir a realização sonora da língua de sua representação escrita e compreender que fala e escrita podem transmitir mensagens relacionadas sem serem a mesma coisa.

Aluno:

> Entender a diferença entre o que falamos e o que escrevemos.

## Alfabeto

Interno:

> Reconhecer visualmente as 26 letras do alfabeto, associá-las a seus nomes e perceber que existe uma ordem alfabética convencional.

Aluno:

> Conhecer as letras do alfabeto, aprender seus nomes e reconhecê-las mesmo quando aparecem fora de ordem.

## Vogais e consoantes

Interno:

> Reconhecer A, E, I, O e U como vogais e classificar introdutoriamente as demais letras como consoantes.

Aluno:

> Conhecer as cinco vogais e aprender quais letras chamamos de consoantes.

## Sílaba

Interno:

> Perceber, em palavras faladas acessíveis, que uma palavra pode ser ouvida como uma sequência de partes sonoras e introduzir o termo sílaba.

Aluno:

> Perceber que podemos ouvir uma palavra em partes e aprender que essas partes são chamadas de sílabas.

---

# 16. Checklist de autoria

Antes de publicar qualquer texto pedagógico para o aluno:

```text
[ ] O aluno sabe o que vai aprender ou fazer?
[ ] Há termo usado antes de ser ensinado?
[ ] Existe palavra comum mais simples e igualmente correta?
[ ] A frase tenta ensinar ideias demais ao mesmo tempo?
[ ] Falta um exemplo que tornaria a ideia concreta?
[ ] O exemplo aparece cedo o suficiente?
[ ] Algum detalhe foi removido e isso criou uma regra falsa?
[ ] O texto parece escrito para professor/documentação em vez de para aluno?
[ ] A instrução diz exatamente o que fazer?
[ ] O feedback explica o conceito quando isso ajuda?
[ ] A linguagem respeita o aluno sem infantilizar?
```

Se alguma resposta indicar problema, revisar antes de homologar.

---

# 17. Checklist especial do início do N0

```text
[ ] A lição pressupõe saber o que é letra, alfabeto, vogal, consoante, sílaba, palavra ou frase?
[ ] Se pressupõe, isso já foi realmente ensinado antes?
[ ] O primeiro contato é concreto?
[ ] Existe exemplo antes de uma abstração difícil?
[ ] Uma categoria está sendo ensinada junto de categorias demais?
[ ] O aluno precisa memorizar tudo para poder avançar, sem necessidade pedagógica?
[ ] Uma nuance posterior está ocupando o lugar de um fundamento inicial?
```

O início do N0 deve construir uma escada. Não usar o conhecimento de um adulto alfabetizado como medida do que é “óbvio”.

---

# 18. Relação com currículo e implementação

Este contrato não altera autoridade pedagógica:

```text
objective / competencies / evidence
→ continuam definindo o que deve ser ensinado e observado

student-facing copy
→ define como isso é comunicado ao aluno
```

Não simplificar a fala pública mudando silenciosamente o alvo curricular.

Não alterar o alvo curricular para caber numa frase curta.

Quando houver incompatibilidade real entre objetivo e explicação simples, revisar a arquitetura pedagógica em vez de mascarar o problema na UI.

---

# 19. Relação com T1

- T1.1 identificou o problema de entrada e linguagem;
- T1.2 congelou a nova progressão U1/U2;
- **T1.3 congela este contrato de linguagem**;
- T1.5 definirá o campo/normalização técnica para a apresentação pública;
- T1.6 aplicará o contrato na nova autoria;
- T1.7 renderizará a abertura limpa no frontend;
- T1.10 validará a clareza no produto final.

## Gate T1.3

T1.3 está concluída quando este contrato é canônico e uma nova autoria consegue distinguir, sem depender da conversa:

```text
objetivo técnico
≠ objetivo público

simples
≠ incompleto

claro
≠ infantilizado

progressão
→ concreto → exemplo → conceito → prática → ampliação
```
