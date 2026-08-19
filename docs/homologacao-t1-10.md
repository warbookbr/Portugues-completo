# Homologação T1.10 — Fundamentos claros e experiência de lição

## Resultado

**T1 — HOMOLOGADO.**

Data da homologação: **2026-08-19**.

O marco T1 pode ser encerrado. A próxima etapa estratégica do Modo Clássico volta a ser **P6 — Feedback por IA no Clássico**.

## O que foi homologado

T1 coordenou uma mudança transversal, não apenas visual:

```text
progressão curricular inicial
+ linguagem pública
+ contrato de conteúdo
+ experiência de abertura da lição
+ navegação secundária
+ migração de progresso
+ catálogo/manifests
+ compatibilidade de deep links
+ mídia/blockers locais
+ validação técnica e visual
```

## Validação curricular

### Nova entrada N0

A sequência publicada começa por:

```text
U1 — Letras e primeiros sons
1. Letras e alfabeto
2. Maiúsculas e minúsculas
3. Vogais e consoantes
4. Letras, números e outros sinais
5. Como a escrita se organiza
6. Ouvindo sons nas palavras
7. Nome da letra e som: coisas diferentes
→ N0-U01-V02

U2 — Sílabas e primeiras palavras
1. O que é uma sílaba?
2. Separando e juntando sílabas
3. Da sílaba ouvida à escrita
4. Sílabas no começo e no fim
5. Sílabas podem ter formas diferentes
6. Montando palavras
7. Lendo por partes e depois a palavra inteira
8. Palavra e significado
9. Letras e sons podem variar
10. Falar e escrever: duas formas de comunicar
→ N0-U02-V02
```

O gate `scripts/test-t1-homologation.mjs` percorre as **17/17 lições iniciais publicadas** e verifica:

- IDs do manifest correspondem às fontes;
- `studentObjective` existe e não reutiliza o `objective` técnico;
- abertura normalizada é `AUTHORED`;
- pré-requisitos de U1/U2 apontam somente para etapas já disponíveis;
- primeira lição não exige pré-requisito;
- letra/alfabeto são construídos explicitamente na entrada;
- sílaba é construída explicitamente na entrada da U2.

### Checkpoint N0 reexecutado

A auditoria T1.10 encontrou uma inconsistência real: `N0-EXIT-V01` ainda carregava `N0-U01-V01` e `N0-U02-V01` como evidências fundacionais.

Correção aplicada:

```text
N0-U01-V01 → N0-U01-V02
N0-U02-V01 → N0-U02-V02
```

Foram atualizados:

- `prerequisiteEvidence`;
- `carryForwardEvidence`;
- `completionEvidence.clusters.foundationCarryForward`.

O ID `N0-EXIT-V01` foi preservado porque a responsabilidade da verificação final não mudou; criar uma nova identidade apenas para trocar dependências internas aumentaria migração sem ganho curricular.

### Transição N0 → N1

Foram rechecados:

- `docs/transicao-n0-n1.md`;
- `docs/areas-nivel-1.md`;
- `docs/unidades-nivel-1.md`.

A transição permanece coerente:

```text
N0
fundação funcional
↓
N1
consolidação + sistematização inicial + autonomia básica ampliada
```

N1 não depende das V01 aposentadas de U1/U2 nem da antiga ordem em que fala/escrita abria o curso.

## Validação de clareza

A revisão qualitativa cobriu obrigatoriamente as 17 lições iniciais.

Critérios usados:

```text
termo novo é construído antes de ser pressuposto?
objetivo público é compreensível?
a entrada começa concreta?
há linguagem curricular/técnica vazando ao aluno?
a atividade exige somente conteúdo já ensinado?
```

Resultado:

- U1 progride do objeto concreto `letra` até primeiros vínculos som-grafia sem exigir terminologia fonética;
- `vogal`, `consoante`, `espaço`, `som` e diferença nome-da-letra × som entram perto do primeiro uso necessário;
- U2 introduz `sílaba` antes de manipulação, escrita e leitura silábica;
- leitura de palavra vem depois de segmentar/juntar e relacionar sílaba ouvida/escrita;
- significado vem depois da leitura inicial;
- variação letra-som e fala×escrita foram movidas para síntese posterior, não abertura abstrata;
- nenhuma simplificação removeu responsabilidade curricular.

## Validação técnica

CI do PR #130, run **32246460683**, passou integralmente.

Gates verdes:

```text
Validate repository structure
Validate JSON syntax
Validate contract schemas
Test content normalization
Test T1 staged authoring
Validate publication catalog
Test catalog discovery
Test progress engine
Test T1 progress migration
Test T1 progress migration wiring
Test T1 atomic promotion
Test T1 homologation
Test progress policies
Test progress merge edge cases
Test GitHub Gist service
Test progress sync
Test classic renderer
Capture classic visual smoke
```

O gate T1.10 é permanente e não depende de o catálogo continuar com apenas três unidades; P7 pode ampliar o catálogo sem desmontar a proteção da nova entrada.

## Validação visual

Artefato inspecionado: `classic-visual-smoke` do run **32246460683**.

Foram inspecionados:

- home desktop;
- home ~900px;
- home ~680px;
- home 390px;
- unidade inicial;
- intro da primeira lição em 1440px, ~900px, ~680px e 390px;
- primeira etapa explicativa;
- primeira atividade;
- retomada desktop/mobile;
- atividade TTS da U2;
- Ajuda;
- metodologia.

Resultado:

- primeira entrada mantém somente contexto essencial + `Começar lição`;
- retomada entra no fluxo sem repetir a intro;
- atividade mantém uma área de atenção principal;
- áudio pendente aparece em linguagem pública sem `mediaId` técnico;
- metadados internos não aparecem ao aluno;
- apoio por partes e TTS permanecem compreensíveis;
- não foi observado overflow impeditivo nas larguras homologadas;
- metodologia continua acessível por Ajuda e ausente do caminho persistente de estudo.

## Progresso e compatibilidade

T1.9 permanece homologado como pré-condição desta homologação:

- migração `t1-n0-entry-v2` ativa no cache local;
- mesmo mapper aplicado a baseline/remoto/Gist;
- backup pré-migração;
- revisão futura falha fechada;
- evidência herdada não inventa consolidação;
- aliases históricos U1-L01→U2-L10 e U1-L08→U2-L09;
- V01 históricas preservadas apenas como legado quando necessário;
- V02 ativas no percurso e no checkpoint N0.

## Mídia

T1 não gera mídia automaticamente.

Os blockers de áudio/imagem das novas U1/U2 continuam locais e explícitos nos manifests/fila de mídia.

```text
mídia pendente
≠ falha da homologação T1
≠ permissão para fingir estímulo disponível
```

A resolução desses blockers pertence à prontidão de publicação/mídia aplicável, sem reabrir a arquitetura T1.

## Checklist de homologação

```text
[x] início do N0 realmente parte do básico
[x] ordem curricular nova está documentada
[x] primeiras unidades/lições reais foram atualizadas/criadas
[x] texto público está simples e separado do objetivo técnico
[x] tela inicial da lição está limpa
[x] progressão por etapas continua funcional
[x] metodologia saiu do rodapé
[x] progresso/IDs antigos foram tratados com segurança
[x] skills canônicas incorporaram o método
[x] CI passou
[x] inspeção visual passou
[x] estado/roadmaps foram atualizados no fechamento
```

## Próximo marco

```text
T1 — HOMOLOGADO
→ P6 — Feedback por IA no Clássico — ATIVO
```

Homologar T1 não satisfaz o gate final `CLÁSSICO HOMOLOGADO`; esse gate continua reservado ao P9.
