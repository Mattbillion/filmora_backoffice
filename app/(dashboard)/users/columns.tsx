"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { UserItemType } from "./schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiImage, isPath, isUri } from "@/lib/utils";
import Image from "next/image";
import { lockUser, unlockUser } from "./actions";
import { toast } from "sonner";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasPagePermission, hasPermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

const Action = ({ row }: CellContext<UserItemType, unknown>) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const lockAction = row.original.status === 2 ? unlockUser : lockUser;

  const dialogContent = {
    locked: {
      btnText: "Unlock",
      description: `Unlock current user "${row.original.nickname}"`,
    },
    active: {
      btnText: "Lock",
      description: `Lock current user "${row.original.nickname}"`,
    },
  }[row.original.status === 2 ? "locked" : "active"];

  const role = (session?.user as User & { role: Role })?.role;

  return (
    <div className="flex gap-4 justify-end me-2">
      {hasPagePermission(role, "users.detail") && (
        <Button
          size={"cxs"}
          onClick={() => router.push(`/users/${row.original.id}`)}
        >
          Detail
        </Button>
      )}
      {hasPermission(role, "users.toggleLock", "create") &&
        (row.original.status !== 3 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"cxs"}>
                {row.original.status === 2 ? (
                  <Unlock className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {dialogContent.btnText}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogContent.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    onClick={() => {
                      setLoading(true);
                      lockAction(row.original.id)
                        .then((c) => {
                          toast.success(
                            c.data.message || c.data.error || c.data.data
                          );
                          router.refresh();
                        })
                        .catch((c) => toast.error(c.message || c.error))
                        .finally(() => setLoading(false));
                    }}
                    disabled={loading}
                  >
                    {loading && <Loader2 size={10} className="animate-spin" />}
                    {dialogContent.btnText}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button size={"cxs"} disabled>
            Deleted
          </Button>
        ))}
    </div>
  );
};

export const userColumns: ColumnDef<UserItemType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return (
        <Link className="px-1 py-2" href={`/users/${row.original.id}`}>
          {row.original.id}
        </Link>
      );
    },
  },
  {
    id: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const noAvatar =
        !isPath(row.original.avatar) && !isUri(row.original.avatar);

      if (noAvatar) return null;
      return (
        <Link
          className="py-2"
          href={apiImage(row.original.avatar)}
          target="__blank"
        >
          <Image
            src={apiImage(row.original.avatar, "xs")}
            className="rounded-full aspect-square object-cover"
            alt="banner"
            width={32}
            height={32}
          />
        </Link>
      );
    },
  },
  {
    id: "nickname",
    header: "Nick name",
    cell: ({ row }) => (
      <Link href={`/users/${row.original.id}`}>{row.original.nickname}</Link>
    ),
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
