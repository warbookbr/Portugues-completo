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

### Nível 2 — Intermediário

**M5 curricularmente concluído.**

- M1 — `docs/mapa-niveis-1-4.md`;
- M2 — 11 áreas em `docs/areas-nivel-2.md`;
- M3 — 9 unidades em `docs/unidades-nivel-2.md`;
- M4 — 87 lições + 9 verificações integradas em `docs/licoes-nivel-2.md` e documentos U1–U9;
- M5 — U1–U9 com conteúdo + verificações integradas;
- saída — `content/levels/002-intermediario/exit-verification.json` (`N2-EXIT-V01`);
- checkpoint — `docs/checkpoint-saida-nivel-2.md`;
- transição — `docs/transicao-n2-n3.md`.

O checkpoint auditou as 25 competências oficiais de saída e não encontrou lacuna obrigatória remanescente após a correção pré-saída de humor/ironia de pistas claras.

```text
currículo fechado
≠ publicação pronta
≠ validação automática plena de toda escrita/fala aberta
≠ aprovação automática de um aluno individual
```

### Arquitetura concluída do N2

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

### N2-U1 — Leitura intermediária — CONCLUÍDA

Cobertura: plano de leitura; foco e organização global; hierarquia de informações; integração de explícitos; cadeias referenciais; relações lógicas; inferência distribuída; ponto de vista com evidência; explícito/inferência/insuficiência; síntese própria.

### N2-U2 — Palavras em sistema — CONCLUÍDA

Escopo normativo: `docs/referencias-ortografia-nivel-2.md`.

Cobertura: regra/padrão/consulta; ortografia em recorte documentado; paroxítonas; hiatos; famílias/base; afixos; derivação/composição; classes ampliadas; sinonímia/polissemia/ambiguidade/precisão; literal/figurado.

### N2-U3 — Oração e termos — CONCLUÍDA

Cobertura: frase, oração, período e locução verbal; sujeito em posições variadas; predicado; núcleo e expansão; complementação verbal introdutória; modificadores; concordância nominal/verbal em casos gerais; ordem, referência e ambiguidade; revisão sintática.

### N2-U4 — Período, relações, regência e pontuação — CONCLUÍDA

Escopo normativo: `docs/referencias-gramatica-nivel-2-u4.md`.

Cobertura: período simples/composto; coordenação; subordinação inicial; conectores; pontuação estrutural; regência verbal/nominal frequente; crase central; colocação pronominal introdutória; revisão integrada.

### N2-U5 — Coesão e coerência — CONCLUÍDA

Cobertura: progressão temática; referenciação; repetição/substituição/elipse; conectores; lacunas, saltos e ambiguidades; consistência/contradição/contexto; transições; revisão global.

### N2-U6 — Produção e reescrita — CONCLUÍDA

Cobertura: planejamento global; parágrafos por função; narrativa; explicação; informação ligada a fonte; procedimento; resumo/paráfrase; adequação; revisão em camadas; versionamento.

### N2-U7 — Argumentação inicial — CONCLUÍDA

Cobertura: posição; fato/opinião/inferência; razões relevantes; exemplo/evidência; suficiência e limite; organização; objeção simples; fonte controlada; produção e reescrita argumentativa.

A evidência disponível não precisa ser suficiente: reconhecer `não basta para concluir` é competência legítima.

### N2-U8 — Língua em interação — CONCLUÍDA

Cobertura: escuta estratégica; notas/síntese; planejamento e prática de apresentação; interação/reparo; discussão curta; registro/adequação; variação, norma e preconceito linguístico.

```text
compreensão oral observável
≠ tentativa oral registrada
≠ produção oral compreensível validada externamente
```

### N2-U9 — Literatura, multimodalidade e fontes — CONCLUÍDA

Cobertura: voz/perspectiva; personagem/tensão/transformação; poema/forma; figuras frequentes; humor e ironia de pistas claras; pluralidade interpretativa sustentada; multimodalidade/hipertexto acessíveis; autoria/origem/data/circulação; comparação de duas fontes; resumo/paráfrase com atribuição e resposta própria.

A lacuna de humor/ironia detectada na auditoria pré-saída foi corrigida em L4, M4 e `N2-U09-V01` antes da criação de `N2-EXIT-V01`.

### Verificação de saída N2 — CONCLUÍDA

`N2-EXIT-V01` usa oito agrupamentos integrados de transferência:

```text
1. leitura + inferência + evidência + ponto de vista
2. revisão linguística integrada
3. produção própria + planejamento + revisão + reescrita
4. argumentação própria + apoio
5. compreensão oral + apresentação/discussão
6. registro + variação + adequação
7. literatura + multimodalidade acessível
8. duas fontes + resumo/paráfrase + atribuição
```

Não há média global que compense ausência de competência central.

### Checkpoint N2→N3 — APROVADO

Fonte: `docs/checkpoint-saida-nivel-2.md`.

Resultado:

```text
25 competências oficiais auditadas
→ 25 cobertas
→ 0 lacunas obrigatórias remanescentes
```

A fronteira pedagógica está em `docs/transicao-n2-n3.md`.

### Nível 3 — Avançado

- **M1 concluído** — `docs/mapa-niveis-1-4.md`;
- **M2–M5 pendentes**.

O N3 recebe como pressuposto curricular um usuário intermediário organizado: leitura de vários parágrafos, revisão funcional do recorte N2, produção/revisão de textos, argumentação inicial, oralidade curta, adequação/variação, literatura sustentada, multimodalidade acessível e comparação de duas fontes.

O N3 deve aprofundar textos longos/densos, relações implícitas, contra-argumentação, fontes múltiplas, sintaxe complexa, gêneros formais/analíticos/profissionais, estilo, debate estruturado, consciência sociolinguística e leitura crítica de literatura/mídia.

### Nível 4 — Domínio

**M1 concluído.** M2–M5 ainda pendentes.

## Foco curricular atual

```text
NÍVEL 0 — M5 ✓
NÍVEL 1 — M5 ✓
NÍVEL 2 — M5 ✓
│   ├── U1–U9 ✓
│   ├── N2-EXIT-V01 ✓
│   └── checkpoint N2→N3 ✓
│
NÍVEL 3 — M1 ✓
└── M2 — PRÓXIMO MARCO
```

Próximo subpasso:

```text
N3 M2 — dimensionar as grandes áreas do Nível 3
```

O dimensionamento M2 deve transformar as grandes áreas de `docs/mapa-niveis-1-4.md` em áreas com:

```text
Objetivo da área
→ Competências ao concluir
→ Conteúdos essenciais
→ Limites
```

Depois:

```text
N3 M3 — dimensionar unidades
→ N3 M4 — dimensionar lições
→ N3 M5 — desenvolver conteúdo
```

Não criar lições do N3 antes de M2/M3 suficientemente consolidados.

## Responsabilidades críticas do N3

O N3 deve aprofundar — não reensinar do zero — principalmente:

- leitura crítica de textos longos e densos;
- implícitos, pressupostos, intertextualidade e enquadramento;
- argumentação com contra-argumento, qualidade de evidência e estratégias persuasivas;
- síntese e avaliação de várias fontes;
- produção de textos longos, formais, analíticos, profissionais e públicos;
- sintaxe complexa e efeitos de ordem, voz, modalidade e léxico;
- revisão integrada com precisão, concisão, ritmo, paralelismo, tom e estilo;
- apresentações e debates estruturados;
- prestígio, estigma, identidade e mudança linguística;
- literatura com ambiguidade, contexto e intertextualidade;
- multimodalidade crítica, edição, áudio/vídeo e circulação.

## Regras de continuidade

1. Nenhuma camada M4/M5 deve ser criada antes de M2/M3 suficientemente consolidados.
2. Descobertas locais devem ser conferidas contra `docs/matriz-progressao-global.md`.
3. Atualizar este roadmap no mesmo PR que alterar materialmente o estado curricular.
4. Produções abertas e orais não podem receber validação automática falsa.
5. Terminologia deve produzir ganho de compreensão, produção ou revisão.
6. Contraexemplos devem aparecer cedo quando uma simplificação puder virar regra falsa.
7. Gramática permanece ferramenta de uso, leitura, produção e edição; não vira classificação isolada no N3.
8. Argumentação avalia relação entre tese, apoio, qualificação e objeções, não concordância ideológica.
9. Interpretações literárias diferentes são aceitas quando sustentadas por evidência.
10. Comparação de fontes preserva divergências e pode exigir investigação adicional.
11. Em produção oral, o projeto só automatiza o que realmente observa; inteligibilidade exige avaliador confiável.
12. Em multimodalidade, acessibilidade continua obrigatória para pistas decisivas.

## Dependências não curriculares abertas

- mídias humanas antigas do N0 em `producao-midia/FILA-MIDIA.md`;
- frontend ainda sem catálogo/renderer completo das unidades desenvolvidas;
- validação plena de respostas abertas depende de avaliador confiável;
- inteligibilidade da produção oral depende de observação externa confiável.

Essas dependências não impedem desenvolvimento curricular quando os limites estão registrados corretamente.

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
N2-U04 escopo normativo → docs/referencias-gramatica-nivel-2-u4.md
N2 saída → docs/checkpoint-saida-nivel-2.md + content/levels/002-intermediario/exit-verification.json
N2→N3 → docs/transicao-n2-n3.md

estado atual → docs/roadmap-curricular.md
conteúdo desenvolvido → content/
```