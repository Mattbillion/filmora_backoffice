'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { result, set as lodashSet, unset } from 'lodash';
import { CalendarIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, objToQs, qsToObj } from '@/lib/utils';

export function DateRangeFilter({
  fieldNames = ['filters.start_at', 'filters.end_at'],
}: {
  fieldNames?: string[];
}) {
  const searchParams = useSearchParams();
  const queryParams = qsToObj(searchParams.toString());
  const [start, end] = fieldNames;
  const router = useRouter();

  // Load initial values from searchParams
  const initialFrom = result(queryParams, start)
    ? new Date(result(queryParams, start))
    : undefined;
  const initialTo = result(queryParams, end)
    ? new Date(result(queryParams, end))
    : undefined;

  const [date, setDate] = useState<DateRange | undefined>({
    from: initialFrom,
    to: initialTo,
  });

  const handleNavigate = (paramsObj: Record<string, any>) => {
    if (paramsObj.filters) {
      paramsObj.filters = Object.entries(paramsObj.filters)
        .map(([k, v]) => `${k}=${v}`)
        .join(',');
    }

    router.replace(`?${objToQs(paramsObj)}`);
  };

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    const paramsObj = { ...queryParams };
    if (!range?.from && !range?.to) {
      unset(paramsObj, start);
      unset(paramsObj, end);
      handleNavigate(paramsObj);
      return;
    }
    if (!range?.from || !range?.to) return;

    lodashSet(paramsObj, start, dayjs(range.from).format('YYYY-MM-DD'));
    lodashSet(paramsObj, end, dayjs(range.to).format('YYYY-MM-DD'));

    handleNavigate(paramsObj);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'min-w-[200px] justify-start text-left font-normal',
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
