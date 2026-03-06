const BASE = 'http://localhost:3000';
const TX_HASH =
  '0x4839d30c5a57f89aa1ce7fbec9045ecc5a4ac617de588083ab9e984edb3533e3';
const REPORTED_LOSS = 9369;

const resolveRes = await fetch(`${BASE}/transactions/resolve`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    txHash: TX_HASH,
    reportedLossAmount: REPORTED_LOSS,
  }),
});

if (!resolveRes.ok) {
  console.error('Resolve failed:', resolveRes.status, await resolveRes.text());
  process.exit(1);
}

const resolveJson = (await resolveRes.json()) as {
  seedTransfer?: { to?: string };
  transaction?: { toAddress?: string };
};

console.log(JSON.stringify(resolveJson, null, 2));

const address =
  resolveJson.seedTransfer?.to ?? resolveJson.transaction?.toAddress ?? '';

if (!address) {
  console.error('No address in response');
  process.exit(1);
}

console.log('\n--- Top transfers para', address, '---\n');

const topRes = await fetch(
  `${BASE}/addresses/${encodeURIComponent(address)}/top-transfers`,
);

if (!topRes.ok) {
  console.error('Top transfers failed:', topRes.status, await topRes.text());
  process.exit(1);
}

const topJson = (await topRes.json()) as Record<
  string,
  { transfers: unknown[] }
>;
console.log(JSON.stringify(topJson, null, 2));
