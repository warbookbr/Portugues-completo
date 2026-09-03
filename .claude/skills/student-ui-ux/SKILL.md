---
name: student-ui-ux
description: Obrigatória para qualquer interface visível ao aluno — home, navegação, cards, abertura e fluxo de lição, progresso, revisão, atividades, feedback, estados de mídia, configurações, IA, mensagens de erro e qualquer rótulo gerado a partir do runtime.
---

# UI/UX do aluno

O procedimento canônico está em `.ChatGPT/skills/student-ui-ux/SKILL.md`, e a fonte de verdade da interface é `docs/ui-ux.md`. Leia antes de executar; esta skill não os duplica.

Regra central: a interface fala a linguagem do aluno, a infraestrutura fala a linguagem do sistema.

- traduzir sempre o runtime, nunca imprimir ID, enum ou objetivo técnico cru;
- abertura de lição com voltar, título, objetivo público e uma única ação de começar, sem stepper, atividade ou badge antes disso;
- retomada não obriga a rever a apresentação;
- uma etapa principal por vez, sem microfragmentação, com Voltar e Avançar preservando respostas;
- não duplicar ação já disponível em controle simultaneamente visível;
- métricas só com fonte real no catálogo ou no ProgressService.
