import { z } from 'zod';

export const getAddressTopTransfersSchema = z.object({
  address: z.string().min(1).trim(),
});

export type GetAddressTopTransfersInput = z.infer<
  typeof getAddressTopTransfersSchema
>;
