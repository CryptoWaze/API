import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { INGESTION_CHAINS } from '../../application/constants/domain.constants';
import { CatalogSyncService } from '../../infrastructure/blockchain/ingestion/catalog-sync.service';
import { EvmBlockIngestionService } from '../../infrastructure/blockchain/ingestion/evm-block-ingestion.service';
import type { AlchemyEvmChain } from '../../infrastructure/blockchain/alchemy/alchemy-evm-rpc.client';

type RunOnceBody = {
  chain: AlchemyEvmChain;
  startTimestampIso: string;
  maxBlocksPerRun?: number;
};

@ApiTags('Blockchain Data')
@Controller('_blockchain/ingestion')
export class BlockchainIngestionController {
  constructor(
    private readonly evmBlockIngestionService: EvmBlockIngestionService,
    private readonly catalogSyncService: CatalogSyncService,
  ) {}

  @Post('catalog-sync')
  @ApiOperation({
    summary: 'Sincronizar catálogos do Postgres para o ClickHouse',
    description:
      'Copia tokens, hot_wallets e exchanges do Postgres para o ClickHouse. Tokens só são copiados se a tabela estiver vazia (o cron mantém atualizado).',
  })
  async catalogSync() {
    return this.catalogSyncService.syncAll();
  }

  @Post('evm/run-once')
  @ApiOperation({
    summary: 'Rodar uma iteração de ingestão EVM',
    description:
      'Executa uma passada de ingestão de blocos EVM (Alchemy -> ClickHouse), respeitando checkpoint em blockchain_data.ingestion_state.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          enum: [...INGESTION_CHAINS],
        },
        startTimestampIso: {
          type: 'string',
          example: '2025-06-01T00:00:00.000Z',
        },
        maxBlocksPerRun: {
          type: 'integer',
          example: 100,
        },
      },
      required: ['chain', 'startTimestampIso'],
    },
  })
  async runOnce(@Body() body: RunOnceBody) {
    const { chain, startTimestampIso, maxBlocksPerRun = 100 } = body;
    return this.evmBlockIngestionService.runOnce({
      chain,
      startTimestampIso,
      maxBlocksPerRun,
    });
  }
}

