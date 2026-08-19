# T1.9 — Integração atômica da nova entrada N0

**Estado deste registro:** `FORMA FINAL EM VALIDAÇÃO`

## Escopo integrado

A promoção T1.9 é tratada como uma única mudança coerente:

```text
nova autoria física N0-U01/N0-U02
+ manifests V02
+ content/course.json
+ contentRevision t1-n0-entry-v2
+ migração local antes do estado ativo
+ migração de baseline/Gist antes do merge de sync
+ aliases dos deep links históricos
+ reconciliação conservadora de mídia
```

Não existe estado suportado em que o progresso já tenha sido migrado para a revisão T1 enquanto a aplicação continua deliberadamente usando o catálogo histórico.

## Catálogo esperado

O slice publicado pelo catálogo passa a conter:

```text
N0-U01 — Letras e primeiros sons
N0-U02 — Sílabas e primeiras palavras
N4-U09 — Literatura, multimodalidade, autoria intermedial e digital
```

A presença no catálogo não transforma unidade com mídia humana pendente em publicável. `N0-U01` e `N0-U02` mantêm blockers locais explícitos; `N4-U09` preserva seu estado anterior.

## Compatibilidade histórica

Fontes históricas ainda necessárias para fixtures, migração ou auditoria podem existir sob `legacy/`, mas não aparecem como lições ativas do manifest.

Aliases de rota preservados:

```text
#/unidade/N0-U01/licao/N0-U01-L01
→ #/unidade/N0-U02/licao/N0-U02-L10

#/unidade/N0-U01/licao/N0-U01-L08
→ #/unidade/N0-U02/licao/N0-U02-L09
```

O alias substitui a URL pela rota canônica; ele não mantém uma segunda identidade acadêmica para a mesma lição.

## Progresso

A ativação usa `T1_N0_CONTENT_REVISION = t1-n0-entry-v2`.

Ordem obrigatória:

```text
cache pré-T1
→ backup
→ mapper conservador
→ ProgressService

Gist/baseline pré-T1
→ mapper conservador
→ comparação/merge
→ baseline e remoto canônicos
```

Revisão futura/desconhecida permanece fail-closed. Evidência herdada pela migração não pode ganhar `CONSOLIDADA` apenas porque uma fonte antiga foi materializada em mais de um contexto novo.

## Mídia

T1.9 não gera nem renumera assets automaticamente. A fila canônica marca como obsoleta para a publicação atual a mídia exclusiva da antiga `N0-U01-L01`, preserva famílias semanticamente reutilizadas e mantém blockers somente nos estímulos que realmente dependem de produção/validação humana.

## Gates para homologar T1.9

A branch final precisa passar, sem tooling temporário de promoção:

- estrutura e JSON;
- schemas/fixtures;
- catálogo e descoberta;
- normalização e autoria staged reprodutível;
- mapper de progresso e wiring local/Gist;
- políticas/merge de progresso;
- Gist/sync;
- renderer do catálogo novo;
- smoke DOM da primeira entrada, retomada e aliases antigos;
- screenshots desktop, largura intermediária e mobile;
- inspeção visual das telas N0 afetadas.

Somente depois desses gates este documento pode ser considerado evidência de uma T1.9 homologada; até lá, ele registra a forma que está sendo validada.
