import fs from 'node:fs';

const file = 'scripts/test-classic-renderer.mjs';
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(before, after) {
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado ${count === 0 ? 'não encontrado' : `encontrado ${count} vezes`}.`);
  source = source.replace(before, after);
}

replaceOnce('assert.match(home, /Fala, sons e escrita/);', 'assert.match(home, /Letras e primeiros sons/);');
replaceOnce("const n0Lesson = await service.loadLesson('N0-U01', 'N0-U01-L01');", "const n0Lesson = await service.loadLesson('N0-U01', 'N0-U01-L03');");
replaceOnce("assert.equal(n0Lesson.runtime.presentation.introSource, 'SAFE_FALLBACK', 'conteúdo legado deve usar fallback público seguro até a migração T1.9');", "assert.equal(n0Lesson.runtime.presentation.introSource, 'AUTHORED', 'a nova primeira lição deve usar intro pública autorada');");
replaceOnce("assert.equal(n0Lesson.runtime.presentation.intro, 'Nesta lição, você vai estudar o conteúdo passo a passo.');", "assert.equal(n0Lesson.runtime.presentation.intro, 'Entender o que é uma letra e conhecer as letras do alfabeto, seus nomes e sua ordem.');");
replaceOnce('withEvidenceHistory.evidence[`${n0Lesson.runtime.id}/L01-A01`] = { status: \'PRATICADA\' };', 'withEvidenceHistory.evidence[`${n0Lesson.runtime.id}/L03-A01`] = { status: \'PRATICADA\' };');
replaceOnce("const n0Html = documentHtml(n0Verification.runtime, { unitId: 'N0-U01', unitTitle: 'Fala, sons e escrita', verification: true });", "const n0Html = documentHtml(n0Verification.runtime, { unitId: 'N0-U01', unitTitle: 'Letras e primeiros sons', verification: true });");
replaceOnce('assert.match(n0Html, /Áudio controlado pendente/);', 'assert.match(n0Html, /Áudio ainda não disponível/);');
replaceOnce('assert.equal(lessonCount, 20);', 'assert.equal(lessonCount, 29);');
replaceOnce('assert.equal(verificationCount, 2);', 'assert.equal(verificationCount, 3);');

fs.writeFileSync(file, source);
