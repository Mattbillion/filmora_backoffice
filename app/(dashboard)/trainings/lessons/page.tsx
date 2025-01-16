import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { SearchParams } from "@/lib/fetch/types";
import { getLessons } from "./actions";
import { itemColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./components";
import { getTraining } from "../actions";
import { getItem } from "../items/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Lesson(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const { data } = await getLessons({ itemId: searchParams?.itemId });
  const { data: trainingData } = searchParams?.trainingId
    ? await getTraining(searchParams?.trainingId as string)
    : { data: null };
  const { data: itemData } = searchParams?.itemId
    ? await getItem(searchParams?.itemId as string)
    : { data: null };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Lessons (${data?.pagination?.total ?? data?.data?.length})`}
          description={
            <>
              <Link
                href={`/trainings/items?trainingId=${searchParams?.trainingId}`}
              >
                Training: {trainingData?.data?.name}
              </Link>
              , Item: {itemData?.data?.name}
            </>
          }
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
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}
