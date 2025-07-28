import { z } from 'zod';

export const scheduleSchema = z.object({
  template_id: z.number(),
  date: z.string(),
  end_at: z.string(),
  start_at: z.string(),
  price: z.number(),
  status: z.boolean().optional().default(true),
});

export type ScheduleBodyType = z.infer<typeof scheduleSchema>;
