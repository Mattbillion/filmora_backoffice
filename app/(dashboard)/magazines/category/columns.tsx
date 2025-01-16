"use client";

import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { useRef, useState } from "react";
import {
  deleteMagazineCategory,
  MagazineCategoryItemType,
  UpdateMagazineCategoryDialog,
} from "@/features/magazine-category";
import { toast } from "sonner";

const MagazineCategoryAction = ({
  row,
}: CellContext<MagazineCategoryItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const deleteDialogRef = useRef<DeleteDialogRef>(null);

  return (
    <div className="flex gap-4 justify-end me-2">
      <UpdateMagazineCategoryDialog
        data={row.original}
        key={JSON.stringify(row.original)}
      >
        <Button size={"cxs"} variant="outline">
          <Edit className="h-4 w-4" /> Edit
        </Button>
      </UpdateMagazineCategoryDialog>

      <DeleteDialog
        ref={deleteDialogRef}
        loading={loading}
        permissionSubject="magazines.category"
        action={() => {
          setLoading(true);
          deleteMagazineCategory(row.original.id)
            .then((c) => toast.success(c.data.message || c.data.data))
            .catch((c) => toast.error(c.message || c.error))
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

export const magazineCategoriesColumns: ColumnDef<MagazineCategoryItemType>[] =
  [
    {
      accessorKey: "id",
      header: () => <div className="px-1">Id</div>,
      cell: ({ row }) => <div className="px-1 py-3">{row.original.id}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    // {
    //   accessorKey: "description",
    //   header: "description",
    // },
    {
      id: "status",
      header: () => <div>Status</div>,
      cell: ({ row }) => (
        <div>
          {{ 2: "Hidden", 1: "Active", 0: "Inactive" }[row.original.status] ??
            "Unknown"}
        </div>
      ),
    },
    {
      id: "actions",
      cell: MagazineCategoryAction,
    },
  ];
