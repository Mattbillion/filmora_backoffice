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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormDialog, { FormDialogRef } from "@/components/custom/form-dialog";

import { z } from "zod";
import { useConnectProducts } from "./context";
import { useParams } from "next/navigation";
import { ID } from "@/lib/fetch/types";
import { addLecture } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const lectureSchema = z.object({
  lectureId: z.string(),
  albumId: z.string(),
});

type LectureBodyType = z.infer<typeof lectureSchema>;

export function LectureDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const router = useRouter();
  const { products, getUser, getProducts, users, loading } =
    useConnectProducts();

  const form = useForm<z.infer<typeof lectureSchema>>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      lectureId: "",
    },
  });
  const albumId = form.watch("albumId");

  function onSubmit(values: LectureBodyType) {
    startTransition(() => {
      addLecture(params.id as unknown as ID, values.lectureId)
        .then(() => {
          toast.success("Connected successfully");
          dialogRef?.current?.close();
          form.reset();
          router.refresh();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title={
        <>
          Connect lecture to{" "}
          <b>{users[params.id as unknown as ID]?.nickname}</b>
        </>
      }
      submitText="Connect"
      trigger={children}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          getUser(params.id as unknown as ID);
          getProducts({ purchaseType: 0 });
        }
      }}
    >
      <FormField
        control={form.control}
        name="albumId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Album</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                getProducts({ purchaseType: 1, albumId: value });
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select album" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products[0]?.map((c, idx) => (
                  <SelectItem key={idx} value={c.id.toString()}>
                    {c.title}
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
        name="lectureId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lecture</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(value)}
              disabled={loading || !products[`1:${albumId}`]?.length}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select lecture" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products[`1:${albumId}`]?.map((c, idx) => (
                  <SelectItem key={idx} value={c.id.toString()}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
