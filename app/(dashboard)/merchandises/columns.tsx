'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';

import { TableHeaderWrapper } from '@/components/custom/table-header-wrapper';
import { currencyFormat, removeHTML } from '@/lib/utils';

import { MerchandisesItemType } from './schema';

const Action = ({
  row,
}: CellContext<
  MerchandisesItemType & {
    company: string;
    category?: string;
    discount?: string;
    canModify?: boolean;
  },
  unknown
>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);
  const { data } = useSession();
  const canDelete = checkPermission(data, ['delete_company_merchandise']);

  if (!canDelete) return null;

  return (
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
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="text-red-500"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </DeleteDialog>
  );
};

export const merchandisesColumns: ColumnDef<
  MerchandisesItemType & {
    company: string;
    category?: string;
    discount?: string;
    canModify?: boolean;
  }
>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) =>
      row.original.canModify ? (
        <Link href={`/merchandises/${row.original.id}`}>{row.original.id}</Link>
      ) : (
        row.original.id
      ),
  },
  {
    id: 'company',
    accessorKey: 'company',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.company,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'category',
    accessorKey: 'cat_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.category,
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: 'mer_name',
    accessorKey: 'mer_name',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.mer_name?.slice(0, 300),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'mer_desc',
    accessorKey: 'mer_desc',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (
      <p>
        html:{' '}
        <span className="opacity-70">
          {removeHTML(row.original.mer_desc?.slice(0, 300))}
        </span>
      </p>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => currencyFormat(row.original.price),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'discount_id',
    accessorKey: 'discount_id',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => row.original.discount || row.original.discount_id,
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: 'medias',
    accessorKey: 'medias',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => {
      const cellData = row.original.medias;
      if (!!cellData[0]?.media_url)
        return (
          <div className="flex items-center">
            {cellData.slice(0, 3).map((c, idx) => {
              return (
                <Image
                  key={idx}
                  src={c.media_url}
                  alt=""
                  width={48}
                  height={48}
                  className="-mr-6 rounded-full border-border"
                />
              );
            })}
          </div>
        );
      return <p>{cellData.join(', ')}</p>;
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <TableHeaderWrapper column={column} />,
    cell: ({ row }) => (row.original.status ? 'Active' : 'Inactive'),
    enableSorting: false,
    enableColumnFilter: true,
  },
  { id: 'action', cell: Action },
];
