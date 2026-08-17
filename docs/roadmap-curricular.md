# Roadmap Curricular

## Função

Registrar **estado real**, **maturidade**, **marco ativo**, **gates** e **próximo subpasso**. Detalhes pedagógicos pertencem às fontes M1–M4 e aos JSONs; não devem ser duplicados extensamente aqui.

## Escala

```text
M0 esboço → M1 nível → M2 áreas → M3 unidades → M4 lições → M5 conteúdo
```

Maturidade curricular ≠ progresso do aluno ≠ prontidão de publicação.

# Estado macro

## Nível 0 — Fundamentos

**M5 concluído.** 6 unidades + verificações + `N0-EXIT-V01` + checkpoint.

## Nível 1 — Básico

**M5 concluído.** 7 unidades + verificações + `N1-EXIT-V01` + checkpoint + transição N1→N2.

## Nível 2 — Intermediário

**M5 concluído.** 9 unidades + verificações + `N2-EXIT-V01` + checkpoint + transição N2→N3.

## Nível 3 — Avançado

**M5 concluído curricularmente.**

```text
M1 ✓
M2 ✓ — 10 áreas
M3 ✓ — 9 unidades
M4 ✓ — 94 lições + 9 verificações integradas
M5 ✓ — U1–U9 + N3-EXIT-V01 + checkpoint N3→N4
```

Unidades:

```text
U1 ✓ — Leitura crítica de textos longos
U2 ✓ — Argumentação avançada
U3 ✓ — Sintaxe complexa, norma e efeitos de estrutura
U4 ✓ — Fontes múltiplas, síntese e leitura crítica da informação
U5 ✓ — Produção longa e gêneros formais/analíticos
U6 ✓ — Estilo, precisão e edição avançada
U7 ✓ — Comunicação formal e debate estruturado
U8 ✓ — Variação, norma, prestígio e identidade
U9 ✓ — Literatura, intertextualidade e mídia crítica
```

Saída:

- `content/levels/003-avancado/exit-verification.json` — `N3-EXIT-V01`;
- `docs/checkpoint-saida-nivel-3.md` — auditoria das 18 competências oficiais;
- oito agrupamentos de transferência são obrigatórios;
- produção longa, argumentação própria e processo oral não são compensáveis;
- escrita, síntese, argumentação, interpretação e oralidade abertas preservam limites de validação;
- nenhuma nova mídia humana obrigatória foi criada.

Gates do N3:

- U3 normativo — **SATISFEITO** em `docs/referencias-gramatica-nivel-3-u3.md`;
- U9 audiovisual/acessibilidade — **SATISFEITO** em `docs/gate-audiovisual-nivel-3-u9.md`.

## Nível 4 — Domínio

```text
M1 ✓ — objetivo + 17 competências oficiais + 9 grandes responsabilidades
M2 ✓ — 9 áreas dimensionadas + revisão horizontal 17/17
M3 ✓ — 9 unidades integradas + cobertura 17/17 + saída antecipada
M4 ✓ — 93 lições + 9 verificações integradas
M5 — PRÓXIMO MARCO
```

Fontes:

- M2: `docs/areas-nivel-4.md`;
- M3: `docs/unidades-nivel-4.md`;
- M4 consolidado: `docs/licoes-nivel-4.md`;
- M4 por unidade: `docs/licoes-nivel-4-u1.md` ... `docs/licoes-nivel-4-u9.md`.

Arquitetura M4:

```text
U1 — 10 lições — Leitura estratégica de alta complexidade e revisão de interpretação
U2 — 11 lições — Pesquisa orientada por problema, fontes e rastreabilidade
U3 — 10 lições — Argumentação complexa, evidência e responsabilidade epistêmica
U4 — 11 lições — Autoria avançada, gêneros complexos e transferência
U5 — 11 lições — Edição de alto nível, precisão e consulta linguística
U6 —  9 lições — Estilo, registro e projeto de voz
U7 — 10 lições — Língua, norma, variação, mudança, identidade e poder
U8 —  9 lições — Oralidade complexa, síntese, negociação e debate
U9 — 12 lições — Literatura, multimodalidade e autoria intermedial/digital
────────────────────────────────────────────────────────
TOTAL — 93 lições + 9 verificações integradas
```

Decisões estruturais do M4:

- a progressão do N4 é medida por autonomia, transferência, integração e revisão — não por extensão;
- U1 exige mudança consciente de estratégia e revisão da interpretação diante de nova evidência;
- U2 trata pesquisa como processo rastreável orientado por necessidade informacional, não como acúmulo de fontes;
- U3 exige revisão de tese/posição quando a evidência realmente mudar;
- U4 exige produção longa em versões e transferência para outro gênero/audiência/meio;
- U5 distingue regra, variante, convenção, preferência e consulta e preserva trechos adequados;
- U6 trata estilo como projeto funcional e adaptável;
- U7 separa descrição, norma, variação, mudança e consequências sociais sem hierarquizar falantes;
- U8 preserva limite real de validação oral;
- U9 integra literatura, multimodalidade, circulação e autoria acessível sem exigir mídia decorativa.

Gates do N4:

- `docs/gate-normativo-nivel-4-u5-u7.md` — **DELIMITADO; pesquisa obrigatória antes de congelar respostas normativas em M5**;
- `docs/gate-midia-acessibilidade-nivel-4-u9.md` — **SATISFEITO PARA O M4; nenhuma nova mídia humana obrigatória**; reabrir apenas se M5 introduzir alvo sensorial real insubstituível.

O M4 preserva a cobertura 17/17 do N4 e mantém a arquitetura da futura saída em oito agrupamentos integrados.

# Marco ativo

```text
N0 — M5 ✓
N1 — M5 ✓
N2 — M5 ✓
N3 — M5 ✓
N4 — M1 ✓
└── M2 ✓
    └── M3 ✓
        └── M4 ✓
            └── M5
                └── U1 — PRÓXIMO SUBPASSO
```

## Próximo subpasso

```text
N4-U01 M5 — Leitura estratégica de alta complexidade e revisão de interpretação
→ 10 lições + N4-U01-V01
→ usar materiais novos/controlados
→ exigir escolha e mudança justificada de estratégia
→ exigir revisão de interpretação diante de nova evidência
→ preservar releitura, anotação e incerteza justificadas
→ não criar mídia humana sem necessidade pedagógica real
```

Depois:

```text
U2 → U3 → U4 → U5 (gate normativo) → U6 → U7 (gate normativo) → U8 → U9 (reavaliar gate de mídia se necessário)
→ N4-EXIT-V01
→ checkpoint final do curso
```

# Regras de continuidade

1. M3/M4 consolidados não são redimensionados durante autoria local sem motivo real.
2. Roadmap acompanha mudança material no mesmo PR.
3. Terminologia precisa gerar ganho de compreensão, produção ou revisão.
4. Produção aberta não recebe validação automática falsa.
5. Argumentação avalia estrutura/apoio, não ideologia.
6. Fontes preservam divergência e incerteza reais.
7. Gramática é ferramenta de leitura/produção/edição.
8. Casos normativos controversos exigem fonte adequada.
9. Fontes e escrita reaparecem transversalmente.
10. Gêneros não são templates rígidos.
11. Multimodalidade decisiva precisa ser acessível.
12. `Consultar` pode ser evidência de competência fora do recorte seguro.
13. Revisão deve preservar o que já funciona; quantidade de mudanças não mede qualidade.
14. Existência de JSON curricular não equivale automaticamente a conteúdo publicado.
15. Fechamento curricular de nível não equivale a aprovação automática de aluno individual.
16. N4 deve aumentar integração, flexibilidade, independência crítica e autoria, não apenas comprimento ou raridade.
17. Pesquisa deve responder a necessidade informacional explícita; quantidade de fontes não é proxy de qualidade.
18. N4 deve exigir revisão da própria interpretação, argumento, texto ou estratégia quando nova evidência tornar a decisão anterior insuficiente.
19. M5 não pode congelar resposta normativa de U5/U7 antes do gate de fontes.
20. U9 não cria mídia humana por variedade; alvo sensorial real reabre o gate antes da produção.

# Dependências não curriculares

- mídias humanas antigas do N0;
- frontend ainda sem catálogo/renderer completo;
- respostas abertas dependem de avaliador confiável para validação global;
- inteligibilidade oral depende de observação confiável.

Essas dependências não bloqueiam autoria curricular quando os limites estão registrados.

# Fontes de verdade

```text
visão geral → docs/mapa-curso.md
M1 N1–N4 → docs/mapa-niveis-1-4.md
matriz → docs/matriz-progressao-global.md
N1 → docs/areas-nivel-1.md + docs/unidades-nivel-1.md + docs/licoes-nivel-1*.md
N2 → docs/areas-nivel-2.md + docs/unidades-nivel-2.md + docs/licoes-nivel-2*.md
N2→N3 → docs/transicao-n2-n3.md
N3 M2 → docs/areas-nivel-3.md
N3 M3 → docs/unidades-nivel-3.md
N3 M4 → docs/licoes-nivel-3.md + docs/licoes-nivel-3-u*.md
N3 saída → docs/checkpoint-saida-nivel-3.md + content/levels/003-avancado/exit-verification.json
N3-U3 normativo → docs/referencias-gramatica-nivel-3-u3.md
N3-U9 audiovisual → docs/gate-audiovisual-nivel-3-u9.md
N4 M2 → docs/areas-nivel-4.md
N4 M3 → docs/unidades-nivel-4.md
N4 M4 → docs/licoes-nivel-4.md + docs/licoes-nivel-4-u*.md
N4 gates → docs/gate-normativo-nivel-4-u5-u7.md + docs/gate-midia-acessibilidade-nivel-4-u9.md
estado → docs/roadmap-curricular.md
conteúdo → content/
```
