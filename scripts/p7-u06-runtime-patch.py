from pathlib import Path


def replace_once(file, before, after):
    path = Path(file)
    text = path.read_text()
    count = text.count(before)
    if count != 1:
        Path('scripts/p7-u06-anchor-error.txt').write_text(
            f'arquivo: {file}\ncontagem: {count}\ntrecho:\n{before}\n'
        )
        raise RuntimeError(f'{file}: trecho esperado encontrado {count} vez(es): {before[:180]!r}')
    path.write_text(text.replace(before, after, 1))

# ---------------------------------------------------------------------------
# Normalizador — ensaio oral registrável sem validação automática falsa.
# ---------------------------------------------------------------------------
replace_once(
    'app/js/services/content-normalizer-v1.js',
    """function isOpenAuthoredActivity(block) {
  return String(block?.responseMode || '').startsWith('free-text')
    || String(block?.interaction || '').includes('free-text')
    || String(block?.type || '').includes('open-production')
    || block?.type === 'required-open-production';
}
""",
    """function isOpenAuthoredActivity(block) {
  return String(block?.responseMode || '').startsWith('free-text')
    || String(block?.interaction || '').includes('free-text')
    || String(block?.type || '').includes('open-production')
    || block?.type === 'required-open-production';
}

function hasOralRehearsal(block) {
  return block?.oralRehearsal === true
    || (block?.oralRehearsal && typeof block.oralRehearsal === 'object' && block.oralRehearsal.enabled !== false);
}
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """  if (isOpenAuthoredActivity(materialized)) {
    const selfReviewQuestions = Array.isArray(materialized.selfReviewQuestions) && materialized.selfReviewQuestions.length
""",
    """  if (hasOralRehearsal(materialized)) {
    const authoredRehearsal = materialized.oralRehearsal;
    const rehearsal = authoredRehearsal === true
      ? {
          enabled: true,
          required: true,
          instruction: materialized.instruction || 'Faça um ensaio oral curto e marque quando concluir.'
        }
      : {
          enabled: authoredRehearsal.enabled !== false,
          required: authoredRehearsal.required === true,
          instruction: authoredRehearsal.instruction || materialized.instruction || 'Faça um ensaio oral curto.'
        };
    materialized.oralRehearsal = rehearsal;
    if (!Array.isArray(materialized.selfReviewQuestions) && Array.isArray(materialized.selfCheck)) {
      materialized.selfReviewQuestions = clone(materialized.selfCheck);
    }
    if (!Array.isArray(materialized.selfReviewQuestions) && Array.isArray(materialized.selfReview)) {
      materialized.selfReviewQuestions = clone(materialized.selfReview);
    }
    if (!isOpenAuthoredActivity(materialized)) {
      materialized.automaticValidation = false;
      materialized.recordResponse = true;
      materialized.interaction = 'oral-response';
    }
  }

  if (isOpenAuthoredActivity(materialized)) {
    const selfReviewQuestions = Array.isArray(materialized.selfReviewQuestions) && materialized.selfReviewQuestions.length
"""
)

replace_once(
    'app/js/services/content-normalizer-v1.js',
    """  if (requiredIds.has(block.id)) return true;
  if (isOpenAuthoredActivity(block)) return true;
""",
    """  if (requiredIds.has(block.id)) return true;
  if (isOpenAuthoredActivity(block) || hasOralRehearsal(block)) return true;
"""
)

# ---------------------------------------------------------------------------
# Regras explícitas — open/pending, oralidade e não compensação.
# ---------------------------------------------------------------------------
replace_once(
    'app/js/services/content-normalization-rules-v1.js',
    """  // N0-U05 — escrita autoral: pending não equivale a domínio e apoio não é penalidade.
""",
    """  // N0-U06 — comunicação cotidiana: compreensão oral autônoma, produção aberta e prática oral separadas.
  'N0-U06-L09': {
    clusters: [
      { id: 'chooseRepair', required: true, evidenceIds: ['L09-C01', 'L09-A01', 'L09-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'ownRepairMessage', required: true, evidenceIds: ['L09-A03'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N0-U06-L10': {
    clusters: [
      { id: 'reformulation', required: true, evidenceIds: ['L10-C01', 'L10-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'ownReformulation', required: true, evidenceIds: ['L10-A02'], satisfaction: 'PENDING_ALLOWED' },
      { id: 'strategyChoice', required: true, evidenceIds: ['L10-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N0-U06-V01': {
    clusters: [
      { id: 'comprehensionAndPurpose', required: true, evidenceIds: ['V01-Q01', 'V01-Q05'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'functionalUseAndProduction', required: true, evidenceIds: ['V01-Q02', 'V01-Q03', 'V01-Q04', 'V01-Q11'], satisfaction: 'PENDING_ALLOWED', requiredAnyOf: [['V01-Q02'], ['V01-Q03'], ['V01-Q04'], ['V01-Q11']] },
      { id: 'oralComprehension', required: true, evidenceIds: ['V01-Q06', 'V01-Q07'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'adequacyVariationAndRepair', required: true, evidenceIds: ['V01-Q08', 'V01-Q09', 'V01-Q10'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'oralProductionPractice', required: true, evidenceIds: ['V01-Q12'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },

  // N0-U05 — escrita autoral: pending não equivale a domínio e apoio não é penalidade.
"""
)

# ---------------------------------------------------------------------------
# Renderer — transcrição só depois da tentativa e ensaio oral explícito.
# ---------------------------------------------------------------------------
replace_once(
    'app/js/ui/classic-renderer.js',
    """    'cards', 'optionalScaffold', 'planningChecklist', 'planningPrompt', 'essentialInformation',
    'principleQuestion', 'principleOptions', 'automaticCheck',
    'textRemainsVisible', 'textRef', 'competency'
""",
    """    'cards', 'optionalScaffold', 'planningChecklist', 'planningPrompt', 'essentialInformation',
    'principleQuestion', 'principleOptions', 'automaticCheck', 'oralRehearsal',
    'transcriptHiddenUntilAttempt', 'transcriptAfterAttempt', 'replayAllowed',
    'externalReview', 'meaning', 'textRemainsVisible', 'textRef', 'competency'
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """function renderSelfReview(block) {
  const questions = block.content?.selfReviewQuestions;
""",
    """function renderOralRehearsal(block) {
  const rehearsal = block.content?.oralRehearsal;
  if (!rehearsal || rehearsal.enabled === false) return '';
  const instruction = rehearsal.instruction || 'Faça um ensaio oral curto.';
  const required = rehearsal.required === true ? ' required' : '';
  const optional = rehearsal.required === true ? '' : '<p class=\"reveal-note\">Este ensaio é opcional nesta etapa escrita.</p>';
  return `<fieldset class=\"self-review oral-rehearsal\" data-oral-rehearsal><legend>Ensaio oral</legend><p>${esc(instruction)}</p>${optional}<label class=\"choice-option\"><input type=\"checkbox\" name=\"oralRehearsalDone\" value=\"done\"${required}><span>Concluí o ensaio oral.</span></label><p class=\"reveal-note\">Este registro confirma a prática, não avalia pronúncia, sotaque ou compreensibilidade da fala.</p></fieldset>`;
}

function renderDelayedTranscriptControl(block) {
  if (block.content?.transcriptHiddenUntilAttempt !== true || typeof block.content?.transcriptAfterAttempt !== 'string') return '';
  return `<div class=\"delayed-transcript-control\" data-delayed-transcript-control><button type=\"button\" class=\"secondary-button compact-button\" data-transcript-reveal disabled>Mostrar transcrição depois de ouvir</button><div class=\"content-detail\" data-transcript-slot aria-live=\"polite\"></div></div>`;
}

function renderSelfReview(block) {
  const questions = block.content?.selfReviewQuestions;
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """    case 'ORAL_RESPONSE': return renderOpenInput(block, 'Rascunho/registro da resposta oral nesta etapa técnica');
""",
    """    case 'ORAL_RESPONSE': return '';
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """        ${renderInteraction(block)}
        ${renderEvidenceSelector(block.content)}
        ${renderSelfReview(block)}
""",
    """        ${renderInteraction(block)}
        ${renderEvidenceSelector(block.content)}
        ${renderOralRehearsal(block)}
        ${renderSelfReview(block)}
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """export function renderContentBlock(block) {
  return `<article class="lesson-block content-card" id="${esc(block.id)}"><span class="block-kicker">${esc(pretty(block.pedagogicalType || 'conteúdo'))}</span>${renderKnownContent(block.content)}</article>`;
}
""",
    """export function renderContentBlock(block) {
  return `<article class="lesson-block content-card" id="${esc(block.id)}"><span class="block-kicker">${esc(pretty(block.pedagogicalType || 'conteúdo'))}</span>${renderKnownContent(block.content)}${renderDelayedTranscriptControl(block)}</article>`;
}
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """function revealPostSubmissionExamples(form, block) {
""",
    """function transcriptEntries(block) {
  const entries = [];
  if (block.content?.transcriptHiddenUntilAttempt === true && typeof block.content?.transcriptAfterAttempt === 'string') {
    entries.push({ label: 'Transcrição', text: block.content.transcriptAfterAttempt });
  }
  const items = Array.isArray(block.content?.items) ? block.content.items : Array.isArray(block.content?.rounds) ? block.content.rounds : [];
  items.forEach((item, index) => {
    if (item?.transcriptHiddenUntilAttempt === true && typeof item?.transcriptAfterAttempt === 'string') {
      entries.push({ label: `Transcrição ${index + 1}`, text: item.transcriptAfterAttempt });
    }
  });
  return entries;
}

function revealPostAttemptTranscripts(form, block) {
  const entries = transcriptEntries(block);
  if (!entries.length || form.querySelector('[data-post-attempt-transcripts]')) return;
  const box = document.createElement('div');
  box.className = 'content-details post-attempt-transcripts';
  box.dataset.postAttemptTranscripts = 'true';
  entries.forEach(entry => {
    const detail = document.createElement('div');
    detail.className = 'content-detail';
    const title = document.createElement('strong');
    title.textContent = entry.label;
    const text = document.createElement('div');
    text.textContent = entry.text;
    detail.append(title, text);
    box.appendChild(detail);
  });
  form.appendChild(box);
}

function revealPostSubmissionExamples(form, block) {
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """    feedback.dataset.state = message.state;
    feedback.textContent = message.text;
    revealPostSubmissionExamples(form, block);
  });
}
""",
    """    feedback.dataset.state = message.state;
    feedback.textContent = message.text;
    if (result.complete) {
      revealPostSubmissionExamples(form, block);
      revealPostAttemptTranscripts(form, block);
    }
  });
}
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """function bindProgressive(root) {
""",
    """function bindContentTranscriptControls(root) {
  const runtime = root.__documentRuntime;
  if (!runtime) return;
  const byId = new Map((runtime.blocks || []).map(block => [block.id, block]));
  root.querySelectorAll('[data-delayed-transcript-control]').forEach(control => {
    const card = control.closest('[id]');
    const block = card ? byId.get(card.id) : null;
    const button = control.querySelector('[data-transcript-reveal]');
    const slot = control.querySelector('[data-transcript-slot]');
    const tts = card?.querySelector('[data-tts]');
    if (!block || !button || !slot || typeof block.content?.transcriptAfterAttempt !== 'string') return;
    if (tts) tts.addEventListener('click', () => { button.disabled = false; });
    button.addEventListener('click', () => {
      const strong = document.createElement('strong');
      strong.textContent = 'Transcrição';
      const text = document.createElement('div');
      text.textContent = block.content.transcriptAfterAttempt;
      slot.replaceChildren(strong, text);
      button.hidden = true;
    });
  });
}

function bindProgressive(root) {
"""
)

replace_once(
    'app/js/ui/classic-renderer.js',
    """  bindSequence(root);
  bindProgressive(root);
""",
    """  bindSequence(root);
  bindProgressive(root);
  bindContentTranscriptControls(root);
"""
)

# ---------------------------------------------------------------------------
# Binding de progresso — ensaio oral entra na resposta persistida.
# ---------------------------------------------------------------------------
replace_once(
    'app/js/ui/classic-progress-binding.js',
    """  if (interaction === 'SHORT_TEXT' || interaction === 'STRUCTURED_RESPONSE' || interaction === 'LONG_TEXT' || interaction === 'ORAL_RESPONSE') {
    return { openResponse: form.elements.namedItem('openResponse')?.value || '', revisedResponse: form.elements.namedItem('revisedResponse')?.value || '' };
  }
""",
    """  if (interaction === 'SHORT_TEXT' || interaction === 'STRUCTURED_RESPONSE' || interaction === 'LONG_TEXT') {
    return {
      openResponse: form.elements.namedItem('openResponse')?.value || '',
      revisedResponse: form.elements.namedItem('revisedResponse')?.value || '',
      oralRehearsalDone: form.elements.namedItem('oralRehearsalDone')?.checked === true
    };
  }
  if (interaction === 'ORAL_RESPONSE') {
    const output = { oralRehearsalDone: form.elements.namedItem('oralRehearsalDone')?.checked === true };
    for (const input of form.elements) {
      if (input.name?.startsWith('selfReview:') && input.checked) output[input.name] = input.value;
    }
    return output;
  }
"""
)

# ---------------------------------------------------------------------------
# Audit: não interpretar uma pergunta que rejeita hierarquia como afirmação estigmatizante.
# ---------------------------------------------------------------------------
replace_once(
    'scripts/audit-p7-n0-u06.mjs',
    """  if (sourceHasAntiStigmaRule(source)) {
    if (/linguagem informal é sempre errada|mais formal é automaticamente melhor|sotaque.*erro|variedade.*inferior/i.test(html)) {
      issue(`${source.id}: linguagem pública contradiz a proteção contra estigmatização/false hierarchy.`);
    }
  }
""",
    """  if (sourceHasAntiStigmaRule(source)) {
    const affirmedStigma = /linguagem informal é sempre errada[.!]|mais formal é automaticamente melhor[.!]|sotaque[^.!?]{0,40}é erro[.!]|variedade[^.!?]{0,40}é inferior[.!]/i;
    if (affirmedStigma.test(html)) issue(`${source.id}: linguagem pública afirma hierarquia/estigma incompatível com a autoria.`);
  }
"""
)

print('P7/U06 runtime patch aplicado: transcript pós-tentativa, ensaio oral pendente e regras de conclusão explícitas.')
