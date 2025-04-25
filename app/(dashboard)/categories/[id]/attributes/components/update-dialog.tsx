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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { patchCategoryAttributesDetail } from '../actions';
import {
  CategoryAttributesBodyType,
  CategoryAttributesItemType,
  categoryAttributesSchema,
} from '../schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: CategoryAttributesItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryAttributesBodyType>({
    resolver: zodResolver(categoryAttributesSchema),
    defaultValues: initialData,
  });

  function onSubmit({ status, ...values }: CategoryAttributesBodyType) {
    startTransition(() => {
      patchCategoryAttributesDetail({
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
      title="Update Category attributes"
      submitText="Update"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="com_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Com id</FormLabel>
            <FormControl>
              <Input placeholder="Com id" {...field} type="hidden" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cat_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cat id</FormLabel>
            <FormControl>
              <Input placeholder="Cat id" {...field} type="hidden" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="attr_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Attr name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Attr name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="attr_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />

      <FormField
        control={form.control}
        name="attr_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Attr type</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value)}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="SELECT">
                <SelectItem value="SELECT">Select</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="display_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display order</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Display order"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value === 'true')}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
