import { Test, TestingModule } from '@nestjs/testing';
import { EvmIngestionStateRepository } from '../../../../../src/infrastructure/blockchain/ingestion/evm-ingestion-state.repository';
import { ClickHouseClient } from '../../../../../src/infrastructure/blockchain/clickhouse/clickhouse.client';

describe('EvmIngestionStateRepository', () => {
  let repo: EvmIngestionStateRepository;
  let clickhouse: { exec: jest.Mock; query: jest.Mock };

  beforeEach(async () => {
    clickhouse = {
      exec: jest.fn().mockResolvedValue(undefined),
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvmIngestionStateRepository,
        { provide: ClickHouseClient, useValue: clickhouse },
      ],
    }).compile();

    repo = module.get(EvmIngestionStateRepository);
  });

  it('ensureTable calls exec with CREATE TABLE ingestion_state', async () => {
    await repo.ensureTable();

    expect(clickhouse.exec).toHaveBeenCalledWith(
      expect.stringContaining('blockchain_data.ingestion_state'),
    );
    expect(clickhouse.exec).toHaveBeenCalledWith(
      expect.stringContaining('MergeTree'),
    );
  });

  it('getState returns null when no row', async () => {
    clickhouse.query.mockResolvedValue([]);

    const result = await repo.getState('eth-mainnet');

    expect(result).toBeNull();
  });

  it('getState returns mapped state when row exists', async () => {
    clickhouse.query.mockResolvedValue([
      {
        chain: 'eth-mainnet',
        start_timestamp: '2024-01-01 00:00:00',
        start_block: '100',
        last_block_indexed: '200',
        status: 'RUNNING',
      },
    ]);

    const result = await repo.getState('eth-mainnet');

    expect(result).toEqual({
      chain: 'eth-mainnet',
      startTimestamp: '2024-01-01 00:00:00',
      startBlock: 100,
      lastBlockIndexed: 200,
      status: 'RUNNING',
    });
  });

  it('upsertState calls ensureTable and exec with INSERT', async () => {
    await repo.upsertState({
      chain: 'eth-mainnet',
      startTimestamp: '2024-01-01T00:00:00.000Z',
      startBlock: 100,
      lastBlockIndexed: 150,
      status: 'RUNNING',
    });

    expect(clickhouse.exec).toHaveBeenCalled();
    const insertCall = clickhouse.exec.mock.calls.find((c: [string]) =>
      c[0].includes('INSERT INTO'),
    );
    expect(insertCall).toBeDefined();
    expect(insertCall[0]).toContain('eth-mainnet');
    expect(insertCall[0]).toContain('100');
    expect(insertCall[0]).toContain('150');
  });
});
