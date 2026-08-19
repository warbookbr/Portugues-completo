import fs from 'node:fs';

function replaceOnce(file, before, after) {
  const source = fs.readFileSync(file, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado ${count === 0 ? 'não encontrado' : `encontrado ${count} vezes`}.`);
  fs.writeFileSync(file, source.replace(before, after));
}

replaceOnce(
  'scripts/test-content-normalizer.mjs',
  "const n0LessonSource = readJson('content/units/001-fala-sons-escrita/lessons/001-fala-e-escrita.json');",
  "const n0LessonSource = readJson('content/units/001-fala-sons-escrita/legacy/lessons/001-fala-e-escrita.json');"
);
