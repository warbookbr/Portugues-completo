# Gate audiovisual e acessibilidade — Nível 3, Unidade 9

## Objetivo

Definir quais recursos multimodais da `N3-U09 — Literatura, intertextualidade e mídia crítica` exigem mídia humana controlada e quais podem ser representados de modo fiel e acessível pela própria interface.

Este gate existe para impedir dois erros:

```text
criar imagem/áudio/vídeo apenas por variedade visual
```

ou

```text
avaliar uma pista sensorial sem oferecer forma acessível equivalente
```

## Decisão para o M5 atual

**Nenhuma nova mídia humana controlada é obrigatória para a autoria curricular da N3-U09.**

O conteúdo será construído de modo que toda competência avaliável possa ser observada por componentes estruturados e acessíveis da interface:

- texto literário integralmente disponível em texto;
- sequências visuais representadas por quadros/cartões com descrição semântica;
- composição/layout representados por estrutura de página com ordem de leitura explícita;
- montagem representada por sequência reordenável de planos/quadros descritos;
- relação entre fala, legenda e imagem representada por trilhas sincronizadas em uma linha do tempo textual;
- efeitos sonoros ou música, quando discutidos, descritos como elementos fornecidos no material e **nunca usados como única pista para resposta correta**;
- TTS apenas para leitura/narração quando prosódia específica não determina a resposta;
- hyperlinks e navegação representados por componentes de interface acessíveis.

Consequência:

```text
N3-U09 pode chegar a M5
sem IMG/AUD/VID humanos novos
```

## Quando mídia humana se tornaria obrigatória

Criar `mediaId` e registrar na fila antes da produção se uma futura atividade passar a exigir, como evidência decisiva:

1. distinguir duas entonações cujo contraste só exista no áudio;
2. interpretar ritmo musical ou timbre que não possa ser representado sem perder o alvo;
3. reconhecer movimento real cuja dinâmica não seja recuperável por sequência de estados;
4. avaliar montagem audiovisual quando o tempo exato dos cortes for a própria competência;
5. interpretar atuação/expressão corporal quando uma descrição textual eliminaria justamente o fenômeno que se quer avaliar.

Nesses casos:

```text
mediaId
→ roteiro/contrato
→ FILA-MIDIA
→ produção
→ validação
→ publicação
```

A autoria curricular das lições seguintes não deve ser bloqueada desnecessariamente.

## Recursos de interface aprovados

### Texto e literatura

- `UI_RENDERED_ANNOTATED_TEXT`
- `UI_RENDERED_INTERTEXT_LINKS`
- `UI_RENDERED_INTERPRETATION_EVIDENCE_MAP`

### Imagem/layout sem arquivo visual externo

- `UI_RENDERED_SEMANTIC_PAGE_LAYOUT`
- `UI_RENDERED_ACCESSIBLE_VISUAL_COMPOSITION`
- `UI_RENDERED_CAPTION_IMAGE_RELATION`

Cada elemento visual decisivo precisa ter rótulo/descrição equivalente no DOM.

### Sequência e montagem

- `UI_RENDERED_FRAME_SEQUENCE`
- `UI_RENDERED_EDITING_TIMELINE`
- `UI_RENDERED_SEQUENCE_REORDER`

Os quadros são estruturas semânticas, por exemplo:

```text
quadro 1 — corredor vazio; porta fechada
quadro 2 — mão aproxima-se da maçaneta
quadro 3 — corte para relógio marcando 22:15
quadro 4 — porta já aberta
```

Isso permite discutir ordem, elipse, antecipação, contraste e efeito de montagem sem fingir que o estudante viu um vídeo inexistente.

### Trilhas verbal/sonora

- `UI_RENDERED_MULTIMODAL_TIMELINE`
- `UI_RENDERED_AUDIO_TRACK_DESCRIPTION`

Exemplo:

```text
0–4 s   imagem: praça vazia
        narração: “A cidade acorda cedo.”
        som indicado no material: tráfego distante

4–8 s   imagem: ônibus lotado
        legenda: “6h10”
```

Se a resposta depender do som real, esta representação deixa de ser suficiente e o item passa a exigir áudio controlado.

## Regras de acessibilidade

1. Cor nunca é única pista decisiva.
2. Ordem visual precisa ter equivalente estrutural/semântico.
3. Texto em “imagem” deve existir como texto real na interface.
4. Informação de gráfico deve estar disponível como valores/relações textuais.
5. Sequência visual deve poder ser percorrida por teclado e leitor de tela.
6. Legenda/transcrição não pode ser escondida quando ela é necessária para acesso ao conteúdo verbal.
7. Se oferecer transcrição antes da resposta destruir a competência auditiva, o item exige mídia sonora controlada e política específica; não se resolve escondendo acessibilidade.
8. Nenhuma avaliação deve exigir identificar pessoa real, marca ou obra externa por imagem.

## Literatura e direitos autorais

Os textos literários centrais produzidos para a unidade serão **autorais do curso** ou suficientemente breves/originais para evitar dependência de obras protegidas externas.

Intertextualidade será ensinada por textos didáticos relacionados entre si, permitindo rastrear transformação, alusão e resposta sem reproduzir obra protegida extensa.

## Regra de publicação

Para a N3-U09 atual:

```text
productionQueueRequired = false
publicationDependency = nenhuma nova mídia humana obrigatória
```

Isso só muda se uma lição futura for alterada para depender de fenômeno audiovisual real não substituível pelos recursos acima.

## Relação com outras fontes do projeto

Este gate complementa:

- `docs/conteudo.md`;
- `producao-midia/README.md`;
- `producao-midia/FILA-MIDIA.md`;
- `.ChatGPT/skills/course-content-design/SKILL.md`;
- `docs/licoes-nivel-3-u9.md`.

A regra continua sendo:

```text
mídia pendente ≠ desenvolvimento bloqueado
```

mas também:

```text
pista sensorial decisiva sem recurso adequado = atividade inválida
```
