import type { Transfer, WalletTransfer } from '../../application/types';

export type CovalentItem = {
  from_address?: string;
  to_address?: string;
  value?: string;
  block_signed_at?: string;
  tx_hash?: string;
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

export function mapCovalentAddressTransactionsToWalletTransfers(
  items: CovalentItem[],
  chain: string,
  address: string,
): WalletTransfer[] {
  const addr = address.toLowerCase();
  const nativeSymbol = chain === 'bsc-mainnet' ? 'BNB' : 'ETH';
  const out: WalletTransfer[] = [];

  for (const item of items) {
    if (item.value != null && BigInt(item.value) > 0n) {
      const v = BigInt(item.value);
      const div = 10n ** 18n;
      const from = (item.from_address ?? '').toLowerCase();
      const to = (item.to_address ?? '').toLowerCase();
      if (from !== addr && to !== addr) continue;
      out.push({
        type: 'native',
        symbol: nativeSymbol,
        from: item.from_address ?? '',
        to: item.to_address ?? '',
        rawAmount: String(v),
        amount: Number(v / div) + Number(v % div) / Number(div),
        timestamp: item.block_signed_at ?? '',
        txHash: item.tx_hash ?? '',
        direction: from === addr ? 'OUT' : 'IN',
        counterparty:
          from === addr ? (item.to_address ?? '') : (item.from_address ?? ''),
      });
    }
    for (const ev of item.log_events ?? []) {
      if (!ev.decoded || ev.decoded.name !== 'Transfer') continue;
      const params = ev.decoded.params ?? [];
      const from = params.find((p) => p.name === 'from')?.value?.toLowerCase();
      const to = params.find((p) => p.name === 'to')?.value?.toLowerCase();
      const value = params.find((p) => p.name === 'value')?.value;
      if (!from || !to || !value) continue;
      if (from !== addr && to !== addr) continue;
      const decimals = ev.sender_contract_decimals ?? 18;
      const raw = BigInt(value);
      const div = 10n ** BigInt(decimals);
      const fromVal = params.find((p) => p.name === 'from')?.value ?? '';
      const toVal = params.find((p) => p.name === 'to')?.value ?? '';
      out.push({
        type: 'erc20',
        symbol: ev.sender_contract_ticker_symbol ?? '?',
        contract: ev.sender_address,
        from: fromVal,
        to: toVal,
        rawAmount: value,
        amount: Number(raw / div) + Number(raw % div) / Number(div),
        timestamp: ev.block_signed_at ?? item.block_signed_at ?? '',
        txHash: ev.tx_hash ?? item.tx_hash ?? '',
        direction: from === addr ? 'OUT' : 'IN',
        counterparty: from === addr ? toVal : fromVal,
      });
    }
  }
  return out;
}
