# Produção de mídia

Esta pasta é a área operacional para produção e curadoria das mídias pedagógicas do **Português Completo**.

Ela existe para separar duas responsabilidades:

```text
planejamento e desenvolvimento do curso
→ podem continuar mesmo quando uma mídia ainda não foi produzida

produção humana de mídia
→ recebe uma fila clara, com roteiro, destino e critérios de validação
```

A fonte oficial das demandas de produção é `producao-midia/FILA-MIDIA.md`.

O impacto de uma mídia pendente sobre o desenvolvimento, homologação e publicação do Modo Clássico é registrado em `docs/estado-implementacao-classico.md`.

## O que fica aqui

Esta pasta contém instruções e rastreamento de produção. Ela não deve receber os arquivos pesados de áudio, vídeo ou imagem apenas para servir como área de trabalho.

```text
producao-midia/
├── README.md       → manual permanente
└── FILA-MIDIA.md   → fila viva do que precisa ser produzido
```

As regras pedagógicas gerais de uso de mídia continuam em `docs/conteudo.md`.

As regras técnicas de providers, carregamento e mídia externa continuam em `docs/arquitetura.md`.

O estado operacional do produto não deve ser duplicado na fila: a fila responde **como está a produção da mídia**; `docs/estado-implementacao-classico.md` responde **o que essa ausência/presença bloqueia no produto**.

## Princípio central

Cada mídia curada recebe um **ID permanente** antes de ser produzida.

Exemplo:

```text
N0-U01-L03-AUD-001
```

Estrutura:

```text
N0   → Nível 0
U01  → Unidade 1
L03  → Lição 3
AUD  → tipo da mídia
001  → sequência da mídia desse tipo dentro da lição
```

Tipos iniciais:

```text
AUD → áudio controlado
VID → vídeo curado
IMG → imagem ou ilustração pedagógica curada
```

O ID é a identidade lógica da mídia. Ele não deve mudar porque o arquivo foi regravado, corrigido, recodificado ou substituído por uma versão melhor.

```text
ID permanente
→ continua igual

arquivo físico
→ pode ganhar nova versão até ser validado
```

## Regra de rastreabilidade

Toda mídia solicitada precisa responder claramente:

```text
o que produzir
+
por que produzir
+
onde será usado
+
qual é o ID
+
qual é o roteiro ou conteúdo
+
como produzir
+
onde entregar
+
como será validado
```

Se alguém precisar conhecer a conversa que originou a tarefa para entender o que deve produzir, a ficha está incompleta.

## TTS versus áudio controlado

O TTS do navegador/dispositivo continua sendo adequado para narração, leitura de instruções, leitura de frases e outros usos em que pequenas diferenças entre vozes não alteram o objeto pedagógico.

Quando características específicas do som forem parte do que o aluno precisa perceber ou quando a resposta correta depender precisamente do estímulo auditivo, usar mídia controlada e previamente validada.

```text
TTS_OK
→ voz variável do dispositivo é aceitável

AUDIO_CONTROLADO
→ o estímulo auditivo precisa ser fixo e validado
```

Regra de segurança pedagógica:

```text
TTS variável do dispositivo
não deve determinar sozinho
uma resposta correta ou incorreta
em tarefas de discriminação sonora sensível
```

Uma demanda classificada como `TTS_OK` normalmente não entra na fila humana de produção. A fila é usada principalmente quando existe algo a ser criado ou curado.

## Criticidade para publicação

Toda ficha informa:

```text
Obrigatório para publicação: SIM / NÃO
```

### `SIM`

A mídia é necessária para que a atividade ensine ou avalie corretamente aquilo que se propõe, ou para que a versão pública final cumpra o contrato aprovado.

Exemplo: áudio controlado em uma atividade de discriminação sonora.

A implementação técnica pode continuar usando o ID como dependência, mas o escopo afetado não deve ser considerado pronto para publicação enquanto a mídia obrigatória estiver pendente.

Quando a mídia for o próprio estímulo necessário, a atividade também não deve ser marcada como homologada pedagogicamente antes de existir material apropriado para essa homologação.

### `NÃO`

A mídia melhora a experiência, mas sua ausência não invalida pedagogicamente a atividade.

Exemplo possível: vídeo complementar cuja mesma ideia essencial já esteja ensinada de maneira suficiente por outro recurso.

## Impacto da mídia no estado do produto

A fila de produção e o estado do produto são relacionados, mas diferentes.

Uma mídia pode estar `A_PRODUZIR` enquanto o renderer que a consumirá já está tecnicamente implementado.

No registro do Clássico, usar a classificação apropriada:

```text
SEM_DEPENDENCIA
MIDIA_OPCIONAL_PENDENTE
MIDIA_PENDENTE_NAO_BLOQUEANTE
MIDIA_OBRIGATORIA_PARA_ATIVIDADE
MIDIA_OBRIGATORIA_PARA_PUBLICACAO
MIDIA_PRONTA_PARA_VALIDAR
MIDIA_VALIDADA
MIDIA_PUBLICADA
```

Exemplo:

```text
FILA-MIDIA
N0-U01-L03-AUD-001 → A_PRODUZIR

ESTADO DO PRODUTO
renderer de áudio → IMPLEMENTADO
atividade de discriminação → homologação BLOQUEADA_POR_DEPENDENCIA
publicação da atividade → BLOQUEADA
restante da unidade → pode continuar
```

Essa separação impede que uma pendência local paralise o desenvolvimento inteiro e impede também que infraestrutura pronta seja confundida com atividade pedagogicamente pronta.

## Estados da produção

Usar apenas estes estados inicialmente:

```text
ROTEIRO_PRONTO
A_PRODUZIR
EM_PRODUCAO
PRONTO_PARA_VALIDAR
VALIDADO
PUBLICADO
```

Significado:

- `ROTEIRO_PRONTO` — demanda especificada, mas ainda não colocada na produção ativa;
- `A_PRODUZIR` — pode ser produzida seguindo a ficha;
- `EM_PRODUCAO` — produção iniciada;
- `PRONTO_PARA_VALIDAR` — arquivo entregue e aguardando validação;
- `VALIDADO` — conteúdo e qualidade aprovados;
- `PUBLICADO` — versão validada já está disponível no local usado pelo curso.

Não usar `PUBLICADO` apenas porque o arquivo foi colocado no Drive. Publicado significa que a versão validada está ligada ao conteúdo que o aplicativo entrega.

Quando o estado de produção mudar de forma que remova ou crie blocker real no Modo Clássico, atualizar também `docs/estado-implementacao-classico.md` na PR/alteração de produto correspondente.

## Prioridades

Usar inicialmente:

```text
ALTA
NORMAL
BAIXA
```

- `ALTA` — bloqueia publicação de conteúdo próximo ou é necessária para uma etapa crítica;
- `NORMAL` — demanda regular;
- `BAIXA` — complementar ou distante da próxima entrega.

Prioridade e obrigatoriedade são conceitos diferentes. Uma mídia obrigatória de uma unidade futura pode ter prioridade normal ou baixa enquanto ainda não estamos próximos de publicá-la.

## Estrutura recomendada no Google Drive

O Drive é a área de produção, curadoria e preservação dos arquivos de trabalho/originais.

Estrutura recomendada:

```text
Português Completo/
├── Nível 0/
│   ├── Unidade 01/
│   │   ├── Lição 01/
│   │   │   ├── Audio/
│   │   │   ├── Video/
│   │   │   └── Imagem/
│   │   ├── Lição 02/
│   │   └── ...
│   └── ...
└── Originais/
```

Não é necessário criar antecipadamente todas as pastas vazias. Criá-las quando a primeira mídia correspondente for solicitada é suficiente.

A ficha em `FILA-MIDIA.md` informa o destino esperado no Drive.

## Nome dos arquivos

O nome deve começar pelo ID permanente.

Exemplos:

```text
N0-U01-L03-AUD-001.wav
N0-U01-L04-VID-001.mp4
N0-U01-L04-IMG-001.png
```

Durante produção, versões intermediárias podem usar sufixos locais, por exemplo:

```text
N0-U01-L03-AUD-001-v2.wav
```

Mas a versão validada deve permanecer claramente associada ao ID lógico.

Evitar nomes como:

```text
audio-final.wav
audio-final-agora-vai.wav
video-aula-3-novo.mp4
```

## Relação com o aplicativo

O curso deve depender do **ID lógico da mídia**, não da organização manual das pastas de produção.

Conceitualmente:

```text
conteúdo da lição
→ referencia mediaId

mediaId
→ aponta para versão publicada validada
```

A forma técnica final de publicação e provider segue `docs/arquitetura.md` e pode evoluir sem exigir que o roteiro pedagógico ou o ID da mídia sejam reescritos.

A pasta do Drive usada para produção não deve ser tratada como uma API de descoberta do curso. O aplicativo não deve varrer pastas procurando arquivos pelo nome.

## Como uma demanda nasce

Ao dimensionar ou detalhar uma lição:

```text
necessidade pedagógica
→ decidir se mídia realmente ajuda
→ decidir TTS ou mídia curada
→ criar ID quando houver produção humana
→ registrar ficha em FILA-MIDIA.md
→ conteúdo/implementação independente pode continuar usando o ID
→ registrar impacto no estado do produto quando a implementação chegar a esse escopo
```

Não criar mídia apenas para tornar a aula visualmente mais variada.

## Ficha obrigatória de uma mídia

Cada item da fila deve conter, quando aplicável:

1. ID e título curto;
2. status;
3. prioridade;
4. tipo/classificação;
5. se é obrigatório para publicação;
6. localização pedagógica exata;
7. referência lógica (`mediaId`);
8. objetivo pedagógico;
9. roteiro/conteúdo;
10. orientações de produção;
11. arquivo esperado;
12. destino no Drive;
13. critérios de validação;
14. instruções de entrega.

Campos que não façam sentido para determinado tipo podem ser marcados como `não se aplica`, mas não devem ser omitidos de forma que deixe a tarefa ambígua.

## Boas práticas para áudio

Para áudio controlado:

- usar português brasileiro compatível com o objetivo pedagógico;
- priorizar inteligibilidade natural;
- manter volume consistente entre estímulos comparados;
- evitar música, efeitos e ruído quando não tiverem função pedagógica;
- evitar ênfase artificial que entregue a resposta;
- preservar pausas solicitadas no roteiro;
- não cortar início ou final de palavras;
- quando estímulos forem comparados, preferir condições de gravação equivalentes;
- manter o arquivo original de maior qualidade disponível para futuras conversões.

Quando pronúncia, contraste ou realização sonora forem o próprio conteúdo, a validação pedagógica é obrigatória antes da publicação.

## Boas práticas para vídeo

- usar vídeo apenas quando observar movimento, sequência, entonação, situação ou demonstração trouxer vantagem real;
- seguir exatamente o objetivo e roteiro da ficha;
- evitar introduções longas e elementos decorativos sem função;
- manter texto em tela legível;
- evitar música competindo com fala;
- não depender apenas do áudio para transmitir informação essencial quando legendas ou apoio visual forem necessários;
- preservar um original de boa qualidade para futuras conversões.

A ficha deve indicar duração ou faixa de duração quando isso for pedagogicamente importante.

## Boas práticas para imagem

- priorizar clareza do objeto pedagógico;
- evitar elementos visuais que entreguem acidentalmente uma resposta;
- evitar texto incorporado na imagem quando o texto puder ficar no conteúdo da aplicação;
- preservar legibilidade em telas menores;
- prever descrição/alt text quando a imagem carregar informação relevante;
- evitar imagem meramente decorativa dentro da fila pedagógica.

## Correções e substituições

Se uma mídia validada precisar ser corrigida:

```text
mesma função pedagógica
→ manter o mesmo ID
→ produzir nova versão física
→ validar novamente
→ substituir a versão publicada
```

Criar um novo ID apenas quando a nova mídia passar a representar outra função ou outro estímulo pedagógico, e não apenas uma correção técnica.

## Fluxo de trabalho para quem produz

1. Abrir `FILA-MIDIA.md`.
2. Procurar itens `A_PRODUZIR`, priorizando `ALTA`.
3. Ler a ficha completa antes de começar.
4. Produzir exatamente o que foi especificado.
5. Salvar usando o ID indicado.
6. Colocar no destino de Drive indicado na ficha.
7. Marcar/comunicar que o item está `PRONTO_PARA_VALIDAR`.
8. Não considerar a mídia publicada antes da validação e ligação ao conteúdo final.

## Regra final

```text
mídia pendente
≠ desenvolvimento bloqueado

mídia obrigatória para uma atividade
→ bloqueia homologação pedagógica daquela atividade

mídia obrigatória para publicação
→ bloqueia PUBLICAVEL naquele escopo

pendência local
≠ blocker global automático
```

O objetivo deste sistema é permitir que planejamento, implementação e produção de mídia avancem em paralelo sem perder clareza, rastreabilidade ou qualidade pedagógica.
