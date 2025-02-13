import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
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
  password: z
    .string()
    .min(8, 'Нууц үг заавал 8-аас дээш оронтой байна.')
    .refine((value) => /[!@#$&*,.?":{}|<>]/.test(value), {
      message: 'Нууц үг нь заавал нэг тусгай тэмдэгт агуулна. (!@#$%^&*)',
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Нууц үг заавал нэг том үсэгтэй байна. (A-Z).',
    }),
});

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm({
  initialData,
  closeSheet,
}: {
  initialData: EmployeeItemType;
  closeSheet: () => void;
}) {
  const form = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: ChangePasswordType) {
    try {
      const res = await changeEmployeePassword({
        ...values,
        company_id: initialData.company_id,
        userId: initialData.id,
      });
      if (res) {
        form.reset({ password: '' });
        closeSheet();
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
          <div className="flex w-full flex-col gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Нууц үг солих</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Password" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading && <Loader size={16} className="animate-spin" />}
              Солих
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
