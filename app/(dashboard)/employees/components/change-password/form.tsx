import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { changeEmployeePassword } from '@/app/(dashboard)/employees/actions';
import { EmployeeItemType } from '@/app/(dashboard)/employees/schema';
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

const changePasswordSchema = z.object({
  password: z.string().min(8),
  company_id: z.string(),
  user_id: z.string(),
});

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm({
  initialData,
}: {
  initialData: EmployeeItemType;
}) {
  const form = useForm<ChangePasswordType>();

  async function onSubmit(values: ChangePasswordType) {
    try {
      const res = await changeEmployeePassword({
        ...values,
        company_id: initialData.company_id,
        userId: initialData.id,
      });
      if (res) {
        form.reset({ password: '' });
        console.log(initialData.id, 'initialData');
        return toast.success(res.data?.message);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Password" />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
