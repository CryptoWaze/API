import { Test, TestingModule } from '@nestjs/testing';
import { GetAddressTopTransfersUseCase } from '../../../../src/application/use-cases/get-address-top-transfers.use-case';
import { ADDRESS_TRANSFERS_FETCHER } from '../../../../src/application/ports/address-transfers-fetcher.port';

describe('GetAddressTopTransfersUseCase', () => {
  let useCase: GetAddressTopTransfersUseCase;
  let addressTransfersFetcher: { getAddressTransfers: jest.Mock };

  beforeEach(async () => {
    addressTransfersFetcher = { getAddressTransfers: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAddressTopTransfersUseCase,
        {
          provide: ADDRESS_TRANSFERS_FETCHER,
          useValue: addressTransfersFetcher,
        },
      ],
    }).compile();

    useCase = module.get(GetAddressTopTransfersUseCase);
  });

  it('returns empty result when no chain has transfers', async () => {
    addressTransfersFetcher.getAddressTransfers.mockResolvedValue([]);

    const result = await useCase.execute({
      address: '0xabc',
    });

    expect(result).toEqual({});
  });

  it('returns top outbound transfers per chain (up to ADDRESS_TOP_TRANSFERS_TOP_N)', async () => {
    addressTransfersFetcher.getAddressTransfers
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          direction: 'OUT',
          rawAmount: '3000000000000000000',
          amount: 3,
          symbol: 'ETH',
          from: '0x',
          to: '0x',
          txHash: '0x3',
          timestamp: '',
        },
        {
          direction: 'OUT',
          rawAmount: '1000000000000000000',
          amount: 1,
          symbol: 'ETH',
          from: '0x',
          to: '0x',
          txHash: '0x1',
          timestamp: '',
        },
        {
          direction: 'OUT',
          rawAmount: '2000000000000000000',
          amount: 2,
          symbol: 'ETH',
          from: '0x',
          to: '0x',
          txHash: '0x2',
          timestamp: '',
        },
      ]);

    const result = await useCase.execute({ address: '  0xABC  ' });

    expect(result).toHaveProperty('bsc-mainnet');
    expect(result['bsc-mainnet'].transfers).toHaveLength(3);
    expect(result['bsc-mainnet'].transfers[0].amount).toBe(3);
    expect(result['bsc-mainnet'].transfers[1].amount).toBe(2);
    expect(result['bsc-mainnet'].transfers[2].amount).toBe(1);
  });

  it('normalizes address to lowercase', async () => {
    addressTransfersFetcher.getAddressTransfers.mockResolvedValue([]);

    await useCase.execute({ address: '  0xABC  ' });

    expect(addressTransfersFetcher.getAddressTransfers).toHaveBeenCalledWith(
      'eth-mainnet',
      '0xabc',
    );
  });
});
