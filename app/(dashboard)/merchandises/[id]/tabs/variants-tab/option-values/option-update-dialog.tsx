'use client';

import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
  VariantOptionValueBodyType,
  VariantOptionValueItemType,
  variantOptionValueSchema,
} from './schema';

export function OptionValueDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: VariantOptionValueItemType;
}) {
  const optionForm = useForm<VariantOptionValueBodyType>({
    resolver: zodResolver(variantOptionValueSchema),
    defaultValues: initialData,
  });

  function onSubmit(values: VariantOptionValueBodyType) {}

  return (
    <Dialog>
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
            onSubmit={optionForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={optionForm.control}
              name="option_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Color, Size, Material"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={optionForm.control}
              name="option_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option Value</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Red, XL, Cotton" />
                  </FormControl>
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
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
