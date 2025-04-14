'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { Table } from '@tanstack/react-table';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const options = [
  {
    value: 'true',
    label: 'Идэвхтэй',
  },
  {
    value: 'false',
    label: 'Идэвхгүй',
  },
];

export function FacetFilter<TData>({
  table,
  field,
  placeholder = 'Төлөв сонгох',
  commandPlaceholder = 'Хайх',
}: {
  table: Table<TData>;
  field: string;
  placeholder?: string;
  commandPlaceholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | void>('');

  const column = table.getColumn(field);

  useEffect(() => {
    column?.setFilterValue(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={commandPlaceholder} />
          <CommandList>
            <CommandEmpty>Олдсонгүй</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 text-white',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
