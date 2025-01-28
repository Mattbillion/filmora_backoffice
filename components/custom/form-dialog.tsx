/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';

import { LoaderIcon } from '@/components/custom/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface FormDialogProps {
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

const FormDialog = forwardRef<FormDialogRef, FormDialogProps>(
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
      <Dialog
        open={open}
        onOpenChange={(c) => {
          setOpen(c);
          onOpenChange?.(c);
        }}
      >
        {!!trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent
          aria-describedby={undefined}
          className={cn('max-w-[650px]', dialogContentClassName)}
        >
          {(title || description) && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
              <div
                className={cn(
                  'max-h-[calc(100vh-200px)] space-y-4 overflow-y-scroll px-2 py-1',
                  containerClassName,
                )}
              >
                {children}
              </div>
              <DialogFooter className={cn('pr-2 pt-4', footerClassName)}>
                {footerActions}
                <Button
                  type="submit"
                  className={submitClassName}
                  disabled={loading || disabled}
                >
                  {loading && <LoaderIcon />}
                  {submitText}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);

FormDialog.displayName = 'DeleteDialog';

export default FormDialog;
