import fs from 'node:fs';

function replaceOnce(file, before, after) {
  let source = fs.readFileSync(file, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado encontrado ${count} vez(es).`);
  source = source.replace(before, after);
  fs.writeFileSync(file, source);
}

function insertAfter(file, anchor, addition) {
  let source = fs.readFileSync(file, 'utf8');
  if (source.includes(addition.trim())) return;
  if (!source.includes(anchor)) throw new Error(`${file}: âncora não encontrada.`);
  source = source.replace(anchor, `${anchor}${addition}`);
  fs.writeFileSync(file, source);
}

replaceOnce('docs/estado-implementacao-classico.md',
`P7 — Ampliação do catálogo Clássico N0→N4: ATIVO
Próximo passo exato: inventariar todas as unidades ainda fora de content/course.json, classificar normalização/renderer/mídia e iniciar a expansão incremental pelo próximo percurso N0-U03, preservando N4-U09 como caso-âncora`,
`P7 — Ampliação do catálogo Clássico N0→N4: ATIVO
Lote P7 N0-U03 — Palavras, frases e sentido: HOMOLOGADO (PR #134)
Homologação N0-U03: docs/homologacao-p7-n0-u03.md
Próximo passo exato: iniciar o lote N0-U04 — Lendo e compreendendo pequenos textos — inventariando autoria/verificação, normalização, interações e mídia antes de manifestar/publicar`);

replaceOnce('docs/estado-implementacao-classico.md',
`T1 foi homologado em T1.10. As regras duradouras permanecem nas fontes/skills canônicas; P6 pode avançar materialmente sem reabrir T1, salvo nova evidência concreta de regressão.`,
`T1 e P6 estão homologados. P7 avança incrementalmente por unidade, preservando os gates anteriores e sem reabrir marcos concluídos salvo nova evidência concreta de regressão.`);

replaceOnce('docs/estado-implementacao-classico.md',
`| P7 — Catálogo N0→N4 | \`ATIVO\` | expansão incremental pós-P6 |`,
`| P7 — Catálogo N0→N4 | \`ATIVO\` | N0-U03 homologada na PR #134; próximo lote N0-U04 |`);

insertAfter('docs/estado-implementacao-classico.md',
`Publicação pedagógica das interações dependentes de mídia: BLOQUEADA somente onde o estímulo obrigatório falta
\`\`\`\n`,
`\n### N0-U03\n\n\`\`\`text\nRenderer/progresso/evidência agregada: HOMOLOGADOS\n10 lições + N0-U03-V01: PUBLICADAS / HOMOLOGADAS\nManifesto: READY\nCatálogo: ATIVO\nProdução aberta: VALIDACAO_PENDENTE quando não há avaliador confiável\nMídia humana obrigatória: nenhuma\nHomologação: docs/homologacao-p7-n0-u03.md\n\`\`\`\n`);

replaceOnce('docs/estado-implementacao-classico.md',
`Global antes de P6: nenhum — T1 homologado
Ativo: P6 — Feedback por IA no Clássico
P6.1: HOMOLOGADO — AiFeedbackService neutro + companion OpenAI local + gates de segurança (PR #131)
P6.2: HOMOLOGADO — opt-in/configuração + piloto N4-U09 + feedback visual (PR #132)
P6.3: HOMOLOGADO — auditoria transversal e gate permanente (PR #133)
P6: HOMOLOGADO — docs/homologacao-p6.md
Ativo P7: expansão incremental do catálogo N0→N4
Local: resolver mídia obrigatória de U1/U2 quando o marco de publicação exigir esses estímulos
Depois de P6: P7 — ampliação do catálogo N0→N4`,
`Global: nenhum blocker técnico
P6: HOMOLOGADO — docs/homologacao-p6.md
P7: ATIVO — expansão incremental do catálogo N0→N4
N0-U03: HOMOLOGADA — docs/homologacao-p7-n0-u03.md
Ativo agora: N0-U04 — inventário/adaptação/manifesto/publicação/homologação
Local: resolver mídia obrigatória de U1/U2 quando o marco P8 exigir esses estímulos`);

replaceOnce('docs/roadmap-produto.md',
`Não reescrever conteúdo em massa para satisfazer renderer.

Condição de saída: catálogo cobre N0→N4, tipos necessários têm suporte ou blocker explícito e navegação alcança o percurso completo.`,
`Não reescrever conteúdo em massa para satisfazer renderer.

Lotes homologados até aqui:

- N0-U03 — Palavras, frases e sentido — PR #134 / \`docs/homologacao-p7-n0-u03.md\`.

Próximo lote: N0-U04 — Lendo e compreendendo pequenos textos.

Condição de saída: catálogo cobre N0→N4, tipos necessários têm suporte ou blocker explícito e navegação alcança o percurso completo.`);

replaceOnce('docs/roadmap-produto.md',
`P7 — Ampliação do catálogo Clássico N0→N4
→ inventariar unidades ausentes de content/course.json e manifests publicados
→ classificar cada unidade por normalização, interações, mídia e blocker real
→ expandir incrementalmente, começando pelo percurso N0-U03 após U1/U2 homologadas
→ preservar N4-U09 como caso-âncora de resposta aberta/IA
→ não reescrever autoria apenas para satisfazer renderer
→ registrar blockers locais e continuar por lotes independentes`,
`P7 — Ampliação do catálogo Clássico N0→N4
→ N0-U03 HOMOLOGADA / publicada no catálogo
→ próximo lote: N0-U04 — Lendo e compreendendo pequenos textos
→ inventariar autoria/verificação e classificar normalização, interações, mídia e blocker real
→ adaptar somente contratos reutilizáveis necessários antes de manifestar/publicar
→ preservar N4-U09 como caso-âncora de resposta aberta/IA
→ não reescrever autoria apenas para satisfazer renderer
→ registrar blockers locais e continuar por lotes independentes`);

replaceOnce('PROJECT_INDEX.md',
`- \`docs/roadmap-produto.md\` — ordem e condições dos marcos da fase de produto/publicação; P1–P5 e T1 homologados, P6 ativo.`,
`- \`docs/roadmap-produto.md\` — ordem e condições dos marcos da fase de produto/publicação; P1–P6 e T1 homologados, P7 ativo por lotes incrementais.`);

insertAfter('PROJECT_INDEX.md',
`- \`docs/homologacao-p6.md\` — **homologação final do P6**: segurança, consentimento, transporte, piloto, falha segura, neutralidade curricular e gate transversal antes do P7.\n`,
`- \`docs/homologacao-p7-n0-u03.md\` — **homologação do primeiro lote P7**: N0-U03 publicada, adapter legado, evidência agregada, renderer, linguagem pública, mídia e inspeção visual.\n`);

console.log('P7/N0-U03 homologada no estado canônico; cursor movido para N0-U04.');
