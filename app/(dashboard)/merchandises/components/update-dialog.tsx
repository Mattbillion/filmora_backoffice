'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
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
import { getHierarchicalCategories } from '@/features/category/actions';
import { HierarchicalSelect } from '@/features/category/components/hierarichal-select';
import { HierarchicalCategory } from '@/features/category/schema';
import { getCompanyList } from '@/features/companies/actions';
import { CompanyItemType } from '@/features/companies/schema';

import { patchMerchandises } from '../actions';
import {
  MerchandisesBodyType,
  MerchandisesItemType,
  merchandisesSchema,
} from '../schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: MerchandisesItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<{
    com_id?: CompanyItemType[];
    cat_id?: HierarchicalCategory[];
  }>({});
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<MerchandisesBodyType>({
    resolver: zodResolver(merchandisesSchema),
    defaultValues: initialData,
  });

  function onSubmit({ status, ...values }: MerchandisesBodyType) {
    startTransition(() => {
      patchMerchandises({
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
      title="Update Merchandises"
      submitText="Update"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            Promise.all([
              getCompanyList({ page_size: 1000 }).then(
                (res) => res?.data?.data || [],
              ),
              getHierarchicalCategories().then((res) => res?.data || []),
            ]).then(([com_id, cat_id]) => {
              setDropdownData((prevData) => ({ ...prevData, com_id, cat_id }));
            });
          });
        }
      }}
    >
      <FormField
        control={form.control}
        name="cat_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            {loading ? (
              'Loading'
            ) : (
              <HierarchicalSelect
                categories={dropdownData.cat_id || []}
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
        name="com_id"
        render={({ field }) => (
          <FormItem>
            <Input {...field} type="hidden" />
          </FormItem>
        )}
      />

      {/*<FormField*/}
      {/*  control={form.control}*/}
      {/*  name="cat_id"*/}
      {/*  render={({ field }) => (*/}
      {/*    <FormItem>*/}
      {/*      <FormLabel>Cat id</FormLabel>*/}
      {/*      <Select*/}
      {/*        onValueChange={(value) => field.onChange(Number(value))}*/}
      {/*        value={field.value?.toString()}*/}
      {/*      >*/}
      {/*        <FormControl>*/}
      {/*          <SelectTrigger>*/}
      {/*            <SelectValue placeholder="Select a Cat id" />*/}
      {/*          </SelectTrigger>*/}
      {/*        </FormControl>*/}
      {/*        <SelectContent defaultValue="false">*/}
      {/*          <SelectItem value="0">This</SelectItem>*/}
      {/*          <SelectItem value="2">Is</SelectItem>*/}
      {/*          <SelectItem value="3">Generated</SelectItem>*/}
      {/*        </SelectContent>*/}
      {/*      </Select>*/}
      {/*      <FormMessage />*/}
      {/*    </FormItem>*/}
      {/*  )}*/}
      {/*/>*/}

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
        name="mer_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
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
        name="discount_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount id</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
            >
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
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
