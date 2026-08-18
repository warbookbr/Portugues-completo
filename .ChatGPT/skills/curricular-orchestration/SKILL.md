# Skill: Curricular Orchestration

> **Escopo:** esta skill é destinada ao **ChatGPT** trabalhando no projeto `Portugues-completo`. Ela orquestra marcos curriculares longos e usa as skills especializadas; não substitui `course-content-design`.

## Objetivo

Executar marcos curriculares com autonomia operacional, preservando pesquisa, progressão, clareza, escrita, revisão, validação, PR, CI, merge e atualização de estado como partes do mesmo ciclo.

## Quando usar

Usar quando o usuário autorizar trabalho com vários subpassos previsíveis, por exemplo:

- concluir checkpoint curricular;
- revisar progressão de um nível;
- dimensionar unidade completa;
- desenvolver sequência inteira de lições;
- corrigir lacunas de cobertura;
- executar marco explicitamente registrado no roadmap/plano ativo.

Para tarefa isolada pequena, usar diretamente a skill especializada correspondente.

## Fontes obrigatórias de entrada

Antes de executar um marco curricular:

```text
1. PROJECT_INDEX.md
2. docs/roadmap-curricular.md
3. docs/roadmap-produto.md quando houver impacto de produto/publicação
4. plano transversal ativo, quando houver
5. docs/execucao-continua.md
6. .ChatGPT/skills/course-content-design/SKILL.md
7. documentos curriculares específicos
8. docs/conteudo.md quando houver autoria
9. docs/ui-ux.md quando houver texto público
10. producao-midia/README.md + FILA-MIDIA.md quando aplicável
11. conteúdo existente relacionado
```

## Definir o marco autorizado

Transformar o pedido do usuário em uma condição clara de conclusão.

Não ampliar silenciosamente para trabalho estrutural relevante fora do escopo autorizado, mas também não pedir confirmação para microetapas já cobertas pelo marco.

## Loop de execução

Enquanto o marco não estiver concluído:

```text
ler estado atual
→ escolher próximo subpasso
→ classificar necessidade de pesquisa
→ pesquisar/verificar quando necessário
→ planejar
→ escrever/implementar
→ revisar em cinco passadas
→ corrigir
→ validar
→ branch + PR + CI
→ merge normal
→ verificar main
→ atualizar estado/roadmap
→ continuar
```

## Fluxo de pesquisa

Antes de escrever, classificar como:

```text
OBRIGATÓRIA
ÚTIL
DESNECESSÁRIA
```

Pesquisa é normalmente **obrigatória** quando o subpasso define ou altera:

- progressão de entrada de um nível;
- ordem de fundamentos;
- cobertura global;
- pré-requisitos importantes;
- conceitos linguísticos/pedagógicos em que exista dúvida relevante;
- decisão que possa criar salto de dificuldade para iniciante.

Pesquisa é **útil** quando ajuda a detectar lacunas ou comparar alternativas sem ser indispensável.

Pesquisa é **desnecessária** quando a continuação é direta de arquitetura já validada e bem delimitada.

### Fontes

Preferir fontes primárias, institucionais, acadêmicas e referenciais curriculares confiáveis.

Usar fontes para detectar omissões, comparar progressões, verificar conceitos, identificar dependências e testar plausibilidade. Não copiar uma sequência externa automaticamente; sintetizar decisão adequada ao projeto.

Registrar no repositório a decisão duradoura e, quando necessário, a rastreabilidade das fontes.

## Regra canônica de progressão

Ao construir ou revisar sequência de aprendizagem, priorizar a dependência cognitiva do aluno, não a elegância teórica do autor.

Especialmente em fundamentos:

```text
concreto/perceptível
→ exemplo
→ nome do conceito
→ explicação clara, completa e simples
→ prática com apoio
→ prática com menos apoio
→ relação/abstração posterior
```

Nunca preservar uma ordem apenas porque ela já existe nos arquivos se a validação mostrar que começa por abstrações ou pressupõe conceitos ainda não ensinados.

### Teste obrigatório de pré-requisito

Para cada nova lição/unidade importante, perguntar:

```text
O aluno consegue compreender isto usando somente o que já foi ensinado?
Algum termo está sendo usado antes de ser ensinado?
Existe fundamento concreto que deveria vir antes?
A abstração aparece antes de exemplos suficientes?
```

Se a resposta indicar salto real, corrigir a progressão antes da redação final.

## Fluxo de escrita

Antes de conteúdo detalhado:

1. confirmar camada: nível, área, unidade, lição ou verificação;
2. confirmar objetivo, competências e limites;
3. confirmar pré-requisitos reais e responsabilidades posteriores;
4. verificar formato existente;
5. separar linguagem interna de linguagem pública quando houver texto para aluno;
6. escrever só até o grau de detalhe compatível com a maturidade pretendida.

Não saltar de arquitetura imatura diretamente para lições se o roadmap exigir camadas anteriores.

## Regra de linguagem pública

Aplicar a skill `course-content-design`.

```text
objetivo interno técnico
≠ texto mostrado ao aluno
```

Texto público precisa ser **claro, completo e simples**. Não basta trocar palavras difíceis por sinônimos: é necessário também garantir ordem de ideias, exemplos cedo e ausência de pressupostos não ensinados.

## Revisão obrigatória em cinco passadas

### A. Pedagógica

- objetivo e prática alinhados;
- dificuldade progressiva;
- carga cognitiva adequada;
- exemplos claros;
- prática suficiente;
- ausência de treino mecânico disfarçado de competência.

### B. Curricular

- pré-requisitos reais;
- alinhamento com nível/área/unidade;
- limites preservados;
- nenhuma antecipação importante sem motivo;
- ausência de lacunas/duplicação evitável;
- progressão natural do concreto ao mais abstrato;
- coerência com roadmap e matriz global.

### C. Evidência / avaliação

- evidência mede a competência declarada;
- apoio não entrega a resposta;
- produção necessária não é substituída por tarefa fechada;
- velocidade/memória/aparência não são confundidas com domínio;
- respostas abertas não recebem validação automática fictícia.

### D. Implementação / suporte

- texto, TTS, UI e mídia escolhidos pelo ganho pedagógico;
- mídia humana apenas quando necessária;
- dependências e IDs corretos;
- acessibilidade considerada;
- formatos compatíveis com arquitetura/renderer;
- validadores preservados.

### E. Clareza para o aluno

Perguntar explicitamente:

```text
A explicação é clara, completa e simples?
O aluno entende do que se trata sem metalíngua desnecessária?
Termos novos são ensinados antes de usados?
O exemplo chega cedo?
Existe uma ideia principal por vez?
Há salto entre esta etapa e a anterior?
O texto público parece escrito para aluno, não para professor?
```

Uma etapa só está pronta para PR depois das correções relevantes das cinco passadas.

## Estratégia de integração

Usar fluxo seguro:

```text
main atual
→ branch
→ alterações
→ revisão
→ PR
→ CI
→ correção se necessário
→ verificar mergeabilidade
→ merge normal
→ verificar main
```

Nunca contornar proteção/fluxo normal quando PR está disponível.

Um marco pode usar várias PRs. Preferir unidades lógicas menores quando isso melhora revisão e reduz risco.

## Atualização do roadmap/estado

Após mudança material:

- marcar somente o que foi realmente concluído;
- registrar marco ativo;
- registrar próximo subpasso quando útil;
- preservar pendências e blockers reais;
- não transformar subpasso interno em nova autorização do usuário.

Distinguir:

```text
MARCO ATIVO → o que a autorização atual pretende concluir
SUBPASSO INTERNO → próximo trabalho dentro do marco
```

## Mudanças de identidade curricular

Se revisão de progressão alterar semanticamente unidades/lições publicadas, não reutilizar IDs por conveniência.

Antes de migrar:

```text
mapear identidade semântica
→ progresso existente
→ manifests/catalog
→ deep links
→ mídia
→ evidência
→ só então alterar
```

Conclusão antiga não pode virar domínio de conteúdo novo por coincidência de ID.

## Condições de parada

Aplicar `docs/execucao-continua.md`.

Parar apenas quando:

- marco terminou;
- existe decisão estrutural relevante com alternativas reais sem vencedor claro;
- seria necessário mudar decisão importante fora do escopo autorizado;
- conflito de fontes muda materialmente a direção;
- ação externa indispensável bloqueia o trabalho;
- existe risco técnico relevante não resolvido pelo fluxo seguro.

Não parar por PR/merge rotineiro, CI corrigível, erro de JSON corrigível, atualização de roadmap, melhoria segura dentro do escopo ou mídia local não bloqueante.

## Relato

Durante o trabalho, atualizações curtas.

Ao finalizar ou parar por decisão necessária, informar só o essencial:

- o que foi concluído;
- correções relevantes;
- PR/CI/merge;
- pendências reais;
- próximo passo.

Não exigir `prossiga` entre subpassos de um marco já autorizado.

## Regra final

Cobertura curricular não basta. Uma progressão só é boa quando o aluno consegue atravessá-la de forma natural, com pré-requisitos ensinados e explicações claras, completas e simples.