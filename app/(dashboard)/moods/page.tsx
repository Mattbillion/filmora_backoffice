import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { SearchParams } from "@/lib/fetch/types";
import { getMoods } from "./actions";
import { moodColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./components";

export const dynamic = "force-dynamic";

export default async function Moods(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const { data } = await getMoods(searchParams);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Moods (${data?.pagination?.total ?? data?.data?.length})`}
        />
        <CreateDialog>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateDialog>
      </div>
      <Separator />
      <DataTable
        searchKey="title"
        columns={moodColumns}
        data={data?.data}
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}
