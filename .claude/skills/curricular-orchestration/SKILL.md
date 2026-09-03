---
name: curricular-orchestration
description: Orquestra marcos curriculares longos com vários subpassos previsíveis — concluir checkpoint, revisar progressão de nível, dimensionar unidade completa, desenvolver sequência de lições, corrigir lacunas de cobertura. Para tarefa isolada pequena, use a skill especializada direto.
---

# Orquestração curricular

O procedimento canônico está em `.ChatGPT/skills/curricular-orchestration/SKILL.md`. Leia esse arquivo antes de executar; ele é a fonte de verdade e esta skill não o duplica.

Pontos de controle:

- transformar o pedido em condição clara de conclusão do marco, sem ampliar em silêncio;
- classificar pesquisa como obrigatória, útil ou desnecessária antes de escrever;
- aplicar o teste de pré-requisito a cada lição ou unidade nova;
- revisar em cinco passadas antes da PR: pedagógica, curricular, evidência, implementação, clareza para o aluno;
- integrar por branch, PR, CI e merge normal, nunca contornando o fluxo;
- parar apenas nas condições de `docs/execucao-continua.md`, não por microetapa.
