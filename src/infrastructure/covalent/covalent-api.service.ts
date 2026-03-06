import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  ITransactionFetcher,
  TransactionWithTransfers,
} from '../../application/ports/transaction-fetcher.port';
import {
  mapCovalentResponseToTransfers,
  type CovalentItem,
} from './covalent-mapper';

const API_BASE = 'https://api.covalenthq.com/v1';

@Injectable()
export class CovalentApiService implements ITransactionFetcher {
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('GOLDRUSH_API_KEY');
    if (!key) {
      throw new Error('GOLDRUSH_API_KEY is required in environment');
    }
    this.apiKey = key;
  }

  async getTransactionWithTransfers(
    chain: string,
    txHash: string,
  ): Promise<TransactionWithTransfers | null> {
    const path = `${chain}/transaction_v2/${txHash}`;
    const data = (await this.fetchJson(path)) as {
      data?: { items?: CovalentItem[] };
    };
    const items = data.data?.items ?? [];
    if (items.length === 0) return null;

    const first = items[0];
    const transfers = mapCovalentResponseToTransfers(items, chain);

    return {
      fromAddress: first.from_address ?? '',
      toAddress: first.to_address ?? '',
      blockSignedAt: first.block_signed_at ?? '',
      transfers,
    };
  }

  private async fetchJson(
    path: string,
    params: Record<string, string | number | undefined> = {},
  ): Promise<unknown> {
    const normalizedPath = path.endsWith('/') ? path : `${path}/`;
    const url = new URL(`${API_BASE}/${normalizedPath}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        url.searchParams.set(key, String(value));
    });
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (!res.ok) {
      throw new Error(
        `Covalent API error: ${res.status} ${res.statusText} – ${await res.text()}`,
      );
    }
    return res.json();
  }
}
