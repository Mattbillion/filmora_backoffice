'use client';

import { ReactNode, useEffect, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import DatePickerItem from '@/components/custom/datepicker-item';
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
import { patchDiscountsDetail } from '@/features/discounts/actions';
import {
  DiscountsBodyType,
  DiscountsItemType,
  discountsSchema,
} from '@/features/discounts/schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: DiscountsItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.company_id) {
      form.setValue('company_id', session.user.company_id);
      console.log('here');
    }
  }, [session?.user?.company_id]);

  const form = useForm<DiscountsBodyType>({
    resolver: zodResolver(discountsSchema),
    defaultValues: initialData,
  });

  function onSubmit({ status, ...values }: DiscountsBodyType) {
    startTransition(() => {
      patchDiscountsDetail({
        ...values,
        id: initialData.id,
        status,
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
      title="Update Discounts"
      submitText="Update"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="discount_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Discount name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="discount_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />

      <FormField
        control={form.control}
        name="discount_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount type</FormLabel>
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="AMOUNT">AMOUNT</SelectItem>
                <SelectItem value="PERCENT">PERCENT</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="discount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Discount"
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
        name="start_at"
        render={({ field }) => (
          <DatePickerItem
            field={field}
            label="Discount start at"
            disableBy="none"
          />
        )}
      />

      <FormField
        control={form.control}
        name="end_at"
        render={({ field }) => (
          <DatePickerItem
            field={field}
            label="Discount end at"
            disableBy="past"
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
