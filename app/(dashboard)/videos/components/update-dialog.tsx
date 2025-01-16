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
import { VideoBodyType, VideoItemType, videoSchema } from "../schema";
import { patchVideo } from "../actions";
import { useTags } from "@/features/tags";
import UploadImageItem from "@/components/custom/upload-image-item";
import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: VideoItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { tags } = useTags();
  const { data: session } = useSession();

  const form = useForm<VideoBodyType>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: initialData.title,
      status: initialData.status.toString() as VideoBodyType["status"],
      banner: initialData.banner,
      body: initialData.body,
      videoUrl: initialData.video_url,
      order: initialData.order ?? 1,
      tags: initialData.tags?.map((c) => c.id.toString()),
    },
  });

  function onSubmit(values: VideoBodyType) {
    startTransition(() => {
      patchVideo({ ...values, id: initialData.id })
        .then(() => {
          toast.success("Updated successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "videos", "update")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Update Video"
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
              <SelectContent>
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
        name="videoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Youtube video ID</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                {field.value && (
                  //eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://img.youtube.com/vi_webp/${field.value}/1.webp`}
                    alt=""
                    className="rounded-md h-11 aspect-video object-cover"
                  />
                )}
                <Input placeholder="Youtube video ID" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
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
