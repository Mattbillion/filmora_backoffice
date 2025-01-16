import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { getMoodItems } from "./actions";
import { moodItemColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateDialog } from "./components";
import { getMood } from "../actions";
import { getMoodListItem } from "../list/actions";

export const dynamic = "force-dynamic";

export default async function MoodItems(props: {
  searchParams?: Promise<{ moodId: string; moodListId: string }>;
}) {
  const { moodId, ...params } =
    (await props.searchParams) ||
    ({} as { moodId: string; moodListId: string });
  const { data } = await getMoodItems(params);
  const { data: moodData } = moodId ? await getMood(moodId) : { data: null };
  const { data: moodListData } = params?.moodListId
    ? await getMoodListItem(params?.moodListId)
    : { data: null };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Mood list items (${
            data?.pagination?.total ?? data?.data?.length
          })`}
          description={`Mood: ${
            moodData?.data?.title ?? "Unknown mood"
          }, List: ${moodListData?.data?.title ?? "Unknown mood"}`}
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
        columns={moodItemColumns}
        data={data?.data}
        pageNumber={data?.pagination?.nextPage - 1}
        pageCount={data?.pagination?.pageCount}
      />
    </>
  );
}
