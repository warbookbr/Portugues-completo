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
Lote atual: nova U1 — Letras e primeiros sons
Estado do lote U1: AUTORADO NA BRANCH / EM VALIDAÇÃO
P6 — Feedback por IA: AGUARDANDO T1
Próximo passo exato: validar a nova U1 + N0-U01-V02; após CI verde, integrar o lote U1 e continuar T1.6 com a nova U2 — Sílabas e primeiras palavras
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

Estados centrais:

```text
Lição: NAO_INICIADA | EM_ESTUDO | CONCLUIDA
Evidência: NAO_OBSERVADA | PRATICADA | DEMONSTRADA | VALIDACAO_PENDENTE | REVISAO_RECOMENDADA
Competência: NOVA | EM_DESENVOLVIMENTO | DEMONSTRADA | CONSOLIDADA
```

O Clássico não possui XP oculto, lives ou punição por erro. Persistência local/Gist, respostas abertas, merge de três vias e falha remota sem perda foram homologados em P5.

## UX homologada antes de T1

### Home

- navegação superior única;
- sem sidebar duplicada;
- sem hero/banner grande;
- `Continue estudando / Comece por aqui` concentra o CTA principal;
- métricas derivadas de dados reais;
- card de progresso validado em desktop, mobile e largura intermediária;
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
  lote U1 — Letras e primeiros sons                        EM VALIDAÇÃO
  lote U2 — Sílabas e primeiras palavras                   próximo
T1.7 frontend de intro/fluxo
T1.8 metodologia em Ajuda
T1.9 migração/catálogo/progresso/mídia
T1.10 validação/homologação
```

## T1.1 — decisão da auditoria

Fonte: `docs/auditoria-t1-1-porta-entrada-n0.md`.

Confirmado:

- `Fala e escrita` é válido, mas abstrato demais para abrir o curso;
- letras e consciência sonora devem aparecer cedo e articuladas;
- não exigir domínio perfeito A–Z antes de sons/sílabas;
- a introdução de sílaba existente é boa, mas estava tarde demais;
- relações letra↔som mais complexas devem vir após experiências concretas.

## T1.2 — arquitetura curricular congelada

Fonte: `docs/redimensionamento-t1-2-n0.md`.

N0 continua com seis unidades. U3–U6 preservam responsabilidade.

```text
U1 — Letras e primeiros sons
→ letras/alfabeto
→ maiúsculas/minúsculas
→ vogais/consoantes
→ letras, números e outros sinais
→ organização básica da escrita
→ primeiros sons
→ nome da letra × som

U2 — Sílabas e primeiras palavras
→ sílabas
→ separar/juntar
→ sílaba ouvida ↔ escrita
→ montar/ler palavras
→ significado
→ variação letra–som
→ falar × escrever como síntese
```

Identidades semanticamente preservadas mantêm ID. Split ou mudança material recebe ID novo. V01 antigas permanecem legado e as novas responsabilidades usam V02.

## T1.3 — linguagem do aluno

Fonte canônica: `docs/linguagem-aluno.md`.

```text
objetivo técnico
≠ objetivo público

clara + completa + simples

concreto
→ exemplo
→ nome do conceito
→ explicação simples
→ prática
→ ampliação
```

`simples` não significa raso, infantilizado ou impreciso. No início do N0 não presumir que o aluno já compreende letra, alfabeto, vogal, consoante, sílaba, palavra ou frase.

## T1.4 — skills/fontes canônicas

Concluído por PR #117 + PR #120 em:

- `course-content-design`;
- `curricular-orchestration`;
- `student-ui-ux`;
- `classic-product-delivery`;
- `frontend-visual-check`;
- `docs/conteudo.md`;
- `docs/ui-ux.md`;
- `PROJECT_INDEX.md`.

## T1.5 — contrato técnico da abertura

**Estado: HOMOLOGADO — PR #121.**

A autoria v1 pode declarar `studentObjective`; `objective` permanece técnico. O `ContentService` produz:

```json
{
  "objective": "objetivo curricular técnico",
  "presentation": {
    "intro": "texto público",
    "introSource": "AUTHORED"
  }
}
```

Conteúdo legado sem `studentObjective` recebe `SAFE_FALLBACK` neutro. O `objective` técnico nunca é usado automaticamente como fallback público.

## T1.6 — nova autoria inicial

### Lote U1 — Letras e primeiros sons

**Estado: AUTORADO NA BRANCH / EM VALIDAÇÃO.**

Nova ordem curricular autorada:

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

Mudanças de autoria:

- todas as sete lições declaram `studentObjective` próprio;
- `N0-U01-L03` agora começa explicitamente por **o que é uma letra** e não possui pré-requisito;
- `N0-U01-L04` usa título e explicações mais diretas;
- `N0-U01-L05` foi reduzida ao núcleo vogais/consoantes;
- o segundo núcleo da antiga L05 ganhou o novo ID `N0-U01-L09`, evitando duas classificações novas na mesma lição;
- `N0-U01-L06` define `espaço` próximo do primeiro uso e depende da nova L09;
- `N0-U01-L02` foi reposicionada após a base de letras e explica de forma simples o uso de palavras como exemplos auditivos;
- `N0-U01-L07` preserva a distinção nome da letra × som sem antecipar a variação complexa da U2;
- antigas `N0-U01-L01` e `N0-U01-L08` permanecem intactas como fontes legadas para a futura U2; não fazem parte da nova U1.

### Verificação U1 V02

Criada `content/units/001-fala-sons-escrita/integrated-verification-v02.json` sem sobrescrever a V01 histórica.

A V02 cobre quatro agrupamentos não compensáveis:

```text
alphabetAndForms
letterCategories
visualOrganization
soundAndLetter
```

Ela deliberadamente **não** cobra:

- síntese fala × escrita;
- variação mais ampla letra↔som;
- sílabas/palavras como leitura sistemática.

A V02 não cria novas mídias humanas: reutiliza `mediaId`s já reservados de L03 e V01 quando semanticamente adequados.

### Guard rails de teste do lote U1

`scripts/test-content-normalizer.mjs` agora exige:

- `studentObjective` não vazio nas sete lições da nova U1;
- `presentation.introSource === AUTHORED` nelas;
- objetivo público diferente do `objective` técnico;
- primeira lição sem pré-requisito e com definição explícita de letra;
- nova L09 normalizável e com evidência obrigatória;
- V02 com nove atividades e quatro clusters obrigatórios/noncompensable;
- interações da V02 suportadas pelo runtime;
- áudio controlado preservado;
- ausência de competências movidas para U2 na cobertura da V02.

### Fora do lote U1

Não alterar ainda:

- manifesto/catalog U1 — T1.9;
- aliases/migração de progresso — T1.9;
- frontend visual da abertura — T1.7;
- mídia física/fila final — T1.9;
- JSONs da nova U2 — próximo lote T1.6.

## Estado de publicação do slice

### N0-U01

```text
Renderer/progresso: base técnica homologada
Autoria nova U1: EM VALIDAÇÃO
Manifesto público: ainda histórico / migrar em T1.9
Mídia obrigatória histórica/reutilizada: pendente, reconciliar em T1.9
Publicação: NÃO PRONTA
```

A pendência de mídia não bloqueia T1.

### N4-U09

```text
Renderer/progresso/pending: HOMOLOGADOS
Manifesto: READY
Nova mídia humana obrigatória: nenhuma
```

## Pendências abertas

```text
Global antes de P6: concluir T1
Imediato: validar/mergear lote U1 de T1.6
Depois: autorar nova U2 em T1.6
Local: mídias N0, catálogo e progresso — reconciliar em T1.9
```

## Gate `CLÁSSICO HOMOLOGADO`

Somente P9 pode satisfazer o gate final. Nenhuma implementação de XP, missões, conquistas ou streak começa antes dele.
