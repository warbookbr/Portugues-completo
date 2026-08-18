# Estado de implementação do Modo Clássico

## Função

Registro operacional canônico do Modo Clássico. Deve permitir a uma nova instância descobrir, sem depender da conversa:

```text
onde estamos
→ o que já foi provado
→ o que está em andamento
→ o que ainda bloqueia publicação/homologação
→ qual é o próximo passo exato
```

`docs/roadmap-produto.md` define a sequência macro. Este arquivo define o **cursor exato**.

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
Subfase ativa: T1.5 — contrato técnico da abertura da lição
Estado T1.5: IMPLEMENTADO NA BRANCH / EM VALIDACAO
P6 — Feedback por IA: AGUARDANDO T1
Próximo passo exato: validar schema + normalização de presentation.intro; se CI passar, fechar T1.5 e iniciar T1.6 — nova autoria das unidades/lições iniciais
Blocker global: nenhum
Gate final do Clássico: NÃO SATISFEITO
```

Enquanto T1 estiver ativo, não iniciar P6 materialmente.

## Marcos do produto

| Marco | Estado | Evidência principal |
|---|---|---|
| P1 — Schemas/contratos | `HOMOLOGADO` | PR #105 |
| P2 — ContentService/normalizador | `HOMOLOGADO` | PR #106 |
| P3 — Manifests/catálogo inicial | `HOMOLOGADO` | PR #107 |
| P4 — Renderer real do Clássico | `HOMOLOGADO` | PR #108 |
| P5 — Progresso/revisão/Gist | `HOMOLOGADO` | PR #109 |
| T1 — Fundamentos claros | `ATIVO` | PRs #116–#120 + trabalho T1.5 |
| P6 — Feedback por IA | `AGUARDANDO T1` | — |
| P7 — Catálogo N0→N4 | `NAO_INICIADO` | — |
| P8 — Mídia/publicação | `NAO_INICIADO` | — |
| P9 — E2E / Clássico homologado | `NAO_INICIADO` | — |

## Base homologada P1–P5

A base técnica já provou:

```text
catálogo/manifests
→ ContentService
→ normalização
→ renderer
→ atividades
→ evidência/progresso/revisão
→ cache local
→ sync Gist/conflitos
```

### Progresso

Dimensões separadas:

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

Políticas homologadas:

```text
DEMONSTRATED_REQUIRED
PENDING_ALLOWED
ATTEMPT_REQUIRED
minimumEvidence
requiredAnyOf
```

O Clássico não possui XP oculto, lives ou punição por erro.

### Persistência

- cache local resiliente;
- respostas abertas restauradas;
- GitHub/Gist usa `portugues-completo-progress.json`;
- token do aluno fica em sessão e nunca entra em progresso/Gist/conteúdo;
- merge de três vias preserva conflito autoral;
- falha remota não apaga trabalho local.

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

T1 acrescenta a **tela inicial exclusiva da lição** e a nova linguagem pública.

# T1 — Fundamentos claros e experiência de lição

```text
T1.0 baseline/ativação                                      ✓
T1.1 pesquisa + auditoria                                  ✓
T1.2 redimensionamento curricular N0                       ✓
T1.3 contrato de linguagem                                 ✓
T1.4 skills/fontes canônicas                               ✓
T1.5 contrato técnico de abertura                          EM VALIDACAO
T1.6 nova autoria inicial
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

Nova entrada:

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

Identidade:

- conteúdo semanticamente igual pode preservar ID;
- split ou mudança material recebe novo ID;
- `N0-U01-L03` vira a primeira lição pública, preservando o núcleo alfabeto;
- parte de `N0-U01-L05` vira novo `N0-U01-L09` para letras/números/outros sinais;
- antiga fala/escrita recebe futura identidade `N0-U02-L10`;
- antiga variação letra–som recebe futura identidade `N0-U02-L09`;
- verificações novas usam `N0-U01-V02` e `N0-U02-V02`;
- V01 antigas permanecem legado;
- progresso antigo nunca vira domínio novo por coincidência de nome/posição.

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

`simples` não significa raso, infantilizado ou impreciso.

No início do N0 não presumir que o aluno já compreende termos como letra, alfabeto, vogal, consoante, sílaba, palavra ou frase.

## T1.4 — consolidação em skills/fontes

Concluído por PR #117 + PR #120:

- `course-content-design`;
- `curricular-orchestration`;
- `student-ui-ux`;
- `classic-product-delivery`;
- `frontend-visual-check`;
- `docs/conteudo.md`;
- `docs/ui-ux.md`;
- `PROJECT_INDEX.md`.

A validação visual de lição passa a cobrir primeira abertura, retomada, explicação, atividade e largura intermediária quando relevante.

## T1.5 — contrato técnico da abertura

### Estado

```text
Técnico: IMPLEMENTADO NA BRANCH
Homologação: EM VALIDACAO
Mudança de schemaVersion: NÃO
Reescrita N1–N4: NÃO
Frontend visual: ainda não; pertence a T1.7
```

### Decisão técnica

A autoria v1 pode declarar opcionalmente:

```json
{
  "studentObjective": "Entender a diferença entre o que falamos e o que escrevemos."
}
```

`objective` continua obrigatório e técnico.

O carregamento canônico passa a produzir, para `LESSON`:

```json
{
  "objective": "objetivo curricular técnico",
  "presentation": {
    "intro": "texto público",
    "introSource": "AUTHORED"
  }
}
```

Quando `studentObjective` não existe ou contém apenas espaço:

```json
{
  "presentation": {
    "intro": "Nesta lição, você vai estudar o conteúdo passo a passo.",
    "introSource": "SAFE_FALLBACK"
  }
}
```

Regras:

- nunca usar `objective` como fallback público;
- fallback é deliberadamente neutro e não tenta inferir o objetivo;
- `introSource` permite detectar conteúdo ainda não migrado;
- o schema normalizado v1 aceita `presentation` como extensão **opcional**, preservando compatibilidade com runtimes/fixtures antigos;
- o `ContentService` atual sempre enriquece lições com `presentation`;
- verificações permanecem inalteradas nesta subfase;
- T1.6 fornecerá `studentObjective` real às novas/revisadas lições iniciais;
- T1.7 consumirá exclusivamente `presentation.intro` na abertura, nunca `objective`.

Arquivos técnicos T1.5:

- `app/js/services/content-presentation-normalizer-v1.js`;
- `app/js/services/content-service.js`;
- `schemas/lesson.schema.json`;
- `scripts/test-content-normalizer.mjs`.

### Gate T1.5

Para fechar:

```text
studentObjective autoral
→ presentation.intro AUTHORED

studentObjective ausente/vazio
→ SAFE_FALLBACK

objective técnico
→ preservado e nunca usado como fallback

conteúdo legado N0/N4
→ continua válido

verificação
→ não recebe semântica de lição

CI completo
→ verde
```

## Estado de publicação do slice

### N0-U01

```text
Renderer/progresso: base técnica homologada
Currículo/publicação: EM REVISAO DIRIGIDA por T1
Manifesto atual: histórico / será migrado em T1.9
Mídia histórica obrigatória: ainda pendente e sujeita à reconciliação T1.9
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
Imediato: terminar validação T1.5
Depois: T1.6 — nova autoria inicial
Local: mídias N0 históricas, reconciliar em T1.9
```

## Gate `CLÁSSICO HOMOLOGADO`

Somente P9 pode satisfazer o gate final. Nenhuma implementação de XP, missões, conquistas ou streak começa antes dele.
