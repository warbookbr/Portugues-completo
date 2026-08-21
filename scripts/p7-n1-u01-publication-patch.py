from pathlib import Path


def replace_once(path, before, after):
    p = Path(path)
    text = p.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{path}: esperado 1 match, encontrado {count}: {before[:180]!r}')
    p.write_text(text.replace(before, after, 1))


renderer = 'app/js/ui/classic-renderer.js'
replace_once(
    renderer,
    """  ['optionalScaffold', 'Apoio opcional'], ['note', 'Observação'],
  ['groups', 'Grupos'], ['important', 'Importante']
]);
""",
    """  ['optionalScaffold', 'Apoio opcional'], ['note', 'Observação'],
  ['answer', 'Resposta'], ['classification', 'Classificação'],
  ['groups', 'Grupos'], ['important', 'Importante']
]);
"""
)

replace_once(
    renderer,
    """function renderKnownContent(content = {}) {
""",
    """function renderSourceMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return '';
  const rows = [];
  if (metadata.title) rows.push(`<div><dt>Título</dt><dd>${esc(metadata.title)}</dd></div>`);
  const author = metadata.authorOrInstitution || metadata.author || metadata.institution;
  if (author) rows.push(`<div><dt>Autoria / instituição</dt><dd>${esc(author)}</dd></div>`);
  if (metadata.section) rows.push(`<div><dt>Seção</dt><dd>${esc(metadata.section)}</dd></div>`);
  if (metadata.date) rows.push(`<div><dt>Data</dt><dd>${esc(metadata.date)}</dd></div>`);
  return rows.length ? `<div class="content-detail source-metadata"><strong>Fonte do texto</strong><dl class="data-list">${rows.join('')}</dl></div>` : '';
}

function renderSemanticVisual(visual, fallbackLabel = 'Apoio visual') {
  if (!visual || typeof visual !== 'object' || Array.isArray(visual)) return '';
  const equivalent = visual.accessibleEquivalent;
  if (typeof equivalent !== 'string' || !equivalent.trim()) return '';
  const label = visual.label || fallbackLabel;
  return `<div class="meaning-support semantic-visual" role="img" aria-label="${esc(equivalent)}"><strong>${esc(label)}</strong><p>${esc(equivalent)}</p></div>`;
}

function renderOpinionReason(analysis) {
  if (!analysis || typeof analysis !== 'object' || Array.isArray(analysis)) return '';
  const rows = [];
  if (analysis.opinion) rows.push(`<div class="content-detail"><strong>Opinião</strong><div>${esc(analysis.opinion)}</div></div>`);
  if (analysis.reason) rows.push(`<div class="content-detail"><strong>Razão</strong><div>${esc(analysis.reason)}</div></div>`);
  return rows.length ? `<div class="content-details opinion-reason">${rows.join('')}</div>` : '';
}

function renderKnownContent(content = {}) {
"""
)

replace_once(
    renderer,
    """    'source', 'presentation', 'coverageRule', 'requiredIntent', 'meaning', 'selfCheck',
    'textRemainsVisible', 'textRef', 'competency'
""",
    """    'source', 'presentation', 'coverageRule', 'requiredIntent', 'meaning', 'selfCheck',
    'bodyText', 'caption', 'visual', 'visualBadge', 'sourceMetadata', 'analysis',
    'textRemainsVisible', 'textRef', 'competency'
"""
)

replace_once(
    renderer,
    """  if (content.title) lead.push(`<h3>${esc(content.title)}</h3>`);
  if (content.text) lead.push(`<p>${esc(content.text)}</p>`);
  if (content.prompt) lead.push(`<p class="activity-prompt">${esc(content.prompt)}</p>`);
""",
    """  if (content.title) lead.push(`<h3>${esc(content.title)}</h3>`);
  if (content.text) lead.push(`<p>${esc(content.text)}</p>`);
  if (content.bodyText) lead.push(`<div class="content-detail reading-text"><strong>Texto</strong><p>${esc(content.bodyText)}</p></div>`);
  if (content.caption) lead.push(`<p class="reveal-note reading-caption"><strong>Legenda:</strong> ${esc(content.caption)}</p>`);
  if (content.sourceMetadata) lead.push(renderSourceMetadata(content.sourceMetadata));
  if (content.visual) lead.push(renderSemanticVisual(content.visual));
  if (content.visualBadge) lead.push(renderSemanticVisual(content.visualBadge, content.visualBadge.label || 'Informação visual'));
  if (content.analysis) lead.push(renderOpinionReason(content.analysis));
  if (content.prompt) lead.push(`<p class="activity-prompt">${esc(content.prompt)}</p>`);
"""
)

catalog_test = 'scripts/test-content-catalog.mjs'
replace_once(
    catalog_test,
    """assert.deepEqual(catalog.units.map(unit => unit.id), ['N0-U01', 'N0-U02', 'N0-U03', 'N0-U04', 'N0-U05', 'N0-U06', 'N4-U09']);
assert.deepEqual(catalog.units.filter(unit => unit.levelId === 'N0').map(unit => unit.order), [1, 2, 3, 4, 5, 6]);
""",
    """assert.deepEqual(catalog.units.map(unit => unit.id), ['N0-U01', 'N0-U02', 'N0-U03', 'N0-U04', 'N0-U05', 'N0-U06', 'N1-U01', 'N4-U09']);
assert.deepEqual(catalog.units.filter(unit => unit.levelId === 'N0').map(unit => unit.order), [1, 2, 3, 4, 5, 6]);
assert.deepEqual(catalog.units.filter(unit => unit.levelId === 'N1').map(unit => unit.order), [1]);
"""
)

replace_once(
    catalog_test,
    """for (const lessonRef of n0u6.manifest.lessons) {
  const loaded = await service.loadLesson('N0-U06', lessonRef.id);
  assert.equal(loaded.runtime.id, lessonRef.id);
  assert.deepEqual(loaded.runtime.competencyIds, lessonRef.competencyIds);
  assert.ok(loaded.runtime.blocks.length > 0, `${lessonRef.id}: runtime vazio.`);
  assert.ok(loaded.runtime.completion.clusters.length > 0, `${lessonRef.id}: sem clusters de conclusão.`);
}

const n4 = await service.loadUnitManifest('N4-U09', { catalog });
""",
    """for (const lessonRef of n0u6.manifest.lessons) {
  const loaded = await service.loadLesson('N0-U06', lessonRef.id);
  assert.equal(loaded.runtime.id, lessonRef.id);
  assert.deepEqual(loaded.runtime.competencyIds, lessonRef.competencyIds);
  assert.ok(loaded.runtime.blocks.length > 0, `${lessonRef.id}: runtime vazio.`);
  assert.ok(loaded.runtime.completion.clusters.length > 0, `${lessonRef.id}: sem clusters de conclusão.`);
}

const n1u1 = await service.loadUnitManifest('N1-U01', { catalog });
assert.equal(n1u1.manifest.title, 'Lendo textos com mais autonomia');
assert.equal(n1u1.manifest.order, 1);
assert.deepEqual(n1u1.manifest.prerequisites, ['N0-U06-V01']);
assert.equal(n1u1.manifest.lessons.length, 9);
assert.equal(n1u1.manifest.competencies.length, 9);
assert.deepEqual(n1u1.manifest.competencies.map(item => item.id), Array.from({ length: 9 }, (_, index) => `N1-U01-C${String(index + 1).padStart(2, '0')}`));
assert.equal(n1u1.manifest.verification.id, 'N1-U01-V01');
assert.deepEqual(n1u1.manifest.verification.competencyIds, n1u1.manifest.competencies.map(item => item.id));
assert.equal(n1u1.manifest.publication.status, 'READY');
assert.deepEqual(n1u1.manifest.publication.blockers, []);
for (const lessonRef of n1u1.manifest.lessons) {
  const loaded = await service.loadLesson('N1-U01', lessonRef.id);
  assert.equal(loaded.runtime.id, lessonRef.id);
  assert.deepEqual(loaded.runtime.competencyIds, lessonRef.competencyIds);
  assert.ok(loaded.runtime.blocks.length > 0, `${lessonRef.id}: runtime vazio.`);
  assert.ok(loaded.runtime.completion.clusters.length > 0, `${lessonRef.id}: sem clusters de conclusão.`);
}

const n4 = await service.loadUnitManifest('N4-U09', { catalog });
"""
)

replace_once(
    catalog_test,
    """const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
assert.deepEqual(n4Lesson.runtime.competencyIds, ['N4-U09-C01']);
""",
    """const n1u1SummaryLesson = await service.loadLesson('N1-U01', 'N1-U01-L09');
assert.deepEqual(n1u1SummaryLesson.runtime.competencyIds, ['N1-U01-C09']);
assert.ok(n1u1SummaryLesson.runtime.blocks.some(block => block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR'));

const n1u1MultimodalLesson = await service.loadLesson('N1-U01', 'N1-U01-L07');
assert.deepEqual(n1u1MultimodalLesson.runtime.competencyIds, ['N1-U01-C07']);
assert.ok(n1u1MultimodalLesson.runtime.blocks.some(block => block.content?.visual?.accessibleEquivalent));

const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
assert.deepEqual(n4Lesson.runtime.competencyIds, ['N4-U09-C01']);
"""
)

replace_once(
    catalog_test,
    """const n4Verification = await service.loadVerification('N4-U09');
""",
    """const n1u1Verification = await service.loadVerification('N1-U01');
assert.equal(n1u1Verification.runtime.id, 'N1-U01-V01');
assert.equal(n1u1Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n1u1Verification.runtime.competencyIds.length, 9);
assert.deepEqual(n1u1Verification.runtime.completion.clusters.map(cluster => cluster.id), ['globalComprehension', 'locationAndIntegration', 'referenceAndRelations', 'inferenceAndInsufficiency', 'multimodality', 'sourceOpinionReason', 'ownSummary']);
assert.equal(n1u1Verification.runtime.completion.clusters.find(cluster => cluster.id === 'ownSummary').satisfaction, 'PENDING_ALLOWED');
assert.equal(n1u1Verification.runtime.blocks.find(block => block.id === 'V01-Q07')?.activity?.evaluation?.mode, 'RELIABLE_EVALUATOR');

const n4Verification = await service.loadVerification('N4-U09');
"""
)

replace_once(
    catalog_test,
    """console.log('Catálogo/ContentService P7: U1–U6 publicadas em ordem, U05 preservada e U06 comunicação cotidiana descoberta ponta a ponta e N4-U09 preservada.');
""",
    """console.log('Catálogo/ContentService P7: N0 completo + N1-U01 publicados em ordem, leitura autônoma descoberta ponta a ponta e N4-U09 preservada.');
"""
)

print('Publicação N1-U01 adaptada: renderer público + descoberta de catálogo.')
