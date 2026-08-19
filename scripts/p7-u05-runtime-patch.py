from pathlib import Path


def replace_once(file, before, after):
    path = Path(file)
    text = path.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es)')
    path.write_text(text.replace(before, after, 1))

# ---------------------------------------------------------------------------
# Normalizador: autoria aberta, planejamento, edição controlada e ordens válidas.
# ---------------------------------------------------------------------------
replace_once(
    'app/js/services/content-normalizer-v1.js',
    """function isOpenAuthoredActivity(block) {
  return block?.responseMode === 'free-text'
    || String(block?.interaction || '').includes('free-text')
""",
    """function isOpenAuthoredActivity(block) {
  return String(block?.responseMode || '').startsWith('free-text')
    || String(block?.interaction || '').includes('free-text')
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """function materializeCommonLegacyActivity(block, sourceDocument) {
  const sourceText = evidenceSourceText(block, sourceDocument);
  let materialized = materializeEvidenceSelection(block, sourceText);

  if (!Array.isArray(materialized.items) && Array.isArray(materialized.contexts)) {
""",
    """const CONTROLLED_TEXT_INTERACTIONS = new Set(['insert-spaces', 'edit-capitalization-and-boundary', 'edit-controlled-text', 'insert-commas']);
const GENERIC_SELF_REVIEW = Object.freeze([
  'Minha resposta comunica o objetivo apresentado?',
  'Reli minha resposta antes de enviar?'
]);

function materializeCommonLegacyActivity(block, sourceDocument) {
  const sourceText = evidenceSourceText(block, sourceDocument);
  let materialized = materializeEvidenceSelection(block, sourceText);

  // Planejamento por seleção: transforma cartões autorais em múltipla escolha sem expor flags essential.
  const planningIndexes = Array.isArray(materialized.correctEssentialIndexes)
    ? materialized.correctEssentialIndexes
    : Array.isArray(materialized.informationCards) && Array.isArray(materialized.correctIndexes)
      ? materialized.correctIndexes
      : null;
  if (Array.isArray(materialized.informationCards) && planningIndexes) {
    const { informationCards, correctEssentialIndexes, ...rest } = materialized;
    materialized = {
      ...clone(rest),
      options: informationCards.map(item => typeof item === 'string' ? item : item?.text ?? String(item)),
      correctIndexes: clone(planningIndexes),
      interaction: 'multiple-choice'
    };
  }

  // Algumas atividades históricas chamam as alternativas de versions.
  if (!Array.isArray(materialized.options) && Array.isArray(materialized.versions) && Object.prototype.hasOwnProperty.call(materialized, 'correctIndex')) {
    const { versions, ...rest } = materialized;
    materialized = { ...clone(rest), options: clone(versions) };
  }

  // Ordenação pode aceitar mais de uma sequência correta.
  if (Array.isArray(materialized.cards) && Array.isArray(materialized.acceptableOrders) && materialized.acceptableOrders.length) {
    materialized.availableTiles = clone(materialized.cards);
    materialized.acceptedSequences = clone(materialized.acceptableOrders);
  }

  // Edições controladas têm um alvo exato e podem ser verificadas deterministicamente.
  if (CONTROLLED_TEXT_INTERACTIONS.has(String(materialized.interaction || '')) && typeof materialized.expected === 'string') {
    if (Array.isArray(materialized.principleOptions) && Number.isInteger(materialized.principleCorrectIndex)) {
      materialized.items = [
        { id: 'edit', acceptedResult: materialized.expected },
        { id: 'principle', prompt: materialized.principleQuestion || 'Qual princípio explica esta edição?', options: clone(materialized.principleOptions), correctIndex: materialized.principleCorrectIndex }
      ];
      materialized.interaction = 'composite';
    } else {
      materialized.interaction = 'short-text';
    }
    materialized.automaticValidation = true;
  }

  if (!Array.isArray(materialized.items) && Array.isArray(materialized.contexts)) {
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """  if (isOpenAuthoredActivity(materialized)) {
    const selfReviewQuestions = Array.isArray(materialized.selfReviewQuestions)
      ? materialized.selfReviewQuestions
      : Array.isArray(sourceDocument?.assessmentBehavior?.selfReview?.questions)
        ? sourceDocument.assessmentBehavior.selfReview.questions
        : [];
    materialized = {
      ...materialized,
      automaticValidation: false,
      recordResponse: true,
      interaction: Array.isArray(materialized.items) && materialized.items.length ? 'composite' : 'long-text',
      ...(selfReviewQuestions.length ? { selfReviewQuestions: clone(selfReviewQuestions) } : {})
    };
  }
""",
    """  if (isOpenAuthoredActivity(materialized)) {
    const selfReviewQuestions = Array.isArray(materialized.selfReviewQuestions) && materialized.selfReviewQuestions.length
      ? materialized.selfReviewQuestions
      : Array.isArray(materialized.selfReview) && materialized.selfReview.length
        ? materialized.selfReview
        : Array.isArray(sourceDocument?.assessmentBehavior?.selfReview?.questions) && sourceDocument.assessmentBehavior.selfReview.questions.length
          ? sourceDocument.assessmentBehavior.selfReview.questions
          : materialized.selfReviewRequired === true
            ? GENERIC_SELF_REVIEW
            : [];
    materialized = {
      ...materialized,
      automaticValidation: false,
      recordResponse: true,
      interaction: Array.isArray(materialized.items) && materialized.items.length ? 'composite' : 'long-text',
      ...(selfReviewQuestions.length ? { selfReviewQuestions: clone(selfReviewQuestions) } : {}),
      ...(Array.isArray(materialized.essentialInformation) && materialized.essentialInformation.length
        ? { planningChecklist: clone(materialized.essentialInformation) }
        : {})
    };
  }
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """  const directKeys = ['correct', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
""",
    """  const directKeys = ['correct', 'expected', 'acceptedResult', 'acceptedResults', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """  const topLevelKeys = ['correct', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
""",
    """  const topLevelKeys = ['correct', 'expected', 'acceptedResult', 'acceptedResults', 'correctIndex', 'correctIndexes', 'correctSequence', 'acceptedSequences', 'auditoryCorrect', 'relationCorrectIndex'];
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """    'acceptedSequences', 'acceptedResult', 'acceptedResults', 'correctFunction', 'correctGroup', 'correctAnswer',
""",
    """    'acceptedSequences', 'acceptableOrders', 'acceptedResult', 'acceptedResults', 'correctFunction', 'correctGroup', 'correctAnswer',
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """  'auditoryCorrect', 'relationCorrectIndex', 'requiredEvidence', 'requiredEvidenceParts', 'acceptableEvidence',
""",
    """  'auditoryCorrect', 'relationCorrectIndex', 'correctEssentialIndexes', 'principleCorrectIndex', 'requiredEvidence', 'requiredEvidenceParts', 'acceptableEvidence',
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """function isLessonActivity(block, requiredIds) {
  if (!block || typeof block !== 'object') return false;
  if (requiredIds.has(block.id)) return true;
""",
    """function isLessonActivity(block, requiredIds) {
  if (!block || typeof block !== 'object') return false;
  if (requiredIds.has(block.id)) return true;
  if (isOpenAuthoredActivity(block)) return true;
"""
)

# ---------------------------------------------------------------------------
# Regras de conclusão e mapeamentos explícitos da U05.
# ---------------------------------------------------------------------------
replace_once(
    'app/js/services/content-normalization-rules-v1.js',
    """  'N0-U03-L01': {
""",
    """  // N0-U05 — escrita autoral: pending não equivale a domínio e apoio não é penalidade.
  'N0-U05-L02': {
    clusters: [
      { id: 'ownWords', required: true, evidenceIds: ['L02-A01', 'L02-A02'], satisfaction: 'PENDING_ALLOWED', criteria: [{ type: 'MIN_EVIDENCE_WITHOUT_HINT', minimum: 1 }] },
      { id: 'selfReview', required: true, evidenceIds: ['L02-A01', 'L02-A02'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N0-U05-L03': {
    clusters: [
      { id: 'organization', required: true, evidenceIds: ['L03-C01', 'L03-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'ownMessage', required: true, evidenceIds: ['L03-A02'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N0-U05-L04': {
    clusters: [
      { id: 'purposeRecognition', required: true, evidenceIds: ['L04-C01', 'L04-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'functionalProduction', required: true, evidenceIds: ['L04-A02'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N0-U05-L09': {
    clusters: [
      { id: 'basicUse', required: true, evidenceIds: ['L09-C01', 'L09-A01'], satisfaction: 'DEMONSTRATED_REQUIRED', criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['L09-C01', 'L09-A01'], minimum: 4 }] },
      { id: 'contextualUnderstanding', required: true, evidenceIds: ['L09-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: { 'L09-C01': { threshold: 0.5 }, 'L09-A01': { threshold: 2 / 3 } }
  },
  'N0-U05-V01': {
    clusters: [
      { id: 'planningAndPurpose', required: true, evidenceIds: ['V01-Q01', 'V01-Q02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'organizationAndSufficiency', required: true, evidenceIds: ['V01-Q03', 'V01-Q04'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'revision', required: true, evidenceIds: ['V01-Q05', 'V01-Q06'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'graphicConventions', required: true, evidenceIds: ['V01-Q07', 'V01-Q09', 'V01-Q10'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'ownProduction', required: true, evidenceIds: ['V01-Q08'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: { 'V01-Q09': { threshold: 2 / 3 } }
  },

  'N0-U03-L01': {
"""
)

replace_once(
    'app/js/services/content-normalization-rules-v1.js',
    """  'listen-reveal-relation-classify': 'COMPOSITE'
});
""",
    """  'listen-reveal-relation-classify': 'COMPOSITE',
  'insert-spaces': 'SHORT_TEXT',
  'edit-capitalization-and-boundary': 'SHORT_TEXT',
  'edit-controlled-text': 'SHORT_TEXT',
  'insert-commas': 'SHORT_TEXT'
});
"""
)

# ---------------------------------------------------------------------------
# Progresso: critério reutilizável de produção sem abrir apoio opcional.
# ---------------------------------------------------------------------------
replace_once(
    'app/js/services/progress-service.js',
    """    if (criterion.type === 'TOTAL_ITEM_HITS_AT_LEAST') {
      const evidenceIds = Array.isArray(criterion.evidenceIds) && criterion.evidenceIds.length ? criterion.evidenceIds : (cluster.evidenceIds || []);
      let hits = 0;
      for (const evidenceId of evidenceIds) {
        const itemResults = progress.evidence[progressDocumentRef(document.id, evidenceId)]?.itemResults || {};
        hits += Object.values(itemResults).filter(Boolean).length;
      }
      if (hits < Number(criterion.minimum || 0)) return false;
    }
""",
    """    if (criterion.type === 'TOTAL_ITEM_HITS_AT_LEAST') {
      const evidenceIds = Array.isArray(criterion.evidenceIds) && criterion.evidenceIds.length ? criterion.evidenceIds : (cluster.evidenceIds || []);
      let hits = 0;
      for (const evidenceId of evidenceIds) {
        const itemResults = progress.evidence[progressDocumentRef(document.id, evidenceId)]?.itemResults || {};
        hits += Object.values(itemResults).filter(Boolean).length;
      }
      if (hits < Number(criterion.minimum || 0)) return false;
      continue;
    }
    if (criterion.type === 'MIN_EVIDENCE_WITHOUT_HINT') {
      const evidenceIds = Array.isArray(criterion.evidenceIds) && criterion.evidenceIds.length ? criterion.evidenceIds : (cluster.evidenceIds || []);
      const minimum = Number(criterion.minimum || 0);
      const count = evidenceIds.filter(evidenceId => {
        const evidence = progress.evidence[progressDocumentRef(document.id, evidenceId)];
        return evidence && statusSatisfies(evidence.status, cluster.satisfaction) && evidence.support?.hintUsed !== true;
      }).length;
      if (count < minimum) return false;
    }
"""
)

# ---------------------------------------------------------------------------
# Avaliador determinístico: edição textual exata (espaço/maiúscula/pontuação).
# ---------------------------------------------------------------------------
replace_once(
    'app/js/ui/classic-deterministic-evaluator.js',
    """function evaluateMultipleChoice(form, block) {
""",
    """function normalizeControlledText(value) {
  return String(value ?? '').replace(/\\r\\n/g, '\\n').trim();
}

function evaluateControlledText(form, block) {
  const input = form.elements.namedItem('openResponse');
  const value = typeof input?.value === 'string' ? input.value : '';
  if (!value.trim()) return { complete: false };
  const key = block.activity.evaluation?.answerKey || {};
  const accepted = Array.isArray(key.acceptedResults) ? key.acceptedResults
    : Object.prototype.hasOwnProperty.call(key, 'acceptedResult') ? [key.acceptedResult]
      : Object.prototype.hasOwnProperty.call(key, 'expected') ? [key.expected]
        : Object.prototype.hasOwnProperty.call(key, 'correct') ? [key.correct]
          : [];
  if (!accepted.length) return { complete: true, pending: true };
  const correct = accepted.some(expected => normalizeControlledText(value) === normalizeControlledText(expected));
  return { complete: true, correct, score: correct ? 1 : 0, itemResults: { 0: correct } };
}

function evaluateMultipleChoice(form, block) {
"""
)

replace_once(
    'app/js/ui/classic-deterministic-evaluator.js',
    """  else if (interaction === 'CLASSIFY' || interaction === 'MATCH') result = evaluateClassify(form, block);
  else if (interaction === 'SEQUENCE' || interaction === 'ORDER') result = evaluateSequence(form, block);
""",
    """  else if (interaction === 'CLASSIFY' || interaction === 'MATCH') result = evaluateClassify(form, block);
  else if (interaction === 'SEQUENCE' || interaction === 'ORDER') result = evaluateSequence(form, block);
  else if (interaction === 'SHORT_TEXT') result = evaluateControlledText(form, block);
"""
)

# ---------------------------------------------------------------------------
# Renderer: apoio opcional sob demanda, planejamento e exemplos só pós-envio.
# ---------------------------------------------------------------------------
replace_once(
    'app/js/ui/classic-renderer.js',
    """    'responseMode', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices',
""",
    """    'responseMode', 'selfReview', 'selfReviewRequired', 'selfReviewQuestions', 'revisionFlow', 'promptChoices',
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """    'cards', 'textRemainsVisible', 'textRef', 'competency'
""",
    """    'cards', 'optionalScaffold', 'planningChecklist', 'principleQuestion', 'principleOptions', 'automaticCheck',
    'textRemainsVisible', 'textRef', 'competency'
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """function renderSelfReview(block) {
  const questions = block.content?.selfReviewQuestions;
""",
    """function renderOptionalScaffold(block) {
  const scaffold = block.content?.optionalScaffold;
  if (!scaffold || scaffold.availableOnDemand === false) return '';
  const starter = typeof scaffold.starter === 'string' && scaffold.starter.trim()
    ? `<div class=\"content-detail\"><strong>Início sugerido</strong><div>${esc(scaffold.starter)}</div></div>`
    : '';
  const words = Array.isArray(scaffold.wordBank) && scaffold.wordBank.length
    ? `<div class=\"content-detail\"><strong>Palavras de apoio</strong><div>${scaffold.wordBank.map(item => `<span class=\"token\">${esc(item)}</span>`).join(' ')}</div></div>`
    : '';
  if (!starter && !words) return '';
  return `<details class=\"support-disclosure optional-scaffold\" data-optional-scaffold><summary>Ver apoio opcional</summary><div class=\"content-details\">${starter}${words}</div></details>`;
}

function renderPlanningChecklist(block) {
  const items = block.content?.planningChecklist;
  if (!Array.isArray(items) || !items.length) return '';
  const prompt = block.content?.planningPrompt || 'Antes de escrever, confirme as informações essenciais.';
  return `<fieldset class=\"self-review planning-checklist\"><legend>${esc(prompt)}</legend>${items.map((item, index) => `<label class=\"choice-option\"><input type=\"checkbox\" name=\"planning:${index}\" value=\"done\" required><span>${esc(item)}</span></label>`).join('')}</fieldset>`;
}

function renderSelfReview(block) {
  const questions = block.content?.selfReviewQuestions;
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """      <form class="activity-form" data-activity-form novalidate>
        ${renderInteraction(block)}
        ${renderEvidenceSelector(block.content)}
        ${renderSelfReview(block)}
""",
    """      <form class="activity-form" data-activity-form novalidate>
        ${renderOptionalScaffold(block)}
        ${renderPlanningChecklist(block)}
        ${renderInteraction(block)}
        ${renderEvidenceSelector(block.content)}
        ${renderSelfReview(block)}
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """function bindActivity(form, block) {
  form.addEventListener('submit', event => {
""",
    """function revealPostSubmissionExamples(form, block) {
  const examples = block.content?.modelExamplesAfterSubmission;
  if (!Array.isArray(examples) || !examples.length || form.querySelector('[data-post-submission-examples]')) return;
  const box = document.createElement('div');
  box.className = 'content-detail post-submission-examples';
  box.dataset.postSubmissionExamples = 'true';
  const title = document.createElement('strong');
  title.textContent = 'Exemplos possíveis depois da sua tentativa';
  const body = document.createElement('div');
  examples.forEach(example => {
    const item = document.createElement('p');
    item.textContent = example;
    body.appendChild(item);
  });
  box.append(title, body);
  form.appendChild(box);
}

function bindActivity(form, block) {
  form.addEventListener('submit', event => {
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """    feedback.dataset.state = message.state;
    feedback.textContent = message.text;
  });
}
""",
    """    feedback.dataset.state = message.state;
    feedback.textContent = message.text;
    revealPostSubmissionExamples(form, block);
  });
}
"""
)

# ---------------------------------------------------------------------------
# Binding de progresso: registrar abertura do apoio como hintUsed sem penalizar.
# ---------------------------------------------------------------------------
replace_once(
    'app/js/ui/classic-progress-binding.js',
    """  const byId = new Map(documentRuntime.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));
  const replayCounts = new Map();

  root.querySelectorAll('[data-activity-id]').forEach(card => {
""",
    """  const byId = new Map(documentRuntime.blocks.filter(block => block.kind === 'ACTIVITY').map(block => [block.id, block]));
  const replayCounts = new Map();
  const hintUsed = new Set();

  root.querySelectorAll('[data-activity-id]').forEach(card => {
"""
)

replace_once(
    'app/js/ui/classic-progress-binding.js',
    """    card.querySelectorAll('[data-tts]').forEach(button => button.addEventListener('click', () => {
      replayCounts.set(block.id, (replayCounts.get(block.id) || 0) + 1);
    }));

    form.addEventListener('submit', () => {
""",
    """    card.querySelectorAll('[data-tts]').forEach(button => button.addEventListener('click', () => {
      replayCounts.set(block.id, (replayCounts.get(block.id) || 0) + 1);
    }));
    card.querySelectorAll('[data-optional-scaffold]').forEach(disclosure => disclosure.addEventListener('toggle', () => {
      if (disclosure.open) hintUsed.add(block.id);
    }));

    form.addEventListener('submit', () => {
"""
)

replace_once(
    'app/js/ui/classic-progress-binding.js',
    """        response: collectResponse(form, block),
        support: { replayCount: replayCounts.get(block.id) || 0 }
""",
    """        response: collectResponse(form, block),
        support: { replayCount: replayCounts.get(block.id) || 0, hintUsed: hintUsed.has(block.id) }
"""
)

print('P7/U05 runtime patch aplicado: planejamento, escrita pendente, edição controlada, suporte e regras agregadas.')
