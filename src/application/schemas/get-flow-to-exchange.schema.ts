import { z } from 'zod';

export const getFlowToExchangeSchema = z.object({
  address: z.string().min(1).trim(),
  chain: z.string().min(1).trim(),
});

export type GetFlowToExchangeInput = z.infer<typeof getFlowToExchangeSchema>;
