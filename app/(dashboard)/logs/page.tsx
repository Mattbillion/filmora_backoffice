import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { logColumns } from "./columns";
import { getLogs, LogSearchParamsType } from "./actions";
import { RangePicker } from "./components/range-picker";
import { SelectAction } from "./components/action-select";
import { SelectTarget } from "./components/target-select";

export const dynamic = "force-dynamic";

export default async function Tag(props: {
  searchParams?: Promise<LogSearchParamsType>;
}) {
  const searchParams = await props.searchParams;
  const { data } = await getLogs(searchParams);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Activity logs (${data?.data?.length})`} />
      </div>
      <Separator />
      <div className="flex items-start justify-between gap-4">
        <RangePicker />
        <div className="flex items-start gap-4">
          <SelectAction />
          <SelectTarget />
        </div>
      </div>
      <DataTable columns={logColumns} data={data?.data} />
    </>
  );
}
