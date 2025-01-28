'use client';

import { ReactNode } from 'react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

import { hasPermission, Role } from '@/lib/permission';

import { PurchaseTypeEnum } from '../../schema';
import { AlbumDialog } from './album-dialog';
import { BookDialog } from './book-dialog';
import { ConnectProductsProvider } from './context';
import { LectureDialog } from './lecture-dialog';
import { TrainingDialog } from './training-dialog';

export function ConnectItemWrapper({
  children,
  type,
}: {
  children: ReactNode;
  type: PurchaseTypeEnum;
}) {
  const { data: session } = useSession();
  const DialogWrapper = {
    0: AlbumDialog,
    1: LectureDialog,
    3: BookDialog,
    4: TrainingDialog,
  }[type];

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, 'users.connect', 'create')) return null;
  return (
    <ConnectProductsProvider>
      <DialogWrapper>{children}</DialogWrapper>
    </ConnectProductsProvider>
  );
}
