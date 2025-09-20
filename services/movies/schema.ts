import { z } from 'zod';

export const categoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  is_adult: z.boolean().optional(),
});

export type CategoryResponseType = z.infer<typeof categoryResponseSchema>;

export const movieResponseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['movie', 'series']),
  year: z.number().optional(),
  price: z.number().optional(),
  is_premium: z.boolean().optional(),
  poster_url: z.string().optional(),
  is_adult: z.boolean().optional(),
  load_image_url: z.string().optional(),
  movie_id: z.string(),
  created_at: z.string(),
  categories: z.array(categoryResponseSchema).optional(),
  genres: z.array(genreResponseSchema).optional(),
});

export type MovieResponseType = z.infer<typeof movieResponseSchema>;

export const baseResponseUnionMovieResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: movieResponseSchema,
  total_count: z.number().optional(),
});

export type BaseResponseUnionMovieResponseNoneTypeType = z.infer<
  typeof baseResponseUnionMovieResponseNoneTypeSchema
>;

export const movieCreateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['movie', 'series']),
  year: z.number().optional(),
  price: z.number().optional(),
  is_premium: z.boolean().optional(),
  poster_url: z.string().optional(),
  is_adult: z.boolean().optional(),
  load_image_url: z.string().optional(),
  category_ids: z.array(z.number()).optional(),
  genre_ids: z.array(z.number()).optional(),
});

export type MovieCreateType = z.infer<typeof movieCreateSchema>;

export const movieListResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['movie', 'series']),
  year: z.number().optional(),
  price: z.number().optional(),
  is_premium: z.boolean().optional(),
  poster_url: z.string().optional(),
  load_image_url: z.string().optional(),
  trailer_url: z.string().optional(),
  is_adult: z.boolean().optional(),
  created_at: z.string(),
  categories: z.array(categoryResponseSchema).optional(),
  genres: z.array(genreResponseSchema).optional(),
});

export type MovieListResponseType = z.infer<typeof movieListResponseSchema>;

export const baseResponseUnionListMovieListResponseNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(movieListResponseSchema),
  total_count: z.number().optional(),
});

export type BaseResponseUnionListMovieListResponseNoneTypeType = z.infer<
  typeof baseResponseUnionListMovieListResponseNoneTypeSchema
>;

export const singleItemReponseMovieResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: movieResponseSchema,
});

export type SingleItemReponseMovieResponseType = z.infer<
  typeof singleItemReponseMovieResponseSchema
>;

export const movieUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['movie', 'series']).optional(),
  year: z.number().optional(),
  price: z.number().optional(),
  is_premium: z.boolean().optional(),
  poster_url: z.string().optional(),
  is_adult: z.boolean().optional(),
  category_ids: z.array(z.number()).optional(),
  genre_ids: z.array(z.number()).optional(),
  load_image_url: z.string().optional(),
});

export type MovieUpdateType = z.infer<typeof movieUpdateSchema>;

export const baseResponseUnionDictNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({}),
  total_count: z.number().optional(),
});

export type BaseResponseUnionDictNoneTypeType = z.infer<
  typeof baseResponseUnionDictNoneTypeSchema
>;

export const RVK_MOVIES = 'movies';
