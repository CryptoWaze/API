import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from '../../../../src/presentation/transactions/transactions.controller';
import { ResolveTransactionUseCase } from '../../../../src/application/use-cases/resolve-transaction.use-case';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let resolveTransactionUseCase: jest.Mocked<ResolveTransactionUseCase>;

  beforeEach(async () => {
    resolveTransactionUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: ResolveTransactionUseCase, useValue: resolveTransactionUseCase },
      ],
    }).compile();

    controller = module.get(TransactionsController);
  });

  it('resolve throws BadRequestException when body is invalid', async () => {
    await expect(controller.resolve({})).rejects.toThrow(BadRequestException);
    expect(resolveTransactionUseCase.execute).not.toHaveBeenCalled();
  });

  it('resolve delegates to use case with parsed body', async () => {
    resolveTransactionUseCase.execute.mockResolvedValue({
      chain: 'eth-mainnet',
      transaction: { fromAddress: '0xa', toAddress: '0xb', blockSignedAt: '' },
      transfers: [],
      seedTransfer: null,
    });

    const result = await controller.resolve({
      txHash: '0xabc',
      reportedLossAmount: 1,
    });

    expect(resolveTransactionUseCase.execute).toHaveBeenCalledWith({
      txHash: '0xabc',
      reportedLossAmount: 1,
    });
    expect(result.chain).toBe('eth-mainnet');
  });
});
