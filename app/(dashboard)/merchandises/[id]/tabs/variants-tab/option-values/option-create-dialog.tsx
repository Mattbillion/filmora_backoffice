'use client';

import { ReactNode, useEffect, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createVariantOptionValue } from '@/app/(dashboard)/merchandises/[id]/tabs/variants-tab/option-values/actions';
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

import { VariantOptionValueBodyType, variantOptionValueSchema } from './schema';

export function CreateOptionValueDialog({
  children,
  variantId,
  onSave,
}: {
  children: ReactNode;
  variantId: ID;
  onSave: () => void;
}) {
  const optionForm = useForm<VariantOptionValueBodyType>({
    resolver: zodResolver(variantOptionValueSchema),
    defaultValues: {
      m_attr_val_id: variantId,
    },
  });
  const [open, setOpen] = useState(false);
  const [attributes, setAttributes] = useState<Record<ID, string>>({});
  const [attributeValues, setAttributeValues] = useState<Record<ID, string>>(
    {},
  );
  const [loadingAttr, startLoadingAttrTransition] = useTransition();
  const [loadingAttrValues, startLoadingAttrValuesTransition] = useTransition();
  const [updating, startUpdateTransition] = useTransition();
  const selectedAttrId = useWatch({
    name: 'attr_id',
    control: optionForm.control,
  });

  useEffect(() => {
    startLoadingAttrTransition(() => {
      Promise.all([getAttributesHash({ page_size: 10000 })]).then(
        ([attributesData]) => {
          setAttributes(attributesData.data);
        },
      );
    });
  }, []);

  function onSubmit(values: VariantOptionValueBodyType) {
    startUpdateTransition(() => {
      createVariantOptionValue(values).then(() => {
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
          <DialogTitle>Add Option Value</DialogTitle>
          <DialogDescription>
            Add option value to current variant
          </DialogDescription>
        </DialogHeader>
        <Form {...optionForm}>
          <form
            id={'option-create-form'}
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
                  <FormLabel>Option name</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      startLoadingAttrValuesTransition(() => {
                        getAttributeValuesHash({
                          page_size: 10000,
                          filters: `attr_id=${value}`,
                        }).then((c) => setAttributeValues(c.data || {}));
                      });
                      field.onChange(Number(value));
                    }}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger disabled={loadingAttr}>
                        <SelectValue placeholder="Select a option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent defaultValue="false">
                      {Object.entries(attributes).map(([attrId, attr], idx) => (
                        <SelectItem key={idx} value={attrId}>
                          {attr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
                      <SelectTrigger
                        disabled={loadingAttrValues || !selectedAttrId}
                      >
                        <SelectValue placeholder="Select a option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                disabled={updating}
                form={'option-create-form'}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
