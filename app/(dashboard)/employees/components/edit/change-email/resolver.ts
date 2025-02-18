import { z } from 'zod';

export const changeEmailSchema = z.object({
  email: z.string().email({
    message: 'Имэйл хаягаа оруулна уу?',
  }),
});
