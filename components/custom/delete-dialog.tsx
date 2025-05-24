'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Loader2 } from 'lucide-react';

// import { User } from 'next-auth';
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
}

export const DeleteDialog = forwardRef<DeleteDialogRef, DeleteDialogProps>(
  (
    { action, description, children, title, cancelText, confirmText, loading },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      close: () => setOpen(false),
      open: () => setOpen(true),
    }));

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="mb-4">
            <AlertDialogTitle>
              {title || 'Are you absolutely sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {description || 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={loading} size="cxs">
                {cancelText || 'Cancel'}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={action}
                disabled={loading}
                variant="destructive"
                size="cxs"
              >
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
