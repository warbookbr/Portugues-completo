import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { annotateManifests, literacyTrack, mainPath, studentPath, unitLabel } from '../app/js/ui/course-tracks.js';
import { planPageHtml, unitsPageHtml } from '../app/js/ui/classic-pages.js';

// R1.8: Trilha de Alfabetização separada e opcional; caminho principal começa em N0-U03.
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const catalog = readJson('content/course.json');
const manifests = catalog.units.map(unit => readJson(path.join('content', unit.manifest)));
const annotated = annotateManifests(catalog, manifests);

const track = catalog.tracks.find(item => item.id === 'alfabetizacao');
assert.ok(track, 'catálogo precisa declarar a Trilha de Alfabetização');
assert.equal(track.optional, true, 'a trilha é opcional');
assert.deepEqual(literacyTrack(annotated).map(item => item.id), ['N0-U01', 'N0-U02'], 'a trilha reúne as unidades de letras e sílabas');
assert.equal(mainPath(annotated)[0].id, 'N0-U03', 'o caminho principal começa em Palavras, frases e sentido');

const byId = Object.fromEntries(annotated.map(item => [item.id, item]));
assert.equal(unitLabel(byId['N0-U01']), 'Trilha de Alfabetização · Unidade 1');
assert.equal(unitLabel(byId['N0-U02']), 'Trilha de Alfabetização · Unidade 2');
assert.equal(unitLabel(byId['N0-U03']), 'Fundamentos · Unidade 1', 'numeração exibida segue a posição no caminho principal');
assert.equal(unitLabel(byId['N0-U06']), 'Fundamentos · Unidade 4');
assert.equal(unitLabel(byId['N4-U09']), 'Domínio · Unidade 9', 'níveis sem trilha mantêm a numeração original');

const firstMainLesson = readJson('content/units/003-palavras-frases-sentido/lessons/001-palavra-significado-alem-forma.json');
assert.deepEqual(firstMainLesson.prerequisites, [], 'a entrada do caminho principal não exige a trilha');

const empty = { curriculum: { lessons: {}, current: {} }, review: { queue: [] } };
const units = unitsPageHtml(manifests, empty, catalog);
assert.match(units, /data-literacy-track/, 'página de unidades mostra a trilha em seção própria');
assert.ok(units.indexOf('N0-U03') < units.indexOf('data-literacy-track'), 'caminho principal vem antes da trilha opcional');
assert.doesNotMatch(units, />\s*N[0-4]\s*[·•]/, 'sem códigos de nível');

assert.deepEqual(studentPath(annotated, empty).map(item => item.id)[0], 'N0-U03', 'sem uso da trilha, o plano começa no caminho principal');
const withTrack = { curriculum: { lessons: { 'N0-U01-L03': { status: 'EM_ESTUDO' } }, current: { unitId: 'N0-U01', lessonId: 'N0-U01-L03' } }, review: { queue: [] } };
assert.deepEqual(studentPath(annotated, withTrack).slice(0, 3).map(item => item.id), ['N0-U01', 'N0-U02', 'N0-U03'], 'quem usa a trilha vê a trilha antes do caminho principal');
assert.doesNotMatch(planPageHtml(manifests, empty, catalog), /Letras e primeiros sons/, 'plano sem trilha não lista a trilha');
assert.match(planPageHtml(manifests, withTrack, catalog), /Letras e primeiros sons/, 'plano de quem usa a trilha inclui a trilha');

console.log('Trilhas: alfabetização separada e opcional, caminho principal a partir de N0-U03, numeração e plano coerentes.');
