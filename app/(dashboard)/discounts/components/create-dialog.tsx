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
import { createDiscounts } from '@/features/discounts/actions';
import {
  DiscountsBodyType,
  discountsSchema,
} from '@/features/discounts/schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.company_id) {
      form.setValue('company_id', session.user.company_id);
    }
  }, [session?.user?.company_id]);

  const form = useForm<DiscountsBodyType>({
    resolver: zodResolver(discountsSchema),
    defaultValues: {},
  });

  function onSubmit({ status, ...values }: DiscountsBodyType) {
    startTransition(() => {
      createDiscounts({
        ...values,
        status,
      })
        .then(() => {
          toast.success('Шинээр хямдрал үүслээ.');
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
      title="Шинэ хямдрал үүсгэх"
      submitText="Үүсгэх"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="company_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} type="hidden" />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="discount_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Хямдралын нэр</FormLabel>
            <FormControl>
              <Input placeholder="Хүүхдийн баярын хямдрал..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="discount_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount type</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Хямдралын төрөл сонгох" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="AMOUNT">Үнийн дүнгээр</SelectItem>
                <SelectItem value="PERCENT">Хувиар</SelectItem>
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
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="start_at"
          render={({ field }) => (
            <DatePickerItem
              field={field}
              label="Эхлэх огноо сонгох"
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
              label="Дуусах огноо"
              disableBy="past"
            />
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Хямдралын төлөв сонгох</FormLabel>
            <Select onValueChange={(value) => field.onChange(value === 'true')}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Төлөв сонгох" />
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
        name="discount_desc"
        render={({ field }) => (
          <HtmlTipTapItem field={field} label="Дэлгэрэнгүй мэдээлэл" />
        )}
      />
    </FormDialog>
  );
}
