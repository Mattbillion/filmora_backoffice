'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { ID } from '@/lib/fetch/types';

import {
  createCategoryAttributeValue,
  deleteCategoryAttributeValue,
  getCategoryAttributeValues,
  patchCategoryAttributesDetail,
  patchCategoryAttributeValue,
} from '../actions';
import {
  CategoryAttributesBodyType,
  CategoryAttributesItemType,
  categoryAttributesSchema,
  CategoryAttributesValueItemType,
} from '../schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: CategoryAttributesItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [loading, startLoadingTransition] = useTransition();
  const [attributeValues, setAttributeValues] = useState<
    CategoryAttributesValueItemType[]
  >([]);

  const form = useForm<CategoryAttributesBodyType>({
    resolver: zodResolver(categoryAttributesSchema),
    defaultValues: initialData,
  });

  function onSubmit({ status, ...values }: CategoryAttributesBodyType) {
    startTransition(() => {
      patchCategoryAttributesDetail({
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
      title="Update Category attributes"
      submitText="Update"
      trigger={children}
      onOpenChange={() =>
        startLoadingTransition(() => {
          getCategoryAttributeValues({
            filters: `attr_id=${initialData.id}`,
          }).then((c) => setAttributeValues(c.data?.data || []));
        })
      }
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
            <FormControl>
              <Input placeholder="Cat id" {...field} type="hidden" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="attr_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Attr name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Attr name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="attr_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />

      <FormField
        control={form.control}
        name="attr_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Attr type</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value)}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="SELECT">
                <SelectItem value="SELECT">Select</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormItem>
        <FormLabel>Attr values</FormLabel>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {attributeValues.map((value, idx) => (
              <AttributeValueItem
                key={idx}
                defaultValue={value.value}
                valueId={value.id}
                onRemove={() =>
                  setAttributeValues(
                    attributeValues.filter((c) => c.id !== value.id),
                  )
                }
                onUpdate={(newValue) =>
                  setAttributeValues(
                    attributeValues.map((c) => ({
                      ...c,
                      value: value.id === c.id ? newValue : c.value,
                    })),
                  )
                }
              />
            ))}
          </div>
          {attributeValues.length < 10 && (
            <CreateAttributeValueItem
              attrId={initialData.id}
              displayOrder={
                Math.max(
                  0,
                  ...attributeValues.map((c) => c.display_order || 0),
                ) + 1
              }
              onCreate={() =>
                startLoadingTransition(() => {
                  getCategoryAttributeValues({
                    filters: `attr_id=${initialData.id}`,
                  }).then((c) => setAttributeValues(c.data?.data || []));
                })
              }
            />
          )}
        </div>
      </FormItem>

      <FormField
        control={form.control}
        name="display_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display order</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Display order"
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

function AttributeValueItem({
  defaultValue = '',
  valueId,
  onRemove,
  onUpdate,
}: {
  defaultValue?: string;
  valueId: ID;
  onRemove: () => void;
  onUpdate: (val: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [removing, startRemoveTransition] = useTransition();
  const [updating, startUpdateTransition] = useTransition();

  return (
    <Card className="space-y-4 p-3">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={removing || updating}
      />
      <div className="flex justify-end gap-3">
        <Button
          size="sm"
          type="button"
          variant="destructive"
          disabled={removing}
          onClick={() =>
            startRemoveTransition(() =>
              deleteCategoryAttributeValue(valueId).then(() => onRemove()),
            )
          }
        >
          Remove
        </Button>
        <Button
          size="sm"
          type="button"
          disabled={updating || value === defaultValue}
          onClick={() =>
            startUpdateTransition(() =>
              patchCategoryAttributeValue({ id: valueId, value }).then(() =>
                onUpdate(value),
              ),
            )
          }
        >
          Edit
        </Button>
      </div>
    </Card>
  );
}

function CreateAttributeValueItem({
  attrId,
  onCreate,
  displayOrder,
}: {
  attrId: ID;
  onCreate: () => void;
  displayOrder: number;
}) {
  const [value, setValue] = useState('');
  const [creating, startCreateTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <Input
        placeholder="Add new attribute value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        type="button"
        onClick={() =>
          startCreateTransition(() =>
            // force fuck
            createCategoryAttributeValue({
              attr_id: attrId,
              value,
              display_order: displayOrder,
              status: true,
            }).then(() => {
              onCreate();
              setValue('');
            }),
          )
        }
        className="h-11"
        disabled={creating}
      >
        Add value
      </Button>
    </div>
  );
}
