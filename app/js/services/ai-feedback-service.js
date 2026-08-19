const RESULT_VALUES = new Set(['OK', 'INSUFFICIENT_CONTEXT', 'CANNOT_EVALUATE', 'INVALID_RESPONSE', 'PROVIDER_ERROR']);
const CRITERION_STATUS_VALUES = new Set(['MET', 'PARTIAL', 'NOT_MET', 'UNCERTAIN', 'NOT_APPLICABLE']);
const CONFIDENCE_VALUES = new Set(['LOW', 'MEDIUM', 'HIGH']);
const RECOMMENDATION_VALUES = new Set(['CONTINUE', 'REVISE', 'RETRY', 'PENDING_VALIDATION', 'CANNOT_EVALUATE']);

const clone = value => value === undefined ? undefined : structuredClone(value);

export class AiFeedbackError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AiFeedbackError';
    this.code = code;
    this.details = details;
  }
}

function uniqueStrings(values = []) {
  return [...new Set(values.filter(value => typeof value === 'string').map(value => value.trim()).filter(Boolean))];
}

function materialContent(content = {}) {
  const allowed = ['title', 'text', 'prompt', 'instruction', 'model', 'display', 'description', 'examples', 'points', 'scenario', 'readingText', 'source', 'task'];
  const result = {};
  for (const key of allowed) {
    if (content[key] !== undefined) result[key] = clone(content[key]);
  }
  return result;
}

function activityPrompt(block) {
  return block?.content?.prompt
    || block?.content?.instruction
    || block?.content?.task
    || block?.content?.title
    || 'Analise a resposta conforme os critérios declarados.';
}

function validateCriteria(criteria) {
  if (!Array.isArray(criteria) || !criteria.length) {
    throw new AiFeedbackError('INVALID_ACTIVITY_CONTRACT', 'A atividade elegível para feedback por IA precisa declarar critérios explícitos.');
  }
  const ids = new Set();
  return criteria.map((criterion, index) => {
    const id = String(criterion?.id || '').trim();
    const description = String(criterion?.description || '').trim();
    if (!id || !description) throw new AiFeedbackError('INVALID_ACTIVITY_CONTRACT', `Critério ${index + 1} sem id/description.`);
    if (ids.has(id)) throw new AiFeedbackError('INVALID_ACTIVITY_CONTRACT', `Critério duplicado: ${id}.`);
    ids.add(id);
    return { id, description, required: criterion.required !== false };
  });
}

export function buildAiFeedbackEnvelope({ document, block, response, context = {} }) {
  if (!document?.id || !Array.isArray(document.blocks)) throw new AiFeedbackError('INVALID_DOCUMENT', 'Documento de runtime inválido para feedback por IA.');
  if (!block?.id || block.kind !== 'ACTIVITY') throw new AiFeedbackError('INVALID_ACTIVITY', 'Atividade de runtime inválida para feedback por IA.');

  const config = block.content?.aiFeedback;
  if (!config || config.enabled !== true) throw new AiFeedbackError('NOT_ELIGIBLE', 'Esta atividade não está habilitada para feedback por IA.');
  if (response === undefined || response === null || (typeof response === 'string' && !response.trim())) {
    throw new AiFeedbackError('EMPTY_RESPONSE', 'A resposta do aluno precisa existir antes do feedback por IA.');
  }

  const criteria = validateCriteria(config.criteria);
  const blockById = new Map(document.blocks.map(item => [item.id, item]));
  const materialBlockIds = uniqueStrings(config.materialBlockIds || []);
  const materials = materialBlockIds.map(id => {
    const material = blockById.get(id);
    if (!material) throw new AiFeedbackError('MISSING_MATERIAL', `Material declarado não existe no runtime: ${id}.`);
    return {
      id,
      pedagogicalType: material.pedagogicalType || material.kind,
      content: materialContent(material.content || {})
    };
  });

  const isVerification = document.kind === 'VERIFICATION';
  const requiresReliableEvaluator = block.activity?.evaluation?.mode === 'RELIABLE_EVALUATOR';

  return {
    schemaVersion: 1,
    context: {
      courseId: 'portugues-completo',
      levelId: context.levelId || null,
      unitId: context.unitId || null,
      lessonId: isVerification ? null : document.id,
      verificationId: isVerification ? document.id : null,
      activityId: block.id,
      locale: context.locale || 'pt-BR'
    },
    task: {
      objective: document.objective,
      prompt: activityPrompt(block),
      materials,
      criteria,
      limits: uniqueStrings([...(document.limits || []), ...(config.limits || [])])
    },
    learnerResponse: {
      type: block.activity?.interaction || 'LONG_TEXT',
      value: clone(response)
    },
    policy: {
      purpose: 'FORMATIVE_FEEDBACK',
      mayPromoteEvidence: false,
      requiresReliableEvaluator,
      policyVersion: String(config.policyVersion || 'p6-formative-v1')
    }
  };
}

function failureResult(result, message, flags = []) {
  return {
    schemaVersion: 1,
    result,
    criterionResults: [],
    feedback: {
      summary: message,
      strengths: [],
      improvements: [],
      nextStep: ''
    },
    confidence: 'LOW',
    recommendation: 'CANNOT_EVALUATE',
    flags: uniqueStrings(flags)
  };
}

export function validateAiFeedbackResult(value, { criteria = [] } = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new AiFeedbackError('INVALID_RESPONSE', 'Resposta do provider não é um objeto.');
  if (value.schemaVersion !== 1 || !RESULT_VALUES.has(value.result)) throw new AiFeedbackError('INVALID_RESPONSE', 'schemaVersion/result do feedback são inválidos.');
  if (!Array.isArray(value.criterionResults)) throw new AiFeedbackError('INVALID_RESPONSE', 'criterionResults ausente.');
  if (!value.feedback || typeof value.feedback !== 'object') throw new AiFeedbackError('INVALID_RESPONSE', 'feedback ausente.');
  if (!CONFIDENCE_VALUES.has(value.confidence) || !RECOMMENDATION_VALUES.has(value.recommendation)) throw new AiFeedbackError('INVALID_RESPONSE', 'confidence/recommendation inválidos.');
  if (!Array.isArray(value.flags)) throw new AiFeedbackError('INVALID_RESPONSE', 'flags inválido.');

  const criteriaById = new Map(criteria.map(item => [item.id, item]));
  const seen = new Set();
  const criterionResults = value.criterionResults.map(item => {
    const criterionId = String(item?.criterionId || '');
    if (!criteriaById.has(criterionId) || seen.has(criterionId)) throw new AiFeedbackError('INVALID_RESPONSE', `criterionId inválido/duplicado: ${criterionId || '(vazio)'}.`);
    if (!CRITERION_STATUS_VALUES.has(item.status)) throw new AiFeedbackError('INVALID_RESPONSE', `Status inválido em ${criterionId}.`);
    seen.add(criterionId);
    return {
      criterionId,
      status: item.status,
      evidence: String(item.evidence || ''),
      feedback: String(item.feedback || '')
    };
  });

  if (value.result === 'OK') {
    for (const criterion of criteria) {
      if (criterion.required !== false && !seen.has(criterion.id)) throw new AiFeedbackError('INVALID_RESPONSE', `Critério obrigatório ausente: ${criterion.id}.`);
    }
  }

  const feedback = {
    summary: String(value.feedback.summary || ''),
    strengths: Array.isArray(value.feedback.strengths) ? value.feedback.strengths.map(String) : [],
    improvements: Array.isArray(value.feedback.improvements) ? value.feedback.improvements.map(String) : [],
    nextStep: String(value.feedback.nextStep || '')
  };

  return {
    schemaVersion: 1,
    result: value.result,
    criterionResults,
    feedback,
    confidence: value.confidence,
    recommendation: value.recommendation,
    flags: value.flags.map(String),
    ...(value.meta && typeof value.meta === 'object' ? { meta: clone(value.meta) } : {})
  };
}

export class AiFeedbackService {
  constructor({ adapters = {}, getConfig = () => ({}), getCredential = () => null } = {}) {
    this.adapters = new Map(Object.entries(adapters));
    this.getConfig = getConfig;
    this.getCredential = getCredential;
  }

  async requestFeedback({ document, block, response, context = {} }) {
    const config = this.getConfig() || {};
    if (config.enabled !== true) throw new AiFeedbackError('AI_DISABLED', 'Feedback por IA está desativado.');

    const provider = String(config.provider || '');
    const adapter = this.adapters.get(provider);
    if (!adapter?.request) throw new AiFeedbackError('PROVIDER_NOT_CONFIGURED', `Provider de IA não configurado: ${provider || '(vazio)'}.`);

    const envelope = buildAiFeedbackEnvelope({ document, block, response, context });
    const credential = await this.getCredential(provider);
    if (adapter.requiresCredential !== false && !credential) throw new AiFeedbackError('MISSING_CREDENTIAL', 'Credencial de sessão do provider não configurada.');

    try {
      const raw = await adapter.request({
        envelope,
        model: config.model,
        endpoint: config.endpoint,
        credential
      });
      return validateAiFeedbackResult(raw, { criteria: envelope.task.criteria });
    } catch (error) {
      if (error instanceof AiFeedbackError && error.code === 'INVALID_RESPONSE') {
        return failureResult('INVALID_RESPONSE', 'O provider respondeu fora do contrato esperado.', ['STRUCTURED_OUTPUT_INVALID']);
      }
      if (error instanceof AiFeedbackError) throw error;
      return failureResult('PROVIDER_ERROR', 'O feedback por IA está indisponível agora. Sua resposta continua registrada.', ['PROVIDER_REQUEST_FAILED']);
    }
  }
}

export function createAiFeedbackService(options = {}) {
  return new AiFeedbackService(options);
}
