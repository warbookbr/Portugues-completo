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

**M5 concluído.** Seis unidades, verificações integradas U1–U6, verificação de saída `N0-EXIT-V01` e auditoria de competências concluídas.

```text
currículo fechado
≠ publicação pronta
≠ validação externa de toda resposta aberta/oral
```

### Nível 1 — Básico

- **M1 concluído** — `docs/mapa-niveis-1-4.md`;
- **M2 concluído** — 10 áreas em `docs/areas-nivel-1.md`;
- **M3 concluído** — 7 unidades em `docs/unidades-nivel-1.md`;
- **M4 concluído** — 64 lições + 7 verificações integradas em `docs/licoes-nivel-1.md` e documentos U1–U7;
- **M5 em andamento** — **U1 concluída**; U2–U7 pendentes.

A passagem N0→N1 foi auditada em `docs/transicao-n0-n1.md` e não exige reabrir o N0.

### Níveis 2, 3 e 4

**M1 concluído** para os três níveis.

## N1 — M5

### U1 — Lendo textos com mais autonomia — CONCLUÍDA

```text
9 lições desenvolvidas
+ N1-U01-V01
```

Cobertura: objetivo de leitura; assunto, finalidade e informação principal; combinação de explícitos; referenciação; tempo/causa/contraste/explicação; explícito x inferência x informação insuficiente; apoios multimodais acessíveis; autoria/fonte/opinião/razão; resumo em palavras próprias.

Regras preservadas:

- texto disponível para releitura;
- inferências exigem pistas suficientes;
- `não há informação suficiente` é resposta legítima;
- imagem/layout não são a única via de acesso à evidência;
- resumo próprio é obrigatório e não recebe falsa validação automática;
- nenhuma nova mídia humana obrigatória.

## Foco curricular atual

```text
NÍVEL 0 — M5 concluído
NÍVEL 1 — M1–M4 concluídos
└── M5 — MARCO ATIVO
    ├── U1 ✓
    └── U2 — PRÓXIMO SUBPASSO
```

Próximo marco:

```text
N1-U02 — Palavras: ortografia, acentuação e sentidos
10 lições + verificação integrada
```

Depois:

```text
U3 → U4 → U5 → U6 → U7
→ verificação de saída do N1
→ checkpoint N1→N2
```

## Regras de continuidade

1. Nenhuma unidade entra em M5 sem M4 consolidado.
2. Descobertas locais devem ser conferidas contra `docs/matriz-progressao-global.md`.
3. Ortografia e gramática não devem virar taxonomia isolada: uso, compreensão, aplicação e revisão continuam centrais.
4. Produções abertas e orais não podem receber validação automática falsa quando não há avaliador confiável.
5. Atualizar este roadmap no mesmo PR que alterar materialmente o estado curricular.
6. Em ortografia/acentuação, ensinar regularidades com escopo explícito e nunca transformar padrão parcial em regra universal.

## Dependências não curriculares ainda abertas

- mídias humanas antigas de U1/U2 do N0 em `producao-midia/FILA-MIDIA.md`;
- frontend sem catálogo/renderer das unidades desenvolvidas;
- validação plena de respostas abertas dependente de avaliador confiável;
- produção oral compreensível dependente de observação externa futura.

## Fontes de verdade

```text
visão geral → docs/mapa-curso.md
M1 N1–N4 → docs/mapa-niveis-1-4.md
matriz global → docs/matriz-progressao-global.md
N1 M2 → docs/areas-nivel-1.md
N1 M3 → docs/unidades-nivel-1.md
N1 M4 → docs/licoes-nivel-1.md + docs/licoes-nivel-1-u*.md
transição N0→N1 → docs/transicao-n0-n1.md
estado atual → docs/roadmap-curricular.md
conteúdo → content/
