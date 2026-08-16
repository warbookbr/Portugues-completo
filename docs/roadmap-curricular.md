# Roadmap Curricular

## Função

Registrar **estado real**, **maturidade**, **marco ativo**, **gates** e **próximo subpasso**. Detalhes pedagógicos pertencem às fontes M1–M4 e aos JSONs, não devem ser duplicados extensamente aqui.

## Escala

```text
M0 esboço → M1 nível → M2 áreas → M3 unidades → M4 lições → M5 conteúdo
```

Maturidade curricular ≠ progresso de aluno ≠ prontidão de publicação.

# Estado macro

## Nível 0 — Fundamentos

**M5 concluído.** 6 unidades + verificações + `N0-EXIT-V01` + checkpoint.

## Nível 1 — Básico

**M5 concluído.** 7 unidades + verificações + `N1-EXIT-V01` + checkpoint + transição N1→N2.

## Nível 2 — Intermediário

**M5 concluído.** 9 unidades + verificações + `N2-EXIT-V01` + checkpoint + transição N2→N3.

```text
currículo fechado
≠ publicação pronta
≠ validação automática plena de escrita/fala aberta
≠ aprovação automática de aluno individual
```

## Nível 3 — Avançado

```text
M1 ✓
M2 ✓ — 10 áreas
M3 ✓ — 9 unidades
M4 ✓ — 94 lições + 9 verificações integradas
M5 em andamento
```

Arquitetura:

```text
U1  11 — Leitura crítica de textos longos
U2  11 — Argumentação avançada
U3  12 — Sintaxe complexa, norma e efeitos de estrutura
U4  11 — Fontes múltiplas, síntese e leitura crítica da informação
U5  12 — Produção longa e gêneros formais/analíticos
U6   9 — Estilo, precisão e edição avançada
U7   9 — Comunicação formal e debate estruturado
U8   8 — Variação, norma, prestígio e identidade
U9  11 — Literatura, intertextualidade e mídia crítica
```

### U1 — concluída

11 lições + `N3-U01-V01`. Leitura longa, implícitos, modalidade, enquadramento, intertextualidade e síntese crítica. Releitura é permitida; inferência exige evidência; velocidade não pontua.

### U2 — concluída

11 lições + `N3-U02-V01`. Tese, cadeia de razões, qualidade/suficiência de evidência, generalização, causalidade, persuasão, objeção e resposta. Posição ideológica não pontua; evidência insuficiente pode ser conclusão correta.

### U3 — concluída

12 lições + `N3-U03-V01`. Gate normativo em `docs/referencias-gramatica-nivel-3-u3.md`.

Status usados:

```text
REGRA_PRODUTIVA
VARIANTE_DOCUMENTADA
CONVENCAO_FORMAL_EDITORIAL
CASO_LEXICAL_DE_CONSULTA
ESCOLHA_ESTILISTICA
```

Preferência institucional não vira regra universal; variante não é corrigida por reflexo; consulta pode ser competência.

### U4 — concluída

11 lições + `N3-U04-V01`. Conjunto de fontes, circulação, escopo/método, convergência/divergência, evidência, enquadramento, viés qualificado, lacunas, matriz, atribuição e síntese multifuente.

A verificação inclui diferença numérica explicável por escopo/método e divergência real não resolvida. Síntese não fabrica consenso.

### U5 — concluída

12 lições + `N3-U05-V01`.

Núcleo:

- situação de produção;
- macroplanejamento seletivo;
- arquitetura de seções/parágrafos;
- desenvolvimento analítico;
- integração funcional de fontes;
- relatório geral;
- resenha crítica;
- artigo/proposta/recomendação;
- comunicação institucional/profissional/pública;
- retextualização entre gêneros;
- produção longa A analítica/de estudo com fontes;
- produção longa B de família formal/pública diferente + revisão cruzada.

A verificação exige duas produções longas próprias de famílias diferentes, ambas com planejamento, primeira versão, revisão e reescrita, além de comparação das decisões entre gêneros.

Guard rails:

- gênero não é template;
- formalidade máxima não é qualidade;
- extensão e número de parágrafos não pontuam;
- vocabulário difícil não é proxy de domínio;
- fontes não substituem raciocínio;
- fatos não podem ser inventados;
- quantidade de alterações não mede reescrita;
- itens fechados não compensam ausência das duas produções.

Nenhuma nova mídia humana obrigatória foi criada em U1–U5.

## Nível 4 — Domínio

**M1 concluído.** M2–M5 pendentes.

# Marco ativo

```text
N0 — M5 ✓
N1 — M5 ✓
N2 — M5 ✓
N3 — M1–M4 ✓
└── M5
    ├── U1 ✓
    ├── U2 ✓
    ├── U3 ✓
    ├── U4 ✓
    ├── U5 ✓
    └── U6 — PRÓXIMO SUBPASSO
```

## Próximo subpasso

```text
N3-U06 — Estilo, precisão e edição avançada
9 lições + verificação integrada
```

A U6 deve tratar estilo como **efeito funcional** em contexto: precisão, concisão, paralelismo, ritmo, repetição, modalidade, tom e edição integrada. Não deve impor “texto enxuto” como superior em qualquer gênero nem substituir clareza por vocabulário raro.

Depois:

```text
N3-U7 → U8 → U9
→ verificação de saída N3
→ checkpoint N3→N4
```

# Gates

## N3-U3 — normativo — SATISFEITO

Fonte: `docs/referencias-gramatica-nivel-3-u3.md`.

## N3-U9 — audiovisual/acessibilidade — PENDENTE PARA U9

Antes de mídia humana, tentar representação acessível por texto, sequência, quadros, transcrição e UI. Se movimento/som/montagem forem essenciais: `mediaId` antes da produção → fila de mídia. Nunca criar imagem/vídeo só por variedade visual.

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
13. Síntese multifuente separa fonte, evidência, incerteza e voz própria.
14. Revisão longa deve preservar o que já funciona; quantidade de mudanças não mede qualidade.

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
N3-U3 normativo → docs/referencias-gramatica-nivel-3-u3.md
estado → docs/roadmap-curricular.md
conteúdo → content/
```