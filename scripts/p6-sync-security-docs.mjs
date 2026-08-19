import fs from 'node:fs';

function replaceOnce(file, before, after) {
  let source = fs.readFileSync(file, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado encontrado ${count} vez(es).`);
  source = source.replace(before, after);
  fs.writeFileSync(file, source);
}

replaceOnce('PROJECT_INDEX.md',
`├── docs/
├── scripts/ + .github/
└── .ChatGPT/`,
`├── docs/
├── scripts/ + .github/
├── tools/
└── .ChatGPT/`);

replaceOnce('PROJECT_INDEX.md',
`- \`docs/estado-implementacao-classico.md\` — **estado operacional concreto do Modo Clássico**: marco/item ativo, estados técnico/homologação/mídia/publicação, blockers e próximo passo exato.
- \`docs/execucao-continua.md\` — execução autônoma por marcos autorizados.`,
`- \`docs/estado-implementacao-classico.md\` — **estado operacional concreto do Modo Clássico**: marco/item ativo, estados técnico/homologação/mídia/publicação, blockers e próximo passo exato.
- \`docs/p6-transporte-ia.md\` — **contrato técnico vigente do transporte P6**: serviço neutro, companion local, proteção da API key, structured output e fronteira de autoridade da IA.
- \`docs/execucao-continua.md\` — execução autônoma por marcos autorizados.`);

replaceOnce('PROJECT_INDEX.md',
`→ docs/migracao-t1-9-n0.md para compatibilidade histórica/progresso
→ se houver autoria/copy pública: docs/linguagem-aluno.md`,
`→ docs/migracao-t1-9-n0.md para compatibilidade histórica/progresso
→ se P6 estiver ativo: docs/avaliacao-ia.md + docs/p6-transporte-ia.md
→ se houver autoria/copy pública: docs/linguagem-aluno.md`);

replaceOnce('PROJECT_INDEX.md',
`- \`docs/avaliacao-ia.md\` — contrato neutro de feedback com IA, BYOK, consentimento, request/response e limites de autoridade.
- \`docs/calibracao-produto.md\``,
`- \`docs/avaliacao-ia.md\` — contrato neutro de feedback com IA, BYOK, consentimento, request/response e limites de autoridade.
- \`docs/p6-transporte-ia.md\` — transporte seguro implementado no P6; para OpenAI, a API key pertence ao aluno mas permanece no companion local, nunca no navegador.
- \`docs/calibracao-produto.md\``);

replaceOnce('PROJECT_INDEX.md',
`|-- scripts/
|-- .github/
\`-- .ChatGPT/`,
`|-- scripts/
|-- tools/                                  (utilitários locais opcionais; ex.: companion P6)
|-- .github/
\`-- .ChatGPT/`);

replaceOnce('docs/arquitetura.md',
`Qualquer integração direta usa credencial do próprio aluno.`,
`Qualquer integração com provider pago usa credencial pertencente ao próprio aluno, mas o transporte deve respeitar a política de segredo do provider. Credenciais classificadas como segredo **não podem ser inseridas ou persistidas no código client-side**. Para OpenAI, o P6 usa o companion local documentado em \`docs/p6-transporte-ia.md\`.`);

replaceOnce('docs/arquitetura.md',
`### Persistência da API key

Padrão:

\`\`\`text
aluno informa key
→ somente sessão
\`\`\`

Opção explícita:

\`\`\`text
☐ Lembrar minha chave neste dispositivo
\`\`\`

Quando marcada, a chave pode permanecer apenas no armazenamento local daquele navegador/dispositivo.

Troca de aparelho/navegador ou limpeza de dados pode exigir inserir novamente.

Em dispositivo público/compartilhado, lembrar a chave não é recomendado.`,
`### Segredos de provider e credenciais de sessão

Regra vigente:

\`\`\`text
segredo de longa duração do provider
→ nunca frontend/browser
→ nunca localStorage/sessionStorage do GitHub Pages
→ nunca Gist/progresso
\`\`\`

Um adapter pode usar credencial **efêmera e limitada ao próprio transporte**, desde que ela não seja a API key do provider. No adapter OpenAI do P6:

\`\`\`text
OPENAI_API_KEY do aluno
→ processo local em 127.0.0.1

browser
→ token efêmero do companion
→ sessionStorage
→ nunca Gist/progresso
\`\`\`

Detalhes, threat model e execução: \`docs/p6-transporte-ia.md\`.`);

replaceOnce('docs/arquitetura.md',
`API key de IA lembrada
→ armazenamento local separado mediante escolha explícita
→ nunca Gist/progresso`,
`Segredo de provider de IA
→ fora do frontend conforme política do provider
→ no OpenAI/P6: companion local
→ nunca Gist/progresso

Token efêmero do companion
→ sessionStorage
→ nunca Gist/progresso`);

replaceOnce('docs/arquitetura.md',
`- uma API key de IA lembrada não acompanha automaticamente outros dispositivos;
- limpar dados locais pode exigir informar a chave novamente;`,
`- credenciais de provider permanecem dependentes do ambiente seguro escolhido pelo aluno;
- no adapter OpenAI, iniciar o companion em outro dispositivo exige configurar a API key novamente naquele processo local;`);

replaceOnce('docs/avaliacao-ia.md',
`## Credencial

A credencial segue \`docs/arquitetura.md\`:

\`\`\`text
API key pertence ao aluno
→ sessão por padrão
→ persistência local somente se o aluno escolher
→ nunca GitHub/Gist
→ nunca conteúdo do curso
\`\`\`

Nenhuma chave privada do projeto pode ser usada diretamente pelo frontend estático.`,
`## Credencial

A credencial segue \`docs/arquitetura.md\` e a política de segurança do provider:

\`\`\`text
credencial pertence ao aluno
→ segredo de longa duração nunca vai para o frontend quando o provider o proíbe
→ nunca GitHub/Gist
→ nunca progresso
→ nunca conteúdo do curso
\`\`\`

Nenhuma chave privada do projeto pode ser usada diretamente pelo frontend estático. Para OpenAI, a API key do aluno permanece no companion local descrito em \`docs/p6-transporte-ia.md\`; o navegador conhece somente um token efêmero do companion.`);

replaceOnce('docs/avaliacao-ia.md',
`- a chamada usa a API key do próprio aluno;
- o provedor pode cobrar pelo uso conforme o plano do titular;`,
`- a chamada usa a conta/credencial do próprio aluno por meio do transporte seguro do adapter escolhido;
- o provedor pode cobrar pelo uso conforme o plano do titular;`);

replaceOnce('docs/avaliacao-ia.md',
`Podem incluir:

\`\`\`text
aiFeedbackEnabled
provider
model
rememberApiKey
\`\`\`

A própria API key segue a política de armazenamento definida na arquitetura e não deve ser serializada junto das outras preferências se isso criar exposição desnecessária. O serviço de credenciais deve controlar sua leitura/escrita separadamente.`,
`Podem incluir:

\`\`\`text
aiFeedbackEnabled
provider
model
endpoint não secreto quando aplicável
\`\`\`

Segredos de longa duração não pertencem a essas preferências. Credenciais efêmeras de transporte devem ficar em armazenamento de sessão separado quando aplicável. Para OpenAI/P6, ver \`docs/p6-transporte-ia.md\`.`);

replaceOnce('docs/estado-implementacao-classico.md',
`P6 — Feedback por IA: ATIVO
Próximo passo exato: iniciar P6 pelo contrato de feedback opt-in, preservando \`VALIDACAO_PENDENTE\` como padrão para produção aberta e rechecando documentação oficial do provider antes de congelar endpoints/modelo`,
`P6 — Feedback por IA: ATIVO
Subfase P6.1 — núcleo neutro + transporte seguro: EM VALIDAÇÃO (PR #131)
Próximo passo exato: homologar P6.1 no CI e então implementar opt-in/configuração na UI + atividade piloto N4-U09, mantendo \`VALIDACAO_PENDENTE\` e a API key OpenAI fora do navegador`);

replaceOnce('docs/estado-implementacao-classico.md',
`| P6 — Feedback por IA | \`ATIVO\` | próximo marco após T1 |`,
`| P6 — Feedback por IA | \`ATIVO\` | P6.1 núcleo/transporte em validação na PR #131 |`);

replaceOnce('docs/estado-implementacao-classico.md',
`Ativo: P6 — Feedback por IA no Clássico
Local: resolver mídia obrigatória de U1/U2 quando o marco de publicação exigir esses estímulos`,
`Ativo: P6 — Feedback por IA no Clássico
P6.1: AiFeedbackService neutro + companion OpenAI local + gates de segurança em validação na PR #131
Depois de P6.1: opt-in/configuração UI + piloto N4-U09 + feedback visual + smoke de sucesso/falha
Local: resolver mídia obrigatória de U1/U2 quando o marco de publicação exigir esses estímulos`);

console.log('P6: PROJECT_INDEX + arquitetura + avaliação IA + cursor operacional sincronizados.');
