/* eslint-disable */

'use client';

import {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import { MediaDialog } from '@/components/custom/media-dialog';
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

import { createMovies } from '../actions';
import { MoviesBodyType, moviesSchema } from '../schema';

type CategoriesItemType = any;

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<CategoriesItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const movieCategories = useMemo(() => {
    return categories.map((category) => category);
  }, [categories]);

  const form = useForm<MoviesBodyType>({
    resolver: zodResolver(moviesSchema),
    defaultValues: {
      poster_url:
        'https://pub-d5eb1ad6397e41f3b73dbf714e065f20.r2.dev/images/7ebf3035-43a8-4065-a783-1dd57b496c66/a447a117-f5b7-4fa7-a3c5-0d27cc68fc8c.webp',
      categories_ids: [1, 2],
      genres_ids: [1, 2],
    },
  });

  const formValues = form.getValues();

  useEffect(() => {
    console.log(formValues, 'Form values!!!');
  }, []);

  function onSubmit({ ...values }: MoviesBodyType) {
    startTransition(() => {
      createMovies({
        ...values,
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
      title="Create new Movies"
      submitText="Create"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="categories_ids"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categories</FormLabel>
            <FormControl>
              <Select onValueChange={(value) => field.onChange(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  {movieCategories?.map((category: CategoriesItemType[0]) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter Title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <Input placeholder="Enter Type" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Year"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input placeholder="Enter Price" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_premium"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Is premium</FormLabel>
            <Select onValueChange={(value) => field.onChange(value === 'true')}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Is premium" />
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

      <MediaDialog />

      {/* <FormField
        control={form.control}
        name="poster_url"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="poster_url"
            label="Poster url"
          />
        )}
      /> */}

      <FormField
        control={form.control}
        name="is_adult"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Is adult</FormLabel>
            <Select onValueChange={(value) => field.onChange(value === 'true')}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Is adult" />
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
