"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { BookItemType } from "./schema";
import { useRef, useState } from "react";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { UpdateDialog } from "./components";
import { Badge } from "@/components/ui/badge";
import { deleteBook } from "./actions";
import { toast } from "sonner";
import { currencyFormat } from "@/lib/utils";

const Action = ({ row }: CellContext<BookItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);

  return (
    <div className="flex gap-4 justify-end me-2">
      <UpdateDialog
        initialData={row.original}
        key={JSON.stringify(row.original)}
      >
        <Button size={"cxs"} variant="outline">
          <Edit className="h-4 w-4" /> Edit
        </Button>
      </UpdateDialog>

      <DeleteDialog
        ref={deleteDialogRef}
        loading={loading}
        permissionSubject="books"
        action={() => {
          setLoading(true);
          deleteBook(row.original.id)
            .then((c) => toast.success(c.data.message))
            .catch((c) => toast.error(c.message))
            .finally(() => {
              deleteDialogRef.current?.close();
              setLoading(false);
            });
        }}
        description={
          <>
            Are you sure you want to delete this{" "}
            <b className="text-foreground">{row.original.title}</b>?
          </>
        }
      >
        <Button size={"cxs"}>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </DeleteDialog>
    </div>
  );
};

export const bookColumns: ColumnDef<BookItemType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    id: "order",
    header: "Order",
    cell: ({ row }) => row.original.order,
  },
  {
    id: "tags",
    header: () => "Tag",
    cell: ({ row }) => {
      const tags = row.original.tags || [];
      return (
        <>
          {tags
            .slice(0, 3)
            .map((e) => e.name)
            .join(", ")}
          {tags.length > 3 && (
            <Badge variant="secondary" className="ml-2">
              +{tags.length - 3}
            </Badge>
          )}
        </>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) =>
      ({ 2: "Hidden", 1: "Active", 0: "Inactive" }[row.original.status] ??
      "Unknown"),
  },
  {
    id: "price",
    header: "Price",
    cell: ({ row }) => currencyFormat(row.original.price ?? 0),
  },
  {
    id: "actions",
    cell: Action,
  },
];
