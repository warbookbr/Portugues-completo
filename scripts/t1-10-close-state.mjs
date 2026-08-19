import fs from 'node:fs';

function patch(file, edits) {
  let source = fs.readFileSync(file, 'utf8');
  for (const [before, after] of edits) {
    const count = source.split(before).length - 1;
    if (count !== 1) throw new Error(`${file}: trecho esperado ${count === 0 ? 'não encontrado' : `encontrado ${count} vezes`}.`);
    source = source.replace(before, after);
  }
  fs.writeFileSync(file, source);
}

patch('docs/estado-implementacao-classico.md', [
  [
`Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco transversal ativo: T1 — Fundamentos claros e experiência de lição
Plano: docs/plano-fundamentos-claros.md
Skill: .ChatGPT/skills/fundamentos-claros/SKILL.md
Subfase ativa: T1.9 — migração, catálogo, progresso e mídia
Contrato/matriz de migração: CONGELADO / VALIDADO EM CI
Wiring local/Gist + backup: HOMOLOGADO / INATIVO EM PRODUÇÃO
P6 — Feedback por IA: AGUARDANDO T1
Próximo passo exato: fazer a promoção atômica da nova N0-U01/N0-U02, ativando no mesmo lote \`MigratingProgressStorage\` + mapper do sync + \`contentRevision=t1-n0-entry-v2\`, atualizando course.json/manifests/deep-link aliases e reconciliando mídia; não ativar migração sem trocar o catálogo na mesma PR
Blocker global: nenhum
Gate final do Clássico: NÃO SATISFEITO`,
`Fase estratégica: CONCLUIR E HOMOLOGAR O CLÁSSICO
Marco transversal T1 — Fundamentos claros e experiência de lição: HOMOLOGADO
Homologação: docs/homologacao-t1-10.md
Migração T1 \`t1-n0-entry-v2\`: ATIVA / HOMOLOGADA local + Gist
P6 — Feedback por IA: ATIVO
Próximo passo exato: iniciar P6 pelo contrato de feedback opt-in, preservando \`VALIDACAO_PENDENTE\` como padrão para produção aberta e rechecando documentação oficial do provider antes de congelar endpoints/modelo
Blocker global: nenhum
Gate final do Clássico: NÃO SATISFEITO`
  ],
  [
`Enquanto T1 estiver ativo, não iniciar P6 materialmente. O T1 foi autorizado como uma unidade de trabalho completa e pode usar múltiplas PRs sem nova autorização entre subfases previstas.`,
`T1 foi homologado em T1.10. As regras duradouras permanecem nas fontes/skills canônicas; P6 pode avançar materialmente sem reabrir T1, salvo nova evidência concreta de regressão.`
  ],
  [
`| T1 — Fundamentos claros | \`ATIVO\` | PRs #116–#128; T1.9 ativo |
| P6 — Feedback por IA | \`AGUARDANDO T1\` | — |`,
`| T1 — Fundamentos claros | \`HOMOLOGADO\` | PRs #116–#130; \`docs/homologacao-t1-10.md\` |
| P6 — Feedback por IA | \`ATIVO\` | próximo marco após T1 |`
  ],
  [
`T1.9 migração/catálogo/progresso/mídia                     ← ativo
  contrato + mapper de progresso                           ✓ homologado
  wiring local/Gist + backup                               ✓ homologado / inativo
  promoção staged + ativação + catálogo/manifests          ← próximo
  deep-link aliases + reconciliação de mídia
T1.10 validação/homologação`,
`T1.9 migração/catálogo/progresso/mídia                     ✓ homologado
  contrato + mapper de progresso                           ✓
  wiring local/Gist + backup                               ✓ ativo
  promoção + ativação + catálogo/manifests                 ✓
  deep-link aliases + reconciliação de mídia               ✓
T1.10 validação/homologação                                ✓ homologado`
  ],
  [`## T1.9 — migração, catálogo, progresso e mídia

**Estado: ATIVO.**`, `## T1.9 — migração, catálogo, progresso e mídia

**Estado: CONCLUÍDO / HOMOLOGADO.**`],
  [`**Estado: CONCLUÍDO / HOMOLOGADO / INATIVO EM PRODUÇÃO.**`, `**Estado: CONCLUÍDO / HOMOLOGADO / ATIVO EM PRODUÇÃO.**`],
  [
`Guard rail de ativação:

\`\`\`text
infraestrutura pronta
≠ mapper ativo no app

app.js continua SEM configurar migration storage/mapper
→ até a mesma PR que trocar course.json/manifests
\`\`\`

Isso evita a janela inválida “progresso novo + catálogo antigo”. A ativação será atômica com a promoção de conteúdo.

Evidência de integração: PR #128.`,
`Ativação final:

\`\`\`text
catálogo/manifests T1
+ MigratingProgressStorage
+ mapper do ProgressSyncService
+ contentRevision=t1-n0-entry-v2
→ ativos no mesmo lote
\`\`\`

A janela inválida “progresso novo + catálogo antigo” não existiu. Backup local, baseline e Gist são normalizados conservadoramente antes de virarem estado ativo.

Evidência de infraestrutura: PR #128. Evidência de ativação atômica: PR #129.`
  ],
  [
`## Estado de publicação do slice`,
`## T1.10 — validação e homologação

**Estado: CONCLUÍDO / HOMOLOGADO.**

Evidência: \`docs/homologacao-t1-10.md\` + PR #130.

Provas fechadas:

- 17/17 lições iniciais auditadas por ordem, pré-requisito e objetivo público;
- checkpoint N0 reexecutado e realinhado para \`N0-U01-V02\`/\`N0-U02-V02\`;
- transição N0→N1 revalidada;
- CI funcional completo verde, incluindo gate permanente \`Test T1 homologation\`;
- smoke e inspeção visual aprovados em desktop, ~900px, ~680px e 390px;
- ausência de IDs/metadados internos na interface protegida pelo smoke;
- blockers de mídia permanecem locais e explícitos.

## Estado de publicação do slice`
  ],
  [
`Renderer/progresso atual: base técnica homologada
Autoria T1 nova: STAGED / VALIDADA
Experiência de abertura/retomada T1.7: HOMOLOGADA
Navegação secundária T1.8: HOMOLOGADA
Migração T1.9 Gate 1: HOMOLOGADA
Wiring T1.9 Gate 2: HOMOLOGADO / INATIVO
Manifestos públicos: ainda históricos
Mídia obrigatória histórica/reutilizada: pendente, reconciliar na promoção
Publicação das novas U1/U2: NÃO ATIVADA até a troca atômica`,
`Renderer/progresso: HOMOLOGADOS
Autoria T1 U1/U2: PUBLICADA / HOMOLOGADA
Experiência de abertura/retomada T1.7: HOMOLOGADA
Navegação secundária T1.8: HOMOLOGADA
Migração T1.9 local/Gist: ATIVA / HOMOLOGADA
Manifestos públicos: V02 ATIVOS
Deep links históricos: ALIASES ATIVOS
Mídia obrigatória: blockers locais explícitos nos manifests/fila
Publicação pedagógica das interações dependentes de mídia: BLOQUEADA somente onde o estímulo obrigatório falta`
  ],
  [
`Global antes de P6: concluir T1
Imediato T1.9: promoção atômica staged + ativação do mapper + catálogo/manifests/deep links
Mesmo lote/seguinte T1.9: reconciliação final de mídia e estados de publicação
Depois: T1.10 — validação/homologação transversal`,
`Global antes de P6: nenhum — T1 homologado
Ativo: P6 — Feedback por IA no Clássico
Local: resolver mídia obrigatória de U1/U2 quando o marco de publicação exigir esses estímulos
Depois de P6: P7 — ampliação do catálogo N0→N4`
  ]
]);

patch('docs/roadmap-produto.md', [
  [
`MARCO TRANSVERSAL ATIVO → T1 — Fundamentos claros e experiência de lição
T1.1 — pesquisa/auditoria da entrada N0 → CONCLUÍDO
T1.2 — redimensionamento curricular controlado do N0 → CONCLUÍDO
T1.3 — contrato de linguagem para o aluno → CONCLUÍDO
T1.4 — skills/fontes canônicas → CONCLUÍDO
T1.5 — contrato técnico da abertura da lição → CONCLUÍDO
T1.6 — nova autoria inicial → CONCLUÍDO / VALIDADO EM STAGING
T1.7 — frontend de intro/retomada → CONCLUÍDO / HOMOLOGADO
T1.8 — metodologia em Ajuda → CONCLUÍDO / HOMOLOGADO
T1.9 — migração, catálogo, progresso e mídia → ATIVO
P6 — Feedback por IA no Clássico → AGUARDANDO T1
MODO CLÁSSICO REAL → slice funcional com progresso persistente; nova entrada N0 em integração controlada antes de ampliar o produto`,
`T1 — Fundamentos claros e experiência de lição → HOMOLOGADO
T1.1–T1.8 → CONCLUÍDOS / HOMOLOGADOS conforme gates
T1.9 — migração, catálogo, progresso e mídia → CONCLUÍDO / HOMOLOGADO
T1.10 — validação/homologação → CONCLUÍDO / HOMOLOGADO
P6 — Feedback por IA no Clássico → ATIVO
MODO CLÁSSICO REAL → slice funcional com progresso persistente e nova entrada N0 homologada; próximo marco é feedback IA opt-in`
  ],
  [
`Enquanto T1 estiver ativo, \`docs/plano-fundamentos-claros.md\` e \`.ChatGPT/skills/fundamentos-claros/SKILL.md\` governam a execução e têm precedência operacional sobre iniciar P6.`,
`T1 está homologado. Suas regras duradouras permanecem nas fontes/skills canônicas; o cursor operacional volta a P6.`
  ],
  [
`Slice histórico de publicação/descoberta:

\`\`\`text
N0-U01 → 8 lições + verificação
N4-U09 → 12 lições + verificação
\`\`\`

\`course.json\` v2, manifests, registry de competências estáveis e integridade/descoberta em CI estão homologados. A estrutura histórica de N0-U01 será migrada por T1 sem invalidar a prova técnica de P3. Demais unidades entram progressivamente em P7.`,
`O P3 homologou o pipeline inicial de catálogo/manifests. Após T1, o slice publicado usado para regressão é:

\`\`\`text
N0-U01 → 7 lições + V02
N0-U02 → 10 lições + V02
N4-U09 → 12 lições + V01
\`\`\`

\`course.json\` v2, manifests, registry de competências estáveis e integridade/descoberta em CI continuam homologados. Demais unidades entram progressivamente em P7.`
  ],
  [`20/20 lições
+ 2/2 verificações
→ sem unsupported`, `29/29 lições
+ 3/3 verificações
→ sem unsupported`],
  [`N0-U01 → BLOCKED somente pelos áudios controlados obrigatórios pendentes no desenho histórico
N4-U09 → READY`, `N0-U01 → BLOCKED somente por mídia obrigatória local ainda pendente
N0-U02 → BLOCKED somente por mídia obrigatória local ainda pendente
N4-U09 → READY`],
  [`**Estado: ATIVO / AUTORIZADO.**`, `**Estado: HOMOLOGADO.**`],
  [
`T1.6 nova autoria inicial                                  ✓ staged + validada
T1.7 frontend de intro/fluxo                               ✓ homologado
T1.8 metodologia em Ajuda                                  ✓ homologado
T1.9 migração/catálogo/progresso/mídia                     ← ativo
T1.10 validação/homologação`,
`T1.6 nova autoria inicial                                  ✓
T1.7 frontend de intro/fluxo                               ✓
T1.8 metodologia em Ajuda                                  ✓
T1.9 migração/catálogo/progresso/mídia                     ✓
T1.10 validação/homologação                                ✓`
  ],
  [
`- novas U1/U2 estão validadas em staging e aguardam promoção/migração em T1.9;`,
`- novas U1/U2 foram promovidas de forma atômica em T1.9 e estão publicadas no slice ativo;`
  ],
  [`**Estado: AGUARDANDO T1.**

P6 volta a ser marco ativo somente quando \`CL-T1-FUNDAMENTOS-CLAROS\` estiver homologado.`, `**Estado: ATIVO.**

T1 foi homologado em T1.10; P6 volta a ser o marco ativo do Modo Clássico.`],
  [
`## Próximo passo oficial

\`\`\`text
T1.9 — migração, catálogo, progresso e mídia
→ congelar/validar a matriz de migração antes de alterar IDs publicados
→ promover o staging de N0-U01/N0-U02 de forma coerente com catálogo/manifests
→ atualizar course.json, manifests, deep links e testes de descoberta
→ migrar/normalizar progresso de forma conservadora, sem atribuir domínio por coincidência de nome ou posição
→ reconciliar mídia e bloquear somente o escopo que realmente depende de estímulo pendente
→ seguir docs/redimensionamento-t1-2-n0.md e docs/plano-fundamentos-claros.md
\`\`\``,
`## Próximo passo oficial

\`\`\`text
P6 — Feedback por IA no Clássico
→ reler docs/avaliacao-ia.md + regras BYOK/segurança
→ verificar documentação oficial atual do provider antes de congelar API/modelo
→ implementar feedback opt-in sem transformar IA em autoridade de domínio
→ preservar VALIDACAO_PENDENTE quando a policy exigir avaliador confiável
→ manter falha/ausência de IA sem perda da resposta ou bloqueio indevido do percurso
\`\`\``
  ]
]);

patch('docs/plano-fundamentos-claros.md', [
  [
`[ ] início do N0 realmente parte do básico
[ ] ordem curricular nova está documentada
[ ] primeiras unidades/lições reais foram atualizadas/criadas
[ ] texto público está simples e separado do objetivo técnico
[ ] tela inicial da lição está limpa
[ ] progressão por etapas continua funcional
[ ] metodologia saiu do rodapé
[ ] progresso/IDs antigos foram tratados com segurança
[ ] skills canônicas incorporaram o método
[ ] CI passou
[ ] inspeção visual passou
[ ] estado/roadmaps foram atualizados`,
`[x] início do N0 realmente parte do básico
[x] ordem curricular nova está documentada
[x] primeiras unidades/lições reais foram atualizadas/criadas
[x] texto público está simples e separado do objetivo técnico
[x] tela inicial da lição está limpa
[x] progressão por etapas continua funcional
[x] metodologia saiu do rodapé
[x] progresso/IDs antigos foram tratados com segurança
[x] skills canônicas incorporaram o método
[x] CI passou
[x] inspeção visual passou
[x] estado/roadmaps foram atualizados`
  ],
  [
`T1 — HOMOLOGADO
→ P6 — Feedback por IA volta a ser o marco ativo`,
`T1 — HOMOLOGADO em 2026-08-19
→ evidência: docs/homologacao-t1-10.md
→ P6 — Feedback por IA volta a ser o marco ativo`
  ]
]);

patch('PROJECT_INDEX.md', [
  [
`- \`docs/roadmap-produto.md\` — ordem e condições dos marcos da fase de produto/publicação; P1–P5 homologados, T1 ativo e P6 aguardando T1.
- \`docs/plano-fundamentos-claros.md\` — **plano transversal ativo** para reorganizar a entrada N0, simplificar a linguagem pedagógica, criar a nova abertura de lição, realocar Metodologia e preservar progresso/IDs.`,
`- \`docs/roadmap-produto.md\` — ordem e condições dos marcos da fase de produto/publicação; P1–P5 e T1 homologados, P6 ativo.
- \`docs/plano-fundamentos-claros.md\` — plano transversal **homologado** que reorganizou a entrada N0, linguagem pedagógica, abertura de lição, Metodologia e compatibilidade de progresso/IDs.`
  ],
  [
`- \`docs/t1-9-integracao-atomica-n0.md\` — registro da promoção atômica de catálogo, manifests, migração local/Gist, aliases históricos e reconciliação de mídia da T1.9.`,
`- \`docs/t1-9-integracao-atomica-n0.md\` — registro da promoção atômica de catálogo, manifests, migração local/Gist, aliases históricos e reconciliação de mídia da T1.9.
- \`docs/homologacao-t1-10.md\` — **fechamento canônico do T1**: checkpoint N0 reexecutado, auditoria das 17 lições, transição N0→N1, CI, inspeção visual e checklist final.`
  ],
  [
`- \`.ChatGPT/skills/fundamentos-claros/SKILL.md\` — skill operacional obrigatória enquanto T1 estiver ativo; tem precedência sobre iniciar P6.`,
`- \`.ChatGPT/skills/fundamentos-claros/SKILL.md\` — histórico operacional do T1 homologado e referência para regressões futuras da entrada clara.`
  ],
  [
`→ se T1 estiver ativo: docs/plano-fundamentos-claros.md
→ se T1.2 estiver concluído: docs/redimensionamento-t1-2-n0.md
→ se T1.9 estiver ativo: docs/migracao-t1-9-n0.md
→ se houver autoria/copy pública: docs/linguagem-aluno.md
→ se T1 estiver ativo: .ChatGPT/skills/fundamentos-claros/SKILL.md`,
`→ docs/homologacao-t1-10.md para o fechamento da entrada N0
→ docs/redimensionamento-t1-2-n0.md para a arquitetura U1/U2
→ docs/migracao-t1-9-n0.md para compatibilidade histórica/progresso
→ se houver autoria/copy pública: docs/linguagem-aluno.md
→ .ChatGPT/skills/fundamentos-claros/SKILL.md quando houver regressão/revisão da entrada T1`
  ],
  [
`\`docs/roadmap-produto.md\` diz **qual marco vem agora**. \`docs/estado-implementacao-classico.md\` diz **onde exatamente o trabalho parou dentro dele**. Enquanto T1 estiver ativo, \`docs/plano-fundamentos-claros.md\` define as subfases e gates autorizados.`,
`\`docs/roadmap-produto.md\` diz **qual marco vem agora**. \`docs/estado-implementacao-classico.md\` diz **onde exatamente o trabalho parou dentro dele**. T1 está homologado; \`docs/homologacao-t1-10.md\` registra o fechamento e as proteções que continuam válidas.`
  ],
  [
`Durante T1.9, para U1/U2 prevalecem \`docs/redimensionamento-t1-2-n0.md\` + \`docs/migracao-t1-9-n0.md\`; a autoria nova já está validada em staging e os caminhos históricos permanecem ativos somente até a promoção coerente de catálogo/manifests. U3–U6 continuam canônicos sem alteração.`,
`Para U1/U2, a arquitetura T1 publicada é explicada por \`docs/redimensionamento-t1-2-n0.md\`, a compatibilidade histórica por \`docs/migracao-t1-9-n0.md\` e a homologação final por \`docs/homologacao-t1-10.md\`. U3–U6 continuam canônicos sem alteração.`
  ]
]);

console.log('Fontes canônicas sincronizadas: T1 homologado, P6 ativo.');
