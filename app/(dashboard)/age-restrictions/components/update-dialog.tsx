'use client';

import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
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
import { patchAgeRestrictionsDetail } from '@/features/age/actions';
import {
  AgeRestrictionsBodyType,
  AgeRestrictionsItemType,
  ageRestrictionsSchema,
} from '@/features/age/schema';

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
    defaultValues: initialData,
  });

  function onSubmit({ status, ...values }: AgeRestrictionsBodyType) {
    startTransition(() => {
      patchAgeRestrictionsDetail({
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
      title="Насны ангилал засах"
      submitText="Update"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="age_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Насны ангилал нэр</FormLabel>
            <FormControl>
              <Input placeholder="Enter Age name" {...field} />
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
            <FormLabel>Age limit</FormLabel>
            <FormControl>
              <Input placeholder="Enter Age limit" {...field} />
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
            <Select
              onValueChange={(value) => field.onChange(value === 'true')}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Төлөв сонгох" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">Идэвхтэй</SelectItem>
                <SelectItem value="false">Идэвхгүй</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="min_age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min age</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Min age"
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
          name="max_age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max age</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Max age"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="age_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Эрэмблэх</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Age order"
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
        name="age_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />
    </FormDialog>
  );
}
