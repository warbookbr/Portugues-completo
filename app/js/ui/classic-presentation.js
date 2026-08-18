import { levelLabel } from './classic-ui-copy.js';

const BLOCK_LABELS = Object.freeze({
  objective: 'Objetivo', demonstration: 'Exemplo', explanation: 'Explicação', 'paired-example': 'Exemplo comparado', summary: 'Resumo', 'quick-check': 'Checagem rápida', 'guided-activity': 'Prática guiada',
  'authored-literary-text': 'Texto literário', 'authored-poem': 'Poema', 'authored-prose': 'Texto literário', 'evidence-map': 'Mapa de evidências', 'controlled-narrative': 'Narrativa', 'formal-reconfiguration': 'Comparação de formas', 'controlled-intertext-set': 'Textos relacionados',
  'competing-interpretations': 'Leituras concorrentes', 'new-evidence': 'Nova evidência', 'semantic-composition': 'Composição multimodal', 'semantic-editing-timeline': 'Sequência e montagem', 'sequence-reorder': 'Comparação de sequência', 'publication-chain': 'Cadeia de publicação', 'base-and-adaptation': 'Obra e adaptação', 'multimodal-brief': 'Proposta de produção', 'accessibility-audit': 'Checklist de acessibilidade', 'integrated-case': 'Caso integrado', 'decision-log': 'Registro de decisões',
  'modality-identification': 'Identificação de modalidade', 'audio-pair-classify': 'Comparação auditiva', 'letter-recognition': 'Reconhecimento de letras', 'case-matching': 'Maiúsculas e minúsculas', 'symbol-classification': 'Classificação de sinais', 'visual-organization-choice': 'Organização da escrita', 'sequence-reproduction': 'Organização de sequência', 'letter-name-versus-word': 'Nome da letra e palavra', 'initial-sound-to-letter': 'Som inicial e letra', 'same-letter-different-sound': 'Uma letra, sons diferentes', 'similar-sound-different-writing': 'Som parecido, escrita diferente', 'concept-consolidation': 'Consolidação',
  'interpretation-boundary-check': 'Checagem de interpretação', 'perspective-check': 'Checagem de perspectiva', 'formal-evidence-check': 'Checagem de evidência formal', 'figurative-boundary-check': 'Checagem de leitura figurada', 'intertext-check': 'Checagem de intertextualidade', 'revision-principle-check': 'Checagem de revisão de leitura', 'multimodal-check': 'Checagem multimodal', 'representation-boundary-check': 'Limites da representação', 'provenance-check': 'Checagem de proveniência', 'adaptation-check': 'Checagem de adaptação', 'accessibility-principle-check': 'Checagem de acessibilidade', 'closed-boundary-check': 'Limites da representação',
  'open-interpretation': 'Produção interpretativa', 'independent-interpretation': 'Interpretação autônoma', 'structure-analysis': 'Análise de estrutura', 'structural-analysis': 'Análise estrutural', 'poetic-form-analysis': 'Análise da forma poética', 'poetic-analysis': 'Análise poética', 'figurative-analysis': 'Análise figurativa', 'intertext-analysis': 'Análise intertextual', 'intertextual-analysis': 'Análise intertextual', 'reading-revision': 'Revisão de leitura', 'interpretation-revision': 'Revisão de interpretação', 'semantic-composition-analysis': 'Análise multimodal', 'multimodal-analysis': 'Análise multimodal', 'editing-and-boundary': 'Montagem e limites', 'editing-analysis': 'Análise de montagem', 'source-lineage': 'Proveniência e circulação', 'lineage-analysis': 'Análise de proveniência', 'adaptation-analysis': 'Análise de adaptação', 'intermedial-analysis': 'Análise de adaptação', 'accessibility-plan': 'Plano de acessibilidade', 'semantic-prototype': 'Produção multimodal acessível', 'multimodal-authored-prototype': 'Protótipo multimodal', 'integrated-analysis-production': 'Análise e produção integradas'
});

const FIELD_LABELS = Object.freeze({
  ttstext: 'Ouvir exemplo', spoken: 'Ouvir forma falada', visibletext: 'Texto na tela', written: 'Forma escrita', explanation: 'Explicação', conclusion: 'Conclusão', points: 'Pontos principais', bridgetonextlesson: 'Próxima lição', task: 'Tarefa', segments: 'Trechos', lines: 'Versos', versions: 'Versões', texta: 'Texto A', textb: 'Texto B', contextnote: 'Contexto', readinga: 'Leitura A', readingb: 'Leitura B', evidence: 'Evidência', elements: 'Elementos', frames: 'Quadros', scenario: 'Situação', requiredfunctions: 'Funções necessárias', checks: 'O que verificar', materials: 'Materiais', requiredfields: 'O que registrar', basetext: 'Texto-base', adaptation: 'Adaptação', publicationchain: 'Cadeia de publicação', sensoryboundary: 'Limites sensoriais', axis: 'Eixo', cluster: 'Aspecto avaliado', support: 'Evidências', claim: 'Leitura', values: 'Valores', label: 'Descrição', sourceLink: 'Fonte'
});

function canonical(value) {
  return String(value || '').trim().toLocaleLowerCase('pt-BR').replaceAll('_', '').replaceAll('-', '').replaceAll(' ', '');
}

function makeTtsButton(detail, label) {
  const value = detail.querySelector('div');
  const text = value?.textContent?.trim();
  if (!text) return;
  detail.classList.add('content-detail-action');
  detail.replaceChildren();
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'secondary-button stimulus-button';
  button.dataset.tts = text;
  button.textContent = label;
  detail.append(button);
}

function polishDetail(detail) {
  const label = detail.querySelector('strong');
  if (!label) return;
  const raw = canonical(label.textContent);
  if (raw === 'ttstext') return makeTtsButton(detail, 'Ouvir exemplo');
  if (raw === 'spoken') return makeTtsButton(detail, 'Ouvir forma falada');
  const translated = FIELD_LABELS[raw];
  if (translated) label.textContent = translated;
}

function polishBlockLabels(root) {
  root.querySelectorAll('.block-kicker').forEach(label => {
    const raw = String(label.textContent || '').trim().toLocaleLowerCase('pt-BR');
    label.textContent = BLOCK_LABELS[raw] || raw.replaceAll('-', ' ').replace(/(^|\s)\p{L}/gu, match => match.toLocaleUpperCase('pt-BR'));
  });
  root.querySelectorAll('.content-detail').forEach(polishDetail);
}

function hideInternalMetadata(root) {
  root.querySelectorAll('.competency-chips').forEach(element => element.remove());
  root.querySelectorAll('.competency-list article > span').forEach(element => element.remove());
  root.querySelectorAll('.lesson-link small, .verification-link small').forEach(element => element.remove());
  root.querySelectorAll('.publication-state').forEach(element => {
    element.closest('.unit-hero')?.classList.add('public-unit-hero');
    element.remove();
  });
  root.querySelectorAll('.blocker-card').forEach(element => element.remove());
}

function polishLessonHero(root, documentRuntime) {
  if (documentRuntime?.kind !== 'LESSON') return;
  const hero = root.querySelector('.lesson-hero');
  const publicCopy = documentRuntime.presentation?.intro;
  const paragraph = hero?.querySelector('p');
  if (!paragraph) return;
  if (typeof publicCopy === 'string' && publicCopy.trim()) paragraph.textContent = publicCopy.trim();
  else paragraph.remove();
}

function polishUnitLevel(root) {
  const hero = root.querySelector('.unit-hero');
  const unit = root.querySelector('[data-unit-id]');
  const eyebrow = hero?.querySelector('.eyebrow');
  if (!eyebrow || !unit) return;
  const match = String(eyebrow.textContent || '').match(/^(N[0-4])\s*·\s*Unidade\s*(\d+)/i);
  if (!match) return;
  eyebrow.textContent = `${levelLabel(match[1].toUpperCase())} · Unidade ${match[2]}`;
}

function polishCompletion(root) {
  root.querySelectorAll('.completion-card').forEach(card => {
    card.innerHTML = '<h2>Conclusão desta etapa</h2><p>As atividades marcadas como “Evidência necessária” fazem parte da conclusão. Quando uma resposta exigir avaliação qualitativa, ela permanecerá como validação pendente em vez de ser aprovada automaticamente.</p>';
  });
}

export function polishClassicPresentation(root, documentRuntime = null) {
  polishBlockLabels(root);
  polishLessonHero(root, documentRuntime);
  hideInternalMetadata(root);
  polishUnitLevel(root);
  polishCompletion(root);
}
