import { Test, TestingModule } from '@nestjs/testing';
import { EvmSchemaRepository } from '../../../../../src/infrastructure/blockchain/ingestion/evm-schema.repository';
import { ClickHouseClient } from '../../../../../src/infrastructure/blockchain/clickhouse/clickhouse.client';

describe('EvmSchemaRepository', () => {
  let repo: EvmSchemaRepository;
  let clickhouseExec: jest.SpyInstance;

  beforeEach(async () => {
    const exec = jest.fn().mockResolvedValue(undefined);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvmSchemaRepository,
        {
          provide: ClickHouseClient,
          useValue: { exec },
        },
      ],
    }).compile();

    repo = module.get(EvmSchemaRepository);
    clickhouseExec = module.get(ClickHouseClient).exec as jest.Mock;
  });

  it('calls exec with CREATE DATABASE', async () => {
    await repo.ensureTables();
    expect(clickhouseExec).toHaveBeenCalledWith(
      expect.stringContaining('CREATE DATABASE IF NOT EXISTS blockchain_data'),
    );
  });

  it('calls exec with CREATE TABLE for blocks', async () => {
    await repo.ensureTables();
    const blocksCall = clickhouseExec.mock.calls.find((c: [string]) =>
      c[0].includes('blockchain_data.blocks'),
    );
    expect(blocksCall).toBeDefined();
    expect(blocksCall[0]).toContain('block_number');
    expect(blocksCall[0]).toContain('MergeTree');
  });

  it('calls exec with CREATE TABLE for transactions', async () => {
    await repo.ensureTables();
    const txCall = clickhouseExec.mock.calls.find((c: [string]) =>
      c[0].includes('blockchain_data.transactions'),
    );
    expect(txCall).toBeDefined();
    expect(txCall[0]).toContain('timestamp DateTime64');
    expect(txCall[0]).toContain('value_wei');
  });

  it('calls exec with CREATE TABLE for logs', async () => {
    await repo.ensureTables();
    const logsCall = clickhouseExec.mock.calls.find((c: [string]) =>
      c[0].includes('blockchain_data.logs'),
    );
    expect(logsCall).toBeDefined();
    expect(logsCall[0]).toContain('topic1 Nullable');
  });

  it('calls exec with CREATE TABLE for transfers', async () => {
    await repo.ensureTables();
    const transfersCall = clickhouseExec.mock.calls.find((c: [string]) =>
      c[0].includes('blockchain_data.transfers'),
    );
    expect(transfersCall).toBeDefined();
    expect(transfersCall[0]).toContain('idx_address');
  });
});
