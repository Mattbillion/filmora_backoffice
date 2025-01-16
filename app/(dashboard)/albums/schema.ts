import { TagItemType } from '@/features/tags';
import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';

export const albumSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string(),
  intro: z.string().optional(),
  introDuration: z.number().optional(),
  tags: z.string().array().optional(),
  order: z.number().optional(),
  price: z.number().optional(),
});

export type AlbumBodyType = z.infer<typeof albumSchema>;

export type AlbumItemType = PrettyType<
  BaseType<
    Omit<
      AlbumBodyType, 
     "tags" | "status" | "intro" | "introDuration"
    > & { 
      tags: Pick<TagItemType, "id" | "name">[];
      status: number;
      audio: string;
      audio_duration: number | null;
      user_id: ID | null;
      product_id: ID;
    }
  >
>;

export const RVK_ALBUM = "albums";
