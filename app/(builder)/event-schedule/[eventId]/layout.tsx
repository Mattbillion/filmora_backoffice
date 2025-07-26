import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

export default async function EventScheduleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!checkPermission(session, ['create_event_schedule'])) return notFound();

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden bg-[#fafafa]"
      style={{ minHeight: '100vh' }}
    >
      {children}
    </div>
  );
}
