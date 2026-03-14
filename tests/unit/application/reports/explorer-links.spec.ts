import {
  txExplorerUrl,
  addressExplorerUrl,
} from '../../../../src/application/reports/explorer-links';

describe('explorer-links', () => {
  describe('txExplorerUrl', () => {
    it('returns etherscan tx url for eth', () => {
      expect(txExplorerUrl('eth', '0xabc')).toBe(
        'https://etherscan.io/tx/0xabc',
      );
    });

    it('returns bscscan tx url for bsc', () => {
      expect(txExplorerUrl('bsc', '0xdef')).toBe(
        'https://bscscan.com/tx/0xdef',
      );
    });

    it('returns tron transaction url for tron', () => {
      expect(txExplorerUrl('tron', 'tx123')).toBe(
        'https://tronscan.org/#/transaction/tx123',
      );
    });

    it('uses default etherscan for unknown chain', () => {
      expect(txExplorerUrl('unknown', '0xabc')).toBe(
        'https://etherscan.io/tx/0xabc',
      );
    });

    it('is case insensitive for chain slug', () => {
      expect(txExplorerUrl('ETH', '0xabc')).toBe(
        'https://etherscan.io/tx/0xabc',
      );
    });
  });

  describe('addressExplorerUrl', () => {
    it('returns etherscan address url for eth', () => {
      expect(addressExplorerUrl('eth', '0x123')).toBe(
        'https://etherscan.io/address/0x123',
      );
    });

    it('returns tron address url for tron', () => {
      expect(addressExplorerUrl('tron', 'addr')).toBe(
        'https://tronscan.org/#/address/addr',
      );
    });

    it('uses default for unknown chain', () => {
      expect(addressExplorerUrl('unknown', '0x')).toBe(
        'https://etherscan.io/address/0x',
      );
    });
  });
});
