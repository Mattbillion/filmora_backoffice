import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import {
  CreateMagazineCategoryDialog,
  getMagazineCategories,
} from "@/features/magazine-category";
import { magazineCategoriesColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SearchParams } from "@/lib/fetch/types";

export const dynamic = "force-dynamic";

export default async function MagazineCategory(props: {
  searchParams?: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getMagazineCategories(searchParams);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Magazine Categories (${data?.data?.length})`} />
        <CreateMagazineCategoryDialog>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateMagazineCategoryDialog>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={magazineCategoriesColumns}
        data={data?.data}
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}
