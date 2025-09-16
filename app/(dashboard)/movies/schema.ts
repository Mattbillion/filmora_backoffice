import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const moviesSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  year: z.number(),
  price: z.string(),
  poster_url: z.string(),
  is_premium: z.boolean(),
  is_adult: z.boolean(),
  load_image_url: z.string().nullable(),
  created_at: z.string(),
  categories_ids: z.array(z.number()),
  genres_ids: z.array(z.number()),
});

export type MoviesBodyType = z.infer<typeof moviesSchema>;

export type MoviesItemType = PrettyType<BaseType<MoviesBodyType>>;

export const RVK_MOVIES = 'movies';


