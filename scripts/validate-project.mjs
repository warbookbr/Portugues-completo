import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');

const errors = [];
const warnings = [];

const toPosix = value => value.split(path.sep).join('/');
const relative = value => toPosix(path.relative(root, value)) || '.';
const exists = value => fs.existsSync(value);

function error(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function isExternal(reference) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(reference);
}

function stripQueryHash(reference) {
  return reference.split('#')[0].split('?')[0];
}

function ensureFile(filePath, source) {
  if (!exists(filePath) || !fs.statSync(filePath).isFile()) {
    error(`${source}: referência inexistente -> ${relative(filePath)}`);
    return false;
  }
  return true;
}

function listFiles(directory, extensions = null) {
  if (!exists(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(full, extensions));
    if (entry.isFile() && (!extensions || extensions.some(ext => entry.name.endsWith(ext)))) files.push(full);
  }
  return files;
}

function validateProjectIndex() {
  const indexPath = path.join(root, 'PROJECT_INDEX.md');
  if (!ensureFile(indexPath, 'PROJECT_INDEX')) return;

  const text = fs.readFileSync(indexPath, 'utf8');
  const lines = text.split(/\r?\n/);
  const rootFiles = new Set(['index.html', 'README.md', 'PROJECT_INDEX.md']);
  const knownRoots = ['app/', 'content/', 'docs/', '.ChatGPT/', '.github/', 'scripts/'];

  for (const line of lines) {
    if (/(quando criado|quando implementado|se existir)/i.test(line)) continue;

    for (const match of line.matchAll(/`([^`\n]+)`/g)) {
      let candidate = match[1].trim().replace(/[.,;:]+$/, '');
      if (!candidate) continue;

      const looksLikeProjectPath =
        rootFiles.has(candidate) ||
        knownRoots.some(prefix => candidate === prefix.slice(0, -1) || candidate.startsWith(prefix));

      if (!looksLikeProjectPath) continue;

      candidate = candidate.replace(/\/+$/, '');
      const absolute = path.join(root, candidate);
      if (!exists(absolute)) {
        error(`PROJECT_INDEX.md referencia caminho inexistente: ${candidate}`);
      }
    }
  }

  const conventionalRootAllowlist = new Set([
    '.git',
    '.gitignore',
    '.gitattributes',
    'LICENSE',
    'LICENSE.md'
  ]);

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (conventionalRootAllowlist.has(entry.name)) continue;
    if (!text.includes(entry.name)) {
      error(`Entrada de raiz não mapeada em PROJECT_INDEX.md: ${entry.name}`);
    }
  }

  const docsDir = path.join(root, 'docs');
  if (exists(docsDir)) {
    for (const entry of fs.readdirSync(docsDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const ref = `docs/${entry.name}`;
        if (!text.includes(ref)) error(`Documento não mapeado em PROJECT_INDEX.md: ${ref}`);
      }
    }
  }

  const skillsDir = path.join(root, '.ChatGPT', 'skills');
  const chatgptReadme = path.join(root, '.ChatGPT', 'README.md');
  const skillIndexText =
    text + '\n' + (exists(chatgptReadme) ? fs.readFileSync(chatgptReadme, 'utf8') : '');

  if (exists(skillsDir)) {
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const ref = `.ChatGPT/skills/${entry.name}`;
      if (!skillIndexText.includes(ref)) {
        error(`Skill não mapeada em PROJECT_INDEX.md ou .ChatGPT/README.md: ${ref}`);
      }
    }
  }
}

const visitedJs = new Set();
const visitedCss = new Set();

function resolveLocal(reference, baseDir, source, { documentRelative = false } = {}) {
  if (!reference || isExternal(reference)) return null;
  const clean = stripQueryHash(reference);
  if (!clean) return null;

  if (clean.startsWith('/')) {
    error(`${source}: caminho absoluto "${reference}" pode quebrar no GitHub Pages de projeto; use caminho relativo`);
    return path.join(root, clean.replace(/^\/+/, ''));
  }

  return path.resolve(documentRelative ? root : baseDir, clean);
}

function validateCss(cssPath) {
  const key = path.resolve(cssPath);
  if (visitedCss.has(key)) return;
  if (!ensureFile(key, 'CSS')) return;
  visitedCss.add(key);

  const text = fs.readFileSync(key, 'utf8');

  for (const match of text.matchAll(/@import\s+(?:url\()?['"]([^'"]+)['"]\)?/g)) {
    const target = resolveLocal(match[1], path.dirname(key), relative(key));
    if (target) validateCss(target);
  }

  for (const match of text.matchAll(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/g)) {
    const reference = match[2].trim();
    const target = resolveLocal(reference, path.dirname(key), relative(key));
    if (target) ensureFile(target, relative(key));
  }
}

function validateJsModule(jsPath) {
  const key = path.resolve(jsPath);
  if (visitedJs.has(key)) return;
  if (!ensureFile(key, 'JavaScript')) return;
  visitedJs.add(key);

  const text = fs.readFileSync(key, 'utf8');

  const importPatterns = [
    /(?:import|export)\s+(?:[^'"]*?\s+from\s*)?['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g
  ];

  for (const pattern of importPatterns) {
    for (const match of text.matchAll(pattern)) {
      const reference = match[1];
      if (!reference.startsWith('.') && !reference.startsWith('/')) continue;
      const target = resolveLocal(reference, path.dirname(key), relative(key));
      if (target) validateJsModule(target);
    }
  }

  for (const match of text.matchAll(/fetch\(\s*['"]([^'"]+)['"]/g)) {
    const target = resolveLocal(match[1], path.dirname(key), relative(key), { documentRelative: true });
    if (target) ensureFile(target, relative(key));
  }
}

function validateHtmlEntryPoint() {
  const htmlPath = path.join(root, 'index.html');
  if (!ensureFile(htmlPath, 'HTML')) return;

  const text = fs.readFileSync(htmlPath, 'utf8');

  for (const match of text.matchAll(/\b(?:src|href)\s*=\s*['"]([^'"]+)['"]/g)) {
    const reference = match[1].trim();
    const target = resolveLocal(reference, path.dirname(htmlPath), 'index.html');
    if (!target) continue;
    if (!ensureFile(target, 'index.html')) continue;

    if (/\.(?:m?js)$/i.test(stripQueryHash(reference))) validateJsModule(target);
    if (/\.css$/i.test(stripQueryHash(reference))) validateCss(target);
  }

  const allJs = listFiles(path.join(root, 'app', 'js'), ['.js', '.mjs']).map(file => path.resolve(file));
  for (const file of allJs) {
    if (!visitedJs.has(file)) warn(`JavaScript não alcançável a partir de index.html: ${relative(file)}`);
  }

  const allCss = listFiles(path.join(root, 'app', 'css'), ['.css']).map(file => path.resolve(file));
  for (const file of allCss) {
    if (!visitedCss.has(file)) warn(`CSS não carregado a partir de index.html: ${relative(file)}`);
  }
}

validateProjectIndex();
validateHtmlEntryPoint();

for (const message of warnings) console.warn(`::warning::${message}`);

if (errors.length) {
  for (const message of errors) console.error(`::error::${message}`);
  console.error(`\nValidação falhou com ${errors.length} erro(s) e ${warnings.length} aviso(s).`);
  process.exit(1);
}

console.log(`Validação concluída: 0 erros, ${warnings.length} aviso(s).`);
