'use client';

import { useRef, useState } from 'react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Edit, ListTree, MoreHorizontal, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { deleteEvents } from '@/app/(dashboard)/events/actions';
import {
  DeleteDialog,
  DeleteDialogRef,
} from '@/components/custom/delete-dialog';
import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { checkPermission } from '@/lib/permission';
import { cn, removeHTML } from '@/lib/utils';

import { UpdateDialog } from './components';
import { EventsItemType } from './schema';

type EventColumnType = EventsItemType & {
  category?: string;
  venue?: string;
  branch?: string;
  hall?: string;
  age?: string;
  canModify: boolean;
};

const Action = ({ row }: CellContext<EventColumnType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_event']);
  const canEdit = checkPermission(data, ['update_event']);

  if (!canEdit && !canDelete) return null;

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
          {canEdit && (
            <UpdateDialog
              initialData={row.original}
              key={JSON.stringify(row.original)}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="h-4 w-4" /> Edit
              </DropdownMenuItem>
            </UpdateDialog>
          )}
          {canDelete && (
            <DeleteDialog
              ref={deleteDialogRef}
              loading={loading}
              action={() => {
                setLoading(true);
                // TODO: Please check after generate
                deleteEvents(row.original.id)
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
                  <b className="text-foreground">{row.original.event_name}</b>?
                </>
              }
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DeleteDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const Navigation = ({ row }: CellContext<EventColumnType, unknown>) => {
  const { data } = useSession();
  const canAccessTemplate =
    (row.original.event_type === 'mixed' ||
      row.original.event_type === 'seat') &&
    checkPermission(data, [
      'get_template_list',
      'create_template',
      'delete_template',
    ]);
  const canAccessBosoo = checkPermission(data, [
    'create_bosoo_seat',
    'update_bosoo_seat',
    'delete_bosoo_seat',
    'get_bosoo_seats',
  ]);

  return (
    <div className="flex items-center justify-center gap-2">
      {canAccessTemplate && (
        <Link
          href={`/events/${row.original.id}/templates`}
          className={cn(buttonVariants({ variant: 'outline', size: 'cxs' }))}
        >
          <ListTree className="h-4 w-4" /> Templates
        </Link>
      )}
      {canAccessBosoo && (
        <Link
          href={`/events/${row.original.id}/bosoo-seats`}
          className={cn(buttonVariants({ variant: 'outline', size: 'cxs' }))}
        >
          <ListTree className="h-4 w-4" /> Variants
        </Link>
      )}
    </div>
  );
};

export const eventsColumns: ColumnDef<EventColumnType>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'venue_id',
    accessorKey: 'venue_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.venue,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'branch_id',
    accessorKey: 'branch_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.branch,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'hall_id',
    accessorKey: 'hall_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.hall,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'category_id',
    accessorKey: 'category_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.category,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'event_name',
    accessorKey: 'event_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.event_name,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'event_desc',
    accessorKey: 'event_desc',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <p>
        html:{' '}
        <span className="opacity-70">
          {removeHTML(row.original.event_desc?.slice(0, 300))}
        </span>
      </p>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'event_capacity',
    accessorKey: 'event_capacity',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.event_capacity,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'age_id',
    accessorKey: 'age_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.age_id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'event_type',
    accessorKey: 'event_type',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.event_type,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'event_image',
    accessorKey: 'event_image',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Image
        src={row.original.event_image}
        alt=""
        width={48}
        height={48}
        className="rounded-md"
      />
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'event_order',
    accessorKey: 'event_order',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.event_order,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'event_genre',
    accessorKey: 'event_genre',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.event_genre,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'duration',
    accessorKey: 'duration',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => `${row.original.duration} hrs`,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'openning_at',
    accessorKey: 'openning_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) =>
      row.original.openning_at
        ? dayjs(row.original.openning_at).format('YYYY-MM-DD hh:mm')
        : undefined,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'language',
    accessorKey: 'language',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.language,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'sponsor_name',
    accessorKey: 'sponsor_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.sponsor_name,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'contact_info',
    accessorKey: 'contact_info',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <a href={`mailto:${row.original.contact_info}`}>
        {row.original.contact_info}
      </a>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'fb_link',
    accessorKey: 'fb_link',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <a href={row.original.fb_link} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'ig_link',
    accessorKey: 'ig_link',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <a href={row.original.ig_link} target="_blank" rel="noopener noreferrer">
        Instagram
      </a>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'web_link',
    accessorKey: 'web_link',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <a href={row.original.web_link} target="_blank" rel="noopener noreferrer">
        Website
      </a>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant={row.original.status ? 'outline' : 'destructive'}>
        {row.original.status ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.created_at
          ? dayjs(row.original.created_at).format('YYYY-MM-DD hh:mm')
          : undefined}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'updated_at',
    accessorKey: 'updated_at',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.updated_at
          ? dayjs(row.original.updated_at).format('YYYY-MM-DD hh:mm')
          : undefined}
      </Badge>
    ),
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'navigation',
    cell: Navigation,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'actions',
    cell: Action,
  },
];
