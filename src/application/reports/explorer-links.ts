const EXPLORER_BASE: Record<string, string> = {
  eth: 'https://etherscan.io',
  bsc: 'https://bscscan.com',
  polygon: 'https://polygonscan.com',
  avalanche: 'https://snowtrace.io',
  arbitrum: 'https://arbiscan.io',
  optimism: 'https://optimistic.etherscan.io',
  base: 'https://basescan.org',
  tron: 'https://tronscan.org',
  bitcoin: 'https://mempool.space',
  solana: 'https://solscan.io',
  dogecoin: 'https://dogechain.info',
  ton: 'https://tonscan.org',
  flare: 'https://flare-explorer.flare.network',
  zcash: 'https://explorer.zcha.in',
};

export function txExplorerUrl(chainSlug: string, txHash: string): string {
  const base = EXPLORER_BASE[chainSlug.toLowerCase()] ?? 'https://etherscan.io';
  if (chainSlug.toLowerCase() === 'bitcoin' || chainSlug.toLowerCase() === 'solana') {
    return `${base}/tx/${txHash}`;
  }
  if (chainSlug.toLowerCase() === 'tron') {
    return `${base}/#/transaction/${txHash}`;
  }
  return `${base}/tx/${txHash}`;
}

export function addressExplorerUrl(chainSlug: string, address: string): string {
  const base = EXPLORER_BASE[chainSlug.toLowerCase()] ?? 'https://etherscan.io';
  if (chainSlug.toLowerCase() === 'tron') {
    return `${base}/#/address/${address}`;
  }
  return `${base}/address/${address}`;
}
