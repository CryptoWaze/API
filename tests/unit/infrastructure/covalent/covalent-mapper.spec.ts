import {
  mapCovalentResponseToTransfers,
  mapCovalentAddressTransactionsToWalletTransfers,
} from '../../../../src/infrastructure/covalent/covalent-mapper';

describe('covalent-mapper', () => {
  describe('mapCovalentResponseToTransfers', () => {
    it('returns native ETH transfer for eth-mainnet', () => {
      const result = mapCovalentResponseToTransfers(
        [
          {
            from_address: '0xa',
            to_address: '0xb',
            value: '1000000000000000000',
            block_signed_at: '2024-01-01',
          },
        ],
        'eth-mainnet',
      );
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('native');
      expect(result[0].symbol).toBe('ETH');
      expect(result[0].amount).toBe(1);
      expect(result[0].from).toBe('0xa');
      expect(result[0].to).toBe('0xb');
    });

    it('returns native BNB transfer for bsc-mainnet', () => {
      const result = mapCovalentResponseToTransfers(
        [
          {
            from_address: '0xa',
            to_address: '0xb',
            value: '2000000000000000000',
            block_signed_at: '',
          },
        ],
        'bsc-mainnet',
      );
      expect(result[0].symbol).toBe('BNB');
      expect(result[0].amount).toBe(2);
    });

    it('skips zero value', () => {
      const result = mapCovalentResponseToTransfers(
        [{ from_address: '0xa', to_address: '0xb', value: '0' }],
        'eth-mainnet',
      );
      expect(result).toHaveLength(0);
    });

    it('maps ERC20 Transfer log event', () => {
      const result = mapCovalentResponseToTransfers(
        [
          {
            log_events: [
              {
                decoded: {
                  name: 'Transfer',
                  params: [
                    { name: 'from', value: '0xa' },
                    { name: 'to', value: '0xb' },
                    { name: 'value', value: '1000000' },
                  ],
                },
                sender_contract_decimals: 6,
                sender_contract_ticker_symbol: 'USDT',
                sender_address: '0xcontract',
                block_signed_at: '2024-01-01',
              },
            ],
          },
        ],
        'eth-mainnet',
      );
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('erc20');
      expect(result[0].symbol).toBe('USDT');
      expect(result[0].amount).toBe(1);
    });
  });

  describe('mapCovalentAddressTransactionsToWalletTransfers', () => {
    it('returns OUT direction when address is from', () => {
      const result = mapCovalentAddressTransactionsToWalletTransfers(
        [
          {
            from_address: '0xADDR',
            to_address: '0xb',
            value: '1000000000000000000',
            block_signed_at: '',
            tx_hash: '0x1',
          },
        ],
        'eth-mainnet',
        '0xaddr',
      );
      expect(result).toHaveLength(1);
      expect(result[0].direction).toBe('OUT');
      expect(result[0].counterparty).toBe('0xb');
    });

    it('returns IN direction when address is to', () => {
      const result = mapCovalentAddressTransactionsToWalletTransfers(
        [
          {
            from_address: '0xa',
            to_address: '0xADDR',
            value: '1000000000000000000',
            block_signed_at: '',
            tx_hash: '0x1',
          },
        ],
        'eth-mainnet',
        '0xaddr',
      );
      expect(result[0].direction).toBe('IN');
      expect(result[0].counterparty).toBe('0xa');
    });

    it('skips item when address is neither from nor to', () => {
      const result = mapCovalentAddressTransactionsToWalletTransfers(
        [
          {
            from_address: '0xa',
            to_address: '0xb',
            value: '1000000000000000000',
            block_signed_at: '',
            tx_hash: '0x1',
          },
        ],
        'eth-mainnet',
        '0xother',
      );
      expect(result).toHaveLength(0);
    });
  });
});
