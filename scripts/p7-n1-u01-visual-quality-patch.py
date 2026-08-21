from pathlib import Path


def replace_once(path, before, after):
    p = Path(path)
    text = p.read_text()
    count = text.count(before)
    if count != 1:
        raise RuntimeError(f'{path}: esperado 1 match, encontrado {count}: {before[:180]!r}')
    p.write_text(text.replace(before, after, 1))


renderer = 'app/js/ui/classic-renderer.js'

replace_once(
    renderer,
    """  ['answer', 'Resposta'], ['classification', 'Classificação'],
  ['groups', 'Grupos'], ['important', 'Importante']
]);
""",
    """  ['answer', 'Resposta'], ['classification', 'Classificação'], ['sourceText', 'Texto de referência'],
  ['groups', 'Grupos'], ['important', 'Importante']
]);
"""
)

replace_once(
    renderer,
    """function renderSemanticVisual(visual, fallbackLabel = 'Apoio visual') {
  if (!visual || typeof visual !== 'object' || Array.isArray(visual)) return '';
  const equivalent = visual.accessibleEquivalent;
  if (typeof equivalent !== 'string' || !equivalent.trim()) return '';
  const label = visual.label || fallbackLabel;
  return `<div class=\"meaning-support semantic-visual\" role=\"img\" aria-label=\"${esc(equivalent)}\"><strong>${esc(label)}</strong><p>${esc(equivalent)}</p></div>`;
}
""",
    """function renderSemanticVisual(visual, fallbackLabel = 'Apoio visual') {
  if (!visual || typeof visual !== 'object' || Array.isArray(visual)) return '';
  const equivalent = visual.accessibleEquivalent;
  if (typeof equivalent !== 'string' || !equivalent.trim()) return '';
  const label = visual.label || fallbackLabel;
  if (Array.isArray(visual.nodes) && visual.nodes.length >= 2) {
    const route = visual.nodes.map((node, index) => `${index ? '<span class=\"semantic-route-arrow\" aria-hidden=\"true\">→</span>' : ''}<span class=\"token semantic-route-node\">${esc(node)}</span>`).join('');
    return `<div class=\"meaning-support semantic-visual\"><strong>${esc(label)}</strong><div class=\"semantic-route\" data-semantic-route role=\"img\" aria-label=\"${esc(equivalent)}\">${route}</div><p class=\"reveal-note\"><strong>Descrição do apoio visual:</strong> ${esc(equivalent)}</p></div>`;
  }
  return `<div class=\"meaning-support semantic-visual\" role=\"img\" aria-label=\"${esc(equivalent)}\"><strong>${esc(label)}</strong><p>${esc(equivalent)}</p></div>`;
}
"""
)

replace_once(
    renderer,
    """function renderOpinionReason(analysis) {
  if (!analysis || typeof analysis !== 'object' || Array.isArray(analysis)) return '';
  const rows = [];
  if (analysis.opinion) rows.push(`<div class=\"content-detail\"><strong>Opinião</strong><div>${esc(analysis.opinion)}</div></div>`);
  if (analysis.reason) rows.push(`<div class=\"content-detail\"><strong>Razão</strong><div>${esc(analysis.reason)}</div></div>`);
  return rows.length ? `<div class=\"content-details opinion-reason\">${rows.join('')}</div>` : '';
}

function renderKnownContent(content = {}) {
""",
    """function renderOpinionReason(analysis) {
  if (!analysis || typeof analysis !== 'object' || Array.isArray(analysis)) return '';
  const rows = [];
  if (analysis.opinion) rows.push(`<div class=\"content-detail\"><strong>Opinião</strong><div>${esc(analysis.opinion)}</div></div>`);
  if (analysis.reason) rows.push(`<div class=\"content-detail\"><strong>Razão</strong><div>${esc(analysis.reason)}</div></div>`);
  return rows.length ? `<div class=\"content-details opinion-reason\">${rows.join('')}</div>` : '';
}

function renderVersions(versions) {
  if (!Array.isArray(versions) || !versions.length) return '';
  return `<div class=\"content-detail version-comparison\"><strong>Versões</strong><div class=\"content-details\">${versions.map((version, index) => {
    if (!version || typeof version !== 'object') return `<article class=\"content-detail\"><strong>Versão ${index + 1}</strong><div>${valueText(version)}</div></article>`;
    const classification = version.classification ? `<p><strong>Classificação:</strong> ${esc(version.classification)}</p>` : '';
    return `<article class=\"content-detail version-card\"><strong>Versão ${index + 1}</strong>${version.text ? `<p>${esc(version.text)}</p>` : ''}${classification}</article>`;
  }).join('')}</div></div>`;
}

function renderKnownContent(content = {}) {
"""
)

replace_once(
    renderer,
    """    'bodyText', 'caption', 'visual', 'visualBadge', 'sourceMetadata', 'analysis',
    'textRemainsVisible', 'textRef', 'competency'
""",
    """    'bodyText', 'caption', 'visual', 'visualBadge', 'sourceMetadata', 'analysis', 'sourceText', 'versions',
    'textRemainsVisible', 'textRef', 'competency'
"""
)

replace_once(
    renderer,
    """  if (content.bodyText) lead.push(`<div class=\"content-detail reading-text\"><strong>Texto</strong><p>${esc(content.bodyText)}</p></div>`);
  if (content.caption) lead.push(`<p class=\"reveal-note reading-caption\"><strong>Legenda:</strong> ${esc(content.caption)}</p>`);
  if (content.sourceMetadata) lead.push(renderSourceMetadata(content.sourceMetadata));
  if (content.visual) lead.push(renderSemanticVisual(content.visual));
  if (content.visualBadge) lead.push(renderSemanticVisual(content.visualBadge, content.visualBadge.label || 'Informação visual'));
  if (content.analysis) lead.push(renderOpinionReason(content.analysis));
""",
    """  if (content.bodyText) lead.push(`<div class=\"content-detail reading-text\"><strong>Texto</strong><p>${esc(content.bodyText)}</p></div>`);
  if (content.sourceText) lead.push(`<div class=\"content-detail reading-text source-text\"><strong>Texto de referência</strong><p>${esc(content.sourceText)}</p></div>`);
  if (content.caption) lead.push(`<p class=\"reveal-note reading-caption\"><strong>Legenda:</strong> ${esc(content.caption)}</p>`);
  if (content.sourceMetadata) lead.push(renderSourceMetadata(content.sourceMetadata));
  if (content.visual) lead.push(renderSemanticVisual(content.visual));
  if (content.visualBadge) lead.push(renderSemanticVisual(content.visualBadge, content.visualBadge.label || 'Informação visual'));
  if (content.analysis) lead.push(renderOpinionReason(content.analysis));
  if (content.versions) lead.push(renderVersions(content.versions));
"""
)

print('Refinamento visual N1-U01 aplicado: rota semântica, texto de referência e versões públicas.')
