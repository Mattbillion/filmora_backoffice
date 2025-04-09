'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
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
import {
  createRoleByPermission,
  getPermissionList,
} from '@/features/permission/actions';
import {
  PermissionItemType,
  RoleByPermissionBodyType,
  roleByPermissionSchema,
} from '@/features/permission/schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [permissions, setPermissions] = useState<PermissionItemType[]>([]);
  const [isPending, startTransition] = useTransition();
  const [loading, startLoadingTransition] = useTransition();
  const { id } = useParams<{ id: string }>();

  const form = useForm<RoleByPermissionBodyType>({
    resolver: zodResolver(roleByPermissionSchema),
    defaultValues: {
      role_id: id,
    },
  });

  function onSubmit({ status, ...values }: RoleByPermissionBodyType) {
    startTransition(() => {
      createRoleByPermission({
        ...values,
        status: (status as unknown as string) === 'true',
      })
        .then(() => {
          toast.success('Created successfully');
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
      title="Add permission to Role"
      submitText="Add"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            getPermissionList({ page_size: 1000 }).then((cc) =>
              setPermissions(cc.data.data),
            );
          });
        }
      }}
    >
      <FormField
        control={form.control}
        name="role_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="hidden" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="permission_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Permission</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a permission" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {loading && 'Loading...'}
                {permissions.map((c, idx) => (
                  <SelectItem value={c.id.toString()} key={idx}>
                    {c.permission_name}
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
            <FormLabel>Status</FormLabel>
            <Select onValueChange={(value) => field.onChange(value === 'true')}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
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
    </FormDialog>
  );
}
