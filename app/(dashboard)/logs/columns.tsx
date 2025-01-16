"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LogItemType } from "./schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export const logColumns: ColumnDef<LogItemType>[] = [
  {
    accessorKey: "id",
    header: () => <div className="px-1">Id</div>,
    cell: ({ row }) => <div className="px-1 py-3">{row.original.id}</div>,
  },
  {
    accessorKey: "action_type",
    header: "Action",
  },
  {
    accessorKey: "target_type",
    header: "Target type",
  },
  {
    accessorKey: "target_id",
    header: "Target ID",
  },
  {
    accessorKey: "relatedDetails",
    header: "Target name",
    cell: ({ row }) =>
      row.original.relatedDetails?.name ??
      row.original.relatedDetails?.title ??
      "-",
  },
  {
    accessorKey: "employee_username",
    header: "Employee",
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) =>
      row.original.user_id ? (
        <Link href={`/users/${row.original.user_id}`}>
          {row.original.user_id}
        </Link>
      ) : (
        "-"
      ),
  },
  {
    accessorKey: "user_email",
    header: "User email",
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="max-w-80 truncate">{row.original.details}</p>
          </TooltipTrigger>
          <TooltipContent>
            <pre
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(
                  JSON.parse(row.original.details),
                  null,
                  2
                ),
              }}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
