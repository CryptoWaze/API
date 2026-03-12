import { z } from 'zod';

const seedSchema = z.object({
  txHash: z.string().min(1).trim(),
  reportedLossAmount: z.number().finite().positive(),
});

export const createCaseSchema = z.object({
  name: z.string().min(1).trim(),
  seeds: z.array(seedSchema).min(1),
  mode: z.enum(['basic', 'advanced']).optional(),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
