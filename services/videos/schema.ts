import { z } from 'zod';

export const baseResponseUnionListDictNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(z.object({})),
  total_count: z.number().optional(),
});

export type BaseResponseUnionListDictNoneTypeType = z.infer<
  typeof baseResponseUnionListDictNoneTypeSchema
>;

export const bodyDashboardGetVideosSchema = z.object({
  movie_id: z.string(),
});

export type BodyDashboardGetVideosType = z.infer<
  typeof bodyDashboardGetVideosSchema
>;

export const RVK_VIDEOS = 'videos';
