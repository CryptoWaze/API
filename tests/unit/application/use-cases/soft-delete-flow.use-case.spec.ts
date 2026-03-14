import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SoftDeleteFlowUseCase } from '../../../../src/application/use-cases/soft-delete-flow.use-case';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('SoftDeleteFlowUseCase', () => {
  let useCase: SoftDeleteFlowUseCase;
  let prisma: { flow: { findUnique: jest.Mock; update: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      flow: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoftDeleteFlowUseCase,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    useCase = module.get(SoftDeleteFlowUseCase);
  });

  it('throws NotFoundException when flow does not exist', async () => {
    prisma.flow.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('case-1', 'flow-1', 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when flow belongs to another case', async () => {
    prisma.flow.findUnique.mockResolvedValue({
      id: 'flow-1',
      case: { id: 'other-case', createdByUserId: 'user-1' },
    });

    await expect(
      useCase.execute('case-1', 'flow-1', 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when user is not case owner', async () => {
    prisma.flow.findUnique.mockResolvedValue({
      id: 'flow-1',
      case: { id: 'case-1', createdByUserId: 'other-user' },
    });

    await expect(
      useCase.execute('case-1', 'flow-1', 'user-1'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('soft-deletes flow and returns id and deletedAt', async () => {
    const now = new Date();
    prisma.flow.findUnique.mockResolvedValue({
      id: 'flow-1',
      case: { id: 'case-1', createdByUserId: 'user-1' },
    });
    prisma.flow.update.mockResolvedValue({
      id: 'flow-1',
      deletedAt: now,
    });

    const result = await useCase.execute('case-1', 'flow-1', 'user-1');

    expect(result.id).toBe('flow-1');
    expect(result.deletedAt).toBe(now.toISOString());
    expect(prisma.flow.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'flow-1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date) }),
      }),
    );
  });
});
