# Skill: Curricular Orchestration

> **Escopo:** esta skill é destinada ao **ChatGPT** trabalhando no projeto `Portugues-completo`. Ela orquestra marcos curriculares longos e usa as skills especializadas existentes; não substitui `course-content-design`.

## Objetivo

Executar marcos de desenvolvimento curricular com autonomia operacional suficiente para evitar confirmações repetidas entre microetapas, mantendo pesquisa, escrita, revisão, validação, PR, CI, merge e atualização de estado como partes do mesmo ciclo.

## Quando usar

Usar quando o usuário autorizar um trabalho que contenha vários subpassos previsíveis, por exemplo:

- concluir um checkpoint curricular;
- elevar um ou mais níveis de maturidade;
- dimensionar uma unidade completa;
- desenvolver uma sequência inteira de lições já arquitetada;
- fazer revisão cruzada de cobertura e corrigir lacunas;
- executar um marco explicitamente registrado no roadmap.

Para uma tarefa isolada pequena, usar diretamente a skill especializada correspondente.

## Fontes obrigatórias de entrada

Antes de executar um marco curricular:

```text
1. PROJECT_INDEX.md
2. docs/roadmap-curricular.md
3. docs/execucao-continua.md
4. .ChatGPT/skills/course-content-design/SKILL.md
5. documentos curriculares específicos do marco
6. docs/conteudo.md quando houver autoria pedagógica
7. producao-midia/README.md e FILA-MIDIA.md quando mídia puder ser relevante
8. conteúdo existente relacionado, para evitar duplicação e regressão
```

## Definir o marco autorizado

Transformar o pedido do usuário em uma condição clara de conclusão.

Exemplos:

```text
"execute o checkpoint global"
→ termina quando N1-N4 estiverem em M1, matriz global estiver consolidada, revisão cruzada tiver sido feita e roadmap apontar o próximo marco

"desenvolva a Unidade 4"
→ termina quando o escopo autorizado da U4 estiver desenvolvido, revisado, validado, integrado e o roadmap tiver avançado
```

Não ampliar silenciosamente o marco para trabalho estrutural relevante que o usuário não autorizou.

## Loop de execução

Enquanto o marco não estiver concluído:

```text
ler estado atual
→ escolher próximo subpasso interno
→ decidir necessidade de pesquisa
→ pesquisar/verificar quando necessário
→ planejar
→ escrever/implementar
→ revisar em quatro passadas
→ corrigir problemas encontrados
→ validar
→ branch + PR + CI
→ merge normal
→ verificar main
→ atualizar roadmap se o estado mudou
→ escolher próximo subpasso
```

Não pedir confirmação entre essas etapas quando todas estiverem dentro do marco autorizado.

## Fluxo de pesquisa

### Gatilho

Antes de escrever, classificar a necessidade de pesquisa como:

```text
OBRIGATÓRIA
ÚTIL
DESNECESSÁRIA
```

Pesquisa é normalmente **obrigatória** quando o subpasso define nível inteiro, cobertura global, progressão de grandes domínios ou envolve dúvida linguística/pedagógica relevante que as fontes internas não resolvem com segurança.

Pesquisa é normalmente **útil** quando pode revelar lacunas ou melhorar uma decisão sem ser indispensável.

Pesquisa é normalmente **desnecessária** quando o trabalho é continuação direta de arquitetura já aprovada e bem delimitada.

### Fontes

Preferir fontes primárias, institucionais, acadêmicas e referenciais curriculares confiáveis conforme o tema.

Não transformar autoridade externa em regra automática do projeto. Usar fontes para:

- detectar omissões;
- comparar progressões;
- verificar terminologia e conceitos;
- identificar dependências;
- testar se a cobertura global é plausível.

Depois sintetizar a decisão na arquitetura própria do curso.

### Persistência

Registrar no repositório a **decisão duradoura**, não uma pilha de anotações de pesquisa, salvo quando rastreabilidade de fontes for necessária para a própria decisão.

## Fluxo de escrita

Antes de produzir conteúdo detalhado:

1. confirmar a camada correta: nível, área, unidade, lição ou verificação;
2. confirmar objetivo, competências e limites;
3. confirmar dependências anteriores e responsabilidades posteriores;
4. verificar se o formato existente deve ser reutilizado;
5. escrever apenas até o grau de detalhe compatível com a maturidade pretendida.

Não saltar de M0 diretamente para conteúdo de lição se o roadmap exigir M1/M2/M3 antes.

## Revisão obrigatória em quatro passadas

### A. Pedagógica

- objetivo e prática alinhados;
- dificuldade progressiva;
- carga cognitiva adequada;
- exemplos claros e não enganosos;
- prática suficiente;
- ausência de treino mecânico disfarçado de competência.

### B. Curricular

- pré-requisitos reais;
- alinhamento com nível/área/unidade;
- limites preservados;
- nenhuma antecipação importante sem motivo;
- ausência de lacunas ou duplicação evitável;
- coerência com roadmap e matriz global.

### C. Evidência / avaliação

- evidência mede a competência declarada;
- apoio não entrega a resposta;
- produção necessária não pode ser compensada por tarefas fechadas;
- critérios não confundem velocidade, memória, quantidade ou aparência com domínio;
- respostas abertas não recebem validação automática fictícia.

### D. Implementação / suporte

- texto, TTS, UI e mídia escolhidos pelo ganho pedagógico;
- mídia humana criada apenas quando necessária;
- dependências e IDs corretos;
- acessibilidade considerada;
- formatos compatíveis com arquitetura e renderer;
- validadores aplicáveis preservados.

Uma etapa só está pronta para PR depois de aplicar as correções relevantes encontradas nessas quatro passadas.

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

Nunca contornar proteção de branch por ref manual ou merge fabricado quando o fluxo normal de PR estiver disponível.

Um marco pode usar várias PRs. Preferir unidades lógicas menores quando isso melhora revisão e reduz risco, mas continuar automaticamente após cada merge.

## Atualização do roadmap

Após mudança material de estado curricular:

- marcar o que foi realmente concluído;
- registrar o marco ativo;
- registrar o próximo **subpasso interno** quando útil;
- não transformar cada subpasso em nova autorização obrigatória do usuário.

Distinguir:

```text
MARCO ATIVO
→ o que a autorização atual pretende concluir

SUBPASSO INTERNO
→ o que o ChatGPT executa a seguir dentro desse marco
```

## Condições de parada

Aplicar as condições de `docs/execucao-continua.md`.

Em resumo, parar apenas quando:

- o marco terminou;
- há decisão estrutural relevante com alternativas reais sem vencedor claro;
- seria necessário mudar decisão importante fora do escopo autorizado;
- conflito de fontes muda materialmente a direção;
- ação externa indispensável do usuário bloqueia o trabalho;
- existe risco técnico relevante que o fluxo seguro não resolve.

Não parar por:

- PR ou merge rotineiro;
- CI corrigível;
- erro de JSON corrigível;
- atualização do roadmap;
- identificação de melhoria que possa ser implementada com segurança no escopo;
- mídia pendente que não bloqueia autoria independente.

## Relato

Durante o trabalho, manter atualizações curtas.

Ao finalizar o marco ou parar por decisão necessária, informar apenas o essencial:

- o que foi efetivamente concluído;
- o que foi corrigido após revisão;
- PR/CI/merge relevantes;
- pendências reais;
- próximo marco ou decisão requerida.

Não exigir que o usuário responda `prossiga` entre subpassos de um marco já autorizado.
