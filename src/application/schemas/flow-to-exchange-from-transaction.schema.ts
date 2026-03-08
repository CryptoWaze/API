import { z } from 'zod';

export const flowToExchangeFromTransactionSchema = z.object({
  txHash: z.string().min(1).trim(),
  reportedLossAmount: z.number().finite().positive(),
  traceId: z.string().min(1).trim().optional(),
});

export type FlowToExchangeFromTransactionInput = z.infer<
  typeof flowToExchangeFromTransactionSchema
>;
