import { Injectable } from '@nestjs/common';
import type { IHotWalletChecker } from '../../application/ports/hot-wallet-checker.port';
import { PrismaService } from './prisma.service';

function normalizeAddressForLookup(address: string): string {
  const a = address.trim();
  if (a.startsWith('0x')) return a.toLowerCase();
  return a;
}

@Injectable()
export class HotWalletCheckerService implements IHotWalletChecker {
  constructor(private readonly prisma: PrismaService) {}

  async isHotWallet(chainSlug: string, address: string): Promise<boolean> {
    const normalized = normalizeAddressForLookup(address);
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
}
