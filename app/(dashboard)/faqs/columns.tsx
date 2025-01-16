"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { FaqItemType } from "./schema";
import { useRef, useState } from "react";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { UpdateDialog } from "./components";
import { deleteFaq } from "./actions";
import { toast } from "sonner";

const ArticleAction = ({ row }: CellContext<FaqItemType, unknown>) => {
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
        permissionSubject="faqs"
        action={() => {
          setLoading(true);
          deleteFaq(row.original.id)
            .then((c) => toast.success(c.data?.message || c.data?.data))
            .catch((c) => toast.error(c.message))
            .finally(() => {
              deleteDialogRef.current?.close();
              setLoading(false);
            });
        }}
        description={
          <>
            Are you sure you want to delete this{" "}
            <b className="text-foreground">{row.original.question}</b>?
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

export const faqColumns: ColumnDef<FaqItemType>[] = [
  {
    accessorKey: "id",
    header: () => <div className="px-1">Id</div>,
    cell: ({ row }) => {
      return <div className="px-1">{row.original.id}</div>;
    },
  },
  {
    accessorKey: "question",
    header: "Question",
  },
  {
    id: "answer",
    header: () => <div>Answer</div>,
    cell: () => {
      return <div className="py-6 ps-5">...</div>;
    },
  },
  {
    id: "status",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      return (
        <div>
          {{ 2: "Hidden", 1: "Active", 0: "Inactive" }[row.original.status] ??
            "Unknown"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ArticleAction,
  },
];
