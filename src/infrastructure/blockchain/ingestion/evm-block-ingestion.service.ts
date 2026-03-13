import { Injectable, Logger } from '@nestjs/common';
import {
  AlchemyEvmRpcClient,
  type AlchemyEvmChain,
} from '../alchemy/alchemy-evm-rpc.client';
import { ClickHouseClient } from '../clickhouse/clickhouse.client';
import { EvmIngestionService } from './evm-ingestion.service';

type EvmTransaction = {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  nonce: string;
  gas: string;
  gasPrice?: string;
};

type EvmBlock = {
  number: string;
  hash: string;
  parentHash: string;
  timestamp: string;
  transactions: EvmTransaction[];
};

function hexToNumber(hex: string | null | undefined): number {
  if (!hex) return 0;
  const cleaned = hex.trim();
  if (!cleaned) return 0;
  return Number.parseInt(cleaned, 16);
}

function toIsoFromSeconds(seconds: number): string {
  return new Date(seconds * 1000).toISOString();
}

function escapeString(value: string | null | undefined): string {
  if (value == null) return '';
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function alchemyChainToSlug(chain: AlchemyEvmChain): string {
  if (chain === 'eth-mainnet') return 'eth';
  if (chain === 'polygon-mainnet') return 'polygon';
  if (chain === 'base-mainnet') return 'base';
  if (chain === 'bnb-mainnet') return 'bsc';
  return chain;
}

@Injectable()
export class EvmBlockIngestionService {
  constructor(
    private readonly alchemy: AlchemyEvmRpcClient,
    private readonly clickhouse: ClickHouseClient,
    private readonly ingestion: EvmIngestionService,
  ) {}

  private readonly logger = new Logger(EvmBlockIngestionService.name);

  async runOnce(params: {
    chain: AlchemyEvmChain;
    startTimestampIso: string;
    maxBlocksPerRun: number;
  }): Promise<{
    fromBlock: number | null;
    toBlock: number | null;
    processedBlocks: number;
    processedTransactions: number;
  }> {
    const { chain, startTimestampIso, maxBlocksPerRun } = params;
    this.logger.log(
      `Iniciando runOnce para chain=${chain}, start=${startTimestampIso}, maxBlocksPerRun=${maxBlocksPerRun}`,
    );
    const range = await this.ingestion.getNextRange(
      chain,
      startTimestampIso,
      maxBlocksPerRun,
    );
    if (!range) {
      this.logger.log(
        `Nenhum bloco a processar para chain=${chain}, start=${startTimestampIso} (paused/completed ou sem novos blocos).`,
      );
      return {
        fromBlock: null,
        toBlock: null,
        processedBlocks: 0,
        processedTransactions: 0,
      };
    }

    const { fromBlock, toBlock } = range;
    this.logger.log(
      `Processando blocos de ${fromBlock} até ${toBlock} para chain=${chain}.`,
    );
    const chainSlug = alchemyChainToSlug(chain);
    let processedBlocks = 0;
    let processedTransactions = 0;

    for (let blockNumber = fromBlock; blockNumber <= toBlock; blockNumber++) {
      this.logger.debug(
        `Buscando bloco ${blockNumber} na chain=${chain} via Alchemy...`,
      );
      const rawBlock = (await this.alchemy.getBlockWithTransactions(
        chain,
        blockNumber,
      )) as EvmBlock;

      const tsSeconds = hexToNumber(rawBlock.timestamp);
      const iso = toIsoFromSeconds(tsSeconds);
      const blockHash = rawBlock.hash;
      const parentHash = rawBlock.parentHash;
      const txs = rawBlock.transactions ?? [];
      const txCount = txs.length;

      const blockSql = `
INSERT INTO blockchain_data.blocks
  (chain, block_number, block_hash, parent_hash, timestamp, tx_count, source, ingested_at, complete)
VALUES
  ('${chainSlug}', ${blockNumber}, '${escapeString(blockHash)}', '${escapeString(
        parentHash,
      )}', parseDateTime64BestEffort('${iso}', 3, 'UTC'), ${txCount}, 'alchemy', now64(3), 1)
`;
      await this.clickhouse.exec(blockSql);
      this.logger.debug(
        `Bloco ${blockNumber} (${blockHash}) salvo em blockchain_data.blocks com ${txCount} transações.`,
      );

      if (txCount > 0) {
        const txValues = txs
          .map((tx) => {
            const valueWei = hexToNumber(tx.value);
            const gas = hexToNumber(tx.gas);
            const gasPrice = hexToNumber(tx.gasPrice ?? '0x0');
            const nonce = hexToNumber(tx.nonce);
            const to = tx.to ?? '';
            return `('${chainSlug}','${escapeString(
              tx.hash,
            )}',${blockNumber},'${escapeString(
              tx.from,
            )}','${escapeString(to)}',${nonce},${valueWei},${gas},${gasPrice})`;
          })
          .join(',\n    ');

        const txSql = `
INSERT INTO blockchain_data.transactions
  (chain, tx_hash, block_number, from_address, to_address, nonce, value_wei, gas_used, gas_price_wei)
VALUES
  ${txValues}
`;
        await this.clickhouse.exec(txSql);
        this.logger.debug(
          `Salvas ${txCount} transações do bloco ${blockNumber} em blockchain_data.transactions.`,
        );
      }

      processedBlocks += 1;
      processedTransactions += txCount;
      await this.ingestion.advanceCheckpoint(
        chain,
        startTimestampIso,
        blockNumber,
      );
      this.logger.debug(
        `Checkpoint avançado para lastBlockIndexed=${blockNumber} (chain=${chain}).`,
      );
    }

    this.logger.log(
      `runOnce finalizado para chain=${chain}. Blocos processados: ${processedBlocks}, transações: ${processedTransactions} (range ${fromBlock}-${toBlock}).`,
    );

    return {
      fromBlock,
      toBlock,
      processedBlocks,
      processedTransactions,
    };
  }
}

