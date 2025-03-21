import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const companySchema = z.object({
  company_name: z.string(),
  company_desc: z.string(),
  company_register: z.string(),
  company_logo: z.string(),
  company_email: z.string(),
  company_phone: z.string(),
  company_phone2: z.string(),
  company_location: z.string(),
  status: z.boolean(),
});

export type CompanyBodyType = z.infer<typeof companySchema>;

export type CompanyItemType = PrettyType<BaseType<CompanyBodyType>>;

export const RVK_COMPANY = 'company';
