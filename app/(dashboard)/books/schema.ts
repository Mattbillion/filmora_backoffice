import { TagItemType } from '@/features/tags';
import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';

export const bookSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string().optional(),
  audio: z.string().optional(),
  audioDuration: z.number().optional(),
  tags: z.string().array().optional(),
  order: z.number().optional(),
  price: z.number().optional(),
});

export type BookBodyType = z.infer<typeof bookSchema>;

export type BookItemType = PrettyType<
  BaseType<
    Omit<
      BookBodyType,
     "tags" | "status"
    > & { 
      tags: Pick<TagItemType, "id" | "name">[];
      status: number;
      audio_duration: number | null;
      product_id: ID;
    }
  >
>;

export const RVK_BOOK = "books";
