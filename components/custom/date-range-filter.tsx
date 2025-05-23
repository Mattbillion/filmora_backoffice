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

  // Load initial values from searchParams
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

    // Parse filters param
    const filtersRaw = params.get('filters');
    const filters: Record<string, string> = {};

    if (filtersRaw) {
      filtersRaw.split(',').forEach((pair) => {
        const [key, value] = pair.split('=');
        if (key && value) filters[key] = value;
      });
    }

    // Update date values
    filters['start_at'] = range.from.toISOString();
    filters['end_at'] = range.to.toISOString();

    // Serialize back to query string
    const serializedFilters = Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');

    params.set('filters', serializedFilters);

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
            'w-[196px] justify-start text-left font-normal',
            !date?.from && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-0 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'yyyy-MM-dd')} -{' '}
                {format(date.to, 'yyyy-MM-dd')}
              </>
            ) : (
              format(date.from, 'yyyy-MM-dd')
            )
          ) : (
            <span>Он/сар/өдөр</span>
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
