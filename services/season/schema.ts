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

export const baseResponseUnionSeriesSeasonDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.union([seriesSeasonSchema, z.object({})]),
  total_count: z.number().optional(),
});

export type BaseResponseUnionSeriesSeasonDictType = z.infer<
  typeof baseResponseUnionSeriesSeasonDictSchema
>;

export const seriesSeasonCreateSchema = z.object({
  movie_id: z.string().optional(),
  season_number: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  release_date: z.string().optional(),
  cover_image_url: z.string().optional(),
});

export type SeriesSeasonCreateType = z.infer<typeof seriesSeasonCreateSchema>;

export const seriesSeasonUpdateSchema = z.object({
  movie_id: z.string().optional(),
  season_number: z.number().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  release_date: z.string().optional(),
  cover_image_url: z.string().optional(),
});

export type SeriesSeasonUpdateType = z.infer<typeof seriesSeasonUpdateSchema>;

export const baseResponseDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({}),
  total_count: z.number().optional(),
});

export type BaseResponseDictType = z.infer<typeof baseResponseDictSchema>;

export const RVK_SEASON = 'season';
