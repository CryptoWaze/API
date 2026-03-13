import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type AlchemyEvmChain =
  | 'eth-mainnet'
  | 'polygon-mainnet'
  | 'base-mainnet'
  | 'bnb-mainnet';

type JsonRpcRequest = {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params: unknown[];
};

type JsonRpcError = {
  code: number;
  message: string;
  data?: unknown;
};

type JsonRpcResponse<T> = {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: JsonRpcError;
};

@Injectable()
export class AlchemyEvmRpcClient {
  private readonly apiKey: string;
  private readonly logger = new Logger(AlchemyEvmRpcClient.name);
  private lastRequestAt = 0;
  private static readonly MIN_INTERVAL_MS = Math.ceil(1000 / 23); // ~23 rps
  private static readonly MAX_RETRIES = 3;

  constructor(private readonly config: ConfigService) {
    const key = this.config.get<string>('ALCHEMY_API_KEY');
    if (!key) {
      throw new Error('ALCHEMY_API_KEY is not configured');
    }
    this.apiKey = key;
  }

  private resolveRpcUrl(chain: AlchemyEvmChain): string {
    switch (chain) {
      case 'eth-mainnet':
        return `https://eth-mainnet.g.alchemy.com/v2/${this.apiKey}`;
      case 'polygon-mainnet':
        return `https://polygon-mainnet.g.alchemy.com/v2/${this.apiKey}`;
      case 'base-mainnet':
        return `https://base-mainnet.g.alchemy.com/v2/${this.apiKey}`;
      case 'bnb-mainnet':
        return `https://bnb-mainnet.g.alchemy.com/v2/${this.apiKey}`;
      default: {
        const exhaustiveCheck: never = chain;
        throw new Error(`Unsupported Alchemy EVM chain: ${exhaustiveCheck}`);
      }
    }
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private async request<T>(
    chain: AlchemyEvmChain,
    method: string,
    params: unknown[],
  ): Promise<T> {
    const url = this.resolveRpcUrl(chain);
    const body: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    };

    let attempt = 0;
    // Simple rate limit: garante espaçamento mínimo entre requisições
    const now = Date.now();
    const diff = now - this.lastRequestAt;
    if (diff < AlchemyEvmRpcClient.MIN_INTERVAL_MS) {
      await this.sleep(AlchemyEvmRpcClient.MIN_INTERVAL_MS - diff);
    }

    // Retry com backoff exponencial
    // 1ª tentativa sem delay extra, depois 200ms, 500ms
    // Retry apenas em HTTP 429/5xx ou erros de rede/JSON-RPC
    // Erros óbvios de input (4xx) não são re-tentados.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      attempt += 1;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        this.lastRequestAt = Date.now();

        if (!response.ok) {
          const isRetriable =
            response.status === 429 || response.status >= 500;
          const text = await response.text().catch(() => '');
          const msg = `Alchemy RPC HTTP error ${
            response.status
          }: ${response.statusText} - ${text.slice(0, 200)}`;
          if (!isRetriable || attempt >= AlchemyEvmRpcClient.MAX_RETRIES) {
            throw new Error(msg);
          }
          this.logger.warn(
            `Retrying Alchemy request ${method} (attempt ${attempt}/${AlchemyEvmRpcClient.MAX_RETRIES}) due to HTTP status ${response.status}`,
          );
          const backoffMs =
            attempt === 1 ? 200 : attempt === 2 ? 500 : 1000;
          await this.sleep(backoffMs);
          continue;
        }

        const json = (await response.json()) as JsonRpcResponse<T>;
        if (json.error) {
          const isRetriable =
            json.error.code === 429 || json.error.code >= 500;
          const msg = `Alchemy RPC error ${json.error.code}: ${json.error.message}`;
          if (!isRetriable || attempt >= AlchemyEvmRpcClient.MAX_RETRIES) {
            throw new Error(msg);
          }
          this.logger.warn(
            `Retrying Alchemy request ${method} (attempt ${attempt}/${AlchemyEvmRpcClient.MAX_RETRIES}) due to RPC error ${json.error.code}`,
          );
          const backoffMs =
            attempt === 1 ? 200 : attempt === 2 ? 500 : 1000;
          await this.sleep(backoffMs);
          continue;
        }
        if (json.result === undefined) {
          throw new Error('Alchemy RPC response without result');
        }
        return json.result;
      } catch (err) {
        if (attempt >= AlchemyEvmRpcClient.MAX_RETRIES) {
          throw err;
        }
        this.logger.warn(
          `Retrying Alchemy request ${method} (attempt ${attempt}/${AlchemyEvmRpcClient.MAX_RETRIES}) due to network error: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        const backoffMs =
          attempt === 1 ? 200 : attempt === 2 ? 500 : 1000;
        await this.sleep(backoffMs);
      }
    }
  }

  async getBlockNumber(chain: AlchemyEvmChain): Promise<number> {
    const hex = await this.request<string>(chain, 'eth_blockNumber', []);
    return Number.parseInt(hex, 16);
  }

  async getBlockWithTransactions(
    chain: AlchemyEvmChain,
    block: number | 'latest',
  ): Promise<unknown> {
    const tag = block === 'latest' ? 'latest' : `0x${block.toString(16)}`;
    return this.request(chain, 'eth_getBlockByNumber', [tag, true]);
  }

  async getTransactionReceipt(
    chain: AlchemyEvmChain,
    txHash: string,
  ): Promise<unknown> {
    return this.request(chain, 'eth_getTransactionReceipt', [txHash]);
  }
}

