import fs from 'node:fs';

const file = 'PROJECT_INDEX.md';
let source = fs.readFileSync(file, 'utf8');
const anchor = '- `docs/p6-transporte-ia.md` — **contrato técnico vigente do transporte P6**: serviço neutro, companion local, proteção da API key, structured output e fronteira de autoridade da IA.\n';
const addition = '- `docs/homologacao-p6-2.md` — **homologação da P6.2**: opt-in/consentimento, piloto N4-U09, neutralidade do progresso e inspeção visual dos estados de IA.\n';
if (!source.includes(addition.trim())) {
  if (!source.includes(anchor)) throw new Error('Âncora P6 não encontrada no PROJECT_INDEX.md.');
  source = source.replace(anchor, `${anchor}${addition}`);
  fs.writeFileSync(file, source);
}
console.log('PROJECT_INDEX mapeia docs/homologacao-p6-2.md.');
