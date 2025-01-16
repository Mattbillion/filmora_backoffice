import { BaseType, PrettyType, ReplaceType } from '@/lib/fetch/types';
import {z} from 'zod';

export const faqSchema = z.object({
  question: z.string().min(2, {
    message: "Question must be at least 2 characters.",
  }),
  status: z.enum(["0", "1", "2"]),
  answer: z.string().min(2, {
    message: "Answer must be at least 2 characters.",
  }),
});

export type FaqBodyType = z.infer<typeof faqSchema>;

export type FaqItemType = PrettyType<BaseType<ReplaceType<FaqBodyType, {status: string;}>>>;

export const RVK_FAQ = "faq";
