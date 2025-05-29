/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface SheetItemProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  onOpenChange?: (state: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  footerActions?: ReactNode;
  trigger?: ReactNode;
  dialogContentClassName?: string;
  containerClassName?: string;
  footerClassName?: string;
}

export interface FormDialogRef {
  close: () => void;
  open: () => void;
}

const SheetItem = forwardRef<FormDialogRef, SheetItemProps>(
  (
    {
      children,
      title,
      description,
      footerActions,
      dialogContentClassName,
      footerClassName,
      trigger,
      onOpenChange,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      close: () => setOpen(false),
      open: () => setOpen(true),
    }));

    return (
      <Sheet
        open={open}
        onOpenChange={(c) => {
          setOpen(c);
          onOpenChange?.(c);
        }}
      >
        {!!trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent
          aria-describedby={undefined}
          className={cn('w-[650px] !max-w-[90%]', dialogContentClassName)}
        >
          {(title || description) && (
            <SheetHeader className="mb-6">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
          )}

          {children}
          <SheetFooter className={cn('pr-2 pt-4', footerClassName)}>
            {footerActions}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
);

SheetItem.displayName = 'SheetItem';

export default SheetItem;
