import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';


export const packageSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string().optional(),
  opennedDate: z.string().optional(),
  order: z.number().optional(),
  price: z.number(),
  trainingId: z.number(),
});

export type PackageBodyType = z.infer<typeof packageSchema>;

export type PackageItemType = PrettyType<
  BaseType<
    Omit<
      PackageBodyType,
      "trainingId"
      | "oppenedDate"
    > & {
      user_id: ID | null;
      product_id: ID;
      training_id: ID;
      openned_date?: string;
    }
  >
>;

export const RVK_PACKAGE = "packages";
