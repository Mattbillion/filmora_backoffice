import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const categorySchema = z.object({
  cat_type: z.string(),
  cat_name: z.string(),
  root: z.number().optional(),
  order: z.number(),
  special: z.boolean(),
  description: z.string(),
  image: z.string(),
  ancestors: z.array(z.number().optional()),
});

export type CategoryBodyType = z.infer<typeof categorySchema>;

export type CategoryItemType = PrettyType<BaseType<CategoryBodyType>>;

export type HierarchicalCategory = CategoryItemType & {
  children: HierarchicalCategory[];
};

export const RVK_CATEGORY = 'category';
