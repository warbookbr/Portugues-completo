# Checkpoint de saída — Nível 4 — Domínio e fechamento curricular do curso

## Objetivo

Auditar se o **Nível 4 — Domínio** cobre de fato as 17 competências oficiais de saída definidas em `docs/mapa-niveis-1-4.md`, se essas competências possuem ensino e evidência nas nove unidades M5 e se `N4-EXIT-V01` mede transferência integrada suficiente para fechar curricularmente o N4 e, por consequência, o percurso curricular N0→N4 do **Português Completo**.

Este checkpoint audita o **currículo do projeto**. Ele não equivale à aprovação automática de um aluno em tarefas abertas e não declara o aplicativo pronto para publicação.

```text
currículo curricularmente fechado
≠ aluno individual automaticamente aprovado
≠ respostas abertas automaticamente validadas
≠ frontend/publicação concluídos
≠ todas as mídias históricas produzidas
```

## Fontes auditadas

- `docs/mapa-curso.md` — visão geral do curso e N0;
- `docs/mapa-niveis-1-4.md` — objetivos, competências e limites dos Níveis 1–4;
- `docs/matriz-progressao-global.md` — progressão transversal N0→N4;
- `docs/checkpoint-saida-nivel-0.md`;
- `docs/checkpoint-saida-nivel-1.md`;
- `docs/checkpoint-saida-nivel-2.md`;
- `docs/checkpoint-saida-nivel-3.md`;
- `docs/areas-nivel-4.md` — M2;
- `docs/unidades-nivel-4.md` — M3 e arquitetura antecipada da saída;
- `docs/licoes-nivel-4.md` + `docs/licoes-nivel-4-u1.md` ... `docs/licoes-nivel-4-u9.md` — M4;
- `content/units/401-*` ... `content/units/409-*` — lições e verificações integradas M5;
- `content/levels/004-dominio/exit-verification.json` — `N4-EXIT-V01`;
- `docs/gate-normativo-nivel-4-u5-u7.md`;
- `docs/referencias-gramatica-nivel-4-u5-u7.md`;
- `docs/referencias-gramatica-nivel-4-u5-u7-atualizacao-2026.md`;
- `docs/gate-midia-acessibilidade-nivel-4-u9.md`.

## Critério do checkpoint

Uma competência é considerada curricularmente coberta quando existe cadeia verificável:

```text
competência oficial
→ ensino deliberado
→ prática/evidência em unidade M5
→ transferência em N4-EXIT-V01 quando central ao fechamento
```

A saída não deve repetir nove provas de unidade. Ela mede **autonomia, integração, transferência e revisão** em oito agrupamentos obrigatórios e não compensáveis.

A evidência de uma unidade continua válida quando repetir integralmente a mesma microcompetência na saída seria artificial. Por outro lado, nenhuma competência central de fechamento pode existir apenas no mapa sem prática e evidência.

## Auditoria competência por competência — N4

| # | Competência oficial de saída do N4 | Ensino/evidência M5 | Transferência em `N4-EXIT-V01` | Resultado |
|---|---|---|---|---|
| 1 | Ler textos longos, densos e estruturalmente complexos, ajustando estratégia ao objetivo | U1 + `N4-U01-V01`; retomadas U2/U3/U9 | `N4-EXIT-Q01` exige estratégia explícita, leitura de material novo e revisão após nova evidência | **COBERTA** |
| 2 | Interpretar explícitos, implícitos, ambiguidades, pressupostos, ironias, intertextualidade e efeitos de estilo com evidência | U1, U6 e U9 | Q01 exige inferência/limite/revisão; `N4-EXIT-Q08` exige interpretação estética e relação entre forma/evidência | **COBERTA** |
| 3 | Comparar, avaliar e sintetizar múltiplas fontes preservando divergências e grau de sustentação | U2 + `N4-U02-V01`; retomadas U3/U4/U9 | `N4-EXIT-Q02` exige pergunta, seleção por função, escopo/método, rastreabilidade, síntese e decisão de suficiência | **COBERTA** |
| 4 | Avaliar autoria, contexto, evidência, enquadramento, confiabilidade e estratégias persuasivas | U1, U2, U3 e U9 | Q01 trabalha enquadramento; Q02 trabalha origem/escopo/método; Q03 exige responsabilidade argumentativa; Q08 trabalha proveniência/circulação | **COBERTA** |
| 5 | Produzir textos longos e complexos com estrutura global coerente, desenvolvimento sustentado e adaptação ao gênero | U4 + `N4-U04-V01`; revisão U5/U6 | `N4-EXIT-Q04` exige projeto, produção longa, primeira versão, revisão global, segunda versão e transferência | **COBERTA COM VALIDAÇÃO GLOBAL ABERTA DEPENDENTE DE AVALIADOR CONFIÁVEL** |
| 6 | Argumentar profundamente com tese, delimitação, evidências, qualificações, contra-argumentos e resposta a objeções | U3 + `N4-U03-V01`; retomada U8 | `N4-EXIT-Q03` exige tese proporcional, evidência, qualificação, objeção/concessão/resposta e revisão após nova evidência | **COBERTA COM VALIDAÇÃO GLOBAL ABERTA DEPENDENTE DE AVALIADOR CONFIÁVEL** |
| 7 | Citar, parafrasear, resumir e integrar fontes responsavelmente, distinguindo voz própria e alheia | U2 e U4 | Q02 exige notas/síntese atribuída; Q04 exige integração rastreável em produção autoral | **COBERTA** |
| 8 | Revisar e editar textos próprios em várias camadas | U4, U5 e U6 | Q04 exige revisão entre versões; `N4-EXIT-Q05` exige diagnóstico e intervenção em camadas | **COBERTA** |
| 9 | Diagnosticar clareza, ambiguidade, redundância, incoerência, registro e organização e propor reescritas justificadas | U5/U6 | Q05 exige priorização, alternativas, correções, manutenção consciente e justificativa | **COBERTA** |
| 10 | Usar gramática normativa e descrição linguística como instrumentos sem absolutizar variedade de prestígio | U5/U7 + gates normativos/descritivos | Q05/Q06 distinguem regra, variante, convenção, consulta, descrição e julgamento social | **COBERTA** |
| 11 | Adaptar registro, tom, densidade, explicitação e vocabulário para audiências/finalidades | U4, U6, U7 e U8 | Q04 exige transferência para outro destino; Q06 trabalha adequação contextual; Q07 exige adaptação oral | **COBERTA** |
| 12 | Produzir e interpretar textos acadêmicos gerais, profissionais, públicos, literários e digitais de alta complexidade geral, respeitando limites de especialização | U4 e U9; famílias complementares distribuídas pelas unidades | Q04 amostra gênero geral de decisão pública + transferência; Q08 amostra literatura/digital; variedade adicional permanece comprovada nas verificações das unidades | **COBERTA** |
| 13 | Participar de apresentações, debates e discussões complexas, sintetizando posições e respondendo a objeções | U8 + `N4-U08-V01` | `N4-EXIT-Q07` exige compreensão, síntese, plano, tentativa oral, esclarecimento, objeção, negociação e autorrevisão | **COBERTA COM LIMITE DE VALIDAÇÃO EXTERNA PARA INTELIGIBILIDADE/PROSÓDIA** |
| 14 | Interpretar literatura autonomamente relacionando forma, voz, estrutura, imagens, contexto, tradição e efeitos estéticos | U9 + `N4-U09-V01` | `N4-EXIT-Q08` exige interpretação própria, comparação de leitura, forma/voz, intertexto e revisão justificada | **COBERTA** |
| 15 | Analisar criticamente relações entre verbal, imagem, som, edição, interface e circulação em produções multimodais | U9; preparação transversal U2/U4/U8 | Q08 exige sequência/adaptação, proveniência, circulação, acessibilidade e limite do que realmente exigiria mídia sensorial | **COBERTA** |
| 16 | Refletir sobre variação, mudança, norma, estilo, identidade e poder com precisão adequada ao curso | U6/U7 + `N4-U07-V01` | `N4-EXIT-Q06` separa uso, descrição, norma/convenção e julgamento social, incluindo prestígio/estigma e limite de inferência histórica | **COBERTA** |
| 17 | Reconhecer limites, consultar fontes confiáveis e revisar decisões quando necessário | transversal, especialmente U1/U2/U3/U5/U7/U9 | Q01 revisa interpretação; Q02 decide suficiência; Q03 revisa tese; Q05 exige consulta; Q06 escolhe fonte pela pergunta; Q08 reconhece limite sensorial/evidencial | **COBERTA** |

### Resultado da cobertura N4

```text
17 competências oficiais
17 competências com ensino/evidência identificáveis
17 competências com transferência suficiente ou evidência de unidade preservada
0 competências sem rota curricular
```

**Cobertura: 17/17.**

## Validade de `N4-EXIT-V01`

A saída implementa a arquitetura antecipada no M3 em oito agrupamentos:

```text
1. leitura estratégica + revisão de interpretação
2. pesquisa + síntese multifuente rastreável
3. argumentação própria revisável pela evidência
4. autoria longa + transferência entre gênero/audiência/meio
5. edição + estilo + consulta linguística
6. língua + norma + variação + adequação contextual
7. comunicação oral complexa
8. literatura + multimodalidade + autoria digital acessível
```

Todos são obrigatórios.

```text
bom desempenho em um bloco
≠ compensação pela ausência de outro bloco
```

A saída usa materiais novos e controlados e não introduz conhecimento factual externo necessário para responder.

## Revisão dos gates

### Gate normativo U5/U7

**SATISFEITO.**

A saída não cria catálogo normativo novo. Ela conserva as cinco categorias oficiais:

```text
REGRA_PRODUTIVA
VARIANTE_DOCUMENTADA
CONVENCAO_FORMAL_EDITORIAL
CASO_DE_CONSULTA
ESCOLHA_ESTILISTICA
```

Consequências preservadas:

- variante documentada não vira erro;
- convenção institucional só é exigida quando o padrão é declarado;
- preferência editorial não vira regra universal;
- descrição de uso não é respondida automaticamente por fonte normativa;
- consulta pode ser evidência de domínio;
- formalidade não equivale a superioridade linguística.

O addendum de 2026 mantém atualizado o contexto institucional do Manual da Presidência sem alterar o recorte pedagógico congelado.

### Gate de mídia/acessibilidade U9

**SATISFEITO.**

A saída não cria nova dependência de mídia humana.

- TTS é usado apenas quando o significado verbal é o alvo e timbre/prosódia específicos não determinam a resposta;
- replay não é penalizado;
- relações visuais, temporais e de interface decisivas possuem equivalente semântico;
- cor, posição ou aparência não são pistas exclusivas;
- se timbre, atuação, movimento ou timing perceptivo real fossem o objeto da pergunta, a resposta correta poderia ser reconhecer que a representação disponível é insuficiente.

Nenhum novo `mediaId` ou item de produção de mídia é exigido pelo fechamento N4.

## Auditoria da progressão N0 → N4

Os checkpoints anteriores registram:

```text
N0 — APROVADO curricularmente
N1 — APROVADO curricularmente
N2 — APROVADO curricularmente
N3 — APROVADO curricularmente
N4 — cobertura 17/17 e saída integrada concluída
```

A matriz global mantém progressão coerente nos grandes domínios:

- alfabetização/sistema de escrita;
- ortografia e acentuação;
- morfologia/formação de palavras;
- sintaxe;
- semântica/vocabulário;
- leitura/interpretação;
- produção textual;
- coesão/coerência;
- argumentação;
- gêneros;
- pontuação;
- oralidade;
- registro/adequação;
- variação/norma;
- estilo;
- literatura;
- multimodalidade/letramento digital;
- pesquisa/fontes/uso da informação.

A progressão global preserva a lógica:

```text
fundação
→ introdução e desenvolvimento
→ sistematização
→ aprofundamento
→ domínio crítico, flexível e revisável
```

Não foi encontrada descontinuidade que exija criar nova área, unidade ou lição antes do fechamento curricular.

## Lacunas encontradas neste checkpoint

**Nenhuma lacuna curricular obrigatória remanescente foi identificada.**

O checkpoint não encontrou:

- competência oficial do N4 sem ensino deliberado;
- competência central sem evidência;
- dependência normativa nova fora do gate;
- dependência sensorial nova escondida;
- domínio global que desapareça no percurso N0→N4;
- necessidade de reabrir U1–U9 apenas para aumentar quantidade de conteúdo.

Portanto não há motivo curricular para reabrir as unidades concluídas antes de encerrar o curso.

## Dependências que permanecem, mas NÃO bloqueiam o fechamento curricular

### 1. Publicação/frontend

O conteúdo curricular desenvolvido não significa que `content/course.json` já publique todas as unidades nem que o frontend implemente todos os renderers necessários.

Isso é um **marco técnico de produto**, separado do desenvolvimento curricular.

### 2. Mídias humanas antigas do N0

O checkpoint do N0 já registrou mídias humanas obrigatórias pendentes em conteúdos iniciais cujo alvo depende de estímulo sonoro controlado.

Isso é uma **dependência de produção de mídia/publicação**, não uma lacuna na arquitetura curricular N0→N4.

### 3. Avaliação de produção escrita aberta

A aplicação pode verificar estrutura e registrar processo, mas não deve declarar automaticamente qualidade global de texto livre, síntese, argumentação, edição ou interpretação aberta sem avaliador confiável.

Estados de evidência pendente continuam válidos.

### 4. Produção oral

```text
tentativa oral registrada
≠ inteligibilidade validada
```

Inteligibilidade, pronúncia, prosódia e qualidade global da fala dependem de observação/avaliação confiável apropriada.

### 5. Validação empírica com alunos reais

O curso possui coerência curricular interna e rotas de evidência, mas este checkpoint não substitui teste de usabilidade, estudo pedagógico com alunos reais, análise de dificuldade empírica ou calibração de instrumentos de avaliação.

Esses trabalhos podem gerar melhorias futuras sem invalidar o fechamento curricular atual.

## O que significa fechar curricularmente o curso

Significa que o projeto possui um percurso completo e coerente de Fundamentos a Domínio:

```text
N0 — Fundamentos ✓
N1 — Básico ✓
N2 — Intermediário ✓
N3 — Avançado ✓
N4 — Domínio ✓
```

Cada nível possui:

- objetivo e limites;
- arquitetura curricular compatível com sua maturidade;
- conteúdo M5 desenvolvido;
- verificações integradas de unidade;
- verificação de saída;
- checkpoint de cobertura/transferência.

No N4, as 17 competências oficiais foram auditadas individualmente e a saída exige transferência integrada em oito blocos obrigatórios.

## O que NÃO significa

O fechamento curricular não significa:

```text
aluno individual aprovado automaticamente
curso empiricamente validado com população real
frontend pronto
catálogo publicado completo
mídia histórica toda produzida
resposta aberta plenamente autoavaliável
fala automaticamente validada
currículo congelado para sempre
```

Mudanças futuras podem ser feitas quando houver evidência concreta de melhoria. Fechar curricularmente significa que **não há lacuna obrigatória conhecida que exija continuar expandindo conteúdo antes de mudar de fase do projeto**.

## Resultado do checkpoint

**APROVADO — N4 curricularmente completo.**

**APROVADO — percurso curricular N0→N4 completo.**

```text
N4 M1 ✓
N4 M2 ✓
N4 M3 ✓
N4 M4 ✓
N4 U1–U9 M5 ✓
N4-EXIT-V01 ✓
checkpoint final N4 ✓

CURRÍCULO N0→N4 ✓
```

Não há unidade curricular adicional obrigatória pendente.

## Próxima fase recomendada

Com o currículo fechado, o próximo trabalho deixa de ser **criar mais conteúdo por padrão**.

A fase seguinte deve tratar a diferença entre currículo desenvolvido e produto utilizável/publicável, priorizando:

```text
1. auditoria técnica de publicação
   → content/course.json
   → descoberta/carregamento das unidades
   → contratos de schema/renderer

2. frontend/renderer
   → garantir que tipos de atividade existentes possam ser apresentados
   → acessibilidade e navegação
   → estados de resposta/evidência

3. mídia pendente
   → resolver apenas mídias realmente obrigatórias da fila
   → manter TTS/representação semântica quando suficiente

4. avaliação confiável de respostas abertas
   → definir arquitetura de avaliação sem fingir certeza automática
   → preservar estados de evidência pendente

5. testes end-to-end e validação com usuários
   → conteúdo real do N0 ao N4
   → progresso, retomada e persistência
   → acessibilidade
   → calibração pedagógica baseada em evidência
```

O currículo pode ser reaberto futuramente por evidência real de lacuna ou melhoria, mas **não precisa ser ampliado para justificar continuidade do projeto**.
