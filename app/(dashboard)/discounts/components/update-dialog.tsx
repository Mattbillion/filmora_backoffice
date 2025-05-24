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
      title="Хямдрал шинэчлэх"
      submitText="Хадгалах"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="discount_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Хямдралын нэр</FormLabel>
            <FormControl>
              <Input placeholder="Enter Discount name" {...field} />
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
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
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
            <FormLabel>Хямдрал</FormLabel>
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="start_at"
          render={({ field }) => (
            <DatePickerItem
              field={field}
              label="Эхлэх огноо"
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
                <SelectItem value="true">Идэвхтэй</SelectItem>
                <SelectItem value="false">Идэвхгүй</SelectItem>
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
          <HtmlTipTapItem field={field} label="Хямдралын дэлгэрэнгүй" />
        )}
      />
    </FormDialog>
  );
}
