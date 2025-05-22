'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
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
import { getHierarchicalCategories } from '@/features/category/actions';
import { HierarchicalSelect } from '@/features/category/components/hierarichal-select';

import { createBanners } from '../actions';
import { BannersBodyType, bannersSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<Record<string, any[]>>({});
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<BannersBodyType>({
    resolver: zodResolver(bannersSchema),
  });

  function onSubmit({ status, ...values }: BannersBodyType) {
    startTransition(() => {
      createBanners({
        ...values,
        status,
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
      title="Create new Banners"
      submitText="Create"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            Promise.all([
              getHierarchicalCategories(true).then((res) => res?.data || []),
            ]).then(([special_cat_id]) => {
              setDropdownData((prevData) => ({
                ...prevData,
                special_cat_id,
              }));
            });
          });
        }
      }}
    >
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter Title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="picture"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="picture"
            label="Picture"
          />
        )}
      />

      <FormField
        control={form.control}
        name="link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link</FormLabel>
            <FormControl>
              <Input placeholder="Enter Link" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="special_cat_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special category</FormLabel>
            {loading ? (
              'Loading'
            ) : (
              <HierarchicalSelect
                categories={dropdownData.special_cat_id}
                onChange={field.onChange}
                value={field.value}
              />
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="default">
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="hero">Hero</SelectItem>
                <SelectItem value="bento">Bento</SelectItem>
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
    </FormDialog>
  );
}
