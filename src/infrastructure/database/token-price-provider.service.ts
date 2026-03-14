import { Injectable } from '@nestjs/common';
import type {
  ITokenPriceProvider,
  TokenInfo,
} from '../../application/ports/token-price-provider.port';
import { ClickHouseClient } from '../blockchain/clickhouse/clickhouse.client';

type ClickHouseTokenRow = {
  symbol: string;
  current_price_usd: string | null;
  image_url: string | null;
};

function escapeForClickHouse(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

@Injectable()
export class TokenPriceProviderService implements ITokenPriceProvider {
  constructor(private readonly clickhouse: ClickHouseClient) {}

  async getPriceInUsd(symbol: string): Promise<number | null> {
    const map = await this.getTokenInfoBatch([symbol]);
    const key = symbol.trim().toLowerCase();
    return map.get(key)?.priceUsd ?? null;
  }

  async getTokenInfoBatch(symbols: string[]): Promise<Map<string, TokenInfo>> {
    const normalized = [...new Set(symbols.map((s) => s.trim().toLowerCase()))];
    if (normalized.length === 0) return new Map();

    try {
      const inList = normalized
        .map((s) => `'${escapeForClickHouse(s)}'`)
        .join(',');
      const rows = await this.clickhouse.query<ClickHouseTokenRow>(`
        SELECT symbol, current_price_usd, image_url
        FROM blockchain_data.tokens
        WHERE lower(symbol) IN (${inList})
        LIMIT 1 BY symbol
      `);

    const map = new Map<string, TokenInfo>();
    for (const sym of normalized) {
      const token = rows.find((r) => r.symbol?.toLowerCase() === sym);
      const priceUsd =
        token?.current_price_usd != null && token.current_price_usd !== ''
          ? Number.parseFloat(token.current_price_usd)
          : null;
      map.set(sym, {
        priceUsd:
          priceUsd != null && !Number.isNaN(priceUsd) ? priceUsd : null,
        imageUrl: token?.image_url ?? null,
      });
    }
    return map;
    } catch {
      return new Map();
    }
  }

  async getAllTokenInfo(): Promise<Map<string, TokenInfo>> {
    try {
      const rows = await this.clickhouse.query<ClickHouseTokenRow>(`
        SELECT symbol, current_price_usd, image_url
        FROM blockchain_data.tokens
        LIMIT 1 BY symbol
      `);
    const map = new Map<string, TokenInfo>();
    for (const token of rows) {
      const sym = token.symbol?.trim().toLowerCase();
      if (!sym) continue;
      const priceUsd =
        token.current_price_usd != null && token.current_price_usd !== ''
          ? Number.parseFloat(token.current_price_usd)
          : null;
      map.set(sym, {
        priceUsd:
          priceUsd != null && !Number.isNaN(priceUsd) ? priceUsd : null,
        imageUrl: token?.image_url ?? null,
      });
    }
    return map;
    } catch {
      return new Map();
    }
  }
}
