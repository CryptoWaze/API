import { Injectable, Logger } from '@nestjs/common';
import { AlchemyEvmRpcClient, type AlchemyEvmChain } from '../alchemy/alchemy-evm-rpc.client';
import {
  EvmIngestionStateRepository,
  type IngestionState,
} from './evm-ingestion-state.repository';

@Injectable()
export class EvmIngestionService {
  constructor(
    private readonly alchemy: AlchemyEvmRpcClient,
    private readonly stateRepo: EvmIngestionStateRepository,
  ) {}

  private readonly logger = new Logger(EvmIngestionService.name);

  async ensureStateForChain(
    chain: AlchemyEvmChain,
    startTimestampIso: string,
  ): Promise<IngestionState> {
    await this.stateRepo.ensureTable();
    const existing = await this.stateRepo.getState(chain);
    if (existing) {
      this.logger.debug(
        `Estado de ingestão existente encontrado para chain=${chain}: startBlock=${existing.startBlock}, lastBlockIndexed=${existing.lastBlockIndexed}, status=${existing.status}.`,
      );
      return existing;
    }

    this.logger.log(
      `Nenhum estado de ingestão encontrado para chain=${chain}. Calculando bloco inicial a partir de ${startTimestampIso}...`,
    );
    const startBlock = await this.findStartBlockForTimestamp(
      chain,
      startTimestampIso,
    );
    const initialState: IngestionState = {
      chain,
      startTimestamp: startTimestampIso,
      startBlock,
      lastBlockIndexed: startBlock - 1,
      status: 'RUNNING',
    };
    await this.stateRepo.upsertState(initialState);
    this.logger.log(
      `Estado inicial criado para chain=${chain}: startBlock=${startBlock}, lastBlockIndexed=${startBlock - 1}.`,
    );
    return initialState;
  }

  async getState(chain: AlchemyEvmChain): Promise<IngestionState | null> {
    return this.stateRepo.getState(chain);
  }

  async getNextRange(
    chain: AlchemyEvmChain,
    startTimestampIso: string,
    maxBlocksPerRun: number,
  ): Promise<{ fromBlock: number; toBlock: number } | null> {
    const state = await this.ensureStateForChain(chain, startTimestampIso);
    if (state.status === 'PAUSED' || state.status === 'COMPLETED') {
      this.logger.log(
        `Ingestão não avançará para chain=${chain} porque status=${state.status}.`,
      );
      return null;
    }

    const tip = await this.alchemy.getBlockNumber(chain);
    const fromBlock = state.lastBlockIndexed + 1;
    if (fromBlock > tip) {
      this.logger.debug(
        `Nenhum bloco novo para chain=${chain}. lastBlockIndexed=${state.lastBlockIndexed}, tip=${tip}.`,
      );
      return null;
    }

    const toBlock = Math.min(fromBlock + maxBlocksPerRun - 1, tip);
    this.logger.debug(
      `Próximo range para chain=${chain}: fromBlock=${fromBlock}, toBlock=${toBlock}, tip=${tip}.`,
    );
    return { fromBlock, toBlock };
  }

  async advanceCheckpoint(
    chain: AlchemyEvmChain,
    startTimestampIso: string,
    lastBlockIndexed: number,
  ): Promise<void> {
    const state = await this.ensureStateForChain(chain, startTimestampIso);
    const next: IngestionState = {
      ...state,
      lastBlockIndexed,
      status: 'RUNNING',
    };
    await this.stateRepo.upsertState(next);
    this.logger.debug(
      `Checkpoint atualizado para chain=${chain}: lastBlockIndexed=${lastBlockIndexed}.`,
    );
  }

  async pause(chain: AlchemyEvmChain, startTimestampIso: string): Promise<void> {
    const state = await this.ensureStateForChain(chain, startTimestampIso);
    await this.stateRepo.upsertState({ ...state, status: 'PAUSED' });
    this.logger.log(
      `Ingestão pausada para chain=${chain} (start=${startTimestampIso}).`,
    );
  }

  async markCompleted(
    chain: AlchemyEvmChain,
    startTimestampIso: string,
  ): Promise<void> {
    const state = await this.ensureStateForChain(chain, startTimestampIso);
    await this.stateRepo.upsertState({ ...state, status: 'COMPLETED' });
    this.logger.log(
      `Ingestão marcada como COMPLETED para chain=${chain} (start=${startTimestampIso}).`,
    );
  }

  async getBlockRangeForDate(
    chain: AlchemyEvmChain,
    dateIso: string,
  ): Promise<{ startBlock: number; endBlock: number } | null> {
    const dateOnly = dateIso.trim().split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      throw new Error(`Invalid dateIso (expected YYYY-MM-DD): ${dateIso}`);
    }
    const startOfDay = `${dateOnly}T00:00:00.000Z`;
    const nextDay = new Date(startOfDay);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const startOfNextDay = nextDay.toISOString();

    const startBlock = await this.getBlockNumberForTimestamp(chain, startOfDay);
    const firstBlockNextDay = await this.getBlockNumberForTimestamp(
      chain,
      startOfNextDay,
    );
    const endBlock = firstBlockNextDay - 1;
    if (startBlock > endBlock) {
      return null;
    }
    return { startBlock, endBlock };
  }

  async getBlockNumberForTimestamp(
    chain: AlchemyEvmChain,
    timestampIso: string,
  ): Promise<number> {
    return this.findStartBlockForTimestamp(chain, timestampIso);
  }

  private async findStartBlockForTimestamp(
    chain: AlchemyEvmChain,
    startTimestampIso: string,
  ): Promise<number> {
    const targetMs = new Date(startTimestampIso).getTime();
    if (Number.isNaN(targetMs)) {
      throw new Error(`Invalid startTimestampIso: ${startTimestampIso}`);
    }

    const tip = await this.alchemy.getBlockNumber(chain);

    let low = 0;
    let high = tip;
    let candidate = tip;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const block = (await this.alchemy.getBlockWithTransactions(
        chain,
        mid,
      )) as { timestamp: string };
      const tsMs = Number.parseInt(block.timestamp, 16) * 1000;

      if (tsMs >= targetMs) {
        candidate = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return candidate;
  }
}

