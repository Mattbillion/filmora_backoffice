import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';


export const taskSchema = z.object({
  body: z.string().optional(),
  question: z.string().optional(),
  type: z.enum(["0", "1", "2", "3", "4", "5", "6"]),
  status: z.enum(["0", "1", "2"]),
  isAnswer: z.enum(["0", "1"]),
  order: z.number().optional(),
  listenAudio: z.string().optional(),
  audioDuration: z.number().optional(),
  videoUrl: z.string().optional(),
  lessonId: z.number(),
  banner: z.string().optional(),
});

export type TaskBodyType = z.infer<typeof taskSchema>;

export type TaskItemType = PrettyType<
  Omit<
    BaseType<TaskBodyType>,
    "lessonId" |
    "isAnswer" |
    "videoUrl" |
    "audioDuration" |
    "listenAudio" |
    "type"
  > & {
    lesson_id: ID;
    is_answer: number;
    video_url: string;
    type: number;
    listen_audio: string;
    audio_duration: number | null;
  }
>;

export const RVK_TASK = "tasks";

export const taskTypeNameArr = [
  "Read check",
  "Listen check",
  "Read &amp; listen check",
  "Mental/Make - Read &amp; listen check",
  "Video check",
  "Feeling - Read &amp; Listen check",
  "Learning - Read &amp; Listen check",
]
