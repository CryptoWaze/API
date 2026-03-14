import { Test, TestingModule } from '@nestjs/testing';
import { HotWalletCheckerService } from '../../../../src/infrastructure/database/hot-wallet-checker.service';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('HotWalletCheckerService', () => {
  let service: HotWalletCheckerService;
  let prisma: {
    chain: { findUnique: jest.Mock };
    hotWallet: { findFirst: jest.Mock; findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      chain: { findUnique: jest.fn() },
      hotWallet: { findFirst: jest.fn(), findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotWalletCheckerService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(HotWalletCheckerService);
  });

  describe('isHotWallet', () => {
    it('returns false when chain does not exist', async () => {
      prisma.chain.findUnique.mockResolvedValue(null);

      const result = await service.isHotWallet('eth', '0xABC123');

      expect(result).toBe(false);
      expect(prisma.hotWallet.findFirst).not.toHaveBeenCalled();
    });

    it('normalizes address (trim and lowercase 0x) and returns true when hot wallet found', async () => {
      prisma.chain.findUnique.mockResolvedValue({ id: 'chain-1' });
      prisma.hotWallet.findFirst.mockResolvedValue({ id: 'hw-1' });

      const result = await service.isHotWallet('eth', '  0xABC123  ');

      expect(result).toBe(true);
      expect(prisma.hotWallet.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            chainId: 'chain-1',
            address: '0xabc123',
          },
        }),
      );
    });

    it('returns false when hot wallet not found', async () => {
      prisma.chain.findUnique.mockResolvedValue({ id: 'chain-1' });
      prisma.hotWallet.findFirst.mockResolvedValue(null);

      const result = await service.isHotWallet('eth', '0xunknown');

      expect(result).toBe(false);
    });
  });

  describe('getHotWalletAddressesForChain', () => {
    it('returns empty set when chain does not exist', async () => {
      prisma.chain.findUnique.mockResolvedValue(null);

      const result = await service.getHotWalletAddressesForChain('eth');

      expect(result).toEqual(new Set());
    });

    it('returns set of normalized addresses', async () => {
      prisma.chain.findUnique.mockResolvedValue({ id: 'chain-1' });
      prisma.hotWallet.findMany.mockResolvedValue([
        { address: '  0xAAA  ' },
        { address: '0xBBB' },
      ]);

      const result = await service.getHotWalletAddressesForChain('eth');

      expect(result).toEqual(new Set(['0xaaa', '0xbbb']));
    });
  });
});
