from pathlib import Path
import json

ROOT = Path('.')
MARKER = ROOT / 'scripts/p7-u06-runtime-ready.marker'
if not MARKER.exists():
    raise SystemExit('runtime-ready ausente; publicação U06 permanece bloqueada.')

unit_path = ROOT / 'content/units/006-usando-lingua-cotidiano/unit.json'
manifest = {
  'schemaVersion': 1,
  'id': 'N0-U06',
  'levelId': 'N0',
  'order': 6,
  'title': 'Usando a língua no cotidiano',
  'objective': 'Compreender e produzir mensagens breves em situações cotidianas, considerando interlocutor, finalidade e contexto; usar perguntas, respostas, pedidos, ofertas, orientações, avisos e estratégias de esclarecimento; reconhecer adequação formal e informal e a variação do português sem transformar diferenças de uso, sotaque ou variedade em erro automático.',
  'competencies': [
    {'id': 'N0-U06-C01', 'label': 'identificar quem fala com quem e a finalidade de uma mensagem cotidiana simples'},
    {'id': 'N0-U06-C02', 'label': 'formular e compreender perguntas, respostas e pedidos de esclarecimento em situações simples'},
    {'id': 'N0-U06-C03', 'label': 'usar e compreender pedidos, ofertas e orientações adequados a situações cotidianas'},
    {'id': 'N0-U06-C04', 'label': 'compreender e produzir avisos, lembretes e instruções curtas com informação suficiente'},
    {'id': 'N0-U06-C05', 'label': 'compreender mensagens curtas do cotidiano integrando informações explícitas e finalidade'},
    {'id': 'N0-U06-C06', 'label': 'compreender oralmente mensagens curtas com apoio de repetição quando necessário, sem depender de transcrição prévia'},
    {'id': 'N0-U06-C07', 'label': 'escolher formas mais formais ou mais informais conforme situação e interlocutor, sem hierarquia automática de valor'},
    {'id': 'N0-U06-C08', 'label': 'reconhecer maneiras diferentes de usar o português sem confundir variação linguística com erro ou inferioridade'},
    {'id': 'N0-U06-C09', 'label': 'usar repetição, esclarecimento e confirmação como estratégias legítimas quando a comunicação não está clara'},
    {'id': 'N0-U06-C10', 'label': 'reformular e confirmar mensagens para reparar a comunicação, com ensaio oral como prática separada da validação de compreensibilidade'}
  ],
  'prerequisites': ['N0-U05-V01'],
  'lessons': [
    {'id': 'N0-U06-L01', 'order': 1, 'title': 'Quem fala com quem e para quê?', 'path': 'lessons/001-quem-fala-com-quem-e-para-que.json', 'competencyIds': ['N0-U06-C01']},
    {'id': 'N0-U06-L02', 'order': 2, 'title': 'Perguntar, responder e esclarecer', 'path': 'lessons/002-perguntar-responder-esclarecer.json', 'competencyIds': ['N0-U06-C02']},
    {'id': 'N0-U06-L03', 'order': 3, 'title': 'Pedir, oferecer e orientar', 'path': 'lessons/003-pedir-oferecer-orientar.json', 'competencyIds': ['N0-U06-C03']},
    {'id': 'N0-U06-L04', 'order': 4, 'title': 'Avisos, lembretes e instruções', 'path': 'lessons/004-avisos-lembretes-instrucoes.json', 'competencyIds': ['N0-U06-C04']},
    {'id': 'N0-U06-L05', 'order': 5, 'title': 'Compreender mensagens curtas do cotidiano', 'path': 'lessons/005-compreender-mensagens-curtas-cotidiano.json', 'competencyIds': ['N0-U06-C05']},
    {'id': 'N0-U06-L06', 'order': 6, 'title': 'Ouvindo mensagens curtas', 'path': 'lessons/006-ouvindo-mensagens-curtas.json', 'competencyIds': ['N0-U06-C06']},
    {'id': 'N0-U06-L07', 'order': 7, 'title': 'Mais formal ou mais informal?', 'path': 'lessons/007-mais-formal-ou-mais-informal.json', 'competencyIds': ['N0-U06-C07']},
    {'id': 'N0-U06-L08', 'order': 8, 'title': 'Maneiras diferentes de usar o português', 'path': 'lessons/008-maneiras-diferentes-de-usar-o-portugues.json', 'competencyIds': ['N0-U06-C08']},
    {'id': 'N0-U06-L09', 'order': 9, 'title': 'Quando não entendo: repetir, esclarecer e confirmar', 'path': 'lessons/009-quando-nao-entendo-repetir-esclarecer-confirmar.json', 'competencyIds': ['N0-U06-C09']},
    {'id': 'N0-U06-L10', 'order': 10, 'title': 'Reformular e confirmar a comunicação', 'path': 'lessons/010-reformular-e-confirmar-comunicacao.json', 'competencyIds': ['N0-U06-C10']}
  ],
  'verification': {
    'id': 'N0-U06-V01',
    'path': 'integrated-verification.json',
    'competencyIds': [f'N0-U06-C{i:02d}' for i in range(1, 11)]
  },
  'publication': {'status': 'READY', 'blockers': []}
}
unit_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

course_path = ROOT / 'content/course.json'
course = json.loads(course_path.read_text())
if not any(unit['id'] == 'N0-U06' for unit in course['units']):
    n4_index = next(i for i, unit in enumerate(course['units']) if unit['id'] == 'N4-U09')
    course['units'].insert(n4_index, {
      'id': 'N0-U06', 'levelId': 'N0', 'order': 6,
      'title': 'Usando a língua no cotidiano',
      'manifest': 'units/006-usando-lingua-cotidiano/unit.json'
    })
course_path.write_text(json.dumps(course, ensure_ascii=False, indent=2) + '\n')

# Catálogo canônico: expectativas U1-U6 e casos específicos da U06.
catalog_path = ROOT / 'scripts/test-content-catalog.mjs'
catalog = catalog_path.read_text()
catalog = catalog.replace(
    "['N0-U01', 'N0-U02', 'N0-U03', 'N0-U04', 'N0-U05', 'N4-U09']",
    "['N0-U01', 'N0-U02', 'N0-U03', 'N0-U04', 'N0-U05', 'N0-U06', 'N4-U09']",
    1
)
catalog = catalog.replace("[1, 2, 3, 4, 5]", "[1, 2, 3, 4, 5, 6]", 1)
anchor = "const n4 = await service.loadUnitManifest('N4-U09', { catalog });"
u06_catalog = """const n0u6 = await service.loadUnitManifest('N0-U06', { catalog });
assert.equal(n0u6.manifest.title, 'Usando a língua no cotidiano');
assert.equal(n0u6.manifest.order, 6);
assert.deepEqual(n0u6.manifest.prerequisites, ['N0-U05-V01']);
assert.equal(n0u6.manifest.lessons.length, 10);
assert.equal(n0u6.manifest.competencies.length, 10);
assert.deepEqual(n0u6.manifest.competencies.map(item => item.id), Array.from({ length: 10 }, (_, index) => `N0-U06-C${String(index + 1).padStart(2, '0')}`));
assert.equal(n0u6.manifest.verification.id, 'N0-U06-V01');
assert.deepEqual(n0u6.manifest.verification.competencyIds, n0u6.manifest.competencies.map(item => item.id));
assert.equal(n0u6.manifest.publication.status, 'READY');
assert.deepEqual(n0u6.manifest.publication.blockers, []);
for (const lessonRef of n0u6.manifest.lessons) {
  const loaded = await service.loadLesson('N0-U06', lessonRef.id);
  assert.equal(loaded.runtime.id, lessonRef.id);
  assert.deepEqual(loaded.runtime.competencyIds, lessonRef.competencyIds);
  assert.ok(loaded.runtime.blocks.length > 0, `${lessonRef.id}: runtime vazio.`);
  assert.ok(loaded.runtime.completion.clusters.length > 0, `${lessonRef.id}: sem clusters de conclusão.`);
}

"""
if u06_catalog not in catalog:
    if anchor not in catalog: raise RuntimeError('test-content-catalog: âncora N4 ausente')
    catalog = catalog.replace(anchor, u06_catalog + anchor, 1)

anchor = "const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');"
u06_cases = """const n0u6AudioLesson = await service.loadLesson('N0-U06', 'N0-U06-L06');
assert.deepEqual(n0u6AudioLesson.runtime.competencyIds, ['N0-U06-C06']);
assert.ok(n0u6AudioLesson.runtime.blocks.some(block => block.content?.transcriptHiddenUntilAttempt === true));
assert.ok(n0u6AudioLesson.runtime.blocks.some(block => block.content?.ttsText));

const n0u6RepairLesson = await service.loadLesson('N0-U06', 'N0-U06-L10');
assert.deepEqual(n0u6RepairLesson.runtime.competencyIds, ['N0-U06-C10']);
assert.ok(n0u6RepairLesson.runtime.blocks.some(block => block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR'));
assert.ok(n0u6RepairLesson.runtime.blocks.some(block => block.content?.oralRehearsal?.enabled === true));

"""
if u06_cases not in catalog:
    if anchor not in catalog: raise RuntimeError('test-content-catalog: âncora n4Lesson ausente')
    catalog = catalog.replace(anchor, u06_cases + anchor, 1)

anchor = "const n4Verification = await service.loadVerification('N4-U09');"
u06_ver = """const n0u6Verification = await service.loadVerification('N0-U06');
assert.equal(n0u6Verification.runtime.id, 'N0-U06-V01');
assert.equal(n0u6Verification.runtime.kind, 'UNIT_VERIFICATION');
assert.equal(n0u6Verification.runtime.competencyIds.length, 10);
assert.deepEqual(n0u6Verification.runtime.completion.clusters.map(cluster => cluster.id), ['comprehensionAndPurpose', 'functionalUseAndProduction', 'oralComprehension', 'adequacyVariationAndRepair', 'oralProductionPractice']);
assert.equal(n0u6Verification.runtime.blocks.find(block => block.id === 'V01-Q12')?.activity?.interaction, 'ORAL_RESPONSE');
assert.equal(n0u6Verification.runtime.blocks.find(block => block.id === 'V01-Q12')?.activity?.evaluation?.mode, 'RELIABLE_EVALUATOR');

"""
if u06_ver not in catalog:
    if anchor not in catalog: raise RuntimeError('test-content-catalog: âncora n4Verification ausente')
    catalog = catalog.replace(anchor, u06_ver + anchor, 1)

catalog = catalog.replace('U1–U5 publicadas em ordem', 'U1–U6 publicadas em ordem')
catalog = catalog.replace('U05 escrita aberta/controlada descoberta ponta a ponta', 'U05 preservada e U06 comunicação cotidiana descoberta ponta a ponta')
catalog_path.write_text(catalog)

# Renderer canônico: novos casos e contagem 68 + 7.
renderer_path = ROOT / 'scripts/test-classic-renderer.mjs'
renderer = renderer_path.read_text()
anchor = "const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');"
u06_renderer = """const u06AudioLesson = await service.loadLesson('N0-U06', 'N0-U06-L06');
const u06AudioHtml = documentHtml(u06AudioLesson.runtime, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano' });
assert.match(u06AudioHtml, /data-delayed-transcript-control/);
assert.match(u06AudioHtml, /Mostrar transcrição depois de ouvir/);
for (const block of u06AudioLesson.runtime.blocks) {
  if (typeof block.content?.transcriptAfterAttempt === 'string') assert.equal(u06AudioHtml.includes(block.content.transcriptAfterAttempt), false);
  for (const item of block.content?.items || []) if (typeof item.transcriptAfterAttempt === 'string') assert.equal(u06AudioHtml.includes(item.transcriptAfterAttempt), false);
}

const u06RepairLesson = await service.loadLesson('N0-U06', 'N0-U06-L10');
const u06RepairHtml = documentHtml(u06RepairLesson.runtime, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano' });
assert.match(u06RepairHtml, /Ensaio oral/);
assert.match(u06RepairHtml, /Este ensaio é opcional nesta etapa escrita/);
assert.match(u06RepairHtml, /Registrar resposta/);

const u06Verification = await service.loadVerification('N0-U06');
const u06VerificationHtml = documentHtml(u06Verification.runtime, { unitId: 'N0-U06', unitTitle: 'Usando a língua no cotidiano', verification: true });
assert.match(u06VerificationHtml, /Ensaio oral/);
assert.match(u06VerificationHtml, /Concluí o ensaio oral/);
assert.match(u06VerificationHtml, /não avalia pronúncia, sotaque ou compreensibilidade da fala/i);
assert.doesNotMatch(u06VerificationHtml, /transcriptAfterAttempt|requiredForClaimOfValidatedOralComprehensibility|externalReview/);

"""
if u06_renderer not in renderer:
    if anchor not in renderer: raise RuntimeError('test-classic-renderer: âncora N4 ausente')
    renderer = renderer.replace(anchor, u06_renderer + anchor, 1)
renderer = renderer.replace('assert.equal(lessonCount, 58);', 'assert.equal(lessonCount, 68);')
renderer = renderer.replace('assert.equal(verificationCount, 6);', 'assert.equal(verificationCount, 7);')
renderer = renderer.replace('N0-U03/U04/U05 e caso-âncora N4 preservados', 'N0-U03/U04/U05/U06 e caso-âncora N4 preservados')
renderer_path.write_text(renderer)

# CI: o teste semântico U06 vira gate permanente antes das políticas de progresso.
ci_path = ROOT / '.github/workflows/validate-project.yml'
ci = ci_path.read_text()
semantic_step = """      - name: Test P7 N0-U06 communication semantics
        run: node scripts/test-p7-u06-communication.mjs

"""
if semantic_step not in ci:
    marker = "      - name: Test progress policies\n"
    if marker not in ci: raise RuntimeError('CI: âncora Test progress policies ausente')
    ci = ci.replace(marker, semantic_step + marker, 1)
ci_path.write_text(ci)

print('P7/U06 publicação preparada: manifesto READY, catálogo U1-U6, gates 68+7 e semântica comunicativa no CI.')
