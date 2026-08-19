import fs from 'node:fs';

function replaceOnce(file, before, after) {
  let source = fs.readFileSync(file, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado encontrado ${count} vez(es).`);
  source = source.replace(before, after);
  fs.writeFileSync(file, source);
}

replaceOnce('docs/estado-implementacao-classico.md',
`Subfase ativa: P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual
Próximo passo exato: ligar AiFeedbackService à UI com consentimento explícito, configurar companion/model/token efêmero, habilitar uma atividade aberta piloto em N4-U09 e provar sucesso/falha sem alterar \`VALIDACAO_PENDENTE\``,
`Subfase P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual: HOMOLOGADO (PR #132)
Homologação P6.2: docs/homologacao-p6-2.md
Subfase ativa: P6.3 — homologação transversal do feedback IA
Próximo passo exato: auditar os invariantes P6 ponta a ponta — segurança de credencial, opt-in, payload mínimo, structured output, falha segura e neutralidade sobre ProgressService — e fechar P6 somente se todos permanecerem provados`);

replaceOnce('docs/estado-implementacao-classico.md',
`| P6 — Feedback por IA | \`ATIVO\` | P6.1 núcleo/transporte homologado na PR #131; P6.2 ativo |`,
`| P6 — Feedback por IA | \`ATIVO\` | P6.1 homologado #131; P6.2 homologado #132; P6.3 ativo |`);

replaceOnce('docs/estado-implementacao-classico.md',
`Ativo P6.2: opt-in/configuração UI + piloto N4-U09 + feedback visual + smoke de sucesso/falha`,
`P6.2: HOMOLOGADO — opt-in/configuração + piloto N4-U09 + feedback visual (PR #132)
Ativo P6.3: homologação transversal do feedback IA antes de liberar P7`);

replaceOnce('docs/roadmap-produto.md',
`P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual → ATIVO
P6.3 — homologação transversal do feedback IA → depois de P6.2`,
`P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual → HOMOLOGADO (PR #132)
P6.3 — homologação transversal do feedback IA → ATIVO`);

replaceOnce('docs/roadmap-produto.md',
`P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual
→ expor configuração não secreta do companion/modelo e token efêmero somente em sessão
→ exigir consentimento explícito antes de qualquer chamada paga
→ habilitar uma atividade aberta piloto em N4-U09 com critérios explícitos
→ apresentar feedback estruturado sem tratar recomendação como domínio
→ provar IA desligada, companion ausente, sucesso e falha do provider sem perda da resposta
→ preservar VALIDACAO_PENDENTE quando a policy exigir avaliador confiável`,
`P6.3 — homologação transversal do feedback IA
→ provar que segredo de provider não entra no frontend/Gist/progresso
→ provar opt-in + consentimento antes de chamada
→ provar payload mínimo e critérios explícitos
→ provar structured output validado e falha segura
→ provar que sucesso/falha não mutam ProgressService nem promovem VALIDACAO_PENDENTE
→ revalidar documentação/provider e ausência de códigos internos na UI
→ fechar P6 e liberar P7 somente se todos os invariantes forem satisfeitos`);

console.log('P6.2 homologado; cursor avançado para P6.3.');
