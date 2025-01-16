import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { getTasks } from "./actions";
import { itemColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./components";
import { getTraining } from "../actions";
import { getItem } from "../items/actions";
import Link from "next/link";
import { getLesson } from "../lessons/actions";

export const dynamic = "force-dynamic";

export default async function Lesson(props: {
  searchParams?: Promise<Record<"lessonId" | "itemId" | "trainingId", string>>;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getTasks({ lessonId: searchParams?.lessonId });
  const { data: trainingData } = searchParams?.trainingId
    ? await getTraining(searchParams?.trainingId)
    : { data: null };
  const { data: itemData } = searchParams?.itemId
    ? await getItem(searchParams?.itemId)
    : { data: null };
  const { data: lessonData } = searchParams?.lessonId
    ? await getLesson(searchParams?.lessonId)
    : { data: null };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Tasks (${data?.pagination?.total ?? data?.data?.length})`}
          description={
            <>
              <Link
                href={`/trainings/items?trainingId=${searchParams?.trainingId}`}
              >
                Training: {trainingData?.data?.name}
              </Link>
              <Link
                href={`/trainings/lessons?trainingId=${searchParams?.trainingId}&itemId=${searchParams?.itemId}`}
              >
                , Item: {itemData?.data?.name}
              </Link>
              , Lesson: {lessonData?.data?.name}
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
        columns={itemColumns}
        data={data?.data}
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}
