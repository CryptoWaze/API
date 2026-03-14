import { Injectable } from '@nestjs/common';
import type { IHotWalletChecker } from '../../application/ports/hot-wallet-checker.port';
import { normalizeAddress } from '../../application/utils/blockchain.utils';
import { PrismaService } from './prisma.service';

@Injectable()
export class HotWalletCheckerService implements IHotWalletChecker {
  constructor(private readonly prisma: PrismaService) {}

  async isHotWallet(chainSlug: string, address: string): Promise<boolean> {
    const normalized = normalizeAddress(address);
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- Prisma client from generated code */
    const chainRecord = await this.prisma.chain.findUnique({
      where: { slug: chainSlug },
      select: { id: true },
    });
    if (!chainRecord) return false;

    const hotWallet = await this.prisma.hotWallet.findFirst({
      where: {
        chainId: chainRecord.id,
        address: normalized,
      },
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
    return hotWallet !== null;
  }

  async getHotWalletAddressesForChain(chainSlug: string): Promise<Set<string>> {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- Prisma client from generated code */
    const chainRecord = await this.prisma.chain.findUnique({
      where: { slug: chainSlug },
      select: { id: true },
    });
    if (!chainRecord) return new Set();

    const hotWallets = await this.prisma.hotWallet.findMany({
      where: { chainId: chainRecord.id },
      select: { address: true },
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
    return new Set(hotWallets.map((hw) => normalizeAddress(hw.address)));
  }
}
