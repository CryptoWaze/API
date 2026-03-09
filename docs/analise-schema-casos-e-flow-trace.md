# Análise: schema atual vs criação de casos e fluxos

Este documento analisa as tabelas atuais do banco, o que o flow trace persiste hoje (FlowTraceLog) e o que as entidades Case/Flow/FlowTransaction esperam, para decidir se falta coluna/tabela ou se o que temos basta para criar um “caso” e separar transações/fluxos.

---

## 1. Tabelas atuais (resumo)

### 1.1 Case (caso)

| Coluna | Tipo | Observação |
|--------|------|------------|
| id | cuid | PK |
| externalId | string? | Único, opcional (ex.: ID externo do usuário) |
| name | string | Nome do caso |
| status | CaseStatus | OPEN, PROCESSING, COMPLETED, PARTIALLY, FAILED |
| createdByUserId | string | FK User – **obrigatório** |
| totalAmountLostRaw | string | Valor total perdido (raw) |
| totalAmountLostDecimal | string | Valor total perdido (decimal) |
| createdAt, updatedAt | DateTime | |

**Relações:** 1 User (criador), N CaseSeedTransaction (sementes), N Flow (fluxos).

**Uso esperado:** Um caso agrupa uma investigação (perda reportada), vinculada a um usuário e a uma ou mais “sementes” (transações iniciais) e fluxos rastreados.

---

### 1.2 CaseSeedTransaction (transação semente)

| Coluna | Tipo | Observação |
|--------|------|------------|
| id | cuid | PK |
| caseId | string | FK Case |
| chainId | string | FK Chain |
| txHash | string | Hash da transação semente |
| tokenAddress | string? | Contrato do token |
| tokenSymbol | string? | Ex.: USDT |
| amountRaw | string | Valor raw da transferência |
| amountDecimal | string | Valor decimal |
| timestamp | DateTime | Data da tx |
| createdAt | DateTime | |

**Relações:** 1 Case, 1 Chain, N Flow (cada fluxo parte de uma semente).

**Uso esperado:** Representa a transação que enviou os fundos para a primeira carteira do rastreio. Cada Flow está ligado a uma CaseSeedTransaction.

---

### 1.3 Flow (fluxo rastreado)

| Coluna | Tipo | Observação |
|--------|------|------------|
| id | cuid | PK |
| caseId | string | FK Case |
| seedId | string | FK CaseSeedTransaction |
| chainId | string | FK Chain |
| tokenAddress | string? | Token do fluxo |
| tokenSymbol | string? | Ex.: USDT |
| totalAmountRaw | string | Valor total (ex.: da semente) |
| totalAmountDecimal | string | |
| hopsCount | int | Número de saltos (hops) |
| endpointAddress | string | Última carteira do fluxo |
| endpointReason | FlowEndpointReason | **Enum próprio** (ver abaixo) |
| endpointHotWalletId | string? | FK HotWallet se terminou em exchange |
| isEndpointExchange | bool | true se terminou em hot wallet |
| createdAt, updatedAt | DateTime | |

**Enum FlowEndpointReason:**  
`EXCHANGE_HOT_WALLET` | `MAX_HOPS_REACHED` | `NO_OUTGOING_ABOVE_THRESHOLD` | `CYCLE_DETECTED`

**Relações:** 1 Case, 1 CaseSeedTransaction, 1 Chain, 0 ou 1 HotWallet (endpoint), N FlowTransaction.

**Uso esperado:** Um fluxo = um rastreio a partir de uma semente até o endpoint (hot wallet ou fim de caminho).

---

### 1.4 FlowTransaction (cada salto do fluxo)

| Coluna | Tipo | Observação |
|--------|------|------------|
| id | cuid | PK |
| flowId | string | FK Flow |
| chainId | string | FK Chain |
| hopIndex | int | Ordem do salto (0, 1, 2…) |
| txHash | string | Hash da tx desse salto |
| fromAddress | string | De |
| toAddress | string | Para |
| tokenAddress | string? | Contrato do token |
| tokenSymbol | string? | Símbolo |
| amountRaw | string | Valor raw |
| amountDecimal | string | Valor decimal |
| timestamp | DateTime | Data da tx |
| isEndpointHop | bool | true se for o último salto |
| createdAt | DateTime | |

**Uso esperado:** Uma linha por “salto” (transferência) no caminho do fluxo, em ordem (hopIndex).

---

### 1.5 FlowTraceLog (log de auditoria do rastreio)

| Coluna | Tipo | Observação |
|--------|------|------------|
| id | cuid | PK |
| inputAddress | string | Carteira de partida |
| chainSlug | string | Ex.: bsc, eth |
| status | FlowTraceLogStatus | **Enum próprio** (ver abaixo) |
| endpointAddress | string? | Preenchido em sucesso |
| failureAtAddress | string? | Última carteira em falha |
| failureReason | string? | Texto do motivo |
| stepsCount | int | Quantidade de “steps” (arestas) |
| createdAt | DateTime | |

**Enum FlowTraceLogStatus:**  
`SUCCESS` | `NO_OUTBOUND` | `MAX_WALLETS_REACHED` | `EXHAUSTED_OPTIONS`

**Relações:** N FlowTraceLogStep. **Não** tem FK para Case, Flow ou User.

**Uso atual:** Registro de cada execução do endpoint de flow trace (sucesso ou falha), sem vínculo com Case/Flow.

---

### 1.6 FlowTraceLogStep (cada aresta do grafo explorado)

| Coluna | Tipo | Observação |
|--------|------|------------|
| id | cuid | PK |
| flowTraceLogId | string | FK FlowTraceLog |
| stepIndex | int | Índice da aresta na ordem em que foi explorada |
| fromAddress | string | De |
| toAddress | string | Para |
| transferSymbol | string? | Símbolo |
| transferAmountRaw | string? | Valor raw |
| transferAmountDecimal | string? | Valor decimal (string no schema) |
| txHash | string? | Hash da tx |
| outcome | FlowTraceLogStatus? | SUCCESS / NO_OUTBOUND / MAX_WALLETS_REACHED / EXHAUSTED_OPTIONS |
| createdAt | DateTime | |

**Uso atual:** Grafo completo explorado: todas as arestas (caminho que deu certo + ramos que falharam). O campo `outcome` indica o resultado daquela aresta (ex.: SUCCESS = no caminho vencedor).

---

## 2. O que o flow trace produz hoje (em memória e no log)

- **Entrada:** `address` + `chain` (ou `txHash` + `reportedLossAmount` no by-transaction).
- **Em memória durante o rastreio:**
  - **Path (sucesso):** lista ordenada de `FlowStep`: `fromAddress`, `toAddress`, `transfer` (WalletTransfer: symbol, amount, rawAmount, txHash, timestamp, contract, type, etc.).
  - **Edges (grafo):** todas as arestas com `outcome` (SUCCESS, NO_OUTBOUND, MAX_WALLETS_REACHED, EXHAUSTED_OPTIONS).
- **O que é persistido no FlowTraceLog + FlowTraceLogStep:**
  - Cabeçalho: inputAddress, chainSlug, status, endpointAddress ou failureAtAddress/failureReason, stepsCount.
  - Steps: para **cada aresta** do grafo: fromAddress, toAddress, transferSymbol, transferAmountRaw, transferAmountDecimal, txHash, outcome.  
  - **Não** são persistidos: timestamp da transferência, tokenAddress/contract, e não há vínculo com Case/User/Flow.

---

## 3. Comparação: o que Case/Flow/FlowTransaction precisam vs o que temos

### 3.1 Criar Case

| Necessário | Temos no flow trace? | Observação |
|------------|----------------------|------------|
| createdByUserId | Não | Endpoint atual não recebe usuário; precisa vir do contexto de autenticação. |
| name | Não | Pode ser gerado (ex.: “Caso 2024-01-15 – 0x…” ou vindo do front). |
| totalAmountLostRaw / totalAmountLostDecimal | Parcial | No by-transaction temos o valor reportado (e a semente); no by-address não temos valor perdido. |
| status | Sim | Podemos mapear: COMPLETED (SUCCESS), PARTIALLY (NO_OUTBOUND / EXHAUSTED), FAILED (erro), etc. |
| externalId | Opcional | Se o front passar. |

**Conclusão:** Falta **usuário (createdByUserId)** no fluxo atual; nome e valor podem ser definidos por regra ou pelo front.

---

### 3.2 Criar CaseSeedTransaction

| Necessário | Temos no flow trace? | Observação |
|------------|----------------------|------------|
| caseId, chainId | Sim (chain) | chainSlug temos; chainId é FK (buscar Chain pelo slug). |
| txHash, amountRaw, amountDecimal, tokenAddress, tokenSymbol, timestamp | Só no by-transaction | No **by-transaction** o resolve já retorna a semente (seedTransfer). No **by-address** não temos transação semente – só “carteira + chain”. |

**Conclusão:** Para **by-transaction** dá para criar CaseSeedTransaction a partir do resolve. Para **by-address** não existe “transação semente” hoje; seria preciso ou tornar seed opcional no Flow, ou outro modelo (ex.: “Flow sem semente” / semente sintética). Isso impacta o schema (Flow.seedId hoje é obrigatório).

---

### 3.3 Criar Flow

| Necessário | Temos no flow trace? | Observação |
|------------|----------------------|------------|
| caseId, seedId, chainId | Parcial | caseId ao criar Case; seedId só se existir CaseSeedTransaction; chainId por slug. |
| tokenAddress, tokenSymbol, totalAmountRaw, totalAmountDecimal | Parcial | No path temos a primeira transferência (e a semente no by-transaction); podemos pegar symbol/amount daí. |
| hopsCount | Sim | `result.steps.length`. |
| endpointAddress | Sim | `result.endpointAddress` (sucesso) ou última carteira (falha). |
| endpointReason | Mapeamento | Nosso status: SUCCESS, NO_OUTBOUND, MAX_WALLETS_REACHED, EXHAUSTED_OPTIONS. O enum do Flow é: EXCHANGE_HOT_WALLET, MAX_HOPS_REACHED, NO_OUTGOING_ABOVE_THRESHOLD, CYCLE_DETECTED. Precisa mapear e/ou estender enum. |
| endpointHotWalletId, isEndpointExchange | Sim (em sucesso) | Se status SUCCESS, endpointAddress é hot wallet; dá para buscar HotWallet por chain + address. |

**Conclusão:** Quase tudo dá para preencher. **Gap:** enum diferente (FlowEndpointReason vs FlowTraceLogStatus); possível necessidade de novos valores (ex.: EXHAUSTED_OPTIONS, NO_OUTBOUND).

---

### 3.4 Criar FlowTransaction (cada hop do path)

| Necessário | Temos no flow trace? | Observação |
|------------|----------------------|------------|
| flowId, chainId, hopIndex | Sim | path ordenado; hopIndex = índice no path. |
| txHash, fromAddress, toAddress | Sim | Em cada FlowStep (e no path). |
| tokenAddress, tokenSymbol, amountRaw, amountDecimal, timestamp | Em memória sim; no log não | `transfer` em FlowStep tem symbol, amount, rawAmount, contract, timestamp. No **FlowTraceLogStep** não persistimos timestamp nem contract/tokenAddress. |

**Conclusão:** Para criar FlowTransaction **na hora** do rastreio (a partir do path em memória), temos tudo. Para criar FlowTransaction **depois**, só a partir do log: **faltam timestamp e tokenAddress** em FlowTraceLogStep.

---

## 4. Fluxo “path” vs grafo no log

- O **path** é a sequência ordenada de passos que levou ao resultado (sucesso ou até onde parou).
- O **FlowTraceLogStep** guarda **todas** as arestas exploradas (path + ramos que falharam), com `stepIndex` = ordem em que foram **exploradas**, não necessariamente a ordem do path.

Para montar a sequência de FlowTransaction a partir do log seria preciso:
- Filtrar steps com `outcome === 'SUCCESS'` **e** que façam parte do caminho até o endpoint (o que exige lógica de grafo: ponto de partida = inputAddress, seguir apenas arestas SUCCESS até endpointAddress). Ou então persistir em algum lugar **explicitamente** quais stepIndex fazem parte do path (ex.: coluna `isOnPath` ou uma tabela separada de “path steps”).

Hoje, para “criar caso + flow + flow transactions” **no momento da requisição**, o ideal é usar o **path em memória** (result.steps), não reconstruir só a partir do log.

---

## 5. Resumo: o que falta ou precisa de decisão

| Tema | Situação | Sugestão |
|------|----------|----------|
| **User no caso** | Case exige createdByUserId; endpoint não recebe usuário | Passar usuário via contexto de autenticação (ex.: JWT) na chamada do flow trace. |
| **Semente no by-address** | Flow.seedId obrigatório; em by-address não temos tx semente | Decidir: (a) Flow opcional sem seed (schema: seedId opcional?), (b) “semente sintética” com txHash vazio/null e dados mínimos, ou (c) não criar Case/Flow quando for só by-address. |
| **Enum de motivo do endpoint** | FlowEndpointReason ≠ FlowTraceLogStatus | Mapear (SUCCESS→EXCHANGE_HOT_WALLET, MAX_WALLETS_REACHED→MAX_HOPS_REACHED) e/ou adicionar valores no FlowEndpointReason (ex.: NO_OUTBOUND, EXHAUSTED_OPTIONS). |
| **Dados no log para reconstruir FlowTransaction** | FlowTraceLogStep sem timestamp e sem tokenAddress/contract | Se quiser reconstruir fluxo só a partir do log: adicionar em FlowTraceLogStep: `timestamp` (DateTime?), `tokenAddress` (string?). |
| **Path explícito no log** | stepIndex = ordem de exploração, não ordem do path | Se quiser derivar path só do log: ou (a) coluna `isOnPath` (bool) em FlowTraceLogStep, ou (b) persistir em outro lugar a lista ordenada de stepIds/hopIndex do path. |
| **Vínculo log ↔ caso** | FlowTraceLog não referencia Case nem Flow | Opcional: coluna `caseId` e/ou `flowId` em FlowTraceLog para rastrear qual caso/fluxo nasceu daquela execução. |

---

## 6. Conclusão

- **Para criar Case + Flow + FlowTransaction no momento da requisição** (sem depender do log):  
  - O que temos **em memória** (path, steps, endpoint, status) é **suficiente** para montar Flow e FlowTransaction.  
  - Falta: **usuário** (auth), decisão sobre **semente no by-address** e alinhamento dos **enums** de motivo.

- **Para que o log sozinho permita recriar o fluxo depois:**  
  - Faltam em **FlowTraceLogStep**: **timestamp**, **tokenAddress** (e talvez **isOnPath** ou equivalente).  
  - E, se quiser ligar ao caso: **caseId**/flowId em FlowTraceLog.

Ou seja: o jeito que está hoje **dá** para salvar caso, fluxo e transações **na hora** da requisição, desde que usuário e regra de semente (by-address) estejam definidos e os enums mapeados. Para “separar bonitinho” só a partir do log depois, vale estender o schema do log (timestamp, tokenAddress, path explícito) e, se desejado, o vínculo log → Case/Flow.
