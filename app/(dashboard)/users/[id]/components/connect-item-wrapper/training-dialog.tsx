'use client';

import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

import DatePickerItem from '@/components/custom/datepicker-item';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ID } from '@/lib/fetch/types';

import { addTraining } from './actions';
import { useConnectProducts } from './context';

const trainingSchema = z.object({
  trainingId: z.string(),
  packageId: z.string(),
  date: z.string().optional(),
});

type TrainingBodyType = z.infer<typeof trainingSchema>;

export function TrainingDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const router = useRouter();
  const { products, getUser, getProducts, users, loading } =
    useConnectProducts();

  const form = useForm<z.infer<typeof trainingSchema>>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      trainingId: '',
      packageId: '',
    },
  });
  const trainingId = form.watch('trainingId');
  const packageId = form.watch('packageId');

  function onSubmit(values: TrainingBodyType) {
    startTransition(() => {
      addTraining(params.id as unknown as ID, values.packageId, values.date)
        .then(() => {
          toast.success('Connected successfully');
          dialogRef?.current?.close();
          form.reset();
          router.refresh();
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
      title={
        <>
          Connect training package to{' '}
          <b>{users[params.id as unknown as ID]?.nickname}</b>
        </>
      }
      submitText="Connect"
      trigger={children}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          getUser(params.id as unknown as ID);
          getProducts({ purchaseType: 2 });
        }
      }}
    >
      <FormField
        control={form.control}
        name="trainingId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Training</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                getProducts({ purchaseType: 4, trainingId: value });
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select training" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products[2]?.map((c, idx) => (
                  <SelectItem key={idx} value={c.id.toString()}>
                    {c.name}
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
        name="packageId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Package</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value)}
              disabled={loading || !products[`4:${trainingId}`]?.length}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products[`4:${trainingId}`]?.map((c, idx) => (
                  <SelectItem key={idx} value={c.id?.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {!!packageId && (
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <DatePickerItem field={field} label="Open date" disableBy="none" />
          )}
        />
      )}
    </FormDialog>
  );
}
