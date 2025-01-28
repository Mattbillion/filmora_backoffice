import { z } from 'zod';

import { TagItemType } from '@/features/tags';
import { BaseType, ID, PrettyType } from '@/lib/fetch/types';

export const lectureSchema = z.object({
  title: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  body: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  status: z.enum(['0', '1', '2']),
  banner: z.string().optional(),
  audio: z.string().optional(),
  intro: z.string().optional(),
  audioDuration: z.number().optional(),
  introDuration: z.number().optional(),
  tags: z.string().array().optional(),
  order: z.number().optional(),
  price: z.number().optional(),
  albumId: z.number(),
});

export type LectureBodyType = z.infer<typeof lectureSchema>;

export type LectureItemType = PrettyType<
  BaseType<
    Omit<LectureBodyType, 'tags' | 'status' | 'albumId'> & {
      tags: Pick<TagItemType, 'id' | 'name'>[];
      status: number;
      audio_duration: number | null;
      intro_duration: number | null;
      user_id: ID | null;
      product_id: ID;
      album_id: ID;
    }
  >
>;

export const RVK_LECTURE = 'lectures';
