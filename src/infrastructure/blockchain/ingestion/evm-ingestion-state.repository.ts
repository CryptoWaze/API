import { Injectable } from '@nestjs/common';
import { ClickHouseClient } from '../clickhouse/clickhouse.client';

export type IngestionStatus = 'RUNNING' | 'PAUSED' | 'COMPLETED';

export type IngestionState = {
  chain: string;
  startTimestamp: string;
  startBlock: number;
  lastBlockIndexed: number;
  status: IngestionStatus;
};

@Injectable()
export class EvmIngestionStateRepository {
  constructor(private readonly clickhouse: ClickHouseClient) {}

  async ensureTable(): Promise<void> {
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
      SETTINGS index_granularity = 8192;
    `);
  }

  async getState(chain: string): Promise<IngestionState | null> {
    const rows = await this.clickhouse.query<{
      chain: string;
      start_timestamp: string;
      start_block: string;
      last_block_indexed: string;
      status: 'RUNNING' | 'PAUSED' | 'COMPLETED';
    }>(`
      SELECT
        chain,
        toString(start_timestamp) AS start_timestamp,
        toString(start_block) AS start_block,
        toString(last_block_indexed) AS last_block_indexed,
        status
      FROM blockchain_data.ingestion_state
      WHERE chain = '${chain}'
      ORDER BY start_timestamp DESC
      LIMIT 1
    `);

    const row = rows[0];
    if (!row) return null;

    return {
      chain: row.chain,
      startTimestamp: row.start_timestamp,
      startBlock: Number.parseInt(row.start_block, 10),
      lastBlockIndexed: Number.parseInt(row.last_block_indexed, 10),
      status: row.status,
    };
  }

  async upsertState(state: IngestionState): Promise<void> {
    await this.ensureTable();
    await this.clickhouse.exec(`
      INSERT INTO blockchain_data.ingestion_state
        (chain, start_timestamp, start_block, last_block_indexed, status, updated_at)
      VALUES
        (
          '${state.chain}',
          parseDateTime64BestEffort('${state.startTimestamp}', 3, 'UTC'),
          ${state.startBlock},
          ${state.lastBlockIndexed},
          '${state.status}',
          now64(3)
        )
    `);
  }
}

