'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getEventSeatSalesDetail } from '../actions';
import { EventSeatSalesBodyType, eventSeatSalesSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<Record<string, any[]>>({});
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<EventSeatSalesBodyType>({
    resolver: zodResolver(eventSeatSalesSchema),
  });

  function onSubmit({ status, ...values }: EventSeatSalesBodyType) {
    startTransition(() => {
      getEventSeatSalesDetail({
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
      title="Create new Event seat sales"
      submitText="Create"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            //          Promise.all([
            //              fetchSomething().then(res => res?.data?.data || []),
            //              fetchSomething().then(res => res?.data?.data || [])
            //           ]).then(([example_cat_id, example_product_id]) => {
            //                setDropdownData(prevData => ({ ...prevData, example_cat_id, example_product_id }));
            //          });
          });
        }
      }}
    >
      <FormField
        control={form.control}
        name="event_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event id</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Event id" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="false">
                <SelectItem value="0">This</SelectItem>
                <SelectItem value="2">Is</SelectItem>
                <SelectItem value="3">Generated</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="seat_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seat id</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Seat id" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="false">
                <SelectItem value="0">This</SelectItem>
                <SelectItem value="2">Is</SelectItem>
                <SelectItem value="3">Generated</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="seat_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seat no</FormLabel>
            <FormControl>
              <Input placeholder="Enter Seat no" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="section_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Section type</FormLabel>
            <FormControl>
              <Input placeholder="Enter Section type" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="order_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order date</FormLabel>
            <FormControl>
              <Input placeholder="Enter Order date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="total_quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total quantity</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Total quantity"
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
        name="total_revenue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total revenue</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Total revenue"
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
