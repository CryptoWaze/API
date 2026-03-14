import {
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetAddressTopTransfersHistoryUseCase } from '../../../../src/application/use-cases/get-address-top-transfers-history.use-case';
import { ADDRESS_TRANSFERS_FETCHER } from '../../../../src/application/ports/address-transfers-fetcher.port';

describe('GetAddressTopTransfersHistoryUseCase', () => {
  let useCase: GetAddressTopTransfersHistoryUseCase;
  let addressTransfersFetcher: { getAddressTransfersPage: jest.Mock };

  beforeEach(async () => {
    addressTransfersFetcher = { getAddressTransfersPage: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAddressTopTransfersHistoryUseCase,
        {
          provide: ADDRESS_TRANSFERS_FETCHER,
          useValue: addressTransfersFetcher,
        },
      ],
    }).compile();

    useCase = module.get(GetAddressTopTransfersHistoryUseCase);
  });

  it('aggregates pages and returns top outbound transfers', async () => {
    addressTransfersFetcher.getAddressTransfersPage
      .mockResolvedValueOnce([
        {
          direction: 'OUT',
          rawAmount: '2000000000000000000',
          amount: 2,
          symbol: 'ETH',
          from: '0xa',
          to: '0xb',
          txHash: '0x2',
          timestamp: '',
        },
        { direction: 'IN', rawAmount: '1', amount: 1, symbol: 'ETH', from: '0xb', to: '0xa', txHash: '0x1', timestamp: '' },
      ])
      .mockResolvedValueOnce([]);

    const result = await useCase.execute({
      address: '0xa',
      chain: 'eth',
    });

    expect(result.chain).toBe('eth');
    expect(result.transfers).toHaveLength(1);
    expect(result.transfers[0].amount).toBe(2);
    expect(addressTransfersFetcher.getAddressTransfersPage).toHaveBeenCalledWith(
      'eth-mainnet',
      '0xa',
      0,
    );
  });

  it('throws BadGatewayException on Covalent 5xx', async () => {
    addressTransfersFetcher.getAddressTransfersPage.mockRejectedValue(
      new Error('Covalent API error: 502'),
    );

    await expect(
      useCase.execute({ address: '0xa', chain: 'eth' }),
    ).rejects.toThrow(BadGatewayException);
  });

  it('throws InternalServerErrorException on other errors', async () => {
    addressTransfersFetcher.getAddressTransfersPage.mockRejectedValue(
      new Error('Network error'),
    );

    await expect(
      useCase.execute({ address: '0xa', chain: 'eth' }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
