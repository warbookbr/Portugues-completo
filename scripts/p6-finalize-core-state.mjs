import fs from 'node:fs';

function replaceOnce(file, before, after) {
  let source = fs.readFileSync(file, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado encontrado ${count} vez(es).`);
  source = source.replace(before, after);
  fs.writeFileSync(file, source);
}

replaceOnce('docs/estado-implementacao-classico.md',
`Subfase P6.1 — núcleo neutro + transporte seguro: EM VALIDAÇÃO (PR #131)
Próximo passo exato: homologar P6.1 no CI e então implementar opt-in/configuração na UI + atividade piloto N4-U09, mantendo \`VALIDACAO_PENDENTE\` e a API key OpenAI fora do navegador`,
`Subfase P6.1 — núcleo neutro + transporte seguro: HOMOLOGADO (PR #131)
Subfase ativa: P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual
Próximo passo exato: ligar AiFeedbackService à UI com consentimento explícito, configurar companion/model/token efêmero, habilitar uma atividade aberta piloto em N4-U09 e provar sucesso/falha sem alterar \`VALIDACAO_PENDENTE\``);

replaceOnce('docs/estado-implementacao-classico.md',
`| P6 — Feedback por IA | \`ATIVO\` | P6.1 núcleo/transporte em validação na PR #131 |`,
`| P6 — Feedback por IA | \`ATIVO\` | P6.1 núcleo/transporte homologado na PR #131; P6.2 ativo |`);

replaceOnce('docs/estado-implementacao-classico.md',
`P6.1: AiFeedbackService neutro + companion OpenAI local + gates de segurança em validação na PR #131
Depois de P6.1: opt-in/configuração UI + piloto N4-U09 + feedback visual + smoke de sucesso/falha`,
`P6.1: HOMOLOGADO — AiFeedbackService neutro + companion OpenAI local + gates de segurança (PR #131)
Ativo P6.2: opt-in/configuração UI + piloto N4-U09 + feedback visual + smoke de sucesso/falha`);

replaceOnce('docs/roadmap-produto.md',
`**Estado: ATIVO.**

T1 foi homologado em T1.10; P6 volta a ser o marco ativo do Modo Clássico.`,
`**Estado: ATIVO.**

T1 foi homologado em T1.10; P6 volta a ser o marco ativo do Modo Clássico.

Subfases:

\`\`\`text
P6.1 — núcleo neutro + transporte seguro → HOMOLOGADO (PR #131)
P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual → ATIVO
P6.3 — homologação transversal do feedback IA → depois de P6.2
\`\`\`

P6.1 consolidou \`AiFeedbackService\`, adapter neutro, companion local OpenAI, structured output, \`store:false\`, chave fora do navegador e gates que impedem IA de promover evidência. Contrato técnico: \`docs/p6-transporte-ia.md\`.`);

replaceOnce('docs/roadmap-produto.md',
`P6 — Feedback por IA no Clássico
→ reler docs/avaliacao-ia.md + regras BYOK/segurança
→ verificar documentação oficial atual do provider antes de congelar API/modelo
→ implementar feedback opt-in sem transformar IA em autoridade de domínio
→ preservar VALIDACAO_PENDENTE quando a policy exigir avaliador confiável
→ manter falha/ausência de IA sem perda da resposta ou bloqueio indevido do percurso`,
`P6.2 — opt-in/configuração + piloto N4-U09 + feedback visual
→ expor configuração não secreta do companion/modelo e token efêmero somente em sessão
→ exigir consentimento explícito antes de qualquer chamada paga
→ habilitar uma atividade aberta piloto em N4-U09 com critérios explícitos
→ apresentar feedback estruturado sem tratar recomendação como domínio
→ provar IA desligada, companion ausente, sucesso e falha do provider sem perda da resposta
→ preservar VALIDACAO_PENDENTE quando a policy exigir avaliador confiável`);

console.log('P6.1 homologado; cursor e roadmap avançados para P6.2.');
