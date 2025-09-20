import { z } from 'zod';

export const imageInfoSchema = z.object({
  id: z.string(),
  image_url: z.string(),
  file_name: z.string(),
  file_size: z.number(),
  content_type: z.string(),
  created_at: z.string(),
});

export type ImageInfoType = z.infer<typeof imageInfoSchema>;

export const imageListResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(imageInfoSchema),
  pagination: z.object({}),
});

export type ImageListResponseType = z.infer<typeof imageListResponseSchema>;

export const RVK_IMAGES = 'images';
