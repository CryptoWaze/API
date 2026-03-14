export const TOKEN_PRICE_PROVIDER = Symbol('TOKEN_PRICE_PROVIDER');

export type TokenInfo = {
  priceUsd: number | null;
  imageUrl: string | null;
};

export interface ITokenPriceProvider {
  getPriceInUsd(symbol: string): Promise<number | null>;
  getTokenInfoBatch(symbols: string[]): Promise<Map<string, TokenInfo>>;
  getAllTokenInfo(): Promise<Map<string, TokenInfo>>;
}
