"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { ItemItemType } from "./schema";
import { useRef, useState } from "react";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash, LibraryBig } from "lucide-react";
import { UpdateDialog } from "./components";
import { deleteItem } from "./actions";
import { toast } from "sonner";
import { apiImage, isPath, isUri } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Action = ({ row }: CellContext<ItemItemType, unknown>) => {
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
        permissionSubject="trainings.items"
        action={() => {
          setLoading(true);
          deleteItem(row.original.id)
            .then((c) => toast.success(c.data.message || c.data.data))
            .catch((c) => toast.error(c.message))
            .finally(() => {
              deleteDialogRef.current?.close();
              setLoading(false);
            });
        }}
        description={
          <>
            Are you sure you want to delete this{" "}
            <b className="text-foreground">{row.original.name}</b>?
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

const ChildDatas = ({ row }: CellContext<ItemItemType, unknown>) => {
  const router = useRouter();

  return (
    <Button
      size={"cxs"}
      variant="outline"
      type="button"
      onClick={() =>
        router.push(
          `/trainings/lessons?itemId=${row.original.id}&trainingId=${row.original.training_id}`
        )
      }
    >
      <LibraryBig className="h-4 w-4" /> Lessons
    </Button>
  );
};

export const itemColumns: ColumnDef<ItemItemType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "banner",
    header: "Banner",
    cell: ({ row }) => {
      const noBanner =
        !row.original.banner ||
        (!isPath(row.original.banner) && !isUri(row.original.banner));

      if (noBanner) return null;
      return (
        <Image
          src={apiImage(row.original.banner, "xs")}
          className="rounded-md"
          alt="banner"
          style={{
            width: "auto",
            height: "auto",
          }}
          width={62}
          height={36.6}
        />
      );
    },
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
    id: "child-actions",
    cell: ChildDatas,
  },
  {
    id: "actions",
    cell: Action,
  },
];
