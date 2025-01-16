"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { EmployeeItemType } from "./schema";
import { useRef, useState } from "react";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { UpdateDialog } from "./components";
import { deleteEmployee } from "./actions";
import { toast } from "sonner";
import dayjs from "dayjs";
import { roleMap } from "@/lib/permission";

const Action = ({ row }: CellContext<EmployeeItemType, unknown>) => {
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
        permissionSubject="employees"
        loading={loading}
        action={() => {
          setLoading(true);
          deleteEmployee(row.original.id)
            .then((c) => toast.success(c.data.data || c.data.message))
            .catch((c) => toast.error(c.message))
            .finally(() => {
              deleteDialogRef.current?.close();
              setLoading(false);
            });
        }}
        description={
          <>
            Are you sure you want to delete this{" "}
            <b className="text-foreground">{row.original.username}</b>?
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

export const employeeColumns: ColumnDef<EmployeeItemType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    id: "fullname",
    header: "Fullname",
    cell: ({ row }) =>
      [row.original.last_name, row.original.first_name].join(" "),
  },
  {
    id: "username",
    header: "Username",
    cell: ({ row }) => row.original.username,
  },
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => roleMap[row.original.role] ?? "Unknown",
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    id: "date",
    header: "Created At",
    cell: ({ row }) => dayjs(row.original.created_at).format("YYYY-MM-DD"),
  },
  {
    id: "creator",
    header: "Created By",
    cell: ({ row }) => row.original.created_by,
  },
  {
    id: "actions",
    cell: Action,
  },
];
