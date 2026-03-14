export const HOT_WALLET_CHECKER = Symbol('HOT_WALLET_CHECKER');

export type IHotWalletChecker = {
  isHotWallet(chain: string, address: string): Promise<boolean>;
  getHotWalletAddressesForChain(chainSlug: string): Promise<Set<string>>;
};
