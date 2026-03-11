import { z } from 'zod';

const positionSchema = z.union([
  z.literal('default'),
  z.object({
    x: z.number().finite(),
    y: z.number().finite(),
  }),
]);

export const updateFlowWalletSchema = z.object({
  nickname: z.string().trim().nullable().optional(),
  position: positionSchema.optional(),
});

export type UpdateFlowWalletInput = z.infer<typeof updateFlowWalletSchema>;
