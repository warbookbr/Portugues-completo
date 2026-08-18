import fs from 'node:fs';

function patchOnce(path, marker, block) {
  let source = fs.readFileSync(path, 'utf8');
  if (source.includes(block.trim())) return;
  if (!source.includes(marker)) throw new Error(`Finalização T1.9: marcador ausente em ${path}`);
  source = source.replace(marker, `${marker}${block}`);
  fs.writeFileSync(path, source);
}

const mediaBlock = `
## Regra vigente para a nova entrada N0 — T1.9

A partir da promoção T1.9, esta seção prevalece sobre linhas históricas da U1/U2 quando houver divergência.

```text
não renumerar mídia por posição curricular
preservar mediaId quando o estímulo continua semanticamente igual
mídia ausente bloqueia somente o escopo dependente
não gerar/regravar mídia automaticamente durante a migração
```

### Itens históricos que não devem mais ser produzidos para a publicação atual

- `N0-U01-L01-AUD-*` e `N0-U01-L01-IMG-*`: pertenciam à antiga abertura abstrata sobre fala/escrita. A responsabilidade foi movida para `N0-U02-L10`, cuja implementação atual usa TTS/texto e não exige nova mídia humana.

### Famílias ainda ativas/reutilizadas

- `N0-U01-L02-AUD-*` — percepção sonora; reutilizada também pela nova U2 quando semanticamente adequado;
- `N0-U01-L03-AUD-*` — nomes de letras/alphabet recognition;
- `N0-U01-V01-AUD-*` — estímulos históricos reutilizados pela `N0-U01-V02` quando equivalentes;
- `N0-U01-L08-AUD-*` — família histórica preservada como estímulo de variação letra↔som na nova `N0-U02-L09`;
- `N0-U02-L01-AUD-*` — segmentação controlada da introdução de sílabas;
- `N0-U02-L02-AUD-*` — fichas/partes sonoras controladas;
- `N0-U02-L08-IMG-*` — apoio visual obrigatório das tarefas palavra↔significado, com equivalente não visual previsto na autoria;
- `N0-U02-V01-AUD-*` e `N0-U02-V01-IMG-*` — estímulos históricos reutilizados pela `N0-U02-V02` quando semanticamente válidos.

### Estado de publicação após a promoção técnica

`N0-U01` e `N0-U02` permanecem `BLOCKED` enquanto os estímulos humanos obrigatórios acima não estiverem produzidos/validados/ligados. Isso **não** invalida a integração técnica, catálogo, migração de progresso ou navegação; bloqueia somente homologação/publicação dos exercícios que dependem da mídia.

`;
patchOnce('producao-midia/FILA-MIDIA.md', '# Fila de mídia\n', mediaBlock);

let index = fs.readFileSync('PROJECT_INDEX.md', 'utf8');
index = index.replace(
  '- `content/course.json` — catálogo de publicação v2; slice N0-U01 + N4-U09 publicado; a porta N0 será reconciliada por T1 antes da expansão P7.',
  '- `content/course.json` — catálogo de publicação v2; nova entrada T1 com N0-U01 + N0-U02 e slice N4-U09 integrados; unidades N0 dependentes de mídia continuam com blockers locais explícitos.'
);
if (!index.includes('- `scripts/test-progress-migration-wiring.mjs`')) {
  index = index.replace('- `scripts/test-progress-migration-t1.mjs`\n', '- `scripts/test-progress-migration-t1.mjs`\n- `scripts/test-progress-migration-wiring.mjs`\n');
}
if (!index.includes('- `scripts/promote-t1-n0-content.mjs`')) {
  index = index.replace('- `scripts/test-t1-content-authoring.mjs`\n', '- `scripts/test-t1-content-authoring.mjs`\n- `scripts/promote-t1-n0-content.mjs` — materializador determinístico usado na promoção T1.9; não executar sobre conteúdo publicado sem revisão explícita da matriz T1.\n');
}
fs.writeFileSync('PROJECT_INDEX.md', index);

for (const path of [
  '.github/workflows/materialize-t1-n0.yml',
  '.github/workflows/apply-t1-atomic-wiring.yml',
  '.github/workflows/finalize-t1-atomic-promotion.yml',
  'scripts/apply-t1-atomic-wiring.mjs',
  'scripts/finalize-t1-atomic-promotion.mjs'
]) {
  if (fs.existsSync(path)) fs.rmSync(path);
}

console.log('T1.9 promoção finalizada: mídia/índice reconciliados e tooling temporário removido.');
