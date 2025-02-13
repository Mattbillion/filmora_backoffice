'use client';

import React, { ReactNode } from 'react';

import { ChangePasswordForm } from '@/app/(dashboard)/employees/components/change-password';
import { EmployeeItemType } from '@/app/(dashboard)/employees/schema';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function DetailSheet({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: EmployeeItemType;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet onOpenChange={(state) => setOpen(state)} open={open}>
      <SheetTrigger asChild>
        <p>{children}</p>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Дэлгэрэнгүй</SheetTitle>
        </SheetHeader>

        {/*Forms*/}
        <ChangePasswordForm
          initialData={initialData}
          closeSheet={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
