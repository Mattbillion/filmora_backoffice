"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { MoodItemType } from "./schema";
import { useRef, useState } from "react";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ListTree } from "lucide-react";
import { UpdateDialog } from "./components";
import { deleteMood } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Action = ({ row }: CellContext<MoodItemType, unknown>) => {
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
        permissionSubject="moods"
        action={() => {
          setLoading(true);
          deleteMood(row.original.id)
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

const ChildDatas = ({ row }: CellContext<MoodItemType, unknown>) => {
  const router = useRouter();

  return (
    <div className="flex gap-4 justify-end me-2">
      <Button
        size={"cxs"}
        variant="outline"
        type="button"
        onClick={() => router.push(`/moods/list?moodId=${row.original.id}`)}
      >
        <ListTree className="h-4 w-4" /> Mood list
      </Button>
    </div>
  );
};

export const moodColumns: ColumnDef<MoodItemType>[] = [
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
    id: "status",
    header: "Status",
    cell: ({ row }) =>
      ({ 2: "Hidden", 1: "Active", 0: "Inactive" }[row.original.status] ??
      "Unknown"),
  },
  {
    id: "mood-list",
    cell: ChildDatas,
  },
  {
    id: "actions",
    cell: Action,
  },
];
