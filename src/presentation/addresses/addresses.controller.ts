import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { getAddressTopTransfersSchema } from '../../application/schemas/get-address-top-transfers.schema';
import { getAddressTopTransfersPaginatedSchema } from '../../application/schemas/get-address-top-transfers-paginated.schema';
import { getAddressTopTransfersHistorySchema } from '../../application/schemas/get-address-top-transfers-history.schema';
import { getFlowToExchangeSchema } from '../../application/schemas/get-flow-to-exchange.schema';
import { GetAddressTopTransfersUseCase } from '../../application/use-cases/get-address-top-transfers.use-case';
import { GetAddressTopTransfersPaginatedUseCase } from '../../application/use-cases/get-address-top-transfers-paginated.use-case';
import { GetAddressTopTransfersHistoryUseCase } from '../../application/use-cases/get-address-top-transfers-history.use-case';
import { FollowFlowToExchangeUseCase } from '../../application/use-cases/follow-flow-to-exchange.use-case';
import { FollowFlowToExchangeFullHistoryUseCase } from '../../application/use-cases/follow-flow-to-exchange-full-history.use-case';
import type {
  GetAddressTopTransfersResult,
  GetAddressTopTransfersPaginatedResult,
  GetAddressTopTransfersHistoryResult,
  FollowFlowToExchangeResult,
} from '../../application/types';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly getAddressTopTransfersUseCase: GetAddressTopTransfersUseCase,
    private readonly getAddressTopTransfersPaginatedUseCase: GetAddressTopTransfersPaginatedUseCase,
    private readonly getAddressTopTransfersHistoryUseCase: GetAddressTopTransfersHistoryUseCase,
    private readonly followFlowToExchangeUseCase: FollowFlowToExchangeUseCase,
    private readonly followFlowToExchangeFullHistoryUseCase: FollowFlowToExchangeFullHistoryUseCase,
  ) {}

  @Get(':address/top-transfers/paginated')
  @ApiOperation({
    summary: 'Top 3 saídas por página',
    description: 'Retorna as 3 maiores transferências de saída de uma página específica (API paginada).',
  })
  @ApiParam({ name: 'address', description: 'Endereço da carteira' })
  @ApiQuery({ name: 'chain', description: 'Slug da chain (ex: bsc, eth)', required: true })
  @ApiQuery({ name: 'page', description: 'Número da página (0-based)', required: true })
  @ApiResponse({ status: 200, description: 'Lista das 3 maiores saídas da página.' })
  async getTopTransfersPaginated(
    @Param('address') address: string,
    @Query('chain') chain: string,
    @Query('page') page: string,
  ): Promise<GetAddressTopTransfersPaginatedResult> {
    const result = getAddressTopTransfersPaginatedSchema.safeParse({
      address,
      chain,
      page,
    });
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.getAddressTopTransfersPaginatedUseCase.execute(result.data);
  }

  @Get(':address/top-transfers/history')
  @ApiOperation({
    summary: 'Top 3 saídas do histórico',
    description: 'Percorre todas as páginas do histórico e retorna as 3 maiores transferências de saída da carteira.',
  })
  @ApiParam({ name: 'address', description: 'Endereço da carteira' })
  @ApiQuery({ name: 'chain', description: 'Slug da chain (ex: bsc, eth)', required: true })
  @ApiResponse({ status: 200, description: 'As 3 maiores saídas de todo o histórico.' })
  async getTopTransfersHistory(
    @Param('address') address: string,
    @Query('chain') chain: string,
  ): Promise<GetAddressTopTransfersHistoryResult> {
    const result = getAddressTopTransfersHistorySchema.safeParse({
      address,
      chain,
    });
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.getAddressTopTransfersHistoryUseCase.execute(result.data);
  }

  @Get(':address/top-transfers')
  @ApiOperation({
    summary: 'Top 3 saídas recentes',
    description: 'Retorna as 3 maiores transferências de saída recentes (ETH e BSC).',
  })
  @ApiParam({ name: 'address', description: 'Endereço da carteira' })
  @ApiResponse({ status: 200, description: 'Objeto com transfers por chain (eth-mainnet, bsc-mainnet).' })
  async getTopTransfers(
    @Param('address') address: string,
  ): Promise<GetAddressTopTransfersResult> {
    const result = getAddressTopTransfersSchema.safeParse({ address });
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.getAddressTopTransfersUseCase.execute(result.data);
  }

  @Get(':address/flow-to-exchange/full-history')
  @ApiOperation({
    summary: 'Fluxo até exchange (histórico completo)',
    description:
      'Para cada carteira, percorre todo o histórico (API paginada), escolhe a maior saída e segue até a próxima, até encontrar uma hot wallet. Limite de 50 carteiras.',
  })
  @ApiParam({ name: 'address', description: 'Endereço da carteira de partida' })
  @ApiQuery({ name: 'chain', description: 'Slug da chain (ex: bsc, eth)', required: true })
  @ApiResponse({ status: 200, description: 'Passos do fluxo e endereço da hot wallet de destino.' })
  @ApiResponse({ status: 404, description: 'Nenhum fluxo até exchange encontrado (máx. 50 carteiras).' })
  async getFlowToExchangeFullHistory(
    @Param('address') address: string,
    @Query('chain') chain: string,
  ): Promise<FollowFlowToExchangeResult> {
    const result = getFlowToExchangeSchema.safeParse({ address, chain });
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.followFlowToExchangeFullHistoryUseCase.execute(result.data);
  }

  @Get(':address/flow-to-exchange')
  @ApiOperation({
    summary: 'Fluxo até exchange',
    description:
      'Segue a maior saída da carteira, depois a maior saída da próxima, até encontrar uma hot wallet cadastrada.',
  })
  @ApiParam({ name: 'address', description: 'Endereço da carteira de partida' })
  @ApiQuery({ name: 'chain', description: 'Slug da chain (ex: bsc, eth)', required: true })
  @ApiResponse({ status: 200, description: 'Passos do fluxo e endereço da hot wallet de destino.' })
  @ApiResponse({ status: 404, description: 'Nenhum fluxo até exchange encontrado (máx. 10 saltos).' })
  async getFlowToExchange(
    @Param('address') address: string,
    @Query('chain') chain?: string,
  ): Promise<FollowFlowToExchangeResult> {
    const result = getFlowToExchangeSchema.safeParse({ address, chain });
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new BadRequestException(messages);
    }
    return this.followFlowToExchangeUseCase.execute(result.data);
  }
}
