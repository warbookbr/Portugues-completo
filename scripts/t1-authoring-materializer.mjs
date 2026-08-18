function clone(value) {
  return structuredClone(value);
}

function renameEvidenceRefs(value, fromPrefix, toPrefix) {
  const serialized = JSON.stringify(value);
  return JSON.parse(serialized.replaceAll(fromPrefix, toPrefix));
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

export function materializeLesson(source, definition) {
  if (!source || !definition) throw new TypeError('materializeLesson exige source e definition.');
  if (source.id !== definition.id) {
    throw new Error(`Identidade divergente na materialização: source=${source.id} definition=${definition.id}`);
  }

  const lesson = clone(source);
  lesson.title = definition.title;
  lesson.studentObjective = definition.studentObjective;
  if (Array.isArray(definition.prerequisites)) lesson.prerequisites = clone(definition.prerequisites);
  return lesson;
}

export function materializeVerification(baseSource, extensionSource, config) {
  if (!baseSource || !extensionSource || !config) {
    throw new TypeError('materializeVerification exige baseSource, extensionSource e config.');
  }

  const base = config.renameBaseItemsToV02
    ? renameEvidenceRefs(baseSource, 'V01-Q', 'V02-Q')
    : clone(baseSource);
  const extension = clone(extensionSource);

  const materialized = {
    ...base,
    id: config.id,
    title: config.title,
    objective: config.objective,
    prerequisites: clone(config.prerequisites || []),
    items: [...clone(base.items || []), ...clone(extension.items || [])],
    coverage: [...clone(base.coverage || []), ...clone(extension.coverage || [])]
  };

  const baseControlled = Array.isArray(base.media?.controlledAudio)
    ? base.media.controlledAudio
    : [base.media?.controlledAudio].filter(Boolean);
  const extensionControlled = Array.isArray(extension.media?.controlledAudio)
    ? extension.media.controlledAudio
    : [extension.media?.controlledAudio].filter(Boolean);

  materialized.media = {
    ...clone(base.media || {}),
    controlledAudio: unique([...baseControlled, ...extensionControlled]),
    tts: extension.media?.tts || base.media?.tts || 'instruções e feedback'
  };

  const supportMaterials = clone(base.supportMaterials || {});
  supportMaterials.curatedMedia = [...(supportMaterials.curatedMedia || [])];
  if (extensionControlled.length) {
    supportMaterials.curatedMedia.push({
      mediaIds: unique(extensionControlled),
      type: 'AUDIO_CONTROLADO',
      requiredForPublication: true,
      purpose: 'verificar relações entre letras e sons incorporadas à nova Unidade 2',
      locations: ['V02-Q10', 'V02-Q11'],
      productionSource: 'producao-midia/FILA-MIDIA.md'
    });
  }
  supportMaterials.runtimeResources = [...(supportMaterials.runtimeResources || [])];
  supportMaterials.runtimeResources.push({
    type: 'TTS_OK',
    locations: ['V02-Q12', 'instruções', 'feedback'],
    purpose: 'apresentar mensagens faladas quando a resposta depende do modo de apresentação, não de característica acústica específica'
  });
  supportMaterials.publicationDependency = [
    supportMaterials.publicationDependency,
    'A extensão V02 reutiliza mídias já reservadas; não cria nova produção humana, mas depende da validação dos áudios reutilizados antes da publicação.'
  ].filter(Boolean).join(' ');
  supportMaterials.decisionRationale = [
    supportMaterials.decisionRationale,
    'A nova verificação preserva a evidência silábica válida da V01 e acrescenta somente os núcleos movidos para a U2, evitando refazer avaliação correta sem necessidade.'
  ].filter(Boolean).join(' ');
  materialized.supportMaterials = supportMaterials;

  const clusters = {};
  for (const [id, evidence] of Object.entries(config.completionClusters || {})) {
    clusters[id] = { evidence: clone(evidence), required: true };
  }
  materialized.completionEvidence = {
    clusters,
    nonCompensable: true,
    completionRule: 'todos os cinco agrupamentos são obrigatórios; desempenho em sílabas/palavras não compensa ausência das sínteses letra-som ou fala-escrita, e vice-versa.'
  };

  materialized.designPrinciples = unique([
    ...(base.designPrinciples || []),
    'preservar as tarefas silábicas válidas da verificação histórica usando novos IDs de evidência',
    'não introduzir regras ortográficas sistemáticas ao verificar variação letra-som',
    'verificar fala e escrita por exemplos concretos, sem terminologia linguística abstrata'
  ]);
  materialized.limits = unique([
    ...(base.limits || []),
    'não exigir explicação formal de grafema, fonema ou correspondência biunívoca',
    'não exigir teoria linguística sobre fala e escrita'
  ]);

  return materialized;
}
