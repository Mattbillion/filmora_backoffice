import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const employeeSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    phone: z.string(),
    email: z.string(),
    profile: z.string(),
    email_verified: z.boolean(),
    company_id: z.number(),
    status: z.boolean(),
    last_logged_at: z.null().optional(),
    password: z.string().min(6).optional(),
    confirmPassword: z.string().min(6).optional(),
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

export const employeeChangePassword = z.object({
  company_id: z.number(),
  password: z.string().min(6),
});

export const employeeChangeEmail = z.object({
  email: z.string().min(6).optional(),
  company_id: z.number(),
});

export type EmployeeBodyType = z.infer<typeof employeeSchema>;
export type EmployeeChangePasswordBody = z.infer<typeof employeeChangePassword>;
export type EmployeeChangeEmailBody = z.infer<typeof employeeChangeEmail>;

export type EmployeeItemType = PrettyType<BaseType<EmployeeBodyType>>;

export const RVK_EMPLOYEE = 'employee';
