import { z } from 'zod';

export const genreResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type GenreResponseType = z.infer<typeof genreResponseSchema>;

export const baseResponseUnionListGenreResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(genreResponseSchema),
  total_count: z.number().optional(),
});

export type BaseResponseUnionListGenreResponseNoneTypeType = z.infer<
  typeof baseResponseUnionListGenreResponseNoneTypeSchema
>;

export const baseResponseUnionGenreResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: genreResponseSchema,
  total_count: z.number().optional(),
});

export type BaseResponseUnionGenreResponseNoneTypeType = z.infer<
  typeof baseResponseUnionGenreResponseNoneTypeSchema
>;

export const genreCreateSchema = z.object({
  name: z.string(),
});

export type GenreCreateType = z.infer<typeof genreCreateSchema>;

export const genreUpdateSchema = z.object({
  name: z.string().optional(),
});

export type GenreUpdateType = z.infer<typeof genreUpdateSchema>;

export const baseResponseUnionDictNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({}),
  total_count: z.number().optional(),
});

export type BaseResponseUnionDictNoneTypeType = z.infer<
  typeof baseResponseUnionDictNoneTypeSchema
>;

export const RVK_GENRES = 'genres';
