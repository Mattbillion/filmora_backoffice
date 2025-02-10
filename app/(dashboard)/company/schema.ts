import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

const phoneNumberSchema = z
  .string()
  .regex(/^[1-9]\d{7}$/, 'Утасны дугаар буруу! байна.');

export const companySchema = z.object({
  company_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  company_desc: z.string().min(2, {
    message: 'Body must be at least 2 characters.',
  }),
  company_register: z.string().min(3, {
    message: 'Registration must be at least 3 characters.',
  }),
  company_logo: z.string().optional(),
  company_email: z.string().email(),
  company_phone: phoneNumberSchema,
  company_phone2: phoneNumberSchema,
  company_location: z.string(),
  status: z.boolean(),
});

export type CompanyBodyType = z.infer<typeof companySchema>;

export type CompanyItemType = PrettyType<
  BaseType<
    CompanyBodyType & {
      created_employee?: string;
    }
  >
>;

export const RVK_COMPANY = 'company';
