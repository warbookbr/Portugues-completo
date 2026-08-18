# Estado de implementação do Modo Clássico

## Função

Registro operacional canônico do Modo Clássico. `docs/roadmap-produto.md` define a sequência macro; este arquivo define o **cursor exato**.

Regra permanente:

```text
implementado tecnicamente
≠ homologado
≠ publicável
```

## Cursor operacional

```text
Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco transversal ativo: T1 — Fundamentos claros e experiência de lição
Plano: docs/plano-fundamentos-claros.md
Skill: .ChatGPT/skills/fundamentos-claros/SKILL.md
Subfase ativa: T1.6 — nova autoria das unidades/lições iniciais
Lote U1: CONCLUÍDO / VALIDADO EM STAGING
Lote ativo seguinte: nova U2 — Sílabas e primeiras palavras
P6 — Feedback por IA: AGUARDANDO T1
Próximo passo exato: autorar a nova U2 em content/staging/t1/n0-u02/, preservando os núcleos L01–L08 e criando N0-U02-L09/N0-U02-L10 + N0-U02-V02 conforme docs/redimensionamento-t1-2-n0.md
Blocker global: nenhum
Gate final do Clássico: NÃO SATISFEITO
```

Enquanto T1 estiver ativo, não iniciar P6 materialmente. O T1 foi autorizado como uma unidade de trabalho completa e pode usar múltiplas PRs sem nova autorização entre subfases previstas.

## Marcos do produto

| Marco | Estado | Evidência principal |
|---|---|---|
| P1 — Schemas/contratos | `HOMOLOGADO` | PR #105 |
| P2 — ContentService/normalizador | `HOMOLOGADO` | PR #106 |
| P3 — Manifests/catálogo inicial | `HOMOLOGADO` | PR #107 |
| P4 — Renderer real do Clássico | `HOMOLOGADO` | PR #108 |
| P5 — Progresso/revisão/Gist | `HOMOLOGADO` | PR #109 |
| T1 — Fundamentos claros | `ATIVO` | PRs #116–#121 + T1.6 em execução |
| P6 — Feedback por IA | `AGUARDANDO T1` | — |
| P7 — Catálogo N0→N4 | `NAO_INICIADO` | — |
| P8 — Mídia/publicação | `NAO_INICIADO` | — |
| P9 — E2E / Clássico homologado | `NAO_INICIADO` | — |

## Base homologada P1–P5

A base técnica já prova:

```text
catálogo/manifests
→ ContentService/normalização
→ renderer/atividades
→ evidência/progresso/revisão
→ cache local
→ sync Gist/conflitos
```

O `ProgressService` mantém separadas:

```text
percurso curricular
≠ evidência/domínio
≠ gamificação
```

O Clássico não possui XP oculto, lives ou punição por erro. Persistência local/Gist, respostas abertas, merge de três vias e falha remota sem perda foram homologados em P5.

## UX homologada antes de T1

### Home

- navegação superior única;
- sem sidebar duplicada;
- sem hero/banner grande;
- `Continue estudando / Comece por aqui` concentra o CTA principal;
- métricas derivadas de dados reais;
- card de progresso validado também em largura intermediária;
- `Ajuda` como utilitário discreto.

### Fluxo de lição

Base técnica homologada:

- uma etapa principal por vez;
- `← Voltar para a unidade` no lugar do breadcrumb longo;
- `Voltar` / `Avançar` sem gate artificial;
- respostas preservadas entre etapas;
- rótulos técnicos redundantes removidos;
- movimento respeita `prefers-reduced-motion`.

T1 acrescenta a tela inicial exclusiva da lição, nova linguagem pública e nova progressão inicial N0.

# T1 — Fundamentos claros e experiência de lição

```text
T1.0 baseline/ativação                                      ✓
T1.1 pesquisa + auditoria                                  ✓
T1.2 redimensionamento curricular N0                       ✓
T1.3 contrato de linguagem                                 ✓
T1.4 skills/fontes canônicas                               ✓
T1.5 contrato técnico de abertura                          ✓
T1.6 nova autoria inicial                                  ← ativo
  lote U1 — Letras e primeiros sons                        ✓ staged + validado
  lote U2 — Sílabas e primeiras palavras                   ← próximo
T1.7 frontend de intro/fluxo
T1.8 metodologia em Ajuda
T1.9 migração/catálogo/progresso/mídia
T1.10 validação/homologação
```

## T1.1–T1.5 — decisões consolidadas

Fontes:

- auditoria: `docs/auditoria-t1-1-porta-entrada-n0.md`;
- arquitetura: `docs/redimensionamento-t1-2-n0.md`;
- linguagem: `docs/linguagem-aluno.md`;
- contrato técnico: `app/js/services/content-presentation-normalizer-v1.js` + `ContentService`.

Regras vigentes:

```text
fala/escrita não abre mais o curso
letras + consciência sonora aparecem cedo e articuladas
não exigir domínio perfeito A–Z antes de sons/sílabas
sílabas entram cedo na U2
variação letra↔som vem depois de experiências concretas

objetivo técnico ≠ objetivo público
clara + completa + simples
concreto → exemplo → conceito → prática → ampliação
```

A autoria v1 pode declarar `studentObjective`. O runtime produz `presentation.intro`; conteúdo legado sem copy pública recebe fallback neutro e **nunca** o `objective` técnico.

## T1.6 — nova autoria inicial

### Estratégia de staging

A nova autoria **não é colocada nos caminhos publicados antes da migração de T1.9**.

Motivo: o catálogo/manifests atuais ainda representam a ordem histórica. Alterar os arquivos vivos antes da troca do manifesto faria o Pages carregar conteúdo novo numa ordem antiga e pedagogicamente incoerente.

Regra:

```text
T1.6 autoria nova
→ content/staging/t1/
→ validação própria no CI
→ não descoberta pelo catálogo público

T1.9
→ migração de IDs/progresso/mídia
→ manifesto/catalog novos
→ promoção staged → caminhos publicados
→ troca coerente/atômica
```

Não enfraquecer `validate-catalog.mjs` para acomodar conteúdo intermediário.

### Lote U1 — Letras e primeiros sons

**Estado: CONCLUÍDO / VALIDADO EM STAGING.**

Local:

```text
content/staging/t1/n0-u01/
```

Nova ordem autorada:

```text
1. N0-U01-L03 — Letras e alfabeto
2. N0-U01-L04 — Maiúsculas e minúsculas
3. N0-U01-L05 — Vogais e consoantes
4. N0-U01-L09 — Letras, números e outros sinais
5. N0-U01-L06 — Como a escrita se organiza
6. N0-U01-L02 — Ouvindo sons nas palavras
7. N0-U01-L07 — Nome da letra e som: coisas diferentes
→ N0-U01-V02 — Verificação: Letras e primeiros sons
```

Decisões de autoria:

- as sete lições possuem `studentObjective` próprio;
- `N0-U01-L03` começa explicitamente por **o que é uma letra** e não possui pré-requisito;
- `N0-U01-L05` foi reduzida ao núcleo vogais/consoantes;
- o segundo núcleo da antiga L05 ganhou novo `N0-U01-L09`;
- `N0-U01-L06` define `espaço` perto do primeiro uso;
- `N0-U01-L02` foi reposicionada depois da base de letras;
- `N0-U01-L07` encerra U1 sem antecipar a variação complexa da U2;
- antigas `N0-U01-L01` e `N0-U01-L08` permanecem fontes legadas para a futura U2.

### Verificação U1 V02

A `N0-U01-V02` cobre quatro agrupamentos obrigatórios e não compensáveis:

```text
alphabetAndForms
letterCategories
visualOrganization
soundAndLetter
```

Deliberadamente não cobra:

- síntese fala × escrita;
- variação ampla letra↔som;
- sílabas ou leitura sistemática de palavras.

Não cria novas mídias humanas: reutiliza `mediaId`s já reservados quando semanticamente adequados.

### Validação staged

Novo teste:

```text
scripts/test-t1-content-authoring.mjs
```

CI agora executa `Test T1 staged authoring` sem misturar o conteúdo staged ao catálogo de produção.

Provas do lote U1:

- 7/7 lições com `studentObjective` autoral;
- `presentation.introSource = AUTHORED`;
- objetivo público diferente do objetivo técnico;
- primeira lição sem pré-requisito e com definição explícita de letra;
- nova L09 normalizável/evidenciável;
- V02 com 9 atividades e 4 clusters obrigatórios/noncompensable;
- interações suportadas pelo runtime;
- áudio controlado preservado;
- competências movidas para U2 ausentes da V02;
- `validate-catalog` continua verde porque o conteúdo publicado permanece intacto;
- renderer/progresso/smoke visual atuais continuam verdes.

## Estado de publicação do slice

### N0-U01

```text
Renderer/progresso atual: base técnica homologada
Autoria T1 nova: STAGED / VALIDADA
Manifesto público: ainda histórico
Mídia obrigatória histórica/reutilizada: pendente, reconciliar T1.9
Publicação nova U1: NÃO ATIVADA antes de T1.9
```

### N4-U09

```text
Renderer/progresso/pending: HOMOLOGADOS
Manifesto: READY
Nova mídia humana obrigatória: nenhuma
```

## Pendências abertas

```text
Global antes de P6: concluir T1
Imediato: T1.6 — autorar nova U2 em staging
Depois: T1.7 frontend da abertura/fluxo
T1.9: promover staging + migrar catálogo/progresso/mídia
```

## Gate `CLÁSSICO HOMOLOGADO`

Somente P9 pode satisfazer o gate final. Nenhuma implementação de XP, missões, conquistas ou streak começa antes dele.
