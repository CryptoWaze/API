import {
  BadGatewayException,
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { GetFlowToExchangeInput } from '../schemas/get-flow-to-exchange.schema';
import type {
  FollowFlowToExchangeResult,
  FlowStep,
  WalletTransfer,
} from '../types';
import {
  ADDRESS_TRANSFERS_FETCHER,
  type IAddressTransfersFetcher,
} from '../ports/address-transfers-fetcher.port';
import {
  HOT_WALLET_CHECKER,
  type IHotWalletChecker,
} from '../ports/hot-wallet-checker.port';

const MAX_HOPS = 10;

function toCovalentChainId(slug: string): string {
  return `${slug}-mainnet`;
}

function normalizeAddress(address: string): string {
  const a = address.trim();
  if (a.startsWith('0x')) return a.toLowerCase();
  return a;
}

function pickLargestOutbound(
  transfers: WalletTransfer[],
): WalletTransfer | null {
  const out = transfers.filter((t) => t.direction === 'OUT');
  if (out.length === 0) return null;
  let best = out[0];
  for (let i = 1; i < out.length; i++) {
    if (BigInt(out[i].rawAmount) > BigInt(best.rawAmount)) best = out[i];
  }
  return best;
}

@Injectable()
export class FollowFlowToExchangeUseCase {
  private readonly logger = new Logger(FollowFlowToExchangeUseCase.name);

  constructor(
    @Inject(ADDRESS_TRANSFERS_FETCHER)
    private readonly addressTransfersFetcher: IAddressTransfersFetcher,
    @Inject(HOT_WALLET_CHECKER)
    private readonly hotWalletChecker: IHotWalletChecker,
  ) {}

  async execute(
    input: GetFlowToExchangeInput,
  ): Promise<FollowFlowToExchangeResult> {
    try {
      const chainSlug = input.chain.trim();
      const covalentChainId = toCovalentChainId(chainSlug);
      const startAddress = normalizeAddress(input.address);
      const result = await this.traceFlow(
        covalentChainId,
        chainSlug,
        startAddress,
      );
      if (result === null) {
        throw new NotFoundException(
          `Nenhum fluxo até exchange encontrado a partir desta carteira (máx. ${MAX_HOPS} saltos).`,
        );
      }
      return result;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`followFlowToExchange failed: ${message}`);
      if (/Covalent API error: (500|502|503)/.test(message)) {
        throw new BadGatewayException(
          'Serviço de transações temporariamente indisponível. Tente novamente mais tarde.',
        );
      }
      throw new InternalServerErrorException(
        'Erro ao rastrear fluxo até exchange.',
      );
    }
  }

  private async traceFlow(
    covalentChainId: string,
    chainSlug: string,
    startAddress: string,
  ): Promise<FollowFlowToExchangeResult | null> {
    const steps: FlowStep[] = [];
    let currentAddress = startAddress;

    for (let hop = 0; hop < MAX_HOPS; hop++) {
      const isHot = await this.hotWalletChecker.isHotWallet(
        chainSlug,
        currentAddress,
      );
      if (isHot) {
        return {
          chain: chainSlug,
          steps,
          endpointAddress: currentAddress,
        };
      }

      const transfers = await this.addressTransfersFetcher.getAddressTransfers(
        covalentChainId,
        currentAddress,
      );
      const largest = pickLargestOutbound(transfers);
      if (largest === null) return null;

      const nextAddress = normalizeAddress(largest.counterparty);
      steps.push({
        fromAddress: currentAddress,
        toAddress: nextAddress,
        transfer: largest,
      });
      currentAddress = nextAddress;
    }

    return null;
  }
}
