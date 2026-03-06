import type { Transfer } from '../../application/types';

export type CovalentItem = {
  from_address?: string;
  to_address?: string;
  value?: string;
  block_signed_at?: string;
  log_events?: Array<{
    decoded?: {
      name: string;
      params?: Array<{ name: string; value?: string }>;
    };
    sender_contract_decimals?: number;
    sender_contract_ticker_symbol?: string;
    sender_address?: string;
    block_signed_at?: string;
    tx_hash?: string;
  }>;
};

export function mapCovalentResponseToTransfers(
  items: CovalentItem[],
  chain: string,
): Transfer[] {
  const transfers: Transfer[] = [];
  const nativeSymbol = chain === 'bsc-mainnet' ? 'BNB' : 'ETH';

  for (const item of items) {
    if (item.value != null && BigInt(item.value) > 0n) {
      const v = BigInt(item.value);
      const div = 10n ** 18n;
      transfers.push({
        type: 'native',
        symbol: nativeSymbol,
        from: item.from_address ?? '',
        to: item.to_address ?? '',
        rawAmount: String(v),
        amount: Number(v / div) + Number(v % div) / Number(div),
        timestamp: item.block_signed_at ?? '',
      });
    }
    for (const ev of item.log_events ?? []) {
      if (!ev.decoded || ev.decoded.name !== 'Transfer') continue;
      const params = ev.decoded.params ?? [];
      const from = params.find((p) => p.name === 'from')?.value;
      const to = params.find((p) => p.name === 'to')?.value;
      const value = params.find((p) => p.name === 'value')?.value;
      if (!from || !to || !value) continue;
      const decimals = ev.sender_contract_decimals ?? 18;
      const raw = BigInt(value);
      const div = 10n ** BigInt(decimals);
      transfers.push({
        type: 'erc20',
        symbol: ev.sender_contract_ticker_symbol ?? '?',
        contract: ev.sender_address,
        from,
        to,
        rawAmount: value,
        amount: Number(raw / div) + Number(raw % div) / Number(div),
        timestamp: ev.block_signed_at ?? item.block_signed_at ?? '',
      });
    }
  }
  return transfers;
}
