'use client';

import { ControllerRenderProps } from 'react-hook-form';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function DatePickerItem({
  field,
  label,
  description,
  disableBy = 'past',
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  label?: string;
  className?: string;
  description?: string;
  disableBy?: 'feature' | 'past' | 'none';
}) {
  const calcDisable = (date: Date) => {
    if (disableBy === 'past') return date < new Date();
    if (disableBy === 'feature') return date > new Date();
    return false;
  };
  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={'outline'}
              size="lg"
              className={cn(
                'w-full pl-3 text-left font-normal',
                !field.value && 'text-muted-foreground',
              )}
            >
              {field.value ? (
                dayjs(field.value).format('YYYY-MM-DD')
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={(c) => field.onChange(c?.toISOString())}
            disabled={calcDisable}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
