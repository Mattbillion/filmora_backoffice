import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';

export const moodItemSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().optional(),
  status: z.enum(["0", "1", "2"]),
  banner: z.string(),
  audio: z.string().optional(),
  audioDuration: z.number().optional(),
  order: z.number().optional(),
  moodListId: z.number(),
});

export type MoodItemBodyType = z.infer<typeof moodItemSchema>;

export type MoodItemItemType = PrettyType<
  BaseType<
    Omit<
      MoodItemBodyType, 
     "status" | "moodListId" 
    > & { 
      status: number;
      audio_duration: number | null;
      user_id: ID | null;
      mood_list_id: ID;
    }
  >
>;

export const RVK_MOOD_ITEM = "moodItems";
