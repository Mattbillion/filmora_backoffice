"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { LessonItemType } from "./schema";
import { useRef, useState } from "react";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash, BookText } from "lucide-react";
import { UpdateDialog } from "./components";
import { deleteLesson } from "./actions";
import { toast } from "sonner";
import { apiImage, isPath, isUri } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const Action = ({ row }: CellContext<LessonItemType, unknown>) => {
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
        permissionSubject="trainings.lessons"
        loading={loading}
        action={() => {
          setLoading(true);
          deleteLesson(row.original.id)
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

const ChildDatas = ({ row }: CellContext<LessonItemType, unknown>) => {
  const router = useRouter();
  const search = useSearchParams();
  const trainingId = search.get("trainingId");

  return (
    <Button
      size={"cxs"}
      variant="outline"
      type="button"
      onClick={() =>
        router.push(
          `/trainings/tasks?lessonId=${row.original.id}&itemId=${row.original.item_id}&trainingId=${trainingId}`
        )
      }
    >
      <BookText className="h-4 w-4" /> Tasks
    </Button>
  );
};

export const itemColumns: ColumnDef<LessonItemType>[] = [
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
    id: "isPublic",
    header: "Public",
    cell: ({ row }) =>
      ({ 1: "Public", 0: "Hidden" }[row.original.is_public] ?? "Unknown"),
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
