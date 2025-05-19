import { z } from 'zod';

import type { BaseType, ID, PrettyType } from '@/lib/fetch/types';

export const categoryAttributesSchema = z.object({
  com_id: z.number(),
  cat_id: z.number(),
  attr_name: z.string(),
  attr_desc: z.string(),
  attr_type: z.string(),
  display_order: z.number(),
  status: z.boolean(),
});

export type CategoryAttributesBodyType = z.infer<
  typeof categoryAttributesSchema
>;

export type CategoryAttributesItemType = PrettyType<
  BaseType<CategoryAttributesBodyType>
>;

export type CategoryAttributesValueItemType = BaseType<{
  com_id: ID;
  cat_id: ID;
  attr_id: ID;
  value: string;
  display_order: number;
  status: Boolean;
}>;

export const RVK_CATEGORY_ATTRIBUTES = 'category-attributes';

export const RVK_CATEGORY_ATTRIBUTE_VALUES = 'category-attribute-values';
