import { BaseType, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  // banner: z.string().optional(),
  // description: z.string().optional(),
});

export type MagazineCategoryBodyType = z.infer<typeof categorySchema>;

export type MagazineCategoryItemType = PrettyType<BaseType<MagazineCategoryBodyType>>;

export const RVK_MAGAZINE_CATEGORY = "magazine_categories";