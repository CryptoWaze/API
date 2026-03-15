import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainIngestionController } from '../../../../src/presentation/blockchain-data/blockchain-ingestion.controller';
import { EvmBlockIngestionService } from '../../../../src/infrastructure/blockchain/ingestion/evm-block-ingestion.service';
import { CatalogSyncService } from '../../../../src/infrastructure/blockchain/ingestion/catalog-sync.service';

describe('BlockchainIngestionController', () => {
  let controller: BlockchainIngestionController;
  let evmBlockIngestionService: jest.Mocked<EvmBlockIngestionService>;
  let catalogSync: jest.Mocked<CatalogSyncService>;

  beforeEach(async () => {
    evmBlockIngestionService = { runOnce: jest.fn() };
    catalogSync = { syncAll: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainIngestionController],
      providers: [
        { provide: EvmBlockIngestionService, useValue: evmBlockIngestionService },
        { provide: CatalogSyncService, useValue: catalogSync },
      ],
    }).compile();

    controller = module.get(BlockchainIngestionController);
  });

  it('catalogSync delegates to catalogSyncService.syncAll', async () => {
    catalogSync.syncAll.mockResolvedValue({
      exchanges: 2,
      hotWallets: 10,
      tokens: 100,
    });

    const result = await controller.catalogSync();

    expect(result).toEqual({ exchanges: 2, hotWallets: 10, tokens: 100 });
    expect(catalogSync.syncAll).toHaveBeenCalled();
  });

  it('runOnce delegates to evmBlockIngestionService with default maxBlocksPerRun', async () => {
    evmBlockIngestionService.runOnce.mockResolvedValue({
      fromBlock: 1,
      toBlock: 100,
      processedBlocks: 100,
      processedTransactions: 500,
      processedLogs: 1000,
    });

    const result = await controller.runOnce({
      chain: 'eth-mainnet',
      startTimestampIso: '2025-01-01T00:00:00.000Z',
    });

    expect(evmBlockIngestionService.runOnce).toHaveBeenCalledWith({
      chain: 'eth-mainnet',
      startTimestampIso: '2025-01-01T00:00:00.000Z',
      maxBlocksPerRun: 100,
    });
    expect(result.processedBlocks).toBe(100);
  });

  it('runOnce passes maxBlocksPerRun from body', async () => {
    evmBlockIngestionService.runOnce.mockResolvedValue({
      fromBlock: 1,
      toBlock: 50,
      processedBlocks: 50,
      processedTransactions: 200,
      processedLogs: 400,
    });

    await controller.runOnce({
      chain: 'eth-mainnet',
      startTimestampIso: '2025-01-01T00:00:00.000Z',
      maxBlocksPerRun: 50,
    });

    expect(evmBlockIngestionService.runOnce).toHaveBeenCalledWith({
      chain: 'eth-mainnet',
      startTimestampIso: '2025-01-01T00:00:00.000Z',
      maxBlocksPerRun: 50,
    });
  });
});
