'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQueryString } from '@/hooks/use-query-string';
import { objToQs } from '@/lib/utils';

const searchSchema = z.object({
  email: z.string({ message: 'Email оруулна уу' }).min(2, 'Email оруулна уу'),
});

export function Search() {
  const router = useRouter();
  const { email, ...qsObj } = useQueryString();
  const form = useForm<{ email: string }>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      email: email ?? '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          router.replace(
            `/users?${objToQs({ ...qsObj, email: values.email })}`,
          ),
        )}
        className="flex items-center gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Search by email" {...field} size={40} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button size="lg">Search</Button>
      </form>
    </Form>
  );
}
