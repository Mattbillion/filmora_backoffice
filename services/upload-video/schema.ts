import { z } from 'zod';

export const baseResponseUnionDictNoneTypeSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({}),
  total_count: z.number().optional(),
});

export type BaseResponseUnionDictNoneTypeType = z.infer<
  typeof baseResponseUnionDictNoneTypeSchema
>;

export const bodyDashboardUploadVideoSchema = z.object({
  file: z.string(),
  movie_id: z.string(),
  season_id: z.string().optional(),
  episode_number: z.number().optional(),
  is_trailer: z.boolean().optional(),
});

export type BodyDashboardUploadVideoType = z.infer<
  typeof bodyDashboardUploadVideoSchema
>;

export const RVK_UPLOAD_VIDEO = 'upload-video';
