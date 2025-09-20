import { z } from 'zod';

export const baseResponseDictSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({}),
  total_count: z.number().optional(),
});

export type BaseResponseDictType = z.infer<typeof baseResponseDictSchema>;

export const bodyDashboardUploadImageSchema = z.object({
  file: z.string(),
});

export type BodyDashboardUploadImageType = z.infer<
  typeof bodyDashboardUploadImageSchema
>;

export const RVK_UPLOAD_IMAGE = 'upload-image';
