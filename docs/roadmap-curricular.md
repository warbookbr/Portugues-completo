# Roadmap Curricular

## Objetivo

Registrar o estado real do desenvolvimento curricular, o marco ativo e a próxima camada que pode ser aprofundada.

## Escala de maturidade

```text
M0 — esboço
M1 — nível mapeado
M2 — áreas dimensionadas
M3 — unidades dimensionadas
M4 — lições dimensionadas
M5 — conteúdo desenvolvido
```

A escala mede maturidade curricular. Não equivale a progresso do aluno nem a prontidão de publicação.

## Estado macro

### Nível 0 — Fundamentos

**M5 curricularmente concluído.** Seis unidades, verificações integradas U1–U6, verificação de saída `N0-EXIT-V01` e auditoria de competências concluídas.

### Nível 1 — Básico

**M5 curricularmente concluído.**

- M1 — `docs/mapa-niveis-1-4.md`;
- M2 — `docs/areas-nivel-1.md`;
- M3 — `docs/unidades-nivel-1.md`;
- M4 — `docs/licoes-nivel-1.md` + U1–U7;
- M5 — sete unidades com conteúdo e verificações integradas;
- saída — `content/levels/001-basico/exit-verification.json`;
- checkpoint — `docs/checkpoint-saida-nivel-1.md`;
- transição — `docs/transicao-n1-n2.md`.

A auditoria de saída não encontrou lacuna curricular obrigatória que exija reabrir U1–U7 antes do N2.

```text
currículo fechado
≠ publicação pronta
≠ validação automática plena de toda escrita/fala aberta
```

### Nível 2 — Intermediário

- **M1 concluído** — `docs/mapa-niveis-1-4.md`;
- **M2 concluído** — 11 áreas em `docs/areas-nivel-2.md`;
- **M3 concluído** — 9 unidades em `docs/unidades-nivel-2.md`;
- **M4 concluído** — **87 lições + 9 verificações integradas** em `docs/licoes-nivel-2.md` e documentos U1–U9;
- **M5 em andamento** — **U1, U2 e U3 concluídas**; U4–U9 pendentes.

Arquitetura M4:

```text
U1  10 — Leitura intermediária: estrutura, inferência e ponto de vista
U2  11 — Palavras em sistema: ortografia, acentuação, morfologia e precisão
U3  10 — Oração e termos: construindo e revisando relações sintáticas
U4  11 — Do período simples ao composto: relações, regência e pontuação
U5   9 — Coesão e coerência em textos de vários parágrafos
U6  10 — Produzindo e reescrevendo textos de vários parágrafos
U7   9 — Argumentar: posição, razões, exemplos e evidências
U8   8 — Língua em interação: apresentação, discussão, registro e variação
U9   9 — Literatura, multimodalidade e comparação de fontes
```

### N2-U1 — Leitura intermediária: estrutura, inferência e ponto de vista — CONCLUÍDA

```text
10 lições + N2-U01-V01
```

Cobertura: plano de leitura; foco e organização global; hierarquia de informações; integração de explícitos; cadeias referenciais; relações lógicas; inferência distribuída; ponto de vista com evidência; explícito/inferência/insuficiência; síntese própria.

Regras centrais: releitura permitida, velocidade não pontua, inferência exige pistas, insuficiência pode ser resposta legítima e síntese aberta não recebe validação semântica falsa.

### N2-U2 — Palavras em sistema: ortografia, acentuação, morfologia e precisão — CONCLUÍDA

```text
11 lições + N2-U02-V01
```

Escopo normativo: `docs/referencias-ortografia-nivel-2.md`.

Cobertura: regra/padrão/consulta; `c/qu/ç` e fronteiras lexicais; paroxítonas; hiatos; famílias/base; afixos; derivação/composição; classes ampliadas; sinonímia/polissemia/ambiguidade/precisão; literal/figurado + acepção contextual.

Regras centrais: padrão parcial não vira regra universal; consulta é autonomia quando a regra não decide; acentuação é avaliada apenas no recorte documentado; classes e sentidos são avaliados em contexto.

### N2-U3 — Oração e termos: construindo e revisando relações sintáticas — CONCLUÍDA

```text
10 lições + N2-U03-V01
```

Cobertura:

- frase, oração, período e locução verbal sem contagem mecânica de formas verbais;
- sujeito antes/depois do verbo e recuperável pelo contexto/forma verbal;
- predicado e funcionamento verbal em ação, estado, mudança e ocorrência;
- núcleo e expansão de grupos nominais;
- complementação verbal em construções transparentes, com e sem preposição;
- modificadores de tempo, lugar e modo, separando papel estrutural de relevância comunicativa;
- concordância nominal em grupos produtivos;
- concordância verbal em sujeito simples, posposto e composto transparente;
- ordem, referência e ambiguidade sintática com reformulações equivalentes;
- revisão sintática em passes, preservando trechos corretos.

A verificação integrada mantém nove agrupamentos obrigatórios e exige tarefa real de edição. Ela contém contraexemplos explícitos às generalizações `sujeito = primeira palavra`, `verbo = ação`, `tudo depois do verbo = complemento` e `verbo concorda com o substantivo mais próximo`.

Limites preservados:

- sem análise sintática completa;
- sem taxonomia exaustiva de sujeito/predicado/transitividade;
- regência normativa sistemática fica para U4;
- concordâncias especiais/controversas ficam fora do recorte;
- ordem não canônica clara não é corrigida por reflexo;
- classificação isolada não compensa incapacidade de revisar uma construção real.

Nenhuma nova mídia humana obrigatória foi criada.

### Níveis 3 e 4

**M1 concluído.** M2–M5 ainda pendentes.

## Foco curricular atual

```text
NÍVEL 0 — M5 ✓
NÍVEL 1 — M5 ✓
NÍVEL 2 — M1–M4 ✓
└── M5 — MARCO ATIVO
    ├── U1 ✓
    ├── U2 ✓
    ├── U3 ✓
    └── U4 — PRÓXIMO SUBPASSO
```

Próximo subpasso:

```text
N2-U04 — Do período simples ao composto: relações, regência e pontuação
11 lições + verificação integrada
```

Antes do M5 da U4, o recorte normativo de regência, crase e colocação pronominal deve ser conferido e registrado em fontes adequadas, assim como foi feito com a ortografia da U2.

Depois:

```text
N2-U5 → U6 → U7 → U8 → U9
→ verificação de saída N2
→ checkpoint N2→N3
```

## Responsabilidades críticas do N2

O N2 deve avançar de autonomia básica para uso intermediário organizado e justificável:

- textos de vários parágrafos como rotina;
- inferência com pistas distribuídas e evidência;
- ortografia/acentuação ampliadas com escopo normativo explícito;
- sistema morfológico mais completo sem taxonomia enciclopédica;
- oração/período e termos fundamentais usados para revisão;
- concordância, regência, crase e colocação em recortes frequentes;
- coesão/coerência global;
- produção e reescrita de vários parágrafos;
- argumentação `posição → razão → exemplo/evidência → objeção simples`;
- apresentação/discussão curta com limites técnicos de validação oral;
- literatura/multimodalidade e comparação de duas fontes.

## Regras de continuidade

1. Nenhuma unidade entra em M5 sem reler M1–M4 e a transição N1→N2.
2. Descobertas locais devem ser conferidas contra `docs/matriz-progressao-global.md`.
3. Atualizar este roadmap no mesmo PR que alterar materialmente o estado curricular.
4. Produções abertas e orais não podem receber validação automática falsa.
5. Terminologia deve produzir ganho de compreensão, produção ou revisão.
6. Contraexemplos devem aparecer cedo quando uma simplificação puder virar regra falsa.
7. Em ortografia, acentuação, regência, crase e colocação, o M5 deve registrar/conferir o recorte em fontes normativas primárias adequadas.
8. Vírgula não é ensinada por respiração; crase não é ensinada por truque isolado; sujeito não é identificado por posição mecânica.
9. Coesão não é contagem de conectores e repetição não é erro automático.
10. Argumentação avalia relação entre posição e apoio, não concordância ideológica.
11. Interpretações literárias diferentes são aceitas quando sustentadas por evidência.
12. Ao comparar fontes, divergência pode legitimamente exigir confirmação adicional.

## Dependências não curriculares abertas

- mídias humanas antigas do N0 em `producao-midia/FILA-MIDIA.md`;
- frontend ainda sem catálogo/renderer completo das unidades desenvolvidas;
- validação plena de respostas abertas depende de avaliador confiável;
- inteligibilidade da produção oral depende de observação externa confiável.

Essas dependências não impedem autoria curricular M5 quando a atividade registra corretamente seus limites.

## Fontes de verdade

```text
visão geral → docs/mapa-curso.md
M1 N1–N4 → docs/mapa-niveis-1-4.md
matriz global → docs/matriz-progressao-global.md

N1 M2 → docs/areas-nivel-1.md
N1 M3 → docs/unidades-nivel-1.md
N1 M4 → docs/licoes-nivel-1.md + docs/licoes-nivel-1-u*.md
N1 saída → docs/checkpoint-saida-nivel-1.md + content/levels/001-basico/exit-verification.json
N1→N2 → docs/transicao-n1-n2.md

N2 M2 → docs/areas-nivel-2.md
N2 M3 → docs/unidades-nivel-2.md
N2 M4 → docs/licoes-nivel-2.md + docs/licoes-nivel-2-u*.md
N2-U02 escopo normativo → docs/referencias-ortografia-nivel-2.md

estado atual → docs/roadmap-curricular.md
conteúdo desenvolvido → content/
```