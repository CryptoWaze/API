import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetCaseByIdUseCase } from '../../../../src/application/use-cases/get-case-by-id.use-case';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('GetCaseByIdUseCase', () => {
  let useCase: GetCaseByIdUseCase;
  let prisma: {
    case: { findUnique: jest.Mock };
    token: { findMany: jest.Mock };
  };

  const minimalCase = {
    id: 'case-1',
    name: 'Caso',
    status: 'OPEN',
    totalAmountLostRaw: '0',
    totalAmountLostDecimal: '0',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdByUserId: 'user-1',
    seeds: [
      {
        id: 'seed-1',
        txHash: '0xabc',
        amountRaw: '0',
        amountDecimal: '0',
        timestamp: new Date(),
        tokenSymbol: 'ETH',
        tokenAddress: null,
        chain: { slug: 'eth', name: 'Ethereum', iconUrl: null },
      },
    ],
    flows: [
      {
        id: 'flow-1',
        seedId: 'seed-1',
        chain: { slug: 'eth', name: 'Ethereum', iconUrl: null },
        tokenSymbol: 'ETH',
        tokenAddress: null,
        totalAmountRaw: '0',
        totalAmountDecimal: '0',
        hopsCount: 0,
        endpointAddress: '0xend',
        endpointReason: 'NO_OUTBOUND',
        endpointHotWallet: null,
        transactions: [],
        edges: [],
        wallets: [],
      },
    ],
  };

  beforeEach(async () => {
    prisma = {
      case: { findUnique: jest.fn() },
      token: { findMany: jest.fn().mockResolvedValue([]) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCaseByIdUseCase,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    useCase = module.get(GetCaseByIdUseCase);
  });

  it('throws NotFoundException when case does not exist', async () => {
    prisma.case.findUnique.mockResolvedValue(null);

    await expect(useCase.execute('case-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws NotFoundException when user is not case owner', async () => {
    prisma.case.findUnique.mockResolvedValue({
      ...minimalCase,
      createdByUserId: 'other-user',
    });

    await expect(useCase.execute('case-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns case with seeds and flows when found', async () => {
    prisma.case.findUnique.mockResolvedValue(minimalCase);

    const result = await useCase.execute('case-1', 'user-1');

    expect(result.id).toBe('case-1');
    expect(result.name).toBe('Caso');
    expect(result.seeds).toHaveLength(1);
    expect(result.seeds[0].chainSlug).toBe('eth');
    expect(result.flows).toHaveLength(1);
    expect(result.flows[0].chainSlug).toBe('eth');
    expect(prisma.token.findMany).toHaveBeenCalled();
  });
});
