# Rastreio básico e rastreio avançado – visão técnica

Este documento descreve, em nível técnico, como funcionam os dois modos de rastreio hoje implementados na API:

- **Rastreio básico** – caminho principal até uma hot wallet, sem branching pesado.
- **Rastreio avançado** – explora ramificações adicionais (flows extras) a partir do caminho principal.

A base dos dois modos é o mesmo use case de rastreio e as mesmas portas de dados (`IAddressTransfersFetcher`, `IHotWalletChecker`, `ITokenPriceProvider`).

---

## 1. Conceitos e tipos envolvidos

### 1.1. `WalletTransfer` (visão de transferência por endereço)

Arquivo: `src/application/types/transfer.types.ts`

```ts
export type WalletTransfer = {
  type: 'native' | 'erc20';
  symbol: string;
  from: string;
  to: string;
  rawAmount: string;        // BigInt em string
  amount: number;           // normalizado (decimals)
  timestamp: string;        // ISO 8601
  txHash: string;
  contract?: string;        // token address
  direction: 'IN' | 'OUT';  // em relação ao address consultado
  counterparty: string;     // outro lado da transferência
};
```

Esse é o "átomo" que vem das ports de dados (Covalent hoje, módulo interno no futuro).

### 1.2. `FlowStep` e `FlowGraphEdge`

Arquivo: `src/application/types/transfer.types.ts`

```ts
export type FlowStep = {
  fromAddress: string;
  toAddress: string;
  transfer: WalletTransfer;
  tokenPriceUsd?: number | null;
  tokenImageUrl?: string | null;
};

export type FlowGraphEdge = {
  from: string;
  to: string;
  symbol: string;
  amount: number;
  amountRaw: string;
  txHash: string;
  timestamp?: string;
  outcome?: 'SUCCESS' | 'NO_OUTBOUND' | 'MAX_WALLETS_REACHED' | 'EXHAUSTED_OPTIONS';
  tokenPriceUsd?: number | null;
  tokenImageUrl?: string | null;
};
```

- `FlowStep[]` representa o **caminho principal** do rastreio (path linear que vira `FlowTransaction` no Postgres).
- `FlowGraphEdge[]` representa o **grafo completo** de explorações (usado para `FlowEdge` / visualização).

### 1.3. Portas de suporte

- `IAddressTransfersFetcher` – busca transfers por endereço (Covalent ou módulo interno).
- `IHotWalletChecker` – verifica se um endereço é hot wallet/endpoint de exchange registrada.
- `ITokenPriceProvider` – busca preços USD de tokens para priorização e enriquecimento.
- `IFlowTraceProgressEmitter` – emite mensagens de progresso via WebSocket.
- `IFlowTraceLogWriter` – escreve logs temporários de rastreio (não usados na leitura de casos).

---

## 2. Rastreio básico (FollowFlowToExchangeUseCase)

### 2.1. Objetivo

- Dado um endereço inicial (`address`) e uma chain (`chain`), encontrar **um caminho principal** até uma hot wallet de exchange (ou até não haver mais transferências relevantes).
- É "profundidade primeiro" com backtracking limitado, mas **sem branching adicional** para criar múltiplos flows.

### 2.2. Fonte de dados

- Usa `IAddressTransfersFetcher.getAddressTransfers(chain, address)` para obter o histórico de transfers da carteira.
- Hoje isso é atendido por:
  - `CovalentApiService.getAddressTransfers` → `transactions_v3` da Covalent.
- No futuro, poderá ser atendido pela **Blockchain Data API interna** (`/_blockchain/...`).

### 2.3. Regras principais

1. **Filtrar transferências de saída relevantes**
   - Mantém apenas transfers com `direction === 'OUT'`.
   - Aplica filtro mínimo por valor (atualmente:
     - `MIN_TRANSFER_AMOUNT = 0.01` em unidades do token,
     - e, mais recentemente, `MIN_TRANSFER_USD = 100` quando temos preço USD).

2. **Ordenar por prioridade**
   - Prioriza transfers por **valor em USD** (usando `ITokenPriceProvider` + tabela `Token`).
   - Se não houver preço, usa o valor bruto como critério secundário.

3. **Escolher próximo hop**
   - Pega a melhor transferência de saída (`OUT`) para um `counterparty` ainda não visitado.
   - Define esse `counterparty` como próximo `currentAddress`.

4. **Detecção de hot wallet**
   - A cada endereço visitado, pergunta ao `IHotWalletChecker` se é uma **hot wallet registrada** para aquela chain.
   - Se for:
     - marca o fluxo como **sucesso** (`FlowEndpointReason.EXCHANGE_HOT_WALLET`),
     - termina o rastreio.

5. **Limites e stop conditions**
   - `MAX_WALLETS` – limite de profundidade (50 hops).
   - Se não houver mais transferências de saída acima do mínimo → `NO_OUTBOUND`.
   - Se todas as opções forem tentadas e nenhuma leva a hot wallet → `EXHAUSTED_OPTIONS`.

### 2.4. Resultado

O `FollowFlowToExchangeUseCase` retorna (simplificado):

```ts
type FollowFlowToExchangeResult = {
  chain: string;
  steps: FlowStep[];       // caminho principal
  endpointAddress: string; // hot wallet ou última carteira analisada
};
```

Esse resultado é usado diretamente para:

- endpoint `GET /addresses/:address/flow-to-exchange`,
- criação de `Flow`, `FlowTransaction` e `FlowEdge` quando o rastreio é parte de um caso.

O modo **básico** de criação de casos (`mode: 'basic'` no `POST /cases`) utiliza essencialmente esse comportamento: 1 flow principal por seed.

---

## 3. Rastreio avançado (FollowFlowToExchangeFullHistoryUseCase)

### 3.1. Objetivo

- Em vez de encontrar **apenas um caminho**, o rastreio avançado visa:
  - considerar **todo o histórico** relevante de cada carteira (full-history),
  - priorizar **grandes transferências por USD**,
  - explorar **ramificações adicionais** (flows extras) a partir do caminho principal,
  - registrar o grafo completo de explorações para visualização forense.

É um DFS iterativo com backtracking, limites de profundidade e paginação, hoje altamente acoplado à Covalent por falta de filtros avançados na API deles.

### 3.2. Fonte de dados (full-history)

- Usa `IAddressTransfersFetcher.getAddressTransfersPage(chain, address, page)` para percorrer `transactions_v3/page/{page}` da Covalent.
- Implementação interna importante:

```ts
const MAX_WALLETS = 50;
const MAX_PAGES_PER_WALLET = 50;
const TOP_OUTBOUNDS_PER_WALLET = 10;
const HOT_WALLET_SCAN_LIMIT = 100;
const MIN_TRANSFER_AMOUNT = 0.01;
const MIN_TRANSFER_USD = 100;
```

- Função chave: `getFullHistoryTopOutbounds`:
  - para um endereço, carrega **todas as páginas** (até `MAX_PAGES_PER_WALLET`),
  - filtra por `minTimestamp` (derivada da seed),
  - aplica filtro de poeira (`MIN_TRANSFER_AMOUNT`),
  - enriquece por USD (`MIN_TRANSFER_USD`),
  - retorna as top transfers de saída (`OUT`) por valor em USD.

### 3.3. Estrutura de controle (pilha)

O rastreio avançado usa uma **pilha explícita (`StackFrame[]`)** para implementar DFS iterativo:

```ts
type StackFrame = {
  path: FlowStep[];
  currentAddress: string;
  outbounds: WalletTransfer[] | null;
  outboundIndex: number;
  edgeIndex?: number; // índice da última edge na lista global de edges
};
```

Loop principal (`traceFlowIterative`):

1. Inicializa a pilha com um frame para o endereço inicial.
2. Enquanto houver frames na pilha:
   - faz heartbeat de progresso via `IFlowTraceProgressEmitter`;
   - processa o frame do topo:
     - se `path.length >= MAX_WALLETS` → encerra com `MAX_WALLETS_REACHED`;
     - se o endereço atual é hot wallet → sucesso;
     - se `outbounds == null` → carrega via `getFullHistoryTopOutbounds` (full-history);
     - tenta seguir o próximo `counterparty` ainda não visitado, criando novos frames na pilha (backtracking explícito).
3. Se esgotar todas as opções sem hot wallet → `EXHAUSTED_OPTIONS` ou `NO_OUTBOUND` com o último path encontrado.

Durante o processo:

- Cada transição `fromAddress → toAddress` gera uma ou mais `FlowGraphEdge` (várias transfers agrupadas por par de carteiras são registradas como edges múltiplas).
- Cada hop real gera um `FlowStep` com `WalletTransfer` e enriquecimento de preço USD/imagem.

### 3.4. Branching avançado na criação de casos

Quando o modo **avançado** é usado na criação de casos (`mode: 'advanced'` no `POST /cases`), há um segundo nível de lógica em `CreateCaseUseCase`:

1. Para cada seed:
   - roda um rastreio full-history principal (`flowResult`).
2. Se `flowResult.success`:
   - para cada hop do caminho principal (cada `fromAddress → toAddress`):
     - obtém `OUTBOUNDS_LIMIT = 100` outbounds para `fromAddress` via `getTopOutboundsForWallet` (usa o full-history por baixo);
     - escolhe **no máximo 1 destino alternativo** (`BRANCH_CANDIDATES_PER_WALLET = 1`) diferente do `toAddress` principal;
     - constrói um prefixo de steps/edges (`buildPrefixSteps`) de `from` até `nextTo`;
     - roda um novo rastreio full-history a partir de `nextTo` com limite de **10 hops totais** (`MAX_BRANCH_HOPS`),
       - corta o branch se exceder o limite;
       - só mantém o flow extra se:
         - encontrar hot wallet dentro do limite **ou**
         - o caminho tocar novamente uma carteira do caminho principal.
3. Cada flow (principal ou extra) bem-sucedido vira um `Flow` persistido com:
   - `FlowTransaction` (path principal daquele flow),
   - `FlowEdge` (grafo completo das edges daquele flow),
   - `FlowWallet` (nós com `nickname`, `position`, labels de hot wallet/deposit).

Com isso, no modo avançado:

- 1 seed → **1 flow principal + N flows extras controlados** (um por carteira do caminho principal, no máximo).
- Flows extras que não levam a lugar algum (sem hot wallet e sem reconectar ao caminho principal) são descartados.

### 3.5. Enriquecimento por USD e filtro de poeira

- Antes de priorizar ou registrar steps/edges, o algoritmo:
  - consulta `ITokenPriceProvider` (implementado via Prisma/`Token` hoje, ClickHouse/tokens no futuro) para obter preço USD e imagem do token;
  - ignora qualquer transferência com `amount < 0.01` (em unidades do token);
  - ignora qualquer transferência com `valueUsd < 100` (quando o preço está disponível).

Isso reduz:

- branches inúteis que seguem poeira,
- tempo total de rastreio,
- ruído visual no grafo.

---

## 4. Diferenças práticas entre básico e avançado

### 4.1. Básico

- 1 seed → **1 flow**.
- Usa `getAddressTransfers` (histórico "recente" / limitado) por carteira.
- Não faz branching extra, apenas backtracking simples.
- Mais rápido e previsível.

### 4.2. Avançado

- 1 seed → **1 flow principal + flows extras (branches)**.
- Usa `getAddressTransfersPage` e o helper `getFullHistoryTopOutbounds` para varrer **todo** o histórico relevante por carteira.
- Faz branching controlado a partir do caminho principal (prefixos + limites de 10 hops por branch).
- Mais caro em termos de chamadas / tempo, mas muito mais completo para casos complexos.

---

## 5. Integração futura com o módulo de dados interno

Quando o módulo `Blockchain Data API` estiver conectado ao ClickHouse e alimentado com histórico suficiente:

- `IAddressTransfersFetcher` poderá ser implementado em cima de `/_blockchain/...` e/ou direto em `blockchain_data.transfers`.
- As regras de **filtro por data** (`minTimestamp`) e **filtro por USD** (`MIN_TRANSFER_USD`) passarão a ser feitas em SQL, eliminando a necessidade de percorrer manualmente todas as páginas da Covalent.
- A lógica descrita neste documento (básico + avançado) **não precisa mudar**: só a fonte dos `WalletTransfer[]` é trocada.

