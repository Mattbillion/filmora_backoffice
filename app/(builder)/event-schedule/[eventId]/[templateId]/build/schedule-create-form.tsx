'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Konva from 'konva';
import { SaveIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import CurrencyItem from '@/components/custom/currency-item';
import DatePickerItem from '@/components/custom/datepicker-item';
import { LoaderIcon } from '@/components/custom/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { downloadToPreview, objToFormData } from '@/lib/utils';

import { createSchedule } from './actions';
import { ScheduleBodyType, scheduleSchema } from './schema';
import { dataMap, KNode } from './seatmap';
import { useStage } from './seatmap/context/stage';

export function CreateScheduleDialog() {
  const { eventId, templateId } = useParams();
  const [isPending, startTransition] = useTransition();
  const { getStage } = useStage();

  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<ScheduleBodyType>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      status: true,
      template_id: Number(templateId),
    },
  });

  function createJsonFile(jsonString: any, name = 'stage.json') {
    const blob = new Blob([jsonString], { type: 'application/json' });

    downloadToPreview(blob, name);
    return new File([blob], name, { type: 'application/json' });
  }

  function onSubmit(values: ScheduleBodyType) {
    startTransition(async () => {
      const clonedStage = getStage().clone()!;
      clonedStage?._clearCaches();
      const clonedBaseLayer = clonedStage?.getLayers()[0]!;
      clonedBaseLayer?.setAttr('opacity', 1);

      const ticketsSection: Konva.Node = clonedStage
        ?.findOne('.tickets')
        ?.clone();
      ticketsSection?.setAttr('opacity', 1);

      const purchasableItems =
        ticketsSection
          //@ts-ignore
          ?.find(
            (c: KNode) =>
              [dataMap.r, dataMap.t, dataMap.s].includes(
                c.attrs['data-type'],
              ) && c.attrs['data-purchasable'],
          )
          .map((c: KNode) => {
            const json = c.toObject();
            return Object.fromEntries(
              Object.entries({
                ...json.attrs,
                className: json.className,
              }).filter(
                ([k]) =>
                  json.className !== 'Text' &&
                  (k === 'id' || k.startsWith('data-')),
              ),
            );
          }) || [];

      try {
        const date = new Date(values.date).toISOString().split('T')[0];

        const startAtTime = values.start_at;
        const endAtTime = values.end_at;

        const startAt = `${date}T${startAtTime}:00`;
        const endAt = `${date}T${endAtTime}:00`;

        const { data } = await createSchedule(
          eventId as string,
          objToFormData({
            ...values,
            start_at: startAt,
            end_at: endAt,
            seat_json: createJsonFile(
              JSON.stringify(purchasableItems),
              'seats.json',
            ),
          }),
        );
        if (!data) return;
        console.log(data);
        // const seatIdObj: Record<string, number> = data.seats.reduce(
        //   (acc, cur) => ({ ...acc, [cur.seat_no]: cur.id }),
        //   {},
        // );
        //
        // // define all ticket like nodes as not purchasable
        // //@ts-ignore
        // ticketsSection.find((n) => {
        //   const seatId = seatIdObj[n.id()];
        //   if (seatId) {
        //     n.setAttr('data-seat-id', seatId);
        //     n.setAttr(
        //       'data-price',
        //       Number(values.current_price) +
        //         Number(n.getAttr('data-price') || 0) +
        //         Number(n.getAttr('data-additionalPrice') || 0),
        //     );
        //   }
        // });
        //
        // const { data: uploadedData } = await uploadTemplateJSON(
        //   toFormData({
        //     template_id: data.template_id,
        //     company_id: session?.user?.company_id,
        //     tickets_file: createJsonFile(
        //       ticketsSection.toJSON(),
        //       'tickets.json',
        //     ),
        //     mask_file: createJsonFile(masksSection.toJSON(), 'masks.json'),
        //     other_file: createJsonFile(clonedStage.toJSON(), 'others.json'),
        //   }),
        // );
        //
        // if (uploadedData)
        // router.replace(`/events/${eventId}/schedules`);
      } catch (e) {
        console.error(e);
        alert((e as Error).message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button className="w-full" size="lg" onClick={() => setOpen(true)}>
        Submit seats
      </Button>
      <DialogContent className="w-[650px] !max-w-[90%]">
        <DialogHeader>
          <DialogTitle>Add schedule information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, console.error)}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <DatePickerItem
                    field={field}
                    label="Өдөр"
                    disableBy="past"
                    className="flex-1"
                  />
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Эхлэх хугацаа</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter start time"
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дуусах хугацаа</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter end time"
                          type="time"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Үнэ</FormLabel>
                  <FormControl>
                    <CurrencyItem field={field} placeholder="Enter Price" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="!mt-5 flex items-center rounded-lg border border-border px-4 py-3">
                  <div className="w-full space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Event will be visible to the public.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="mt-4">
                {isPending ? <LoaderIcon /> : <SaveIcon size="sm" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
