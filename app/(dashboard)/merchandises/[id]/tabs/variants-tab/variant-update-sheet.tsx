'use client';

import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import CurrencyItem from '@/components/custom/currency-item';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { patchVariant } from './actions';
import { OptionValues } from './option-values';
import { VariantBodyType, VariantItemType, variantsSchema } from './schema';

interface VariantEditSheetProps {
  variant: VariantItemType;
  onSave: () => void;
  children: ReactNode;
}

export function VariantEditSheet({
  variant,
  onSave,
  children,
}: VariantEditSheetProps) {
  const [loading, startLoadingTransition] = useTransition();
  const dialogRef = useRef<FormDialogRef>(null);

  const form = useForm<VariantBodyType>({
    resolver: zodResolver(variantsSchema),
    defaultValues: {
      stock: variant?.stock || 0,
      price: variant?.price || 0,
      is_master: variant?.is_master || false,
      status: variant?.status || true,
      cat_id: variant?.cat_id || 0,
      com_id: variant?.com_id || 0,
      merch_id: variant?.merch_id || 0,
    },
  });

  function onSubmit(values: VariantBodyType) {
    startLoadingTransition(() => {
      patchVariant({ id: variant.id, ...values })
        .then(() => {
          onSave();
          toast.success('Updated successfully');
          dialogRef.current?.close();
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
      loading={loading}
      title="Update current variant"
      submitText="Update"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="merch_id"
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
        control={form.control}
        name="com_id"
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
        control={form.control}
        name="cat_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Com id" {...field} type="hidden" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Enter stock quantity"
                />
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
                <CurrencyItem field={field} placeholder={'Enter Price'} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="is_master"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Master Variant</FormLabel>
                <FormDescription>
                  This is the main variant for the product
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Is this variant active and available for purchase?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <OptionValues variantId={variant?.id} />
    </FormDialog>
  );
}
