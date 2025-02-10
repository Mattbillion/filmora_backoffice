import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const ageRestrictionsSchema = z.object({
  id: z.number(),
  age_name: z.string(),
  age_limit: z.string(),
  age_desc: z.string(),
  age_order: z.number(),
  min_age: z.number(),
  max_age: z.number(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.null(),
  created_employee: z.string(),
});

export type AgeRestrictionsBodyType = z.infer<typeof ageRestrictionsSchema>;

export type AgeRestrictionsItemType = PrettyType<
  BaseType<AgeRestrictionsBodyType>
>;

export const RVK_AGE_RESTRICTIONS = 'age-restrictions';
