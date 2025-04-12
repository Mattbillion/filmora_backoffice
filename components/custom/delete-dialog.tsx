'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Loader2 } from 'lucide-react';
// import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { checkPermission } from '@/lib/permission';

export interface DeleteDialogRef {
  close: () => void;
  open: () => void;
}

interface DeleteDialogProps {
  action: () => void;
  description?: React.ReactNode | string;
  children: React.ReactNode;
  title?: string;
  cancelText?: string;
  confirmText?: string;
  loading?: boolean;
  permissions: string[];
}

export const DeleteDialog = forwardRef<DeleteDialogRef, DeleteDialogProps>(
  (
    {
      action,
      description,
      children,
      title,
      cancelText,
      confirmText,
      loading,
      permissions = [],
    },
    ref,
  ) => {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      close: () => setOpen(false),
      open: () => setOpen(true),
    }));

    if (!checkPermission(session, permissions)) return null;
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {title || 'Are you absolutely sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {description || 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={loading}>
                {cancelText || 'Cancel'}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={action} disabled={loading}>
                {loading && <Loader2 size={10} className="animate-spin" />}
                {confirmText || 'Continue'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

DeleteDialog.displayName = 'DeleteDialog';
