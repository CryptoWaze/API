import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTopTokensUseCase } from '../../application/use-cases/get-top-tokens.use-case';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly getTopTokensUseCase: GetTopTokensUseCase) {}

  @Get('top-500')
  @ApiOperation({
    summary: 'Top 500 tokens',
    description:
      'Retorna nome e imagem dos 500 tokens com maior market cap rank no Postgres.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de até 500 tokens com symbol, name e imageUrl.',
  })
  async top500() {
    return this.getTopTokensUseCase.execute();
  }
}
