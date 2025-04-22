'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import UploadImageItem from '@/components/custom/upload-image-item';
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

import { createHalls } from '../actions';
import { HallsBodyType, hallsSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<Record<string, any[]>>({});
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<HallsBodyType>({
    resolver: zodResolver(hallsSchema),
  });

  function onSubmit({ status, ...values }: HallsBodyType) {
    startTransition(() => {
      createHalls({
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
      title="Create new Halls"
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
        name="venue_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue id</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Venue id" />
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
        name="branch_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch id</FormLabel>
            <Select onValueChange={(value) => field.onChange(Number(value))}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Branch id" />
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
        name="hall_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Hall name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hall_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />

      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacity</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Capacity"
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
        name="hall_image"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="hall_image"
            label="Hall image"
          />
        )}
      />

      <FormField
        control={form.control}
        name="hall_location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall location</FormLabel>
            <FormControl>
              <Input placeholder="Enter Hall location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hall_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall order</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Hall order"
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
        name="hall_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall type</FormLabel>
            <FormControl>
              <Input placeholder="Enter Hall type" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities</FormLabel>
            <FormControl>
              <Input placeholder="Enter Amenities" {...field} />
            </FormControl>
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
    </FormDialog>
  );
}
