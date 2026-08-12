# Conteúdo do curso

## Objetivo deste documento

Este documento define como o conteúdo pedagógico do `Português Completo` deve ser planejado e apresentado.

Ele não define ainda todas as unidades do curso. O mapa geral dos níveis fica em `docs/mapa-curso.md`.

A intenção aqui é garantir clareza, consistência e variedade sem transformar cada lição em uma interface saturada.

## Princípio central

A estrutura pedagógica deve ser consistente, mas a composição de mídia deve ser flexível.

Em outras palavras:

```text
estrutura pedagógica consistente
+
recursos de mídia escolhidos conforme a necessidade
```

O aluno deve reconhecer o ritmo de uma lição sem sentir que todas as aulas são cópias umas das outras.

## Estrutura pedagógica de uma lição

Uma lição deve normalmente cumprir estas funções:

```text
Objetivo
→ Explicação
→ Exemplificação
→ Checagem de compreensão
→ Consolidação / resumo / prática
```

Essas funções são mais importantes do que uma sequência rígida de componentes visuais.

Uma lição pode repetir ciclos de explicação, exemplo e checagem quando o assunto exigir.

## Regra de foco

Cada momento da lição deve ter um foco principal.

O aluno deve estar principalmente:

- lendo;
- observando;
- ouvindo;
- assistindo;
- ou respondendo.

Evitar apresentar texto longo, vídeo, imagem, controles, caixas de destaque e exercícios competindo simultaneamente pela atenção.

Uma lição pode ser extensa em conteúdo sem parecer visualmente pesada se for dividida em blocos curtos e progressivos.

## Blocos de conteúdo

A arquitetura deve permitir diferentes tipos de bloco, por exemplo:

- texto;
- exemplo;
- imagem;
- vídeo;
- destaque ou observação;
- `Saiba mais`;
- checagem rápida;
- atividade interativa;
- resumo.

Nem todo tipo de bloco precisa aparecer em toda lição.

Os tipos definitivos e seus campos JSON serão formalizados conforme forem implementados.

## Narração e TTS

A narração usa `speechSynthesis` do navegador/dispositivo, conforme definido na arquitetura.

O texto continua sendo a fonte do conteúdo. Não é necessário manter um arquivo de áudio correspondente para cada trecho narrado.

Preferir narração associada a blocos ou trechos coerentes, em vez de uma narração única e muito longa para toda a página.

O aluno deve manter controle sobre a narração e suas configurações.

## Uso de imagens

Imagem pedagógica deve ser utilizada quando reduzir esforço de compreensão ou melhorar retenção.

Boas aplicações incluem:

- associação entre palavra e objeto;
- diagramas;
- estruturas de frase;
- comparação de conceitos;
- organização visual;
- ilustrações que esclarecem uma situação;
- material necessário para uma atividade.

Não inserir imagem apenas para preencher espaço ou deixar a página mais decorativa.

Imagens do conteúdo podem ser hospedadas externamente conforme as regras de mídia definidas em `docs/arquitetura.md`.

Quando adequado, uma imagem deve poder possuir legenda e descrição.

## Uso de vídeo

Vídeo é opcional.

Não existe regra de que cada unidade ou lição precise conter vídeo.

O critério é pedagógico: o vídeo deve justificar o tempo e o espaço que ocupa.

Vídeo tende a ser útil quando existe ganho claro ao observar algo acontecendo, por exemplo:

- pronúncia;
- entonação;
- leitura expressiva;
- comparação de formas de falar;
- demonstração passo a passo;
- transformação de uma frase ou texto ao longo de uma explicação;
- situação comunicativa cuja dinâmica seja importante;
- explicação visual que seria mais difícil de compreender apenas em texto.

Vídeo tende a atrapalhar quando:

- repete uma explicação curta que seria compreendida mais rapidamente por texto;
- é incluído apenas para variar a interface;
- interrompe desnecessariamente o fluxo da lição;
- aumenta a carga cognitiva sem acrescentar compreensão;
- exige vários minutos para transmitir uma ideia simples.

Regra prática:

> Se o mesmo conteúdo puder ser compreendido com mais clareza e rapidez por texto, exemplo ou imagem, não adicionar vídeo.

Vídeos não devem iniciar automaticamente.

Quando necessário, uma pequena introdução deve explicar ao aluno por que aquele vídeo vale a pena ser assistido.

## Critério geral para mídia

Mídia não entra para deixar a aula bonita.

Ela deve melhorar pelo menos um destes pontos:

- compreensão;
- demonstração;
- memória;
- contextualização;
- percepção auditiva ou visual;
- prática.

Se não houver ganho claro, preferir a solução mais simples.

## Checagem rápida versus exercício

Uma `checagem` e um `exercício` têm papéis diferentes.

### Checagem rápida

Acontece durante a explicação.

Serve para confirmar que o aluno acompanhou a ideia antes de continuar.

Características esperadas:

- curta;
- baixo atrito;
- foco em uma ideia recém-explicada;
- sem necessidade de grande peso no sistema de progresso;
- pode oferecer feedback imediatamente.

### Exercício

Acontece como prática estruturada da lição ou unidade.

Pode participar de:

- acertos e erros;
- XP;
- progresso;
- revisão;
- domínio de competências;
- repetição futura.

Os formatos de exercício serão definidos separadamente em `docs/exercicios.md`.

## Informações secundárias

Conteúdo complementar não deve interromper quem está aprendendo o essencial.

Informações como curiosidades, aprofundamentos, exceções prematuras ou detalhes históricos podem utilizar blocos opcionais, por exemplo:

```text
Saiba mais
Curiosidade
Aprofundamento
```

Esses recursos não devem esconder conhecimento necessário para atingir o objetivo da lição.

## Exemplos de composição

Uma lição simples pode ser:

```text
Objetivo
Texto
Exemplo
Checagem
Resumo
```

Uma lição que exige apoio visual pode ser:

```text
Objetivo
Texto
Imagem
Exemplo
Checagem
Resumo
```

Uma lição ligada à oralidade pode ser:

```text
Objetivo
Explicação curta
TTS
Vídeo
Prática
Checagem
Resumo
```

Esses exemplos são composições possíveis, não templates obrigatórios.

## Clareza da interface

Ao criar uma lição, avaliar sempre:

1. Qual é a ideia que o aluno precisa compreender neste momento?
2. Qual é a forma mais simples de ensiná-la com clareza?
3. Alguma mídia realmente melhora essa explicação?
4. Há elementos demais competindo pela atenção?
5. O aluno tem uma oportunidade de verificar se compreendeu?

O objetivo é evitar dois extremos:

```text
curso seco
→ paredes de texto

curso saturado
→ vídeo + imagem + áudio + animação + caixas em toda tela
```

O projeto deve buscar conteúdo dinâmico com apresentação limpa.

## Relação com o mapa do curso

`docs/mapa-curso.md` responde principalmente:

> O que precisa ser ensinado?

Este documento responde principalmente:

> Como esse conteúdo deve ser transformado em uma experiência de aprendizagem clara?

Antes de produzir muitas aulas, o nível correspondente deve estar suficientemente planejado no mapa do curso.

## Regra para evolução

As regras deste documento podem evoluir conforme as primeiras unidades forem testadas.

Novos componentes ou mídias só devem se tornar padrão quando resolverem uma necessidade pedagógica recorrente, e não apenas porque são tecnicamente possíveis.
