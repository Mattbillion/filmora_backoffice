import { BaseType, PrettyType, SnakeCaseKeys } from '@/lib/fetch/types';
import {z} from 'zod';

export const employeeSchema = z.object({
  email: z.string().email({
    message: "Wrong email input.",
  }),
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  firstName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  password: z.string().optional(),
  role: z.enum(["manager", "operator", "content"]), // role as @/lib/permission
});

export type EmployeeBodyType = z.infer<typeof employeeSchema>;

export type EmployeeItemType = PrettyType<
  BaseType<
    SnakeCaseKeys<
      Omit<
        EmployeeBodyType, 
        "password"
      >
    >
  >
>;

export const RVK_EMPLOYEE = "employees";
