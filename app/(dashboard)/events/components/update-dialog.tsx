'use client';
import { ReactNode, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import FormDialog, { FormDialogRef } from '@/components/custom/form-dialog';
import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
import UploadImageItem from '@/components/custom/upload-image-item';
import {
  FormControl,
  FormDescription,
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
import { Switch } from '@/components/ui/switch';
import { getAgeRestrictionsHash } from '@/features/age/actions';
import { getHierarchicalCategories } from '@/features/category/actions';
import { HierarchicalSelect } from '@/features/category/components/hierarichal-select';
import { HierarchicalCategory } from '@/features/category/schema';
import { ID } from '@/lib/fetch/types';

import { patchEvents } from '../actions';
import { EventsBodyType, EventsItemType, eventsSchema } from '../schema';

export function UpdateDialog({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: EventsItemType;
}) {
  const dialogRef = useRef<FormDialogRef>(null);
  const [isPending, startTransition] = useTransition();
  const [dropdownData, setDropdownData] = useState<{
    cat_id?: HierarchicalCategory[];
    venue_id?: Record<ID, string>;
    branch_id?: Record<ID, string>;
    hall_id?: Record<ID, string>;
    age_id?: Record<ID, string>;
  }>({});
  const [loading, startLoadingTransition] = useTransition();

  const form = useForm<EventsBodyType>({
    resolver: zodResolver(eventsSchema),
    defaultValues: initialData,
  });

  function onSubmit({ status, ...values }: EventsBodyType) {
    startTransition(() => {
      patchEvents({
        ...values,
        id: initialData.id,
        status,
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
      title="Update Events"
      submitText="Update"
      trigger={children}
      onOpenChange={(c) => {
        if (c) {
          startLoadingTransition(() => {
            Promise.all([
              getHierarchicalCategories().then((res) => res?.data || []),
              getAgeRestrictionsHash().then((res) => res?.data || {}),
            ]).then(([cat_id, age_id]) => {
              setDropdownData((prevData) => ({
                ...prevData,
                cat_id,
                age_id,
              }));
            });
          });
        }
      }}
    >
      <FormField
        control={form.control}
        name="event_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter event name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="event_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Эвент төрөл</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => form.setValue('event_type', value)}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="py-2">
                    <SelectValue placeholder="Эвэнт төрөл сонгох" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mixed">Босоо, Суудал хамт</SelectItem>
                  <SelectItem value="seat">Дан суудлаар</SelectItem>
                  <SelectItem value="bosoo">Босоо</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="event_desc"
        render={({ field }) => <HtmlTipTapItem field={field} />}
      />

      <FormField
        control={form.control}
        name="event_genre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Genre</FormLabel>
            <FormControl>
              <Input placeholder="Technology, Music, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <Select
              value={field.value?.toString()}
              onValueChange={(value) => field.onChange(value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={'Mongolia'}>Mongolia</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="event_capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacity</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="500"
                {...field}
                onChange={(e) =>
                  field.onChange(Number.parseInt(e.target.value) || 0)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="openning_at"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Opening Date & Time</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (hours)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="8"
                {...field}
                onChange={(e) =>
                  field.onChange(Number.parseInt(e.target.value) || 0)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            {loading ? (
              'Loading'
            ) : (
              <HierarchicalSelect
                categories={dropdownData.cat_id || []}
                onChange={field.onChange}
                value={field.value}
              />
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age ID</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(dropdownData?.age_id || {}).map(
                  ([key, val]) => (
                    <SelectItem value={key} key={key}>
                      {val}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="event_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Order</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Event Order"
                {...field}
                onChange={(e) =>
                  field.onChange(Number.parseInt(e.target.value) || 0)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sponsor_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sponsor Name</FormLabel>
            <FormControl>
              <Input placeholder="Sponsor name (optional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_info"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="contact@example.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="web_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input placeholder="https://www.example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fb_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook</FormLabel>
            <FormControl>
              <Input placeholder="https://facebook.com/example" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ig_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input placeholder="https://instagram.com/example" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="event_image"
        render={({ field }) => (
          <UploadImageItem
            field={field}
            imagePrefix="event_image"
            label="Event Image"
          />
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active</FormLabel>
              <FormDescription>
                Event will be visible to the public.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="memo"
        render={({ field }) => (
          <HtmlTipTapItem field={field} label="Тэмдэглэл / Анхааруулга" />
        )}
      />
    </FormDialog>
  );
}
