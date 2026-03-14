import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateFlowWalletUseCase } from '../../../../src/application/use-cases/update-flow-wallet.use-case';
import { PrismaService } from '../../../../src/infrastructure/database/prisma.service';

describe('UpdateFlowWalletUseCase', () => {
  let useCase: UpdateFlowWalletUseCase;
  let prisma: { flowWallet: { findUnique: jest.Mock; update: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      flowWallet: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateFlowWalletUseCase,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    useCase = module.get(UpdateFlowWalletUseCase);
  });

  it('throws NotFoundException when wallet does not exist', async () => {
    prisma.flowWallet.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('case-1', 'wallet-1', 'user-1', {}),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when wallet belongs to another case', async () => {
    prisma.flowWallet.findUnique.mockResolvedValue({
      id: 'wallet-1',
      flow: { case: { id: 'other-case', createdByUserId: 'user-1' } },
    });

    await expect(
      useCase.execute('case-1', 'wallet-1', 'user-1', {}),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException when user is not case owner', async () => {
    prisma.flowWallet.findUnique.mockResolvedValue({
      id: 'wallet-1',
      flow: { case: { id: 'case-1', createdByUserId: 'other-user' } },
    });

    await expect(
      useCase.execute('case-1', 'wallet-1', 'user-1', {}),
    ).rejects.toThrow(ForbiddenException);
  });

  it('updates nickname and returns result', async () => {
    prisma.flowWallet.findUnique.mockResolvedValue({
      id: 'wallet-1',
      flow: { case: { id: 'case-1', createdByUserId: 'user-1' } },
    });
    prisma.flowWallet.update.mockResolvedValue({
      id: 'wallet-1',
      nickname: 'My Wallet',
      position: 'default',
    });

    const result = await useCase.execute('case-1', 'wallet-1', 'user-1', {
      nickname: 'My Wallet',
    });

    expect(result.id).toBe('wallet-1');
    expect(result.nickname).toBe('My Wallet');
    expect(prisma.flowWallet.update).toHaveBeenCalledWith({
      where: { id: 'wallet-1' },
      data: { nickname: 'My Wallet' },
    });
  });
});
