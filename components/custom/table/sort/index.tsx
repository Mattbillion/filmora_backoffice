import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  EyeOff,
} from 'lucide-react';

import { TableHeaderProps } from '@/components/custom/table-header-wrapper';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SortDropDownMenu<TData, TValue>({
  column,
  label,
}: {
  column: TableHeaderProps<TData, TValue>['column'];
  label?: string;
}) {
  const isSorted = column.getIsSorted() === 'asc';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex justify-start">
        <Button
          variant="ghost"
          size="cxs"
          disabled={!column.getCanSort()}
          className="px-0 opacity-100!"
        >
          {isSorted ? (
            <ArrowUpIcon size={14} />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDownIcon size={14} />
          ) : (
            column.getCanSort() && (
              <ArrowUpDownIcon size={14} className="opacity-50" />
            )
          )}
          <p className="uppercase">{label || column.id.replace('_id', '')}</p>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUpIcon size={12} /> ASC
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDownIcon size={12} /> DESC
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
          <EyeOff size={14} /> Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
