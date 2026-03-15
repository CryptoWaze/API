import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetChainsUseCase } from '../../application/use-cases/get-chains.use-case';

@ApiTags('chains')
@Controller('chains')
export class ChainsController {
  constructor(private readonly getChainsUseCase: GetChainsUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Listar chains',
    description: 'Retorna slug, nome e URL do ícone de cada chain cadastrada.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de chains com nome e foto (iconUrl).',
  })
  async list() {
    return this.getChainsUseCase.execute();
  }
}
