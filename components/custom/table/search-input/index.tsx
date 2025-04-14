'use client';

import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

export function SearchInput<TData>({
  table,
  field,
  placeholder = 'Хайлт хийх',
}: {
  table: Table<TData>;
  field: string;
  placeholder?: string;
}) {
  const column = table.getColumn(field);

  console.log(column?.getFilterValue(), '<--');
  return (
    <div>
      <Input
        value={column?.getFilterValue() as string}
        type="search"
        placeholder={placeholder}
        onChange={(e) => column?.setFilterValue(e.target.value)}
        className="h-9"
      />
    </div>
  );
}
