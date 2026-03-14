import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { AlchemyEvmChain } from '../alchemy/alchemy-evm-rpc.client';
import { INGESTION_CHAINS } from '../../../application/constants/domain.constants';
import { EvmBlockIngestionService } from './evm-block-ingestion.service';

const CHAINS = INGESTION_CHAINS as unknown as AlchemyEvmChain[];

function getYesterdayUtc(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Injectable()
export class EvmDailyIngestionJobService {
  private readonly logger = new Logger(EvmDailyIngestionJobService.name);
  private running = false;

  constructor(
    private readonly blockIngestion: EvmBlockIngestionService,
  ) {}

  @Cron('0 1 * * *', { timeZone: 'UTC' })
  async handleDailyIngestion(): Promise<void> {
    if (process.env.DAILY_INGESTION_JOB_ENABLED !== 'true') {
      this.logger.debug(
        'Job diário de ingestão desativado (DAILY_INGESTION_JOB_ENABLED != true).',
      );
      return;
    }
    if (this.running) {
      this.logger.warn(
        'Job diário ignorado: execução anterior ainda em andamento.',
      );
      return;
    }

    this.running = true;
    const dateIso = getYesterdayUtc();
    this.logger.log(
      `Iniciando job diário de ingestão para data ${dateIso} (UTC).`,
    );

    try {
      const results: Array<{
        chain: string;
        processedBlocks: number;
        processedTransactions: number;
        processedLogs: number;
        skipped: boolean;
        reason?: string;
      }> = [];

      for (const chain of CHAINS) {
        try {
          const result = await this.blockIngestion.runForDate({
            chain,
            dateIso,
          });
          results.push({
            chain,
            processedBlocks: result.processedBlocks,
            processedTransactions: result.processedTransactions,
            processedLogs: result.processedLogs,
            skipped: result.skipped,
            reason: result.reason,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          this.logger.error(
            `Job diário falhou para chain=${chain} data=${dateIso}: ${message}`,
          );
          results.push({
            chain,
            processedBlocks: 0,
            processedTransactions: 0,
            processedLogs: 0,
            skipped: true,
            reason: 'error',
          });
        }
      }

      const totalBlocks = results.reduce((s, r) => s + r.processedBlocks, 0);
      const totalTxs = results.reduce((s, r) => s + r.processedTransactions, 0);
      const totalLogs = results.reduce((s, r) => s + r.processedLogs, 0);
      this.logger.log(
        `Job diário concluído para ${dateIso}. Blocos: ${totalBlocks}, transações: ${totalTxs}, logs: ${totalLogs}.`,
      );
    } finally {
      this.running = false;
    }
  }
}
