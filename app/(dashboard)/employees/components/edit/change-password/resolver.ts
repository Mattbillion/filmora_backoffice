import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Нууц үг заавал 8-аас дээш оронтой байна.')
      .refine((value) => /[!@#$&*,.?":{}|<>]/.test(value), {
        message: 'Нууц үг нь заавал нэг тусгай тэмдэгт агуулна. (!@#$%^&*)',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Нууц үг заавал нэг том үсэгтэй байна. (A-Z).',
      }),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Таны оруулсан нууц үг хоорондоо таарахгүй байна.',
        path: ['confirmPassword'],
      });
    }
  });
