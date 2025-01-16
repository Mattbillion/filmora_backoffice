import { BaseType, ID, PrettyType } from '@/lib/fetch/types';
import {z} from 'zod';


export const itemSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string().optional(),
  order: z.number().optional(),
  trainingId: z.number(),
});

export type ItemBodyType = z.infer<typeof itemSchema>;

export type ItemItemType = PrettyType<
  Omit<
    BaseType<ItemBodyType>,
    "trainingId"
  > & {
    training_id: ID;
  }
>;

export const RVK_ITEM = "items";
