import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from '../../../../src/presentation/addresses/addresses.controller';
import { GetAddressTopTransfersUseCase } from '../../../../src/application/use-cases/get-address-top-transfers.use-case';
import { GetAddressTopTransfersHistoryUseCase } from '../../../../src/application/use-cases/get-address-top-transfers-history.use-case';
import { GetAddressTopTransfersPaginatedUseCase } from '../../../../src/application/use-cases/get-address-top-transfers-paginated.use-case';
import { FollowFlowToExchangeUseCase } from '../../../../src/application/use-cases/follow-flow-to-exchange.use-case';
import { FollowFlowToExchangeFullHistoryUseCase } from '../../../../src/application/use-cases/follow-flow-to-exchange-full-history.use-case';
import { FlowToExchangeFromTransactionUseCase } from '../../../../src/application/use-cases/flow-to-exchange-from-transaction.use-case';

describe('AddressesController', () => {
  let controller: AddressesController;
  let getAddressTopTransfersUseCase: jest.Mocked<GetAddressTopTransfersUseCase>;
  let getAddressTopTransfersHistoryUseCase: jest.Mocked<GetAddressTopTransfersHistoryUseCase>;

  beforeEach(async () => {
    getAddressTopTransfersUseCase = { execute: jest.fn() };
    getAddressTopTransfersHistoryUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [
        { provide: GetAddressTopTransfersUseCase, useValue: getAddressTopTransfersUseCase },
        { provide: GetAddressTopTransfersHistoryUseCase, useValue: getAddressTopTransfersHistoryUseCase },
        { provide: GetAddressTopTransfersPaginatedUseCase, useValue: { execute: jest.fn() } },
        { provide: FollowFlowToExchangeUseCase, useValue: {} },
        { provide: FollowFlowToExchangeFullHistoryUseCase, useValue: {} },
        { provide: FlowToExchangeFromTransactionUseCase, useValue: {} },
      ],
    }).compile();

    controller = module.get(AddressesController);
  });

  it('getTopTransfers throws BadRequestException when address missing', async () => {
    await expect(
      controller.getTopTransfers(undefined as unknown as string),
    ).rejects.toThrow(BadRequestException);
    expect(getAddressTopTransfersUseCase.execute).not.toHaveBeenCalled();
  });

  it('getTopTransfers delegates to use case with parsed address', async () => {
    getAddressTopTransfersUseCase.execute.mockResolvedValue({});

    const result = await controller.getTopTransfers('0xabc');

    expect(getAddressTopTransfersUseCase.execute).toHaveBeenCalledWith({
      address: '0xabc',
    });
    expect(result).toEqual({});
  });

  it('getTopTransfersHistory delegates to use case with address and chain', async () => {
    getAddressTopTransfersHistoryUseCase.execute.mockResolvedValue({
      chain: 'eth',
      transfers: [],
    });

    const result = await controller.getTopTransfersHistory('0xabc', 'eth');

    expect(getAddressTopTransfersHistoryUseCase.execute).toHaveBeenCalledWith({
      address: '0xabc',
      chain: 'eth',
    });
    expect(result.chain).toBe('eth');
  });
});
