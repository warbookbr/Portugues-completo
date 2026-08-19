import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ContentService } from '../app/js/services/content-service.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = projectPath => JSON.parse(fs.readFileSync(path.join(root, projectPath), 'utf8'));
const readText = projectPath => fs.readFileSync(path.join(root, projectPath), 'utf8');

const course = readJson('content/course.json');
const u1 = readJson('content/units/001-fala-sons-escrita/unit.json');
const u2 = readJson('content/units/002-das-silabas-as-palavras/unit.json');
const exit = readJson('content/levels/000-fundamentos/exit-verification.json');
const transition = readText('docs/transicao-n0-n1.md');
const n1Areas = readText('docs/areas-nivel-1.md');
const n1Units = readText('docs/unidades-nivel-1.md');
const service = new ContentService({ fetchImpl: async () => ({ ok: false, status: 500 }) });

const catalogU1 = course.units.find(item => item.id === 'N0-U01');
const catalogU2 = course.units.find(item => item.id === 'N0-U02');
assert.equal(catalogU1?.title, 'Letras e primeiros sons', 'A entrada publicada deve começar pela nova U1 T1.');
assert.equal(catalogU2?.title, 'Sílabas e primeiras palavras', 'A segunda unidade publicada deve ser a nova U2 T1.');
assert.ok(catalogU1.order < catalogU2.order, 'U1 precisa anteceder U2 no catálogo.');
assert.equal(u1.verification.id, 'N0-U01-V02');
assert.equal(u2.verification.id, 'N0-U02-V02');
assert.deepEqual(u2.prerequisites, ['N0-U01-V02'], 'U2 deve começar somente depois da V02 ativa da U1.');

const unitSpecs = [
  { manifest: u1, dir: 'content/units/001-fala-sons-escrita', availableBefore: new Set() },
  { manifest: u2, dir: 'content/units/002-das-silabas-as-palavras', availableBefore: new Set([...u1.lessons.map(item => item.id), u1.verification.id]) }
];

let auditedLessons = 0;
for (const { manifest, dir, availableBefore } of unitSpecs) {
  const seen = new Set(availableBefore);
  for (const lessonRef of [...manifest.lessons].sort((a, b) => a.order - b.order)) {
    const source = readJson(`${dir}/${lessonRef.path}`);
    assert.equal(source.id, lessonRef.id, `${lessonRef.id}: ID do manifest e fonte precisam coincidir.`);
    assert.equal(typeof source.studentObjective, 'string', `${source.id}: studentObjective obrigatório.`);
    assert.ok(source.studentObjective.trim().length >= 20, `${source.id}: objetivo público curto demais para ser explicativo.`);
    assert.equal(typeof source.objective, 'string', `${source.id}: objective técnico obrigatório.`);
    assert.notEqual(source.studentObjective.trim(), source.objective.trim(), `${source.id}: objetivo público não pode reutilizar objective técnico.`);
    assert.doesNotMatch(source.studentObjective, /N0-U|competency|competência|cluster|schema|runtime|evidência obrigatória|M[1-5]\b/i, `${source.id}: objetivo público contém linguagem interna.`);

    const runtime = service.normalize(source, { competencyIds: lessonRef.competencyIds });
    assert.equal(runtime.presentation.introSource, 'AUTHORED', `${source.id}: abertura pública precisa ser autorada.`);
    assert.equal(runtime.presentation.intro, source.studentObjective.trim());

    for (const prerequisite of source.prerequisites || []) {
      if (!/^N0-U0[12]-(?:L\d+|V02)$/.test(prerequisite)) continue;
      assert.ok(seen.has(prerequisite), `${source.id}: pré-requisito invertido ou ainda indisponível -> ${prerequisite}`);
    }

    seen.add(source.id);
    auditedLessons += 1;
  }
}
assert.equal(auditedLessons, 17, 'T1.10 deve auditar todas as 17 lições iniciais publicadas.');

const firstU1 = readJson('content/units/001-fala-sons-escrita/lessons/003-conhecendo-o-alfabeto.json');
assert.deepEqual(firstU1.prerequisites, [], 'A primeira lição do curso não pode exigir abstração anterior.');
const firstU1Teaching = JSON.stringify(firstU1.sequence ?? firstU1.blocks ?? []);
assert.match(firstU1Teaching, /Uma letra é um sinal que usamos para escrever/i, 'A primeira lição precisa definir letra concretamente.');
assert.match(firstU1Teaching, /alfabeto/i, 'A primeira lição precisa construir alfabeto explicitamente.');

const firstU2 = readJson('content/units/002-das-silabas-as-palavras/lessons/001-ouvindo-as-partes-das-palavras.json');
assert.deepEqual(firstU2.prerequisites, ['N0-U01-V02']);
const firstU2Teaching = JSON.stringify(firstU2.sequence ?? firstU2.blocks ?? []);
assert.match(firstU2Teaching, /sílaba/i, 'A entrada da U2 precisa construir explicitamente o conceito de sílaba.');

const prerequisiteIds = exit.prerequisiteEvidence.map(item => item.verification);
assert.ok(prerequisiteIds.includes('N0-U01-V02'));
assert.ok(prerequisiteIds.includes('N0-U02-V02'));
assert.ok(!prerequisiteIds.includes('N0-U01-V01'));
assert.ok(!prerequisiteIds.includes('N0-U02-V01'));
assert.deepEqual(exit.carryForwardEvidence.foundationalSoundWriting.requiredFrom, ['N0-U01-V02']);
assert.deepEqual(exit.carryForwardEvidence.syllablesAndWordReading.requiredFrom, ['N0-U02-V02']);
assert.deepEqual(exit.completionEvidence.clusters.foundationCarryForward.evidence.slice(0, 2), ['N0-U01-V02', 'N0-U02-V02']);
const exitSerialized = JSON.stringify(exit);
assert.doesNotMatch(exitSerialized, /N0-U01-V01|N0-U02-V01/, 'Checkpoint N0 ativo não pode depender das verificações legadas de U1/U2.');

for (const [label, text] of [['transição N0→N1', transition], ['áreas N1', n1Areas], ['unidades N1', n1Units]]) {
  assert.doesNotMatch(text, /N0-U01-V01|N0-U02-V01/, `${label}: não deve depender das V01 aposentadas de U1/U2.`);
}
assert.match(transition, /N1\s*\nconsolidação \+ sistematização inicial \+ autonomia básica ampliada/i, 'Transição N0→N1 precisa preservar a progressão aprovada.');
assert.match(n1Areas, /Consolidar a compreensão leitora construída no Nível 0/i, 'N1 deve assumir consolidação da leitura construída no N0.');
assert.match(n1Units, /N0\s*\npequenos textos \+ pequenas mensagens \+ uso cotidiano/i, 'Arquitetura N1 deve continuar ancorada na saída funcional do N0.');

console.log('T1.10 homologation gate: 17 lições, pré-requisitos, V02 do checkpoint e transição N0→N1 coerentes.');
