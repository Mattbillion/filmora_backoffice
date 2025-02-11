/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  useReactTable,
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
import { useQueryString } from '@/hooks/use-query-string';
import { objToQs } from '@/lib/utils';

import DataTableInfinte from './data-table-infinite';
import { DataTablePagination } from './data-table-pagination';
import { Input } from './input';
import { ScrollArea, ScrollBar } from './scroll-area';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  searchKey?: keyof TData;
  hidePagination?: boolean;
  infinite?: boolean;
  pageNumber?: number;
  pageCount?: number;
  setPageNumber?: any;
  disabled?: boolean;
  setDisabled?: any;
  isPending?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  searchKey,
  hidePagination,
  infinite,
  pageNumber,
  pageCount,
  setPageNumber,
  disabled,
  setDisabled,
  isPending,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const { page, limit, ...qsObj } = useQueryString<{
    page: number;
    limit: number;
  }>({ page: 1, limit: 30 });
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: limit,
  });
  const pagination = React.useMemo(
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
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    pageCount,
    manualPagination: true,
    state: {
      pagination,
    },
  });
  const column = useMemo(
    () => (searchKey ? table.getColumn(String(searchKey)) : undefined),
    [table, searchKey],
  );

  useEffect(() => {
    if (!hidePagination) {
      router.replace(
        pathname +
          `?${objToQs({ ...qsObj, page: pageIndex + 1, limit: pageSize })}`,
        { scroll: true },
      );
    }
  }, [pageIndex, pageSize]);

  return (
    <>
      {searchKey && (
        <Input
          id={String(searchKey)}
          placeholder={`Search by ${String(searchKey)}...`}
          value={column?.getFilterValue()?.toString()}
          onChange={(event) => column?.setFilterValue(event.target.value)}
          className="w-full md:max-w-sm"
        />
      )}
      <ScrollArea className="h-[calc(100vh-268px)] rounded-md border">
        <Table className="relative">
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {!hidePagination && (
        <div className="flex flex-col-reverse items-center justify-between gap-2 md:flex-row">
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
    </>
  );
}
