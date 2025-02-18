'use client';

import { useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

import { changeEmployeeEmail } from '@/app/(dashboard)/employees/actions';
import { changeEmailSchema } from '@/app/(dashboard)/employees/components/edit/change-email/resolver';
import {
  EmployeeChangeEmailBody,
  EmployeeItemType,
} from '@/app/(dashboard)/employees/schema';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function ChangeEmail({
  initialData,
}: {
  initialData: EmployeeItemType;
}) {
  const [isPending, startTransition] = useTransition();
  const dialogRef = useRef<FormDialogRef>(null);
  const form = useForm({
    values: initialData,
    mode: 'onChange',
    resolver: zodResolver(changeEmailSchema),
  });

  function handleSubmit(values: EmployeeChangeEmailBody) {
    startTransition(() => {
      changeEmployeeEmail({
        email: values.email,
        company_id: initialData.company_id,
        userId: initialData.id,
      })
        .then((res) => {
          if (res.data?.status === 'success') {
            toast.success(res.data.message);
            dialogRef.current?.close();
            form.reset();
          }
          if (!res.data && res.error) {
            form.setError(
              'email',
              {
                type: 'manual',
                message: res.error,
              },
              {
                shouldFocus: true,
              },
            );
          }
        })

        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {});
    });
  }
  return (
    <FormDialog
      form={form}
      onSubmit={handleSubmit}
      trigger={triggerCard()}
      loading={isPending}
      title="Имэйл хаяг солих"
      submitText="Солих"
      ref={dialogRef}
      containerClassName="overflow-y-hidden"
    >
      <FormField
        name="email"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Шинэ имэйл хаяг</FormLabel>
            <FormControl>
              <Input placeholder="Имэйл хаяг" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}

function triggerCard() {
  return (
    <Card className="flex w-full cursor-pointer flex-col items-start gap-1.5 p-6 transition-colors duration-100 hover:bg-slate-50">
      <CardHeader className="font-regular flex flex-row items-center gap-1.5 space-y-0 p-0 text-base">
        <Mail size={16} />
        <CardTitle>Имэйл хаяг солих</CardTitle>
      </CardHeader>
      <CardDescription className="text-sm text-muted-foreground">
        Имэйл хаяг солих
      </CardDescription>
    </Card>
  );
}
