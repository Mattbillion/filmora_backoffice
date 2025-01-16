import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { getMoodLists } from "./actions";
import { moodListColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./components";
import { getMood } from "../actions";

export const dynamic = "force-dynamic";

export default async function MoodLists(props: {
  searchParams?: Promise<{ moodId: string }>;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getMoodLists(searchParams);
  const { data: moodData } = searchParams?.moodId
    ? await getMood(searchParams?.moodId)
    : { data: null };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Mood lists (${
            data?.pagination?.total ?? data?.data?.length
          })`}
          description={`Mood: ${moodData?.data?.title ?? "Unknown mood"}`}
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
        columns={moodListColumns}
        data={data?.data}
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}
