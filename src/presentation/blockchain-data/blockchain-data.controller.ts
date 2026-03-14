import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlockchainDataQueryService } from '../../infrastructure/blockchain/blockchain-data-query.service';

@ApiTags('Blockchain Data')
@Controller('_blockchain')
export class BlockchainDataController {
  constructor(
    private readonly queryService: BlockchainDataQueryService,
  ) {}

  @Get('exchanges/:exchangeSlug/hot-wallets')
  @ApiOperation({
    summary: 'Hot wallets de uma exchange',
    description:
      'Lista todas as hot wallets de uma exchange (dados do ClickHouse). Opcionalmente filtra por chain.',
  })
  @ApiParam({
    name: 'exchangeSlug',
    description: 'Slug da exchange (ex.: binance, gate).',
  })
  @ApiQuery({
    name: 'chain',
    required: false,
    description: 'Filtrar por slug da chain (ex.: eth, bsc).',
  })
  @ApiResponse({ status: 200, description: 'Lista de hot wallets.' })
  async getExchangeHotWallets(
    @Param('exchangeSlug') exchangeSlug: string,
    @Query('chain') chain?: string,
  ) {
    const items = await this.queryService.getHotWalletsByExchange(
      exchangeSlug,
      chain,
    );
    return {
      exchangeSlug: exchangeSlug.trim().toLowerCase(),
      chain: chain?.trim() ? chain.trim().toLowerCase() : null,
      total: items.length,
      items: items.map((r) => ({
        id: r.id,
        exchangeSlug: r.exchange_slug,
        chainSlug: r.chain_slug,
        address: r.address,
        label: r.label,
        isActive: r.is_active === '1',
      })),
    };
  }

  @Get(':chain/address/:address/summary')
  @ApiOperation({
    summary: 'Resumo de uma carteira',
    description:
      'Retorna contagem de transações, primeira e última transação. Saldo não disponível (dados apenas do ClickHouse).',
  })
  @ApiParam({ name: 'chain', description: 'Slug da chain (ex.: eth, bsc).' })
  @ApiParam({ name: 'address', description: 'Endereço da carteira.' })
  @ApiResponse({ status: 200, description: 'Resumo da carteira.' })
  async getAddressSummary(
    @Param('chain') chain: string,
    @Param('address') address: string,
  ) {
    return this.queryService.getAddressSummary(chain, address);
  }

  @Get(':chain/address/:address/transactions')
  @ApiOperation({
    summary: 'Transações recentes de uma carteira',
    description:
      'Lista transações em que a carteira é origem ou destino (dados do ClickHouse, paginado).',
  })
  @ApiParam({ name: 'chain', description: 'Slug da chain (ex.: eth, bsc).' })
  @ApiParam({ name: 'address', description: 'Endereço da carteira.' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Máximo de registros (default: 100, máx. 1000).',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset para paginação (default: 0).',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Ordenação por timestamp (default: desc).',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de transações.' })
  async getAddressTransactions(
    @Param('chain') chain: string,
    @Param('address') address: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    const limitNum = limit != null ? parseInt(limit, 10) : 100;
    const offsetNum = offset != null ? parseInt(offset, 10) : 0;
    const orderDir = order === 'asc' ? 'asc' : 'desc';
    const items = await this.queryService.getAddressTransactions(
      chain,
      address,
      limitNum,
      offsetNum,
      orderDir,
    );
    const total = await this.queryService.getAddressTransactionCount(
      chain,
      address,
    );
    return {
      chain: chain.trim().toLowerCase(),
      address: address.trim().toLowerCase(),
      total,
      limit: limitNum,
      offset: offsetNum,
      order: orderDir,
      items: items.map((r) => ({
        txHash: r.tx_hash,
        blockNumber: parseInt(r.block_number, 10),
        fromAddress: r.from_address,
        toAddress: r.to_address,
        valueWei: r.value_wei,
        gasUsed: r.gas_used,
        gasPriceWei: r.gas_price_wei,
        timestamp: r.timestamp,
        nonce: parseInt(r.nonce, 10),
      })),
    };
  }

  @Get(':chain/address/:address/transfers')
  @ApiOperation({
    summary: 'Listar transfers de um endereço',
    description:
      'Equivalente aos endpoints de address activity da Covalent. Retorna transfers normalizadas por endereço, com filtros de data, direção e valor em USD.',
  })
  @ApiParam({ name: 'chain', description: 'Slug da chain (ex.: eth, bsc).' })
  @ApiParam({
    name: 'address',
    description: 'Endereço da carteira a consultar.',
  })
  @ApiQuery({
    name: 'fromTimestamp',
    required: false,
    description:
      'Timestamp mínimo (ISO 8601). Se informado, só traz transfers a partir dessa data.',
  })
  @ApiQuery({
    name: 'toTimestamp',
    required: false,
    description: 'Timestamp máximo (ISO 8601).',
  })
  @ApiQuery({
    name: 'direction',
    required: false,
    enum: ['IN', 'OUT', 'BOTH'],
    description: 'Direção das transfers: IN, OUT ou BOTH (padrão).',
  })
  @ApiQuery({
    name: 'minUsd',
    required: false,
    type: Number,
    description: 'Valor mínimo em USD para filtrar transfers (default: 0).',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Página (default: 1).',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Tamanho da página (default: 100, máx. 1000).',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description:
      'Ordenação por timestamp (ascendente ou descendente). Default: desc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de transfers normalizadas.',
  })
  getAddressTransfers(
    @Param('chain') chain: string,
    @Param('address') address: string,
    @Query('fromTimestamp') fromTimestamp?: string,
    @Query('toTimestamp') toTimestamp?: string,
    @Query('direction') direction: 'IN' | 'OUT' | 'BOTH' = 'BOTH',
    @Query('minUsd') minUsd?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return {
      chain,
      address,
      fromTimestamp: fromTimestamp ?? null,
      toTimestamp: toTimestamp ?? null,
      direction,
      minUsd: minUsd != null ? Number(minUsd) : 0,
      page: page != null ? Number(page) || 1 : 1,
      pageSize: pageSize != null ? Number(pageSize) || 100 : 100,
      order,
      total: 0,
      items: [],
      note:
        'Stub do módulo Blockchain Data. Implementação de leitura no ClickHouse será adicionada em seguida.',
    };
  }

  // GET /_blockchain/:chain/address/:address/top-outbounds/full-history
  @Get(':chain/address/:address/top-outbounds/full-history')
  @ApiOperation({
    summary: 'Top outbounds por valor USD (histórico completo)',
    description:
      'Equivalente ao cálculo de top outbounds da Covalent para o rastreador. Retorna as maiores transfers de saída em USD para a carteira, ao longo de todo o histórico disponível.',
  })
  @ApiParam({ name: 'chain', description: 'Slug da chain (ex.: eth, bsc).' })
  @ApiParam({
    name: 'address',
    description: 'Endereço da carteira a consultar.',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
    description: 'Quantidade máxima de transfers a retornar.',
  })
  @ApiQuery({
    name: 'fromTimestamp',
    required: false,
    description:
      'Timestamp mínimo (ISO 8601). Se informado, só considera transfers após essa data.',
  })
  @ApiQuery({
    name: 'minUsd',
    required: false,
    type: Number,
    description:
      'Valor mínimo em USD para considerar uma transfer (default: 100).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista das maiores transfers de saída em USD.',
  })
  getTopOutboundsFullHistory(
    @Param('chain') chain: string,
    @Param('address') address: string,
    @Query('limit') limit: string,
    @Query('fromTimestamp') fromTimestamp?: string,
    @Query('minUsd') minUsd?: string,
  ) {
    const limitNum = Number(limit);
    return {
      chain,
      address,
      fromTimestamp: fromTimestamp ?? null,
      minUsd: minUsd != null ? Number(minUsd) : 100,
      limit: Number.isFinite(limitNum) && limitNum > 0 ? limitNum : 100,
      items: [],
      note:
        'Stub do módulo Blockchain Data. Implementação de leitura no ClickHouse será adicionada em seguida.',
    };
  }
}
