/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowData,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { usePathname, useRouter } from 'next/navigation';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select';
  }
}

import { ColumnVisibility } from '@/components/custom/table/dropdown/column-visibility';
import { FacetFilter } from '@/components/custom/table/facet-filter';
import { ResetTable } from '@/components/custom/table/reset';
import { SearchInput } from '@/components/custom/table/search-input';
import { useQueryString } from '@/hooks/use-query-string';
import { objToQs, serializeColumnsFilters } from '@/lib/utils';

import DataTableInfinte from './data-table-infinite';
import { DataTablePagination } from './data-table-pagination';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  hidePagination?: boolean;
  infinite?: boolean;
  pageNumber?: number;
  pageCount?: number;
  rowCount?: number;
  setPageNumber?: any;
  disabled?: boolean;
  setDisabled?: any;
  isPending?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  hidePagination,
  infinite,
  pageNumber,
  pageCount,
  rowCount,
  setPageNumber,
  disabled,
  setDisabled,
  isPending,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();

  const pathname = usePathname();

  const { page, page_size, ...qsObj } = useQueryString<QueryParamsType>({
    page: 1,
    page_size: 5,
    filters: '',
    sort_by: '',
    sort_order: '',
  });

  type QueryParamsType = {
    page: number;
    page_size: number;
    filters?: string;
    sort_by?: string;
    sort_order?: string;
  };

  //pagination
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: page_size,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    filterFns: {},
    manualFiltering: true,
    onSortingChange: setSorting,
    pageCount,
    rowCount,
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  function getSortingValue(sortingState: SortingState) {
    return {
      sortBy: sortingState[0]?.id || '',
      sortOrder: sortingState[0]?.desc ? 'desc' : 'asc',
    };
  }

  const sortValues = useMemo(() => {
    return getSortingValue(table.getState().sorting);
  }, [table.getState().sorting]);

  const serializedFilters = useMemo(() => {
    return serializeColumnsFilters(table.getState().columnFilters);
  }, [table.getState().columnFilters]);

  useEffect(() => {
    if (!hidePagination) {
      router.replace(
        pathname +
          `?${objToQs({ ...qsObj, page: pageIndex + 1, page_size: pageSize, filters: serializedFilters, sort_by: sortValues?.sortBy, sort_order: sortValues?.sortOrder })}`,
        { scroll: true },
      );
    }
  }, [pageIndex, pageSize, serializedFilters, sortValues]);

  const availableFilters: string[] = table
    .getAllColumns()
    .filter((c) => c.getCanFilter())
    .map((c) => c.id);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 p-2">
          {availableFilters.map((cFilter, idx) => {
            if (cFilter === 'status') {
              return <FacetFilter table={table} field={cFilter} key={idx} />;
            }
            return (
              <SearchInput
                table={table}
                field={cFilter}
                placeholder={cFilter}
                key={idx}
              />
            );
          })}

          <ResetTable table={table} />
        </div>
        <ColumnVisibility table={table} />
      </div>
      <div className="mb-4 w-full rounded-md border border-input">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} className="px-6 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!hidePagination && (
        <div className="flex w-full flex-col-reverse items-center justify-between gap-2 md:flex-row">
          {!infinite && <DataTablePagination table={table} />}
          {infinite && (
            <DataTableInfinte
              onChange={(p) => setPageNumber(p)}
              pageNumber={pageNumber ?? 0}
              disabled={disabled ?? false}
              setDisabled={setDisabled}
              isPending={isPending}
            />
          )}
        </div>
      )}
    </div>
  );
}
