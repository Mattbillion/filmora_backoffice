import { TagItemType } from '@/features/tags';
import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';

export const moodListSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().optional(),
  status: z.enum(["0", "1", "2"]),
  banner: z.string(),
  audio: z.string().optional(),
  audioDuration: z.number().optional(),
  tags: z.string().array().optional(),
  order: z.number().optional(),
  moodId: z.number(),
});

export type MoodListBodyType = z.infer<typeof moodListSchema>;

export type MoodListItemType = PrettyType<
  BaseType<
    Omit<
      MoodListBodyType, 
     "tags" | "status" | "moodId" 
    > & { 
      tags: Pick<TagItemType, "id" | "name">[];
      status: number;
      audio_duration: number | null;
      user_id: ID | null;
      mood_id: ID;
    }
  >
>;

export const RVK_MOOD_LIST = "moodLists";
