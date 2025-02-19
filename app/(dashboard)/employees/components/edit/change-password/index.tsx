'use client';

import { useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';

import { changeEmployeePassword } from '@/app/(dashboard)/employees/actions';
import { changePasswordSchema } from '@/app/(dashboard)/employees/components/edit/change-password/resolver';
import {
  EmployeeChangePasswordBody,
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

export function ChangePassword({
  initialData,
}: {
  initialData: EmployeeItemType;
}) {
  const [isPending, startTransition] = useTransition();
  const dialogRef = useRef<FormDialogRef>(null);
  const form = useForm({
    values: initialData,
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  function onSubmit(values: EmployeeChangePasswordBody) {
    startTransition(() => {
      changeEmployeePassword({
        password: values.password,
        company_id: initialData.company_id,
        userId: initialData.id,
      })
        .then((res) => {
          if (res.data?.status === 'success') {
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          form.reset();
          dialogRef.current?.close();
        });
    });
  }
  return (
    <FormDialog
      form={form}
      onSubmit={onSubmit}
      trigger={triggerCard()}
      loading={isPending}
      title="Нууц үг солих"
      submitText="Солих"
      ref={dialogRef}
      containerClassName="overflow-y-hidden"
    >
      <FormField
        name="password"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Шинэ нууц үг</FormLabel>
            <FormControl>
              <Input placeholder="Нууц үг" {...field} type="password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="confirmPassword"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Нууц үг давтах</FormLabel>
            <FormControl>
              <Input placeholder="Нууц үг" {...field} type="password" />
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
    <Card className="flex w-full cursor-pointer flex-col items-start gap-1.5 p-6 transition-colors hover:bg-slate-50">
      <CardHeader className="font-regular flex flex-row items-center gap-1.5 space-y-0 p-0 text-base">
        <LockKeyhole size={16} />
        <CardTitle>Нууц үг солих</CardTitle>
      </CardHeader>
      <CardDescription className="text-sm text-muted-foreground">
        Нэвтрэх нууц үг солих
      </CardDescription>
    </Card>
  );
}
