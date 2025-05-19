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
import {
  createCategory,
  getHierarchicalCategories,
} from '@/features/category/actions';
import { HierarchicalSelect } from '@/features/category/components/hierarichal-select';
import {
  CategoryBodyType,
  categorySchema,
  HierarchicalCategory,
} from '@/features/category/schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<HierarchicalCategory[]>([]);
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<CategoryBodyType>({
    resolver: zodResolver(categorySchema),
  });

  function onSubmit({ special, ...values }: CategoryBodyType) {
    startTransition(() => {
      createCategory({
        ...values,
        special: (special as unknown as string) === 'true',
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
      title="Create new Category"
      submitText="Create"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            getHierarchicalCategories().then((res) =>
              setCategories(res?.data || []),
            );
          });
        }
      }}
    >
      <FormField
        control={form.control}
        name="cat_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cat type</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="ITEM">
                <SelectItem value="ITEM">ITEM</SelectItem>
                <SelectItem value="EVENT">EVENT</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="root"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Root</FormLabel>
            {loading ? (
              'Loading'
            ) : (
              <HierarchicalSelect
                categories={categories}
                onChange={field.onChange}
                value={field.value}
                depthLimit={2}
              />
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cat_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cat name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Cat name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Order"
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
        name="special"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special</FormLabel>
            <Select onValueChange={(value) => field.onChange(value === 'true')}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Special" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="false">
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />

      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <UploadImageItem field={field} imagePrefix="image" label="Image" />
        )}
      />
    </FormDialog>
  );
}
