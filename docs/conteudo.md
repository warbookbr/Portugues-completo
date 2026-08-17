# Conteúdo do curso

## Objetivo deste documento

Este documento define como o conteúdo pedagógico do `Português Completo` deve ser planejado e apresentado.

O mapa geral dos níveis fica em `docs/mapa-curso.md`. O contrato técnico de publicação/runtime fica em `docs/contrato-conteudo.md`, e atividades/exercícios ficam em `docs/exercicios.md`.

A intenção aqui é garantir clareza, consistência e variedade sem transformar cada lição em uma interface saturada.

## Princípio central

```text
estrutura pedagógica consistente
+
recursos de mídia escolhidos conforme a necessidade
```

O aluno deve reconhecer o ritmo de uma lição sem sentir que todas as aulas são cópias umas das outras.

## Estrutura pedagógica de uma lição

Uma lição deve normalmente cumprir:

```text
Objetivo
→ Explicação
→ Exemplificação
→ Checagem de compreensão
→ Consolidação / resumo / prática
```

Essas funções são mais importantes que uma sequência rígida de componentes visuais.

Uma lição pode repetir ciclos de explicação, exemplo e checagem quando o assunto exigir.

## Regra de foco

Cada momento deve ter foco principal:

- ler;
- observar;
- ouvir;
- assistir;
- responder.

Evitar texto longo, vídeo, imagem, controles, caixas e exercícios competindo simultaneamente pela atenção.

Conteúdo extenso deve ser dividido em blocos progressivos.

## Blocos de conteúdo

Podem existir, por exemplo:

- texto;
- exemplo;
- imagem;
- vídeo;
- destaque/observação;
- `Saiba mais`;
- checagem rápida;
- atividade interativa;
- resumo;
- produções abertas;
- recursos semânticos gerados pela UI.

Nem todo bloco aparece em toda lição.

Os nomes pedagógicos específicos podem variar. O runtime normaliza blocos como `CONTENT` ou `ACTIVITY` conforme `docs/contrato-conteudo.md`, preservando `pedagogicalType` para especialização visual.

## Narração e TTS

A narração usa `speechSynthesis` do navegador/dispositivo conforme a arquitetura.

O texto continua fonte do conteúdo. Não é necessário manter um áudio correspondente para cada trecho narrado.

Preferir narração associada a blocos/trechos coerentes.

O aluno mantém controle sobre narração e configurações.

## Uso de imagens

Imagem pedagógica deve reduzir esforço de compreensão ou melhorar retenção.

Boas aplicações:

- associação palavra/objeto;
- diagramas;
- estruturas de frase;
- comparação de conceitos;
- organização visual;
- situação necessária para atividade.

Não inserir imagem apenas para preencher espaço.

Quando a UI consegue representar letras, tabelas, relações ou mapas de forma semântica e acessível, preferir `SEMANTIC_UI` a imagem rasterizada.

## Uso de vídeo

Vídeo é opcional.

Usar quando houver ganho claro em observar algo acontecendo, como:

- pronúncia;
- entonação;
- leitura expressiva;
- situação comunicativa;
- demonstração passo a passo;
- transformação visual relevante.

Evitar quando repete uma explicação que texto/exemplo/imagem transmitiria com mais clareza e rapidez.

Vídeos não devem iniciar automaticamente.

## Critério geral para mídia

Mídia deve melhorar pelo menos um destes pontos:

- compreensão;
- demonstração;
- memória;
- contextualização;
- percepção auditiva/visual;
- prática.

Se não houver ganho claro, preferir solução simples.

## Desenvolvimento independente da mídia final

A produção de material de apoio não precisa estar concluída para que o Modo Clássico seja implementado.

Regra de desenvolvimento:

```text
necessidade de mídia identificada
→ definir função e mediaId quando aplicável
→ registrar na fila de produção
→ implementar tudo que não depende do arquivo final
→ registrar a pendência e seu impacto
→ continuar o restante do curso
```

A ausência de imagem, vídeo ou áudio não deve ser convertida automaticamente em blocker da lição inteira, unidade inteira ou marco técnico.

### Sem dependência de mídia humana

Se texto, TTS ou UI semântica ensinam adequadamente, não existe pendência de produção humana.

### Mídia opcional

Se melhora a experiência, mas o objetivo continua plenamente ensinado/avaliado sem ela, sua ausência não impede homologação/publicação do conteúdo essencial.

### Mídia obrigatória para a atividade

Quando a mídia é o próprio estímulo necessário — por exemplo áudio controlado, imagem específica ou vídeo cuja informação precisa ser analisada — a infraestrutura pode ser implementada antes, mas a atividade não pode ser homologada pedagogicamente com um substituto inadequado.

```text
renderer + ligação por mediaId + estados + navegação
→ podem ficar implementados

estímulo final ainda ausente
→ homologação pedagógica da atividade permanece pendente
```

### Mídia obrigatória para publicação

Uma versão final ainda não publicada pode impedir declarar o trecho `PUBLICAVEL` sem necessariamente invalidar testes técnicos já realizados.

### Rastreabilidade

O impacto concreto sobre implementação, homologação e publicação é registrado em `docs/estado-implementacao-classico.md`.

A produção do arquivo, status de produção e critérios ficam em `producao-midia/README.md` e `producao-midia/FILA-MIDIA.md`.

Não duplicar a fila inteira no registro do produto; vincular pelo `mediaId` e registrar somente o impacto.

### Placeholder

Placeholder pode ser usado para desenvolver layout, renderer, loading/erro e integração, mas não deve ser tratado como mídia final nem como evidência de homologação quando a percepção do estímulo real é pedagogicamente necessária.

## Checagem rápida versus exercício

### Checagem rápida

Acontece durante a explicação e confirma entendimento imediato.

Características:

- curta;
- baixo atrito;
- foco em ideia recém-exposta;
- normalmente baixo peso no progresso;
- feedback imediato quando apropriado.

No contrato de `docs/exercicios.md`, tende a usar `role: CHECK`.

### Exercício/prática

É prática estruturada da lição/unidade.

Pode participar de:

- feedback;
- progresso;
- revisão;
- domínio/evidência;
- repetição futura;
- gamificação somente quando o modo Gamificado estiver ativo.

XP não é requisito do exercício nem do modo Clássico.

Os tipos de interação, avaliação e evidência estão definidos em `docs/exercicios.md`.

## Produções abertas

Texto livre, interpretação, argumentação, síntese, edição, reflexão e oralidade não devem ser reduzidos a palavras-chave só para permitir correção automática.

O conteúdo precisa declarar:

- o que deve ser observado;
- critérios;
- limites;
- se resposta deve ser registrada;
- se validação automática é permitida;
- quando avaliador confiável é necessário.

O runtime converte isso em política de avaliação/evidência conforme `docs/exercicios.md` e `docs/progresso.md`.

## Feedback

O conteúdo pode fornecer feedback determinístico local quando a resposta é fechada.

Para tarefas estruturadas/complexas, o feedback deve se ligar a critérios.

A IA, quando usada, segue `docs/avaliacao-ia.md` e não transforma automaticamente uma produção aberta em domínio demonstrado.

## Informações secundárias

Curiosidades, aprofundamentos, exceções prematuras ou detalhes históricos podem usar blocos opcionais:

```text
Saiba mais
Curiosidade
Aprofundamento
```

Nunca esconder conhecimento necessário dentro de conteúdo opcional.

## Exemplos de composição

Lição simples:

```text
Objetivo
Texto
Exemplo
Checagem
Resumo
```

Com apoio visual:

```text
Objetivo
Texto
Recurso visual
Exemplo
Checagem
Resumo
```

Ligada à oralidade:

```text
Objetivo
Explicação curta
TTS ou áudio controlado conforme necessidade
Prática
Checagem
Resumo
```

São composições possíveis, não templates obrigatórios.

## Clareza da interface

Ao criar lição, avaliar:

1. qual ideia precisa ser compreendida agora?
2. qual forma mais simples de ensiná-la?
3. alguma mídia realmente melhora isso?
4. há elementos demais competindo?
5. existe oportunidade adequada de prática/checagem?
6. a evidência exigida mede a competência declarada?

Evitar extremos:

```text
curso seco
→ paredes de texto

curso saturado
→ mídia e controles sem necessidade
```

## Relação entre as fontes

```text
docs/mapa-curso.md
→ o que precisa ser ensinado

docs/conteudo.md
→ como transformar isso em experiência pedagógica

docs/exercicios.md
→ como atividades interagem, avaliam e produzem evidência

docs/contrato-conteudo.md
→ como os JSONs são publicados/normalizados

docs/progresso.md
→ como evidência vira progresso/domínio/revisão

docs/estado-implementacao-classico.md
→ o que foi implementado/homologado e quais dependências ainda impedem conclusão/publicação
```

## Regra para evolução

Novos componentes ou mídias só se tornam padrão quando resolvem necessidade pedagógica recorrente.

Novo `pedagogicalType` não deve implicar automaticamente nova primitiva de renderer; reutilizar o contrato existente sempre que a interação for equivalente.

Mídia pendente deve ser tratada como dependência rastreável, não como motivo para abandonar o desenvolvimento independente nem como permissão para declarar falso estado de conclusão.
