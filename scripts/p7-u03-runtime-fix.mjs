import fs from 'node:fs';

const file = 'app/js/services/content-normalizer-v1.js';
let source = fs.readFileSync(file, 'utf8');
const anchor = `  if (!Array.isArray(materialized.items) && Array.isArray(materialized.contexts)) {
    materialized.items = materialized.contexts.map((item, index) => ({ ...clone(item), id: item.id || String(index) }));
  }
`;
const addition = `${anchor}
  if (Array.isArray(materialized.items)) {
    materialized.items = materialized.items.map(item => {
      if (!item || Array.isArray(item.options) || !Array.isArray(item.cases) || !Object.prototype.hasOwnProperty.call(item, 'correctIndex')) return item;
      return { ...clone(item), options: clone(item.cases) };
    });
  }
`;
if (!source.includes(anchor)) throw new Error('Âncora de materialização contexts não encontrada.');
source = source.replace(anchor, addition);
fs.writeFileSync(file, source);
console.log('P7/U03: cases avaliativos materializados como options.');
