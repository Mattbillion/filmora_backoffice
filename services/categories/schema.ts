// services/categories/schema.ts
import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  is_adult: z.boolean(),
});

export const CategoriesResponseSchema = z.object({
  status: z.string(), // or z.literal("success") if you want to lock it
  message: z.string(),
  data: z.array(CategorySchema),
  total_count: z.number().int().nonnegative().optional(), // include if your API returns it
});

// Types you’ll use in TS
export type Category = z.output<typeof CategorySchema>;
export type CategoriesResponse = z.output<typeof CategoriesResponseSchema>;
