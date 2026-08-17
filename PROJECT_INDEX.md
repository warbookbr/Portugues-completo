# Índice do Projeto — Português Completo

## Objetivo

Este arquivo é o mapa mestre do projeto. Antes de qualquer trabalho, ele localiza as fontes oficiais, o estado curricular e os procedimentos aplicáveis.

## Visão geral

```text
Português Completo
├── README.md
├── PROJECT_INDEX.md
├── index.html + app/
├── content/
├── producao-midia/
├── docs/
├── scripts/ + .github/
└── .ChatGPT/
```

## Estado e execução

- `docs/roadmap-curricular.md` — estado/maturidade do currículo N0→N4, atualmente fechado em M5.
- `docs/roadmap-produto.md` — estado e ordem da fase ativa de produto/publicação; **fonte do próximo marco técnico**.
- `docs/execucao-continua.md` — execução autônoma por marcos autorizados.
- `.ChatGPT/skills/curricular-orchestration/SKILL.md` — orquestração de marcos longos.
- `.ChatGPT/skills/course-content-design/SKILL.md` — planejamento e revisão pedagógica, já alinhado aos contratos de produto.
- `.ChatGPT/skills/frontend-visual-check/SKILL.md` — verificação de mudanças visuais relevantes.

## Curso inteiro

- `docs/mapa-curso.md` — visão geral curricular e detalhamento consolidado do Nível 0.
- `docs/mapa-niveis-1-4.md` — camada M1 dos Níveis 1–4.
- `docs/matriz-progressao-global.md` — progressão transversal N0–N4.

O percurso **N0→N4 está curricularmente fechado em M5**. Isso não equivale a frontend/publicação concluídos, mídia histórica toda produzida, validação automática plena de respostas abertas ou aprovação automática de aluno individual.

## Contratos de produto

Estas fontes definem como o currículo fechado vira aplicação:

- `docs/arquitetura.md` — arquitetura geral, serviços, armazenamento e separação de responsabilidades.
- `docs/contrato-conteudo.md` — catálogo `course.json`, manifests `unit.json`, normalização de conteúdo e versionamento.
- `docs/conteudo.md` — estrutura pedagógica das lições e uso de mídia.
- `docs/exercicios.md` — papéis de atividade, primitivas de interação, avaliação, estímulos e evidência.
- `docs/progresso.md` — significado pedagógico de progresso, domínio, feedback, revisão e gamificação.
- `docs/persistencia-progresso.md` — schema v1 do Gist, cálculo mecânico de conclusão, gates e sincronização.
- `docs/avaliacao-ia.md` — contrato neutro de feedback com IA, BYOK, consentimento, request/response e limites de autoridade.
- `docs/validacoes.md` — guard rails atuais e próximos schemas/checagens de integridade.

Regra de leitura para trabalho de produto:

```text
roadmap-produto
→ arquitetura
→ contrato de conteúdo
→ exercícios/atividades
→ progresso
→ persistência
→ IA quando aplicável
→ validações
```

## Nível 0

- `docs/unidades-nivel-0.md`
- `docs/licoes-nivel-0.md`
- `docs/licoes-nivel-0-unidade-6.md`
- `docs/checkpoint-saida-nivel-0.md`
- `content/levels/000-fundamentos/exit-verification.json`

## Nível 1

- `docs/areas-nivel-1.md`
- `docs/unidades-nivel-1.md`
- `docs/licoes-nivel-1.md`
- `docs/licoes-nivel-1-u1.md`
- `docs/licoes-nivel-1-u2.md`
- `docs/licoes-nivel-1-u3.md`
- `docs/licoes-nivel-1-u4.md`
- `docs/licoes-nivel-1-u5.md`
- `docs/licoes-nivel-1-u6.md`
- `docs/licoes-nivel-1-u7.md`
- `docs/referencias-ortografia-nivel-1.md`
- `docs/checkpoint-saida-nivel-1.md`
- `docs/transicao-n0-n1.md`
- `docs/transicao-n1-n2.md`
- `content/levels/001-basico/exit-verification.json`

## Nível 2

- `docs/areas-nivel-2.md`
- `docs/unidades-nivel-2.md`
- `docs/licoes-nivel-2.md`
- `docs/licoes-nivel-2-u1.md`
- `docs/licoes-nivel-2-u2.md`
- `docs/licoes-nivel-2-u3.md`
- `docs/licoes-nivel-2-u4.md`
- `docs/licoes-nivel-2-u5.md`
- `docs/licoes-nivel-2-u6.md`
- `docs/licoes-nivel-2-u7.md`
- `docs/licoes-nivel-2-u8.md`
- `docs/licoes-nivel-2-u9.md`
- `docs/referencias-ortografia-nivel-2.md`
- `docs/referencias-gramatica-nivel-2-u4.md`
- `docs/checkpoint-saida-nivel-2.md`
- `docs/transicao-n2-n3.md`
- `content/levels/002-intermediario/exit-verification.json`

## Nível 3

### Arquitetura curricular

- `docs/areas-nivel-3.md` — M2.
- `docs/unidades-nivel-3.md` — M3.
- `docs/licoes-nivel-3.md` — consolidação M4, 94 lições + 9 verificações integradas.
- `docs/licoes-nivel-3-u1.md`
- `docs/licoes-nivel-3-u2.md`
- `docs/licoes-nivel-3-u3.md`
- `docs/licoes-nivel-3-u4.md`
- `docs/licoes-nivel-3-u5.md`
- `docs/licoes-nivel-3-u6.md`
- `docs/licoes-nivel-3-u7.md`
- `docs/licoes-nivel-3-u8.md`
- `docs/licoes-nivel-3-u9.md`

### Gates e referências

- `docs/referencias-gramatica-nivel-3-u3.md` — gate normativo da U3, satisfeito.
- `docs/gate-audiovisual-nivel-3-u9.md` — gate audiovisual/acessibilidade da U9, satisfeito.

### Conteúdo M5

- `content/units/301-leitura-critica-textos-longos/` — U1, 11 lições + `N3-U01-V01`.
- `content/units/302-argumentacao-avancada/` — U2, 11 lições + `N3-U02-V01`.
- `content/units/303-sintaxe-complexa-norma-efeitos/` — U3, 12 lições + `N3-U03-V01`.
- `content/units/304-fontes-multiplas-sintese-leitura-critica/` — U4, 11 lições + `N3-U04-V01`.
- `content/units/305-producao-longa-generos-formais-analiticos/` — U5, 12 lições + `N3-U05-V01`.
- `content/units/306-estilo-precisao-edicao-avancada/` — U6, 9 lições + `N3-U06-V01`.
- `content/units/307-comunicacao-formal-debate-estruturado/` — U7, 9 lições + `N3-U07-V01`.
- `content/units/308-variacao-norma-prestigio-identidade/` — U8, 8 lições + `N3-U08-V01`.
- `content/units/309-literatura-intertextualidade-midia-critica/` — U9, 11 lições + `N3-U09-V01`.
- `content/levels/003-avancado/exit-verification.json` — `N3-EXIT-V01`.
- `docs/checkpoint-saida-nivel-3.md` — auditoria das 18 competências oficiais.

O N3 está **curricularmente fechado em M5**.

## Nível 4

### Arquitetura curricular

- `docs/mapa-niveis-1-4.md` — M1.
- `docs/areas-nivel-4.md` — M2.
- `docs/unidades-nivel-4.md` — M3.
- `docs/licoes-nivel-4.md` — M4 consolidado.
- `docs/licoes-nivel-4-u1.md`
- `docs/licoes-nivel-4-u2.md`
- `docs/licoes-nivel-4-u3.md`
- `docs/licoes-nivel-4-u4.md`
- `docs/licoes-nivel-4-u5.md`
- `docs/licoes-nivel-4-u6.md`
- `docs/licoes-nivel-4-u7.md`
- `docs/licoes-nivel-4-u8.md`
- `docs/licoes-nivel-4-u9.md`

### Gates do N4

- `docs/gate-normativo-nivel-4-u5-u7.md` — **SATISFEITO**.
- `docs/referencias-gramatica-nivel-4-u5-u7.md`.
- `docs/referencias-gramatica-nivel-4-u5-u7-atualizacao-2026.md`.
- `docs/gate-midia-acessibilidade-nivel-4-u9.md` — **SATISFEITO**.

### Conteúdo M5

- `content/units/401-leitura-estrategica-alta-complexidade-revisao-interpretacao/` — U1.
- `content/units/402-pesquisa-orientada-problema-fontes-rastreabilidade/` — U2.
- `content/units/403-argumentacao-complexa-evidencia-responsabilidade-epistemica/` — U3.
- `content/units/404-autoria-avancada-generos-complexos-transferencia/` — U4.
- `content/units/405-edicao-alto-nivel-precisao-consulta-linguistica/` — U5.
- `content/units/406-estilo-registro-projeto-voz/` — U6.
- `content/units/407-lingua-norma-variacao-mudanca-identidade-poder/` — U7.
- `content/units/408-oralidade-complexa-sintese-negociacao-debate/` — U8.
- `content/units/409-literatura-multimodalidade-autoria-intermedial-digital/` — U9.
- `content/levels/004-dominio/exit-verification.json` — `N4-EXIT-V01`.
- `docs/checkpoint-saida-nivel-4.md` — auditoria final **APROVADA**.

```text
M1 ✓
M2 ✓ — 9 áreas
M3 ✓ — 9 unidades
M4 ✓ — 93 lições + 9 verificações integradas
M5 ✓ — U1–U9 + N4-EXIT-V01 + checkpoint final
```

**N4 curricularmente completo. Curso N0→N4 curricularmente completo.**

## Próxima fase do projeto

A sequência oficial está em `docs/roadmap-produto.md`.

Resumo:

```text
P1 schemas + validadores de contrato
→ P2 ContentService/normalizador
→ P3 manifests unit.json + catálogo course.json
→ P4 renderer real
→ P5 ProgressService + Gist
→ P6 modos Clássico/Gamificado
→ P7 feedback com IA
→ P8 ampliação do catálogo
→ P9 mídia/publicação
→ P10 testes/calibração
```

Não iniciar reescrita curricular em massa para atender ao renderer; usar adapters/manifests conforme `docs/contrato-conteudo.md`.

## Conteúdo e mídia

- `producao-midia/README.md` — contrato operacional de mídia.
- `producao-midia/FILA-MIDIA.md` — fila oficial.
- `content/course.json` — catálogo de publicação; ainda precisa ser populado no marco P3.
- `content/units/` — conteúdo de unidades, lições e verificações.
- `content/levels/` — verificações de nível.

## Validação

- `docs/validacoes.md`
- `scripts/validate-project.mjs`
- `scripts/validate-json.mjs`
- `.github/workflows/validate-project.yml`

## Fontes de verdade

```text
estado curricular → docs/roadmap-curricular.md
estado/próximo marco de produto → docs/roadmap-produto.md
arquitetura → docs/arquitetura.md
catálogo/manifests/runtime → docs/contrato-conteudo.md
forma de ensinar/mídia → docs/conteudo.md
atividades/interações/avaliação/evidência → docs/exercicios.md
progresso/domínio/revisão/gamificação → docs/progresso.md
schema/sincronização/cálculo de progresso → docs/persistencia-progresso.md
feedback com IA → docs/avaliacao-ia.md
visão geral curricular → docs/mapa-curso.md
M1 N1–N4 → docs/mapa-niveis-1-4.md
matriz transversal → docs/matriz-progressao-global.md
N3 saída → docs/checkpoint-saida-nivel-3.md + content/levels/003-avancado/exit-verification.json
N4 saída → content/levels/004-dominio/exit-verification.json + docs/checkpoint-saida-nivel-4.md
N4 normativo U5/U7 → docs/gate-normativo-nivel-4-u5-u7.md + docs/referencias-gramatica-nivel-4-u5-u7*.md
N4 mídia/acessibilidade → docs/gate-midia-acessibilidade-nivel-4-u9.md
conteúdo detalhado → content/
produção de mídia → producao-midia/README.md + producao-midia/FILA-MIDIA.md
validação automática → docs/validacoes.md
procedimentos ChatGPT → .ChatGPT/skills/
```

Se uma decisão mudar uma fonte de verdade, atualizar a documentação correspondente em vez de depender da conversa.

## Manutenção

Antes de criar arquivo ou diretório, verificar se já existe área responsável. Depois de mudanças estruturais ou JSON:

```text
node scripts/validate-project.mjs
node scripts/validate-json.mjs
```

O workflow executa essas validações em PRs e pushes para `main`.
