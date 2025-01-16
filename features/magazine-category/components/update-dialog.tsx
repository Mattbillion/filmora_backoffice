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
  patchMagazineCategory,
  MagazineCategoryBodyType,
  MagazineCategoryItemType,
  categorySchema,
} from "@/features/magazine-category";
import FormDialog, { FormDialogRef } from "@/components/custom/form-dialog";
import { ID } from "@/lib/fetch/types";
// import UploadImageItem from "@/components/custom/upload-image-item";
// import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function UpdateMagazineCategoryDialog({
  data: initialData,
  children,
}: {
  data: MagazineCategoryItemType & { id: ID };
  children: ReactNode;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const form = useForm<MagazineCategoryBodyType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      status: (initialData?.status?.toString() ||
        "0") as MagazineCategoryBodyType["status"],
      // banner: initialData?.banner || "",
      // description: initialData?.description || "",
    },
  });

  function onSubmit(values: MagazineCategoryBodyType) {
    startTransition(() => {
      patchMagazineCategory({ ...values, id: initialData.id })
        .then(() => {
          toast.success("Updated successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "magazines.category", "update")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Update Magazine Category"
      submitText="Update"
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
              <SelectContent>
                {/* <SelectItem value="2">Hidden</SelectItem> */}
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
