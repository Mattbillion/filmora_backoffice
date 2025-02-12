'use client';

import React, { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

import { changeEmployeePassword } from '@/app/(dashboard)/employees/actions';
import {
  employeeChangePassword,
  EmployeeChangePasswordBody,
  EmployeeItemType,
} from '@/app/(dashboard)/employees/schema';
import { Button } from '@/components/ui/button';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function DetailSheet({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: EmployeeItemType;
}) {
  const passwordForm = useForm<EmployeeChangePasswordBody>({
    resolver: zodResolver(employeeChangePassword),
    defaultValues: { ...initialData },
  });

  const [isLoading, setLoading] = useState<boolean>(false);

  function onPasswordSubmit(values: EmployeeChangePasswordBody) {
    setLoading(true);
    changeEmployeePassword({
      ...values,
      userId: initialData?.id,
    })
      .then((res) => {
        if (res.error) return toast.error(res.error);
        toast.success(res.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <p>{children}</p>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Дэлгэрэнгүй</SheetTitle>
        </SheetHeader>

        {/*Forms*/}
        <ChangePasswordForm
          form={passwordForm}
          onSubmit={onPasswordSubmit}
          loading={isLoading}
        />
      </SheetContent>
    </Sheet>
  );
}

export function ChangePasswordForm({
  form,
  onSubmit,
  loading,
}: {
  form: any;
  onSubmit: (data: EmployeeChangePasswordBody) => void;
  loading: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full space-y-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Нууц үг</FormLabel>
                <FormControl>
                  <Input placeholder="Нууц үг" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader size={16} className="animate-spin" />}
            Солих
          </Button>
        </div>
      </form>
    </Form>
  );
}
