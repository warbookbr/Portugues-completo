import fs from 'node:fs';
const file = 'PROJECT_INDEX.md';
const source = fs.readFileSync(file, 'utf8');
const anchor = '- `docs/migracao-t1-9-n0.md` — **contrato executável da T1.9**: equivalências de IDs/refs de atividade, split da antiga L05, conteúdos movidos, V01→V02, current, reviews, Gist e guard rails contra domínio falso.\n';
const addition = `${anchor}- \`docs/t1-9-integracao-atomica-n0.md\` — registro da promoção atômica de catálogo, manifests, migração local/Gist, aliases históricos e reconciliação de mídia da T1.9.\n`;
if (!source.includes(anchor)) throw new Error('Âncora T1.9 não encontrada em PROJECT_INDEX.md.');
fs.writeFileSync(file, source.replace(anchor, addition));
