import { z } from 'zod';

import type { BaseType, PrettyType } from '@/lib/fetch/types';

export const employeeSchema = z.object({
  employee_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  employee_desc: z.string().min(2, {
    message: 'Body must be at least 2 characters.',
  }),
  employee_logo: z.string().optional(),
  status: z.boolean(),
});

export type EmployeeBodyType = z.infer<typeof employeeSchema>;

export type EmployeeItemType = PrettyType<BaseType<EmployeeBodyType>>;

export const RVK_EMPLOYEE = 'employee';
