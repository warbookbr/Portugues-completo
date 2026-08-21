import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentService } from '../app/js/services/content-service.js';
import { documentHtml, unitHtml } from '../app/js/ui/classic-renderer.js';
import { homeHtml } from '../app/js/ui/classic-home.js';
import { buildLessonStepGroups, lessonHasStudyHistory } from '../app/js/ui/classic-lesson-flow.js';
import { createEmptyProgress } from '../app/js/services/progress-service.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function fileFetch(url) {
  const projectPath = String(url).replace(/^\.\//, '');
  const filePath = path.resolve(root, projectPath);
  if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filePath)) {
    return { ok: false, status: 404, async json() { return null; } };
  }
  return { ok: true, status: 200, async json() { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } };
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const service = new ContentService({ basePath: './content', fetchImpl: fileFetch });
const catalog = await service.loadCatalog();
const units = [];
let lessonCount = 0;
let verificationCount = 0;

for (const unitRef of catalog.units) {
  const loadedUnit = await service.loadUnitManifest(unitRef.id, { catalog });
  const manifest = loadedUnit.manifest;
  units.push(manifest);
  const unitMarkup = unitHtml(manifest);
  assert.match(unitMarkup, new RegExp(manifest.id));
  assert.doesNotMatch(unitMarkup, /Unidade ainda não publicada/i);

  for (const lessonRef of manifest.lessons) {
    const loaded = await service.loadLesson(manifest.id, lessonRef.id);
    const html = documentHtml(loaded.runtime, { unitId: manifest.id, unitTitle: manifest.title });
    assert.match(html, new RegExp(escapeRegex(lessonRef.title)));
    assert.doesNotMatch(html, /Interação ainda não suportada/i, `${lessonRef.id} possui interação sem renderer`);
    assert.doesNotMatch(html, /Lição ainda não publicada/i);
    assert.equal(typeof loaded.runtime.presentation?.intro, 'string', `${lessonRef.id} precisa de apresentação pública no runtime`);
    assert.ok(loaded.runtime.presentation.intro.trim().length > 0, `${lessonRef.id} precisa de apresentação pública não vazia`);
    assert.notEqual(loaded.runtime.presentation.intro, loaded.runtime.objective, `${lessonRef.id} não pode reutilizar objective técnico como intro pública`);
    lessonCount += 1;
  }

  const verification = await service.loadVerification(manifest.id);
  const verificationHtml = documentHtml(verification.runtime, { unitId: manifest.id, unitTitle: manifest.title, verification: true });
  assert.doesNotMatch(verificationHtml, /Interação ainda não suportada/i, `${verification.runtime.id} possui interação sem renderer`);
  assert.match(verificationHtml, /Verificação da unidade/);
  verificationCount += 1;
}

const emptyProgress = createEmptyProgress();
const home = homeHtml(catalog, units, emptyProgress);
assert.match(home, /Letras e primeiros sons/);
assert.match(home, /Palavras, frases e sentido/);
assert.match(home, /Começar a estudar/);
assert.equal((home.match(/Começar a estudar/g) || []).length, 1, 'home deve ter um único CTA de início/retomada');
assert.doesNotMatch(home, /Continuar lição/i, 'home não deve manter CTA concorrente de continuar lição');
assert.doesNotMatch(home, /dashboard-hero/, 'home não deve manter hero introdutório acima da retomada');
assert.doesNotMatch(home, /Continue seu percurso de aprendizagem|Retome do ponto em que parou e avance no seu ritmo/i, 'home deve começar direto pela retomada/progresso');
assert.doesNotMatch(home, />\s*N[0-4]\s*[·•]/, 'home não deve expor código de nível ao aluno');
assert.doesNotMatch(home, /Ver plano de estudos/i, 'home não deve duplicar Plano de estudos');
assert.doesNotMatch(home, /<span class="eyebrow">Modo Clássico<\/span>/, 'home não deve repetir o modo já visível no cabeçalho');

const n0Lesson = await service.loadLesson('N0-U01', 'N0-U01-L03');
const guidedGroups = buildLessonStepGroups(n0Lesson.runtime.blocks);
assert.ok(guidedGroups.length >= 3 && guidedGroups.length <= 8, 'lição deve ser segmentada em poucas etapas significativas');
assert.ok(guidedGroups.length < n0Lesson.runtime.blocks.length, 'segmentação não deve criar uma tela por bloco');
assert.equal(guidedGroups.flat().length, n0Lesson.runtime.blocks.length, 'segmentação deve preservar todos os blocos');
assert.ok(guidedGroups.every(group => group.length <= 3), 'etapa não deve acumular conteúdo demais');
assert.equal(n0Lesson.runtime.presentation.introSource, 'AUTHORED', 'a nova primeira lição deve usar intro pública autorada');
assert.equal(n0Lesson.runtime.presentation.intro, 'Entender o que é uma letra e conhecer as letras do alfabeto, seus nomes e sua ordem.');
assert.notEqual(n0Lesson.runtime.presentation.intro, n0Lesson.runtime.objective);

const n0LessonHtml = documentHtml(n0Lesson.runtime, { unitId: 'N0-U01', unitTitle: 'Letras e primeiros sons' });
assert.match(n0LessonHtml, /Grupos/i, 'groups deve receber rótulo público em português');
assert.match(n0LessonHtml, /Importante/i, 'important deve receber rótulo público em português');
assert.match(n0LessonHtml, /o audio diz o nome da letra/i, 'aviso pedagógico importante deve permanecer visível');
assert.doesNotMatch(n0LessonHtml, /\bSOURCE\b|\bletterSet\b|\bPRESENTATION\b|\bCOVERAGE RULE\b|\bcoverageRule\b/i, 'metadados de autoria não podem vazar para o aluno');

assert.equal(lessonHasStudyHistory(emptyProgress, n0Lesson.runtime.id), false, 'abrir rota sem evidência não deve contar como lição já iniciada');
const onlyCurrent = createEmptyProgress();
onlyCurrent.curriculum.current.lessonId = n0Lesson.runtime.id;
assert.equal(lessonHasStudyHistory(onlyCurrent, n0Lesson.runtime.id), false, 'posição atual isolada não deve pular a intro');
const withLessonHistory = createEmptyProgress();
withLessonHistory.curriculum.lessons[n0Lesson.runtime.id] = { status: 'EM_ESTUDO' };
assert.equal(lessonHasStudyHistory(withLessonHistory, n0Lesson.runtime.id), true, 'registro pedagógico existente deve permitir retomada sem repetir intro');
const withEvidenceHistory = createEmptyProgress();
withEvidenceHistory.evidence[`${n0Lesson.runtime.id}/L03-A01`] = { status: 'PRATICADA' };
assert.equal(lessonHasStudyHistory(withEvidenceHistory, n0Lesson.runtime.id), true, 'evidência existente deve ser reconhecida como histórico de estudo');

const n0Verification = await service.loadVerification('N0-U01');
const n0Html = documentHtml(n0Verification.runtime, { unitId: 'N0-U01', unitTitle: 'Letras e primeiros sons', verification: true });
assert.match(n0Html, /Áudio ainda não disponível/);
assert.doesNotMatch(n0Html, /N0-U01-V01-AUD-/);

const u03Lesson = await service.loadLesson('N0-U03', 'N0-U03-L10');
const u03Html = documentHtml(u03Lesson.runtime, { unitId: 'N0-U03', unitTitle: 'Palavras, frases e sentido' });
assert.match(u03Html, /Registrar resposta/i);
assert.match(u03Html, /Autochecagem/i);
assert.doesNotMatch(u03Html, /Interação ainda não suportada/i);

const u04EvidenceLesson = await service.loadLesson('N0-U04', 'N0-U04-L04');
const u04EvidenceHtml = documentHtml(u04EvidenceLesson.runtime, { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos' });
assert.match(u04EvidenceHtml, /data-evidence-selection/);
assert.match(u04EvidenceHtml, /Marque os trechos do texto que sustentam sua resposta/i);
assert.doesNotMatch(u04EvidenceHtml, /requiredEvidence|requiredEvidenceParts|evidenceCorrectIndexes/);

const u04Verification = await service.loadVerification('N0-U04');
const u04VerificationHtml = documentHtml(u04Verification.runtime, { unitId: 'N0-U04', unitTitle: 'Lendo e compreendendo pequenos textos', verification: true });
assert.match(u04VerificationHtml, /Nesta verificação, você vai usar o que estudou nesta unidade/i);
assert.doesNotMatch(u04VerificationHtml, /Verificar se o aluno/i);

const u05OpenLesson = await service.loadLesson('N0-U05', 'N0-U05-L02');
const u05OpenHtml = documentHtml(u05OpenLesson.runtime, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens' });
assert.match(u05OpenHtml, /Registrar resposta/i);
assert.match(u05OpenHtml, /Autochecagem/i);
assert.match(u05OpenHtml, /Ver apoio opcional/i);
assert.doesNotMatch(u05OpenHtml, /A biblioteca está fechada hoje\./, 'modelo pós-envio não pode aparecer antes da tentativa');
assert.doesNotMatch(u05OpenHtml, /modelExamplesAfterSubmission|notAutomaticallyJudged|automaticObservations|selfReviewRequired/i);

const u05ControlledLesson = await service.loadLesson('N0-U05', 'N0-U05-L08');
const u05ControlledHtml = documentHtml(u05ControlledLesson.runtime, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens' });
assert.match(u05ControlledHtml, /Verificar resposta/i);
assert.match(u05ControlledHtml, /textarea/i);
assert.doesNotMatch(u05ControlledHtml, /Interação ainda não suportada/i);

const u05Verification = await service.loadVerification('N0-U05');
const u05VerificationHtml = documentHtml(u05Verification.runtime, { unitId: 'N0-U05', unitTitle: 'Escrevendo e organizando mensagens', verification: true });
assert.match(u05VerificationHtml, /Nesta verificação, você vai usar o que estudou nesta unidade/i);
assert.match(u05VerificationHtml, /Antes de escrever|informações essenciais/i);
assert.match(u05VerificationHtml, /Autochecagem/i);
assert.match(u05VerificationHtml, /Registrar resposta/i);
assert.doesNotMatch(u05VerificationHtml, /humanOrExternalReview|notAutomaticallyJudged|correctEssentialIndexes|acceptableOrders|principleCorrectIndex/i);

const u06AudioLesson = await service.loadLesson('N0-U06', 'N0-U06-L06');
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

const n1MultimodalLesson = await service.loadLesson('N1-U01', 'N1-U01-L07');
const n1MultimodalHtml = documentHtml(n1MultimodalLesson.runtime, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia' });
assert.match(n1MultimodalHtml, /Apoio visual/);
assert.match(n1MultimodalHtml, /Entrada principal → Recepção → Sala de inscrição/);
assert.doesNotMatch(n1MultimodalHtml, /Interação ainda não suportada/i);

const n1SourceLesson = await service.loadLesson('N1-U01', 'N1-U01-L08');
const n1SourceHtml = documentHtml(n1SourceLesson.runtime, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia' });
assert.match(n1SourceHtml, /Fonte do texto/);
assert.match(n1SourceHtml, /Secretaria Municipal de Saúde/);
assert.doesNotMatch(n1SourceHtml, /Interação ainda não suportada/i);

const n1SummaryLesson = await service.loadLesson('N1-U01', 'N1-U01-L09');
const n1SummaryHtml = documentHtml(n1SummaryLesson.runtime, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia' });
assert.match(n1SummaryHtml, /Registrar resposta/i);
assert.doesNotMatch(n1SummaryHtml, /Interação ainda não suportada/i);

const n1Verification = await service.loadVerification('N1-U01');
const n1VerificationHtml = documentHtml(n1Verification.runtime, { unitId: 'N1-U01', unitTitle: 'Lendo textos com mais autonomia', verification: true });
assert.match(n1VerificationHtml, /Registrar resposta/i);
assert.match(n1VerificationHtml, /A rota indicada é Entrada → Balcão → Corredor A → Sala 12/);
assert.doesNotMatch(n1VerificationHtml, /Interação ainda não suportada/i);

const n4Lesson = await service.loadLesson('N4-U09', 'N4-U09-L01');
const n4Html = documentHtml(n4Lesson.runtime, { unitId: 'N4-U09', unitTitle: 'Literatura, multimodalidade, autoria intermedial e digital' });
assert.match(n4Html, /avaliação pendente/i);
assert.match(n4Html, /Registrar resposta/i);
assert.equal(typeof n4Lesson.runtime.presentation?.intro, 'string');
assert.notEqual(n4Lesson.runtime.presentation.intro, n4Lesson.runtime.objective);

assert.equal(lessonCount, 77);
assert.equal(verificationCount, 8);
console.log(`Renderer clássico P7: ${lessonCount} lições + ${verificationCount} verificações, N0 completo + N1-U01 e caso-âncora N4 preservados.`);
