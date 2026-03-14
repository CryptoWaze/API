export function normalizeAddress(address: string): string {
  const a = address.trim();
  if (a.startsWith('0x')) return a.toLowerCase();
  return a;
}

export function chainToSlug(chain: string): string {
  const t = chain.trim();
  if (t.endsWith('-mainnet')) return t.slice(0, -'-mainnet'.length);
  return t;
}

export function toCovalentChainId(slug: string): string {
  return `${slug.trim()}-mainnet`;
}
