import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
