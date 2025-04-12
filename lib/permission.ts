import { Session } from 'next-auth';

export const checkPermission = (
  session: Session | null = null,
  roles: string[],
) => {
  const permissions = session?.user?.permissions || [];
  const [permission, ...rest] = roles;

  console.log({ rest });
  if (rest?.length) return rest.some((c) => permissions.includes(c));
  return permissions?.includes(permission);
};
