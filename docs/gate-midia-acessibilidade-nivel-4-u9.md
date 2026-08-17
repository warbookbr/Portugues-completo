# Gate de mídia e acessibilidade — Nível 4, Unidade 9

## Objetivo

Definir se a `N4-U09 — Literatura, multimodalidade e autoria intermedial/digital` exige mídia humana controlada para ensinar/avaliar as competências previstas em M4.

O gate evita dois erros:

```text
criar mídia apenas para variedade
```

ou

```text
fingir que uma descrição avalia um fenômeno sensorial real quando esse fenômeno é justamente o alvo
```

## Decisão para o M4

**SATISFEITO — nenhuma nova mídia humana controlada é obrigatória para a arquitetura atual.**

As competências previstas podem ser ensinadas e avaliadas com recursos semânticos acessíveis quando o alvo é relação, organização, edição, proveniência, adaptação ou distribuição de informação.

## Recursos aprovados

### Texto/literatura

- `UI_RENDERED_ANNOTATED_TEXT`;
- `UI_RENDERED_INTERTEXT_LINKS`;
- `UI_RENDERED_INTERPRETATION_EVIDENCE_MAP`.

### Composição visual/dados/interface

- `UI_RENDERED_ACCESSIBLE_VISUAL_COMPOSITION`;
- `UI_RENDERED_SEMANTIC_PAGE_LAYOUT`;
- `UI_RENDERED_DATA_RELATION`;
- `UI_RENDERED_INTERFACE_FLOW`;
- valores/legendas em texto real no DOM.

### Sequência, edição e adaptação

- `UI_RENDERED_FRAME_SEQUENCE`;
- `UI_RENDERED_EDITING_TIMELINE`;
- `UI_RENDERED_SEQUENCE_REORDER`;
- `UI_RENDERED_MULTIMODAL_TIMELINE`.

### Proveniência/circulação

- `UI_RENDERED_SOURCE_LINEAGE`;
- `UI_RENDERED_PUBLICATION_CHAIN`;
- metadados estruturados e navegáveis.

### Áudio verbal

TTS é permitido quando pequenas diferenças de voz não alteram a resposta correta.

```text
TTS_OK
→ significado verbal é o alvo
```

## Lição crítica — N4-U9-L8

A L8 trabalha áudio/vídeo, sequência, montagem e timing.

No M4, ela pode medir de forma válida:

- ordem de quadros;
- presença/ausência de trecho;
- relação entre fala, legenda e imagem descrita;
- duração informada;
- posição de corte;
- elipse e reorganização;
- efeito de retirar/adicionar contexto;
- reconhecimento de que determinada pergunta **não pode ser respondida sem mídia real**.

Exemplo de representação suficiente:

```text
0–3 s
imagem descrita: porta fechada
fala: “ninguém entrou”

3–5 s
corte

5–8 s
imagem descrita: sala vazia
legenda: “20 minutos depois”
```

A tarefa pode discutir ordem, elipse, relação verbal/visual e o que a edição permite concluir.

## Quando o gate deve ser reaberto

Se o M5 passar a exigir como evidência decisiva:

1. timbre real;
2. prosódia específica;
3. ritmo musical real;
4. atuação/expressão corporal;
5. movimento contínuo cuja dinâmica seja o objeto;
6. timing exato de corte que só possa ser percebido em reprodução audiovisual;
7. contraste auditivo/visual cuja descrição destrua a própria competência.

Nesse caso:

```text
necessidade pedagógica real
→ mediaId permanente
→ FILA-MIDIA.md
→ roteiro/produção
→ validação
→ equivalente acessível compatível
→ publicação
```

## Regra de acessibilidade

1. Cor nunca é a única pista decisiva.
2. Ordem visual deve existir também na estrutura semântica.
3. Texto em composição visual deve existir como texto real.
4. Dados/gráficos precisam de valores ou relações acessíveis.
5. Quadros e sequências precisam ser percorríveis sem depender de apontamento visual.
6. Informação verbal em áudio precisa de política de transcrição compatível com o alvo.
7. Se disponibilizar transcrição antes da tentativa destruir uma competência auditiva genuína, não esconder acessibilidade por improviso: a atividade deve ser redesenhada ou usar mídia controlada e protocolo adequado.
8. Produção multimodal do aluno deve permitir equivalente textual/semântico das pistas decisivas.

## Autoria e direitos

O M5 deve priorizar:

- textos literários autorais do curso;
- composições e sequências geradas semanticamente pela interface;
- relações intertextuais internas/controladas;
- materiais cuja autoria/proveniência possa ser ensinada sem depender de reprodução extensa de obras protegidas.

## Regra de publicação atual

Para o M4 aprovado:

```text
productionQueueRequired = false
publicationDependency = nenhuma nova mídia humana obrigatória
```

Isso pode mudar apenas se o M5 alterar o alvo pedagógico para um fenômeno sensorial real não substituível.

## Relação com a fila de mídia

Nenhum `mediaId` novo deve ser criado agora, porque não existe demanda humana obrigatória concreta.

A regra de `producao-midia/README.md` permanece:

```text
necessidade real primeiro
→ ID depois
→ produção só então
```
