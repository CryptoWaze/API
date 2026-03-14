import { Test, TestingModule } from '@nestjs/testing';
import { CatalogSyncService } from '../../../../../src/infrastructure/blockchain/ingestion/catalog-sync.service';
import { ClickHouseClient } from '../../../../../src/infrastructure/blockchain/clickhouse/clickhouse.client';
import { PrismaService } from '../../../../../src/infrastructure/database/prisma.service';

describe('CatalogSyncService', () => {
  let service: CatalogSyncService;
  let clickhouse: { exec: jest.Mock; query: jest.Mock };
  let prisma: {
    exchange: { findMany: jest.Mock };
    hotWallet: { findMany: jest.Mock };
    token: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    clickhouse = {
      exec: jest.fn().mockResolvedValue(undefined),
      query: jest.fn().mockResolvedValue([{ count: '0' }]),
    };
    prisma = {
      exchange: { findMany: jest.fn().mockResolvedValue([]) },
      hotWallet: { findMany: jest.fn().mockResolvedValue([]) },
      token: { findMany: jest.fn().mockResolvedValue([]) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogSyncService,
        { provide: ClickHouseClient, useValue: clickhouse },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(CatalogSyncService);
  });

  describe('syncAll', () => {
    it('returns counts from syncExchanges, syncHotWallets, syncTokens', async () => {
      prisma.exchange.findMany.mockResolvedValue([
        { slug: 'binance', name: 'Binance', iconUrl: null, createdAt: new Date(), updatedAt: new Date() },
      ]);
      prisma.hotWallet.findMany.mockResolvedValue([
        {
          id: 'hw1',
          address: '0x',
          label: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          exchange: { slug: 'binance' },
          chain: { slug: 'eth' },
        },
      ]);
      clickhouse.query.mockResolvedValue([{ count: '0' }]);

      const result = await service.syncAll();

      expect(result).toEqual({ exchanges: 1, hotWallets: 1, tokens: 0 });
    });
  });

  describe('syncExchanges', () => {
    it('returns 0 when no exchanges in Postgres', async () => {
      const count = await service.syncExchanges();
      expect(count).toBe(0);
      expect(clickhouse.exec).not.toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO blockchain_data.exchanges'),
      );
    });

    it('truncates and inserts when exchanges exist', async () => {
      prisma.exchange.findMany.mockResolvedValue([
        { slug: 'binance', name: 'Binance', iconUrl: null, createdAt: new Date(), updatedAt: new Date() },
      ]);

      const count = await service.syncExchanges();

      expect(count).toBe(1);
      expect(clickhouse.exec).toHaveBeenCalledWith(
        expect.stringContaining('TRUNCATE TABLE IF EXISTS blockchain_data.exchanges'),
      );
      expect(clickhouse.exec).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO blockchain_data.exchanges'),
      );
    });
  });

  describe('syncTokens', () => {
    it('returns existing count when tokens table already has data', async () => {
      clickhouse.query.mockResolvedValue([{ count: '100' }]);

      const count = await service.syncTokens();

      expect(count).toBe(100);
      expect(prisma.token.findMany).not.toHaveBeenCalled();
    });

    it('inserts tokens when table is empty', async () => {
      clickhouse.query.mockResolvedValue([{ count: '0' }]);
      prisma.token.findMany.mockResolvedValue([
        {
          symbol: 'ETH',
          name: 'Ethereum',
          imageUrl: null,
          currentPrice: '2000',
          marketCap: null,
          marketCapRank: null,
          totalVolume: null,
          lastUpdatedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const count = await service.syncTokens();

      expect(count).toBe(1);
      expect(clickhouse.exec).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO blockchain_data.tokens'),
      );
    });
  });

  describe('syncHotWallets', () => {
    it('returns 0 when no hot wallets in Postgres', async () => {
      const count = await service.syncHotWallets();
      expect(count).toBe(0);
    });
  });
});
