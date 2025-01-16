import { TagItemType } from '@/features/tags';
import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';

export const podcastSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string(),
  audio: z.string(),
  audioDuration: z.number().optional(),
  tags: z.string().array().optional(),
  order: z.number().optional(),
});

export type PodcastBodyType = z.infer<typeof podcastSchema>;

export type PodcastItemType = PrettyType<
  BaseType<
    Omit<
      PodcastBodyType,
     "tags" | "status"
    > & { 
      tags: Pick<TagItemType, "id" | "name">[];
      status: number;
      audio_duration: number | null;
      product_id: ID;
    }
  >
>;

export const RVK_PODCAST = "podcasts";
