import { Session } from 'next-auth';

export const role = {
  manager: 'Manager',
  operator: 'Operator',
  content: 'Content admin',
};

export type Role = keyof typeof role;

export const checkPermission = (
  session: Session | null = null,
  roles: string[],
) => {
  const permissions = session?.user?.permissions || [];
  const [permission, ...rest] = roles;

  if (rest) return rest.some((c) => permissions.includes(c));
  return permissions?.includes(permission);
};
