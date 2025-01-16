"use client";

import { ReactNode, useCallback, useRef, useTransition } from "react";
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
import { MagazineBodyType, magazineSchema } from "../schema";
import { createMagazine } from "../actions";
import UploadImageItem from "@/components/custom/upload-image-item";
import HtmlTipTapItem from "@/components/custom/html-tiptap-item";
import { hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import CurrencyItem from "@/components/custom/currency-item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";

type MagazineFormType = MagazineBodyType & {
  dateRange: {
    from: string | Date;
    to: string | Date;
  };
};

export function CreateDialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();

  const form = useForm<MagazineFormType>({
    resolver: zodResolver(magazineSchema),
    defaultValues: {
      status: "0",
      startDate: dayjs().startOf("week").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("week").format("YYYY-MM-DD"),
      dateRange: {
        from: dayjs().startOf("week").toDate(),
        to: dayjs().endOf("week").toDate(),
      },
    },
  });

  function onSubmit({ dateRange, ...values }: MagazineFormType) {
    startTransition(() => {
      createMagazine({
        ...values,
        startDate: dayjs(dateRange?.from || values.startDate).format(
          "YYYY-MM-DD"
        ),
        endDate: dayjs(dateRange?.to || values.endDate).format("YYYY-MM-DD"),
      })
        .then(() => {
          toast.success("Created successfully");
          dialogRef?.current?.close();
          form.reset();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  const adjustToWeekRange = useCallback((date: Date) => {
    const adjustedDate = dayjs(date);
    return {
      from: adjustedDate.startOf("week").toDate(),
      to: adjustedDate.endOf("week").toDate(),
    };
  }, []);

  const role = (session?.user as User & { role: Role })?.role;
  if (!hasPermission(role, "magazines", "create")) return null;
  return (
    <FormDialog
      ref={dialogRef}
      form={form}
      onSubmit={onSubmit}
      loading={isPending}
      title="Create new Magazine"
      submitText="Create"
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
        name="bannerType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mark as banner</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="0">
                <SelectItem value="hero">Hero</SelectItem>
                <SelectItem value="banner">Banner</SelectItem>
                <SelectItem value="remove">Cancel</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => <CurrencyItem field={field} label="Price" />}
      />
      <FormField
        control={form.control}
        name="MagizineNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Magazine number</FormLabel>
            <FormControl>
              <Input
                {...field}
                min={1}
                placeholder="Enter magazine number"
                type="number"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dateRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Magazine date</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal flex",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from && field.value?.to ? (
                      <>
                        {dayjs(field.value.from).format("YYYY-MM-DD")} -{" "}
                        {dayjs(field.value.to).format("YYYY-MM-DD")}
                      </>
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="single"
                    defaultMonth={new Date(field.value.from)}
                    selected={new Date(field.value.from)}
                    onSelect={(d) => {
                      const range = adjustToWeekRange(d || new Date());
                      field.onChange(range);
                      form.setValue("startDate", range.from.toISOString());
                      form.setValue("endDate", range.to.toISOString());
                    }}
                    numberOfMonths={1}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="statName1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stats text 1</FormLabel>
                <FormControl>
                  <Input placeholder="Stats text 1" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="number1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stats number 1</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Stats number 1"
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="statName2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stats text 2</FormLabel>
                <FormControl>
                  <Input placeholder="Stats text 2" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="number2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stats number 2</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Stats number 2"
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="statName3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stats text 3</FormLabel>
                <FormControl>
                  <Input placeholder="Stats text 3" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="number3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stats number 3</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Stats number 3"
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <FormField
            control={form.control}
            name="statName4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stats text 4</FormLabel>
                <FormControl>
                  <Input placeholder="Stats text 4" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6">
          <FormField
            control={form.control}
            name="number4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stats number 4</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Stats number 4"
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <FormField
        control={form.control}
        name="banner"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="magazine_pic"
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
