import { z } from 'zod';

export const updateCaseSchema = z.object({
  name: z.string().min(1).trim().optional(),
});

export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;

