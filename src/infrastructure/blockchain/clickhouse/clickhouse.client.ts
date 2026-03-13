import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type ClickHouseQueryResult<T> = {
  data: T[];
};

@Injectable()
export class ClickHouseClient {
  private readonly baseUrl: string;
  private readonly authHeader: string | null;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('CLICKHOUSE_URL');
    if (!url) {
      throw new Error('CLICKHOUSE_URL is not configured');
    }
    // URL sem credenciais (ex.: http://localhost:8123)
    this.baseUrl = url.replace(/\/+$/, '');

    const user = this.config.get<string>('CLICKHOUSE_USER') ?? '';
    const password = this.config.get<string>('CLICKHOUSE_PASSWORD') ?? '';
    if (user && password) {
      const token = Buffer.from(`${user}:${password}`).toString('base64');
      this.authHeader = `Basic ${token}`;
    } else {
      this.authHeader = null;
    }
  }

  async exec(sql: string): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        ...(this.authHeader ? { authorization: this.authHeader } : {}),
      },
      body: sql,
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `ClickHouse exec error ${response.status}: ${response.statusText} - ${text}`,
      );
    }
  }

  async query<T>(sql: string): Promise<T[]> {
    const withFormat =
      sql.trim().toUpperCase().endsWith('FORMAT JSON')
        ? sql
        : `${sql.trim()} FORMAT JSON`;
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        ...(this.authHeader ? { authorization: this.authHeader } : {}),
      },
      body: withFormat,
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `ClickHouse query error ${response.status}: ${response.statusText} - ${text}`,
      );
    }
    const json = (await response.json()) as ClickHouseQueryResult<T>;
    return json.data ?? [];
  }
}

