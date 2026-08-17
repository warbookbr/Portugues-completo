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

**M5 concluído curricularmente.** 9 unidades + `N3-EXIT-V01` + checkpoint N3→N4.

Gates satisfeitos:

- `docs/referencias-gramatica-nivel-3-u3.md`;
- `docs/gate-audiovisual-nivel-3-u9.md`.

## Nível 4 — Domínio

```text
M1 ✓ — objetivo + 17 competências oficiais + 9 responsabilidades
M2 ✓ — 9 áreas + cobertura 17/17
M3 ✓ — 9 unidades integradas + saída antecipada
M4 ✓ — 93 lições + 9 verificações integradas
M5 em andamento
```

Fontes estruturais:

- `docs/areas-nivel-4.md` — M2;
- `docs/unidades-nivel-4.md` — M3;
- `docs/licoes-nivel-4.md` + `docs/licoes-nivel-4-u1.md` ... `u9.md` — M4.

Arquitetura M4:

```text
U1 — 10 — Leitura estratégica de alta complexidade e revisão de interpretação
U2 — 11 — Pesquisa orientada por problema, fontes e rastreabilidade
U3 — 10 — Argumentação complexa, evidência e responsabilidade epistêmica
U4 — 11 — Autoria avançada, gêneros complexos e transferência
U5 — 11 — Edição de alto nível, precisão e consulta linguística
U6 —  9 — Estilo, registro e projeto de voz
U7 — 10 — Língua, norma, variação, mudança, identidade e poder
U8 —  9 — Oralidade complexa, síntese, negociação e debate
U9 — 12 — Literatura, multimodalidade e autoria intermedial/digital
```

### Estado M5

```text
U1 ✓ — 10 lições + N4-U01-V01
U2 — PRÓXIMO SUBPASSO
U3 pendente
U4 pendente
U5 pendente
U6 pendente
U7 pendente
U8 pendente
U9 pendente
```

U1: `content/units/401-leitura-estrategica-alta-complexidade-revisao-interpretacao/`.

A U1 exige evidências especificamente de Domínio:

- escolha de estratégia e mudança apenas quando um obstáculo real justificar;
- arquitetura textual sem molde único;
- preservação de condição, exceção, ressalva e alcance;
- cadeias referenciais/temáticas distribuídas;
- implícitos, ambiguidade e ironia com evidência;
- intertextualidade em cadeia, sem repertório secreto;
- comparação de enquadramentos sem inferir manipulação automaticamente;
- calibração epistêmica;
- revisão explícita de interpretação após nova evidência, inclusive manutenção justificada;
- síntese crítica própria com evidência rastreável.

`N4-U01-V01` usa material novo em duas etapas e torna todos os dez agrupamentos obrigatórios. Síntese crítica e revisão explícita não são compensáveis por itens fechados.

### Gates do N4

- `docs/gate-normativo-nivel-4-u5-u7.md` — **DELIMITADO; pesquisa obrigatória antes de congelar respostas normativas em M5 de U5/U7**.
- `docs/gate-midia-acessibilidade-nivel-4-u9.md` — **SATISFEITO PARA A ARQUITETURA ATUAL**; reabrir somente se M5 introduzir alvo sensorial real insubstituível.

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
                ├── U1 ✓
                └── U2 — PRÓXIMO SUBPASSO
```

## Próximo subpasso

```text
N4-U02 M5 — Pesquisa orientada por problema, fontes e rastreabilidade
→ 11 lições + N4-U02-V01
→ partir de necessidade informacional explícita
→ ensinar planejamento e refinamento de busca
→ distinguir função de fonte de hierarquia automática
→ trabalhar autoria, data, origem, versão, escopo, método e unidade de análise
→ rastrear afirmações secundárias até origem quando necessário
→ preservar divergências e lacunas
→ exigir notas/referências que permitam reconstruir a origem de afirmações
→ não premiar quantidade de fontes
```

Depois:

```text
U3 → U4 → U5 (gate normativo) → U6 → U7 (gate normativo) → U8 → U9
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
16. N4 aumenta integração, flexibilidade, independência crítica e autoria, não apenas comprimento ou raridade.
17. Pesquisa responde a necessidade informacional explícita; quantidade de fontes não é proxy de qualidade.
18. N4 exige revisão da própria interpretação, argumento, texto ou estratégia quando nova evidência tornar a decisão anterior insuficiente.
19. M5 não congela resposta normativa de U5/U7 antes do gate de fontes.
20. U9 não cria mídia humana por variedade; alvo sensorial real reabre o gate antes da produção.
21. Mudança de estratégia ou interpretação não pontua por si; manutenção justificada pode ser a melhor decisão.

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
N3 → docs/areas-nivel-3.md + docs/unidades-nivel-3.md + docs/licoes-nivel-3*.md + content/units/3xx-*
N3 saída → docs/checkpoint-saida-nivel-3.md + content/levels/003-avancado/exit-verification.json
N4 M2 → docs/areas-nivel-4.md
N4 M3 → docs/unidades-nivel-4.md
N4 M4 → docs/licoes-nivel-4.md + docs/licoes-nivel-4-u*.md
N4 M5 → content/units/4xx-*
N4 gates → docs/gate-normativo-nivel-4-u5-u7.md + docs/gate-midia-acessibilidade-nivel-4-u9.md
estado → docs/roadmap-curricular.md
conteúdo → content/
```
