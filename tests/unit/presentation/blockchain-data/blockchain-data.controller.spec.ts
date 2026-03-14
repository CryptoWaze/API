import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainDataController } from '../../../../src/presentation/blockchain-data/blockchain-data.controller';
import { BlockchainDataQueryService } from '../../../../src/infrastructure/blockchain/blockchain-data-query.service';

describe('BlockchainDataController', () => {
  let controller: BlockchainDataController;
  let queryService: jest.Mocked<BlockchainDataQueryService>;

  beforeEach(async () => {
    queryService = {
      getHotWalletsByExchange: jest.fn(),
      getAddressSummary: jest.fn(),
      getAddressTransactions: jest.fn(),
      getAddressTransactionCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainDataController],
      providers: [
        { provide: BlockchainDataQueryService, useValue: queryService },
      ],
    }).compile();

    controller = module.get(BlockchainDataController);
  });

  describe('getExchangeHotWallets', () => {
    it('returns mapped items and total', async () => {
      queryService.getHotWalletsByExchange.mockResolvedValue([
        {
          id: 'hw1',
          exchange_slug: 'binance',
          chain_slug: 'eth',
          address: '0xabc',
          label: 'Hot',
          is_active: '1',
        },
      ]);

      const result = await controller.getExchangeHotWallets('binance', undefined);

      expect(result.exchangeSlug).toBe('binance');
      expect(result.chain).toBeNull();
      expect(result.total).toBe(1);
      expect(result.items[0].isActive).toBe(true);
      expect(queryService.getHotWalletsByExchange).toHaveBeenCalledWith(
        'binance',
        undefined,
      );
    });

    it('passes chain query when provided', async () => {
      queryService.getHotWalletsByExchange.mockResolvedValue([]);

      await controller.getExchangeHotWallets('binance', '  eth  ');

      expect(queryService.getHotWalletsByExchange).toHaveBeenCalledWith(
        'binance',
        '  eth  ',
      );
    });
  });

  describe('getAddressSummary', () => {
    it('delegates to queryService', async () => {
      queryService.getAddressSummary.mockResolvedValue({
        chain: 'eth',
        address: '0x123',
        txCount: 5,
        firstTxAt: '2024-01-01',
        lastTxAt: '2024-01-10',
        balanceWei: null,
      });

      const result = await controller.getAddressSummary('eth', '0x123');

      expect(result.txCount).toBe(5);
      expect(queryService.getAddressSummary).toHaveBeenCalledWith('eth', '0x123');
    });
  });
});
