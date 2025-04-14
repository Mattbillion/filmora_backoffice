'use client';

import { useRef, useState } from 'react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { deleteCompany } from '@/app/(dashboard)/companies/actions';
import { UpdateDialog } from '@/app/(dashboard)/companies/components';
import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CompanyItemType } from './schema';

const Action = ({ row }: CellContext<CompanyItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);

  return (
    <div className="me-2 flex justify-end gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <UpdateDialog
            initialData={row.original}
            key={JSON.stringify(row.original)}
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Edit className="h-4 w-4" /> Edit
            </DropdownMenuItem>
          </UpdateDialog>
          <DeleteDialog
            permissions={['delete_company']}
            ref={deleteDialogRef}
            loading={loading}
            action={() => {
              setLoading(true);
              deleteCompany(row.original.id)
                .then((c) => toast.success(c.data.message))
                .catch((c) => toast.error(c.message))
                .finally(() => {
                  deleteDialogRef.current?.close();
                  setLoading(false);
                });
            }}
            description={
              <>
                Are you sure you want to delete this{' '}
                <b className="text-foreground">{row.original.company_name}</b>?
              </>
            }
          >
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Trash className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DeleteDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const companyColumns: ColumnDef<CompanyItemType>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableColumnFilter: false,
  },
  {
    id: 'company_name',
    accessorKey: 'company_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
  },
  {
    id: 'company_desc',
    accessorKey: 'company_desc',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'company_register',
    accessorKey: 'company_register',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableColumnFilter: false,
  },
  {
    id: 'company_logo',
    accessorKey: 'company_logo',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'company_email',
    accessorKey: 'company_email',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableSorting: false,
  },
  {
    id: 'company_phone',
    accessorKey: 'company_phone',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableColumnFilter: false,
  },
  {
    id: 'company_phone2',
    accessorKey: 'company_phone2',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableColumnFilter: false,
  },
  {
    id: 'company_location',
    accessorKey: 'company_location',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableColumnFilter: false,
    cell: Action,
  },
];
