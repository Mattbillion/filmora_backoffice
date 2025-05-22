'use client';

import { ReactNode, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { patchVariantOptionValue } from '@/app/(dashboard)/merchandises/[id]/tabs/variants-tab/option-values/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
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
  getAttributesHash,
  getAttributeValuesHash,
} from '@/features/attributes/actions';
import { ID } from '@/lib/fetch/types';

import {
  VariantOptionValueBodyType,
  VariantOptionValueItemType,
  variantOptionValueSchema,
} from './schema';

export function OptionValueDialog({
  children,
  initialData,
  onSave,
}: {
  onSave: () => void;
  children: ReactNode;
  initialData: VariantOptionValueItemType;
}) {
  const optionForm = useForm<VariantOptionValueBodyType>({
    resolver: zodResolver(variantOptionValueSchema),
    defaultValues: initialData,
  });
  const [open, setOpen] = useState(false);
  const [attributes, setAttributes] = useState<Record<ID, string>>({});
  const [attributeValues, setAttributeValues] = useState<Record<ID, string>>(
    {},
  );
  const [loadingAttr, startLoadingAttrTransition] = useTransition();
  const [updating, startUpdateTransition] = useTransition();

  useEffect(() => {
    startLoadingAttrTransition(() => {
      Promise.all([
        getAttributesHash({ page_size: 10000 }),
        getAttributeValuesHash({
          page_size: 10000,
          filters: `attr_id=${initialData.attr_id}`,
        }),
      ]).then(([attributesData, attributeValuesData]) => {
        setAttributes(attributesData.data);
        setAttributeValues(attributeValuesData.data);
      });
    });
  }, []);

  function onSubmit(values: VariantOptionValueBodyType) {
    startUpdateTransition(() => {
      patchVariantOptionValue({ id: initialData.id, ...values }).then(() => {
        onSave();
        setOpen(false);
      });
    });
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Option Value</DialogTitle>
          <DialogDescription>
            Update the option details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...optionForm}>
          <form
            id={'option-update-form'}
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              optionForm.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormField
              control={optionForm.control}
              name="m_attr_val_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={optionForm.control}
              name="attr_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option Name</FormLabel>
                  <FormControl>
                    <Input value={attributes[field.value]} disabled />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={optionForm.control}
              name="attr_val_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option value</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger disabled={loadingAttr}>
                        <SelectValue placeholder="Select a option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent defaultValue="false">
                      {Object.entries(attributeValues).map(
                        ([attrId, attr], idx) => (
                          <SelectItem key={idx} value={attrId}>
                            {attr}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                form={'option-update-form'}
                disabled={updating}
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
