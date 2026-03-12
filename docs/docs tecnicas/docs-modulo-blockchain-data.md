# Módulo interno de dados de blockchain (Blockchain Data API)

Este documento descreve o **módulo interno de dados de blockchain**, visto como uma "API externa" pela aplicação, mas implementado como um módulo Nest + ClickHouse dentro do próprio projeto.

Ele é o passo intermediário para substituir, no futuro, a Covalent/GoldRush por uma solução própria sem impactar a lógica de rastreamento.

---

## 1. Objetivo do módulo

- Fornecer uma **camada única de dados de blockchain** para toda a aplicação.
- Expor **endpoints HTTP internos** com contratos estáveis, semelhantes aos da Covalent.
- Ler e escrever dados em um banco analítico **ClickHouse** (`blockchain_data`).
- Permitir que a API principal use esse módulo como se fosse uma API de terceiros (mesma experiência de consumo), mas com:
  - filtros avançados (data, valor USD, protocolo),
  - latência menor,
  - ausência de rate limit externo,
  - caminho claro para trocar a fonte (Covalent hoje, RPC/nós próprios amanhã).

---

## 2. Arquitetura geral

### 2.1. Componentes

- **Banco ClickHouse (local ou VPS)**
  - Database: `blockchain_data`.
  - Tabelas principais:
    - `blocks` – 1 linha por bloco.
    - `transactions` – 1 linha por transação.
    - `logs` – 1 linha por log/evento.
    - `transfers` – visão derivada, 1 linha por movimentação de valor do ponto de vista de uma carteira.
  - Tabelas de catálogo:
    - `chains`, `exchanges`, `hot_wallets`, `tokens`.

- **Módulo NestJS**
  - `BlockchainDataModule` – `src/presentation/blockchain-data/blockchain-data.module.ts`.
  - `BlockchainDataController` – `src/presentation/blockchain-data/blockchain-data.controller.ts`.
  - Tag Swagger: **"Blockchain Data"**.
  - Base path: `/_blockchain`.

- **Produtores de dados (ingestão)** – fase seguinte
  - Scripts/serviços que chamam a **Covalent/GoldRush** e inserem dados no ClickHouse.
  - Futuro: leitores de blocos via RPC/nós próprios.

- **Consumers internos**
  - Implementações de `IAddressTransfersFetcher` e `ITransactionFetcher` que falam com o módulo em vez de ir direto na Covalent.

### 2.2. Fluxo de alto nível

1. Um produtor (por enquanto, integrador Covalent) grava:
   - blocos em `blocks`,
   - transações em `transactions`,
   - eventos em `logs`,
   - e movimentações agregadas em `transfers`.
2. A **Blockchain Data API** expõe endpoints HTTP (ver seção 3) que executam `SELECT` em `transfers` (e, se necessário, em `transactions`/`logs`).
3. A API principal consome esses endpoints por meio de uma implementação das ports (`IAddressTransfersFetcher`, `ITransactionFetcher`).

---

## 3. Endpoints HTTP expostos (MVP)

### 3.1. `GET /_blockchain/:chain/address/:address/transfers`

Controller: `BlockchainDataController.getAddressTransfers`.

Objetivo:

- Fornecer uma lista **paginada de transfers** para um endereço, similar ao `transactions_v3` da Covalent, mas já normalizada no formato "WalletTransfer".

Path params:

- `chain` – slug da chain (`eth`, `bsc`, etc.).
- `address` – endereço da carteira (em lower case, EVM ou outro formato válido da chain).

Query params:

- `fromTimestamp?` – ISO 8601; filtra por timestamp mínimo.
- `toTimestamp?` – ISO 8601; filtra por timestamp máximo.
- `direction?` – `IN` \\ `OUT` \\ `BOTH` (default `BOTH`).
- `minUsd?` – valor mínimo em USD para considerar uma transfer (default `0`).
- `page?` – número da página (default `1`).
- `pageSize?` – tamanho da página (default `100`, máximo recomendado `1000`).
- `order?` – `asc` ou `desc` por `timestamp` (default `desc`).

Resposta esperada (modelo):

```json
{
  "chain": "bsc",
  "address": "0x...",
  "fromTimestamp": "2025-01-01T00:00:00.000Z",
  "toTimestamp": null,
  "direction": "OUT",
  "minUsd": 100,
  "page": 1,
  "pageSize": 100,
  "order": "desc",
  "total": 0,
  "items": [
    {
      "txHash": "0x...",
      "blockNumber": 123456,
      "timestamp": "2025-01-02T03:04:05.000Z",
      "direction": "OUT",
      "counterparty": "0x...",
      "tokenAddress": "0xTOKEN",
      "tokenSymbol": "USDT",
      "amount": "1000.0",
      "amountRaw": "1000000000",
      "amountUsd": "1000.0",
      "eventType": "erc20_transfer",
      "protocol": "pancakeswap",
      "success": true
    }
  ]
}
```

Implementação planejada (interno):

- SELECT principal em `blockchain_data.transfers`:

```sql
SELECT
  tx_hash     AS txHash,
  block_number AS blockNumber,
  timestamp,
  direction,
  counterparty,
  token_address AS tokenAddress,
  token_symbol  AS tokenSymbol,
  amount,
  amount_raw    AS amountRaw,
  amount_usd    AS amountUsd,
  event_type    AS eventType,
  protocol,
  tx_success    AS success
FROM blockchain_data.transfers
WHERE chain = :chain
  AND address = :address
  AND (timestamp >= :fromTimestamp OR :fromTimestamp IS NULL)
  AND (timestamp <= :toTimestamp OR :toTimestamp IS NULL)
  AND (
    amount_usd >= :minUsd
    OR amount_usd IS NULL -- tokens sem preço ainda
  )
ORDER BY timestamp :order
LIMIT :pageSize OFFSET (:page - 1) * :pageSize;
```

- `total` pode ser obtido com um `COUNT()` separado ou estimado.

### 3.2. `GET /_blockchain/:chain/address/:address/top-outbounds/full-history`

Controller: `BlockchainDataController.getTopOutboundsFullHistory`.

Objetivo:

- Fornecer as **maiores transfers de saída em USD** de uma carteira ao longo de todo o histórico disponível (ou desde um `fromTimestamp`), equivalente ao que hoje o rastreador calcula com a Covalent.

Path params:

- `chain`, `address` – mesmos significados do endpoint anterior.

Query params:

- `limit` – obrigatório; número máximo de transfers a retornar.
- `fromTimestamp?` – filtra transfers com `timestamp >= fromTimestamp`.
- `minUsd?` – valor mínimo em USD (default 100, seguindo a regra atual do rastreador).

Resposta esperada (modelo):

```json
{
  "chain": "bsc",
  "address": "0x...",
  "fromTimestamp": "2025-01-01T00:00:00.000Z",
  "minUsd": 100,
  "limit": 100,
  "items": [
    {
      "txHash": "0x...",
      "blockNumber": 123456,
      "timestamp": "2025-01-02T03:04:05.000Z",
      "direction": "OUT",
      "counterparty": "0xDEST",
      "tokenAddress": "0xTOKEN",
      "tokenSymbol": "USDT",
      "amount": "5000.0",
      "amountRaw": "5000000000",
      "amountUsd": "5000.0"
    }
  ]
}
```

Implementação planejada (interno):

- SELECT em `transfers` limitado a `direction = 'OUT'`:

```sql
SELECT
  tx_hash      AS txHash,
  block_number AS blockNumber,
  timestamp,
  direction,
  counterparty,
  token_address AS tokenAddress,
  token_symbol  AS tokenSymbol,
  amount,
  amount_raw    AS amountRaw,
  amount_usd    AS amountUsd
FROM blockchain_data.transfers
WHERE chain = :chain
  AND address = :address
  AND direction = 'OUT'
  AND (timestamp >= :fromTimestamp OR :fromTimestamp IS NULL)
  AND amount_usd >= :minUsd
ORDER BY amount_usd DESC
LIMIT :limit;
```

Esse endpoint será o substituto interno para a lógica de `getFullHistoryTopOutbounds` usada pelo `FollowFlowToExchangeFullHistoryUseCase`.

---

## 4. Catálogos: chains, exchanges, hot wallets, tokens

As tabelas de catálogo em `blockchain_data` são espelhos (ou futuras fontes de verdade) das entidades que hoje vivem no Postgres.

### 4.1. `chains`

- Alinhada ao modelo Prisma `Chain` (id, slug, name, iconUrl).
- Colunas principais:
  - `slug` (chave lógica, ex.: `eth`, `bsc`).
  - `name`.
  - `chain_id` (opcional: 1, 56, etc.).
  - `icon_url`.
  - `created_at`, `updated_at`.

### 4.2. `exchanges`

- Parecido com o modelo Prisma `Exchange`.
- Colunas principais:
  - `slug`, `name`, `icon_url`.
  - `created_at`, `updated_at`.

### 4.3. `hot_wallets`

- Espelha `HotWallet` (Postgres), mas usa `exchange_slug` e `chain_slug` para facilitar joins com `chains` e `exchanges` dentro do ClickHouse.
- Colunas principais:
  - `id` (mesmo id do Prisma, se desejado).
  - `exchange_slug`, `chain_slug`.
  - `address`.
  - `label` ("Hot Wallet", "Deposit Address").
  - `is_active`.
  - `created_at`, `updated_at`.

### 4.4. `tokens`

- Inspirada no modelo `Token` (Postgres) e nos dados do CoinGecko.
- Colunas principais:
  - `symbol`, `contract_address`, `chain_slug`.
  - `name`, `decimals`.
  - `image_url`.
  - `current_price_usd`, `market_cap`, `market_cap_rank`, `total_volume`.
  - `last_updated_at`, `created_at`, `updated_at`.

Cronjob planejado:

- O cron de tokens (CoinGecko), que hoje grava em Postgres, passará a **escrever também ou principalmente em `blockchain_data.tokens`**.
- Isso alimenta tanto o rastreador (via `ITokenPriceProvider`) quanto análises futuras no módulo de dados.

---

## 5. Evolução futura

Com esse módulo:

- A API principal continua falando com uma "API externa" (HTTP + Swagger), mas que agora é interna e pode ser alimentada por qualquer fonte.
- Quando houver orçamento, é possível:
  - passar a alimentar o ClickHouse via RPC/nós próprios em vez de Covalent,
  - expandir histórico (mais meses/anos, mais chains),
  - reaproveitar a mesma **Blockchain Data API** sem mudar o código de caso/fluxo.

A transição Covalent → módulo interno → nós próprios fica, assim, organizada em camadas, sem quebrar o contrato que a lógica de negócio enxerga.

