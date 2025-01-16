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
import { ArticleBodyType, ArticleItemType, articleSchema } from "../schema";
import { patchPost } from "../actions";
import { useMagazineCategories } from "@/features/magazine-category";
import UploadImageItem from "@/components/custom/upload-image-item";
import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import { User } from "next-auth";
import { hasPermission, Role } from "@/lib/permission";
import { useSession } from "next-auth/react";
import { AlbumField, BookField, LectureField, TrainingField } from "./fields";
import { removeHTML } from "@/lib/utils";
import DatePickerItem from "@/components/custom/datepicker-item";

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: ArticleItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { categories } = useMagazineCategories();
  const { data: session } = useSession();

  const form = useForm<ArticleBodyType>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData.title,
      status: initialData.status.toString() as ArticleBodyType["status"],
      banner: initialData.banner,
      body: initialData.body,
      categoryId: initialData.article_category?.id,
      magazineId: initialData.magazine_id,
      isSpecial: !!initialData.is_special,
      publishedDate: initialData.published_date || initialData.created_at,
      albumId: initialData.album_id ?? undefined,
      lectureId: initialData.lecture_id ?? undefined,
      trainingId: initialData.training_id ?? undefined,
      bookId: initialData.book_id ?? undefined,
    },
  });

  function onSubmit(values: ArticleBodyType) {
    startTransition(() => {
      patchPost({
        ...values,
        id: initialData.id,
        introBody: removeHTML(values.body).slice(0, 300),
      })
        .then(() => {
          toast.success("Updated successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "magazines.articles", "update")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Update article"
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
        name="isSpecial"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Is special</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value === "true")}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Mark as special" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">Special</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="publishedDate"
        render={({ field }) => (
          <DatePickerItem
            field={field}
            label="Published date"
            disableBy="none"
          />
        )}
      />
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              defaultValue={field.value ? field.value.toString() : undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="0">
                {categories.map((c, idx) => (
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
        name="banner"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="post_pic"
            label="Banner"
          />
        )}
      />
      <AlbumField control={form.control} />
      <BookField control={form.control} />
      <LectureField control={form.control} />
      <TrainingField control={form.control} />
      <FormField
        control={form.control}
        name="body"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />
    </FormDialog>
  );
}
