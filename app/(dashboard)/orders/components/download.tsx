import { Button } from "@/components/ui/button";
import { downloadOrders, getInitialDateRange } from "../actions";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQueryString } from "@/hooks/use-query-string";

export function DownloadButton() {
  const initialDates = getInitialDateRange();
  const [loading, setLoading] = useState(false);
  const { startDate, endDate } = useQueryString<{
    startDate: string;
    endDate: string;
  }>(initialDates);

  return (
    <Button
      type="button"
      size="sm"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        downloadOrders({ endDate, startDate })
          .then((c) => window.open(c.data.url, "__blank"))
          .catch((c) => toast.error(c.message))
          .finally(() => setLoading(false));
      }}
    >
      {loading && <Loader2 size={24} className="animate-spin" />} Download as
      Excel
    </Button>
  );
}
