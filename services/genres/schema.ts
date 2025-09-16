import { z } from 'zod';

import type { BaseType, PrettyType } from '../api/types';

export const genresSchema = z.object({ name: z.string() });

export type GenresBodyType = z.infer<typeof genresSchema>;

export type GenresItemType = PrettyType<BaseType<GenresBodyType>>;

export const RVK_GENRES = 'genres';
