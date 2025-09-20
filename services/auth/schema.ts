import { z } from 'zod';

export const bodyDashboardEmployeeLoginSchema = z.object({
  grant_type: z.string().optional(),
  username: z.string(),
  password: z.string(),
  scope: z.string().optional(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
});

export type BodyDashboardEmployeeLoginType = z.infer<
  typeof bodyDashboardEmployeeLoginSchema
>;

export const tokenRefreshRequestSchema = z.object({
  refresh_token: z.string(),
});

export type TokenRefreshRequestType = z.infer<typeof tokenRefreshRequestSchema>;

export const RVK_AUTH = 'auth';
