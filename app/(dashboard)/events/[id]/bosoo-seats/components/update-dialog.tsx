'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { getSchedulesHash } from '@/app/(dashboard)/events/[id]/schedules/actions';
import { SchedulesItemType } from '@/app/(dashboard)/events/[id]/schedules/schema';
import CurrencyItem from '@/components/custom/currency-item';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
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
import { getDiscounts } from '@/features/discounts/actions';
import { DiscountsItemType } from '@/features/discounts/schema';

import { patchBosooSeats } from '../actions';
import {
  BosooSeatsBodyType,
  BosooSeatsItemType,
  bosooSeatsSchema,
} from '../schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: BosooSeatsItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<{
    discount_id: DiscountsItemType[];
    schedule_id: Record<string, SchedulesItemType>;
  }>({ discount_id: [], schedule_id: {} });
  const params = useParams();
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<BosooSeatsBodyType>({
    resolver: zodResolver(bosooSeatsSchema),
    defaultValues: initialData,
  });

  function onSubmit({ status, ...values }: BosooSeatsBodyType) {
    startTransition(() => {
      patchBosooSeats({
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
      title="Update Bosoo seats"
      submitText="Update"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            Promise.all([
              getDiscounts().then((res) => res.data.data),
              getSchedulesHash(params.id as string).then((res) => res.data),
            ]).then(([discount_id, schedule_id]) =>
              setDropdownData((prevData) => ({
                ...prevData,
                discount_id,
                schedule_id,
              })),
            );
          });
        }
      }}
    >
      <FormField
        control={form.control}
        name="sell_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Борлуулах төрөл</FormLabel>
            <FormControl>
              <Input placeholder="Enter sell type" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="seat_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Суудлын нэр</FormLabel>
            <FormControl>
              <Input placeholder="Enter Seat name" {...field} />
            </FormControl>
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
              <CurrencyItem field={field} placeholder={'Enter Price'} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="schedule_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Цагийн хуваарь</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))}>
              <FormControl>
                <SelectTrigger disabled={loading}>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(dropdownData.schedule_id)?.map(
                  (schedule, idx) => (
                    <SelectItem key={idx} value={schedule.id.toString()}>
                      {dayjs(schedule.date).format('YYYY-MM-DD')}{' '}
                      {schedule.start_at}
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
        name="discount_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Хямдрал</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))}>
              <FormControl>
                <SelectTrigger disabled={loading}>
                  <SelectValue placeholder="Select Discount" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dropdownData.discount_id?.map((c, idx) => (
                  <SelectItem key={idx} value={c.id.toString()}>
                    {c.discount_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      <FormField
        control={form.control}
        name="seat_stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Үлдэгдэл</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Seat stock"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
