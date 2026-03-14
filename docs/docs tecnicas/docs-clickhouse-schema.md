    # Schema do banco ClickHouse (blockchain_data)

    Este documento descreve **exatamente** como o banco ClickHouse está modelado no projeto, incluindo database, tabelas, colunas, tipos e propósito de cada entidade.

    **Fonte da verdade:** o schema é definido **apenas** em `EvmSchemaRepository.ensureTables()` (`src/infrastructure/blockchain/ingestion/evm-schema.repository.ts`). Não existe script SQL separado. Para criar o banco na Netcup (ou em qualquer ambiente), execute uma vez: `npm run clickhouse:schema`.

    ---

    ## 1. Visão geral

    - **Database:** `blockchain_data`
    - **Engine:** MergeTree (padrão para tabelas analíticas)
    - **Uso:** Armazenar dados de blockchain para consultas analíticas e substituição futura da Covalent

    ---

    ## 2. Tabelas implementadas

    ### 2.1. `blockchain_data.blocks`

    Armazena metadados de blocos EVM. Uma linha por bloco.

    | Coluna          | Tipo                | Descrição                                      |
    |-----------------|---------------------|------------------------------------------------|
    | `chain`         | String              | Slug da chain (eth, bsc, polygon, base)        |
    | `block_number`  | UInt64              | Número do bloco                                |
    | `block_hash`    | String              | Hash do bloco (0x...)                          |
    | `parent_hash`   | String              | Hash do bloco pai                              |
    | `timestamp`     | DateTime64(3, 'UTC')| Timestamp do bloco                             |
    | `tx_count`      | UInt32              | Quantidade de transações no bloco              |
    | `source`        | String              | Origem dos dados (ex.: alchemy)                |
    | `ingested_at`   | DateTime64(3, 'UTC')| Momento em que foi ingerido                    |
    | `complete`      | UInt8               | 1 = bloco completo, 0 = parcial                |

    **Inserção:** `EvmBlockIngestionService` (Alchemy → ClickHouse).

    **DDL (criado por `EvmSchemaRepository.ensureTables()`):**

    ```sql
    CREATE TABLE IF NOT EXISTS blockchain_data.blocks
    (
        chain String,
        block_number UInt64,
        block_hash String,
        parent_hash String,
        timestamp DateTime64(3, 'UTC'),
        tx_count UInt32,
        source String,
        ingested_at DateTime64(3, 'UTC'),
        complete UInt8
    )
    ENGINE = MergeTree
    PARTITION BY toYYYYMM(timestamp)
    ORDER BY (chain, block_number)
    SETTINGS index_granularity = 8192;
    ```

    ---

    ### 2.2. `blockchain_data.transactions`

    Armazena transações EVM. Uma linha por transação.

    | Coluna          | Tipo     | Descrição                                      |
    |-----------------|----------|------------------------------------------------|
    | `chain`         | String   | Slug da chain                                  |
    | `tx_hash`       | String   | Hash da transação (0x...)                      |
    | `block_number`  | UInt64   | Número do bloco                                |
    | `from_address`  | String   | Endereço de origem                             |
    | `to_address`    | String   | Endereço de destino (vazio para contract creation) |
    | `nonce`         | UInt64   | Nonce da conta                                 |
    | `value_wei`     | UInt256  | Valor em wei (transferência nativa)            |
    | `gas_used`      | UInt64   | Gas consumido na execução                      |
    | `gas_price_wei` | UInt64   | Preço do gas em wei                            |
    | `timestamp`     | DateTime64(3, 'UTC') | Timestamp do bloco (para particionamento) |

    **Inserção:** `EvmBlockIngestionService` (extrai de `eth_getBlockByNumber` com `fullTransactions: true`; timestamp vem do bloco).

    **Particionamento:** `(chain, toYYYYMM(timestamp))` – permite queries por data sem varrer meses inteiros.

    **DDL (criado automaticamente por `EvmSchemaRepository.ensureTables()`):**

    ```sql
    CREATE TABLE IF NOT EXISTS blockchain_data.transactions
    (
        chain String,
        tx_hash String,
        block_number UInt64,
        from_address String,
        to_address String,
        nonce UInt64,
        value_wei UInt256,
        gas_used UInt64,
        gas_price_wei UInt64,
        timestamp DateTime64(3, 'UTC')
    )
    ENGINE = MergeTree
    PARTITION BY (chain, toYYYYMM(timestamp))
    ORDER BY (chain, block_number, tx_hash)
    SETTINGS index_granularity = 8192;
    ```

    ---

    ### 2.3. `blockchain_data.ingestion_state`

    Controla o checkpoint de ingestão por chain. Permite pausar, retomar e saber até qual bloco foi indexado.

    | Coluna              | Tipo                | Descrição                                      |
    |---------------------|---------------------|------------------------------------------------|
    | `chain`             | String              | Slug da chain                                  |
    | `start_timestamp`   | DateTime64(3, 'UTC')| Timestamp de início da ingestão                |
    | `start_block`       | UInt64              | Bloco inicial (calculado por binary search)    |
    | `last_block_indexed`| UInt64              | Último bloco indexado com sucesso              |
    | `status`            | Enum8                | RUNNING=1, PAUSED=2, COMPLETED=3               |
    | `updated_at`        | DateTime64(3, 'UTC')| Última atualização                             |

    **Engine:** MergeTree  
    **Partition:** `chain`  
    **Order:** `(chain, start_timestamp)`

    **DDL (criado automaticamente por `EvmSchemaRepository.ensureTables()`):**

    ```sql
    CREATE TABLE IF NOT EXISTS blockchain_data.ingestion_state
    (
        chain String,
        start_timestamp DateTime64(3, 'UTC'),
        start_block UInt64,
        last_block_indexed UInt64,
        status Enum8('RUNNING' = 1, 'PAUSED' = 2, 'COMPLETED' = 3),
        updated_at DateTime64(3, 'UTC')
    )
    ENGINE = MergeTree
    PARTITION BY (chain)
    ORDER BY (chain, start_timestamp)
    SETTINGS index_granularity = 8192;
    ```

    ---

    ## 3. Tabelas implementadas (continuação)

    ### 3.1. `blockchain_data.logs`

    Uma linha por evento/log de contrato (ex.: Transfer ERC20). Fonte: `eth_getTransactionReceipt` via Alchemy.

    | Coluna             | Tipo                | Descrição                                      |
    |--------------------|---------------------|------------------------------------------------|
    | `chain`            | String              | Slug da chain                                  |
    | `tx_hash`          | String              | Hash da transação                              |
    | `block_number`     | UInt64              | Número do bloco                                |
    | `log_index`        | UInt32              | Índice do log na transação                     |
    | `contract_address` | String              | Endereço do contrato                           |
    | `topic0`           | String              | Assinatura do evento (ex.: Transfer)           |
    | `topic1`           | Nullable(String)    | Parâmetro (ex.: from); NULL quando inexistente |
    | `topic2`           | Nullable(String)    | Parâmetro (ex.: to); NULL quando inexistente   |
    | `topic3`           | Nullable(String)    | Parâmetro (ex.: value); NULL quando inexistente |
    | `data`             | String              | Dados adicionais do evento                     |
    | `timestamp`        | DateTime64(3, 'UTC') | Timestamp do bloco                            |

    **Inserção:** `EvmBlockIngestionService` (busca receipts em batch via `eth_getTransactionReceipt`).

    **Particionamento:** `(chain, toYYYYMM(timestamp))`.

    **DDL (criado automaticamente por `EvmSchemaRepository.ensureTables()`):**

    ```sql
    CREATE TABLE IF NOT EXISTS blockchain_data.logs
    (
        chain String,
        tx_hash String,
        block_number UInt64,
        log_index UInt32,
        contract_address String,
        topic0 String,
        topic1 Nullable(String),
        topic2 Nullable(String),
        topic3 Nullable(String),
        data String,
        timestamp DateTime64(3, 'UTC')
    )
    ENGINE = MergeTree
    PARTITION BY (chain, toYYYYMM(timestamp))
    ORDER BY (chain, block_number, tx_hash, log_index)
    SETTINGS index_granularity = 8192;
    ```

    **Filtro em topics:** Eventos com menos de 4 topics têm `topic1`, `topic2` ou `topic3` como `NULL`. Use `WHERE topic1 IS NOT NULL` (e equivalentes) para filtrar logs que possuem o topic.

    ---

    ## 4. Tabelas de catálogo (implementadas)

    Espelhos das entidades do Postgres. Populadas por `CatalogSyncService` via `npm run clickhouse:sync`. Tokens também podem ser atualizados pelo cron Coingecko (quando `TOKEN_UPDATE_CRON_ENABLED=true`).

    ### 4.1. `blockchain_data.chains`

    | Coluna     | Tipo                | Descrição        |
    |------------|---------------------|------------------|
    | slug       | String              | eth, bsc, etc.   |
    | name       | String              | Nome da chain    |
    | chain_id   | Nullable(UInt32)    | ID numérico (1, 56) |
    | icon_url   | Nullable(String)    | URL do ícone     |
    | created_at | DateTime64(3, 'UTC')| |
    | updated_at | DateTime64(3, 'UTC')| |

    **Engine:** MergeTree | **Order:** (slug)

    ### 4.2. `blockchain_data.exchanges`

    | Coluna     | Tipo                | Descrição        |
    |------------|---------------------|------------------|
    | slug       | String              | binance, gate    |
    | name       | String              | Nome da exchange |
    | icon_url   | Nullable(String)    | |
    | created_at | DateTime64(3, 'UTC')| |
    | updated_at | DateTime64(3, 'UTC')| |

    **Engine:** MergeTree | **Order:** (slug)

    ### 4.3. `blockchain_data.hot_wallets`

    | Coluna        | Tipo                | Descrição                    |
    |---------------|---------------------|------------------------------|
    | id            | String              | ID (espelho do Postgres)     |
    | exchange_slug | String              | Slug da exchange             |
    | chain_slug    | String              | Slug da chain                |
    | address       | String              | Endereço da hot wallet       |
    | label         | Nullable(String)    | Hot Wallet, Deposit Address  |
    | is_active     | UInt8               | 1 = ativo                    |
    | created_at    | DateTime64(3, 'UTC')| |
    | updated_at    | DateTime64(3, 'UTC')| |

    **Engine:** MergeTree | **Order:** (chain_slug, address)

    ### 4.4. `blockchain_data.tokens`

    | Coluna            | Tipo                | Descrição                    |
    |-------------------|---------------------|------------------------------|
    | symbol            | String              | BTC, USDT, etc.              |
    | contract_address  | Nullable(String)    | Endereço do contrato         |
    | chain_slug        | String              | Chain do token ('' = global) |
    | name              | String              | Nome completo                |
    | decimals          | UInt8               | Casas decimais               |
    | image_url         | Nullable(String)    | |
    | current_price_usd | Nullable(Decimal(38,8)) | Preço em USD             |
    | market_cap        | Nullable(Decimal(38,8)) | |
    | market_cap_rank   | Nullable(Int32)     | |
    | total_volume      | Nullable(Decimal(38,8)) | |
    | last_updated_at   | Nullable(DateTime64(3,'UTC')) | |
    | created_at        | DateTime64(3, 'UTC')| |
    | updated_at        | DateTime64(3, 'UTC')| |

    **Engine:** MergeTree | **Order:** (chain_slug, symbol)

    ---

    ## 5. Tabela transfers (schema criado, população pendente)

    Visão derivada: uma linha por movimentação de valor do ponto de vista de uma carteira (IN/OUT). Será usada pelos endpoints `/_blockchain/:chain/address/:address/transfers` e `top-outbounds/full-history`.

    | Coluna         | Tipo                | Descrição                                      |
    |----------------|---------------------|------------------------------------------------|
    | chain          | String              | Slug da chain                                  |
    | address        | String              | Carteira em foco                               |
    | tx_hash        | String              | Hash da transação                              |
    | block_number   | UInt64              | Número do bloco                                |
    | timestamp      | DateTime64(3, 'UTC')| Timestamp                                      |
    | direction      | LowCardinality(String) | IN ou OUT                                   |
    | counterparty   | String              | Outra ponta da transferência                    |
    | token_address  | Nullable(String)    | Endereço do contrato do token (null = nativo)  |
    | token_symbol   | String              | Símbolo (ETH, USDT, etc.)                       |
    | amount         | Decimal(38, 18)     | Valor normalizado                              |
    | amount_raw     | String              | Valor em unidades mínimas                      |
    | amount_usd     | Nullable(Decimal(38, 8)) | Valor em USD (se disponível)              |
    | event_type     | String              | Ex.: erc20_transfer, native_transfer           |
    | protocol       | Nullable(String)    | Protocolo (pancakeswap, etc.)                   |
    | tx_success     | UInt8               | 1 = sucesso, 0 = revertido                     |

    **Índice:** `INDEX idx_address address TYPE bloom_filter GRANULARITY 1` – otimiza queries `WHERE address = ? AND chain = ?`.

    **Status:** Tabela criada por `EvmSchemaRepository.ensureTables()`. População (derivação de transactions + logs) ainda não implementada.

    ---

    ## 6. Comandos de setup e ingestão

    Fluxo modular em 3 passos:

    | Comando | Descrição |
    |---------|-----------|
    | `npm run clickhouse:schema` | Cria database e todas as tabelas no ClickHouse |
    | `npm run clickhouse:sync` | Sincroniza exchanges, hot_wallets e tokens do Postgres (nessa ordem) |
    | `npm run clickhouse:ingest` | Executa uma rodada de ingestão blockchain (Alchemy → ClickHouse) |
    | `npm run clickhouse:ingest-day` | Ingesta todos os blocos de um dia (para job diário). Variáveis: `INGEST_CHAIN`, `INGEST_DATE` (YYYY-MM-DD; default: ontem). |

    **Variáveis para ingestão:** `INGEST_CHAIN` (default: eth-mainnet), `INGEST_START_TIMESTAMP`, `INGEST_MAX_BLOCKS`.

    **Job diário (cron):** Roda às 01:00 UTC e ingesta os blocos do dia anterior em todas as chains (eth, polygon, base, bsc). Só executa se `DAILY_INGESTION_JOB_ENABLED=true`. Usar após o backfill inicial estar completo.

    ---

    ## 7. Resumo do estado atual

    | Tabela           | Status      | Fonte de dados | Consumidores                    |
    |------------------|-------------|----------------|---------------------------------|
    | blocks           | Implementada| Alchemy RPC    | EvmBlockIngestionService        |
    | transactions     | Implementada| Alchemy RPC    | EvmBlockIngestionService        |
    | logs             | Implementada| Alchemy RPC (receipts) | EvmBlockIngestionService  |
    | ingestion_state  | Implementada| Código         | EvmIngestionService             |
    | chains           | Implementada| Postgres sync  | CatalogSyncService              |
    | exchanges        | Implementada| Postgres sync  | CatalogSyncService              |
    | hot_wallets      | Implementada| Postgres sync  | CatalogSyncService              |
    | tokens           | Implementada| Postgres sync + Cron Coingecko | CatalogSyncService, TokenUpdateCronService |
    | transfers        | Schema criado | -            | População pendente             |

    ---

    ## 8. Configuração

    Variáveis de ambiente:

    | Variável           | Descrição                                      |
    |--------------------|------------------------------------------------|
    | CLICKHOUSE_URL     | URL base (ex.: `http://localhost:8123`)       |
    | CLICKHOUSE_USER    | Usuário (opcional)                             |
    | CLICKHOUSE_PASSWORD| Senha (opcional)                               |
    | DATABASE_URL       | Postgres (para `clickhouse:sync`)              |
    | ALCHEMY_API_KEY    | Para ingestão blockchain                       |
    | DAILY_INGESTION_JOB_ENABLED | Se `true`, o cron diário (01:00 UTC) ingesta os blocos do dia anterior. Ativar só após o backfill. |

    O database e as tabelas são criados automaticamente por `npm run clickhouse:schema`.
