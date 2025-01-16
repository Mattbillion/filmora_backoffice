import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { getVideos } from "./actions";
import { videoColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./components";

export const dynamic = "force-dynamic";

export default async function Books(props: {
  searchParams?: Promise<{ albumId: string }>;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getVideos(searchParams);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Videos (${data?.pagination?.total ?? data?.data?.length})`}
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
        columns={videoColumns}
        data={data?.data}
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}
