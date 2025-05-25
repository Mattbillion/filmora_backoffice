'use client';
import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

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
import { Switch } from '@/components/ui/switch';
import { HierarchicalCategory } from '@/features/category/schema';
import { ID } from '@/lib/fetch/types';

import { patchOptionTypes } from '../../../../features/option-types/actions';
import {
  OptionTypesBodyType,
  OptionTypesItemType,
  optionTypesSchema,
} from '../../../../features/option-types/schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: OptionTypesItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<{
    cat_id?: HierarchicalCategory[];
    venue_id?: Record<ID, string>;
    branch_id?: Record<ID, string>;
    hall_id?: Record<ID, string>;
    age_id?: Record<ID, string>;
  }>({});
  const [loading, startLoadingTransition] = useTransition();
  const [loadingBranches, startLoadingBranches] = useTransition();
  const [loadingHalls, startLoadingHalls] = useTransition();

  const form = useForm<OptionTypesBodyType>({
    resolver: zodResolver(optionTypesSchema),
    defaultValues: initialData,
  });

  function onSubmit({ status, ...values }: OptionTypesBodyType) {
    startTransition(() => {
      patchOptionTypes({
        ...values,
        id: initialData.id,
        status,
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
      title="Update OptionTypes"
      submitText="Update"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="option_type"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Com id" {...field} type="hidden" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="option_name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter name : Size,Color" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="option_name_mn"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name mn</FormLabel>
            <FormControl>
              <Input placeholder="Enter name : Хэмжээ,Өнгө" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="option_desc"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Option description</FormLabel>
            <FormControl>
              <Input placeholder="Enter option description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="display_order"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display order</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter display order"
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active</FormLabel>
              <FormDescription>
                Option type will be visible to the public.
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
