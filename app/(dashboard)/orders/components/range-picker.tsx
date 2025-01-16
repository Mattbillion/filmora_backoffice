"use client";

import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { objToQs } from "@/lib/utils";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getInitialDateRange } from "../actions";
import { useQueryString } from "@/hooks/use-query-string";

type DateRange = {
  from: Date;
  to: Date;
};

export function RangePicker() {
  const router = useRouter();
  const initialDates = getInitialDateRange();
  const { startDate, endDate, ...qsObj } = useQueryString<{
    startDate: string;
    endDate: string;
  }>(initialDates);
  const today = dayjs();

  const [date, setDate] = useState<DateRange>({
    from: dayjs(startDate).toDate(),
    to: dayjs(endDate).toDate(),
  });

  const presets = useMemo(() => {
    const isMonday = today.day() === 1;
    const isFirstOfMonth = today.date() === 1;

    return [
      !isMonday && {
        label: "This week",
        value: "this-week",
        dateRange: {
          from: today.startOf("week").toDate(),
          to: today.toDate(),
        },
      },
      {
        label: "Last week",
        value: "last-week",
        dateRange: {
          from: today.subtract(1, "week").startOf("week").toDate(),
          to: today.subtract(1, "week").endOf("week").toDate(),
        },
      },
      !isFirstOfMonth && {
        label: "This month",
        value: "this-month",
        dateRange: {
          from: today.startOf("month").toDate(),
          to: today.toDate(),
        },
      },
      {
        label: "Last month",
        value: "last-month",
        dateRange: {
          from: today.subtract(1, "month").startOf("month").toDate(),
          to: today.subtract(1, "month").endOf("month").toDate(),
        },
      },
    ].filter((c) => !!c);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {dayjs(date.from).format("YYYY-MM-DD")} -{" "}
                {dayjs(date.to).format("YYYY-MM-DD")}
              </>
            ) : (
              dayjs(date.from).format("YYYY-MM-DD")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from ?? new Date()}
          selected={date}
          fromMonth={new Date("2023-01-01")}
          toMonth={new Date()}
          disabled={(date) => date > new Date()}
          onSelect={(newDate) => setDate(newDate as DateRange)}
          numberOfMonths={2}
        />
        <Separator />
        <div className="flex items-center gap-2 justify-between p-3">
          <Select
            onValueChange={(value) => {
              const preset = presets.find((p) => p.value === value);
              if (preset) setDate(preset.dateRange);
            }}
            defaultValue={
              presets.find(({ dateRange: { from, to } }) => {
                if (!date) return undefined;

                return (
                  from.toISOString() === date.from.toISOString() &&
                  to.toISOString() === date.to?.toISOString()
                );
              })?.value
            }
            key={JSON.stringify(date)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset, idx) => (
                <SelectItem key={idx} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PopoverClose asChild>
            <Button
              type="button"
              size="sm"
              className="px-6"
              disabled={!date}
              onClick={() => {
                if (!date.to) return toast.error("Дуусах огноо сонгоно уу");
                router.replace(
                  `/orders?${objToQs({
                    ...(qsObj || {}),
                    page: 1,
                    startDate: dayjs(date.from).format("YYYY-MM-DD"),
                    endDate: dayjs(date.to).format("YYYY-MM-DD"),
                  })}`
                );
              }}
            >
              Filter
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
