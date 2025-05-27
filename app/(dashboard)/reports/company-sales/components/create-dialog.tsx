'use client';

import { ReactNode, useRef, useTransition } from 'react';
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

import { getCompanySales } from '../actions';
import { CompanySalesBodyType, companySalesSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CompanySalesBodyType>({
    resolver: zodResolver(companySalesSchema),
  });

  function onSubmit({ status, ...values }: CompanySalesBodyType) {
    startTransition(() => {
      getCompanySales({
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
      title="Create new Company sales"
      submitText="Create"
      trigger={children}
    >
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
        name="seats_quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seats quantity</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Seats quantity"
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
        name="merch_quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Merch quantity</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Merch quantity"
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
        name="seats_sales_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seats sales amount</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Seats sales amount"
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
        name="merch_sales_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Merch sales amount</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Merch sales amount"
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
        name="total_sales_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total sales amount</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Total sales amount"
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
