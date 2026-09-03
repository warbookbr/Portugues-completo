---
name: classic-product-delivery
description: Procedimento obrigatório para qualquer trabalho material do Modo Clássico — schemas, normalização, catálogo, renderer, telas, atividades, progresso, revisão, persistência, Gist, feedback por IA, expansão do catálogo N0→N4, mídia e homologação. Use ao iniciar ou continuar um marco P1–P9.
---

# Entrega do Modo Clássico

O procedimento canônico está em `.ChatGPT/skills/classic-product-delivery/SKILL.md`. Leia esse arquivo antes de executar; ele é a fonte de verdade e esta skill não o duplica.

Ordem de leitura antes de começar:

```text
PROJECT_INDEX.md
→ docs/roadmap-produto.md
→ docs/estado-implementacao-classico.md
→ docs/execucao-continua.md
→ contratos específicos do item
→ course-content-design quando houver conteúdo ou texto público
→ student-ui-ux quando houver interface do aluno
→ frontend-visual-check quando houver mudança visual
```

Regras que valem sempre:

- implementado não é homologado, e homologado não é publicável;
- nenhuma gamificação antes do gate `CLÁSSICO HOMOLOGADO`;
- PR que muda materialmente o estado do Clássico atualiza `docs/estado-implementacao-classico.md` no mesmo commit;
- blocker responde o que está bloqueado, por quê, o que segue e o que o remove;
- trabalho parcial é declarado como parcial.
