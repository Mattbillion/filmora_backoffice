/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { ReactNode, useEffect, useMemo, useState } from 'react';
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
  RowSelectionState,
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
  children?: ReactNode;
  showColumnVisibility?: boolean;
  onSelectedMedias?: (selected: TData[]) => void;
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
  children,
  showColumnVisibility = false,
  onSelectedMedias,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();

  const pathname = usePathname();

  const { page, page_size, ...qsObj } = useQueryString<QueryParamsType>({
    page: 1,
    page_size: 30,
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
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
      rowSelection,
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
      const queryString = {
        ...qsObj,
        page: pageIndex + 1,
        page_size: pageSize,
      };

      if (serializedFilters) queryString.filters = serializedFilters;
      if (sortValues?.sortBy) {
        queryString.sort_by = sortValues?.sortBy;
        queryString.sort_order = sortValues?.sortOrder;
      }
      router.replace(pathname + `?${objToQs(queryString)}`, { scroll: true });
    }
  }, [pageIndex, pageSize, serializedFilters, sortValues]);

  useEffect(() => {
    if (onSelectedMedias) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectedMedias(selectedRows);
    }
  }, [rowSelection, onSelectedMedias]);

  // const availableFilters: string[] = table
  //   .getAllColumns()
  //   .filter((c) => c.getCanFilter())
  //   .map((c) => c.id);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">{children}</div>
        {showColumnVisibility && <ColumnVisibility table={table} />}
      </div>
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
                    <TableCell key={cell.id}>
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
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
