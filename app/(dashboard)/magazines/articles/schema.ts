import { BaseType, ID, PrettyType, SnakeCaseKeys } from '@/lib/fetch/types';
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
  categoryId: z.number(),
  magazineId: z.number(),
  albumId: z.number().optional(),
  lectureId: z.number().optional(),
  trainingId: z.number().optional(),
  bookId: z.number().optional(),
  introBody: z.string().optional(),
  publishedDate: z.string(),
  isSpecial: z.boolean().optional(),
  // order: z.number().optional(),
});

export type ArticleBodyType = z.infer<typeof articleSchema>;

export type ArticleItemType = PrettyType<
  BaseType<
    SnakeCaseKeys<
      Omit<
        ArticleBodyType, 
        "categoryId"
      > & {
        articleCategory: {
          id: ID;
          name: string;
        }
      }
    >
  >
>;

export const RVK_MAGAZINE_ARTICLE = "magazines_articles";
