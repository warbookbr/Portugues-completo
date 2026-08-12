import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const errors = [];

const toPosix = value => value.split(path.sep).join('/');
const relative = value => toPosix(path.relative(root, value)) || '.';

function listJsonFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listJsonFiles(full));
    if (entry.isFile() && entry.name.endsWith('.json')) files.push(full);
  }
  return files;
}

function validateJsonFile(filePath) {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    JSON.parse(text);
  } catch (error) {
    errors.push(`${relative(filePath)}: JSON inválido — ${error.message}`);
  }
}

const rootsToValidate = [
  path.join(root, 'content'),
  path.join(root, 'schemas')
];

const files = rootsToValidate.flatMap(listJsonFiles);

for (const file of files) validateJsonFile(file);

if (errors.length) {
  for (const message of errors) console.error(`::error::${message}`);
  console.error(`\nValidação de JSON falhou com ${errors.length} erro(s).`);
  process.exit(1);
}

console.log(`Validação de JSON concluída: ${files.length} arquivo(s), 0 erros.`);
