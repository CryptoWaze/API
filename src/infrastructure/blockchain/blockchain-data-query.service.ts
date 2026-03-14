import { BadRequestException, Injectable } from '@nestjs/common';
import { ClickHouseClient } from './clickhouse/clickhouse.client';

const SLUG_REGEX = /^[a-z0-9-]+$/;
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

function assertSlug(value: string, name: string): void {
  const normalized = value.trim().toLowerCase();
  if (!SLUG_REGEX.test(normalized)) {
    throw new BadRequestException(
      `Invalid ${name}: expected alphanumeric and hyphens`,
    );
  }
}

function assertAddress(value: string): void {
  const normalized = value.trim();
  if (!ADDRESS_REGEX.test(normalized)) {
    throw new BadRequestException(
      'Invalid address: expected 0x + 40 hex chars',
    );
  }
}

function escapeString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export type HotWalletRow = {
  id: string;
  exchange_slug: string;
  chain_slug: string;
  address: string;
  label: string | null;
  is_active: string;
};

export type TransactionRow = {
  tx_hash: string;
  block_number: string;
  from_address: string;
  to_address: string;
  value_wei: string;
  gas_used: string;
  gas_price_wei: string;
  timestamp: string;
  nonce: string;
};

@Injectable()
export class BlockchainDataQueryService {
  constructor(private readonly clickhouse: ClickHouseClient) {}

  async getHotWalletsByExchange(
    exchangeSlug: string,
    chainSlug?: string,
  ): Promise<HotWalletRow[]> {
    assertSlug(exchangeSlug, 'exchangeSlug');
    const slug = exchangeSlug.trim().toLowerCase();
    const chainFilter =
      chainSlug != null && chainSlug.trim() !== ''
        ? `AND chain_slug = '${escapeString(chainSlug.trim().toLowerCase())}'`
        : '';

    const rows = await this.clickhouse.query<HotWalletRow>(`
      SELECT id, exchange_slug, chain_slug, address, label, toString(is_active) AS is_active
      FROM blockchain_data.hot_wallets
      WHERE exchange_slug = '${escapeString(slug)}' ${chainFilter}
      ORDER BY chain_slug, address
    `);
    return rows ?? [];
  }

  async getAddressSummary(
    chain: string,
    address: string,
  ): Promise<{
    chain: string;
    address: string;
    txCount: number;
    firstTxAt: string | null;
    lastTxAt: string | null;
    balanceWei: null;
  }> {
    assertSlug(chain, 'chain');
    assertAddress(address);
    const chainNorm = chain.trim().toLowerCase();
    const addrNorm = address.trim().toLowerCase();

    const countRows = await this.clickhouse.query<{ count: string }>(`
      SELECT count() AS count
      FROM blockchain_data.transactions
      WHERE chain = '${escapeString(chainNorm)}'
        AND (lower(from_address) = '${escapeString(addrNorm)}' OR lower(to_address) = '${escapeString(addrNorm)}')
    `);
    const txCount = parseInt(countRows[0]?.count ?? '0', 10);

    const timeRows = await this.clickhouse.query<{
      min_ts: string;
      max_ts: string;
    }>(`
      SELECT
        min(timestamp) AS min_ts,
        max(timestamp) AS max_ts
      FROM blockchain_data.transactions
      WHERE chain = '${escapeString(chainNorm)}'
        AND (lower(from_address) = '${escapeString(addrNorm)}' OR lower(to_address) = '${escapeString(addrNorm)}')
    `);
    const firstTxAt = timeRows[0]?.min_ts ?? null;
    const lastTxAt = timeRows[0]?.max_ts ?? null;

    return {
      chain: chainNorm,
      address: addrNorm,
      txCount,
      firstTxAt,
      lastTxAt,
      balanceWei: null,
    };
  }

  async getAddressTransactions(
    chain: string,
    address: string,
    limit: number,
    offset: number,
    order: 'asc' | 'desc',
  ): Promise<TransactionRow[]> {
    assertSlug(chain, 'chain');
    assertAddress(address);
    const chainNorm = chain.trim().toLowerCase();
    const addrNorm = address.trim().toLowerCase();
    const limitNum = Math.min(Math.max(1, limit), 1000);
    const offsetNum = Math.max(0, offset);
    const orderDir = order === 'asc' ? 'ASC' : 'DESC';

    const rows = await this.clickhouse.query<TransactionRow>(`
      SELECT
        tx_hash,
        toString(block_number) AS block_number,
        from_address,
        to_address,
        toString(value_wei) AS value_wei,
        toString(gas_used) AS gas_used,
        toString(gas_price_wei) AS gas_price_wei,
        toString(timestamp) AS timestamp,
        toString(nonce) AS nonce
      FROM blockchain_data.transactions
      WHERE chain = '${escapeString(chainNorm)}'
        AND (lower(from_address) = '${escapeString(addrNorm)}' OR lower(to_address) = '${escapeString(addrNorm)}')
      ORDER BY timestamp ${orderDir}
      LIMIT ${limitNum} OFFSET ${offsetNum}
    `);
    return rows ?? [];
  }

  async getAddressTransactionCount(
    chain: string,
    address: string,
  ): Promise<number> {
    assertSlug(chain, 'chain');
    assertAddress(address);
    const chainNorm = chain.trim().toLowerCase();
    const addrNorm = address.trim().toLowerCase();

    const rows = await this.clickhouse.query<{ count: string }>(`
      SELECT count() AS count
      FROM blockchain_data.transactions
      WHERE chain = '${escapeString(chainNorm)}'
        AND (lower(from_address) = '${escapeString(addrNorm)}' OR lower(to_address) = '${escapeString(addrNorm)}')
    `);
    return parseInt(rows[0]?.count ?? '0', 10);
  }
}
