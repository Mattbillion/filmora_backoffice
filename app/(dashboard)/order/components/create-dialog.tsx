'use client';

import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import UploadImageItem from '@/components/custom/upload-image-item';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { createOrder } from '../actions';
import { OrderBodyType, orderSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<OrderBodyType>({
    resolver: zodResolver(orderSchema),
  });

  function onSubmit({ status, ...values }: OrderBodyType) {
    startTransition(() => {
      createOrder({
        ...values,
        status: (status as unknown as string) === 'true',
      })
        .then(() => {
          toast.success('Created successfully');
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
      title="Create new Order"
      submitText="Create"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="order_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter order name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="order_logo"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="order_logo"
            label="Logo"
          />
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value)}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="false">
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="order_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />
    </FormDialog>
  );
}
