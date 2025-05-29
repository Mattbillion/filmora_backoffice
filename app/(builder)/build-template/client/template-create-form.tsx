'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Konva from 'konva';
import { SaveIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import HtmlTipTapItem from '@/components/custom/html-tiptap-item';
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

import { createTemplate, uploadTemplateJSON } from '../actions';
import { KonvaNode, TemplateBodyType, templateSchema } from '../schema';
import { dataMap } from './constants';
import { useKonvaStage } from './context';

export function CreateTemplateDialog() {
  const [isPending, startTransition] = useTransition();
  const { getStage, initialValues: STAGE_INITIALS } = useKonvaStage();
  const [open, setOpen] = useState(false);
  const params = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<TemplateBodyType>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      event_id: Number(params.get('eventId')),
      template_name: '',
      template_desc: '',
      status: true,
    },
  });

  function toFormData(obj: Record<string, any>): FormData {
    const fd = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      if (value instanceof Blob || value instanceof File) {
        fd.append(key, value);
      } else if (value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    });

    return fd;
  }

  function createJsonFile(jsonString: any, name = 'stage.json') {
    const blob = new Blob([jsonString], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return new File([blob], name, { type: 'application/json' });
  }

  function onSubmit(values: TemplateBodyType) {
    startTransition(async () => {
      const clonedStage = getStage().clone()!;
      clonedStage.setAttrs({ ...clonedStage.getAttrs(), ...STAGE_INITIALS });
      clonedStage?._clearCaches();
      const clonedBaseLayer = clonedStage?.getLayers()[0]!;
      clonedBaseLayer?.setAttr('opacity', 1);

      const masksSection: Konva.Node = clonedStage?.findOne('#masks')?.clone();
      const ticketsSection: Konva.Node = clonedStage
        ?.findOne('#tickets')
        ?.clone();
      // define all ticket like nodes as not purchasable
      //@ts-ignore
      ticketsSection.find((n) => {
        const ticketLike = ['Path', 'Shape', 'Line', 'Rect', 'Circle'].includes(
          n.className,
        );
        const newAttrs = {
          ...n.getAttrs(),
          class: undefined,
          hitStrokeWidth: undefined,
          listening: undefined,
          shadowForStrokeEnabled: undefined,
          perfectDrawEnabled: undefined,
        };
        n.setAttrs(newAttrs);

        if (ticketLike && !n.getAttr('data-purchasable')) {
          n.setAttr('fill', '#E0E0E0');
        }
        return true;
      });

      // Removing useless nodes (cached on ram /accessible/)
      clonedStage?.findOne('.selected-shapes')?.remove();
      clonedStage?.findOne('#masks')?.remove();
      clonedStage?.findOne('#tickets')?.remove();

      const purchasableItems =
        ticketsSection
          //@ts-ignore
          ?.find(
            (c: KonvaNode) =>
              [dataMap.r, dataMap.t, dataMap.s].includes(
                c.attrs['data-type'],
              ) && c.attrs['data-purchasable'],
          )
          .map((c: KonvaNode) => {
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
        const { data } = await createTemplate(
          toFormData({
            ...values,
            company_id: session?.user?.company_id,
            json_file: createJsonFile(
              JSON.stringify(purchasableItems, null, 2),
              'seats.json',
            ),
          }),
        );
        if (!data) return;
        const seatIdObj: Record<string, number> = data.seats.reduce(
          (acc, cur) => ({ ...acc, [cur.seat_no]: cur.id }),
          {},
        );

        // define all ticket like nodes as not purchasable
        //@ts-ignore
        ticketsSection.find((n) => {
          const seatId = seatIdObj[n.id()];
          if (seatId) {
            n.setAttr('data-seat-id', seatId);
          }
        });

        const { data: uploadedData } = await uploadTemplateJSON(
          toFormData({
            template_id: data.template_id,
            company_id: session?.user?.company_id,
            tickets_file: createJsonFile(
              ticketsSection.toJSON(),
              'tickets.json',
            ),
            mask_file: createJsonFile(masksSection.toJSON(), 'masks.json'),
            other_file: createJsonFile(clonedStage.toJSON(), 'others.json'),
          }),
        );

        if (uploadedData)
          router.replace(`/events/${values.event_id}/templates`);
      } catch (e) {
        console.error(e);
        alert((e as Error).message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        className="m-4"
        onClick={() => {
          const masksSection = getStage()?.findOne('#masks');
          const ticketsSection = getStage()?.findOne('#tickets');
          if (!masksSection || !ticketsSection)
            return alert('Please describe "Tickets / Seats" and "Mask" layer');
          setOpen(true);
        }}
      >
        Build
      </Button>
      <DialogContent className="w-[650px] !max-w-[90%]">
        <DialogHeader>
          <DialogTitle>Create new template</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, console.error)}>
            <FormField
              control={form.control}
              name="event_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="template_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="template_desc"
              render={({ field }) => <HtmlTipTapItem field={field} />}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'true')}
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

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                <SaveIcon size="sm" />
                {isPending && <LoaderIcon />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
