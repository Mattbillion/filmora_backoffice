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
import { MoodItemBodyType, moodItemSchema } from "../schema";
import { createMoodItem } from "../actions";
import UploadImageItem from "@/components/custom/upload-image-item";
import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import UploadAudioItem from "@/components/custom/upload-audio-item";
import { useSearchParams } from "next/navigation";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const search = useSearchParams();
  const { data: session } = useSession();

  const form = useForm<MoodItemBodyType>({
    resolver: zodResolver(moodItemSchema),
    defaultValues: {
      title: "",
      status: "0",
      banner: "",
      body: "",
      audio: "",
      audioDuration: 0,
      order: 1,
      moodListId: Number(search.get("moodListId")),
    },
  });

  function onSubmit(values: MoodItemBodyType) {
    startTransition(() => {
      createMoodItem(values)
        .then(() => {
          toast.success("Created successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "moods.item", "create")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Create new Mood list item"
      submitText="Create"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="moodListId"
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
          <UploadAudioItem
            field={field}
            prefix="moodItem_audio"
            label="Audio"
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
