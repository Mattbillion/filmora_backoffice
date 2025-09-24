/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { usePathname, useRouter } from 'next/navigation';

import { ColumnVisibility } from '@/components/custom/table/dropdown/column-visibility';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  disableUrlUpdates?: boolean;
}

type QueryParamsType = {
  page: number;
  page_size: number;
  filters?: string;
  sort_by?: string;
  sort_order?: string;
};

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
  disableUrlUpdates = false,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const isInitialMount = useRef(true);

  const { page, page_size, ...qsObj } = useQueryString<QueryParamsType>({
    page: 1,
    page_size: 30,
  });

  // Initialize state from URL params
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: page_size,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Memoized pagination state
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  // Memoized sorting values
  const getSortingValue = useCallback((sortingState: SortingState) => {
    return {
      sortBy: sortingState[0]?.id || '',
      sortOrder: sortingState[0]?.desc ? 'desc' : 'asc',
    };
  }, []);

  // Memoized table configuration
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

  const sortValues = useMemo(() => {
    return getSortingValue(table.getState().sorting);
  }, [table.getState().sorting, getSortingValue]);

  // Memoized serialized filters
  const serializedFilters = useMemo(() => {
    return serializeColumnsFilters(table.getState().columnFilters);
  }, [table.getState().columnFilters]);

  // Create stable query string for comparison
  const currentQueryString = useMemo(() => {
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

    return objToQs(queryString);
  }, [pageIndex, pageSize, serializedFilters, sortValues, qsObj]);

  // Optimized URL update effect - only runs when necessary
  useEffect(() => {
    if (hidePagination || disableUrlUpdates || isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const newUrl = `${pathname}?${currentQueryString}`;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    // Only update if the URL is actually different
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [currentQueryString, hidePagination, disableUrlUpdates, pathname, router]);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">{children}</div>
        <ColumnVisibility table={table} />
      </div>
      <div className="border-input mb-4 w-full rounded-md border">
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
