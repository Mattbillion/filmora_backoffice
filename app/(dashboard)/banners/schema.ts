import { BaseType, ID, PrettyType, ReplaceType } from '@/lib/fetch/types';
import {z} from 'zod';


export const bannerSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  product_type: z.enum(["0","1", "2", "3", "4"]),
  banner: z.string(),
  product: z.number(),
});

export type BannerBodyType = z.infer<typeof bannerSchema>;

export type BannerItemType = PrettyType<
  BaseType<
    Omit<
      ReplaceType<
        BannerBodyType,
        { product_type: number; status: number }
      >,
      "product"
    > & {
      product_id: ID;
      parentId: ID | null;
    }
  >
>;

export type BannerProductType = { id: ID; name?: string; title?: string; body: string };

export const RVK_BANNER = "banners";
