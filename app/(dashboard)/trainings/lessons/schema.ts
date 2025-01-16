import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';


export const lessonSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  isPublic: z.enum(["0", "1"]),
  banner: z.string().optional(),
  order: z.number().optional(),
  itemId: z.number(),
});

export type LessonBodyType = z.infer<typeof lessonSchema>;

export type LessonItemType = PrettyType<
  Omit<
    BaseType<LessonBodyType>,
    "itemId" |
    "isPublic"
  > & {
    item_id: ID;
    is_public: number;
  }
>;

export const RVK_LESSON = "lessons";
