import { TagItemType } from '@/features/tags';
import { BaseType, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';

export const videoSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string().optional(),
  videoUrl: z.string(),
  tags: z.string().array().optional(),
  order: z.number().optional(),
});

export type VideoBodyType = z.infer<typeof videoSchema>;

export type VideoItemType = PrettyType<
  BaseType<
    Omit<
      VideoBodyType,
     "tags" | "status" | "videoUrl"
    > & { 
      tags: Pick<TagItemType, "id" | "name">[];
      status: number;
      video_url: string;
    }
  >
>;

export const RVK_VIDEO = "videos";
