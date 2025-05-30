import * as React from 'react';
import { toString } from 'lodash';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SelectEvent({
  eventList,
  selectedValue,
  defaultValue,
}: {
  eventList: { event_id: number; event_name: string }[];
  selectedValue: (value: string) => void;
  defaultValue: string;
}) {
  const [selectedEventId, setSelectedEventId] =
    React.useState<string>(defaultValue);

  const handleChange = (val: string) => {
    setSelectedEventId(val);
    selectedValue(val);
  };

  return (
    <Select
      disabled={eventList.length === 0}
      value={selectedEventId}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {eventList?.map((event) => (
            <SelectItem value={toString(event.event_id)} key={event.event_id}>
              {event.event_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
