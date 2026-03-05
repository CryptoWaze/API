import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email().toLowerCase(),
  name: z.string().min(1).max(255).optional(),
  password: z.string().min(6),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
