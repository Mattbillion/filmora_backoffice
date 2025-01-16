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
import { TaskBodyType, taskSchema, taskTypeNameArr } from "../schema";
import { createTask } from "../actions";
import UploadImageItem from "@/components/custom/upload-image-item";
import { useSearchParams } from "next/navigation";
import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import UploadAudioItem from "@/components/custom/upload-audio-item";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const search = useSearchParams();
  const { data: session } = useSession();

  const form = useForm<TaskBodyType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      type: undefined,
      status: "0",
      isAnswer: "0",
      lessonId: Number(search.get("lessonId")),
      body: "",
      listenAudio: "",
      audioDuration: 0,
      question: "",
      videoUrl: "",
      banner: "",
    },
  });

  function onSubmit(values: TaskBodyType) {
    startTransition(() => {
      createTask(values)
        .then(() => {
          toast.success("Created successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "trainings.tasks", "create")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Create new Task"
      submitText="Create"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="lessonId"
        render={({ field }) => (
          <Input value={field.value} type="hidden" disabled />
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {taskTypeNameArr.map((c, idx) => (
                  <SelectItem value={String(idx)} key={idx}>
                    <span dangerouslySetInnerHTML={{ __html: c }} />
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
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
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
        name="isAnswer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Need answer</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select answer status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Can answer</SelectItem>
                <SelectItem value="0">No answer</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="question"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question</FormLabel>
            <FormControl>
              <Input placeholder="Enter question" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
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
        name="listenAudio"
        render={({ field }) => (
          <UploadAudioItem field={field} prefix="task_audio" label="Audio" />
        )}
      />
      <FormField
        control={form.control}
        name="banner"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="item_pic"
            label="Banner"
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
