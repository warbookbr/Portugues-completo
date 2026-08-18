# T1.9 — Contrato de migração da nova entrada N0

**Status:** `CONGELADO PARA IMPLEMENTAÇÃO`

**Marco:** `CL-T1-FUNDAMENTOS-CLAROS`

**Fontes de decisão:**

- `docs/redimensionamento-t1-2-n0.md`;
- `docs/plano-fundamentos-claros.md`;
- `docs/estado-implementacao-classico.md`.

## 1. Objetivo

Integrar a nova U1/U2 sem fazer um progresso histórico significar uma aprendizagem que o aluno não demonstrou.

A migração é conservadora e auditável:

```text
mesmo significado
→ preservar / transferir

significado dividido
→ mapear somente evidência semanticamente suficiente

significado movido
→ novo ID + transferência explícita

significado novo sem prova histórica
→ não atribuir domínio
```

A promoção dos arquivos staged, catálogo e manifests só acontece depois deste contrato e do mapper estarem validados em CI.

## 2. Revisão de conteúdo

A revisão que identifica a nova entrada é:

```text
t1-n0-entry-v2
```

O mapper é idempotente. Progresso já marcado com essa revisão não é migrado novamente.

Uma revisão futura/desconhecida não pode ser rebaixada silenciosamente para esta revisão.

## 3. Identidades de unidade/competência

### Nova U1 — Letras e primeiros sons

Competências estáveis publicadas:

```text
N0-U01-C03 — letras/alfabeto
N0-U01-C04 — maiúsculas/minúsculas
N0-U01-C05 — vogais/consoantes (significado estreitado, mas implicado pelo domínio histórico mais amplo)
N0-U01-C09 — letras versus algarismos/pontuação/outros símbolos (nova identidade)
N0-U01-C06 — organização visual
N0-U01-C02 — percepção sonora
N0-U01-C07 — nome da letra × som
```

`N0-U01-C01` e `N0-U01-C08` não são reutilizadas com outro significado na U1.

### Nova U2 — Sílabas e primeiras palavras

Competências estáveis novas:

```text
N0-U02-C01 — perceber palavra inteira e partes sonoras
N0-U02-C02 — entender/usar funcionalmente “sílaba”
N0-U02-C03 — segmentar e recombinar sílabas
N0-U02-C04 — relacionar sílaba ouvida e trecho escrito
N0-U02-C05 — localizar/recorrer sílabas em palavras
N0-U02-C06 — reconhecer formatos escritos diferentes de sílaba
N0-U02-C07 — ordenar/completar sílabas para formar palavras
N0-U02-C08 — usar/reduzir apoio silábico na leitura
N0-U02-C09 — relacionar palavra lida e significado
N0-U02-C10 — perceber variação letra ↔ som
N0-U02-C11 — distinguir fala e escrita de forma concreta
```

Migração de competências movidas:

```text
N0-U01-C08 histórico
→ N0-U02-C10

N0-U01-C01 histórico
→ N0-U02-C11
```

O mapper não copia cegamente o status antigo desses dois IDs. Ele reconstrói o novo status a partir de evidências semanticamente mapeadas e então remove os IDs históricos do conjunto ativo para evitar contagem dupla.

## 4. Lições com identidade preservada

Continuam com o mesmo ID porque o núcleo semântico permanece:

```text
U1: L02, L03, L04, L05, L06, L07
U2: L01–L08
```

Histórico de lição pode permanecer quando a nova responsabilidade é equivalente ou subconjunto seguro da antiga.

A preservação do ID **não** autoriza preservar automaticamente qualquer `lição/atividade` se a atividade mudou de significado.

## 5. Split crítico — antiga U1-L05

A L05 antiga avaliava ao mesmo tempo:

```text
vogal/consoante
+
letra/algarismo/pontuação/outro símbolo
```

A nova arquitetura separa:

```text
N0-U01-L05 → vogais/consoantes
N0-U01-L09 → letras, números e outros sinais
```

Há colisões de refs: alguns sufixos históricos continuam existindo na nova L05 com outro significado. Antes da publicação, o mapper arquiva os refs antigos conflitantes sob prefixo `legacy:t1-n0-v1:`.

### Evidência para a nova L05

A antiga `L05-A01` classificava as 26 letras como vogal/consoante e é mais forte que as novas checagens introdutórias.

Quando demonstrada:

```text
antiga L05-A01
→ nova L05-A01
→ nova L05-A02
→ nova L05-C03
```

Assim uma conclusão antiga da L05 continua válida para o núcleo estreitado de vogais/consoantes.

### Evidência para a nova L09

```text
antiga L05-C02 → nova L09-C01
antiga L05-A02 → nova L09-A01
antiga L05-C03 → nova L09-C02
```

`N0-U01-L09` só fica `CONCLUIDA` quando as evidências obrigatórias mapeadas (`L09-A01` e `L09-C02`) satisfazem a nova regra. Sem prova suficiente, no máximo fica `EM_ESTUDO`.

`N0-U01-C09` é derivada apenas dessas evidências mapeadas; o status amplo da antiga `C05` não é usado como atalho.

## 6. Conteúdos movidos de U1 para U2

### Fala/escrita

```text
N0-U01-L01
→ N0-U02-L10
```

Equivalências de evidência:

```text
antiga L01-C01 → nova L10-C01
antiga L01-A01 → nova L10-A01
antiga L01-A01 → também satisfaz a identificação concreta exigida por L10-C01 quando necessário
antiga L01-C03 → nova L10-C02
```

O registro curricular da antiga L01 é transferido para a nova L10 e removido do conjunto ativo para não contar duas lições.

### Variação letra/som

```text
N0-U01-L08
→ N0-U02-L09
```

Equivalências:

```text
antiga L08-C01 → nova L09-C01
antiga L08-C02 → nova L09-C02
antiga L08-A01 → nova L09-A01 + nova L09-A02
antiga L08-C03 → nova L09-C03
```

A antiga `L08-A01` avaliava as duas direções da variação no mesmo exercício integrado; por isso pode sustentar as duas práticas novas.

O registro curricular da antiga L08 é transferido para a nova L09 e removido do conjunto ativo.

## 7. Verificação U1 — V01 → V02

A arquitetura T1.2 congelou explicitamente:

```text
N0-U01-V01 antiga concluída
→ equivalência suficiente para N0-U01-V02
```

Quando a V01 está concluída, o mapper materializa evidência de equivalência para os 9 itens da V02 e marca os quatro clusters como demonstrados. Isso não afirma que o aluno respondeu literalmente às perguntas novas; registra a equivalência curricular já aprovada entre os checkpoints.

Para progresso parcial, somente equivalências diretas são transferidas, por exemplo:

```text
V01-Q02 → V02-Q07
V01-Q04 → V02-Q02
V01-Q05 → V02-Q03 + V02-Q04
V01-Q06 → V02-Q05
V01-Q07 → V02-Q06
V01-Q08 → V02-Q08
V01-Q09 → V02-Q09
```

A V02 parcial não é concluída por aproximação.

## 8. Verificação U2 — V01 + escopos movidos → V02

Os itens silábicos históricos permanecem semanticamente equivalentes:

```text
N0-U02-V01/V01-Q01..Q09
→ N0-U02-V02/V02-Q01..Q09
```

Os três itens novos dependem dos escopos movidos:

```text
variação letra/som → V02-Q10 + V02-Q11
fala/escrita       → V02-Q12
```

Equivalência integral segura:

```text
U2-V01 concluída
+
U1-L08 antiga concluída
+
U1-L01 antiga concluída
→ U2-V02 concluída
```

Sem as três condições, o mapper preserva apenas as evidências diretamente justificáveis e não conclui a nova verificação.

## 9. Current, deep links e histórico ativo

Se `curriculum.current.lessonId` aponta para conteúdo movido:

```text
N0-U01-L01 → unitId N0-U02 / lessonId N0-U02-L10
N0-U01-L08 → unitId N0-U02 / lessonId N0-U02-L09
```

Aliases de rota serão publicados junto com o catálogo em um lote posterior de T1.9.

Evidências históricas que não podem permanecer em refs ativos por colisão não são apagadas: são arquivadas em refs `legacy:t1-n0-v1:*`.

Respostas abertas não são reatribuídas por semelhança. Se um ref antigo não tiver equivalência estrutural segura, a resposta permanece histórica/arquivada.

## 10. Reviews

Reviews de competências movidas acompanham a nova identidade:

```text
C01 histórico → U2-C11
C08 histórico → U2-C10
```

Review de C05 só migra para a nova C09 quando o `sourceEvidenceRef` identifica claramente a parte histórica de outros sinais. Caso contrário permanece ligada ao núcleo C05.

## 11. Gist e merge

O mapper deve ser aplicado tanto ao cache local quanto a um progresso recebido do Gist antes de ele se tornar o estado ativo.

A migração é idempotente e deve acontecer antes de salvar uma nova baseline sincronizada. Um remoto antigo não pode reintroduzir refs semanticamente obsoletos depois da migração local.

## 12. Backup

Antes de substituir no cache uma estrutura válida porém pré-T1, a integração T1.9 deve preservar uma cópia do JSON original. A migração não reutiliza a política de “schema inválido”; ela terá motivo próprio de backup.

## 13. Mídia

Esta etapa não renumera mídia por posição curricular.

Preservar:

- `N0-U01-L02-AUD-*` para percepção sonora;
- `N0-U01-L03-AUD-*` para nomes de letras;
- `N0-U01-L08-AUD-*` quando reutilizado em `N0-U02-L09`;
- famílias U2 já usadas em sílabas/palavras;
- áudios históricos V01 reutilizados pelas V02 quando semanticamente adequados.

Nenhum áudio é gerado/regravado automaticamente em T1.9. Mídia ausente continua blocker local do estímulo dependente.

## 14. Gate deste contrato

Antes de promover staging, CI precisa provar pelo menos:

- migração idempotente;
- nenhuma revisão futura/desconhecida é rebaixada;
- refs conflitantes da L05 não sobrevivem com significado errado;
- L09 split só conclui com evidência suficiente;
- L01/L08 movidas não contam duas vezes;
- U1-V02 concluída somente por equivalência congelada ou evidência suficiente;
- U2-V02 não conclui sem escopo silábico + variação + fala/escrita;
- current não aponta para os IDs movidos;
- competências C01/C08 antigas não duplicam C11/C10 novas;
- progresso migrado continua válido contra `progress.schema.json`.
