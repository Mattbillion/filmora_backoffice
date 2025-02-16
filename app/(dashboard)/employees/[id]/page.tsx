import Image from 'next/image';
import { z } from 'zod';

import { getEmployee } from '@/app/(dashboard)/employees/actions';
import { EditForm } from '@/app/(dashboard)/employees/components/edit/edit-form';
import { BaseType, PrettyType } from '@/lib/fetch/types';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data } = await getEmployee({
    id: id,
  });

  const userData = data?.data;

  if (!userData) {
    return 'Alga alaa';
  }

  // firstname: z.string(),
  //   lastname: z.string(),
  //   phone: z.string(),
  //   email: z.string(),
  //   profile: z.string(),
  //   email_verified: z.boolean(),
  //   company_id: z.number(),
  //   status: z.boolean(),
  //   last_logged_at: z.null().optional(),
  //   password: z.string().min(6).optional(),
  //   confirmPassword: z.string().min(6).optional(),

  return (
    <div>
      <div className="relative h-[320px] w-[320px] overflow-hidden">
        <Image
          src={userData.profile || ''}
          alt={userData.firstname || ''}
          className="aspect-square object-cover"
          unoptimized
          fill
        />
      </div>
      <EditForm initialData={userData!} />
    </div>
  );
}

const userInfoSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string(),
  email: z.string(),
  profile: z.string(),
  emailVerified: z.string(),
  company_id: z.string(),
  status: z.boolean(),
});

export type UserBodyType = z.infer<typeof userInfoSchema>;
type UserBodyItem = PrettyType<BaseType<UserBodyType>>;
