import { Injectable } from '@nestjs/common';
import type { CoinGeckoMarketItem } from './coingecko-api.types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

@Injectable()
export class CoingeckoApiService {
  async getMarketsPage(page: number): Promise<CoinGeckoMarketItem[]> {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '250',
      page: String(page),
      sparkline: 'false',
    });
    const url = `${BASE_URL}/coins/markets?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `CoinGecko API error: ${res.status} ${res.statusText}`,
      );
    }
    const data = (await res.json()) as CoinGeckoMarketItem[];
    return data;
  }
}
