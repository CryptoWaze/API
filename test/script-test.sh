#!/usr/bin/env bash
RESPONSE=$(curl -s -X POST http://localhost:3000/transactions/resolve \
  -H "Content-Type: application/json" \
  -d '{"txHash":"0x4839d30c5a57f89aa1ce7fbec9045ecc5a4ac617de588083ab9e984edb3533e3","reportedLossAmount":9369}')

echo "$RESPONSE" | jq

ADDRESS=$(echo "$RESPONSE" | jq -r '.seedTransfer.to // .transaction.toAddress')

echo ""
echo "--- Top transfers para $ADDRESS ---"
curl -s "http://localhost:3000/addresses/${ADDRESS}/top-transfers" | jq
