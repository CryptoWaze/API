import { Test, TestingModule } from '@nestjs/testing';
import { TokenPriceProviderService } from '../../../../src/infrastructure/database/token-price-provider.service';
import { ClickHouseClient } from '../../../../src/infrastructure/blockchain/clickhouse/clickhouse.client';

describe('TokenPriceProviderService', () => {
  let service: TokenPriceProviderService;
  let clickhouse: { query: jest.Mock };

  beforeEach(async () => {
    clickhouse = { query: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenPriceProviderService,
        { provide: ClickHouseClient, useValue: clickhouse },
      ],
    }).compile();

    service = module.get(TokenPriceProviderService);
  });

  describe('getPriceInUsd', () => {
    it('returns price when token exists', async () => {
      clickhouse.query.mockResolvedValue([
        { symbol: 'eth', current_price_usd: '2000.5', image_url: null },
      ]);

      const result = await service.getPriceInUsd('ETH');

      expect(result).toBe(2000.5);
    });

    it('returns null when token not found', async () => {
      clickhouse.query.mockResolvedValue([]);

      const result = await service.getPriceInUsd('UNKNOWN');

      expect(result).toBeNull();
    });
  });

  describe('getTokenInfoBatch', () => {
    it('returns map of symbol to TokenInfo', async () => {
      clickhouse.query.mockResolvedValue([
        { symbol: 'eth', current_price_usd: '2000', image_url: 'https://img/eth.png' },
        { symbol: 'usdt', current_price_usd: '1', image_url: null },
      ]);

      const result = await service.getTokenInfoBatch(['ETH', 'USDT']);

      expect(result.get('eth')).toEqual({
        priceUsd: 2000,
        imageUrl: 'https://img/eth.png',
      });
      expect(result.get('usdt')).toEqual({
        priceUsd: 1,
        imageUrl: null,
      });
    });

    it('returns empty map when query throws', async () => {
      clickhouse.query.mockRejectedValue(new Error('Table does not exist'));

      const result = await service.getTokenInfoBatch(['ETH']);

      expect(result).toEqual(new Map());
    });
  });

  describe('getAllTokenInfo', () => {
    it('returns map of all tokens', async () => {
      clickhouse.query.mockResolvedValue([
        { symbol: 'eth', current_price_usd: '2000', image_url: null },
      ]);

      const result = await service.getAllTokenInfo();

      expect(result.get('eth')).toEqual({
        priceUsd: 2000,
        imageUrl: null,
      });
    });

    it('returns empty map when query throws', async () => {
      clickhouse.query.mockRejectedValue(new Error('Connection refused'));

      const result = await service.getAllTokenInfo();

      expect(result).toEqual(new Map());
    });
  });
});
