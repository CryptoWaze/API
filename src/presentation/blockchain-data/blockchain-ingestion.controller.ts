import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  ) {}

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
          enum: ['eth-mainnet', 'polygon-mainnet', 'base-mainnet', 'bnb-mainnet'],
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

