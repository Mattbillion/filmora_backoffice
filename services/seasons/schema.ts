import { z } from 'zod';

export const seriesSeasonSchema = z.object({
  id: z.string(),
  movie_id: z.string().optional(),
  season_number: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  release_date: z.string().optional(),
  cover_image_url: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export type SeriesSeasonType = z.infer<typeof seriesSeasonSchema>;

export const baseResponseUnionListSeriesSeasonDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.union([z.array(seriesSeasonSchema), z.object({})]),
  total_count: z.number().optional(),
});

export type BaseResponseUnionListSeriesSeasonDictType = z.infer<
  typeof baseResponseUnionListSeriesSeasonDictSchema
>;

export const baseResponseUnionSeriesSeasonDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.union([seriesSeasonSchema, z.object({})]),
  total_count: z.number().optional(),
});

export type BaseResponseUnionSeriesSeasonDictType = z.infer<
  typeof baseResponseUnionSeriesSeasonDictSchema
>;

export const RVK_SEASONS = 'seasons';
