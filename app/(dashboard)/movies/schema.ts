import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const moviesSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  year: z.number(),
  price: z.string(),
  is_premium: z.boolean(),
  poster_url: z.string(),
  is_adult: z.boolean(),
  categories: z.array(z.unknown()),
  genres: z.array(z.unknown()),
});

export type MoviesBodyType = z.infer<typeof moviesSchema>;

export type MoviesItemType = PrettyType<BaseType<MoviesBodyType>>;

export const RVK_MOVIES = 'movies';
