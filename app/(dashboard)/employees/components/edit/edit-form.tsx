'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Loader } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  patchEmployee,
  updateEmployeeRole,
} from '@/app/(dashboard)/employees/actions';
import {
  EmployeeBodyType,
  EmployeeItemType,
} from '@/app/(dashboard)/employees/schema';
import UploadImageItem from '@/components/custom/upload-image-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRoleList } from '@/features/role/actions';
import { RoleItemType } from '@/features/role/schema';
import { checkPermission } from '@/lib/permission';

export const EditForm = ({
  initialData,
}: {
  initialData: EmployeeItemType;
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    values: initialData,
  });

  const onSubmit = ({ status, ...values }: EmployeeBodyType) => {
    setLoading(true);
    patchEmployee({
      ...values,
      id: initialData.id,
      status: status,
    })
      .then((res) => {
        if (res.data?.status === 'success') {
          toast.success(res.data.message);
          setEdit(false);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-secondary-foreground">
          Ажилтны хувийн мэдээлэл
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="frm1" onSubmit={form.handleSubmit(onSubmit, console.error)}>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нэр</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Нэр"
                        {...field}
                        disabled={!edit || loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Овог нэр</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Овог"
                        {...field}
                        disabled={!edit || loading}
                      />
                    </FormControl>
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
                      <Input
                        placeholder="Имэйл хаяг"
                        {...field}
                        disabled={loading || edit || !edit}
                      />
                    </FormControl>
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
                      <Input
                        placeholder="Утасны дугаар"
                        {...field}
                        disabled={!edit || loading}
                      />
                    </FormControl>
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
                      onValueChange={(value) =>
                        field.onChange(value === 'true')
                      }
                      disabled={!edit || loading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Төлөв сонгох" />
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
                name="profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Профайл зураг</FormLabel>
                    <FormControl>
                      <UploadImageItem
                        field={field}
                        imagePrefix={field.name}
                        disabled={!edit || loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <RoleSelect employee={initialData} disabled={!edit || loading} />
            </div>
          </form>
          <div className="mt-4 flex items-center gap-1">
            {edit && (
              <Button form="frm1" type="submit" disabled={loading}>
                {loading && <Loader className="size-4 animate-spin" />}
                Хадаглах
              </Button>
            )}
            <Button
              onClick={() => setEdit((prevState) => !prevState)}
              variant="outline"
              disabled={loading}
            >
              {edit ? 'Цуцлах' : 'Засах'}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

function RoleSelect({
  employee,
  disabled,
}: {
  employee: EmployeeItemType;
  disabled: boolean;
}) {
  const [roles, setRoles] = useState<RoleItemType[]>([]);
  const [loading, startLoadingTransition] = useTransition();
  const [updating, startUpdatingTransition] = useTransition();
  const { data: session } = useSession();

  useEffect(() => {
    startLoadingTransition(() => {
      getRoleList().then((c) => setRoles(c.data.data || []));
    });
  }, []);
  if (!checkPermission(session, ['set_company_employee_role'])) return null;

  return (
    <div className="space-y-2">
      <Label>Role</Label>
      <Select
        onValueChange={(val) =>
          startUpdatingTransition(() => {
            updateEmployeeRole({
              employee_id: employee.id.toString(),
              role_id: Number(val),
            }).then(() => toast.success('Role updated successfully'));
          })
        }
        disabled={disabled}
      >
        <SelectTrigger disabled={loading || updating}>
          <SelectValue
            placeholder={`${session?.user?.role}` || 'Assign role'}
          />
        </SelectTrigger>
        <SelectContent>
          {roles.map((c, idx) => (
            <SelectItem value={c.id.toString()} key={idx}>
              {c.role_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
