'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import CurrencyItem from '@/components/custom/currency-item';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import UploadImageItem from '@/components/custom/upload-image-item';
import { Button } from '@/components/ui/button';
import {
  FieldArray,
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
import { getHierarchicalComCat } from '@/features/category/actions';
import { HierarchicalSelect } from '@/features/category/components/hierarichal-select';
import { HierarchicalCategory } from '@/features/category/schema';
import { getDiscounts } from '@/features/discounts/actions';
import { DiscountsItemType } from '@/features/discounts/schema';

import { createMerchandises } from '../actions';
import { MerchandisesBodyType, merchandisesSchema } from '../schema';
export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<{
    cat_id?: HierarchicalCategory[];
    discount_id?: DiscountsItemType[];
  }>({});
  const [loading, startLoadingTransition] = useTransition();
  const { data: session } = useSession();
  const form = useForm<MerchandisesBodyType>({
    resolver: zodResolver(merchandisesSchema),
    defaultValues: {
      com_id: session?.user?.company_id || 0,
    },
  });

  function onSubmit({ status, ...values }: MerchandisesBodyType) {
    startTransition(() => {
      createMerchandises({
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
      title="Create new Merchandises"
      submitText="Create"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            Promise.all([
              getHierarchicalComCat().then((res) => res?.data || []),
              getDiscounts().then((res) => res?.data?.data || []),
            ]).then(([cat_id, discount_id]) => {
              setDropdownData((prevData) => ({
                ...prevData,
                cat_id,
                discount_id,
              }));
            });
          });
        }
      }}
    >
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
              <CurrencyItem field={field} placeholder={'Enter Price'} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FieldArray name="medias">
        {({ fields, append, remove }) => (
          <div className="space-y-4">
            <FormLabel>Medias</FormLabel>
            <div className="space-y-4 rounded-lg border border-input py-4">
              <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                  <>
                    <div
                      key={field.id}
                      className="relative flex items-start gap-2 px-4"
                    >
                      <FormField
                        control={form.control}
                        name={`medias.${index}.media_url`}
                        render={({ field: itemField }) => (
                          <div className="relative aspect-square w-32 overflow-hidden rounded-md">
                            <Image
                              src={itemField.value}
                              alt=""
                              fill
                              className="object-cover"
                            />

                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute left-2 top-2"
                              onClick={() => remove(index)}
                            >
                              <X />
                            </Button>
                          </div>
                        )}
                      />
                      <div className="flex-1 space-y-2">
                        <FormField
                          control={form.control}
                          name={`medias.${index}.media_label`}
                          render={({ field: itemField }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-sm">
                                Media label
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...itemField}
                                  placeholder="Media label"
                                  className="h-8"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`medias.${index}.media_desc`}
                          render={({ field: itemField }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-sm">
                                Media desc
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...itemField}
                                  placeholder="Media desc"
                                  className="h-8"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="border border-dashed border-border" />
                  </>
                ))}
              </div>

              <div className="px-4">
                <UploadImageItem
                  field={
                    {
                      value: undefined,
                      onChange: (newFile: string) => {
                        append({
                          media_url: newFile,
                          media_desc: '',
                          media_type: 'image',
                          media_label: '',
                        });
                      },
                    } as any
                  }
                  imagePrefix="picture"
                />
              </div>
            </div>
          </div>
        )}
      </FieldArray>

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
    </FormDialog>
  );
}
