'use client';

import { ReactNode, useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import MediaDialog from '@/components/custom/media-dialog';
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
import { getMedia } from '@/lib/functions';

import { createMovies } from '../actions';
import { MoviesBodyType, moviesSchema } from '../schema';

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [mediaList, setMediaList] = useState<any>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>([]);
  console.log(mediaList, '<---');

  useEffect(() => {
    getMedia().then((res) => {
      setMediaList(res);
    });
  }, []);

  const form = useForm<MoviesBodyType>({
    resolver: zodResolver(moviesSchema),
  });

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

  const handleSelectMedia = (selectedImages: string[]) =>
    setSelectedMedia(selectedImages);
  const handleRemoveMedia = (mediaId: string) =>
    setSelectedMedia(selectedMedia.filter((m: string) => m !== mediaId));

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

      <FormField
        control={form.control}
        name="poster_url"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="poster_url"
            label="Poster url"
          />
        )}
      />

      <MediaDialog />

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
