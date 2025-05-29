'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
import { getDiscounts } from '@/features/discounts/actions';

import { createBosooSeats } from '../actions';
import { BosooSeatsBodyType, bosooSeatsSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const { data } = useSession();
  const [dropdownData, setDropdownData] = useState<Record<string, any[]>>({});
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<BosooSeatsBodyType>({
    resolver: zodResolver(bosooSeatsSchema),
    defaultValues: {
      event_id: Number(params.id as string),
      company_id: Number(data?.user?.company_id),
    },
  });

  function onSubmit(values: BosooSeatsBodyType) {
    startTransition(() => {
      createBosooSeats(values)
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
      title="Create new Bosoo seats"
      submitText="Create"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            getDiscounts().then((res) =>
              setDropdownData((prevData) => ({
                ...prevData,
                discount_id: res.data.data,
              })),
            );
          });
        }
      }}
    >
      <FormField
        control={form.control}
        name="event_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="hidden" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="hidden" {...field} />
            </FormControl>
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
        name="seat_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seat name</FormLabel>
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
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Price"
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
        name="is_reserved"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Is reserved</FormLabel>
            <FormControl>
              <Input placeholder="Enter Is reserved" {...field} />
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
        name="discount_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount</FormLabel>
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
            <Select onValueChange={(value) => field.onChange(value === 'true')}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Status" />
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
        name="seat_stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Seat stock</FormLabel>
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

      <FormField
        control={form.control}
        name="selled_stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Selled stock</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Selled stock"
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
        name="current_stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current stock</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Current stock"
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
        name="sell_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sell type</FormLabel>
            <FormControl>
              <Input placeholder="Enter Sell type" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
