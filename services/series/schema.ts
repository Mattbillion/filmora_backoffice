import { z } from 'zod';

import type { BaseType, PrettyType } from '../api/types';

export const seriesSchema = z.object({});

export type SeriesBodyType = z.infer<typeof seriesSchema>;

export type SeriesItemType = PrettyType<BaseType<SeriesBodyType>>;

export const RVK_SERIES = 'series';
