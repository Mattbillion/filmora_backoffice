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
import { FaqBodyType, faqSchema } from "../schema";
import { createFAQ } from "../actions";
import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const form = useForm<FaqBodyType>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      status: "0",
    },
  });

  function onSubmit(values: FaqBodyType) {
    startTransition(() => {
      createFAQ(values)
        .then(() => {
          toast.success("Created successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "faqs", "create")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Create new FAQ"
      submitText="Create"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="question"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter question" {...field} />
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
        name="answer"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />
    </FormDialog>
  );
}
