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

**M5 concluído curricularmente.**

```text
M1 ✓ — objetivo + 17 competências oficiais + 9 grandes responsabilidades
M2 ✓ — 9 áreas dimensionadas + revisão horizontal 17/17
M3 ✓ — 9 unidades integradas + cobertura 17/17 + saída antecipada
M4 ✓ — 93 lições + 9 verificações integradas
M5 ✓ — U1–U9 + N4-EXIT-V01 + checkpoint final
```

Fontes:

- M2: `docs/areas-nivel-4.md`;
- M3: `docs/unidades-nivel-4.md`;
- M4 consolidado: `docs/licoes-nivel-4.md`;
- M4 por unidade: `docs/licoes-nivel-4-u1.md` ... `docs/licoes-nivel-4-u9.md`;
- saída: `content/levels/004-dominio/exit-verification.json`;
- checkpoint final: `docs/checkpoint-saida-nivel-4.md`.

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

### Estado M5

```text
U1 ✓ — 10 lições + N4-U01-V01
U2 ✓ — 11 lições + N4-U02-V01
U3 ✓ — 10 lições + N4-U03-V01
U4 ✓ — 11 lições + N4-U04-V01
U5 ✓ — 11 lições + N4-U05-V01; gate normativo ✓
U6 ✓ — 9 lições + N4-U06-V01
U7 ✓ — 10 lições + N4-U07-V01; gate normativo ✓
U8 ✓ — 9 lições + N4-U08-V01
U9 ✓ — 12 lições + N4-U09-V01; gate de mídia/acessibilidade ✓
N4-EXIT-V01 ✓ — 8 agrupamentos obrigatórios; cobertura 17/17
checkpoint final ✓ — 17/17 auditadas; N0→N4 fechado curricularmente
```

U1: `content/units/401-leitura-estrategica-alta-complexidade-revisao-interpretacao/`.

U2: `content/units/402-pesquisa-orientada-problema-fontes-rastreabilidade/`.

U3: `content/units/403-argumentacao-complexa-evidencia-responsabilidade-epistemica/`.

U4: `content/units/404-autoria-avancada-generos-complexos-transferencia/`.

U5: `content/units/405-edicao-alto-nivel-precisao-consulta-linguistica/`.

U6: `content/units/406-estilo-registro-projeto-voz/`.

U7: `content/units/407-lingua-norma-variacao-mudanca-identidade-poder/`.

U8: `content/units/408-oralidade-complexa-sintese-negociacao-debate/`.

U9: `content/units/409-literatura-multimodalidade-autoria-intermedial-digital/`.

Saída: `content/levels/004-dominio/exit-verification.json`.

Checkpoint: `docs/checkpoint-saida-nivel-4.md`.

O M5 da U1 consolidou os guard rails do nível:

- estratégia pode mudar ou ser mantida, desde que a decisão seja justificada;
- mais de uma arquitetura textual pode ser defensável;
- condições, exceções e ressalvas decisivas não podem ser apagadas;
- repetição não é erro automático e proximidade não decide referente sozinha;
- implícito, ambiguidade, ironia e intertextualidade exigem evidência;
- enquadramento não equivale automaticamente a manipulação;
- conclusão deve ser calibrada pela força da evidência;
- nova evidência pode justificar enfraquecer, ampliar, abandonar ou manter uma interpretação;
- síntese crítica própria e revisão explícita não são compensáveis por tarefas fechadas.

O M5 da U2 consolidou a pesquisa como processo rastreável:

- a busca começa por pergunta e lacuna informacional, não por acúmulo de resultados;
- plano e consulta podem mudar quando os resultados revelarem nova necessidade;
- tipo de fonte não cria hierarquia automática de confiabilidade;
- autoria, data, origem, versão, escopo, método e unidade de análise alteram o uso possível da fonte;
- afirmações secundárias devem ser rastreadas até origem suficiente quando o contexto exigir;
- fontes que dependem da mesma origem não são confirmações independentes;
- republicação/recorte não provam manipulação automaticamente;
- triangulação preserva divergências e explicações alternativas;
- notas precisam separar voz da fonte, paráfrase, citação, inferência própria e dúvida;
- quantidade de fontes não pontua;
- parar e qualificar pode ser melhor que continuar buscando;
- `não há evidência suficiente` pode ser conclusão correta;
- dossiê e decisão de suficiência próprios não são compensáveis por itens fechados.

O M5 da U3 consolidou argumentação como responsabilidade sobre evidência:

- tese precisa responder ao problema e ter alcance proporcional ao apoio real;
- cadeia de afirmação, razão, evidência, inferência e conclusão deve ser reconstruível;
- dado verdadeiro pode ser irrelevante para uma afirmação específica;
- generalização e causalidade exigem controle de escopo e explicações alternativas;
- linguagem epistêmica deve calibrar certeza sem exagero nem cautela vazia;
- objeção forte deve representar fielmente a posição alheia;
- concessão precisa alterar de verdade o argumento quando a objeção atingir ponto válido;
- persuasão pode variar em tom e enquadramento, mas não distorcer fatos, atribuições ou limites;
- nova evidência pode fortalecer, enfraquecer, suspender ou não alterar a tese;
- mudança e manutenção de posição só contam quando justificadas pela relação com a evidência;
- primeira e segunda versão autorais são obrigatórias e não são compensáveis por itens fechados;
- posição ideológica não é critério de pontuação.

O M5 da U4 consolidou autoria longa e transferência:

- projeto textual explicita finalidade, audiência, gênero, suporte e circulação antes da redação;
- gênero pouco familiar é aprendido por comparação de modelos e hipóteses revisáveis, não por template universal;
- macroplanejamento é funcional e pode mudar durante a escrita;
- desenvolvimento é dimensionado por função, não por número de palavras/parágrafos;
- citação, paráfrase, resumo, comentário e voz própria permanecem distinguíveis e rastreáveis;
- exposição/análise longa precisa progredir em vez de repetir a mesma conclusão;
- gêneros acadêmicos gerais não simulam especialização metodológica inexistente;
- gêneros profissionais/públicos não simulam autoridade profissional especializada;
- gêneros digitais/híbridos preservam contexto, versão e circulação sem pontuar polimento gráfico;
- transferência modifica arquitetura, seleção, explicitação e registro quando necessário sem inventar fatos;
- primeira versão longa, revisão global, segunda versão e transferência são evidências obrigatórias;
- quantidade de mudanças e extensão não pontuam; manutenção consciente pode ser a melhor decisão.

O M5 da U5 consolidou edição como julgamento priorizado e auditável:

- diagnóstico vem antes da reescrita e problemas globais precedem polimento local;
- referenciação é revisada pela recuperabilidade real do referente, não por aversão mecânica à repetição;
- sintaxe e pontuação são comparadas por clareza, foco, ritmo e estrutura, sem premiar frases curtas;
- regra, variante, convenção, consulta e escolha estilística são categorias distintas;
- itens normativos fechados ficam estritamente dentro do recorte documentado;
- variante documentada não vira erro e convenção institucional só é exigida quando declarada;
- grafia lexical incerta exige consulta apropriada, especialmente VOLP atual;
- precisão lexical não é rebuscamento e não pode ampliar alcance factual;
- preservar texto adequado é competência editorial, não ausência de trabalho;
- editar texto alheio exige distinguir correção, sugestão, pergunta ao autor e preservação de voz;
- `N4-U05-V01` exige onze agrupamentos obrigatórios, incluindo consulta, fronteira normativa, edição de texto alheio e histórico de decisões.

O M5 da U6 consolidou estilo como projeto funcional e transferível:

- projeto estilístico precede decisões locais e explicita finalidade, audiência e efeitos desejados;
- primeira pessoa, distância e impessoalidade são recursos funcionais, não escalas automáticas de rigor;
- tom e registro dependem da relação com a audiência; formalidade máxima não pontua;
- concisão e explicitação são ajustadas sem apagar condições, ressalvas ou contexto necessário;
- escolha lexical considera significado, alcance, registro, conotação e consistência, sem premiar raridade;
- ritmo, extensão de frase e pontuação são decisões de fluxo e ênfase, não proxies de qualidade;
- repetição, paralelismo, ordem e saliência podem ser preservados ou alterados conforme função;
- modalidade e visibilidade do agente precisam respeitar força da evidência e responsabilidade enunciativa;
- transferência estilística altera superfície e organização quando necessário sem exigir cópia mecânica da voz;
- `N4-U06-V01` exige projeto, versão-base, duas adaptações e histórico explícito de mudanças/permanências; soluções estilísticas alternativas são aceitas quando funcionais e justificadas.

O M5 da U7 consolidou análise linguística contextual e socialmente responsável:

- uso observado, descrição empírica, norma/convenção e julgamento social são categorias diferentes;
- regra produtiva, variante documentada, convenção editorial, consulta e escolha estilística preservam seus escopos;
- variação regional/social/situacional/histórica não autoriza inferir inteligência, origem ou identidade total por pista isolada;
- mudança linguística exige evidência temporal/contextual e não é sinônimo de decadência;
- prestígio e estigma são avaliações/consequências sociais, não propriedades estruturais de superioridade linguística;
- repertório permite adaptação contextual sem exigir abandono da variedade ou identidade pessoal;
- feedback útil separa exigência contextual do julgamento global do falante;
- fontes normativas, ortográficas, editoriais e descritivas são escolhidas pela pergunta que podem responder;
- afirmações públicas sobre “certo”, “errado” e “o português” são auditadas por escopo e evidência, não pela identidade de quem fala;
- adaptação formal pode ser necessária sem desqualificar a forma cotidiana de origem;
- `N4-U07-V01` exige dez agrupamentos, incluindo consulta de fontes, auditoria de afirmação pública, adaptação contextual e justificativa integrada.

O M5 da U8 consolidou oralidade complexa como processo estratégico, interacional e revisável:

- escuta começa por objetivo e permite replay sem penalizar; memória literal e velocidade não são proxies de compreensão;
- notas e síntese preservam vozes, atribuições, convergências, divergências e ressalvas sem exigir transcrição;
- apresentação é planejada por função, prioridade e audiência, não por roteiro integral ou performance teatral;
- evidência oral mantém origem identificável, distingue fato/inferência e admite lacunas sem improvisar dados;
- adaptação de audiência preserva conteúdo decisivo e usa apoio acessível sem polimento visual como critério;
- perguntas e reparo comunicativo variam conforme a falha e podem incluir admissão explícita de desconhecimento;
- objeções são reformuladas fielmente antes da resposta; concessão, manutenção ou mudança de posição só contam pela justificativa;
- negociação separa definições, escopos, convergências e divergências sem transformar consenso em obrigação;
- tentativa oral registrada comprova processo, não inteligibilidade, pronúncia, prosódia ou qualidade global;
- `N4-U08-V01` exige dez agrupamentos obrigatórios e torna escuta/síntese, plano, tentativa e autorrevisão não compensáveis.

O M5 da U9 consolidou literatura, multimodalidade e autoria digital como competências integradas mas não intercambiáveis:

- interpretação literária começa por leitura própria sustentada por evidência e limite reconhecido;
- voz, perspectiva, estrutura e temporalidade são analisadas pela distribuição de informação, não por terminologia como fim;
- poesia relaciona forma, repetição, sintaxe, quebra e ordem a efeitos sem reduzir qualidade a métrica/rima;
- figuratividade, ambiguidade e ironia exigem pistas e podem preservar indeterminação real;
- intertextualidade usa repertório fornecido e contexto funcional, sem prova de memória cultural secreta;
- interpretação concorrente pode motivar revisão ou manutenção justificada; popularidade e mudança de posição não pontuam;
- multimodalidade preserva relações, valores, ordem e equivalentes acessíveis sem depender de polimento visual;
- montagem e timing representados são analisados apenas dentro do que a estrutura fornece; reconhecer necessidade de mídia real é desempenho correto quando timbre, atuação, movimento ou timing exato forem decisivos;
- proveniência separa autoria, edição, repostagem e contexto de plataforma sem inventar causalidade algorítmica;
- adaptação é avaliada por ganhos, perdas e transformação funcional, não por fidelidade máxima;
- autoria multimodal exige função por modalidade, atribuição e equivalentes acessíveis para toda pista decisiva;
- `N4-U09-V01` mantém literatura e multimodal/digital como eixos independentes e exige treze agrupamentos, incluindo produção integrada e reflexão autoral.

O `N4-EXIT-V01` consolida a transferência do nível em oito agrupamentos obrigatórios:

- leitura estratégica + revisão de interpretação com nova evidência;
- pesquisa orientada por problema + síntese multifuente rastreável;
- argumentação própria que precisa ser reavaliada diante de evidência nova;
- autoria longa em primeira/segunda versão + transferência para destino distinto;
- edição em camadas + estilo + consulta linguística dentro do gate normativo;
- análise de uso, descrição, norma/convenção e julgamento social sem hierarquização de falantes;
- escuta/apresentação/objeção/negociação oral com limite explícito de validação acústica;
- literatura + multimodalidade + proveniência + autoria digital acessível, incluindo reconhecimento de quando mídia real seria indispensável;
- as 17 competências oficiais estão cobertas em pelo menos um agrupamento obrigatório;
- nenhum agrupamento pode ser compensado por média global e produção aberta não recebe validação automática falsa.

### Gate normativo N4-U5/U7

- `docs/gate-normativo-nivel-4-u5-u7.md` — **SATISFEITO**;
- `docs/referencias-gramatica-nivel-4-u5-u7.md` — referência normativa/descritiva resultante da pesquisa, revisada em 17 de agosto de 2026;
- `docs/referencias-gramatica-nivel-4-u5-u7-atualizacao-2026.md` — addendum que registra o contexto jurídico atual do Manual da Presidência: o Decreto nº 12.002/2024 revogou o Decreto nº 9.191/2017 e mantém, em seu art. 75, a aplicação do Manual aos atos abrangidos;
- fontes ortográficas oficiais foram separadas de manuais editoriais/institucionais e pesquisa descritiva;
- `REGRA_PRODUTIVA`, `VARIANTE_DOCUMENTADA`, `CONVENCAO_FORMAL_EDITORIAL`, `CASO_DE_CONSULTA` e `ESCOLHA_ESTILISTICA` têm funções distintas;
- variantes documentadas não recebem gabarito único genérico;
- convenção institucional só pode ser exigida quando o padrão estiver declarado;
- colocação pronominal formal não é tratada como descrição total do português brasileiro;
- consulta é competência de domínio, não falha automática;
- U5, U7 e a saída estão dentro desse recorte;
- reabrir o gate apenas se uma futura necessidade exigir congelar resposta específica fora do documento de referências.

Gate de mídia/acessibilidade do N4:

- `docs/gate-midia-acessibilidade-nivel-4-u9.md` — **SATISFEITO NO M5 DA U9 E NA SAÍDA; nenhuma nova mídia humana obrigatória**;
- a autoria M5 e a saída usam recursos semânticos já aprovados e TTS quando som específico não determina resposta;
- nenhum `mediaId` novo foi criado e nenhuma entrada nova na fila de mídia é necessária;
- reabrir somente se uma futura tarefa tornar timbre, prosódia específica, atuação, movimento contínuo ou timing audiovisual real evidência decisiva.

O checkpoint final confirma **17/17 competências oficiais do N4** com ensino, evidência e transferência suficientes. Nenhuma lacuna curricular obrigatória permanece conhecida. Os checkpoints N0, N1, N2 e N3 já estavam aprovados, e a matriz global preserva progressão contínua até N4.

**Resultado: N4 curricularmente completo e percurso curricular N0→N4 completo.**

# Marco ativo

```text
CURRÍCULO
N0 — M5 ✓
N1 — M5 ✓
N2 — M5 ✓
N3 — M5 ✓
N4 — M5 ✓
└── U1–U9 ✓
    ├── N4-EXIT-V01 ✓
    └── checkpoint final ✓

CURRÍCULO N0→N4 ✓
```

# Próxima fase

O próximo marco deixa de ser criação curricular por padrão e passa a ser **produto/publicação**.

Prioridade recomendada:

```text
1. auditoria técnica de publicação
   → content/course.json e descoberta/carregamento real do conteúdo
   → contratos de schema/renderer existentes
   → diferenças entre conteúdo desenvolvido e conteúdo publicável

2. frontend/renderer
   → suportar os tipos de atividade realmente usados
   → navegação, acessibilidade e estados de evidência

3. mídia pendente
   → resolver somente mídias realmente obrigatórias da fila
   → manter TTS/representação semântica quando suficientes

4. avaliação confiável de respostas abertas
   → escrita, síntese, argumentação, edição, interpretação e oralidade
   → não substituir avaliação real por heurística enganosa

5. testes end-to-end e validação com usuários
   → fluxo N0→N4
   → progresso, retomada e persistência
   → acessibilidade
   → calibração pedagógica baseada em evidência
```

O currículo pode ser reaberto futuramente quando teste real, revisão especializada ou evidência pedagógica revelar lacuna concreta. Fechamento curricular não significa congelamento permanente.

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
19. U5/U7 só podem congelar respostas normativas dentro do recorte documentado; caso fechado fora do recorte exige verificação específica e, se necessário, reabertura do gate.
20. U9 não cria mídia humana por variedade; alvo sensorial real reabre o gate antes da produção.
21. Mudança de estratégia ou interpretação não pontua por si; manutenção justificada pode ser a melhor decisão.
22. Fontes dependentes não devem ser contadas como confirmações independentes e a decisão de parar/continuar pesquisando precisa ser justificada pela lacuna, não por quantidade.
23. Em argumentação, tese, objeção, concessão e revisão são avaliadas pelo vínculo com evidência e raciocínio; posição ideológica, agressividade, rigidez ou número de mudanças não são proxies de qualidade.
24. Em autoria longa, gênero, arquitetura, desenvolvimento e transferência são decisões funcionais: extensão, número de seções, quantidade de citações, formalidade máxima ou polimento visual não são proxies de domínio.
25. Aprender gênero por modelos exige distinguir função recorrente de regra universal; poucos modelos não autorizam generalização automática.
26. Transferência entre gênero/audiência/meio deve preservar fatos, atribuições e ressalvas decisivas; mudança superficial de vocabulário não basta.
27. Manual institucional define um padrão de uso para seu domínio; não deve ser convertido automaticamente em regra universal da língua.
28. Variante documentada não recebe gabarito único genérico; convenção editorial precisa ser declarada para poder ser cobrada como convenção.
29. Ortografia lexical incerta deve ser consultada em fonte atual apropriada; memória de regra não substitui consulta quando o item estiver fora do recorte seguro.
30. Em colocação pronominal, adequação à escrita formal e descrição do português brasileiro são dimensões distintas; nenhuma delas autoriza hierarquizar falantes.
31. Edição de domínio prioriza impacto antes de polimento, preserva trechos adequados e registra consultas/manutenções; quantidade de correções não é proxy de qualidade.
32. Em texto alheio, correção necessária, sugestão opcional, pergunta ao autor e preservação são intervenções distintas; o editor não deve reescrever o autor à própria imagem.
33. Em estilo, formalidade, concisão, complexidade, repetição, primeira pessoa, impessoalidade ou raridade lexical só têm valor quando servem ao projeto e à audiência; nenhuma dessas escolhas funciona como proxy universal de qualidade.
34. Transferência de voz deve preservar fatos, responsabilidade e traços autorais funcionais sem exigir semelhança superficial entre versões.
35. Em língua/norma/variação, uso, descrição, norma e julgamento social devem permanecer separados; uma fonte não responde automaticamente perguntas de outra função.
36. Prestígio, estigma e consequência institucional não autorizam inferir inferioridade estrutural, inteligência ou valor pessoal do falante.
37. Mudança linguística exige série/contexto suficiente; forma mais nova, mais antiga, mais frequente ou mais prestigiosa não recebe valor linguístico automático.
38. Em oralidade, replay, tempo de resposta, hesitação e memória literal não são proxies de compreensão ou domínio; o foco é significado, estrutura, evidência e interação.
39. Registro de tentativa oral comprova processo, não inteligibilidade, pronúncia, prosódia ou qualidade global; esses aspectos exigem observação confiável apropriada.
40. Debate e negociação não pontuam vitória, agressividade, consenso ou mudança de posição por si; fidelidade, reparo, evidência, escopo e justificativa são os critérios funcionais.
41. Em literatura, gosto, popularidade de leitura e quantidade de símbolos identificados não substituem evidência; interpretações concorrentes podem coexistir quando sustentadas.
42. Em multimodalidade, aparência, cor, quantidade de modalidades ou fidelidade máxima da adaptação não são proxies de qualidade; informação decisiva precisa permanecer acessível e atribuível.
43. Reconhecer que uma pergunta exige mídia real é competência quando a representação semântica não preserva timbre, atuação, movimento ou timing que sejam justamente o alvo.
44. A saída do N4 exige os oito agrupamentos; nenhum pode ser compensado por média global, itens fechados ou desempenho superior em outro domínio.
45. Cobertura curricular 17/17 não autoriza aprovação automática de um aluno: produções abertas mantêm estados de evidência e dependem de avaliação confiável onde declarado.
46. Currículo fechado não significa currículo imutável: evidência empírica, teste com usuários ou revisão especializada podem justificar reabertura localizada.
47. Depois do fechamento N0→N4, criação de conteúdo novo precisa responder a uma lacuna real; a prioridade padrão passa a ser publicação, renderização, avaliação, mídia obrigatória e validação end-to-end.

# Dependências não curriculares

- mídias humanas antigas do N0;
- frontend ainda sem catálogo/renderer completo;
- respostas abertas dependem de avaliador confiável para validação global;
- inteligibilidade oral depende de observação confiável;
- validação empírica com alunos reais ainda é trabalho futuro.

Essas dependências **não reabrem o currículo por si**. Elas definem a próxima fase do projeto.

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
N4 M5 → content/units/4xx-*
N4 saída → content/levels/004-dominio/exit-verification.json + docs/checkpoint-saida-nivel-4.md
N4 normativo U5/U7 → docs/gate-normativo-nivel-4-u5-u7.md + docs/referencias-gramatica-nivel-4-u5-u7.md + docs/referencias-gramatica-nivel-4-u5-u7-atualizacao-2026.md
N4 mídia/acessibilidade → docs/gate-midia-acessibilidade-nivel-4-u9.md
estado → docs/roadmap-curricular.md
conteúdo → content/
```