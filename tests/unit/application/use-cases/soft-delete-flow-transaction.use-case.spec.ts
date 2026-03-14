import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SoftDeleteFlowTransactionUseCase } from '../../../../src/application/use-cases/soft-delete-flow-transaction.use-case';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('SoftDeleteFlowTransactionUseCase', () => {
  let useCase: SoftDeleteFlowTransactionUseCase;
  let prisma: {
    flowTransaction: { findUnique: jest.Mock; update: jest.Mock };
    flowEdge: { updateMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      flowTransaction: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      flowEdge: { updateMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoftDeleteFlowTransactionUseCase,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    useCase = module.get(SoftDeleteFlowTransactionUseCase);
  });

  it('throws NotFoundException when transaction does not exist', async () => {
    prisma.flowTransaction.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('case-1', 'flow-1', 'tx-1', 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when user is not case owner', async () => {
    prisma.flowTransaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      flow: { id: 'flow-1', case: { id: 'case-1', createdByUserId: 'other' } },
    });

    await expect(
      useCase.execute('case-1', 'flow-1', 'tx-1', 'user-1'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('soft-deletes transaction and returns id and deletedAt', async () => {
    const now = new Date();
    prisma.flowTransaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      txHash: '0xabc',
      fromAddress: '0xa',
      toAddress: '0xb',
      timestamp: new Date(),
      flow: { id: 'flow-1', case: { id: 'case-1', createdByUserId: 'user-1' } },
    });
    prisma.flowTransaction.update.mockResolvedValue({
      id: 'tx-1',
      deletedAt: now,
    });
    prisma.flowEdge.updateMany.mockResolvedValue({ count: 0 });

    const result = await useCase.execute('case-1', 'flow-1', 'tx-1', 'user-1');

    expect(result.id).toBe('tx-1');
    expect(result.deletedAt).toBe(now.toISOString());
    expect(prisma.flowTransaction.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'tx-1' },
        data: { deletedAt: expect.any(Date) },
      }),
    );
  });
});
