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

import { createOrder } from '../actions';
import { OrderBodyType, orderSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<OrderBodyType>({
    resolver: zodResolver(orderSchema),
  });

  function onSubmit({ order_status, ...values }: OrderBodyType) {
    startTransition(() => {
      createOrder({
        ...values,
        order_status: order_status as unknown as string,
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
        name="order_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order number</FormLabel>
            <FormControl>
              <Input placeholder="Enter Order number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="total_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total price</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Total price"
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
        name="order_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order status</FormLabel>
            <FormControl>
              <Input placeholder="Enter Order status" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="payment_deadline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment deadline</FormLabel>
            <FormControl>
              <Input placeholder="Enter Payment deadline" {...field} />
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
        name="order_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order time</FormLabel>
            <FormControl>
              <Input placeholder="Enter Order time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="user_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User id</FormLabel>
            <FormControl>
              <Input placeholder="Enter User id" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
