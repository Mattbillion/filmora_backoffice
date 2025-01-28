import { z } from 'zod';

export const authFormSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(2),
});
