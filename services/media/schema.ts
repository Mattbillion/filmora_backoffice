import { z } from 'zod';

export const UploadResponseSchema = z.object({
  status: z.literal('success'), // if you always expect "success"
  message: z.string(),
  data: z.object({
    images: z.object({
      original: z.string(),
      tiny: z.string(),
      small: z.string(),
      medium: z.string(),
    }),
    image_id: z.string().uuid(),
  }),
  total_count: z.number(),
});

// Types you can use in TS
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type UploadedImages = UploadResponse['data']['images'];
