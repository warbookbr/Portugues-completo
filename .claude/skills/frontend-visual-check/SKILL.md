---
name: frontend-visual-check
description: Verificação visual obrigatória de mudanças relevantes no frontend — renderizar em Chromium com Playwright, capturar os estados reais afetados e inspecionar as imagens antes de considerar a mudança concluída.
---

# Verificação visual do frontend

O procedimento canônico está em `.ChatGPT/skills/frontend-visual-check/SKILL.md`. Leia antes de executar; esta skill não o duplica.

Neste ambiente o Chromium já está instalado e o Playwright configurado para encontrá-lo em `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`. Não rodar `playwright install`. Sirva o repositório por HTTP local, já que o app carrega conteúdo por `fetch`.

- leitura de código não homologa mudança visual;
- capturar os estados reais afetados: primeira abertura, lição iniciada, etapa explicativa, atividade, feedback e retomada;
- escolher os viewports que a mudança realmente exercita, incluindo largura intermediária quando o componente muda ali;
- nunca afirmar que a URL pública foi aberta quando a inspeção foi feita sobre o conteúdo local.
