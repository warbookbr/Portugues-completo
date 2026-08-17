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
M1 ✓
M2 — PRÓXIMO MARCO
M3 pendente
M4 pendente
M5 pendente
```

O N4 começa na fronteira definida pelo checkpoint N3→N4:

```text
uso avançado consciente, crítico, argumentativo e adaptável
→
controle consciente, flexível, crítico e autoral da língua
```

# Marco ativo

```text
N0 — M5 ✓
N1 — M5 ✓
N2 — M5 ✓
N3 — M5 ✓
N4 — M1 ✓
└── M2 — PRÓXIMO MARCO
```

## Próximo subpasso

```text
N4 — M2
→ dimensionar as grandes áreas do Nível 4
→ verificar cobertura das competências oficiais de saída do N4
→ distribuir responsabilidades sem transformar áreas em unidades prematuramente
→ preservar continuidade com o checkpoint N3→N4 e a matriz global
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
estado → docs/roadmap-curricular.md
conteúdo → content/
```
