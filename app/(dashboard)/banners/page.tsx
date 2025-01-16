import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { getBanners } from "./actions";
import { bannerColumns } from "./columns";
import { SearchParams } from "@/lib/fetch/types";
import { CreateDialog } from "./components";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Banner(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const { data } = await getBanners(searchParams);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Banners (${data?.pagination?.total || data?.data?.length})`}
        />
        <CreateDialog>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateDialog>
      </div>
      <Separator />
      <Suspense fallback="Loading">
        <DataTable
          searchKey="title"
          columns={bannerColumns}
          data={data.data}
          pageNumber={data.pagination?.nextPage - 1}
          pageCount={data.pagination?.pageCount}
        />
      </Suspense>
    </>
  );
}
