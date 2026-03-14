import {
  BadGatewayException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResolveTransactionUseCase } from '../../../../src/application/use-cases/resolve-transaction.use-case';
import { TRANSACTION_FETCHER } from '../../../../src/application/ports/transaction-fetcher.port';

describe('ResolveTransactionUseCase', () => {
  let useCase: ResolveTransactionUseCase;
  let transactionFetcher: { getTransactionWithTransfers: jest.Mock };

  beforeEach(async () => {
    transactionFetcher = { getTransactionWithTransfers: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResolveTransactionUseCase,
        { provide: TRANSACTION_FETCHER, useValue: transactionFetcher },
      ],
    }).compile();

    useCase = module.get(ResolveTransactionUseCase);
  });

  it('returns first chain data when getTransactionWithTransfers returns data and reportedAmount matches', async () => {
    transactionFetcher.getTransactionWithTransfers
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        fromAddress: '0xa',
        toAddress: '0xb',
        blockSignedAt: '2024-01-01',
        transfers: [
          { amount: 1, symbol: 'ETH', from: '0xa', to: '0xb', rawAmount: '1', timestamp: '', type: 'native' },
          { amount: 2, symbol: 'ETH', from: '0xa', to: '0xb', rawAmount: '2', timestamp: '', type: 'native' },
        ],
      });

    const result = await useCase.execute({
      txHash: '0xabc',
      reportedLossAmount: 2,
    });

    expect(result.chain).toBe('bsc-mainnet');
    expect(result.transaction).toEqual({
      fromAddress: '0xa',
      toAddress: '0xb',
      blockSignedAt: '2024-01-01',
    });
    expect(result.seedTransfer).toEqual(
      expect.objectContaining({ amount: 2 }),
    );
  });

  it('picks transfer closest to reportedLossAmount', async () => {
    transactionFetcher.getTransactionWithTransfers.mockResolvedValue({
      fromAddress: '0xa',
      toAddress: '0xb',
      blockSignedAt: '',
      transfers: [
        { amount: 1, symbol: 'ETH', from: '0xa', to: '0xb', rawAmount: '1', timestamp: '', type: 'native' },
        { amount: 2.5, symbol: 'ETH', from: '0xa', to: '0xb', rawAmount: '2.5', timestamp: '', type: 'native' },
        { amount: 5, symbol: 'ETH', from: '0xa', to: '0xb', rawAmount: '5', timestamp: '', type: 'native' },
      ],
    });

    const result = await useCase.execute({
      txHash: '0x',
      reportedLossAmount: 2,
    });

    expect(result.seedTransfer?.amount).toBe(2.5);
  });

  it('returns seedTransfer null when reportedLossAmount not provided', async () => {
    transactionFetcher.getTransactionWithTransfers.mockResolvedValue({
      fromAddress: '0xa',
      toAddress: '0xb',
      blockSignedAt: '',
      transfers: [{ amount: 1, symbol: 'ETH', from: '0xa', to: '0xb', rawAmount: '1', timestamp: '', type: 'native' }],
    });

    const result = await useCase.execute({ txHash: '0x' });

    expect(result.seedTransfer).toBeNull();
  });

  it('throws NotFoundException when no chain returns data', async () => {
    transactionFetcher.getTransactionWithTransfers.mockResolvedValue(null);

    await expect(
      useCase.execute({ txHash: '0xunknown' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws BadGatewayException on Covalent 5xx', async () => {
    transactionFetcher.getTransactionWithTransfers.mockRejectedValue(
      new Error('Covalent API error: 502'),
    );

    await expect(
      useCase.execute({ txHash: '0x' }),
    ).rejects.toThrow(BadGatewayException);
  });

  it('throws InternalServerErrorException on other errors', async () => {
    transactionFetcher.getTransactionWithTransfers.mockRejectedValue(
      new Error('Network error'),
    );

    await expect(
      useCase.execute({ txHash: '0x' }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
