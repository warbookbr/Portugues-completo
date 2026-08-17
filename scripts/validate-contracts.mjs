import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const errors = [];

const expectedSchemas = [
  'schemas/course.schema.json',
  'schemas/unit.schema.json',
  'schemas/lesson.schema.json',
  'schemas/verification.schema.json',
  'schemas/progress.schema.json'
];

const supportedKeywords = new Set([
  '$schema', '$id', 'title', 'description',
  'type', 'required', 'additionalProperties', 'properties',
  'const', 'enum', 'pattern', 'minimum', 'minLength',
  'minItems', 'items', 'oneOf'
]);

const relative = value => path.relative(root, value).split(path.sep).join('/') || '.';
const absolute = value => path.resolve(root, value);

function addError(message) {
  errors.push(message);
}

function readJson(projectPath) {
  const filePath = absolute(projectPath);
  if (!fs.existsSync(filePath)) {
    addError(`${projectPath}: arquivo inexistente`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    addError(`${projectPath}: JSON inválido — ${error.message}`);
    return null;
  }
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function matchesType(value, type) {
  switch (type) {
    case 'null': return value === null;
    case 'array': return Array.isArray(value);
    case 'object': return value !== null && typeof value === 'object' && !Array.isArray(value);
    case 'integer': return typeof value === 'number' && Number.isInteger(value);
    case 'number': return typeof value === 'number' && Number.isFinite(value);
    case 'string': return typeof value === 'string';
    case 'boolean': return typeof value === 'boolean';
    default: return false;
  }
}

function scanSchema(schema, location) {
  if (schema === true || schema === false) return;
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    addError(`${location}: definição de schema deve ser objeto/boolean`);
    return;
  }

  for (const key of Object.keys(schema)) {
    if (!supportedKeywords.has(key)) addError(`${location}: keyword não suportada pelo validator local -> ${key}`);
  }

  if (schema.$schema && schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') {
    addError(`${location}: $schema deve usar Draft 2020-12`);
  }

  if (schema.properties && typeof schema.properties === 'object') {
    for (const [key, child] of Object.entries(schema.properties)) scanSchema(child, `${location}.properties.${key}`);
  }
  if (schema.items && typeof schema.items === 'object') scanSchema(schema.items, `${location}.items`);
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    scanSchema(schema.additionalProperties, `${location}.additionalProperties`);
  }
  if (Array.isArray(schema.oneOf)) {
    schema.oneOf.forEach((child, index) => scanSchema(child, `${location}.oneOf[${index}]`));
  }
}

function validateValue(schema, value, location) {
  if (schema === true) return [];
  if (schema === false) return [`${location}: valor proibido pelo schema`];
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return [`${location}: schema inválido`];

  const local = [];
  const fail = message => local.push(`${location}: ${message}`);

  if (Array.isArray(schema.oneOf)) {
    const results = schema.oneOf.map(child => validateValue(child, value, location));
    const matches = results.filter(result => result.length === 0).length;
    if (matches !== 1) fail(`oneOf exige exatamente 1 alternativa válida; encontradas ${matches}`);
  }

  if (Object.prototype.hasOwnProperty.call(schema, 'const') && !deepEqual(value, schema.const)) {
    fail(`esperado const ${JSON.stringify(schema.const)}, recebido ${JSON.stringify(value)}`);
  }

  if (Array.isArray(schema.enum) && !schema.enum.some(candidate => deepEqual(candidate, value))) {
    fail(`valor fora do enum: ${JSON.stringify(value)}`);
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some(type => matchesType(value, type))) {
      fail(`tipo inválido; esperado ${types.join('|')}, recebido ${value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value}`);
      return local;
    }
  }

  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  if (isObject) {
    const required = Array.isArray(schema.required) ? schema.required : [];
    for (const key of required) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) local.push(`${location}.${key}: campo obrigatório ausente`);
    }

    const properties = schema.properties && typeof schema.properties === 'object' ? schema.properties : {};
    for (const [key, childValue] of Object.entries(value)) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        local.push(...validateValue(properties[key], childValue, `${location}.${key}`));
        continue;
      }
      if (schema.additionalProperties === false) {
        local.push(`${location}.${key}: propriedade adicional não permitida`);
      } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
        local.push(...validateValue(schema.additionalProperties, childValue, `${location}.${key}`));
      }
    }
  }

  if (Array.isArray(value)) {
    if (Number.isInteger(schema.minItems) && value.length < schema.minItems) fail(`mínimo de ${schema.minItems} item(ns)`);
    if (schema.items && typeof schema.items === 'object') {
      value.forEach((item, index) => local.push(...validateValue(schema.items, item, `${location}[${index}]`)));
    }
  }

  if (typeof value === 'string') {
    if (Number.isInteger(schema.minLength) && value.length < schema.minLength) fail(`string menor que minLength=${schema.minLength}`);
    if (schema.pattern) {
      try {
        if (!new RegExp(schema.pattern).test(value)) fail(`não corresponde ao pattern ${schema.pattern}`);
      } catch (error) {
        fail(`pattern inválido no schema — ${error.message}`);
      }
    }
  }

  if (typeof value === 'number' && Number.isFinite(value) && typeof schema.minimum === 'number' && value < schema.minimum) {
    fail(`valor ${value} menor que minimum=${schema.minimum}`);
  }

  return local;
}

function validateSchemaFiles() {
  for (const projectPath of expectedSchemas) {
    const schema = readJson(projectPath);
    if (!schema) continue;
    if (!schema.$id) addError(`${projectPath}: $id obrigatório`);
    scanSchema(schema, projectPath);
  }
}

function validateFixtures() {
  const manifestPath = 'schemas/fixtures/p1/manifest.json';
  const manifest = readJson(manifestPath);
  if (!manifest) return 0;
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.cases)) {
    addError(`${manifestPath}: formato de manifesto de fixtures inválido`);
    return 0;
  }

  let validated = 0;
  const ids = new Set();

  for (const fixture of manifest.cases) {
    if (!fixture?.id || !fixture.schema || !fixture.data || !Array.isArray(fixture.sources)) {
      addError(`${manifestPath}: fixture incompleta -> ${JSON.stringify(fixture)}`);
      continue;
    }
    if (ids.has(fixture.id)) addError(`${manifestPath}: ID duplicado -> ${fixture.id}`);
    ids.add(fixture.id);

    const schema = readJson(fixture.schema);
    const data = readJson(fixture.data);
    if (!schema || !data) continue;

    for (const source of fixture.sources) {
      if (!fs.existsSync(absolute(source))) addError(`${fixture.id}: fonte real inexistente -> ${source}`);
    }

    const validationErrors = validateValue(schema, data, fixture.data);
    for (const message of validationErrors) addError(`${fixture.id}: ${message}`);

    const compatibility = fixture.compatibility || {};
    const primarySource = fixture.sources[0];
    if ((compatibility.expectSourceSchemaVersion !== undefined || compatibility.expectSameId) && primarySource?.endsWith('.json')) {
      const source = readJson(primarySource);
      if (source) {
        if (compatibility.expectSourceSchemaVersion !== undefined && source.schemaVersion !== compatibility.expectSourceSchemaVersion) {
          addError(`${fixture.id}: fonte ${primarySource} deveria ter schemaVersion=${compatibility.expectSourceSchemaVersion}`);
        }
        if (compatibility.expectSameId && source.id !== data.id) {
          addError(`${fixture.id}: ID normalizado ${data.id} diverge da fonte ${source.id}`);
        }
      }
    }

    if (validationErrors.length === 0) validated += 1;
  }

  return validated;
}

function runSelfTests() {
  const schema = {
    type: 'object',
    required: ['status'],
    additionalProperties: false,
    properties: { status: { enum: ['OK'] } }
  };
  const invalid = validateValue(schema, { status: 'NO', extra: true }, 'self-test');
  if (invalid.length < 2) addError('self-test: validator não detectou enum + propriedade adicional inválidos');
  const valid = validateValue(schema, { status: 'OK' }, 'self-test');
  if (valid.length !== 0) addError(`self-test: valor válido foi rejeitado -> ${valid.join('; ')}`);
}

validateSchemaFiles();
runSelfTests();
const validatedFixtures = validateFixtures();

if (errors.length) {
  for (const message of errors) console.error(`::error::${message}`);
  console.error(`\nValidação de contratos falhou com ${errors.length} erro(s).`);
  process.exit(1);
}

console.log(`Contratos válidos: ${expectedSchemas.length} schema(s), ${validatedFixtures} fixture(s) P1, 0 erros.`);
