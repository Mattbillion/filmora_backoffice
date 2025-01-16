"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { TaskItemType, taskTypeNameArr } from "./schema";
import { useRef, useState } from "react";
import {
  DeleteDialog,
  DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { UpdateDialog } from "./components";
import { deleteTask } from "./actions";
import { toast } from "sonner";
import { apiImage, isPath, isUri, removeHTML } from "@/lib/utils";
import Image from "next/image";

const Action = ({ row }: CellContext<TaskItemType, unknown>) => {
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
        permissionSubject="trainings.tasks"
        action={() => {
          setLoading(true);
          deleteTask(row.original.id)
            .then((c) => toast.success(c.data.message || c.data.data))
            .catch((c) => toast.error(c.message))
            .finally(() => {
              deleteDialogRef.current?.close();
              setLoading(false);
            });
        }}
        description={<>Are you sure you want to delete this task ?</>}
      >
        <Button size={"cxs"}>
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </DeleteDialog>
    </div>
  );
};

const RenderContent = ({
  audioSrc,
  question,
  body,
}: {
  audioSrc?: string;
  question?: string;
  body?: string;
}) => {
  if (audioSrc)
    return <audio src={"https://app.goodali.mn/api/v1" + audioSrc} />;

  if (question)
    return (
      <p className="m-0 truncate max-w-64">
        Q: {removeHTML(question).slice(0, 100)}
      </p>
    );

  if (body)
    return (
      <p className="m-0 truncate max-w-64">
        html:{" "}
        <span className="opacity-70">{removeHTML(body).slice(0, 100)}</span>
      </p>
    );

  return null;
};

export const itemColumns: ColumnDef<TaskItemType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <div className="px-1 py-2">{row.original.id}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div
          className="px-1 py-2"
          dangerouslySetInnerHTML={{
            __html: taskTypeNameArr[row.original.type] ?? "Unknown",
          }}
        />
      );
    },
  },
  {
    id: "content",
    header: "Content",
    cell: ({ row }) => {
      const isAudio =
        row.original.listen_audio && isPath(row.original.listen_audio);
      const withBanner =
        row.original.banner &&
        (isPath(row.original.banner) || isUri(row.original.banner));

      return (
        <div className="flex items-center gap-2">
          {withBanner && (
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
          {row.original.video_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://img.youtube.com/vi/${row.original.video_url}/0.jpg`}
              alt=""
              className="rounded-md w-[62px] aspect-video object-cover"
            />
          )}
          <RenderContent
            body={row.original.body}
            question={row.original.question}
            audioSrc={isAudio ? row.original.listen_audio : undefined}
          />
        </div>
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
    id: "isAnswer",
    header: "Can answer",
    cell: ({ row }) =>
      ({ 1: "Yes", 0: "No" }[row.original.is_answer] ?? "Unknown"),
  },
  {
    id: "actions",
    cell: Action,
  },
];
