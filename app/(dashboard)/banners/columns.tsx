"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiImage, isPath, isUri, urlRegex } from "@/lib/utils";
import { BannerItemType } from "./schema";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import { UpdateDialog } from "./components";
import { deleteBanner } from "./actions";
import { toast } from "sonner";

const productType = ["ALBUM", "TRACK", "COURSES", "BOOKS", "OFFER"] as const;

const Action = ({ row }: CellContext<BannerItemType, unknown>) => {
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
        permissionSubject="banners"
        loading={loading}
        action={() => {
          setLoading(true);
          deleteBanner(row.original.id)
            .then((c) =>
              toast.success(c.data.message || c.data.error || c.data.data)
            )
            .catch((c) => toast.error(c.message || c.error))
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

export const bannerColumns: ColumnDef<BannerItemType>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      return <div className="px-1 py-3">{row.original.id}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    id: "banner",
    header: "Banner",
    cell: ({ row }) => {
      const noBanner =
        !isPath(row.original.banner) && !isUri(row.original.banner);
      return (
        <div className="py-2">
          {!noBanner && (
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
          )}
        </div>
      );
    },
  },
  {
    id: "banner_url",
    header: "Banner Url",
    cell: ({ row }) => {
      const noBanner =
        !isPath(row.original.banner) && !isUri(row.original.banner);
      const url = urlRegex.exec(row.original.banner);
      return noBanner ? (
        "No banner uploaded"
      ) : (
        <Link
          target="_blank"
          href={"https://app.goodali.mn/api/v1" + row.original.banner}
        >
          {url ? url[1] : "No banner"}
        </Link>
      );
    },
  },
  {
    id: "product_type",
    header: "Product type",
    cell: ({ row }) => {
      return productType[row.original.product_type];
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        { 2: "Hidden", 1: "Active", 0: "Inactive" }[row.original.status] ??
        "Unknown"
      );
    },
  },
  {
    id: "actions",
    cell: Action,
  },
];
