export const LEGACY_COMPLETION_RULES_V1 = Object.freeze({
  'N0-U01-L01': {
    clusters: [{ id: 'modalityDistinction', required: true, evidenceIds: ['L01-A01', 'L01-C03'], satisfaction: 'DEMONSTRATED_REQUIRED' }],
    nonCompensable: true,
    activityPolicies: { 'L01-A01': { threshold: 0.75 } }
  },
  'N0-U01-L02': {
    clusters: [{ id: 'auditoryComparison', required: true, evidenceIds: ['L02-A01', 'L02-C02'], satisfaction: 'DEMONSTRATED_REQUIRED' }],
    nonCompensable: true,
    activityPolicies: { 'L02-A01': { threshold: 0.75 } }
  },
  'N0-U01-L03': {
    clusters: [{ id: 'alphabetRecognition', required: true, evidenceIds: ['L03-A01', 'L03-A02'], satisfaction: 'DEMONSTRATED_REQUIRED' }],
    nonCompensable: true,
    activityPolicies: { 'L03-A01': { threshold: 1 }, 'L03-A02': { threshold: 0.75 } }
  },
  'N0-U01-L04': {
    clusters: [{ id: 'letterCaseRecognition', required: true, evidenceIds: ['L04-A02', 'L04-C02'], satisfaction: 'DEMONSTRATED_REQUIRED' }],
    nonCompensable: true,
    activityPolicies: { 'L04-A02': { threshold: 22 / 26 } }
  },
  'N0-U01-L05': {
    clusters: [{ id: 'graphicClassification', required: true, evidenceIds: ['L05-A01', 'L05-A02', 'L05-C03'], satisfaction: 'DEMONSTRATED_REQUIRED' }],
    nonCompensable: true,
    activityPolicies: { 'L05-A01': { threshold: 1 }, 'L05-A02': { threshold: 0.875 } }
  },
  'N0-U01-L06': {
    clusters: [{ id: 'visualOrderAndSpacing', required: true, evidenceIds: ['L06-A01', 'L06-A02', 'L06-C03'], satisfaction: 'DEMONSTRATED_REQUIRED' }],
    nonCompensable: true,
    activityPolicies: { 'L06-A01': { threshold: 1 }, 'L06-A02': { threshold: 1 } }
  },
  'N0-U01-L07': {
    clusters: [{ id: 'letterNameAndSound', required: true, evidenceIds: ['L07-A01', 'L07-A02', 'L07-C02'], satisfaction: 'DEMONSTRATED_REQUIRED' }],
    nonCompensable: true,
    activityPolicies: { 'L07-A01': { threshold: 0.8 }, 'L07-A02': { threshold: 0.8 } }
  },
  'N0-U01-L08': {
    clusters: [{ id: 'soundWritingVariation', required: true, evidenceIds: ['L08-A01', 'L08-C03'], satisfaction: 'DEMONSTRATED_REQUIRED' }],
    nonCompensable: true,
    activityPolicies: { 'L08-A01': { threshold: 0.75 } }
  },
  'N0-U01-V01': {
    clusters: [
      { id: 'auditoryAndModality', required: true, evidenceIds: ['V01-Q01', 'V01-Q02'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'graphicSystem', required: true, evidenceIds: ['V01-Q03', 'V01-Q04', 'V01-Q05'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'visualOrganization', required: true, evidenceIds: ['V01-Q06', 'V01-Q07'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      {
        id: 'soundWritingRelations',
        required: true,
        evidenceIds: ['V01-Q08', 'V01-Q09', 'V01-Q10', 'V01-Q11', 'V01-Q12'],
        minimumEvidence: 4,
        requiredAnyOf: [['V01-Q10', 'V01-Q11']],
        satisfaction: 'DEMONSTRATED_REQUIRED'
      }
    ],
    nonCompensable: true,
    activityPolicies: { 'V01-Q02': { threshold: 0.5 }, 'V01-Q05': { threshold: 0.8 } }
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
  'open-interpretation': 'STRUCTURED_RESPONSE',
  'closed-boundary-check': 'COMPOSITE',
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
  'listen-reveal-relation-classify': 'COMPOSITE'
});
