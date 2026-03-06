import { z } from 'zod';

export const resolveTransactionSchema = z.object({
  txHash: z.string().min(1).trim(),
  reportedLossAmount: z.number().finite().positive().optional(),
});

export type ResolveTransactionInput = z.infer<typeof resolveTransactionSchema>;
