import { z } from 'zod';

const positionSchema = z.union([
  z.literal('default'),
  z.object({
    x: z.number().finite(),
    y: z.number().finite(),
  }),
]);

export const editCaseSchema = z.object({
  name: z.string().min(1).trim().optional(),
  wallets: z
    .array(
      z.object({
        walletId: z.string().min(1).trim(),
        nickname: z.string().trim().nullable().optional(),
        position: positionSchema.optional(),
      }),
    )
    .optional(),
  softDeleteFlows: z
    .array(
      z.object({
        flowId: z.string().min(1).trim(),
      }),
    )
    .optional(),
  softDeleteTransactions: z
    .array(
      z.object({
        flowId: z.string().min(1).trim(),
        transactionId: z.string().min(1).trim(),
      }),
    )
    .optional(),
});

export type EditCaseInput = z.infer<typeof editCaseSchema>;

