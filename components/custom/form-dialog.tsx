/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import { SaveIcon } from 'lucide-react';

import { LoaderIcon } from '@/components/custom/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
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

interface FormSheetProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  form: any;
  onSubmit: (data: any) => void;
  onOpenChange?: (state: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  footerActions?: ReactNode;
  trigger?: ReactNode;
  submitText?: string;
  dialogContentClassName?: string;
  submitClassName?: string;
  containerClassName?: string;
  footerClassName?: string;
}

export interface FormDialogRef {
  close: () => void;
  open: () => void;
}

const FormSheet = forwardRef<FormDialogRef, FormSheetProps>(
  (
    {
      children,
      title,
      onSubmit,
      form,
      submitText = 'Submit',
      description,
      loading,
      disabled,
      footerActions,
      dialogContentClassName,
      containerClassName,
      footerClassName,
      trigger,
      submitClassName,
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
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
              <div
                className={cn(
                  'max-h-[calc(100vh-150px)] space-y-4 overflow-y-scroll px-2 py-1',
                  containerClassName,
                )}
              >
                {children}
              </div>
              <SheetFooter className={cn('pr-2 pt-4', footerClassName)}>
                {footerActions}
                <Button
                  type="submit"
                  className={submitClassName}
                  disabled={loading || disabled}
                >
                  {loading ? <LoaderIcon /> : <SaveIcon size="sm" />}
                  {submitText}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    );
  },
);

FormSheet.displayName = 'FormSheet';

export default FormSheet;
