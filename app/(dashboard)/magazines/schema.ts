import { BaseType, PrettyType, SnakeCaseKeys } from '@/lib/fetch/types';
import {z} from 'zod';

export const magazineSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  body: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  banner: z.string(),
  price: z.number(),
  MagizineNumber: z.string(),
  statName1: z.string().optional(),
  number1: z.string().optional(),
  statName2: z.string().optional(),
  number2: z.string().optional(),
  statName3: z.string().optional(),
  number3: z.string().optional(),
  statName4: z.string().optional(),
  number4: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  bannerType: z.enum(['hero', 'banner', 'removed']).optional()
  // order: z.number().optional(),
});

export type MagazineBodyType = z.infer<typeof magazineSchema>;

export type MagazineItemType = Omit<
    PrettyType<
      BaseType<SnakeCaseKeys<MagazineBodyType>>
    >, 
    "MagizineNumber" 
    | "statName1" 
    | "statName2" 
    | "statName3" 
    | "statName4" 
    | "number1" 
    | "number2" 
    | "number3" 
    | "number4"
    > & {
      magazine_number: number;
      label_name1: string;
      label_number1: number;
      label_name2: string;
      label_number2: number;
      label_name3: string;
      label_number3: number;
      label_name4: string;
      label_number4: number;
    };

export const RVK_MAGAZINE = "magazines";
