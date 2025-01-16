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
import {
  createMagazineCategory,
  MagazineCategoryBodyType,
  categorySchema,
} from "@/features/magazine-category";
import FormDialog, { FormDialogRef } from "@/components/custom/form-dialog";
// import UploadImageItem from "@/components/custom/upload-image-item";
// import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function CreateMagazineCategoryDialog({
  children,
}: {
  children: ReactNode;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const form = useForm<MagazineCategoryBodyType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      status: "0",
      // banner: "",
      // description: "",
    },
  });

  function onSubmit(values: MagazineCategoryBodyType) {
    startTransition(() => {
      createMagazineCategory(values)
        .then(() => {
          toast.success("Created successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "magazines.category", "create")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Create new Magazine Category"
      submitText="Create"
      trigger={children}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter name" {...field} />
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
      {/* <FormField
        control={form.control}
        name="banner"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="category_pic"
            label="Banner"
          />
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      /> */}
    </FormDialog>
  );
}
