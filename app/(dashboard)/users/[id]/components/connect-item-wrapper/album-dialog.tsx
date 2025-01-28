'use client';

import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ID } from '@/lib/fetch/types';

import { addAlbum } from './actions';
import { useConnectProducts } from './context';

const albumSchema = z.object({
  albumId: z.string(),
});

type AlbumBodyType = z.infer<typeof albumSchema>;

export function AlbumDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const router = useRouter();
  const { products, getUser, getProducts, users } = useConnectProducts();

  const form = useForm<z.infer<typeof albumSchema>>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      albumId: '',
    },
  });

  function onSubmit(values: AlbumBodyType) {
    startTransition(() => {
      addAlbum(params.id as unknown as ID, values.albumId)
        .then(() => {
          toast.success('Connected successfully');
          dialogRef?.current?.close();
          form.reset();
          router.refresh();
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
      title={
        <>
          Connect album to <b>{users[params.id as unknown as ID]?.nickname}</b>
        </>
      }
      submitText="Connect"
      trigger={children}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          getUser(params.id as unknown as ID);
          getProducts({ purchaseType: 0 });
        }
      }}
    >
      <FormField
        control={form.control}
        name="albumId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Album</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select album" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products[0]?.map((c, idx) => (
                  <SelectItem key={idx} value={c.id.toString()}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
