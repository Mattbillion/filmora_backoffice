'use client';

import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { BranchItemType } from '@/app/(dashboard)/branches/schema';
import { VenuesItemType } from '@/app/(dashboard)/venues/schema';
import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import UploadImageItem from '@/components/custom/upload-image-item';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { fetchBranches, fetchVenues, patchHalls } from '../actions';
import { HallsBodyType, HallsItemType, hallsSchema } from '../schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: HallsItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [branchIds, setBranchIds] = useState<BranchItemType[]>([]);
  const [venues, setVenues] = useState<VenuesItemType[]>([]);

  const form = useForm<HallsBodyType>({
    resolver: zodResolver(hallsSchema),
    defaultValues: {
      ...initialData,
    },
  });

  function getBranch(filters?: Record<any, any>) {
    fetchBranches(filters)
      .then((res) => setBranchIds(res.data.data))
      .catch((err) => toast.error(err));
  }

  function onSubmit({ status, ...values }: HallsBodyType) {
    startTransition(() => {
      patchHalls({
        ...values,
        id: initialData.id,
        status: (status as unknown as string) === 'true',
      })
        .then(() => {
          toast.success('Updated successfully');
          dialogRef?.current?.close();
          form.reset();
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
      title="Update Halls"
      submitText="Update"
      trigger={children}
      onOpenChange={() => {
        fetchVenues()
          .then((res) => {
            setVenues(res.data.data);
          })
          .catch((err) => toast.error(err));
        getBranch();
      }}
    >
      <FormField
        control={form.control}
        name="hall_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Hall name" {...field} />
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
              onValueChange={(value) => field.onChange(value === 'true')}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="false">
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="venue_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue id</FormLabel>
            <Select
              defaultValue={field.value?.toString()}
              onValueChange={(value) => {
                field.onChange(Number(value));
                getBranch({
                  filters: `venue_id=${Number(value)}`,
                });
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Venue id" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {venues?.map((item) => (
                  <SelectItem value={item.id.toString()} key={item.venue_name}>
                    {item.venue_name}
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
        name="branch_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch id</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Branch id" />
                </SelectTrigger>
              </FormControl>
              <SelectContent defaultValue="0">
                {branchIds.map((item) => (
                  <SelectItem value={`${item.id}`} key={item.id}>
                    {item.branch_name}
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
        name="hall_image"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="hall_image"
            label="Hall image"
          />
        )}
      />

      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacity</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Capacity"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hall_location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall location</FormLabel>
            <FormControl>
              <Input placeholder="Enter Hall location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hall_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall order</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Hall order"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hall_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hall type</FormLabel>
            <FormControl>
              <Input placeholder="Enter Hall type" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities</FormLabel>
            <FormControl>
              <Input placeholder="Enter Amenities" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hall_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />
    </FormDialog>
  );
}
