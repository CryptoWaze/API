import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainDataQueryService } from '../../../../src/infrastructure/blockchain/blockchain-data-query.service';
import { ClickHouseClient } from '../../../../src/infrastructure/blockchain/clickhouse/clickhouse.client';

describe('BlockchainDataQueryService', () => {
  let service: BlockchainDataQueryService;
  let clickhouse: { query: jest.Mock };

  beforeEach(async () => {
    clickhouse = { query: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockchainDataQueryService,
        { provide: ClickHouseClient, useValue: clickhouse },
      ],
    }).compile();

    service = module.get(BlockchainDataQueryService);
  });

  describe('getHotWalletsByExchange', () => {
    it('throws BadRequestException for invalid exchange slug', async () => {
      await expect(
        service.getHotWalletsByExchange('invalid_slug!'),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns rows from ClickHouse', async () => {
      clickhouse.query.mockResolvedValue([
        {
          id: 'hw1',
          exchange_slug: 'binance',
          chain_slug: 'eth',
          address: '0xabc',
          label: 'Hot',
          is_active: '1',
        },
      ]);

      const result = await service.getHotWalletsByExchange('binance');

      expect(result).toHaveLength(1);
      expect(result[0].address).toBe('0xabc');
      expect(result[0].chain_slug).toBe('eth');
    });

    it('filters by chain when provided', async () => {
      clickhouse.query.mockResolvedValue([]);

      await service.getHotWalletsByExchange('binance', 'eth');

      expect(clickhouse.query).toHaveBeenCalledWith(
        expect.stringContaining("chain_slug = 'eth'"),
      );
    });
  });

  describe('getAddressSummary', () => {
    it('throws BadRequestException for invalid address', async () => {
      await expect(
        service.getAddressSummary('eth', 'not-an-address'),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns txCount and timestamps from query', async () => {
      clickhouse.query
        .mockResolvedValueOnce([{ count: '5' }])
        .mockResolvedValueOnce([
          {
            min_ts: '2024-01-01 00:00:00',
            max_ts: '2024-01-10 00:00:00',
          },
        ]);

      const result = await service.getAddressSummary(
        'eth',
        '0x1234567890123456789012345678901234567890',
      );

      expect(result.txCount).toBe(5);
      expect(result.firstTxAt).toBe('2024-01-01 00:00:00');
      expect(result.lastTxAt).toBe('2024-01-10 00:00:00');
      expect(result.balanceWei).toBeNull();
    });
  });
});
