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
- **M5 das unidades concluído** — **U1–U9 com conteúdo + verificações integradas**;
- **verificação de saída desenvolvida** — `content/levels/002-intermediario/exit-verification.json` (`N2-EXIT-V01`);
- **fechamento do nível em andamento** — checkpoint N2→N3 ainda pendente.

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

Cobertura: frase, oração, período e locução verbal; sujeito em posições variadas; predicado e funcionamento verbal; núcleo e expansão; complementação verbal introdutória; modificadores; concordância nominal/verbal em casos gerais; ordem, referência e ambiguidade; revisão sintática em passes.

Contraexemplos explícitos impedem as generalizações `sujeito = primeira palavra`, `verbo = ação`, `tudo depois do verbo = complemento` e `verbo concorda com o substantivo mais próximo`.

### N2-U4 — Do período simples ao composto: relações, regência e pontuação — CONCLUÍDA

```text
11 lições + N2-U04-V01
```

Escopo normativo: `docs/referencias-gramatica-nivel-2-u4.md`.

Cobertura: período simples/composto; coordenação; subordinação inicial de causa, condição, tempo e finalidade; conectores pelo sentido; pontuação estrutural; regência verbal e nominal em corpus frequente; crase pela estrutura `a + a`; casos centrais com/sem crase; colocação pronominal introdutória na escrita formal; revisão integrada.

Regras centrais: locução verbal não é contada mecanicamente; vírgula não é pausa para respirar; regência fora do corpus pede consulta; crase não é ensinada por palavra feminina ou truque isolado; convenção formal de colocação não vira estigma da fala brasileira.

### N2-U5 — Coesão e coerência em textos de vários parágrafos — CONCLUÍDA

```text
9 lições + N2-U05-V01
```

Cobertura: coesão x coerência; progressão temática; cadeias referenciais; repetição/substituição/elipse; conectores entre parágrafos; lacunas, saltos e ambiguidades; consistência x contradição x mudança de contexto/perspectiva; transições e organização global; revisão em passes.

Regras centrais: mais conectores não significa mais coesão; repetição não é erro automático; referente não é escolhido só por proximidade; divergência de perspectivas não é contradição automática; revisão não autoriza inventar fatos.

### N2-U6 — Produzindo e reescrevendo textos de vários parágrafos — CONCLUÍDA

```text
10 lições + N2-U06-V01
```

Cobertura: planejamento global; distribuição funcional de parágrafos; narrativa; explicação; texto informativo ligado a fonte controlada; procedimento intermediário; resumo/paráfrase com atribuição; adequação ao gênero/leitor; revisão em camadas; reescrita com versionamento.

A verificação integrada exige duas produções próprias de gêneros diferentes, tarefa de resumo/paráfrase com fonte, adaptação a dois contextos e reescrita com histórico. Questões fechadas não compensam ausência de autoria.

Regras centrais: número de parágrafos não é meta; extensão não pontua por si; fatos fornecidos não podem ser inventados; formalidade não é qualidade absoluta; texto livre e qualidade global não recebem validação automática falsa; quantidade de alterações não mede qualidade da reescrita.

### N2-U7 — Argumentar: posição, razões, exemplos e evidências — CONCLUÍDA

```text
9 lições + N2-U07-V01
```

Cobertura: tema/preferência/posição; fato/opinião/inferência em contexto; razões relevantes, circulares e laterais; exemplo x evidência; apoio suficiente/insuficiente/irrelevante; organização argumentativa sem fórmula fixa; objeção/contraexemplo simples; uso responsável de fonte controlada; produção, revisão e reescrita de argumentação própria.

A verificação integrada contém casos em que `a evidência disponível não basta` é a resposta correta. A produção argumentativa própria com primeira versão, revisão e segunda versão é obrigatória.

Regras centrais: posição não é avaliada por concordância ideológica; fato não significa automaticamente verdadeiro; exemplo não é prova; número não é apoio automaticamente pertinente; objeção relevante pode limitar a posição sem anulá-la; fonte não autoriza inventar dados nem transformar ausência de informação em evidência contrária.

### N2-U8 — Língua em interação: apresentação, discussão, registro e variação — CONCLUÍDA

```text
8 lições + N2-U08-V01
```

Cobertura: escuta estratégica; tomada de notas e síntese; planejamento de apresentação curta; prática com notas em vez de memorização; interação com pergunta, confirmação e reparo; discussão curta; registro e adequação; variação, norma e preconceito linguístico.

A verificação integrada distingue explicitamente:

```text
compreensão oral observável
≠ tentativa oral registrada
≠ produção oral compreensível validada externamente
```

Regras centrais: replay sem penalidade automática; transcrição só após tentativa de escuta; score escrito não compensa ausência de compreensão oral; fluência perfeita, velocidade e ausência de hesitação não são critérios automáticos; formal não é melhor por definição; informal não é erro automático; variedade linguística não mede valor ou inteligência do falante.

### N2-U9 — Literatura, multimodalidade e comparação de fontes — CONCLUÍDA

```text
9 lições + N2-U09-V01
```

Cobertura: voz e perspectiva narrativa; personagem, tensão e transformação sem molde fixo; poema, ritmo, repetição, disposição e imagem; figuras frequentes, humor e ironia de pistas claras; pluralidade interpretativa sustentada; multimodalidade e hipertexto acessíveis; autoria/origem/data/circulação; comparação de duas fontes; resumo/paráfrase com atribuição e resposta própria separada.

A verificação integrada usa narrativa e poema autorais, inclui humor/ironia apenas quando sustentados por pistas textuais claras, componente multimodal estruturado com equivalente textual acessível e duas fontes controladas com convergência e divergência real. Quando os materiais não resolvem a divergência, `é preciso confirmar mais` é resposta válida e necessária.

Regras centrais: interpretação diferente não é erro quando sustentada; leitura incompatível com o texto não é aceita como pluralidade; nome de figura sem interpretação não basta; ironia não é forçada sem pista contextual; nenhuma pista decisiva depende só de cor/imagem; aparência profissional/data recente não provam credibilidade; diferenças de escopo devem ser checadas antes de chamar fontes de contraditórias; comentário próprio deve ficar separado das afirmações das fontes.

Nenhuma nova mídia humana obrigatória foi criada em U5–U9. U8 usa TTS porque prosódia específica não determina a resposta; U9 usa componentes de UI acessíveis e não depende de imagem gerada.

### Verificação de saída N2 — DESENVOLVIDA

```text
N2-EXIT-V01
8 agrupamentos obrigatórios de transferência
```

Cobertura de saída:

1. leitura intermediária + inferência + evidência + ponto de vista;
2. revisão linguística integrada no escopo normativo do N2;
3. produção própria de vários parágrafos com planejamento, revisão e reescrita;
4. argumentação própria com posição, razão, evidência e limite;
5. compreensão oral + prática de apresentação/discussão;
6. registro, variação e adequação;
7. literatura + humor/ironia clara + multimodalidade acessível;
8. comparação de duas fontes + resumo/paráfrase + atribuição.

A saída usa materiais novos, não repete as nove verificações de unidade e não usa média global para compensar ausência de uma competência central.

### Níveis 3 e 4

**M1 concluído.** M2–M5 ainda pendentes.

## Foco curricular atual

```text
NÍVEL 0 — M5 ✓
NÍVEL 1 — M5 ✓
NÍVEL 2 — M1–M4 ✓
├── M5 DAS UNIDADES ✓
│   ├── U1 ✓
│   ├── U2 ✓
│   ├── U3 ✓
│   ├── U4 ✓
│   ├── U5 ✓
│   ├── U6 ✓
│   ├── U7 ✓
│   ├── U8 ✓
│   └── U9 ✓
└── N2-EXIT-V01 ✓

FECHAMENTO DO N2 — MARCO ATIVO
└── CHECKPOINT N2→N3 — PRÓXIMO SUBPASSO
```

Próximo subpasso:

```text
checkpoint N2→N3
```

O checkpoint deve auditar cada competência oficial de saída contra ensino, evidência de unidade e transferência em `N2-EXIT-V01`. Se encontrar lacuna real, a unidade responsável deve ser reaberta antes de declarar o nível fechado.

Depois, se o checkpoint fechar sem lacunas obrigatórias:

```text
N2 curricularmente fechado em M5
→ dimensionamento M2 do N3
```

O N2 **ainda não deve ser declarado curricularmente fechado** antes desse checkpoint.

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
13. Em produção escrita, planejamento, texto próprio, revisão e versionamento devem ser evidências reais quando a unidade os exigir; tarefas fechadas não podem substituí-los.
14. Em produção oral, o projeto só pode automatizar o que realmente observa; inteligibilidade e qualidade global exigem observador ou avaliador confiável.
15. Em multimodalidade, toda pista decisiva deve ter equivalente acessível; cor, imagem ou posição isoladas não podem ser a única via para a resposta.

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
N2-U04 escopo normativo → docs/referencias-gramatica-nivel-2-u4.md
N2 saída → content/levels/002-intermediario/exit-verification.json

estado atual → docs/roadmap-curricular.md
conteúdo desenvolvido → content/
```