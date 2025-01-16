import { BaseType, ID, PrettyType, ReplaceType } from '@/lib/fetch/types';
import {z} from 'zod';


export const trainingSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string(),
  order: z.number().optional(),
});

export type TrainingBodyType = z.infer<typeof trainingSchema>;

export type TrainingItemType = PrettyType<
  BaseType<
    Omit<
      ReplaceType<
        TrainingBodyType,
        { status: number; }
      >,
      "product"
    > & {
      product_id: ID;
    }
  >
>;

export const RVK_TRAINING = "trainings";
