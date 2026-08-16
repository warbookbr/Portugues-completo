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

### Verificação e checkpoint de saída N2 — CONCLUÍDOS

`N2-EXIT-V01` usa oito agrupamentos integrados de transferência. O checkpoint em `docs/checkpoint-saida-nivel-2.md` auditou:

```text
25 competências oficiais
→ 25 cobertas
→ 0 lacunas obrigatórias remanescentes
```

A fronteira N2→N3 está registrada em `docs/transicao-n2-n3.md`.

### Nível 3 — Avançado

- **M1 concluído** — `docs/mapa-niveis-1-4.md`;
- **M2 concluído** — 10 áreas em `docs/areas-nivel-3.md`;
- **M3–M5 pendentes**.

O N3 recebe como pressuposto curricular um usuário intermediário organizado: leitura de vários parágrafos, revisão funcional do recorte N2, produção/revisão de textos, argumentação inicial, oralidade curta, adequação/variação, literatura sustentada, multimodalidade acessível e comparação de duas fontes.

O M2 dimensionou as seguintes áreas:

```text
1. Leitura crítica e interpretação avançada
2. Produção textual longa, formal e analítica
3. Gramática avançada aplicada ao texto
4. Argumentação, retórica e persuasão
5. Coesão, coerência, semântica e discurso
6. Gêneros formais, profissionais, públicos e de estudo
7. Estilo, registro, precisão e edição
8. Oralidade argumentativa e comunicação formal
9. Variação, norma e consciência sociolinguística
10. Literatura, multimodalidade e leitura crítica de mídia
```

### Decisões estruturais do M2 do N3

**Fontes/pesquisa são transversais, não uma 11ª área artificial.** Responsabilidades principais:

```text
Área 1 → leitura, comparação e síntese de várias fontes
Área 4 → qualidade de evidência em argumentação
Área 6 → integração/atribuição de fontes em gêneros
Área 10 → autoria, circulação, edição e enquadramento de mídia/fontes
```

**Ortografia não desaparece.** Ela passa a operar principalmente como revisão e consulta qualificada:

```text
Área 3 → convenções ligadas a estrutura/norma formal
Área 7 → revisão ortográfica/editorial e consulta
```

**Produção e gêneros não são a mesma área:**

```text
Área 2 → processo de planejar, desenvolver, revisar e reescrever texto longo
Área 6 → finalidades e convenções de famílias de gêneros
```

**Semântica/discurso e estilo também foram separados:**

```text
Área 5 → relações de sentido, implícitos, modalidade, coesão e discurso
Área 7 → precisão, ritmo, voz, tom, concisão e edição
```

O M2 inclui revisão cruzada das competências oficiais de saída do N3 e dos domínios da matriz global; não ficou domínio obrigatório dependente de uma área implícita.

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
├── M2 ✓
└── M3 — PRÓXIMO MARCO
```

Próximo subpasso:

```text
N3 M3 — dimensionar as unidades do Nível 3
```

As unidades devem integrar áreas quando a progressão pedagógica exigir, em vez de criar mecanicamente uma unidade para cada área.

Cada unidade M3 deve registrar:

```text
Objetivo da unidade
→ Competências ao concluir
→ Conteúdos nucleares
→ Retomadas e conexões
→ Evidências de conclusão
→ Limites
```

### Restrições para o M3 do N3

- não criar uma unidade por área apenas para manter simetria;
- não concentrar toda gramática antes de leitura/produção;
- não deixar argumentação, fontes e escrita apenas para o final do nível;
- não transformar gêneros em coleção de templates;
- não tratar estilo apenas como polimento final;
- garantir retomadas distribuídas de fontes, escrita, revisão, oralidade e leitura crítica;
- prever casos normativos avançados específicos para conferência de fontes antes do M5;
- não criar lições antes de M3 suficientemente consolidado.

Depois:

```text
N3 M4 — dimensionar lições
→ N3 M5 — desenvolver conteúdo
```

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
13. Casos normativos avançados, raros ou controversos devem ser conferidos em fontes adequadas antes de serem congelados no M5.

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

N3 M2 → docs/areas-nivel-3.md

estado atual → docs/roadmap-curricular.md
conteúdo desenvolvido → content/
```