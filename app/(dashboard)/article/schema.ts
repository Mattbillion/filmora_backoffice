import { TagItemType } from '@/features/tags';
import { BaseType, PrettyType, ReplaceType } from '@/lib/fetch/types';
import {z} from 'zod';

export const articleSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string(),
  tags: z.string().array().optional(),
  order: z.number().optional(),
});

export type ArticleBodyType = z.infer<typeof articleSchema>;

export type ArticleItemType = PrettyType<
  BaseType<
    ReplaceType<
      ArticleBodyType, 
      { 
        tags: Pick<TagItemType, "id" | "name">[];
        status: number;
      }
    >
  >
>;

export const RVK_ARTICLE = "articles";
