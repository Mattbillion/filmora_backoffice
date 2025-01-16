import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { SearchParams } from "@/lib/fetch/types";
import { getPackages } from "./actions";
import { packageColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./components";
import { getTraining } from "../actions";

export const dynamic = "force-dynamic";

export default async function Package(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const { data } = await getPackages(searchParams);
  const { data: trainingData } = searchParams?.trainingId
    ? await getTraining(searchParams?.trainingId as string)
    : { data: null };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Packages (${data?.pagination?.total ?? data?.data?.length})`}
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
        columns={packageColumns}
        data={data?.data}
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}
