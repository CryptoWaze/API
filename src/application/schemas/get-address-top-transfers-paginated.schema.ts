import { z } from 'zod';

export const getAddressTopTransfersPaginatedSchema = z.object({
  address: z.string().min(1).trim(),
  chain: z.string().min(1).trim(),
  page: z.coerce.number().int().min(0),
});

export type GetAddressTopTransfersPaginatedInput = z.infer<
  typeof getAddressTopTransfersPaginatedSchema
>;
