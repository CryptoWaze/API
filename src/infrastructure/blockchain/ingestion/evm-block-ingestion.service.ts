import { Injectable, Logger } from '@nestjs/common';
import {
  AlchemyEvmRpcClient,
  type AlchemyEvmChain,
} from '../alchemy/alchemy-evm-rpc.client';
import { ClickHouseClient } from '../clickhouse/clickhouse.client';
import { EvmIngestionService } from './evm-ingestion.service';
import { EvmSchemaRepository } from './evm-schema.repository';

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

type EvmLog = {
  address: string;
  topics: string[];
  data: string;
};

type EvmReceipt = {
  logs?: EvmLog[];
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
    private readonly schemaRepo: EvmSchemaRepository,
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
    processedLogs: number;
  }> {
    const { chain, startTimestampIso, maxBlocksPerRun } = params;
    await this.schemaRepo.ensureTables();
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
        processedLogs: 0,
      };
    }

    const { fromBlock, toBlock } = range;
    this.logger.log(
      `Processando blocos de ${fromBlock} até ${toBlock} para chain=${chain}.`,
    );
    const chainSlug = alchemyChainToSlug(chain);
    let processedBlocks = 0;
    let processedTransactions = 0;
    let processedLogs = 0;

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
            )}','${escapeString(to)}',${nonce},${valueWei},${gas},${gasPrice},parseDateTime64BestEffort('${iso}', 3, 'UTC'))`;
          })
          .join(',\n    ');

        const txSql = `
INSERT INTO blockchain_data.transactions
  (chain, tx_hash, block_number, from_address, to_address, nonce, value_wei, gas_used, gas_price_wei, timestamp)
VALUES
  ${txValues}
`;
        await this.clickhouse.exec(txSql);
        this.logger.debug(
          `Salvas ${txCount} transações do bloco ${blockNumber} em blockchain_data.transactions.`,
        );

        const txHashes = txs.map((tx) => tx.hash);
        const receipts = await this.alchemy.getTransactionReceiptsBatch(
          chain,
          txHashes,
        );

        const allLogs: {
          txHash: string;
          logIndex: number;
          contractAddress: string;
          topic0: string;
          topic1: string | null;
          topic2: string | null;
          topic3: string | null;
          data: string;
        }[] = [];

        for (let i = 0; i < receipts.length; i++) {
          const receipt = receipts[i] as EvmReceipt | null;
          const txHash = txHashes[i];
          if (!receipt?.logs?.length) continue;
          for (let j = 0; j < receipt.logs.length; j++) {
            const log = receipt.logs[j];
            const topics = log.topics ?? [];
            allLogs.push({
              txHash,
              logIndex: j,
              contractAddress: log.address ?? '',
              topic0: topics[0] ?? '',
              topic1: topics[1] ?? null,
              topic2: topics[2] ?? null,
              topic3: topics[3] ?? null,
              data: log.data ?? '',
            });
          }
        }

        const formatTopic = (t: string | null) =>
          t == null ? 'NULL' : `'${escapeString(t)}'`;

        if (allLogs.length > 0) {
          const logValues = allLogs
            .map(
              (l) =>
                `('${chainSlug}','${escapeString(
                  l.txHash,
                )}',${blockNumber},${l.logIndex},'${escapeString(
                  l.contractAddress,
                )}','${escapeString(l.topic0)}',${formatTopic(l.topic1)},${formatTopic(
                  l.topic2,
                )},${formatTopic(l.topic3)},'${escapeString(
                  l.data,
                )}',parseDateTime64BestEffort('${iso}', 3, 'UTC'))`,
            )
            .join(',\n    ');

          const logSql = `
INSERT INTO blockchain_data.logs
  (chain, tx_hash, block_number, log_index, contract_address, topic0, topic1, topic2, topic3, data, timestamp)
VALUES
  ${logValues}
`;
          await this.clickhouse.exec(logSql);
          processedLogs += allLogs.length;
          this.logger.debug(
            `Salvos ${allLogs.length} logs do bloco ${blockNumber} em blockchain_data.logs.`,
          );
        }
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
      `runOnce finalizado para chain=${chain}. Blocos: ${processedBlocks}, transações: ${processedTransactions}, logs: ${processedLogs} (range ${fromBlock}-${toBlock}).`,
    );

    return {
      fromBlock,
      toBlock,
      processedBlocks,
      processedTransactions,
      processedLogs,
    };
  }

  async runForDate(params: {
    chain: AlchemyEvmChain;
    dateIso: string;
  }): Promise<{
    dateIso: string;
    fromBlock: number | null;
    toBlock: number | null;
    processedBlocks: number;
    processedTransactions: number;
    processedLogs: number;
    skipped: boolean;
    reason?: string;
  }> {
    const { chain, dateIso } = params;
    await this.schemaRepo.ensureTables();

    const range = await this.ingestion.getBlockRangeForDate(chain, dateIso);
    if (!range) {
      this.logger.log(
        `Nenhum bloco para a data ${dateIso} na chain=${chain}.`,
      );
      return {
        dateIso,
        fromBlock: null,
        toBlock: null,
        processedBlocks: 0,
        processedTransactions: 0,
        processedLogs: 0,
        skipped: true,
        reason: 'no_blocks_for_date',
      };
    }

    const state = await this.ingestion.getState(chain);
    if (!state) {
      this.logger.log(
        `Estado de ingestão não encontrado para chain=${chain}. Executar backfill antes do job diário.`,
      );
      return {
        dateIso,
        fromBlock: null,
        toBlock: null,
        processedBlocks: 0,
        processedTransactions: 0,
        processedLogs: 0,
        skipped: true,
        reason: 'no_ingestion_state',
      };
    }

    const fromBlock = Math.max(
      range.startBlock,
      state.lastBlockIndexed + 1,
    );
    const toBlock = range.endBlock;

    if (fromBlock > toBlock) {
      this.logger.log(
        `Blocos do dia ${dateIso} já indexados para chain=${chain} (lastBlockIndexed=${state.lastBlockIndexed}).`,
      );
      return {
        dateIso,
        fromBlock: null,
        toBlock: null,
        processedBlocks: 0,
        processedTransactions: 0,
        processedLogs: 0,
        skipped: true,
        reason: 'already_indexed',
      };
    }

    this.logger.log(
      `Job diário: processando blocos ${fromBlock}-${toBlock} para chain=${chain} (data ${dateIso}).`,
    );

    const chainSlug = alchemyChainToSlug(chain);
    let processedBlocks = 0;
    let processedTransactions = 0;
    let processedLogs = 0;

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
            )}','${escapeString(to)}',${nonce},${valueWei},${gas},${gasPrice},parseDateTime64BestEffort('${iso}', 3, 'UTC'))`;
          })
          .join(',\n    ');

        const txSql = `
INSERT INTO blockchain_data.transactions
  (chain, tx_hash, block_number, from_address, to_address, nonce, value_wei, gas_used, gas_price_wei, timestamp)
VALUES
  ${txValues}
`;
        await this.clickhouse.exec(txSql);

        const txHashes = txs.map((tx) => tx.hash);
        const receipts = await this.alchemy.getTransactionReceiptsBatch(
          chain,
          txHashes,
        );

        const allLogs: {
          txHash: string;
          logIndex: number;
          contractAddress: string;
          topic0: string;
          topic1: string | null;
          topic2: string | null;
          topic3: string | null;
          data: string;
        }[] = [];

        for (let i = 0; i < receipts.length; i++) {
          const receipt = receipts[i] as EvmReceipt | null;
          const txHash = txHashes[i];
          if (!receipt?.logs?.length) continue;
          for (let j = 0; j < receipt.logs.length; j++) {
            const log = receipt.logs[j];
            const topics = log.topics ?? [];
            allLogs.push({
              txHash,
              logIndex: j,
              contractAddress: log.address ?? '',
              topic0: topics[0] ?? '',
              topic1: topics[1] ?? null,
              topic2: topics[2] ?? null,
              topic3: topics[3] ?? null,
              data: log.data ?? '',
            });
          }
        }

        const formatTopic = (t: string | null) =>
          t == null ? 'NULL' : `'${escapeString(t)}'`;

        if (allLogs.length > 0) {
          const logValues = allLogs
            .map(
              (l) =>
                `('${chainSlug}','${escapeString(
                  l.txHash,
                )}',${blockNumber},${l.logIndex},'${escapeString(
                  l.contractAddress,
                )}','${escapeString(l.topic0)}',${formatTopic(l.topic1)},${formatTopic(
                  l.topic2,
                )},${formatTopic(l.topic3)},'${escapeString(
                  l.data,
                )}',parseDateTime64BestEffort('${iso}', 3, 'UTC'))`,
            )
            .join(',\n    ');

          const logSql = `
INSERT INTO blockchain_data.logs
  (chain, tx_hash, block_number, log_index, contract_address, topic0, topic1, topic2, topic3, data, timestamp)
VALUES
  ${logValues}
`;
          await this.clickhouse.exec(logSql);
          processedLogs += allLogs.length;
        }
      }

      processedBlocks += 1;
      processedTransactions += txCount;
      await this.ingestion.advanceCheckpoint(
        chain,
        state.startTimestamp,
        blockNumber,
      );
    }

    this.logger.log(
      `Job diário finalizado para chain=${chain} data=${dateIso}. Blocos: ${processedBlocks}, transações: ${processedTransactions}, logs: ${processedLogs}.`,
    );

    return {
      dateIso,
      fromBlock,
      toBlock,
      processedBlocks,
      processedTransactions,
      processedLogs,
      skipped: false,
    };
  }
}

