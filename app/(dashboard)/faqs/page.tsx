import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/custom/heading";
import { DataTable } from "@/components/ui/data-table";
import { getFaqs } from "./actions";
import { SearchParams } from "@/lib/fetch/types";
import { faqColumns } from "./columns";
import { CreateDialog } from "./components";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { auth } from "@/app/(auth)/auth";

export const dynamic = "force-dynamic";

export default async function Faq(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const { data } = await getFaqs(searchParams);
  // const session = await auth();

  // console.log(session);
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`FAQs (${data?.pagination?.total ?? data?.data?.length})`}
        />
        <CreateDialog>
          <Button className="text-xs md:text-sm">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </CreateDialog>
      </div>
      <Separator />
      <DataTable searchKey="question" columns={faqColumns} data={data.data} />
    </>
  );
}
