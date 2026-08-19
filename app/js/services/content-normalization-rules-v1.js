export const LEGACY_COMPLETION_RULES_V1 = Object.freeze({
  'N0-U01-L01': { clusters: [{ id: 'modalityDistinction', required: true, evidenceIds: ['L01-A01', 'L01-C03'], satisfaction: 'DEMONSTRATED_REQUIRED' }], nonCompensable: true, activityPolicies: { 'L01-A01': { threshold: 0.75 } } },
  'N0-U01-L02': { clusters: [{ id: 'auditoryComparison', required: true, evidenceIds: ['L02-A01', 'L02-C02'], satisfaction: 'DEMONSTRATED_REQUIRED' }], nonCompensable: true, activityPolicies: { 'L02-A01': { threshold: 0.75 } } },
  'N0-U01-L03': { clusters: [{ id: 'alphabetRecognition', required: true, evidenceIds: ['L03-A01', 'L03-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' }], nonCompensable: true, activityPolicies: { 'L03-A01': { threshold: 1 }, 'L03-A02': { threshold: 0.75 } } },
  'N0-U01-L04': { clusters: [{ id: 'letterCaseRecognition', required: true, evidenceIds: ['L04-A02', 'L04-C02'], satisfaction: 'DEMONSTRATED_REQUIRED' }], nonCompensable: true, activityPolicies: { 'L04-A02': { threshold: 22 / 26 } } },
  'N0-U01-L05': { clusters: [{ id: 'graphicClassification', required: true, evidenceIds: ['L05-A01', 'L05-A02', 'L05-C03'], satisfaction: 'DEMONSTRATED_REQUIRED' }], nonCompensable: true, activityPolicies: { 'L05-A01': { threshold: 1 }, 'L05-A02': { threshold: 0.875 } } },
  'N0-U01-L06': { clusters: [{ id: 'visualOrderAndSpacing', required: true, evidenceIds: ['L06-A01', 'L06-A02', 'L06-C03'], satisfaction: 'DEMONSTRATED_REQUIRED' }], nonCompensable: true, activityPolicies: { 'L06-A01': { threshold: 1 }, 'L06-A02': { threshold: 1 } } },
  'N0-U01-L07': { clusters: [{ id: 'letterNameAndSound', required: true, evidenceIds: ['L07-A01', 'L07-A02', 'L07-C02'], satisfaction: 'DEMONSTRATED_REQUIRED' }], nonCompensable: true, activityPolicies: { 'L07-A01': { threshold: 0.8 }, 'L07-A02': { threshold: 0.8 } } },
  'N0-U01-L08': { clusters: [{ id: 'soundWritingVariation', required: true, evidenceIds: ['L08-A01', 'L08-C03'], satisfaction: 'DEMONSTRATED_REQUIRED' }], nonCompensable: true, activityPolicies: { 'L08-A01': { threshold: 0.75 } } },
  'N0-U01-V01': {
    clusters: [
      { id: 'auditoryAndModality', required: true, evidenceIds: ['V01-Q01', 'V01-Q02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'graphicSystem', required: true, evidenceIds: ['V01-Q03', 'V01-Q04', 'V01-Q05'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'visualOrganization', required: true, evidenceIds: ['V01-Q06', 'V01-Q07'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'soundWritingRelations', required: true, evidenceIds: ['V01-Q08', 'V01-Q09', 'V01-Q10', 'V01-Q11', 'V01-Q12'], minimumEvidence: 4, requiredAnyOf: [['V01-Q10', 'V01-Q11']], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: { 'V01-Q02': { threshold: 0.5 }, 'V01-Q05': { threshold: 0.8 } }
  },

  // N0-U03 — regras históricas explícitas preservadas sem parsear prosa autoral.
  // N0-U05 — escrita autoral: pending não equivale a domínio e apoio não é penalidade.
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
      { id: 'graphicConventions', required: true, evidenceIds: ['V01-Q07', 'V01-Q09', 'V01-Q10'], satisfaction: 'DEMONSTRATED_REQUIRED', criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q09'], minimum: 2 }] },
      { id: 'ownProduction', required: true, evidenceIds: ['V01-Q08'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: { 'V01-Q09': { threshold: 2 / 3 } }
  },

  'N0-U03-L01': {
    clusters: [
      { id: 'formVersusMeaning', required: true, evidenceIds: ['L01-C01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'meaningAssociation', required: true, evidenceIds: ['L01-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'beyondConcreteNaming', required: true, evidenceIds: ['L01-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'transfer', required: true, evidenceIds: ['L01-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'L01-A01': { threshold: 5 / 7 },
      'L01-A02': { threshold: 2 / 3, criteria: [{ type: 'REQUIRED_ANY_OF', groups: [['1', '2']] }] },
      'L01-A03': { threshold: 3 / 4 }
    }
  },
  'N0-U03-L02': {
    clusters: [
      { id: 'semanticGrouping', required: true, evidenceIds: ['L02-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'closeMeaning', required: true, evidenceIds: ['L02-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'opposition', required: true, evidenceIds: ['L02-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'transfer', required: true, evidenceIds: ['L02-A04'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'L02-A01': { threshold: 5 / 6 },
      'L02-A02': { threshold: 2 / 3 },
      'L02-A03': { threshold: 3 / 4 },
      'L02-A04': { threshold: 3 / 4, criteria: [{ type: 'REQUIRED_ANY_OF', groups: [['0', '3'], ['1', '2']] }] }
    }
  },
  'N0-U03-L03': {
    clusters: [
      { id: 'sameWordDifferentSense', required: true, evidenceIds: ['L03-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'strongContextInference', required: true, evidenceIds: ['L03-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'uncertaintyAndRevision', required: true, evidenceIds: ['L03-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'contextEvidence', required: true, evidenceIds: ['L03-A04'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'L03-A01': { threshold: 5 / 6, criteria: [{ type: 'MIN_DISTINCT_GROUPS_CORRECT', minimum: 2, groups: [['0', '1'], ['2', '3'], ['4', '5']] }] },
      'L03-A02': { threshold: 3 / 4 },
      'L03-A03': { threshold: 1 },
      'L03-A04': { threshold: 2 / 3 }
    }
  },
  'N0-U03-L04': {
    clusters: [
      { id: 'oneWordMessages', required: true, evidenceIds: ['L04-C01', 'L04-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'contextualRole', required: true, evidenceIds: ['L04-C02', 'L04-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'oneVersusManyWords', required: true, evidenceIds: ['L04-C03', 'L04-A04'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'messageMeaningAndTransfer', required: true, evidenceIds: ['L04-A03', 'L04-A04'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'L04-C01': { threshold: 1 },
      'L04-A01': { threshold: 3 / 4 },
      'L04-C02': { threshold: 1 },
      'L04-A02': { threshold: 3 / 4 },
      'L04-C03': { threshold: 1 },
      'L04-A03': { threshold: 2 / 3 },
      'L04-A04': { threshold: 3 / 4, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['0', '1'] }] }
    }
  },
  'N0-U03-L05': {
    clusters: [
      { id: 'ordering', required: true, evidenceIds: ['L05-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'relationChange', required: true, evidenceIds: ['L05-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'messageRelations', required: true, evidenceIds: ['L05-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'transfer', required: true, evidenceIds: ['L05-A04'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'L05-A01': { threshold: 3 / 4, criteria: [{ type: 'REQUIRED_ANY_OF', groups: [['0', '1']] }] },
      'L05-A02': { threshold: 2 / 3 },
      'L05-A03': { threshold: 2 / 3 },
      'L05-A04': { threshold: 3 / 4, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['0'] }, { type: 'REQUIRED_ANY_OF', groups: [['1', '2']] }] }
    }
  },
  'N0-U03-L06': {
    clusters: [
      { id: 'replacementEffect', required: true, evidenceIds: ['L06-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'additionAndRemoval', required: true, evidenceIds: ['L06-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'wordFormMeaning', required: true, evidenceIds: ['L06-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'transfer', required: true, evidenceIds: ['L06-A04'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'L06-A01': { threshold: 2 / 3 },
      'L06-A02': { threshold: 2 / 3, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['1'] }, { type: 'REQUIRED_ANY_OF', groups: [['0', '2']] }] },
      'L06-A03': { threshold: 1 },
      'L06-A04': { threshold: 4 / 5, criteria: [{ type: 'REQUIRED_ANY_OF', groups: [['0', '3'], ['1', '2']] }] }
    }
  },
  'N0-U03-L07': {
    clusters: [
      { id: 'negationInterpretation', required: true, evidenceIds: ['L07-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'situationMatching', required: true, evidenceIds: ['L07-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'controlledTransformation', required: true, evidenceIds: ['L07-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'transfer', required: true, evidenceIds: ['L07-A04'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'L07-A01': { threshold: 3 / 4 },
      'L07-A02': { threshold: 3 / 4 },
      'L07-A03': { threshold: 3 / 4, criteria: [{ type: 'REQUIRED_ANY_OF', groups: [['0', '2'], ['1', '3']] }] },
      'L07-A04': { threshold: 3 / 4, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['0'] }] }
    }
  },
  'N0-U03-L08': {
    clusters: [
      { id: 'coreFunctions', required: true, evidenceIds: ['L08-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'goalToMessage', required: true, evidenceIds: ['L08-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'multipleClues', required: true, evidenceIds: ['L08-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'transfer', required: true, evidenceIds: ['L08-A04'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'L08-A01': { threshold: 4 / 5, criteria: [{ type: 'REQUIRED_ANY_OF', groups: [['2', '3']] }] },
      'L08-A02': { threshold: 3 / 4 },
      'L08-A03': { threshold: 2 / 3, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['1'] }] },
      'L08-A04': { threshold: 4 / 5, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['0'] }, { type: 'REQUIRED_ANY_OF', groups: [['2', '3']] }] }
    }
  },
  'N0-U03-L09': {
    clusters: [
      { id: 'completionFromClues', required: true, evidenceIds: ['L09-A01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'reconstruction', required: true, evidenceIds: ['L09-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'coherenceAndVariation', required: true, evidenceIds: ['L09-A03'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'transferAndReview', required: true, evidenceIds: ['L09-A04'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'L09-A01': { threshold: 3 / 4, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['1'] }] },
      'L09-A02': { threshold: 3 / 4, criteria: [{ type: 'REQUIRED_ANY_OF', groups: [['0', '3']] }] },
      'L09-A03': { threshold: 1 },
      'L09-A04': { threshold: 3 / 4, criteria: [{ type: 'REQUIRED_ANY_OF', groups: [['1', '3']] }] }
    }
  },
  'N0-U03-L10': {
    clusters: [
      { id: 'understandsMultipleValidFormulations', required: true, evidenceIds: ['L10-C01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'guidedOpenProduction', required: true, evidenceIds: ['L10-A01'], satisfaction: 'PENDING_ALLOWED' },
      { id: 'ownWordsProduction', required: true, evidenceIds: ['L10-A02'], satisfaction: 'PENDING_ALLOWED' },
      { id: 'revisionProcess', required: true, evidenceIds: ['L10-A03'], satisfaction: 'PENDING_ALLOWED' },
      { id: 'transferOpenProduction', required: true, evidenceIds: ['L10-A04'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: { 'L10-C01': { threshold: 1 } }
  },
  'N0-U03-V01': {
    clusters: [
      {
        id: 'meaningAndContext', required: true, evidenceIds: ['V01-Q01', 'V01-Q02', 'V01-Q03'], satisfaction: 'DEMONSTRATED_REQUIRED',
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q01', 'V01-Q02', 'V01-Q03'], minimum: 5 }]
      },
      {
        id: 'constructionAndManipulation', required: true, evidenceIds: ['V01-Q05', 'V01-Q06', 'V01-Q09'], satisfaction: 'DEMONSTRATED_REQUIRED',
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['V01-Q06', 'V01-Q09'], minimum: 3 }]
      },
      { id: 'messageComprehensionAndProduction', required: true, evidenceIds: ['V01-Q04', 'V01-Q07', 'V01-Q08', 'V01-Q10'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: {
      'V01-Q01': { threshold: 0.5 },
      'V01-Q02': { threshold: 0.5 },
      'V01-Q03': { threshold: 1 },
      'V01-Q04': { threshold: 2 / 3 },
      'V01-Q05': { threshold: 1 },
      'V01-Q06': { threshold: 0.5 },
      'V01-Q07': { threshold: 1 },
      'V01-Q08': { threshold: 4 / 5 },
      'V01-Q09': { threshold: 0.5, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['1'] }] }
    }
  },
  'N0-U04-L04': {
    clusters: [
      { id: 'integration', required: true, evidenceIds: ['L04-C01', 'L04-A01', 'L04-A02'], minimumEvidence: 2, requiredAnyOf: [['L04-A01', 'L04-A02']], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'relationDiscipline', required: true, evidenceIds: ['L04-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N0-U04-L05': {
    clusters: [
      {
        id: 'personPlaceReference', required: true, evidenceIds: ['L05-C01', 'L05-A01', 'L05-A02'], minimumEvidence: 1,
        requiredAnyOf: [['L05-A01'], ['L05-C01', 'L05-A02']],
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['L05-C01', 'L05-A01', 'L05-A02'], minimum: 3 }],
        satisfaction: 'DEMONSTRATED_REQUIRED'
      },
      { id: 'contextUse', required: true, evidenceIds: ['L05-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  },
  'N0-U04-L07': {
    clusters: [
      { id: 'timeAndSequence', required: true, evidenceIds: ['L07-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      {
        id: 'causeAndEffect', required: true, evidenceIds: ['L07-C01', 'L07-A01', 'L07-A02'], minimumEvidence: 1,
        criteria: [{ type: 'TOTAL_ITEM_HITS_AT_LEAST', evidenceIds: ['L07-C01', 'L07-A01', 'L07-A02'], minimum: 3 }],
        satisfaction: 'DEMONSTRATED_REQUIRED'
      }
    ],
    nonCompensable: true,
    activityPolicies: { 'L07-A02': { threshold: 0.5, criteria: [{ type: 'REQUIRED_ITEMS_CORRECT', itemIds: ['0'] }] } }
  },
  'N0-U04-V01': {
    clusters: [
      { id: 'globalComprehension', required: true, evidenceIds: ['V01-Q01', 'V01-Q02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'explicitAndIntegration', required: true, evidenceIds: ['V01-Q03', 'V01-Q04'], minimumEvidence: 2, satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'reference', required: true, evidenceIds: ['V01-Q05', 'V01-Q06'], minimumEvidence: 1, satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'sequenceAndRelations', required: true, evidenceIds: ['V01-Q07', 'V01-Q08', 'V01-Q09'], minimumEvidence: 2, requiredAnyOf: [['V01-Q08', 'V01-Q09']], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'inferenceDiscipline', required: true, evidenceIds: ['V01-Q10', 'V01-Q11'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'rereadingAndRevision', required: true, evidenceIds: ['V01-Q12'], satisfaction: 'DEMONSTRATED_REQUIRED' }
    ],
    nonCompensable: true,
    activityPolicies: {}
  }
});

export const INTERACTION_BY_PEDAGOGICAL_TYPE_V1 = Object.freeze({
  'modality-identification': 'SINGLE_CHOICE',
  'audio-pair-classify': 'CLASSIFY',
  'letter-recognition': 'SINGLE_CHOICE',
  'case-matching': 'SINGLE_CHOICE',
  'symbol-classification': 'CLASSIFY',
  'visual-organization-choice': 'SINGLE_CHOICE',
  'sequence-reproduction': 'SEQUENCE',
  'letter-name-versus-word': 'SINGLE_CHOICE',
  'initial-sound-to-letter': 'SINGLE_CHOICE',
  'same-letter-different-sound': 'COMPOSITE',
  'similar-sound-different-writing': 'COMPOSITE',
  'concept-consolidation': 'SINGLE_CHOICE',
  'interpretation-boundary-check': 'CLASSIFY',
  'perspective-check': 'CLASSIFY',
  'formal-evidence-check': 'CLASSIFY',
  'figurative-boundary-check': 'CLASSIFY',
  'intertext-check': 'CLASSIFY',
  'revision-principle-check': 'CLASSIFY',
  'multimodal-check': 'CLASSIFY',
  'representation-boundary-check': 'CLASSIFY',
  'provenance-check': 'CLASSIFY',
  'adaptation-check': 'CLASSIFY',
  'accessibility-principle-check': 'CLASSIFY',
  'open-interpretation': 'STRUCTURED_RESPONSE',
  'closed-boundary-check': 'CLASSIFY',
  'independent-interpretation': 'STRUCTURED_RESPONSE',
  'multimodal-authored-prototype': 'COMPOSITE',
  'strategic-reading-with-revision': 'STRUCTURED_RESPONSE',
  'problem-oriented-research-and-synthesis': 'STRUCTURED_RESPONSE',
  'argument-with-new-evidence': 'STRUCTURED_RESPONSE',
  'longform-authorship-and-transfer': 'LONG_TEXT',
  'layered-editing-with-consultation': 'STRUCTURED_RESPONSE',
  'norm-description-variation-analysis': 'STRUCTURED_RESPONSE',
  'listening-presentation-objection-negotiation': 'ORAL_RESPONSE',
  'literary-multimodal-integrated-authorship': 'COMPOSITE'
});

export const INTERACTION_BY_LEGACY_INTERACTION_V1 = Object.freeze({
  'single-choice': 'SINGLE_CHOICE',
  'multiple-choice': 'MULTIPLE_CHOICE',
  classify: 'CLASSIFY',
  match: 'MATCH',
  order: 'ORDER',
  sequence: 'SEQUENCE',
  'short-text': 'SHORT_TEXT',
  'structured-response': 'STRUCTURED_RESPONSE',
  'long-text': 'LONG_TEXT',
  'oral-response': 'ORAL_RESPONSE',
  composite: 'COMPOSITE',
  'audio-pair-choice': 'SINGLE_CHOICE',
  'audio-pair-classify': 'CLASSIFY',
  'alphabet-neighbor': 'COMPOSITE',
  'match-pairs': 'COMPOSITE',
  'graphic-category-classify': 'CLASSIFY',
  'sequence-match': 'SINGLE_CHOICE',
  'sequence-order': 'COMPOSITE',
  'copy-with-spaces': 'COMPOSITE',
  'audio-role-choice': 'SINGLE_CHOICE',
  'name-versus-word-audio': 'CLASSIFY',
  'audio-judgment-then-writing-reveal': 'SINGLE_CHOICE',
  'listen-reveal-relation-classify': 'COMPOSITE',
  'insert-spaces': 'SHORT_TEXT',
  'edit-capitalization-and-boundary': 'SHORT_TEXT',
  'edit-controlled-text': 'SHORT_TEXT',
  'insert-commas': 'SHORT_TEXT'
});
