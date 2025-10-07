'use client';

import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { updateEmployee } from '@/services/employees';
import {
  EmployeeResponseType,
  employeeUpdateSchema,
  EmployeeUpdateType,
} from '@/services/schema';

const ALLOWED_ROLES = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full platform administration.',
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Content production and lifecycle management.',
  },
  {
    value: 'moderator',
    label: 'Moderator',
    description: 'Oversight, QA, and reporting.',
  },
  {
    value: 'support',
    label: 'Support',
    description: 'Support operations and troubleshooting.',
  },
];

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: EmployeeResponseType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EmployeeUpdateType>({
    resolver: zodResolver(
      employeeUpdateSchema.extend({
        full_name: z
          .string()
          .optional()
          .refine((val) => !val?.toLowerCase().includes('filmora'), {
            message: "Full name-д 'Filmora' үг оруулах боломжгүй.",
          }),
      }),
    ),
    defaultValues: {
      email: initialData.email,
      full_name: initialData.full_name,
      role: initialData.role,
      is_active: initialData.is_active,
      password: undefined,
    },
  });

  function onSubmit(values: EmployeeUpdateType) {
    startTransition(() => {
      updateEmployee(initialData.id, values)
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
      title="Ажилтан засах"
      submitText="Засах"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Овог нэх</FormLabel>
            <FormControl>
              <Input placeholder="Овог нэх" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>И-мэйл</FormLabel>
            <FormControl>
              <Input placeholder="И-мэйл" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Шинэ нууц үг</FormLabel>
            <FormControl>
              <Input
                placeholder="Leave blank to keep"
                type="password"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-2">
            <FormLabel>Role</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="border-destructive/50 flex flex-col gap-0 rounded-md border"
              >
                {ALLOWED_ROLES.map((role, idx) => (
                  <FormItem
                    key={idx}
                    className="hover:bg-foreground/10 border-destructive/50 flex cursor-pointer items-start gap-3 p-4 not-last:border-b"
                  >
                    <FormControl>
                      <RadioGroupItem value={role.value} />
                    </FormControl>
                    <FormLabel className="flex flex-1 flex-col">
                      <span className="font-medium">{role.label}</span>
                      <span className="text-sm text-gray-500">
                        {role.description}
                      </span>
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="flex flex-col gap-1">
              <FormLabel className="text-md font-semibold">
                Идэвхтэй эсэх
              </FormLabel>
              <FormDescription className="text-muted-foreground">
                Хэрэглэгч системд нэвтрэх боломжтой эсэхийг тохируулна уу.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value || false}
                onCheckedChange={(checked) => field.onChange(checked)}
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
