import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('hello')
@Controller('hello')
export class HelloController {
  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Mensagem de saudação.' })
  getHello(): { message: string } {
    return { message: 'Hello World!' };
  }
}
