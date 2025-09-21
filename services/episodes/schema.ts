import { z } from 'zod';

export const seriesEpisodeSchema = z.object({
  episode_id: z.string(),
  season_id: z.string(),
  title: z.string().optional(),
  episode_number: z.number().optional(),
  m3u8_url: z.string(),
  duration: z.string().optional(),
});

export type SeriesEpisodeType = z.infer<typeof seriesEpisodeSchema>;

export const baseResponseUnionSeriesEpisodeDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.union([seriesEpisodeSchema, z.object({})]),
  total_count: z.number().optional(),
});

export type BaseResponseUnionSeriesEpisodeDictType = z.infer<
  typeof baseResponseUnionSeriesEpisodeDictSchema
>;

export const RVK_EPISODES = 'episodes';
