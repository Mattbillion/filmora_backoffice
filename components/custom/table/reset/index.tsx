import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

export function ResetTable<TData>({ table }: { table: Table<TData> }) {
  function resetHandler() {
    table.resetSorting();
    table.resetColumnFilters();
    table.resetGlobalFilter();
  }

  return (
    <Button variant="outline" onClick={() => resetHandler()}>
      Reset filters
    </Button>
  );
}
