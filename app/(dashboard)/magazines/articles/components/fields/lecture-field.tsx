"use client";

import { getLectures } from "@/app/(dashboard)/albums/lectures/actions";
import { LectureItemType } from "@/app/(dashboard)/albums/lectures/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LectureField({ control }: { control: any }) {
  const [loading, setLoading] = useState(false);
  const [lectures, setLectures] = useState<LectureItemType[]>([]);

  useEffect(() => {
    setLoading(true);
    getLectures({ limit: 1000 })
      .then((c) => setLectures(c.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FormField
      control={control}
      name="lectureId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Suggest lecture</FormLabel>
          <Select
            disabled={loading}
            onValueChange={(value) => field.onChange(Number(value))}
            defaultValue={field.value ? field.value.toString() : undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a lecture" />
              </SelectTrigger>
            </FormControl>
            <SelectContent defaultValue="0">
              {lectures.map((c, idx) => (
                <SelectItem value={c.id.toString()} key={idx}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
