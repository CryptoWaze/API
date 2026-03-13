export const BITGET_EXCHANGE = {
  name: 'Bitget',
  slug: 'bitget',
  iconUrl: null,
} as const;

export const BITGET_HOT_WALLETS_BY_CHAIN: Record<string, string[]> = {
  polygon: [
    '0x1ab4973a48dc892cd9971ece8e01dcc7688f8f23',
    '0x0639556f03714a74a5feef5736a4a64ff70d206',
  ],
  optimism: [
    '0x5bdf85216ec1e38d6458c870992a69e38e03f7ef',
    '0x1ab4973a48dc892cd9971ece8e01dcc7688f8f23',
  ],
  bsc: [
    '0x97b9d2102a9a65a26e1ee82d59e42d1b73b68689',
    '0x1ab4973a48dc892cd9971ece8e01dcc7688f8f23',
    '0x1084203d70950bd7a93aef75eb32a51df2422a07',
    '0x864a7fa57e0f8902a2de4892e925f1272edbe3fa',
    '0x5bdf85216ec1e38d6458c870992a69e38e03f7ef',
    '0xbcf6011192399df75a96b0a4ce47c4820853e9e5',
    '0x0639556f03714a74a5feef5736a4a64ff70d206',
  ],
  tron: [
    'TJ7hhYhVhaxNx6BPyq7yFpqZrQULL3JSdb',
    'TFrRVZFoHty7scd2a1q6BDxPU5fyqiB4iR',
  ],
  solana: [
    '9C4o5US5dLeTNJBgxr1kLNNJCBVEyMSuPvWRfWwRPXnW',
    'A77HErqtfN1hLLpvZ9pCtu66FEtM8BveoaKbbMoZ4RiR',
    'GKYR3YtYoPpBjuUuAqXD6CVV7sDGndcRkpjqP3WSKSU8',
    '9Bs5Ghc3HR6ujoCSnegZAchcs2QZ8rU35fJ6GFoU2DBU',
    '7wdg7rBNueisn6pxFgMriRXB9qjEErD8mG53u7wbQe8x',
    '2gBqYSLYJRy444Nz5qpxohetQc4nHqhJhr59hWZk1pa6',
    'CvSPcJsVi9wHx5KQe7sk5M9m14FMizuJygrSNVwUGnQc',
    '2HRyAi7ka1S68Q4pBtHc7j1qca1q8m8G14cJj4apPq3c',
    '3YGMNsUBQvFUTFVXdAAc7sEAEKbdDHmf9f4eXyg9uRjd',
    'FxjUAhDD9n7mim9YUgxuK4VJSRcBxskmqGKgGkrysnc',
    'GygCQjU9eTr3WivrstviJhJqbDL4tnoAjGXCGo1XzEub',
    '6ovYKB6MfsMVS7GesgteZxtRZgsFkoa6pMVx7LK5NcJa',
  ],
  eth: [
    '0x1ab4973a48dc892cd9971ece8e01dcc7688f8f23',
    '0x0639556f03714a74a5feef5736a4a64ff70d206',
    '0x5bdf85216ec1e38d6458c870992a69e38e03f7ef',
    '0x97b9d2102a9a65a26e1ee82d59e42d1b73b68689',
  ],
  arbitrum: ['0x1ab4973a48dc892cd9971ece8e01dcc7688f8f23'],
  base: ['0x97b9d2102a9a65a26e1ee82d59e42d1b73b68689'],
  bitcoin: ['1FWQiwK27EnGXb6BiBMRLJvunJQZZPMcGd'],
};
