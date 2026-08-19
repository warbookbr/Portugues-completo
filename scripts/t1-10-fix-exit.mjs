import fs from 'node:fs';

const file = 'content/levels/000-fundamentos/exit-verification.json';
const doc = JSON.parse(fs.readFileSync(file, 'utf8'));

const prerequisites = new Map(doc.prerequisiteEvidence.map(item => [item.verification, item]));
const u1 = prerequisites.get('N0-U01-V01');
const u2 = prerequisites.get('N0-U02-V01');
if (!u1 || !u2) throw new Error('Checkpoint N0 não contém as dependências históricas U1/U2 esperadas.');

u1.verification = 'N0-U01-V02';
u1.reason = 'letras e alfabeto, formas maiúsculas/minúsculas, categorias gráficas, organização básica da escrita e primeiros vínculos entre letras e sons';
u2.verification = 'N0-U02-V02';
u2.reason = 'consciência silábica, relação entre sílaba ouvida e escrita, formação/leitura de palavras, significado, variação letra-som e síntese fala/escrita';

doc.carryForwardEvidence.foundationalSoundWriting.requiredFrom = ['N0-U01-V02'];
doc.carryForwardEvidence.foundationalSoundWriting.reason = 'não repetir integralmente a base de letras, organização da escrita e primeiros vínculos entre som e grafia no capstone';
doc.carryForwardEvidence.syllablesAndWordReading.requiredFrom = ['N0-U02-V02'];
doc.carryForwardEvidence.syllablesAndWordReading.reason = 'não transformar a saída do nível em nova prova completa de consciência silábica, leitura inicial de palavras e relações letra-som';

doc.completionEvidence.clusters.foundationCarryForward.evidence = ['N0-U01-V02', 'N0-U02-V02', 'N0-U03-V01'];

const serialized = JSON.stringify(doc);
if (serialized.includes('N0-U01-V01') || serialized.includes('N0-U02-V01')) {
  throw new Error('Referência histórica V01 de U1/U2 permaneceu no checkpoint após a migração.');
}

fs.writeFileSync(file, `${JSON.stringify(doc, null, 2)}\n`);
console.log('N0-EXIT-V01 alinhado às verificações ativas N0-U01-V02 e N0-U02-V02.');
