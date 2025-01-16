/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ReactNode, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import FormDialog, { FormDialogRef } from "@/components/custom/form-dialog";
import { AlbumBodyType, AlbumItemType, albumSchema } from "../schema";
import { patchAlbum } from "../actions";
import { useTags } from "@/features/tags";
import UploadImageItem from "@/components/custom/upload-image-item";
import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import CurrencyItem from "@/components/custom/currency-item";
import UploadAudioItem from "@/components/custom/upload-audio-item";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: AlbumItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { tags } = useTags();
  const { data: session } = useSession();

  const form = useForm<AlbumBodyType>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: initialData.title,
      status: initialData.status.toString() as AlbumBodyType["status"],
      banner: initialData.banner,
      body: initialData.body,
      intro: initialData.audio ?? undefined,
      introDuration: initialData.audio_duration ?? 0,
      price: initialData.price ?? undefined,
      order: initialData.order ?? 1,
      tags: initialData.tags?.map((c) => c.id.toString()),
    },
  });

  function onSubmit({ order, ...values }: AlbumBodyType) {
    startTransition(() => {
      patchAlbum({ ...values, id: initialData.id, order: Number(order ?? 1) })
        .then(() => {
          toast.success("Updated successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "albums", "update")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Update Album"
      submitText="Update"
      trigger={children}
    >
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
        name="order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order</FormLabel>
            <FormControl>
              <Input placeholder="Enter order" {...field} type="number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
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
            prefix="intro_audio"
            label="Audio"
            durationFieldName="introDuration"
          />
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
