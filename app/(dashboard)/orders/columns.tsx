"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderItemType } from "./schema";

export const orderColumns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "orderId",
    header: "Order",
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original["Order id"]}</div>;
    },
  },
  {
    id: "payment",
    header: "Payment",
    cell: ({ row }) => row.original["Payment Type"],
  },
  {
    id: "invoice",
    header: "Invoice",
    cell: ({ row }) => row.original["Invoice no"],
  },
  {
    id: "payment-state",
    header: "Paid",
    cell: ({ row }) => row.original["Is paid"],
  },
  {
    id: "names",
    header: () => "Products",
    cell: ({ row }) => {
      const products = row.original["Product Names"].split(", ");
      const count = 2;
      return (
        <>
          {products.slice(0, count).join(", ")}
          {products.length > count && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="ml-2">
                    +{products.length - count}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {products.map((c, idx) => (
                    <p key={idx}>{c}</p>
                  ))}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      );
    },
  },
  {
    id: "user",
    header: "User",
    cell: ({ row }) => row.original["User Email"],
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) =>
      dayjs(row.original["Created date"]).format("YYYY-MM-DD hh:mm"),
  },
];
