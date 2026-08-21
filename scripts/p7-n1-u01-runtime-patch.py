from pathlib import Path


def replace_once(path, before, after):
    p = Path(path)
    text = p.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{path}: esperado 1 match, encontrado {count}: {before[:180]!r}')
    p.write_text(text.replace(before, after, 1))


normalizer = 'app/js/services/content-normalizer-v1.js'

replace_once(
    normalizer,
    """function evidenceSourceText(block, sourceDocument) {
  if (typeof block?.text === 'string') return block.text;
  if (typeof block?.standaloneText === 'string') return block.standaloneText;
  if (block?.textRef && Array.isArray(sourceDocument?.texts)) {
    const referenced = sourceDocument.texts.find(item => item?.id === block.textRef);
    if (typeof referenced?.text === 'string') return referenced.text;
  }
  return '';
}
""",
    """function referencedText(sourceDocument, textRef) {
  if (!textRef || !sourceDocument?.texts) return null;
  if (Array.isArray(sourceDocument.texts)) {
    return sourceDocument.texts.find(item => item?.id === textRef) || null;
  }
  if (typeof sourceDocument.texts === 'object') return sourceDocument.texts[textRef] || null;
  return null;
}

function referencedTextBody(sourceDocument, textRef) {
  const referenced = referencedText(sourceDocument, textRef);
  if (!referenced) return '';
  if (typeof referenced.text === 'string') return referenced.text;
  if (typeof referenced.body === 'string') return referenced.body;
  return '';
}

function evidenceSourceText(block, sourceDocument) {
  if (typeof block?.text === 'string') return block.text;
  if (typeof block?.bodyText === 'string') return block.bodyText;
  if (typeof block?.standaloneText === 'string') return block.standaloneText;
  if (block?.textRef) return referencedTextBody(sourceDocument, block.textRef);
  return '';
}
"""
)

replace_once(
    normalizer,
    """function materializeCommonLegacyActivity(block, sourceDocument) {
  const sourceText = evidenceSourceText(block, sourceDocument);
  let materialized = materializeEvidenceSelection(block, sourceText);

  // Planejamento por seleção: transforma cartões autorais em múltipla escolha sem expor flags essential.
""",
    """function materializeCommonLegacyActivity(block, sourceDocument) {
  const sourceText = evidenceSourceText(block, sourceDocument);
  let materialized = materializeEvidenceSelection(block, sourceText);

  // Verificações podem referenciar textos nomeados em um mapa/array autoral.
  // O runtime materializa o texto consultável sem depender de o renderer conhecer o documento-fonte.
  if (materialized.textRef) {
    const referenced = referencedText(sourceDocument, materialized.textRef);
    const body = referencedTextBody(sourceDocument, materialized.textRef);
    if (body && typeof materialized.text !== 'string' && typeof materialized.bodyText !== 'string') materialized.text = body;
    if (referenced?.title && !materialized.title) materialized.title = referenced.title;
  }

  // Perguntas binárias autoradas com resposta textual clara viram escolha determinística.
  if (!Array.isArray(materialized.options) && typeof materialized.answer === 'string') {
    const normalizedAnswer = normalizeEvidenceText(materialized.answer);
    if (normalizedAnswer === 'sim' || normalizedAnswer === 'nao') {
      const { answer, ...rest } = materialized;
      materialized = { ...clone(rest), options: ['sim', 'não'], correctIndex: normalizedAnswer === 'sim' ? 0 : 1 };
    }
  }

  // Planejamento por seleção: transforma cartões autorais em múltipla escolha sem expor flags essential.
"""
)

replace_once(
    normalizer,
    """  if (Array.isArray(materialized.items)) {
    materialized.items = materialized.items.map(item => {
      const evidenceReady = materializeEvidenceSelection(item, sourceText);
      if (!evidenceReady || Array.isArray(evidenceReady.options) || !Array.isArray(evidenceReady.cases) || !Object.prototype.hasOwnProperty.call(evidenceReady, 'correctIndex')) return evidenceReady;
      return { ...clone(evidenceReady), options: clone(evidenceReady.cases) };
    });
  }
""",
    """  if (Array.isArray(materialized.items)) {
    materialized.items = materialized.items.map(item => {
      let evidenceReady = materializeEvidenceSelection(item, sourceText);
      if (evidenceReady?.responseMode === 'short-text' && typeof evidenceReady.acceptedCore === 'string' && evidenceReady.acceptedCore.trim()) {
        const { acceptedCore, ...rest } = evidenceReady;
        evidenceReady = { ...clone(rest), acceptedResult: acceptedCore };
      }
      if (!evidenceReady || Array.isArray(evidenceReady.options) || !Array.isArray(evidenceReady.cases) || !Object.prototype.hasOwnProperty.call(evidenceReady, 'correctIndex')) return evidenceReady;
      return { ...clone(evidenceReady), options: clone(evidenceReady.cases) };
    });
  }
"""
)

replace_once(
    normalizer,
    """  'auditoryCorrect', 'relationCorrectIndex', 'correctEssentialIndexes', 'principleCorrectIndex', 'requiredEvidence', 'requiredEvidenceParts', 'acceptableEvidence',
  'supportingParts', 'evidenceCorrectIndexes', 'evidenceMatchMode', 'revisedAnswer'
""",
    """  'auditoryCorrect', 'relationCorrectIndex', 'correctEssentialIndexes', 'principleCorrectIndex', 'requiredEvidence', 'requiredEvidenceParts', 'acceptableEvidence',
  'acceptedCore', 'evidenceSourcesRequired', 'supportingParts', 'evidenceCorrectIndexes', 'evidenceMatchMode', 'revisedAnswer'
"""
)

rules = 'app/js/services/content-normalization-rules-v1.js'
replace_once(
    rules,
    """  // N0-U05 — escrita autoral: pending não equivale a domínio e apoio não é penalidade.
""",
    """  // N1-U01 — leitura autônoma: regras agregadas e resumo aberto não podem ser achatados.
  'N1-U01-L05': {
    clusters: [
      { id: 'relations', required: true, evidenceIds: ['L05-C01', 'L05-A01', 'L05-A02'], satisfaction: 'DEMONSTRATED_REQUIRED', criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['L05-C01', 'L05-A01', 'L05-A02'], minimum: 4 }] },
      { id: 'sequenceVsCause', required: true, evidenceIds: ['L05-B03', 'L05-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: { 'L05-C01': { threshold: 1 }, 'L05-A01': { threshold: 0.5 }, 'L05-A02': { threshold: 0.5 } }
  },
  'N1-U01-L09': {
    clusters: [
      { id: 'summaryJudgment', required: true, evidenceIds: ['L09-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'ownSummary', required: true, evidenceIds: ['L09-A01'], satisfaction: 'PENDING_ALLOWED' },
      { id: 'selectionOfEssential', required: true, evidenceIds: ['L09-C01', 'L09-A01'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N1-U01-V01': {
    clusters: [
      { id: 'globalComprehension', required: true, evidenceIds: ['V01-Q01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'locationAndIntegration', required: true, evidenceIds: ['V01-Q02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'referenceAndRelations', required: true, evidenceIds: ['V01-Q03'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'inferenceAndInsufficiency', required: true, evidenceIds: ['V01-Q04'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'multimodality', required: true, evidenceIds: ['V01-Q05'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'sourceOpinionReason', required: true, evidenceIds: ['V01-Q06'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'ownSummary', required: true, evidenceIds: ['V01-Q07'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },

  // N0-U05 — escrita autoral: pending não equivale a domínio e apoio não é penalidade.
"""
)

print('Runtime N1-U01 adaptado: textRef consultável, binário, short-text composto e completion explícita.')
