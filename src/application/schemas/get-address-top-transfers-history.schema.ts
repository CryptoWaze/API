import { z } from 'zod';

export const getAddressTopTransfersHistorySchema = z.object({
  address: z.string().min(1).trim(),
  chain: z.string().min(1).trim(),
});

export type GetAddressTopTransfersHistoryInput = z.infer<
  typeof getAddressTopTransfersHistorySchema
>;
