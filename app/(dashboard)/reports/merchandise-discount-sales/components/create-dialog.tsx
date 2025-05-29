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

import { getMerchandiseDiscountSales } from '../actions';
import {
  MerchandiseDiscountSalesBodyType,
  merchandiseDiscountSalesSchema,
} from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<Record<string, any[]>>({});
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<MerchandiseDiscountSalesBodyType>({
    resolver: zodResolver(merchandiseDiscountSalesSchema),
  });

  function onSubmit({ status, ...values }: MerchandiseDiscountSalesBodyType) {
    startTransition(() => {
      getMerchandiseDiscountSales({
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
      title="Create new Merchandise discount sales"
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
        name="merchandise_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Merchandise id</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Merchandise id" />
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
        name="mer_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mer name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Mer name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="discount_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount id</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Discount id" />
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
        name="discount_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount type</FormLabel>
            <FormControl>
              <Input placeholder="Enter Discount type" {...field} />
            </FormControl>
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
        name="discounted_item_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discounted item count</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Discounted item count"
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
        name="total_quantity_sold"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total quantity sold</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Total quantity sold"
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
        name="original_total_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Original total price</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Original total price"
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
        name="discounted_total_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discounted total price</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Discounted total price"
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
        name="total_discount_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total discount amount</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Total discount amount"
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
