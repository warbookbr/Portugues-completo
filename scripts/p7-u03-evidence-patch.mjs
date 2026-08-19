import fs from 'node:fs';

function replaceOnce(file, before, after) {
  let source = fs.readFileSync(file, 'utf8');
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: trecho esperado encontrado ${count} vez(es).`);
  source = source.replace(before, after);
  fs.writeFileSync(file, source);
}

// 1. Completion clusters podem declarar critérios agregados sobre subitens.
for (const file of ['schemas/lesson.schema.json', 'schemas/verification.schema.json']) {
  replaceOnce(file,
`              "requiredAnyOf": {"type": "array", "items": {"type": "array", "minItems": 1, "items": {"type": "string", "minLength": 1}}},
              "satisfaction": {"enum": ["DEMONSTRATED_REQUIRED", "PENDING_ALLOWED", "ATTEMPT_REQUIRED"]}
`,
`              "requiredAnyOf": {"type": "array", "items": {"type": "array", "minItems": 1, "items": {"type": "string", "minLength": 1}}},
              "criteria": {"type": "array", "items": {"type": "object", "additionalProperties": true}},
              "satisfaction": {"enum": ["DEMONSTRATED_REQUIRED", "PENDING_ALLOWED", "ATTEMPT_REQUIRED"]}
`);
}

// 2. Evidência persistida preserva score e acertos por subitem.
replaceOnce('schemas/progress.schema.json',
`          "lastAttemptAt": {"type": ["string", "null"]},
          "support": {
`,
`          "lastAttemptAt": {"type": ["string", "null"]},
          "score": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
          "itemResults": {"type": "object", "additionalProperties": {"type": "boolean"}},
          "support": {
`);

// 3. ProgressService avalia critérios agregados e grava detalhes determinísticos.
replaceOnce('app/js/services/progress-service.js',
`function clusterSatisfied(progress, document, cluster) {
  const statuses = (cluster.evidenceIds || []).map(id => progress.evidence[progressDocumentRef(document.id, id)]?.status || null);
  const satisfiedCount = statuses.filter(status => statusSatisfies(status, cluster.satisfaction)).length;
  const minimum = Number.isInteger(cluster.minimumEvidence) ? cluster.minimumEvidence : (cluster.evidenceIds || []).length;
  if (satisfiedCount < minimum) return false;
  for (const group of cluster.requiredAnyOf || []) {
    const groupSatisfied = group.some(id => statusSatisfies(progress.evidence[progressDocumentRef(document.id, id)]?.status, cluster.satisfaction));
    if (!groupSatisfied) return false;
  }
  return true;
}
`,
`function clusterCriteriaSatisfied(progress, document, cluster) {
  for (const criterion of cluster.criteria || []) {
    if (!criterion || typeof criterion !== 'object') continue;
    if (criterion.type === 'TOTAL_ITEM_HITS_AT_LEAST') {
      const evidenceIds = Array.isArray(criterion.evidenceIds) && criterion.evidenceIds.length ? criterion.evidenceIds : (cluster.evidenceIds || []);
      let hits = 0;
      for (const evidenceId of evidenceIds) {
        const itemResults = progress.evidence[progressDocumentRef(document.id, evidenceId)]?.itemResults || {};
        hits += Object.values(itemResults).filter(Boolean).length;
      }
      if (hits < Number(criterion.minimum || 0)) return false;
    }
  }
  return true;
}

function clusterSatisfied(progress, document, cluster) {
  const statuses = (cluster.evidenceIds || []).map(id => progress.evidence[progressDocumentRef(document.id, id)]?.status || null);
  const satisfiedCount = statuses.filter(status => statusSatisfies(status, cluster.satisfaction)).length;
  const minimum = Number.isInteger(cluster.minimumEvidence) ? cluster.minimumEvidence : (cluster.evidenceIds || []).length;
  if (satisfiedCount < minimum) return false;
  for (const group of cluster.requiredAnyOf || []) {
    const groupSatisfied = group.some(id => statusSatisfies(progress.evidence[progressDocumentRef(document.id, id)]?.status, cluster.satisfaction));
    if (!groupSatisfied) return false;
  }
  return clusterCriteriaSatisfied(progress, document, cluster);
}
`);

replaceOnce('app/js/services/progress-service.js',
`      lastAttemptAt: now,
      support: {
`,
`      lastAttemptAt: now,
      score: typeof result.score === 'number' ? result.score : null,
      itemResults: result.itemResults && typeof result.itemResults === 'object' ? clone(result.itemResults) : {},
      support: {
`);

// 4. Binding não descarta score/itemResults depois do feedback visual.
replaceOnce('app/js/ui/classic-progress-binding.js',
`      let result;
      if (state === 'correct') result = { complete: true, correct: true };
      else if (state === 'retry') result = { complete: true, correct: false };
      else if (state === 'pending') result = { complete: true, pending: true };
      else result = block.activity.evaluation.mode === 'DETERMINISTIC' ? evaluateDeterministicActivity(form, block) : { complete: true, pending: true };
`,
`      let result;
      if (block.activity.evaluation.mode === 'DETERMINISTIC') result = evaluateDeterministicActivity(form, block);
      else if (state === 'pending') result = { complete: true, pending: true };
      else if (state === 'correct') result = { complete: true, correct: true };
      else if (state === 'retry') result = { complete: true, correct: false };
      else result = { complete: true, pending: true };
`);

// 5. Produções com autochecagem preservam também a autochecagem/revisão.
replaceOnce('app/js/ui/classic-progress-binding.js',
`function collectResponse(form, block) {
  if (!block.activity?.evidence?.recordResponse) return undefined;
  const open = form.elements.namedItem('openResponse');
  if (open && typeof open.value === 'string') return open.value;
  const values = {};
  for (const [key, value] of new FormData(form).entries()) {
    if (key in values) values[key] = Array.isArray(values[key]) ? [...values[key], value] : [values[key], value];
    else values[key] = value;
  }
  return values;
}

function restoreResponse(form, block, documentRuntime, progress) {
  if (!block.activity?.evidence?.recordResponse) return;
  const ref = \`${documentRuntime.id}/${block.id}\`;
  const saved = progress?.responses?.[ref];
  const open = form.elements.namedItem('openResponse');
  if (saved && open && typeof saved.value === 'string') open.value = saved.value;
}
`,
`function collectResponse(form, block) {
  if (!block.activity?.evidence?.recordResponse) return undefined;
  const data = new FormData(form);
  const open = form.elements.namedItem('openResponse');
  const hasStructuredCompanions = [...data.keys()].some(key => key !== 'openResponse');
  if (open && typeof open.value === 'string' && !hasStructuredCompanions) return open.value;
  const values = {};
  for (const [key, value] of data.entries()) {
    if (key in values) values[key] = Array.isArray(values[key]) ? [...values[key], value] : [values[key], value];
    else values[key] = value;
  }
  return values;
}

function restoreResponse(form, block, documentRuntime, progress) {
  if (!block.activity?.evidence?.recordResponse) return;
  const ref = \`${documentRuntime.id}/${block.id}\`;
  const saved = progress?.responses?.[ref];
  if (!saved) return;
  const open = form.elements.namedItem('openResponse');
  if (open && typeof saved.value === 'string') {
    open.value = saved.value;
    return;
  }
  if (!saved.value || typeof saved.value !== 'object') return;
  for (const [key, stored] of Object.entries(saved.value)) {
    const values = Array.isArray(stored) ? stored : [stored];
    const controls = [...form.querySelectorAll(`[name="${CSS.escape(key)}"]`)];
    for (const control of controls) {
      if (control.type === 'checkbox' || control.type === 'radio') control.checked = values.includes(control.value);
      else if (values.length) control.value = values[0];
    }
  }
}
`);

// 6. V01 ganha tradução estrutural exata de suas regras históricas.
replaceOnce('app/js/services/content-normalization-rules-v1.js',
`  'N0-U03-L10': {
    clusters: [
      { id: 'understandsMultipleValidFormulations', required: true, evidenceIds: ['L10-C01'], satisfaction: 'DEMONSTRATED_REQUIRED' },
      { id: 'guidedOpenProduction', required: true, evidenceIds: ['L10-A01'], satisfaction: 'PENDING_ALLOWED' },
      { id: 'ownWordsProduction', required: true, evidenceIds: ['L10-A02'], satisfaction: 'PENDING_ALLOWED' },
      { id: 'revisionProcess', required: true, evidenceIds: ['L10-A03'], satisfaction: 'PENDING_ALLOWED' },
      { id: 'transferOpenProduction', required: true, evidenceIds: ['L10-A04'], satisfaction: 'PENDING_ALLOWED' }
    ],
    nonCompensable: true,
    activityPolicies: { 'L10-C01': { threshold: 1 } }
  }
});
`,
`  'N0-U03-L10': {
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
  }
});
`);

console.log('P7/U03: contrato de evidência agregada aplicado.');
