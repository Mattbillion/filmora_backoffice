"use client";

import { getTrainings } from "@/app/(dashboard)/trainings/actions";
import { TrainingItemType } from "@/app/(dashboard)/trainings/schema";
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
export function TrainingField({ control }: { control: any }) {
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState<TrainingItemType[]>([]);

  useEffect(() => {
    setLoading(true);
    getTrainings({ limit: 1000 })
      .then((c) => setTrainings(c.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FormField
      control={control}
      name="trainingId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Suggest training</FormLabel>
          <Select
            disabled={loading}
            onValueChange={(value) => field.onChange(Number(value))}
            defaultValue={field.value ? field.value.toString() : undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a training" />
              </SelectTrigger>
            </FormControl>
            <SelectContent defaultValue="0">
              {trainings.map((c, idx) => (
                <SelectItem value={c.id.toString()} key={idx}>
                  {c.name}
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
