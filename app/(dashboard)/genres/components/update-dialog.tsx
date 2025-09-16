'use client';

import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { patchGenresDetail } from '../actions';
import { GenresBodyType, GenresItemType, genresSchema } from '../schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: GenresItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<GenresBodyType>({
    resolver: zodResolver(genresSchema),
    defaultValues: initialData,
  });

  function onSubmit({ status, ...values }: GenresBodyType) {
    startTransition(() => {
      patchGenresDetail({
        ...values,
        id: initialData.id,
        status: (status as unknown as string) === 'true',
      })
        .then(() => {
          toast.success('Updated successfully');
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Update Genres"
      submitText="Update"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
