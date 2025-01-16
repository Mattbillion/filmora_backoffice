import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { SearchParams } from "@/lib/fetch/types";
import { getItems } from "./actions";
import { itemColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./components";
import { getTraining } from "../actions";

export const dynamic = "force-dynamic";

export default async function Items(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const { data } = await getItems(searchParams);
  const { data: trainingData } = searchParams?.trainingId
    ? await getTraining(searchParams?.trainingId as string)
    : { data: null };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Items (${data?.data?.length})`}
          description={`Training: ${trainingData?.data?.name}`}
        />
        <CreateDialog>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateDialog>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={itemColumns}
        data={data?.data}
        hidePagination
      />
    </>
  );
}
