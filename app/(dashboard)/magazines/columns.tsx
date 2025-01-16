"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { MagazineItemType } from "./schema";
import { useRef, useState } from "react";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Newspaper } from "lucide-react";
import { UpdateDialog } from "./components";
import { deleteMagazine } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const MagazineAction = ({ row }: CellContext<MagazineItemType, unknown>) => {
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
        permissionSubject="magazines"
        action={() => {
          setLoading(true);
          deleteMagazine(row.original.id)
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

const ChildDatas = ({ row }: CellContext<MagazineItemType, unknown>) => {
  const router = useRouter();

  return (
    <div className="flex gap-4 justify-end me-2">
      <Button
        size={"cxs"}
        variant="outline"
        type="button"
        onClick={() =>
          router.push(`/magazines/articles?magazineId=${row.original.id}`)
        }
      >
        <Newspaper className="h-4 w-4" /> Articles
      </Button>
    </div>
  );
};

export const magazineColumns: ColumnDef<MagazineItemType>[] = [
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
    id: "magazineNumber",
    header: "Number",
    cell: ({ row }) => row.original.magazine_number,
  },
  {
    id: "bannerType",
    header: "As banner",
    cell: ({ row }) => row.original.banner_type,
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) =>
      `${dayjs(row.original.start_date).format("YYYY.MM.DD")}-${dayjs(
        row.original.end_date
      ).format("DD")}`,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) =>
      ({ 2: "Hidden", 1: "Active", 0: "Inactive" }[row.original.status] ??
      "Unknown"),
  },
  {
    id: "articles",
    cell: ChildDatas,
  },
  {
    id: "actions",
    cell: MagazineAction,
  },
];
