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
`P6 — Feedback por IA: ATIVO
Subfase P6.1 — núcleo neutro + transporte seguro: HOMOLOGADO (PR #131)
Subfase P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual: HOMOLOGADO (PR #132)
Homologação P6.2: docs/homologacao-p6-2.md
Subfase ativa: P6.3 — homologação transversal do feedback IA
Próximo passo exato: auditar os invariantes P6 ponta a ponta — segurança de credencial, opt-in, payload mínimo, structured output, falha segura e neutralidade sobre ProgressService — e fechar P6 somente se todos permanecerem provados`,
`P6 — Feedback por IA: HOMOLOGADO
Homologação P6: docs/homologacao-p6.md
P7 — Ampliação do catálogo Clássico N0→N4: ATIVO
Próximo passo exato: inventariar todas as unidades ainda fora de content/course.json, classificar normalização/renderer/mídia e iniciar a expansão incremental pelo próximo percurso N0-U03, preservando N4-U09 como caso-âncora`);

replaceOnce('docs/estado-implementacao-classico.md',
`| P6 — Feedback por IA | \`ATIVO\` | P6.1 homologado #131; P6.2 homologado #132; P6.3 ativo |
| P7 — Catálogo N0→N4 | \`NAO_INICIADO\` | — |`,
`| P6 — Feedback por IA | \`HOMOLOGADO\` | PRs #131–#133; \`docs/homologacao-p6.md\` |
| P7 — Catálogo N0→N4 | \`ATIVO\` | expansão incremental pós-P6 |`);

replaceOnce('docs/estado-implementacao-classico.md',
`P6.2: HOMOLOGADO — opt-in/configuração + piloto N4-U09 + feedback visual (PR #132)
Ativo P6.3: homologação transversal do feedback IA antes de liberar P7`,
`P6.2: HOMOLOGADO — opt-in/configuração + piloto N4-U09 + feedback visual (PR #132)
P6.3: HOMOLOGADO — auditoria transversal e gate permanente (PR #133)
P6: HOMOLOGADO — docs/homologacao-p6.md
Ativo P7: expansão incremental do catálogo N0→N4`);

replaceOnce('docs/roadmap-produto.md',
`## P6 — Feedback por IA no Clássico

**Estado: ATIVO.**`,
`## P6 — Feedback por IA no Clássico

**Estado: HOMOLOGADO.**`);

replaceOnce('docs/roadmap-produto.md',
`P6.3 — homologação transversal do feedback IA → ATIVO`,
`P6.3 — homologação transversal do feedback IA → HOMOLOGADO (PR #133)
P6 — FECHADO / HOMOLOGADO → docs/homologacao-p6.md`);

replaceOnce('docs/roadmap-produto.md',
`## P7 — Ampliação do catálogo Clássico N0→N4

Objetivo: levar o pipeline homologado P1–P6 ao curso inteiro, usando a porta de entrada N0 revisada por T1.`,
`## P7 — Ampliação do catálogo Clássico N0→N4

**Estado: ATIVO.**

Objetivo: levar o pipeline homologado P1–P6 ao curso inteiro, usando a porta de entrada N0 revisada por T1.`);

replaceOnce('docs/roadmap-produto.md',
`P6.3 — homologação transversal do feedback IA
→ provar que segredo de provider não entra no frontend/Gist/progresso
→ provar opt-in + consentimento antes de chamada
→ provar payload mínimo e critérios explícitos
→ provar structured output validado e falha segura
→ provar que sucesso/falha não mutam ProgressService nem promovem VALIDACAO_PENDENTE
→ revalidar documentação/provider e ausência de códigos internos na UI
→ fechar P6 e liberar P7 somente se todos os invariantes forem satisfeitos`,
`P7 — Ampliação do catálogo Clássico N0→N4
→ inventariar unidades ausentes de content/course.json e manifests publicados
→ classificar cada unidade por normalização, interações, mídia e blocker real
→ expandir incrementalmente, começando pelo percurso N0-U03 após U1/U2 homologadas
→ preservar N4-U09 como caso-âncora de resposta aberta/IA
→ não reescrever autoria apenas para satisfazer renderer
→ registrar blockers locais e continuar por lotes independentes`);

insertAfter('PROJECT_INDEX.md',
'- `docs/homologacao-p6-2.md` — **homologação da P6.2**: opt-in/consentimento, piloto N4-U09, neutralidade do progresso e inspeção visual dos estados de IA.\n',
'- `docs/homologacao-p6.md` — **homologação final do P6**: segurança, consentimento, transporte, piloto, falha segura, neutralidade curricular e gate transversal antes do P7.\n');

console.log('P6 fechado/homologado; P7 ativado e homologação P6 mapeada.');
