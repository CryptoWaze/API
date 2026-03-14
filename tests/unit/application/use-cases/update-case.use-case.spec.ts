import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCaseUseCase } from '../../../../src/application/use-cases/update-case.use-case';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('UpdateCaseUseCase', () => {
  let useCase: UpdateCaseUseCase;
  let prisma: { case: { findUnique: jest.Mock; update: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      case: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCaseUseCase,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    useCase = module.get(UpdateCaseUseCase);
  });

  it('throws NotFoundException when case does not exist', async () => {
    prisma.case.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('case-1', 'user-1', { name: 'New' }),
    ).rejects.toThrow(NotFoundException);
    expect(prisma.case.update).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when user is not owner', async () => {
    prisma.case.findUnique.mockResolvedValue({
      id: 'case-1',
      name: 'Old',
      createdByUserId: 'other-user',
    });

    await expect(
      useCase.execute('case-1', 'user-1', { name: 'New' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('returns existing when input has no name', async () => {
    prisma.case.findUnique.mockResolvedValue({
      id: 'case-1',
      name: 'Current',
      createdByUserId: 'user-1',
    });

    const result = await useCase.execute('case-1', 'user-1', {});

    expect(result).toEqual({ id: 'case-1', name: 'Current' });
    expect(prisma.case.update).not.toHaveBeenCalled();
  });

  it('updates name and returns new data', async () => {
    prisma.case.findUnique.mockResolvedValue({
      id: 'case-1',
      name: 'Old',
      createdByUserId: 'user-1',
    });
    prisma.case.update.mockResolvedValue({
      id: 'case-1',
      name: 'New Name',
    });

    const result = await useCase.execute('case-1', 'user-1', {
      name: 'New Name',
    });

    expect(result).toEqual({ id: 'case-1', name: 'New Name' });
    expect(prisma.case.update).toHaveBeenCalledWith({
      where: { id: 'case-1' },
      data: { name: 'New Name' },
      select: { id: true, name: true },
    });
  });
});
