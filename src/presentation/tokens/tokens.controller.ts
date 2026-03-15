import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTopTokensUseCase } from '../../application/use-cases/get-top-tokens.use-case';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  constructor(private readonly getTopTokensUseCase: GetTopTokensUseCase) {}

  @Get('top-100')
  @ApiOperation({
    summary: 'Top 100 tokens',
    description:
      'Retorna nome e imagem dos 100 tokens com maior market cap rank no Postgres.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de até 100 tokens com symbol, name e imageUrl.',
  })
  async top100() {
    return this.getTopTokensUseCase.execute();
  }
}
