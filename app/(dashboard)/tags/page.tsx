import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { CreateTagDialog, getTags } from "@/features/tags";
import { tagColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Tag() {
  const { data } = await getTags();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Tags (${data?.data?.length})`} />
        <CreateTagDialog>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateTagDialog>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={tagColumns}
        data={data?.data}
        hidePagination
      />
    </>
  );
}
