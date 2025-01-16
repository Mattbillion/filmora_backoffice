import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { SearchParams } from "@/lib/fetch/types";
import { getArticles } from "./actions";
import { artcileColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./components";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Article(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const { data } = await getArticles(searchParams);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Magazine Articles (${
            data?.pagination?.total ?? data?.data?.length
          })`}
        />
        <CreateDialog magazineId={Number(searchParams?.magazineId)}>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateDialog>
      </div>
      <Separator />
      <Suspense fallback="Loading...">
        <DataTable
          searchKey="title"
          columns={artcileColumns}
          data={data?.data}
          pageNumber={data?.pagination?.nextPage - 1}
          pageCount={data?.pagination?.pageCount}
        />
      </Suspense>
    </>
  );
}
