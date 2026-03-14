import { Test, TestingModule } from '@nestjs/testing';
import { EvmIngestionService } from '../../../../../src/infrastructure/blockchain/ingestion/evm-ingestion.service';
import { AlchemyEvmRpcClient } from '../../../../../src/infrastructure/blockchain/alchemy/alchemy-evm-rpc.client';
import { EvmIngestionStateRepository } from '../../../../../src/infrastructure/blockchain/ingestion/evm-ingestion-state.repository';

describe('EvmIngestionService', () => {
  let service: EvmIngestionService;
  let alchemy: { getBlockNumber: jest.Mock; getBlockWithTransactions: jest.Mock };
  let stateRepo: {
    ensureTable: jest.Mock;
    getState: jest.Mock;
    upsertState: jest.Mock;
  };

  beforeEach(async () => {
    alchemy = {
      getBlockNumber: jest.fn().mockResolvedValue(1000),
      getBlockWithTransactions: jest.fn().mockResolvedValue({ timestamp: '0x5f5e100' }),
    };
    stateRepo = {
      ensureTable: jest.fn().mockResolvedValue(undefined),
      getState: jest.fn(),
      upsertState: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvmIngestionService,
        { provide: AlchemyEvmRpcClient, useValue: alchemy },
        { provide: EvmIngestionStateRepository, useValue: stateRepo },
      ],
    }).compile();

    service = module.get(EvmIngestionService);
  });

  describe('getState', () => {
    it('returns null when state repo returns null', async () => {
      stateRepo.getState.mockResolvedValue(null);

      const result = await service.getState('eth-mainnet');

      expect(result).toBeNull();
    });

    it('returns state from repo', async () => {
      stateRepo.getState.mockResolvedValue({
        chain: 'eth-mainnet',
        startTimestamp: '2024-01-01T00:00:00.000Z',
        startBlock: 100,
        lastBlockIndexed: 200,
        status: 'RUNNING',
      });

      const result = await service.getState('eth-mainnet');

      expect(result?.lastBlockIndexed).toBe(200);
    });
  });

  describe('getNextRange', () => {
    it('returns null when state is PAUSED', async () => {
      stateRepo.getState.mockResolvedValue({
        chain: 'eth-mainnet',
        startTimestamp: '2024-01-01T00:00:00.000Z',
        startBlock: 100,
        lastBlockIndexed: 150,
        status: 'PAUSED',
      });

      const result = await service.getNextRange(
        'eth-mainnet',
        '2024-01-01T00:00:00.000Z',
        50,
      );

      expect(result).toBeNull();
      expect(alchemy.getBlockNumber).not.toHaveBeenCalled();
    });

    it('returns null when no new blocks', async () => {
      stateRepo.getState.mockResolvedValue({
        chain: 'eth-mainnet',
        startTimestamp: '2024-01-01T00:00:00.000Z',
        startBlock: 100,
        lastBlockIndexed: 1000,
        status: 'RUNNING',
      });
      alchemy.getBlockNumber.mockResolvedValue(1000);

      const result = await service.getNextRange(
        'eth-mainnet',
        '2024-01-01T00:00:00.000Z',
        50,
      );

      expect(result).toBeNull();
    });

    it('returns fromBlock and toBlock when new blocks available', async () => {
      stateRepo.getState.mockResolvedValue({
        chain: 'eth-mainnet',
        startTimestamp: '2024-01-01T00:00:00.000Z',
        startBlock: 100,
        lastBlockIndexed: 100,
        status: 'RUNNING',
      });
      alchemy.getBlockNumber.mockResolvedValue(200);

      const result = await service.getNextRange(
        'eth-mainnet',
        '2024-01-01T00:00:00.000Z',
        50,
      );

      expect(result).toEqual({ fromBlock: 101, toBlock: 150 });
    });
  });

  describe('ensureStateForChain', () => {
    it('returns existing state when found', async () => {
      const existing = {
        chain: 'eth-mainnet',
        startTimestamp: '2024-01-01T00:00:00.000Z',
        startBlock: 100,
        lastBlockIndexed: 200,
        status: 'RUNNING',
      };
      stateRepo.getState.mockResolvedValue(existing);

      const result = await service.ensureStateForChain(
        'eth-mainnet',
        '2024-01-01T00:00:00.000Z',
      );

      expect(result).toEqual(existing);
      expect(stateRepo.upsertState).not.toHaveBeenCalled();
    });

    it('creates initial state and upserts when no state', async () => {
      stateRepo.getState.mockResolvedValue(null);
      alchemy.getBlockWithTransactions.mockResolvedValue({ timestamp: '0x5f5e100' });

      const result = await service.ensureStateForChain(
        'eth-mainnet',
        '2024-01-01T00:00:00.000Z',
      );

      expect(result.startBlock).toBeDefined();
      expect(result.lastBlockIndexed).toBe(result.startBlock - 1);
      expect(stateRepo.upsertState).toHaveBeenCalled();
    });
  });

  describe('getBlockRangeForDate', () => {
    it('throws on invalid date format', async () => {
      await expect(
        service.getBlockRangeForDate('eth-mainnet', 'invalid'),
      ).rejects.toThrow(/Invalid dateIso/);
    });
  });
});
