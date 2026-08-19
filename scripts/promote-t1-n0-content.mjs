import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { materializeLesson, materializeVerification } from './t1-authoring-materializer.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = projectPath => JSON.parse(fs.readFileSync(path.join(root, projectPath), 'utf8'));
const writeJson = (projectPath, value) => {
  const absolute = path.join(root, projectPath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`);
};
const copyJson = (source, target) => writeJson(target, readJson(source));

function removeUndeclaredLessonJson(unitDir, allowedNames) {
  const lessonDir = path.join(root, unitDir, 'lessons');
  if (!fs.existsSync(lessonDir)) return;
  for (const name of fs.readdirSync(lessonDir)) {
    if (!name.endsWith('.json') || allowedNames.has(name)) continue;
    fs.rmSync(path.join(lessonDir, name));
  }
}

function preserveHistoricalLessons(unitDir, filenames) {
  for (const filename of filenames) {
    const source = `${unitDir}/lessons/${filename}`;
    const absolute = path.join(root, source);
    if (!fs.existsSync(absolute)) continue;
    copyJson(source, `${unitDir}/legacy/lessons/${filename}`);
  }
}

function lessonRef(id, order, title, filename, competencyIds) {
  return { id, order, title, path: `lessons/${filename}`, competencyIds };
}

const u1Dir = 'content/units/001-fala-sons-escrita';
const u1Staged = 'content/staging/t1/n0-u01';
const u1Lessons = [
  ['N0-U01-L03', 1, '003-conhecendo-o-alfabeto.json', ['N0-U01-C03']],
  ['N0-U01-L04', 2, '004-mesma-letra-formas-diferentes.json', ['N0-U01-C04']],
  ['N0-U01-L05', 3, '005-vogais-consoantes-outros-sinais.json', ['N0-U01-C05']],
  ['N0-U01-L09', 4, '009-letras-numeros-outros-sinais.json', ['N0-U01-C09']],
  ['N0-U01-L06', 5, '006-como-a-escrita-se-organiza.json', ['N0-U01-C06']],
  ['N0-U01-L02', 6, '002-percebendo-os-sons-da-fala.json', ['N0-U01-C02']],
  ['N0-U01-L07', 7, '007-nome-da-letra-e-som.json', ['N0-U01-C07']]
];

preserveHistoricalLessons(u1Dir, [
  '001-fala-e-escrita.json',
  '005-vogais-consoantes-outros-sinais.json',
  '008-letras-sons-relacao-varia.json'
]);
for (const [, , filename] of u1Lessons) copyJson(`${u1Staged}/lessons/${filename}`, `${u1Dir}/lessons/${filename}`);
removeUndeclaredLessonJson(u1Dir, new Set(u1Lessons.map(([, , filename]) => filename)));
copyJson(`${u1Staged}/integrated-verification-v02.json`, `${u1Dir}/integrated-verification-v02.json`);

const u1LessonRefs = u1Lessons.map(([id, order, filename, competencyIds]) => {
  const source = readJson(`${u1Dir}/lessons/${filename}`);
  if (source.id !== id) throw new Error(`U1: ${filename} possui id ${source.id}, esperado ${id}`);
  return lessonRef(id, order, source.title, filename, competencyIds);
});
const u1Competencies = [
  ['N0-U01-C03', 'entender o que é uma letra e reconhecer o alfabeto'],
  ['N0-U01-C04', 'relacionar formas maiúsculas e minúsculas da mesma letra'],
  ['N0-U01-C05', 'reconhecer vogais e consoantes em nível introdutório'],
  ['N0-U01-C09', 'distinguir letras de algarismos, pontuação e outros sinais'],
  ['N0-U01-C06', 'reconhecer organização visual básica da escrita'],
  ['N0-U01-C02', 'perceber sons em palavras faladas sem confundi-los com letras'],
  ['N0-U01-C07', 'distinguir nome da letra do som que ela pode representar']
].map(([id, label]) => ({ id, label }));
const u1CompetencyIds = u1Competencies.map(item => item.id);

writeJson(`${u1Dir}/unit.json`, {
  schemaVersion: 1,
  id: 'N0-U01',
  levelId: 'N0',
  order: 1,
  title: 'Letras e primeiros sons',
  objective: 'Construir uma base concreta para reconhecer letras, organizar a escrita e começar a relacionar o que vemos ao que ouvimos.',
  competencies: u1Competencies,
  prerequisites: [],
  lessons: u1LessonRefs,
  verification: {
    id: 'N0-U01-V02',
    path: 'integrated-verification-v02.json',
    competencyIds: u1CompetencyIds
  },
  publication: {
    status: 'BLOCKED',
    blockers: [
      'Mídia controlada obrigatória pendente: N0-U01-L02-AUD-*',
      'Mídia controlada obrigatória pendente: N0-U01-L03-AUD-*',
      'Mídia controlada obrigatória pendente/reutilizada na V02: N0-U01-V01-AUD-*'
    ]
  }
});

const u2Dir = 'content/units/002-das-silabas-as-palavras';
const u2Staged = 'content/staging/t1/n0-u02';
const u2Authoring = readJson(`${u2Staged}/authoring.json`);
const u2Competencies = [
  ['N0-U02-C01', 'perceber uma palavra falada como um todo e como sequência de partes sonoras'],
  ['N0-U02-C02', 'usar o termo sílaba para nomear funcionalmente as partes sonoras da palavra'],
  ['N0-U02-C03', 'segmentar e recombinar sílabas em palavras faladas'],
  ['N0-U02-C04', 'relacionar sílabas ouvidas a trechos da palavra escrita'],
  ['N0-U02-C05', 'localizar sílabas no começo e no fim e reconhecer recorrências'],
  ['N0-U02-C06', 'reconhecer que sílabas escritas podem ter formatos diferentes'],
  ['N0-U02-C07', 'ordenar e completar sílabas para formar palavras familiares'],
  ['N0-U02-C08', 'usar apoio silábico para ler palavras e reduzir esse apoio progressivamente'],
  ['N0-U02-C09', 'relacionar palavras simples lidas a significados familiares'],
  ['N0-U02-C10', 'perceber que a relação entre letras e sons pode variar'],
  ['N0-U02-C11', 'distinguir fala e escrita como formas diferentes de comunicar']
].map(([id, label]) => ({ id, label }));
const u2CompetencyIds = u2Competencies.map(item => item.id);
const u2CompetencyByLesson = new Map([
  ['N0-U02-L01', ['N0-U02-C01', 'N0-U02-C02']],
  ['N0-U02-L02', ['N0-U02-C03']],
  ['N0-U02-L03', ['N0-U02-C04']],
  ['N0-U02-L04', ['N0-U02-C05']],
  ['N0-U02-L05', ['N0-U02-C06']],
  ['N0-U02-L06', ['N0-U02-C07']],
  ['N0-U02-L07', ['N0-U02-C08']],
  ['N0-U02-L08', ['N0-U02-C09']],
  ['N0-U02-L09', ['N0-U02-C10']],
  ['N0-U02-L10', ['N0-U02-C11']]
]);

const u2LessonRefs = [];
const u2AllowedNames = new Set();
for (const [index, definition] of u2Authoring.lessons.entries()) {
  const source = readJson(definition.source);
  const materialized = materializeLesson(source, definition);
  const filename = path.basename(definition.source);
  u2AllowedNames.add(filename);
  writeJson(`${u2Dir}/lessons/${filename}`, materialized);
  u2LessonRefs.push(lessonRef(definition.id, index + 1, definition.title, filename, u2CompetencyByLesson.get(definition.id) || []));
}
removeUndeclaredLessonJson(u2Dir, u2AllowedNames);

const u2BaseVerification = readJson(u2Authoring.verification.baseSource);
const u2Extension = readJson(u2Authoring.verification.extensionSource);
const u2Verification = materializeVerification(u2BaseVerification, u2Extension, u2Authoring.verification);
writeJson(`${u2Dir}/integrated-verification-v02.json`, u2Verification);

writeJson(`${u2Dir}/unit.json`, {
  schemaVersion: 1,
  id: 'N0-U02',
  levelId: 'N0',
  order: 2,
  title: 'Sílabas e primeiras palavras',
  objective: 'Perceber sílabas, relacionar som e escrita e usar essas partes como apoio para formar, ler e compreender primeiras palavras.',
  competencies: u2Competencies,
  prerequisites: ['N0-U01-V02'],
  lessons: u2LessonRefs,
  verification: {
    id: 'N0-U02-V02',
    path: 'integrated-verification-v02.json',
    competencyIds: u2CompetencyIds
  },
  publication: {
    status: 'BLOCKED',
    blockers: [
      'Mídia controlada obrigatória pendente/reutilizada: N0-U01-L02-AUD-* e N0-U01-L08-AUD-*',
      'Mídia controlada obrigatória pendente: N0-U02-L01-AUD-* e N0-U02-L02-AUD-*',
      'Imagens obrigatórias pendentes: N0-U02-L08-IMG-*',
      'Mídia da verificação V02 pendente/reutilizada: N0-U02-V01-AUD-* e N0-U02-V01-IMG-*'
    ]
  }
});

const course = readJson('content/course.json');
const retained = course.units.filter(item => !['N0-U01', 'N0-U02'].includes(item.id));
course.units = [
  { id: 'N0-U01', levelId: 'N0', order: 1, title: 'Letras e primeiros sons', manifest: 'units/001-fala-sons-escrita/unit.json' },
  { id: 'N0-U02', levelId: 'N0', order: 2, title: 'Sílabas e primeiras palavras', manifest: 'units/002-das-silabas-as-palavras/unit.json' },
  ...retained
];
writeJson('content/course.json', course);

console.log('T1.9 promoção materializada: N0-U01/N0-U02 + V02 + manifests + course.json.');
