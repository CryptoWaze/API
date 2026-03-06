import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { getAddressTopTransfersSchema } from '../../application/schemas/get-address-top-transfers.schema';
import { getAddressTopTransfersPaginatedSchema } from '../../application/schemas/get-address-top-transfers-paginated.schema';
import { getAddressTopTransfersHistorySchema } from '../../application/schemas/get-address-top-transfers-history.schema';
import { getFlowToExchangeSchema } from '../../application/schemas/get-flow-to-exchange.schema';
import { GetAddressTopTransfersUseCase } from '../../application/use-cases/get-address-top-transfers.use-case';
import { GetAddressTopTransfersPaginatedUseCase } from '../../application/use-cases/get-address-top-transfers-paginated.use-case';
import { GetAddressTopTransfersHistoryUseCase } from '../../application/use-cases/get-address-top-transfers-history.use-case';
import { FollowFlowToExchangeUseCase } from '../../application/use-cases/follow-flow-to-exchange.use-case';
import type {
  GetAddressTopTransfersResult,
  GetAddressTopTransfersPaginatedResult,
  GetAddressTopTransfersHistoryResult,
  FollowFlowToExchangeResult,
} from '../../application/types';

@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly getAddressTopTransfersUseCase: GetAddressTopTransfersUseCase,
    private readonly getAddressTopTransfersPaginatedUseCase: GetAddressTopTransfersPaginatedUseCase,
    private readonly getAddressTopTransfersHistoryUseCase: GetAddressTopTransfersHistoryUseCase,
    private readonly followFlowToExchangeUseCase: FollowFlowToExchangeUseCase,
  ) {}

  @Get(':address/top-transfers/paginated')
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

  @Get(':address/flow-to-exchange')
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
