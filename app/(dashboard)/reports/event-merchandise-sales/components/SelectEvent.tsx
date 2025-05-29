'use client';

import * as React from 'react';
import { toString } from 'lodash';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

export function SelectEvent({
  eventList,
  selectedValue,
  defaultValue,
}: {
  eventList: Record<number, string>;
  selectedValue: (value: string) => void;
  defaultValue: string;
}) {
  const eventArray = Object.entries(eventList).map(([id, name]) => ({
    event_id: id,
    event_name: name,
  }));

  return (
    <Select
      disabled={eventArray.length === 0}
      onValueChange={(val) => selectedValue(val)}
      value={defaultValue}
    >
      <SelectTrigger className="w-[180px]">
        {eventArray[0]?.event_name}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {eventArray?.map((event) => (
            <SelectItem value={toString(event.event_id)} key={event.event_id}>
              {event.event_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
