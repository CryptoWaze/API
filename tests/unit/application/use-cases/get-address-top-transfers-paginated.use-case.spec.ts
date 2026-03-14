import {
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetAddressTopTransfersPaginatedUseCase } from '../../../../src/application/use-cases/get-address-top-transfers-paginated.use-case';
import { ADDRESS_TRANSFERS_FETCHER } from '../../../../src/application/ports/address-transfers-fetcher.port';

describe('GetAddressTopTransfersPaginatedUseCase', () => {
  let useCase: GetAddressTopTransfersPaginatedUseCase;
  let addressTransfersFetcher: { getAddressTransfersPage: jest.Mock };

  beforeEach(async () => {
    addressTransfersFetcher = { getAddressTransfersPage: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAddressTopTransfersPaginatedUseCase,
        {
          provide: ADDRESS_TRANSFERS_FETCHER,
          useValue: addressTransfersFetcher,
        },
      ],
    }).compile();

    useCase = module.get(GetAddressTopTransfersPaginatedUseCase);
  });

  it('returns chain, page and top outbound transfers', async () => {
    addressTransfersFetcher.getAddressTransfersPage.mockResolvedValue([
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
      {
        direction: 'IN',
        rawAmount: '1000000000000000000',
        amount: 1,
        symbol: 'ETH',
        from: '0xb',
        to: '0xa',
        txHash: '0x1',
        timestamp: '',
      },
    ]);

    const result = await useCase.execute({
      chain: 'eth',
      address: '0xa',
      page: 0,
    });

    expect(result.chain).toBe('eth');
    expect(result.page).toBe(0);
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
      new Error('Covalent API error: 503'),
    );

    await expect(
      useCase.execute({ chain: 'eth', address: '0xa', page: 0 }),
    ).rejects.toThrow(BadGatewayException);
  });

  it('throws InternalServerErrorException on other errors', async () => {
    addressTransfersFetcher.getAddressTransfersPage.mockRejectedValue(
      new Error('Network error'),
    );

    await expect(
      useCase.execute({ chain: 'eth', address: '0xa', page: 0 }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
