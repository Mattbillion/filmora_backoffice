import { HeaderContext } from '@tanstack/react-table';

import { SortDropDownMenu } from '@/components/custom/table/sort';
import { Input } from '@/components/ui/input';

export function TableHeaderWrapper<TData, TValue>({
  column,
  searchable,
  label,
}: TableHeaderProps<TData, TValue>) {
  return (
    <div className="flex w-full flex-shrink-0 flex-col gap-2">
      <SortDropDownMenu column={column} label={label} />

      {searchable && (
        <Input
          placeholder="Search"
          className="h-8"
          onChange={(e) => column.setFilterValue(e.target.value)}
        />
      )}
    </div>
  );
}

export type TableHeaderProps<TData, TValue> = {
  column: HeaderContext<TData, TValue>['column'];
  searchable?: boolean;
  sortable?: boolean;
  label?: string;
};
