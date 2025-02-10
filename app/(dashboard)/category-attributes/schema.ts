import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const categoryAttributesSchema = z.object({
  id: z.number(),
  com_id: z.number(),
  cat_id: z.number(),
  attr_name: z.string(),
  attr_desc: z.string(),
  attr_type: z.string(),
  display_order: z.number(),
  status: z.boolean(),
  created_at: z.string(),
  updated_at: z.null(),
  created_employee: z.string(),
});

export type CategoryAttributesBodyType = z.infer<
  typeof categoryAttributesSchema
>;

export type CategoryAttributesItemType = PrettyType<
  BaseType<CategoryAttributesBodyType>
>;

export const RVK_CATEGORY_ATTRIBUTES = 'category-attributes';
