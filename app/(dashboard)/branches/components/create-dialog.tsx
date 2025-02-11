'use client';

import { ReactNode, useRef, useTransition } from 'react';
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

import { createBranch } from '../actions';
import { BranchBodyType, branchSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BranchBodyType>({
    resolver: zodResolver(branchSchema),
  });

  function onSubmit({ status, ...values }: BranchBodyType) {
    startTransition(() => {
      createBranch({
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
      title="Create new Branch"
      submitText="Create"
      trigger={children}
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
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Branch name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />

      <FormField
        control={form.control}
        name="branch_logo"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="branch_logo"
            label="Branch logo"
          />
        )}
      />

      <FormField
        control={form.control}
        name="branch_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch phone</FormLabel>
            <FormControl>
              <Input placeholder="Enter Branch phone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch_location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch location</FormLabel>
            <FormControl>
              <Input placeholder="Enter Branch location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch_long"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch long</FormLabel>
            <FormControl>
              <Input placeholder="Enter Branch long" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch_lat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch lat</FormLabel>
            <FormControl>
              <Input placeholder="Enter Branch lat" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch email</FormLabel>
            <FormControl>
              <Input placeholder="Enter Branch email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch order</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Branch order"
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
        name="branch_schedule"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch schedule</FormLabel>
            <FormControl>
              <Input placeholder="Enter Branch schedule" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="branch_images"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="branch_images"
            label="Branch images"
          />
        )}
      />
    </FormDialog>
  );
}
