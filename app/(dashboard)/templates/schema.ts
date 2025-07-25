import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const templatesSchema = z.object({
  venue_id: z.number(),
  branch_id: z.number(),
  hall_id: z.number(),
  template_name: z.string(),
  template_desc: z.string(),
  template_order: z.number(),
  mask_json_url: z.string(),
  others_json_url: z.string(),
  tickets_json_url: z.string(),
  preview: z.string(),
  status: z.boolean(),
  event_id: z.number(),
});

export type TemplatesBodyType = z.infer<typeof templatesSchema>;

export type TemplatesItemType = PrettyType<BaseType<TemplatesBodyType>>;

export const RVK_TEMPLATES = 'templates';
