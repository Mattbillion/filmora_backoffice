'use client';

import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  AppApiApiV1EndpointsDashboardCategoriesTagResponseType,
  tagUpdateSchema,
  TagUpdateType,
} from '@/services/schema';
import { updateTag } from '@/services/tags';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: AppApiApiV1EndpointsDashboardCategoriesTagResponseType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TagUpdateType>({
    resolver: zodResolver(tagUpdateSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description || undefined,
    },
  });

  function onSubmit(values: TagUpdateType) {
    startTransition(() => {
      updateTag(initialData.id, values)
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
      title="Update Tags"
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

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Дэлгэрэнгүй тайлбар</FormLabel>
            <FormControl>
              <HtmlTipTapItem field={field} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
