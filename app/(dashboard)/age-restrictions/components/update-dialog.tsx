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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { patchAgeRestrictions } from '../actions';
import {
  AgeRestrictionsBodyType,
  AgeRestrictionsItemType,
  ageRestrictionsSchema,
} from '../schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: AgeRestrictionsItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AgeRestrictionsBodyType>({
    resolver: zodResolver(ageRestrictionsSchema),
    defaultValues: {
      ...initialData,
    },
  });

  function onSubmit({ status, ...values }: AgeRestrictionsBodyType) {
    startTransition(() => {
      patchAgeRestrictions({
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
      title="Create new AgeRestrictions"
      submitText="Create"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="age_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Насны ангилал</FormLabel>
            <FormControl>
              <Input placeholder="Enter age restrictions name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="age_limit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Насны хязгаар</FormLabel>
            <FormControl>
              <Input placeholder="Enter age restrictions name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age_desc"
        render={({ field }) => (
          <FormItem>
            <FormLabel>description</FormLabel>
            <FormControl>
              <Input placeholder="Age description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age_order"
        render={({ field: { onChange, ...rst } }) => (
          <FormItem>
            <FormLabel>Age order</FormLabel>
            <FormControl>
              <Input
                placeholder="age_order"
                {...rst}
                type="number"
                onChange={(event) => onChange(Number(event.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="min_age"
        render={({ field: { onChange, ...rst } }) => (
          <FormItem>
            <FormLabel>Min Age</FormLabel>
            <FormControl>
              <Input
                placeholder="min age"
                {...rst}
                type="number"
                onChange={(event) => onChange(Number(event.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="max_age"
        render={({ field: { onChange, ...rst } }) => (
          <FormItem>
            <FormLabel>Max age</FormLabel>
            <FormControl>
              <Input
                placeholder="max age"
                {...rst}
                type="number"
                onChange={(event) => onChange(Number(event.target.value))}
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
                  <SelectValue placeholder="Select a status" />
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
