'use client';
import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { changeEmployeeEmail } from '@/app/(dashboard)/employees/actions';
import {
  employeeChangeEmail,
  EmployeeChangeEmailBody,
  EmployeeItemType,
} from '@/app/(dashboard)/employees/schema';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function ChangeEmailDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: EmployeeItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const form = useForm<EmployeeChangeEmailBody>({
    resolver: zodResolver(employeeChangeEmail),
    defaultValues: { ...initialData },
  });
  const [isPending, startTransition] = useTransition();

  function onSubmit(values: EmployeeChangeEmailBody) {
    startTransition(() => {
      changeEmployeeEmail({
        ...values,
        company_id: initialData.company_id,
        userId: initialData.id,
      }).then((res) => {
        if (res.error) return toast.error(res.error);

        toast.success(res.data?.message);
        dialogRef.current?.close();
        form.reset();
      });
    });
  }
  return (
    <FormDialog
      form={form}
      onSubmit={onSubmit}
      ref={dialogRef}
      loading={isPending}
      title="Нууц үг солих"
      submitText="Солих"
      trigger={children}
      containerClassName="!overflow-y-hidden "
    >
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Имэйл хаяг</FormLabel>
            <FormControl>
              <Input placeholder="Имэйл хаяг" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
