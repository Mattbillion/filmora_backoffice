import { Session } from 'next-auth';

export const checkPermission = (
  session: Session | null = null,
  roles: string[],
) => true;
