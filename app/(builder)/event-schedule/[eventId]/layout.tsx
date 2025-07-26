import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { checkPermission } from '@/lib/permission';

import { AvatarDropdown } from './_components/avatar-dropdown';
import { BackButton } from './_components/back-button';

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
      <header className="flex h-16 items-center border-b px-4">
        <div className="flex flex-1 items-center gap-2">
          <BackButton />
          <h1 className="text-lg font-medium">Schedule builder</h1>
        </div>
        <AvatarDropdown />
      </header>
      {children}
    </div>
  );
}
