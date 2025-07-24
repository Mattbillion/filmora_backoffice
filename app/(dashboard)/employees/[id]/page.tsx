import { notFound } from 'next/navigation';

import { getEmployee } from '@/app/(dashboard)/employees/actions';
import { ChangeEmail } from '@/app/(dashboard)/employees/components/edit/change-email';
import { EmployeeCard } from '@/app/(dashboard)/employees/components/employee-card';
import { ReplaceBreadcrumdItem } from '@/components/custom/replace-breadcrumd-item';

import { ChangePassword, EditForm } from '../components/edit';

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

  if (!userData) return notFound();

  return (
    <div className="flex flex-col gap-6">
      <ReplaceBreadcrumdItem
        data={{
          employees: {
            value: userData?.email,
            selector: id,
          },
        }}
      />
      <EmployeeCard userData={userData} />
      <EditForm initialData={userData!} />
      <div className="flex gap-4">
        <ChangePassword initialData={userData!} />
        <ChangeEmail initialData={userData!} />
      </div>
    </div>
  );
}
