# API principal – Consumo de dados de blockchain

Este documento descreve, em nível técnico, **como a API principal consome dados de blockchain**, quais portas (interfaces) existem, como a Covalent é usada hoje e como tudo foi preparado para, no futuro, trocar a Covalent pelo módulo interno de dados (ClickHouse / Blockchain Data API).

---

## 1. Camada de portas (interfaces de dados)

Toda leitura de dados on-chain na API principal passa por **interfaces da camada de aplicação** (ports), nunca fala direto com HTTP da Covalent.

### 1.1. `ITransactionFetcher`

Arquivo: `src/application/ports/transaction-fetcher.port.ts`

Responsabilidade:

- Buscar uma transação específica por hash, já com todas as transfers relevantes agregadas.

Assinatura simplificada:

```ts
export type TransactionWithTransfers = {
  fromAddress: string;
  toAddress: string;
  blockSignedAt: string; // ISO 8601
  transfers: Transfer[]; // native + tokens normalizados
};

export type ITransactionFetcher = {
  getTransactionWithTransfers(
    chain: string,
    txHash: string,
  ): Promise<TransactionWithTransfers | null>;
};
```

Uso principal:

- `POST /transactions/resolve` (resolver hash → carteira inicial + transfers por chain).
- `FlowToExchangeFromTransactionUseCase` (quando o fluxo começa por hash).
- `CreateCaseUseCase` (cada seed `{ txHash, reportedLossAmount }` é resolvida via esta porta).

### 1.2. `IAddressTransfersFetcher`

Arquivo: `src/application/ports/address-transfers-fetcher.port.ts`

Responsabilidade:

- Fornecer **histórico de transfers por endereço**, no formato interno `WalletTransfer`.

Assinatura simplificada:

```ts
export type IAddressTransfersFetcher = {
  getAddressTransfers(
    chain: string,
    address: string,
  ): Promise<WalletTransfer[]>;

  getAddressTransfersPage(
    chain: string,
    address: string,
    page: number,
  ): Promise<WalletTransfer[]>;
};
```

Onde é usada:

- `FollowFlowToExchangeUseCase` (rastreio básico).
- `FollowFlowToExchangeFullHistoryUseCase` (rastreio avançado / backtracking).
- `GetAddressTopTransfersUseCase`.
- `GetAddressTopTransfersPaginatedUseCase`.
- `GetAddressTopTransfersHistoryUseCase`.

Tipos principais envolvidos (arquivo `src/application/types/transfer.types.ts`):

```ts
export type WalletTransfer = {
  type: 'native' | 'erc20';
  symbol: string;
  from: string;
  to: string;
  rawAmount: string;   // BigInt em string
  amount: number;      // normalizado por decimals
  timestamp: string;   // ISO 8601
  txHash: string;
  contract?: string;   // token address
  direction: 'IN' | 'OUT';
  counterparty: string;
};
```

A camada de caso/fluxo **só conhece esses tipos internos**, nunca a estrutura JSON da Covalent.

---

## 2. Implementação atual: CovalentApiService

Arquivo: `src/infrastructure/covalent/covalent-api.service.ts`

### 2.1. Registro no Nest

Arquivo: `src/infrastructure/covalent/covalent.module.ts`

```ts
@Module({
  providers: [
    CovalentApiService,
    { provide: TRANSACTION_FETCHER, useExisting: CovalentApiService },
    { provide: ADDRESS_TRANSFERS_FETCHER, useExisting: CovalentApiService },
  ],
  exports: [TRANSACTION_FETCHER, ADDRESS_TRANSFERS_FETCHER],
})
export class CovalentModule {}
```

Módulos como `AddressesModule` e `CasesModule` apenas injetam as interfaces (`ITransactionFetcher`, `IAddressTransfersFetcher`); quem está por trás (Covalent hoje, módulo interno amanhã) é decidido aqui.

### 2.2. Endpoints da Covalent usados hoje

#### a) Transação por hash (`transaction_v2`)

- Caminho: `/v1/{chainName}/transaction_v2/{txHash}/`.
- Implementação:

```ts
async getTransactionWithTransfers(chain: string, txHash: string) {
  const path = `${chain}/transaction_v2/${txHash}`;
  const data = (await this.fetchJson(path)) as { data?: { items?: CovalentItem[] } };
  const items = data.data?.items ?? [];
  if (items.length === 0) return null;

  const first = items[0];
  const transfers = mapCovalentResponseToTransfers(items, chain);

  return {
    fromAddress: first.from_address ?? '',
    toAddress: first.to_address ?? '',
    blockSignedAt: first.block_signed_at ?? '',
    transfers,
  };
}
```

- Conversão:
  - `mapCovalentResponseToTransfers` normaliza todos os eventos (native + ERC20) em `Transfer[]`.

#### b) Histórico de transações por endereço (`transactions_v3` – recente)

- Caminho: `/v1/{chainName}/address/{address}/transactions_v3/`.
- Parâmetros principais:
  - `block-signed-at-asc=false` para ordenar do mais novo → mais antigo.
- Implementação:

```ts
async getAddressTransfers(chain: string, address: string): Promise<WalletTransfer[]> {
  const path = `${chain}/address/${address}/transactions_v3`;
  const data = (await this.fetchJson(path, {
    'block-signed-at-asc': 'false',
  })) as { data?: { items?: CovalentItem[] } };
  const items = data.data?.items ?? [];
  return mapCovalentAddressTransactionsToWalletTransfers(items, chain, address);
}
```

- Uso:
  - top N transfers por endereço (endpoints `/addresses/.../top-transfers`).
  - rastreio básico (`FollowFlowToExchangeUseCase`).

#### c) Histórico paginado (`transactions_v3/page/{page}`)

- Caminho: `/v1/{chainName}/address/{address}/transactions_v3/page/{page}/`.
- Ordenação por página segue o padrão da Covalent (paginação estável).
- Implementação:

```ts
async getAddressTransfersPage(
  chain: string,
  address: string,
  page: number,
): Promise<WalletTransfer[]> {
  const path = `${chain}/address/${address}/transactions_v3/page/${page}`;
  const data = (await this.fetchJson(path)) as {
    items?: CovalentItem[];
    data?: { items?: CovalentItem[] };
  };
  const items = Array.isArray(data.items) ? data.items : data.data?.items ?? [];
  return mapCovalentAddressTransactionsToWalletTransfers(items, chain, address);
}
```

- Uso:
  - `FollowFlowToExchangeFullHistoryUseCase` percorre página por página para montar **todo** o histórico relevante:
    - aplica `minTimestamp` manualmente (Covalent não filtra por data);
    - respeita limites como `MAX_PAGES_PER_WALLET`.

### 2.3. Throttling e rate limit

- Constantes:
  - `THROTTLE_MS = 500` – tempo mínimo entre requisições.
  - `RATE_LIMIT_RETRY_DELAY_MS = 15000` (15s).
  - `RATE_LIMIT_MAX_RETRIES = 3`.

- A cada requisição HTTP (`fetchJson`):
  - espera pelo menos `THROTTLE_MS` desde a última chamada;
  - se a resposta vier com `429 Too Many Requests`, espera `RATE_LIMIT_RETRY_DELAY_MS` e tenta de novo até `RATE_LIMIT_MAX_RETRIES`.

Esse comportamento é importante para dimensionar o **custo atual** de um rastreio avançado (3h em alguns casos) e serve de base para sabermos o quanto o módulo interno pode melhorar.

---

## 3. Como os use cases consomem essas portas

### 3.1. Rastreio básico – `FollowFlowToExchangeUseCase`

- Entrada: `chain`, `address`, `maxWallets`, etc.
- Passos principais:
  1. Chama `addressTransfersFetcher.getAddressTransfers(chain, address)`.
  2. Filtra transfers de saída (`direction === 'OUT'`).
  3. Ordena/prioriza as saídas (por valor, depois por USD).
  4. Escolhe próximo endereço (`counterparty`) e repete.

O use case nunca conhece detalhes de paginação ou JSON da Covalent; ele só trabalha com `WalletTransfer`.

### 3.2. Rastreio avançado – `FollowFlowToExchangeFullHistoryUseCase`

- Entrada: `chain`, `address`, `traceId`, `minTimestamp`.
- Passos principais (simplificado):
  1. Para cada carteira visitada, usa `getAddressTransfersPage` para varrer páginas até:
     - alcançar o `minTimestamp` (timestamp da seed),
     - ou chegar nos limites globais (`MAX_PAGES_PER_WALLET`, `MAX_WALLETS`).
  2. Constrói `FlowStep[]` e `FlowGraphEdge[]` para montar:
     - o path principal,
     - o grafo completo de explorações.
  3. Usa `IHotWalletChecker` para identificar quando uma carteira é hot wallet registrada.
  4. Usa `ITokenPriceProvider` para enriquecer cada step com preço USD.

Hoje, o gargalo de performance está justamente na combinação:

- falta de filtro por data na Covalent,
- necessidade de percorrer **todas** as páginas para achar transfers recentes,
- rate limit externo.

Isso define claramente o que o **módulo de dados interno** precisa responder de forma mais eficiente.

---

## 4. Preparação para trocar a Covalent

Graças às ports e aos tipos internos:

- Podemos criar uma nova implementação de `IAddressTransfersFetcher` e `ITransactionFetcher` (ex.: `BlockchainDataFetcherService`) que:
  - em vez de chamar a Covalent, chama a **Blockchain Data API interna** (`/_blockchain/...`),
  - ou lê direto do ClickHouse.
- A lógica de rastreamento (`FollowFlowToExchange*`), de criação de casos, etc., **não precisa mudar**.

Em outras palavras:

- **Hoje**: API principal → ports → `CovalentApiService` → Covalent.
- **Amanhã**: API principal → ports → `BlockchainDataFetcherService` → módulo interno (ClickHouse).

O contrato visto pelo domínio (ports + `WalletTransfer` + `TransactionWithTransfers`) permanece exatamente o mesmo.

