import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const companyCategorySchema = z.object({
  com_id: z.number(),
  cat_id: z.number(),
  order: z.number(),
  status: z.boolean(),
  created_employee: z.string(),
});

export type CompanyCategoryBodyType = z.infer<typeof companyCategorySchema>;

export type CompanyCategoryItemType = PrettyType<
  BaseType<CompanyCategoryBodyType>
>;

export const RVK_COMPANY_CATEGORY = 'company-category';
