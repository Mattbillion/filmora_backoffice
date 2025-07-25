'use client';
import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { getTemplateHash } from '@/app/(dashboard)/templates/actions';
import { TemplatesItemType } from '@/app/(dashboard)/templates/schema';
import CurrencyItem from '@/components/custom/currency-item';
import DatePickerItem from '@/components/custom/datepicker-item';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ID } from '@/lib/fetch/types';

import { createSchedules } from '../actions';
import { SchedulesBodyType, scheduleSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const { id } = useParams();
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<{
    template_id?: Record<ID, TemplatesItemType>;
  }>({});
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<SchedulesBodyType>({
    resolver: zodResolver(scheduleSchema),
  });

  function onSubmit(values: SchedulesBodyType) {
    startTransition(() => {
      createSchedules(id as string, values)
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
      dialogContentClassName="min-w-[80%]"
      title="Хуваарь нэмэх"
      submitText="Create"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            Promise.all([
              getTemplateHash().then((res) => res?.data || []),
            ]).then(([template_id]) => {
              setDropdownData({ template_id });
            });
          });
        }
      }}
    >
      <div className="flex items-center gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <DatePickerItem field={field} label="Өдөр" disableBy="past" />
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Эхлэх хугацаа</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter start time"
                    type="time"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дуусах хугацаа</FormLabel>
                <FormControl>
                  <Input placeholder="Enter end time" type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Үнэ</FormLabel>
            <FormControl>
              <CurrencyItem field={field} placeholder="Enter Price" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem className="flex items-center rounded-lg border border-border px-4 py-3">
            <div className="w-full space-y-0.5">
              <FormLabel className="text-base">Active</FormLabel>
              <FormDescription>
                Event will be visible to the public.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
