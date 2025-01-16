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
import { BookBodyType, bookSchema } from "../schema";
import { createBook } from "../actions";
import { useTags } from "@/features/tags";
import UploadImageItem from "@/components/custom/upload-image-item";
import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import CurrencyItem from "@/components/custom/currency-item";
import UploadAudioItem from "@/components/custom/upload-audio-item";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { tags } = useTags();
  const { data: session } = useSession();

  const form = useForm<BookBodyType>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      status: "0",
      banner: "",
      body: "",
      audio: "",
      audioDuration: 0,
      order: 1,
      price: undefined,
      tags: [],
    },
  });

  function onSubmit(values: BookBodyType) {
    startTransition(() => {
      createBook(values)
        .then(() => {
          toast.success("Created successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "books", "create")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Create new Book"
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
        name="audio"
        render={({ field }) => (
          <UploadAudioItem field={field} prefix="book_audio" label="Audio" />
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
