import {
  normalizeAddress,
  chainToSlug,
  toCovalentChainId,
} from '../../../../src/application/utils/blockchain.utils';

describe('blockchain.utils', () => {
  describe('normalizeAddress', () => {
    it('returns trimmed lowercase when starts with 0x', () => {
      expect(normalizeAddress('  0xABC123  ')).toBe('0xabc123');
    });

    it('returns trimmed string when does not start with 0x', () => {
      expect(normalizeAddress('  some-address  ')).toBe('some-address');
    });

    it('handles already lowercase 0x', () => {
      expect(normalizeAddress('0xabc123')).toBe('0xabc123');
    });

    it('handles empty string', () => {
      expect(normalizeAddress('')).toBe('');
    });
  });

  describe('chainToSlug', () => {
    it('strips -mainnet suffix', () => {
      expect(chainToSlug('eth-mainnet')).toBe('eth');
      expect(chainToSlug('polygon-mainnet')).toBe('polygon');
    });

    it('trims whitespace and then strips -mainnet', () => {
      expect(chainToSlug('  eth-mainnet  ')).toBe('eth');
    });

    it('returns trimmed string when no -mainnet', () => {
      expect(chainToSlug('  eth  ')).toBe('eth');
    });
  });

  describe('toCovalentChainId', () => {
    it('appends -mainnet to trimmed slug', () => {
      expect(toCovalentChainId('eth')).toBe('eth-mainnet');
      expect(toCovalentChainId('  polygon  ')).toBe('polygon-mainnet');
    });
  });
});
