'use client';

import { ReactNode, useRef, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import CurrencyItem from '@/components/custom/currency-item';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import UploadAudioItem from '@/components/custom/upload-audio-item';
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
import { useTags } from '@/features/tags';
import { hasPermission, Role } from '@/lib/permission';

import { patchLecture } from '../actions';
import { LectureBodyType, LectureItemType, lectureSchema } from '../schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: LectureItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { tags } = useTags();
  const { data: session } = useSession();

  const form = useForm<LectureBodyType>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: initialData.title,
      status: initialData.status.toString() as LectureBodyType['status'],
      banner: initialData.banner,
      body: initialData.body,
      audio: initialData.audio,
      intro: initialData.intro,
      introDuration: initialData.intro_duration ?? 0,
      audioDuration: initialData.audio_duration ?? 0,
      price: initialData.price,
      albumId: initialData.album_id,
      order: initialData.order ?? 1,
      tags: initialData.tags?.map((c) => c.id.toString()),
    },
  });

  function onSubmit(values: LectureBodyType) {
    startTransition(() => {
      patchLecture({ ...values, id: initialData.id })
        .then(() => {
          toast.success('Updated successfully');
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, 'albums.lectures', 'update')) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Update Lecture"
      submitText="Update"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="albumId"
        render={({ field }) => <Input value={field.value} type="hidden" />}
      />
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter title" {...field} />
            </FormControl>
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
            <Select
              onValueChange={(value) => field.onChange(value)}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="0">
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <Select
              onValueChange={(value) => field.onChange([value])}
              defaultValue={field.value ? field.value.toString() : undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="0">
                {tags.map((c, idx) => (
                  <SelectItem value={c.id.toString()} key={idx}>
                    {c.name}
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
        name="price"
        render={({ field }) => <CurrencyItem field={field} label="Price" />}
      />
      <FormField
        control={form.control}
        name="banner"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="post_pic"
            label="Banner"
          />
        )}
      />
      <FormField
        control={form.control}
        name="intro"
        render={({ field }) => (
          <UploadAudioItem
            field={field}
            maxSize={100000000}
            prefix="lecture_intro"
            label="Intro audio"
            durationFieldName="introDuration"
          />
        )}
      />
      <FormField
        control={form.control}
        name="audio"
        render={({ field }) => (
          <UploadAudioItem field={field} prefix="lecture_audio" label="Audio" />
        )}
      />
      <FormField
        control={form.control}
        name="body"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />
    </FormDialog>
  );
}
