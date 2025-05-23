'use client';

import { useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DateRangeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialFrom = searchParams.get('start_at')
    ? new Date(searchParams.get('start_at')!)
    : undefined;
  const initialTo = searchParams.get('end_at')
    ? new Date(searchParams.get('end_at')!)
    : undefined;

  const [date, setDate] = useState<DateRange | undefined>({
    from: initialFrom,
    to: initialTo,
  });

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (!range?.from || !range?.to) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('start_at', range.from.toISOString());
    params.set('end_at', range.to.toISOString());

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[260px] justify-start text-left font-normal',
            !date?.from && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'yyyy-MM-dd')} -
                {format(date.to, 'yyyy-MM-dd')}
              </>
            ) : (
              format(date.from, 'yyyy-MM-dd')
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
