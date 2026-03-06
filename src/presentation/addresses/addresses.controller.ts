import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { getAddressTopTransfersSchema } from '../../application/schemas/get-address-top-transfers.schema';
import { GetAddressTopTransfersUseCase } from '../../application/use-cases/get-address-top-transfers.use-case';
import type { GetAddressTopTransfersResult } from '../../application/types';

@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly getAddressTopTransfersUseCase: GetAddressTopTransfersUseCase,
  ) {}

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
}
