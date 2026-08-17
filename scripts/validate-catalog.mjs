import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateValue } from './validate-contracts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const absolute = projectPath => path.resolve(root, projectPath);

function fail(message) { errors.push(message); }
function readJson(projectPath) {
  try { return JSON.parse(fs.readFileSync(absolute(projectPath), 'utf8')); }
  catch (error) { fail(`${projectPath}: ${error.message}`); return null; }
}
function validateAgainst(schemaPath, dataPath, data) {
  const schema = readJson(schemaPath);
  if (!schema || !data) return;
  for (const message of validateValue(schema, data, dataPath)) fail(message);
}
function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) { if (seen.has(value)) fail(`${label}: valor duplicado -> ${value}`); seen.add(value); }
}
function resolveInside(baseDir, relativePath, label) {
  const base = absolute(baseDir);
  const resolved = path.resolve(base, relativePath);
  if (resolved !== base && !resolved.startsWith(`${base}${path.sep}`)) { fail(`${label}: caminho escapa do diretório da unidade -> ${relativePath}`); return null; }
  return resolved;
}

const catalogPath = 'content/course.json';
const catalog = readJson(catalogPath);
validateAgainst('schemas/course.schema.json', catalogPath, catalog);
let manifestsValidated = 0;
let contentRefsValidated = 0;

if (catalog) {
  assertUnique(catalog.levels.map(level => level.id), 'course.levels.id');
  assertUnique(catalog.units.map(unit => unit.id), 'course.units.id');
  const levelIds = new Set(catalog.levels.map(level => level.id));
  const catalogManifestPaths = new Set(catalog.units.map(unit => `content/${unit.manifest}`));

  for (const unitRef of catalog.units) {
    if (!levelIds.has(unitRef.levelId)) fail(`${unitRef.id}: levelId ${unitRef.levelId} não existe em course.levels`);
    const manifestPath = `content/${unitRef.manifest}`;
    const manifest = readJson(manifestPath);
    if (!manifest) continue;
    validateAgainst('schemas/unit.schema.json', manifestPath, manifest);
    manifestsValidated += 1;
    for (const key of ['id', 'levelId', 'order', 'title']) if (manifest[key] !== unitRef[key]) fail(`${manifestPath}: ${key} diverge de course.json`);

    const unitDir = path.dirname(manifestPath);
    const competencyIds = manifest.competencies.map(item => item.id);
    assertUnique(competencyIds, `${manifest.id}.competencies`);
    const competencySet = new Set(competencyIds);
    assertUnique(manifest.lessons.map(item => item.id), `${manifest.id}.lessons.id`);
    assertUnique(manifest.lessons.map(item => item.order), `${manifest.id}.lessons.order`);
    const declaredLessonPaths = new Set();

    for (const lesson of manifest.lessons) {
      for (const competencyId of lesson.competencyIds || []) if (!competencySet.has(competencyId)) fail(`${manifest.id}/${lesson.id}: competencyId inexistente -> ${competencyId}`);
      const sourceAbsolute = resolveInside(unitDir, lesson.path, `${manifest.id}/${lesson.id}`);
      if (!sourceAbsolute || !fs.existsSync(sourceAbsolute)) { fail(`${manifest.id}/${lesson.id}: fonte inexistente -> ${lesson.path}`); continue; }
      const sourcePath = path.relative(root, sourceAbsolute).split(path.sep).join('/');
      declaredLessonPaths.add(sourcePath);
      const source = readJson(sourcePath);
      if (!source) continue;
      if (source.schemaVersion !== 1) fail(`${sourcePath}: autoria histórica deveria permanecer schemaVersion=1 em P3`);
      if (source.id !== lesson.id) fail(`${sourcePath}: id ${source.id} diverge do manifesto ${lesson.id}`);
      if (source.title !== lesson.title) fail(`${sourcePath}: title diverge do manifesto`);
      contentRefsValidated += 1;
    }

    const lessonDir = absolute(`${unitDir}/lessons`);
    const authoredLessonPaths = fs.readdirSync(lessonDir).filter(name => name.endsWith('.json')).map(name => path.relative(root, path.join(lessonDir, name)).split(path.sep).join('/'));
    for (const sourcePath of authoredLessonPaths) if (!declaredLessonPaths.has(sourcePath)) fail(`${manifest.id}: lição autoral não declarada no manifesto -> ${sourcePath}`);
    for (const sourcePath of declaredLessonPaths) if (!authoredLessonPaths.includes(sourcePath)) fail(`${manifest.id}: manifesto declara lição fora do conjunto autoral -> ${sourcePath}`);

    if (manifest.verification) {
      for (const competencyId of manifest.verification.competencyIds || []) if (!competencySet.has(competencyId)) fail(`${manifest.id}/${manifest.verification.id}: competencyId inexistente -> ${competencyId}`);
      const verificationAbsolute = resolveInside(unitDir, manifest.verification.path, `${manifest.id}/${manifest.verification.id}`);
      if (!verificationAbsolute || !fs.existsSync(verificationAbsolute)) fail(`${manifest.id}: verificação inexistente -> ${manifest.verification.path}`);
      else {
        const verificationPath = path.relative(root, verificationAbsolute).split(path.sep).join('/');
        const verification = readJson(verificationPath);
        if (verification && verification.id !== manifest.verification.id) fail(`${verificationPath}: id diverge do manifesto`);
        contentRefsValidated += 1;
      }
    }
  }

  const unitRoot = absolute('content/units');
  const discoveredManifests = [];
  for (const entry of fs.readdirSync(unitRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const projectPath = `content/units/${entry.name}/unit.json`;
    if (fs.existsSync(absolute(projectPath))) discoveredManifests.push(projectPath);
  }
  for (const manifestPath of discoveredManifests) if (!catalogManifestPaths.has(manifestPath)) fail(`manifesto real órfão do catálogo -> ${manifestPath}`);
}

if (errors.length) {
  for (const message of errors) console.error(`::error::${message}`);
  console.error(`\nIntegridade do catálogo falhou com ${errors.length} erro(s).`);
  process.exit(1);
}
console.log(`Catálogo íntegro: ${manifestsValidated} manifesto(s), ${contentRefsValidated} referência(s) de conteúdo, 0 erros.`);
