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
import { useParams, useRouter } from "next/navigation";
import { ID } from "@/lib/fetch/types";
import { addBook } from "./actions";
import { toast } from "sonner";

const bookSchema = z.object({
  bookId: z.string(),
});

type BookBodyType = z.infer<typeof bookSchema>;

export function BookDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const router = useRouter();
  const { products, getUser, getProducts, users } = useConnectProducts();

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      bookId: "",
    },
  });

  function onSubmit(values: BookBodyType) {
    startTransition(() => {
      addBook(params.id as unknown as ID, values.bookId)
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
          Connect book to <b>{users[params.id as unknown as ID]?.nickname}</b>
        </>
      }
      submitText="Connect"
      trigger={children}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          getUser(params.id as unknown as ID);
          getProducts({ purchaseType: 3 });
        }
      }}
    >
      <FormField
        control={form.control}
        name="bookId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Book</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {products[3]?.map((c, idx) => (
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
