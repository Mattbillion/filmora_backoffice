/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ReactNode, useEffect, useRef, useTransition } from "react";
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
import { BannerBodyType, BannerItemType, bannerSchema } from "../schema";
import { patchBanner } from "../actions";
import { useBannerProducts } from "../context";
import UploadImageItem from "@/components/custom/upload-image-item";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: BannerItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const {
    products,
    getProducts,
    loading: loadingProducts,
  } = useBannerProducts();
  const { data: session } = useSession();

  const form = useForm<BannerBodyType>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: initialData.title ?? "",
      status: initialData.status.toString() as BannerBodyType["status"],
      banner: initialData.banner,
      product_type:
        initialData.product_type?.toString() as BannerBodyType["product_type"],
      product: initialData.product_id,
    },
  });
  const productType = form.watch("product_type");

  function onSubmit(values: BannerBodyType) {
    startTransition(() => {
      patchBanner({ ...values, id: initialData.id })
        .then(() => {
          toast.success("Updated successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "banners", "update")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Update Banner"
      submitText="Update"
      trigger={children}
      onOpenChange={(isOpen) => {
        if (
          typeof initialData.product_type === "number" &&
          !products[initialData.product_type] &&
          isOpen
        ) {
          getProducts(
            initialData.product_type.toString() as BannerBodyType["product_type"]
          );
        }
      }}
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
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="2">Hidden</SelectItem>
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
        name="product_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product type</FormLabel>
            <Select
              onValueChange={(value: BannerBodyType["product_type"]) => {
                field.onChange(value);

                if (!products[value]) getProducts(value);
              }}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0">Album</SelectItem>
                <SelectItem value="1">Lecture</SelectItem>
                <SelectItem value="2">Training</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="product"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product</FormLabel>
            <Select
              disabled={!products[productType] && loadingProducts}
              onValueChange={(value) => field.onChange(parseInt(value))}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="0">
                {products[productType]?.map((c, idx) => (
                  <SelectItem value={c.id.toString()} key={idx}>
                    {c.name ?? c.title}
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
            imagePrefix="banner_pic"
            label="Banner"
          />
        )}
      />
    </FormDialog>
  );
}
