'use client';

import { ReactNode, useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { getCompanyList } from '@/app/(dashboard)/companies/actions';
import { CompanyItemType } from '@/app/(dashboard)/companies/schema';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import UploadImageItem from '@/components/custom/upload-image-item';
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

import { createEmployee } from '../actions';
import { EmployeeBodyType, employeeSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [companies, setCompanies] = useState<CompanyItemType[]>([]);

  useEffect(() => {
    getCompanyList()
      .then((res) => {
        setCompanies(res.data.data || []);
      })

      .catch((e) => toast.error(e));
  }, []);
  const form = useForm<EmployeeBodyType>({
    resolver: zodResolver(employeeSchema),
  });

  function onSubmit({ status, ...values }: EmployeeBodyType) {
    if (!values.password) {
      form.setError(
        'password',
        { message: 'Нууц үг оруулна уу.' },
        { shouldFocus: true },
      );
    }

    if (!values.confirmPassword) {
      form.setError(
        'confirmPassword',
        { message: 'Нууц үг давтах' },
        { shouldFocus: true },
      );
    }

    startTransition(() => {
      createEmployee({
        ...values,
        status: status,
      })
        .then(() => {
          toast.success('Created successfully');
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => {
          if (e.message === 'Имэйл бүртгэгдсэн байна') {
            return form.setError(
              'email',
              { message: e.message },
              { shouldFocus: true },
            );
          }
          return toast.error(e.message);
        });
    });
  }

  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Create new Employee"
      submitText="Create"
      trigger={children}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Овог</FormLabel>
              <FormControl>
                <Input placeholder="Овог нэр" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нэр</FormLabel>
              <FormControl>
                <Input placeholder="Нэр" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Утасны дугаар</FormLabel>
              <FormControl>
                <Input placeholder="Утасны дугаар" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имэйл хаяг</FormLabel>
              <FormControl>
                <Input placeholder="Example@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile"
          render={({ field }) => (
            <UploadImageItem
              field={field}
              imagePrefix={field.name}
              label="Профайл зураг"
            />
          )}
        />

        <FormField
          control={form.control}
          name="email_verified"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email verified</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'true')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Email verified" />
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

        <FormField
          control={form.control}
          name="company_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Компани</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Company id" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent defaultValue="false">
                  {!!companies &&
                    companies.map((company) => (
                      <SelectItem value={`${company.id}`} key={company.id}>
                        {company.company_name}
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
              <FormLabel>Төлөв</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'true')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Төлөв сонгох" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent defaultValue="false">
                  <SelectItem value="true">Идэвхтэй</SelectItem>
                  <SelectItem value="false">Идэвхгүй</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нууц үг оруулах</FormLabel>
              <FormControl>
                <Input placeholder="Нууц үг" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нууц үг оруулах</FormLabel>
              <FormControl>
                <Input
                  placeholder="Нууц үг давтах"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormDialog>
  );
}
