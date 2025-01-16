import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';

export const moodSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string(),
  audio: z.string(),
  audioDuration: z.number(),
  order: z.number().optional(),
});

export type MoodBodyType = z.infer<typeof moodSchema>;

export type MoodItemType = PrettyType<
  BaseType<
    Omit<
      MoodBodyType, 
     "status" | "audio" | "audioDuration"
    > & { 
      status: number;
      audio: string;
      audio_duration: number | null;
      user_id: ID | null;
      product_id: ID;
    }
  >
>;

export const RVK_MOOD = "moods";
