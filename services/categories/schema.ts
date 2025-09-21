import { z } from 'zod';

export const categoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  is_adult: z.boolean().optional(),
});

export type CategoryResponseType = z.infer<typeof categoryResponseSchema>;

export const baseResponseListUnionCategoryResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(categoryResponseSchema),
  total_count: z.number().optional(),
});

export type BaseResponseListUnionCategoryResponseNoneTypeType = z.infer<
  typeof baseResponseListUnionCategoryResponseNoneTypeSchema
>;

export const baseResponseUnionCategoryResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: categoryResponseSchema,
  total_count: z.number().optional(),
});

export type BaseResponseUnionCategoryResponseNoneTypeType = z.infer<
  typeof baseResponseUnionCategoryResponseNoneTypeSchema
>;

export const categoryCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  is_adult: z.boolean().optional(),
});

export type CategoryCreateType = z.infer<typeof categoryCreateSchema>;

export const categoryUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  is_adult: z.boolean().optional(),
});

export type CategoryUpdateType = z.infer<typeof categoryUpdateSchema>;

export const baseResponseUnionDictNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({}),
  total_count: z.number().optional(),
});

export type BaseResponseUnionDictNoneTypeType = z.infer<
  typeof baseResponseUnionDictNoneTypeSchema
>;

export const RVK_CATEGORIES = 'categories';
