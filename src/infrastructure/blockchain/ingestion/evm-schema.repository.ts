import { Injectable } from '@nestjs/common';
import { ClickHouseClient } from '../clickhouse/clickhouse.client';

@Injectable()
export class EvmSchemaRepository {
  constructor(private readonly clickhouse: ClickHouseClient) {}

  async ensureTables(): Promise<void> {
    await this.clickhouse.exec(`
      CREATE DATABASE IF NOT EXISTS blockchain_data
    `);

    await this.clickhouse.exec(`
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
      SETTINGS index_granularity = 8192
    `);

    await this.clickhouse.exec(`
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
      SETTINGS index_granularity = 8192
    `);

    await this.clickhouse.exec(`
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
      SETTINGS index_granularity = 8192
    `);

    await this.clickhouse.exec(`
      CREATE TABLE IF NOT EXISTS blockchain_data.chains
      (
          slug String,
          name String,
          chain_id Nullable(UInt32),
          icon_url Nullable(String),
          created_at DateTime64(3, 'UTC'),
          updated_at DateTime64(3, 'UTC')
      )
      ENGINE = MergeTree
      ORDER BY (slug)
      SETTINGS index_granularity = 8192
    `);

    await this.clickhouse.exec(`
      CREATE TABLE IF NOT EXISTS blockchain_data.exchanges
      (
          slug String,
          name String,
          icon_url Nullable(String),
          created_at DateTime64(3, 'UTC'),
          updated_at DateTime64(3, 'UTC')
      )
      ENGINE = MergeTree
      ORDER BY (slug)
      SETTINGS index_granularity = 8192
    `);

    await this.clickhouse.exec(`
      CREATE TABLE IF NOT EXISTS blockchain_data.hot_wallets
      (
          id String,
          exchange_slug String,
          chain_slug String,
          address String,
          label Nullable(String),
          is_active UInt8,
          created_at DateTime64(3, 'UTC'),
          updated_at DateTime64(3, 'UTC')
      )
      ENGINE = MergeTree
      ORDER BY (chain_slug, address)
      SETTINGS index_granularity = 8192
    `);

    await this.clickhouse.exec(`
      CREATE TABLE IF NOT EXISTS blockchain_data.tokens
      (
          symbol String,
          contract_address Nullable(String),
          chain_slug String,
          name String,
          decimals UInt8,
          image_url Nullable(String),
          current_price_usd Nullable(Decimal(38, 8)),
          market_cap Nullable(Decimal(38, 8)),
          market_cap_rank Nullable(Int32),
          total_volume Nullable(Decimal(38, 8)),
          last_updated_at Nullable(DateTime64(3, 'UTC')),
          created_at DateTime64(3, 'UTC'),
          updated_at DateTime64(3, 'UTC')
      )
      ENGINE = MergeTree
      ORDER BY (chain_slug, symbol)
      SETTINGS index_granularity = 8192
    `);

    await this.clickhouse.exec(`
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
      SETTINGS index_granularity = 8192
    `);

    await this.clickhouse.exec(`
      CREATE TABLE IF NOT EXISTS blockchain_data.transfers
      (
          chain String,
          address String,
          tx_hash String,
          block_number UInt64,
          timestamp DateTime64(3, 'UTC'),
          direction LowCardinality(String),
          counterparty String,
          token_address Nullable(String),
          token_symbol String,
          amount Decimal(38, 18),
          amount_raw String,
          amount_usd Nullable(Decimal(38, 8)),
          event_type String,
          protocol Nullable(String),
          tx_success UInt8,
          INDEX idx_address address TYPE bloom_filter GRANULARITY 1
      )
      ENGINE = MergeTree
      PARTITION BY (chain, toYYYYMM(timestamp))
      ORDER BY (chain, address, timestamp)
      SETTINGS index_granularity = 8192
    `);
  }
}
