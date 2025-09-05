'use client';
import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getHallsHash } from '@/features/halls/actions';
import { ID } from '@/lib/fetch/types';

import { createBosooSchedule } from './actions';
import { BosooSchedulesBodyType, bosooScheduleSchema } from './schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const { data } = useSession();
  const [dropdownData, setDropdownData] = useState<{
    hall_id?: Record<ID, string>;
  }>({});
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<BosooSchedulesBodyType>({
    resolver: zodResolver(bosooScheduleSchema),
    defaultValues: {
      company_id: Number(data?.user?.company_id),
      status: true,
    },
  });

  function onSubmit(values: BosooSchedulesBodyType) {
    startTransition(() => {
      const date = new Date(values.date).toISOString().split('T')[0];

      const startAtTime = values.start_at;
      const endAtTime = values.end_at;

      const startAt = `${date}T${startAtTime}:00.000000Z`;
      const endAt = `${date}T${endAtTime}:00.000000Z`;

      createBosooSchedule(params.id as string, {
        ...values,
        start_at: startAt,
        end_at: endAt,
      })
        .then(({ error }) => {
          if (error) throw new Error((error as any)?.message || String(error));
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
      title="Шинэ цагийн хуваарь үүсгэх"
      submitText="Create"
      trigger={children}
      onOpenChange={(c) => {
        form.setValue('company_id', Number(session?.user?.company_id));
        if (c) {
          startLoadingTransition(() => {
            Promise.all([getHallsHash().then((res) => res?.data || {})]).then(
              ([hall_id]) => {
                setDropdownData((prevData) => ({
                  ...prevData,
                  hall_id,
                }));
              },
            );
          });
        }
      }}
    >
      <FormField
        control={form.control}
        name="company_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Com id" {...field} type="hidden" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex items-center gap-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <DatePickerItem
              field={field}
              label="Өдөр"
              disableBy="past"
              className="flex-1"
            />
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
        name="hall_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))}>
              <FormControl>
                <SelectTrigger disabled={loading}>
                  <SelectValue placeholder="Select hall" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(dropdownData.hall_id || {})?.map(
                  ([hallId, hallName], idx) => (
                    <SelectItem key={idx} value={hallId}>
                      {hallName}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
          <FormItem className="!mt-5 flex items-center rounded-lg border border-border px-4 py-3">
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
