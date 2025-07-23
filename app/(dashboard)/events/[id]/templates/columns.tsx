'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { ListTree, Trash } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Button, buttonVariants } from '@/components/ui/button';
import { checkPermission } from '@/lib/permission';
import { cn, removeHTML } from '@/lib/utils';

import { deleteTemplatesDetail } from './actions';
import { TemplatesItemType } from './schema';

const Action = ({ row }: CellContext<TemplatesItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_template']);

  if (!canDelete) return null;

  return (
    <DeleteDialog
      ref={deleteDialogRef}
      loading={loading}
      action={() => {
        setLoading(true);
        // TODO: Please check after generate
        deleteTemplatesDetail(row.original.id)
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
          <b className="text-foreground">{row.original.template_name}</b>?
        </>
      }
    >
      <Button variant="destructive" size="icon">
        <Trash className="h-4 w-4" />
      </Button>
    </DeleteDialog>
  );
};

const Navigation = ({ row }: CellContext<TemplatesItemType, unknown>) => {
  const { data } = useSession();
  const canAccess = checkPermission(data, ['create_event_schedule']);

  return (
    <div className="flex items-center justify-center gap-2">
      {canAccess && (
        <Link
          href={`/events/${row.original.event_id}/templates/${row.original.id}/schedules`}
          className={cn(buttonVariants({ variant: 'outline', size: 'cxs' }))}
        >
          <ListTree className="h-4 w-4" /> Schedules
        </Link>
      )}
    </div>
  );
};

export const templatesColumns: ColumnDef<
  TemplatesItemType & { venue?: string; branch?: string; hall?: string }
>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
  },
  {
    id: 'template_name',
    accessorKey: 'template_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.template_name?.slice(0, 300),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'template_desc',
    accessorKey: 'template_desc',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <p>
        html:{' '}
        <span className="opacity-70">
          {removeHTML(row.original.template_desc?.slice(0, 300))}
        </span>
      </p>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'template_order',
    accessorKey: 'template_order',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.template_order,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'template_json_url',
    accessorKey: 'template_json_url',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <a href={row.original.template_json_url} target="_blank">
        Preview JSON
      </a>
    ),
  },
  {
    id: 'hall_id',
    accessorKey: 'hall_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.hall,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'venue_id',
    accessorKey: 'venue_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.venue,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'branch_id',
    accessorKey: 'branch_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.branch,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (row.original.status ? 'Active' : 'Inactive'),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'navigations',
    cell: Navigation,
  },
  {
    id: 'actions',
    cell: Action,
  },
];
