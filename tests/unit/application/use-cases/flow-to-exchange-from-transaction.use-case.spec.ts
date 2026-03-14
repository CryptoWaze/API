import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FlowToExchangeFromTransactionUseCase } from '../../../../src/application/use-cases/flow-to-exchange-from-transaction.use-case';
import { ResolveTransactionUseCase } from '../../../../src/application/use-cases/resolve-transaction.use-case';
import { FollowFlowToExchangeFullHistoryUseCase } from '../../../../src/application/use-cases/follow-flow-to-exchange-full-history.use-case';

describe('FlowToExchangeFromTransactionUseCase', () => {
  let useCase: FlowToExchangeFromTransactionUseCase;
  let resolveTransaction: jest.Mocked<ResolveTransactionUseCase>;
  let followFlow: jest.Mocked<FollowFlowToExchangeFullHistoryUseCase>;

  beforeEach(async () => {
    resolveTransaction = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ResolveTransactionUseCase>;
    followFlow = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<FollowFlowToExchangeFullHistoryUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowToExchangeFromTransactionUseCase,
        { provide: ResolveTransactionUseCase, useValue: resolveTransaction },
        {
          provide: FollowFlowToExchangeFullHistoryUseCase,
          useValue: followFlow,
        },
      ],
    }).compile();

    useCase = module.get(FlowToExchangeFromTransactionUseCase);
  });

  it('throws NotFoundException when resolve returns no seedTransfer', async () => {
    resolveTransaction.execute.mockResolvedValue({
      chain: 'eth-mainnet',
      transaction: { fromAddress: '0xa', toAddress: '0xb', blockSignedAt: '' },
      transfers: [],
      seedTransfer: null,
    });

    await expect(
      useCase.execute({
        txHash: '0xabc',
        reportedLossAmount: 1,
        traceId: 'trace-1',
      }),
    ).rejects.toThrow(NotFoundException);
    expect(followFlow.execute).not.toHaveBeenCalled();
  });

  it('calls followFlow with chain slug and start address from seedTransfer', async () => {
    resolveTransaction.execute.mockResolvedValue({
      chain: 'eth-mainnet',
      transaction: { fromAddress: '0xa', toAddress: '0xb', blockSignedAt: '' },
      transfers: [],
      seedTransfer: {
        type: 'native',
        symbol: 'ETH',
        from: '0xa',
        to: '  0xDest  ',
        rawAmount: '1',
        amount: 1,
        timestamp: '2024-01-01T00:00:00Z',
      },
    });
    followFlow.execute.mockResolvedValue({
      success: true,
      chain: 'eth',
      steps: [],
      endpointAddress: '0xhot',
    });

    await useCase.execute({
      txHash: '0xabc',
      reportedLossAmount: 1,
      traceId: 'trace-1',
    });

    expect(followFlow.execute).toHaveBeenCalledWith({
      address: '0xdest',
      chain: 'eth',
      traceId: 'trace-1',
      minTimestamp: '2024-01-01T00:00:00Z',
    });
  });
});
