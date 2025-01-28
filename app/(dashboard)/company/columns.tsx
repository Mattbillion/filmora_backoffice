"use client";

import {CellContext, ColumnDef} from "@tanstack/react-table";
import {CompanyItemType} from "./schema";
import {useRef, useState} from "react";
import {
	DeleteDialog,
	DeleteDialogRef,
} from "@/components/custom/delete-dialog";
import {Button} from "@/components/ui/button";
import {Edit, Trash, ListMusic} from "lucide-react";
import {UpdateDialog} from "./components";
import {Badge} from "@/components/ui/badge";
import {deleteCompany} from "./actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {currencyFormat} from "@/lib/utils";

const Action = ({row}: CellContext<CompanyItemType, unknown>) => {
	const [loading, setLoading] = useState(false);
	const deleteDialogRef = useRef<DeleteDialogRef>(null);

	return (
		<div className="flex gap-4 justify-end me-2">
			<UpdateDialog
				initialData={row.original}
				key={JSON.stringify(row.original)}
			>
				<Button size={"cxs"} variant="outline">
					<Edit className="h-4 w-4"/> Edit
				</Button>
			</UpdateDialog>

			<DeleteDialog
				ref={deleteDialogRef}
				permissionSubject="companys"
				loading={loading}
				action={() => {
					setLoading(true);
					deleteCompany(row.original.id)
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
					<Trash className="h-4 w-4"/>
					Delete
				</Button>
			</DeleteDialog>
		</div>
	);
};

const ChildDatas = ({row}: CellContext<CompanyItemType, unknown>) => {
	const router = useRouter();

	return (
		<div className="flex gap-4 justify-end me-2">
			<Button
				size={"cxs"}
				variant="outline"
				type="button"
				onClick={() =>
					router.push(`/companys/lectures?companyId=${row.original.id}`)
				}
			>
				<ListMusic className="h-4 w-4"/> Lectures
			</Button>
		</div>
	);
};

export const companyColumns: ColumnDef<CompanyItemType>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({row}) => {
			return <div className="px-1 py-2">{row.original.id}</div>;
		},
	},
	{
		accessorKey: "title",
		header: "Title",
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({row}) => currencyFormat(row.original.price ?? 0),
	},
	{
		id: "order",
		header: "Order",
		cell: ({row}) => row.original.order,
	},
	{
		id: "tags",
		header: () => "Tag",
		cell: ({row}) => {
			const tags = row.original.tags || [];
			return (
				<>
					{tags
						.slice(0, 3)
						.map((e) => e.name)
						.join(", ")}
					{tags.length > 3 && (
						<Badge variant="secondary" className="ml-2">
							+{tags.length - 3}
						</Badge>
					)}
				</>
			);
		},
	},
	{
		id: "status",
		header: "Status",
		cell: ({row}) =>
			({2: "Hidden", 1: "Active", 0: "Inactive"}[row.original.status] ??
				"Unknown"),
	},
	{
		id: "lecture-list",
		cell: ChildDatas,
	},
	{
		id: "actions",
		cell: Action,
	},
];
