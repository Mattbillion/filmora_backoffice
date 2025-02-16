'use client';

import { useForm } from 'react-hook-form';

import { EmployeeItemType } from '@/app/(dashboard)/employees/schema';
import UploadImageItem from '@/components/custom/upload-image-item';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const EditForm = ({
  initialData,
}: {
  initialData: EmployeeItemType;
}) => {
  const form = useForm({
    values: initialData,
  });
  return (
    <Form {...form}>
      <form>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="firstname" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="lastname" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <UploadImageItem field={field} imagePrefix={field.name} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
