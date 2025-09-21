import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const genresSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const movieCoverSchema = z.object({
  load_image_url: z.string().nullable(),
});

export const categoriesSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  is_adult: z.boolean(),
});

export const moviesSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  year: z.number(),
  price: z.number(),
  is_premium: z.boolean(),
  poster_url: z.string(),
  load_image_url: z.string().nullable(),
  is_adult: z.boolean(),
  categories: z.array(categoriesSchema),
  genres: z.array(genresSchema),
});

export const moviesUpdateSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  year: z.number(),
  price: z.number(),
  is_premium: z.boolean(),
  poster_url: z.string(),
  load_image_url: z.string().nullable(),
  is_adult: z.boolean(),
  categories: z.array(z.number()),
  genres: z.array(z.number()),
});

export type MoviesBodyType = z.infer<typeof moviesSchema>;
export type MovieCoverType = z.infer<typeof movieCoverSchema>;
export type MoviesItemType = PrettyType<BaseType<MoviesBodyType>>;
export type MoviesUpdateBodyType = z.infer<typeof moviesUpdateSchema>;

export const RVK_MOVIES = 'movies';
